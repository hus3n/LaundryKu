import { WaBenefit, WaTemplateSample } from './types';

export const WA_BENEFITS: WaBenefit[] = [
  {
    title: 'Koneksi QR Mandiri (Rp 0 Bebas Pulsa Token)',
    description:
      'Terhubung langsung dengan nomor WhatsApp toko Anda via scan QR terenkripsi. Tidak perlu berlangganan WhatsApp Business Cloud API yang memotong Rp 400 - Rp 600 per pesan.',
    badge: '100% Gratis',
  },
  {
    title: 'Kirim Otomatis Saat Cucian Selesai',
    description:
      'Kasir cukup menekan satu tombol "Siap Diambil", sistem secara otomatis mengirimkan notifikasi ramah ke nomor pelanggan tanpa harus mengetik manual di HP.',
    badge: 'Otomatis Real-Time',
  },
  {
    title: 'Nota Struk Digital Gambar & PDF',
    description:
      'Kirim bukti transaksi berformat gambar (.png) atau dokumen PDF langsung ke chat WA pelanggan. Lebih hemat kertas struk dan ramah lingkungan.',
    badge: 'Paperless',
  },
  {
    title: 'Pengingat Otomatis Cucian Menumpuk',
    description:
      'Fitur broadcast pengingat ramah untuk pelanggan yang belum mengambil cuciannya selama lebih dari 3 hari, mencegah rak outlet penuh sesak.',
    badge: 'Anti Menumpuk',
  },
];

export const WA_TEMPLATES: WaTemplateSample[] = [
  {
    title: 'Pesanan Diterima (Nota Masuk)',
    event: 'Saat kasir membuat nota baru di POS',
    recipient: 'Pelanggan',
    messageText:
      'Halo Kak Budi! 👋\nTerima kasih telah mencuci di *Berkah Laundry*.\nPesanan Anda telah kami terima:\n📋 No. Nota: *LK-2026-0891*\n⚖️ Layanan: Cuci Kering Setrika (3.50 kg)\n💰 Total: Rp 28.000 (Lunas)\n🕒 Estimasi Selesai: Besok, 17:00 WIB\n\nKami akan mengabari kembali jika cucian Anda sudah selesai.',
  },
  {
    title: 'Cucian Selesai & Siap Diambil',
    event: 'Saat status diubah menjadi "Siap Diambil"',
    recipient: 'Pelanggan',
    messageText:
      'Kabar gembira Kak Budi! 🎉\nCucian Anda dengan No. Nota *LK-2026-0891* sudah selesai, wangi, dan rapi disetrika ✨.\n\nSilakan diambil di outlet kami:\n📍 Berkah Laundry - Jl. Mawar No. 12\n\nTerima kasih!',
  },
  {
    title: 'Pengingat Pengambilan Cucian',
    event: 'Saat cucian mengendap > 3 hari',
    recipient: 'Pelanggan',
    messageText:
      'Halo Kak Budi, pengingat ramah dari *Berkah Laundry* 😊.\nCucian Anda No. Nota *LK-2026-0891* masih tersimpan rapi di rak kami dan siap untuk diambil kapan saja. Ditunggu ya Kak!',
  },
];
