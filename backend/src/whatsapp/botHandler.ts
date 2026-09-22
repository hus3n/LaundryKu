import { WASocket } from '@whiskeysockets/baileys';
import { prisma } from '../config/database.js';
import { isMongoConnected } from '../config/mongodb.js';
import { AutoReply } from '../models-nosql/autoReply.model.js';
import { BotConfig } from '../models-nosql/botConfig.model.js';
import { queryAiAssistant } from '../services/ai.service.js';

export async function handleIncomingMessagesUpsert(sock: WASocket, adminId: string, m: any) {
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
        const paddedDigits = digitsOnly.padStart(3, '0');
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
              phone: { contains: senderPhoneClean.slice(-8) },
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
      } else if (isMongoConnected()) {
        const autoReplies = await AutoReply.find({ adminId, isActive: true });
        let keywordReplied = false;

        for (const ar of autoReplies) {
          if (rawText.toLowerCase().includes(ar.keyword.toLowerCase())) {
            if (msg.key.remoteJid) {
              await sock.sendMessage(msg.key.remoteJid, { text: ar.reply });
            }
            keywordReplied = true;
            break;
          }
        }

        if (!keywordReplied) {
          const botConfig = await BotConfig.findOne({ adminId });

          if (botConfig?.isAiActive && botConfig.aiApiKey) {
            const aiRes = await queryAiAssistant({
              apiKey: botConfig.aiApiKey,
              provider: botConfig.aiProvider,
              baseUrl: botConfig.aiBaseUrl,
              model: botConfig.aiModel,
              systemPrompt: botConfig.aiSystemPrompt,
              userMessage: rawText,
            });

            if (aiRes.success && aiRes.reply && msg.key.remoteJid) {
              await sock.sendMessage(msg.key.remoteJid, { text: aiRes.reply });
              console.log(`🤖 AI replied via ${aiRes.providerUsed || 'custom'} (${aiRes.modelUsed}) to ${msg.key.remoteJid}`);
            }
          } else if (
            botConfig?.isGreetingActive &&
            botConfig.greetingMessage &&
            (textLower.includes('halo') ||
              textLower.includes('hai') ||
              textLower.includes('selamat') ||
              textLower.includes('pagi') ||
              textLower.includes('siang') ||
              textLower.includes('malam') ||
              textLower === 'p')
          ) {
            if (msg.key.remoteJid) {
              await sock.sendMessage(msg.key.remoteJid, { text: botConfig.greetingMessage });
            }
          }
        }
      }
    }
  } catch (err: any) {
    console.error('Error handling incoming WA auto-reply:', err.message);
  }
}
