export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular: boolean;
  badgeText: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SUPERADMIN_WA_NUMBER = '6285229925593';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Paket Starter 1 Bulan',
    price: 'Rp 99.000',
    period: '/ bulan',
    description: 'Solusi hemat untuk mencoba operasional digital usaha laundry Anda.',
    isPopular: false,
    badgeText: 'Coba Dulu',
    features: [
      'Akses Full Dashboard Admin & Kasir',
      'Notifikasi WhatsApp Otomatis ke Pelanggan',
      'Pencatatan Transaksi & Cetak Struk Nota',
      'Laporan Omset & Analitik Grafik Harian',
      'Support Teknis & Update Sistem',
    ],
  },
  {
    id: 'pro',
    name: 'Paket Pro 6 Bulan',
    price: 'Rp 499.000',
    period: '/ 6 bulan',
    description: 'Pilihan terfavorit pemilik laundry! Lebih hemat 15% dibanding bulanan.',
    isPopular: true,
    badgeText: 'Terpopuler (Hemat 15%)',
    features: [
      'Semua fitur Paket Starter',
      'Prioritas Integrasi WhatsApp Bot Toko',
      'Manajemen Karyawan & Kasir Tanpa Batas',
      'Auto-Backup Data berkala ke Telegram',
      'Dukungan Pendampingan Setup Awal Toko',
    ],
  },
  {
    id: 'enterprise',
    name: 'Paket Enterprise 1 Tahun',
    price: 'Rp 899.000',
    period: '/ 1 tahun',
    description: 'Hemat maksimal 25%! Performa penuh untuk usaha laundry berkembang.',
    isPopular: false,
    badgeText: 'Hemat 25%',
    features: [
      'Semua fitur Paket Pro (Full 12 Bulan)',
      'Konsultasi Operasional & Custom Nota Struk',
      'Jaminan Uptime Platform & Server Terisolasi',
      'Backup Otomatis Harian Database',
      'Bantuan Migrasi Data dari Aplikasi Lama',
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'Apa itu LaundryKu dan apa keunggulannya dibanding aplikasi kasir biasa?',
    answer:
      'LaundryKu adalah aplikasi kasir laundry (POS) dan software manajemen usaha laundry digital terpadu yang dirancang khusus untuk operasional laundry kiloan maupun satuan. Keunggulan utamanya mencakup notifikasi WhatsApp otomatis ke pelanggan saat cucian siap diambil, cetak nota struk kasir thermal bluetooth, laporan omset laba-rugi otomatis, dan auto-backup berkala ke Telegram.',
  },
  {
    question: 'Apakah ada biaya per pesan WhatsApp yang terkirim ke pelanggan?',
    answer:
      'Sama sekali TIDAK ADA biaya tersembunyi ataupun pulsa per pesan. LaundryKu menghubungkan WhatsApp toko Anda secara mandiri via scan QR, sehingga Anda dapat mengirim pesan notifikasi status cucian dan nota struk digital secara gratis tanpa batas.',
  },
  {
    question: 'Bisa dijalankan di perangkat apa saja? Apakah butuh komputer kasir khusus?',
    answer:
      'LaundryKu berbasis web cloud responsif. Anda bisa menggunakannya dari smartphone Android, iPhone, tablet iPad, laptop, hingga PC komputer kasir tanpa perlu membeli perangkat keras tambahan yang mahal.',
  },
  {
    question: 'Bagaimana cara cetak nota struk untuk pelanggan laundry?',
    answer:
      'LaundryKu mendukung pencetakan langsung ke printer thermal 58mm atau 80mm via Bluetooth maupun kabel USB. Selain itu, Anda juga dapat mengirimkan nota struk digital berformat gambar atau PDF langsung ke WhatsApp pelanggan hanya dengan satu klik.',
  },
  {
    question: 'Apakah data keuangan dan riwayat pesanan laundry aman?',
    answer:
      'Sangat aman. Sistem kami didukung database PostgreSQL terisolasi, enkripsi standar industri, serta fitur auto-backup berkala ke bot Telegram privat milik pemilik toko. Data omset dan pelanggan Anda terlindungi meski perangkat kasir rusak atau berganti HP.',
  },
  {
    question: 'Bagaimana cara mendaftar dan mulai menggunakan LaundryKu?',
    answer:
      'Pilih salah satu paket di atas, lalu hubungi SuperAdmin melalui WhatsApp di 0852-2992-5593. Tim kami akan menyiapkan akun toko Anda dan memberikan panduan penggunaan hingga kasir Anda siap beroperasi dalam hitungan menit.',
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const getWaRegisterUrl = (packageName?: string) => {
  const targetPackage = packageName ? ` (Tertarik: ${packageName})` : '';
  const waText = encodeURIComponent(
    `Halo SuperAdmin LaundryKu,\n\nSaya tertarik untuk mendaftar dan berlangganan aplikasi LaundryKu v1.0${targetPackage}. Mohon informasi dan bantuan pendaftarannya. Terima kasih!`
  );
  return `https://wa.me/${SUPERADMIN_WA_NUMBER}?text=${waText}`;
};
