import fs from 'fs';
import path from 'path';
import os from 'os';
import { WASocket } from '@whiskeysockets/baileys';
import { prisma } from '../config/database.js';
import { isMongoConnected } from '../config/mongodb.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { renderTemplate, ensureDefaultTemplates, DEFAULT_TEMPLATES } from './templates.js';
import { waQueue } from './messageQueue.js';
import { generateNotaImage } from '../utils/generateNotaImage.js';
import { formatOrderForNota } from '../utils/formatOrderForNota.js';

export type OrderNotificationType = 'ORDER_RECEIVED' | 'ORDER_IN_PROGRESS' | 'ORDER_DONE' | 'ORDER_PICKED_UP';

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: '📥 Diterima (Dalam Antrean Processing)',
  IN_PROGRESS: '🧼 Sedang Diproses / Dicuci Rapi',
  DONE: '✅ Selesai & Rapi (Siap Diambil di Toko)',
  PICKED_UP: '🤝 Sudah Diambil (Transaksi Selesai)',
};

export async function sendOrderWANotification(
  adminId: string,
  order: any,
  type: OrderNotificationType
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

    const vars = {
      nama_pelanggan: order.customer?.name || 'Pelanggan',
      no_nota: order.orderNumber,
      detail_item: itemsDetail || '-',
      total_harga: Number(order.totalPrice).toLocaleString('id-ID'),
      status_bayar: order.paymentStatus === 'PAID' ? 'LUNAS ✅' : 'BELUM BAYAR ⚠️',
      status_cucian: STATUS_LABELS[order.status] || order.status,
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

export async function sendOrderWANotificationWithImage(
  adminId: string,
  order: any,
  type: OrderNotificationType,
  socket?: WASocket
): Promise<boolean> {
  try {
    if (!socket) {
      console.log(`ℹ️ WA socket not connected for ${adminId}, cannot send nota image.`);
      return false;
    }

    const adminStore = await prisma.admin.findUnique({ where: { id: adminId } });
    const notaData = formatOrderForNota(order, adminStore);
    const imageBuffer = await generateNotaImage(notaData);

    const tempPath = path.join(os.tmpdir(), `nota-${order.orderNumber}-${Date.now()}.png`);
    fs.writeFileSync(tempPath, imageBuffer);

    let formattedPhone = (order.customer?.phone || '').replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }
    if (!formattedPhone) {
      console.warn(`⚠️ No phone number for order ${order.orderNumber}, skipping WA image send.`);
      return false;
    }

    const jid = `${formattedPhone}@s.whatsapp.net`;

    const captions: Record<string, string> = {
      ORDER_RECEIVED: `🧺 Cucian Anda telah diterima!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_IN_PROGRESS: `🧼 Cucian Anda sedang diproses!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_DONE: `🎉 Cucian Anda SELESAI dan siap diambil!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_PICKED_UP: `✅ Terima kasih telah mengambil cucian!\nNota #${order.orderNumber}`,
    };

    await socket.sendMessage(jid, {
      image: { url: tempPath },
      caption: captions[type] || `Nota #${order.orderNumber}`,
      mimetype: 'image/png',
    });

    console.log(`🖼️ Nota image sent via WA to ${formattedPhone} for order #${order.orderNumber}`);

    try {
      fs.unlinkSync(tempPath);
    } catch {}

    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send nota image for ${order.orderNumber}:`, error.message);
    return false;
  }
}
