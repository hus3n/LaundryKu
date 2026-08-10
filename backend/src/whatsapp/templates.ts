import { WATemplate } from '../models-nosql/waTemplate.model.js';

export const DEFAULT_TEMPLATES = {
  ORDER_RECEIVED: {
    name: 'Cucian Masuk (Nota Digital)',
    content: `Halo Kak {{nama_pelanggan}} yang baik, 👋😊

Terima kasih banyak telah mempercayakan cucian Anda di *{{nama_toko}}*! 🧺✨

Berikut adalah rincian Nota Digital pesanan Anda:
━━━━━━━━━━━━━━━━━━
📄 *NO. NOTA*: #{{no_nota}}
🗓️ *TANGGAL MASUK*: {{tanggal_masuk}}
⏳ *ESTIMASI SELESAI*: {{estimasi_selesai}}
📌 *STATUS CUCIAN*: {{status_cucian}}
━━━━━━━━━━━━━━━━━━

📦 *RINCIAN PAKET & DAFTAR HARGA*:
{{detail_item}}

💳 *TOTAL TAGIHAN*: Rp {{total_harga}}
🏷️ *STATUS BAYAR*: *{{status_bayar}}*

📍 *Alamat Toko*: {{alamat_toko}}
📞 *Telepon Toko*: {{telepon_toko}}

💡 *CEK STATUS OTOMATIS*:
Kakak bisa membalas pesan ini kapan saja dengan mengetikkan nomor nota *{{no_nota}}* untuk mengecek perkembangan status cucian secara otomatis. 🤖

Semoga harimu menyenangkan! Jika ada pertanyaan, silakan balas pesan ini. 🙏`,
  },
  ORDER_IN_PROGRESS: {
    name: 'Cucian Sedang Diproses',
    content: `Halo Kak {{nama_pelanggan}}, 👋😊

Pemberitahuan dari *{{nama_toko}}*:
Cucian Kakak dengan No. Nota *#{{no_nota}}* saat ini *SEDANG DIPROSES / DICUCI* 🧼✨ oleh tim profesional kami.

━━━━━━━━━━━━━━━━━━
📄 *NO. NOTA*: #{{no_nota}}
📌 *STATUS TERKINI*: 🧼 *Sedang Diproses/Dicuci*
⏳ *ESTIMASI SELESAI*: {{estimasi_selesai}}
💳 *TOTAL TAGIHAN*: Rp {{total_harga}} ({{status_bayar}})
━━━━━━━━━━━━━━━━━━

📦 *Rincian Cucian*:
{{detail_item}}

Kami sedang memberikan perawatan terbaik untuk pakaian Kakak. Terima kasih atas kesabarannya! 🙏

💡 *CEK STATUS*: Balas pesan ini dengan *{{no_nota}}* untuk cek status terbaru kapan saja.`,
  },
  ORDER_DONE: {
    name: 'Cucian Selesai (Siap Diambil)',
    content: `Kabar Gembira Kak {{nama_pelanggan}}! 🎉🧺✨

Cucian Kakak dengan No. Nota *#{{no_nota}}* di *{{nama_toko}}* sudah *SELESAI DIBERSIHKAN & SIAP DIAMBIL*! 🌸👍

━━━━━━━━━━━━━━━━━━
📄 *NO. NOTA*: #{{no_nota}}
📌 *STATUS TERKINI*: ✅ *Selesai & Rapi (Siap Diambil)*
💳 *TOTAL TAGIHAN*: Rp {{total_harga}} (*{{status_bayar}}*)
━━━━━━━━━━━━━━━━━━

📦 *Detail Cucian*:
{{detail_item}}

📍 *Alamat Pengambilan*: {{alamat_toko}}

Silakan datang ke toko untuk mengambil cucian Kakak. Terima kasih banyak dan kami tunggu kedatangannya! 😊🙏`,
  },
  ORDER_PICKED_UP: {
    name: 'Cucian Sudah Diambil',
    content: `Terima Kasih Banyak Kak {{nama_pelanggan}}! 🙏😊✨

Cucian dengan No. Nota *#{{no_nota}}* telah berhasil diambil.

━━━━━━━━━━━━━━━━━━
📄 *NO. NOTA*: #{{no_nota}}
📌 *STATUS*: 🤝 *Sudah Diambil (Transaksi Selesai)*
💳 *TOTAL DIBAYAR*: Rp {{total_harga}} ({{status_bayar}})
━━━━━━━━━━━━━━━━━━

Terima kasih telah mempercayakan laundry pakaian Kakak kepada *{{nama_toko}}*. Semoga puas dengan pelayanan kami! Sampai jumpa di cucian berikutnya! 👋🧺`,
  },
};

export function renderTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
}

import { isMongoConnected } from '../config/mongodb.js';

export async function ensureDefaultTemplates(adminId: string) {
  if (!isMongoConnected()) return;
  try {
    const existingCount = await WATemplate.countDocuments({ adminId });
    if (existingCount === 0) {
      await WATemplate.create([
        {
          adminId,
          type: 'ORDER_RECEIVED',
          name: DEFAULT_TEMPLATES.ORDER_RECEIVED.name,
          content: DEFAULT_TEMPLATES.ORDER_RECEIVED.content,
          isDefault: true,
        },
        {
          adminId,
          type: 'ORDER_IN_PROGRESS',
          name: DEFAULT_TEMPLATES.ORDER_IN_PROGRESS.name,
          content: DEFAULT_TEMPLATES.ORDER_IN_PROGRESS.content,
          isDefault: true,
        },
        {
          adminId,
          type: 'ORDER_DONE',
          name: DEFAULT_TEMPLATES.ORDER_DONE.name,
          content: DEFAULT_TEMPLATES.ORDER_DONE.content,
          isDefault: true,
        },
        {
          adminId,
          type: 'ORDER_PICKED_UP',
          name: DEFAULT_TEMPLATES.ORDER_PICKED_UP.name,
          content: DEFAULT_TEMPLATES.ORDER_PICKED_UP.content,
          isDefault: true,
        },
      ]);
    }
  } catch (e) {
    // Skip if Mongo is offline in local dev
  }
}
