export interface PricingDurationDetail {
  price: string;
  period: string;
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  durations: {
    monthly: PricingDurationDetail;
    sixMonths?: PricingDurationDetail;
    yearly?: PricingDurationDetail;
  };
  description: string;
  isPopular: boolean;
  badgeText: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_PAGE_LINKS: FooterLink[] = [
  { label: 'Aplikasi Kasir Laundry', href: '/aplikasi-kasir-laundry' },
  { label: 'Notifikasi WA Otomatis', href: '/fitur/notifikasi-whatsapp-otomatis' },
  { label: 'Komparasi vs POS Retail', href: '/komparasi' },
  { label: 'Fitur Utama', href: '#features' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Paket Harga', href: '#pricing' },
  { label: 'Ulasan Mitra', href: '/reviews' },
  { label: 'Tanya Jawab (FAQ)', href: '#faq' },
];

export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { label: 'Syarat & Ketentuan Layanan', href: '/terms' },
  { label: 'Kebijakan Privasi Data', href: '/privacy' },
];

export const SUPERADMIN_WA_NUMBER = '6285229925593';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'single_outlet',
    name: 'Paket Tanpa Cabang',
    price: 'Rp 30.000',
    period: '/ bulan',
    durations: {
      monthly: { price: 'Rp 30.000', period: '/ bulan' },
      sixMonths: { price: 'Rp 180.000', period: '/ 6 bulan', badge: 'Prioritas' },
      yearly: { price: 'Rp 350.000', period: '/ tahun', badge: 'Paling Hemat' },
    },
    description: 'Solusi kasir hemat untuk 1 outlet toko laundry mandiri. Fitur kasir POS dan WhatsApp otomatis lengkap.',
    isPopular: false,
    badgeText: 'Mulai 30rb',
    features: [
      '1 Outlet Toko Laundry Mandiri',
      'Kasir POS Timbangan Desimal & Satuan',
      'Notifikasi WhatsApp Otomatis ke Pelanggan (Rp 0)',
      'Pencatatan Transaksi & Cetak Struk Bluetooth / PDF',
      'Laporan Omset & Analitik Grafik Harian',
      'Auto-Backup Database Rutin ke Telegram',
    ],
  },
  {
    id: 'unlimited_branch',
    name: 'Cabang & Karyawan Tak Terbatas',
    price: 'Rp 77.000',
    period: '/ bulan',
    durations: {
      monthly: { price: 'Rp 77.000', period: '/ bulan' },
      sixMonths: { price: 'Rp 440.000', period: '/ 6 bulan', badge: 'Prioritas' },
      yearly: { price: 'Rp 770.000', period: '/ tahun', badge: 'Hemat Maksimal' },
    },
    description: 'Pilihan terfavorit! Buka cabang dan tambah kasir/karyawan sebanyak apa pun tanpa biaya tambahan.',
    isPopular: true,
    badgeText: 'Terpopuler (Best Value)',
    features: [
      'Semua fitur Paket Tanpa Cabang',
      'Cabang / Outlet Toko Tak Terbatas (Unlimited)',
      'Manajemen Karyawan & Kasir Tanpa Batas',
      'Dashboard Multi-Outlet Konsolidasi Terpusat',
      'Prioritas Integrasi WhatsApp Bot Toko',
      'Dukungan Pendampingan Setup Awal Toko',
    ],
  },
  {
    id: 'enterprise',
    name: 'Paket Enterprise',
    price: 'Rp 300.000',
    period: '/ bulan',
    durations: {
      monthly: { price: 'Rp 300.000', period: '/ bulan', badge: 'Dedicated SLA' },
      sixMonths: { price: 'Rp 1.800.000', period: '/ 6 bulan' },
      yearly: { price: 'Rp 3.600.000', period: '/ tahun' },
    },
    description: 'Performa penuh untuk waralaba laundry besar dan korporasi dengan server khusus & VIP support.',
    isPopular: false,
    badgeText: 'Dedicated & Prioritas',
    features: [
      'Semua fitur Cabang & Karyawan Tak Terbatas',
      'Dedicated Server & Database Terisolasi',
      'Konsultasi Operasional & Custom Nota Struk',
      'Jaminan Uptime Platform SLA 99.9%',
      'Bantuan Migrasi Data dari Aplikasi Lama',
      'VIP Priority Support 24/7 & Dedicated Manager',
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
