import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { WASession } from '../models-nosql/waSession.model.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { renderTemplate, ensureDefaultTemplates, DEFAULT_TEMPLATES } from './templates.js';
import { waQueue } from './messageQueue.js';
import { prisma } from '../config/database.js';
import { isMongoConnected } from '../config/mongodb.js';

interface ActiveSession {
  socket?: WASocket;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  qrCode?: string;
  phoneConnected?: string;
}

const activeSessions: Record<string, ActiveSession> = {};
const SESSIONS_DIR = path.resolve(process.cwd(), 'wa-sessions');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

export function isWAConnected(adminId: string): boolean {
  const active = activeSessions[adminId];
  return active?.status === 'CONNECTED';
}

export async function getWASessionStatus(adminId: string) {
  let active = activeSessions[adminId];

  // Auto-reconnect if session folder on disk contains creds.json
  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  const credsFile = path.join(sessionAuthDir, 'creds.json');

  if (!active && fs.existsSync(credsFile)) {
    activeSessions[adminId] = { status: 'CONNECTING' };
    initiateWAPairing(adminId).catch((e) => console.error('Auto WA reconnect failed:', e.message));
    active = activeSessions[adminId];
  }

  if (active) {
    return {
      adminId,
      status: active.status,
      qrCode: active.qrCode,
      phoneConnected: active.phoneConnected,
      pendingQueueCount: waQueue.getPendingCount(adminId),
    };
  }

  if (!isMongoConnected()) {
    return {
      adminId,
      status: 'DISCONNECTED',
      qrCode: undefined,
      phoneConnected: undefined,
      pendingQueueCount: waQueue.getPendingCount(adminId),
    };
  }

  try {
    let session = await WASession.findOne({ adminId }).exec();
    if (!session) {
      session = await WASession.create({ adminId, status: 'DISCONNECTED' });
      await ensureDefaultTemplates(adminId);
    }
    return {
      adminId,
      status: session.status,
      qrCode: session.qrCode,
      phoneConnected: session.phoneConnected,
      pendingQueueCount: waQueue.getPendingCount(adminId),
    };
  } catch (e) {
    return {
      adminId,
      status: 'DISCONNECTED',
      qrCode: undefined,
      phoneConnected: undefined,
      pendingQueueCount: waQueue.getPendingCount(adminId),
    };
  }
}

export async function initiateWAPairing(adminId: string) {
  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  if (!fs.existsSync(sessionAuthDir)) {
    fs.mkdirSync(sessionAuthDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionAuthDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    defaultQueryTimeoutMs: 60000,
  });

  activeSessions[adminId] = {
    socket: sock,
    status: 'CONNECTING',
  };

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const qrDataUrl = await QRCode.toDataURL(qr);
        activeSessions[adminId].qrCode = qrDataUrl;
        activeSessions[adminId].status = 'CONNECTING';

        try {
          if (isMongoConnected()) {
            await WASession.findOneAndUpdate(
              { adminId },
              { status: 'CONNECTING', qrCode: qrDataUrl },
              { upsert: true }
            );
          }
        } catch (e) {}
      } catch (err) {
        console.error('Error generating QR Data URL:', err);
      }
    }

    if (connection === 'open') {
      const userPhone = sock.user?.id ? sock.user.id.split(':')[0] : 'Connected';
      activeSessions[adminId].status = 'CONNECTED';
      activeSessions[adminId].phoneConnected = userPhone;
      activeSessions[adminId].qrCode = undefined;

      console.log(`✅ WhatsApp Connected for admin ${adminId} (${userPhone})`);
      waQueue.triggerQueue();

      try {
        if (isMongoConnected()) {
          await WASession.findOneAndUpdate(
            { adminId },
            { status: 'CONNECTED', phoneConnected: userPhone, qrCode: undefined },
            { upsert: true }
          );
        }
      } catch (e) {}
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`⚠️ WhatsApp connection closed for ${adminId}. Reason code: ${statusCode}`);

      if (shouldReconnect) {
        console.log(`🔄 Reconnecting WhatsApp for ${adminId}...`);
        initiateWAPairing(adminId);
      } else {
        console.log(`❌ WhatsApp logged out for ${adminId}`);
        activeSessions[adminId] = { status: 'DISCONNECTED' };

        // Clean auth dir
        if (fs.existsSync(sessionAuthDir)) {
          fs.rmSync(sessionAuthDir, { recursive: true, force: true });
        }

        try {
          if (isMongoConnected()) {
            await WASession.findOneAndUpdate(
              { adminId },
              { status: 'DISCONNECTED', qrCode: undefined, phoneConnected: undefined },
              { upsert: true }
            );
          }
        } catch (e) {}
      }
    }
  });

  // Listener for incoming customer messages (Auto-Reply Bot for Order Status Check)
  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (m.type !== 'notify') return;

      for (const msg of m.messages) {
        if (msg.key.fromMe || !msg.message || msg.key.remoteJid === 'status@broadcast') continue;

        const rawText = (
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          ''
        ).trim();

        if (!rawText) continue;

        const textLower = rawText.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        const digitsOnly = rawText.replace(/[^0-9]/g, '');

        // Extract sender phone number from JID (e.g. 6281234567890@s.whatsapp.net -> 081234567890)
        const senderPhoneRaw = msg.key.remoteJid?.split('@')[0] || '';
        let senderPhoneClean = senderPhoneRaw.replace(/[^0-9]/g, '');
        if (senderPhoneClean.startsWith('62')) {
          senderPhoneClean = '0' + senderPhoneClean.slice(2);
        }

        let order: any = null;

        // Strategy 1: Full or partial match for explicit LK order numbers (e.g. LK-20260807-001, LK001, LK 001)
        const lkMatch = rawText.match(/LK-?\d{8}-?\d{3}/i) || rawText.match(/LK-?[0-9]+/i);
        if (lkMatch) {
          const searchStr = lkMatch[0].replace('#', '').trim();
          order = await prisma.laundryOrder.findFirst({
            where: {
              adminId,
              orderNumber: { contains: searchStr, mode: 'insensitive' } as any,
            },
            include: { customer: true, items: { include: { package: true, category: true } } },
            orderBy: { createdAt: 'desc' },
          });
        }

        // Strategy 2: Flexible digit matching (e.g. customer types "001", "1", "nota 001", "lk 001")
        if (!order && digitsOnly.length >= 1 && digitsOnly.length <= 8) {
          const paddedDigits = digitsOnly.padStart(3, '0'); // e.g. "1" -> "001"
          order = await prisma.laundryOrder.findFirst({
            where: {
              adminId,
              OR: [
                { orderNumber: { endsWith: digitsOnly } },
                { orderNumber: { endsWith: paddedDigits } },
                { orderNumber: { contains: digitsOnly, mode: 'insensitive' } as any },
              ],
            },
            include: { customer: true, items: { include: { package: true, category: true } } },
            orderBy: { createdAt: 'desc' },
          });
        }

        // Strategy 3: General keyword check ("cek", "status", "nota", "cucian", "halo", "p") -> find active order by sender's WA phone!
        if (
          !order &&
          senderPhoneClean.length >= 8 &&
          (textLower.includes('cek') ||
            textLower.includes('status') ||
            textLower.includes('nota') ||
            textLower.includes('cucian') ||
            textLower.includes('halo') ||
            textLower.includes('p') ||
            textLower.includes('laundry'))
        ) {
          order = await prisma.laundryOrder.findFirst({
            where: {
              adminId,
              customer: {
                phone: { contains: senderPhoneClean.slice(-8) }, // Match last 8 digits of phone
              },
            },
            include: { customer: true, items: { include: { package: true, category: true } } },
            orderBy: { createdAt: 'desc' },
          });
        }

        if (order) {
          console.log(`🤖 Auto-reply status triggered for order #${order.orderNumber} to ${msg.key.remoteJid}`);

          const adminStore = await prisma.admin.findUnique({ where: { id: adminId } });

          const itemsDetail = order.items
            ?.map(
              (i: any) =>
                `• ${i.package?.name || 'Paket'} (${i.category?.name || 'Reguler'}): ${i.quantity} ${i.package?.unit || 'Kg'} x Rp ${Number(i.price).toLocaleString('id-ID')} = Rp ${Number(i.subtotal).toLocaleString('id-ID')}`
            )
            .join('\n') || '-';

          const statusLabels: Record<string, string> = {
            RECEIVED: '📥 Diterima (Dalam Antrean Processing)',
            IN_PROGRESS: '🧼 Sedang Diproses / Dicuci Rapi',
            DONE: '✅ Selesai & Rapi (Siap Diambil di Toko)',
            PICKED_UP: '🤝 Sudah Diambil (Transaksi Selesai)',
          };

          const statusText = statusLabels[order.status] || order.status;
          const paymentText = order.paymentStatus === 'PAID' ? 'LUNAS ✅' : 'BELUM BAYAR ⚠️';

          const replyMessage = `🤖 *INFO STATUS CUCIAN AUTOMATIS* 🤖

Halo Kak *${order.customer?.name || 'Pelanggan'}*! 👋😊
Berikut adalah informasi rincian status cucian Anda di *${adminStore?.storeName || 'LaundryKu'}*:

━━━━━━━━━━━━━━━━━━
📄 *NO. NOTA*: #${order.orderNumber}
🗓️ *TANGGAL MASUK*: ${new Date(order.dateIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
⏳ *ESTIMASI SELESAI*: ${order.estimatedDone ? new Date(order.estimatedDone).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
📌 *STATUS TERKINI*: *${statusText}*
━━━━━━━━━━━━━━━━━━

📦 *RINCIAN PAKET & HARGA*:
${itemsDetail}

💳 *TOTAL TAGIHAN*: Rp ${Number(order.totalPrice).toLocaleString('id-ID')}
🏷️ *STATUS BAYAR*: *${paymentText}*
${order.notes ? `📝 *CATATAN*: ${order.notes}\n` : ''}
📍 *Alamat Toko*: ${adminStore?.storeAddress || '-'}
📞 *Telepon Toko*: ${adminStore?.storePhone || '-'}

Terima kasih telah mempercayakan pakaian Anda kepada kami! Jika ada pertanyaan lebih lanjut, silakan balas pesan ini. 🙏😊`;

          if (msg.key.remoteJid) {
            await sock.sendMessage(msg.key.remoteJid, { text: replyMessage });
          }
        }
      }
    } catch (err: any) {
      console.error('Error handling incoming WA auto-reply:', err.message);
    }
  });

  return new Promise<{ status: string; qrCode?: string }>((resolve) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const current = activeSessions[adminId];
      if (current?.qrCode || current?.status === 'CONNECTED' || attempts >= 15) {
        clearInterval(interval);
        resolve({
          status: current?.status || 'CONNECTING',
          qrCode: current?.qrCode,
        });
      }
    }, 500);
  });
}

export async function sendRealWAMessage(adminId: string, phone: string, message: string) {
  const active = activeSessions[adminId];
  let formattedPhone = phone.replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }
  const jid = `${formattedPhone}@s.whatsapp.net`;

  if (active?.socket && active.status === 'CONNECTED') {
    await active.socket.sendMessage(jid, { text: message });
    console.log(`📱 Real Baileys WA sent to ${formattedPhone}`);
    return true;
  } else {
    console.log(`ℹ️ Socket not connected for ${adminId}, message queued in simulation mode.`);
    return false;
  }
}

export async function disconnectWASession(adminId: string) {
  const active = activeSessions[adminId];
  if (active?.socket) {
    try {
      await active.socket.logout();
    } catch (e) {}
  }

  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  if (fs.existsSync(sessionAuthDir)) {
    fs.rmSync(sessionAuthDir, { recursive: true, force: true });
  }

  activeSessions[adminId] = { status: 'DISCONNECTED' };

  try {
    if (isMongoConnected()) {
      await WASession.findOneAndUpdate(
        { adminId },
        { status: 'DISCONNECTED', qrCode: undefined, phoneConnected: undefined }
      );
    }
  } catch (e) {}

  return true;
}

export async function sendOrderWANotification(
  adminId: string,
  order: any,
  type: 'ORDER_RECEIVED' | 'ORDER_IN_PROGRESS' | 'ORDER_DONE' | 'ORDER_PICKED_UP'
) {
  try {
    let templateContent = DEFAULT_TEMPLATES[type]?.content || '';

    if (isMongoConnected()) {
      try {
        await ensureDefaultTemplates(adminId);
        const template = await WATemplate.findOne({ adminId, type }).exec();
        if (template && template.content) {
          templateContent = template.content;
        }
      } catch (e) {}
    }

    if (!templateContent) return;

    const adminStore = await prisma.admin.findUnique({ where: { id: adminId } });

    const itemsDetail = order.items
      ?.map(
        (i: any) =>
          `• ${i.package?.name || 'Paket'} (${i.category?.name || 'Reguler'}): ${i.quantity} ${i.package?.unit || 'Kg'} x Rp ${Number(i.price).toLocaleString('id-ID')} = Rp ${Number(i.subtotal).toLocaleString('id-ID')}`
      )
      .join('\n');

    const statusLabels: Record<string, string> = {
      RECEIVED: '📥 Diterima (Dalam Antrean Processing)',
      IN_PROGRESS: '🧼 Sedang Diproses / Dicuci Rapi',
      DONE: '✅ Selesai & Rapi (Siap Diambil di Toko)',
      PICKED_UP: '🤝 Sudah Diambil (Transaksi Selesai)',
    };

    const vars = {
      nama_pelanggan: order.customer?.name || 'Pelanggan',
      no_nota: order.orderNumber,
      detail_item: itemsDetail || '-',
      total_harga: Number(order.totalPrice).toLocaleString('id-ID'),
      status_bayar: order.paymentStatus === 'PAID' ? 'LUNAS ✅' : 'BELUM BAYAR ⚠️',
      status_cucian: statusLabels[order.status] || order.status,
      tanggal_masuk: new Date(order.dateIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      estimasi_selesai: order.estimatedDone
        ? new Date(order.estimatedDone).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : '-',
      nama_toko: adminStore?.storeName || 'LaundryKu',
      alamat_toko: adminStore?.storeAddress || '-',
      telepon_toko: adminStore?.storePhone || '-',
    };

    const messageText = renderTemplate(templateContent, vars);

    waQueue.enqueue({
      adminId,
      recipientPhone: order.customer?.phone || '',
      recipientName: order.customer?.name || 'Pelanggan',
      message: messageText,
    });
  } catch (e) {
    // Fail-safe wrapper
  }
}

export async function confirmWAPairingSimulated(adminId: string, phone: string) {
  activeSessions[adminId] = {
    status: 'CONNECTED',
    phoneConnected: phone,
    qrCode: undefined,
  };

  try {
    if (isMongoConnected()) {
      await WASession.findOneAndUpdate(
        { adminId },
        { status: 'CONNECTED', phoneConnected: phone, qrCode: null as any },
        { upsert: true }
      );
    }
  } catch (e) {}

  return {
    status: 'CONNECTED',
    phoneConnected: phone,
  };
}
