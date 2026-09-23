import { TermsSection, TermsMeta } from './types';

export const TERMS_META: TermsMeta = {
  lastUpdated: 'September 2026',
  documentVersion: '1.2 (SaaS Cloud)',
  jurisdiction: 'Republik Indonesia',
  title: 'Syarat dan Ketentuan Layanan',
  subtitle:
    'Harap baca syarat dan ketentuan ini secara cermat sebelum mendaftarkan akun atau menggunakan platform kasir POS dan sistem manajemen usaha LaundryKu.',
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    number: 1,
    title: 'Definisi & Ketentuan Umum',
    intro: 'Dalam Perjanjian ini, istilah-istilah berikut memiliki arti:',
    items: [
      '"LaundryKu" merujuk pada platform perangkat lunak berbasis cloud (SaaS) yang menyediakan fitur kasir (POS), pencatatan nota, analitik transaksi, dan notifikasi WhatsApp otomatis.',
      '"Pengguna" / "Pemilik Toko" merujuk pada individu atau badan usaha yang mendaftar dan mengelola outlet laundry melalui platform LaundryKu.',
      '"Karyawan / Kasir" merujuk pada staf yang diberikan hak akses oleh Pemilik Toko untuk mengoperasikan kasir dan proses cuci.',
      '"Pelanggan Akhir" merujuk pada konsumen yang menggunakan jasa pencucian pakaian di toko Pengguna.',
    ],
  },
  {
    number: 2,
    title: 'Pendaftaran Akun & Kredensial',
    intro:
      'Untuk menggunakan LaundryKu, Pengguna wajib memberikan informasi yang akurat, lengkap, dan terkini saat pendaftaran. Pengguna bertanggung jawab penuh atas:',
    items: [
      'Menjaga kerahasiaan kata sandi (password) dan token sesi akun toko.',
      'Aktivitas operasional yang dilakukan oleh kasir atau karyawan di bawah akun outlet Anda.',
      'Segera memberi tahu tim dukungan LaundryKu jika terjadi indikasi penyalahgunaan atau akses tanpa izin.',
    ],
  },
  {
    number: 3,
    title: 'Masa Percobaan (Trial 30 Hari) & Langganan Berbayar',
    intro:
      'LaundryKu menyediakan opsi uji coba gratis (Trial) selama 30 hari kalender dengan akses fitur lengkap. Setelah masa trial berakhir:',
    items: [
      'Pengguna dapat melanjutkan langganan melalui paket resmi (Starter 1 Bulan, Pro 6 Bulan, atau Enterprise 1 Tahun).',
      'Biaya berlangganan bersifat flat sesuai durasi yang dipilih dan tanpa potongan komisi per transaksi nota.',
      'Jika masa aktif habis dan belum diperpanjang, akses operasional toko akan ditangguhkan sementara hingga pembayaran perpanjangan diverifikasi, namun data riwayat transaksi tetap aman tersimpan.',
    ],
  },
  {
    number: 4,
    title: 'Integrasi WhatsApp & Kebijakan Anti-Spam',
    intro:
      'Fitur notifikasi WhatsApp dirancang khusus untuk mempermudah komunikasi status cucian dan nota digital ke pelanggan sah toko Anda:',
    items: [
      'Pengguna dilarang keras menyalahgunakan integrasi WhatsApp untuk pengiriman pesan spam, promosi massal tanpa izin penerima, konten perjudian, pinjaman ilegal, atau konten yang melanggar hukum RI.',
      'LaundryKu tidak memungut biaya per pesan WhatsApp yang terkirim. Ketersediaan layanan WhatsApp tunduk pada regulasi dan kebijakan resmi platform Meta / WhatsApp.',
    ],
  },
  {
    number: 5,
    title: 'Hak Kepemilikan Data Pengguna (Data Ownership)',
    intro:
      'Seluruh data pelanggan, daftar paket layanan, riwayat order cucian, dan laporan keuangan toko adalah hak milik mutlak Pengguna. LaundryKu tidak memperjualbelikan, membagikan, atau menyalahgunakan data bisnis Anda kepada pihak ketiga manapun.',
  },
  {
    number: 6,
    title: 'Backup Otomatis & Keandalan Sistem (SLA)',
    intro: 'LaundryKu berkomitmen menjaga ketersediaan sistem hingga 99.5% uptime:',
    items: [
      'Sistem dilengkapi auto-backup database berkala ke saluran privat Telegram untuk perlindungan ganda terhadap kehilangan data.',
      'Pemeliharaan rutin terjadwal akan diumumkan terlebih dahulu kepada pengguna untuk meminimalkan gangguan pada jam sibuk operasional.',
    ],
  },
  {
    number: 7,
    title: 'Batasan Tanggung Jawab (Disclaimer)',
    intro:
      'LaundryKu menyediakan perangkat lunak kasir dan manajemen sebagaimana adanya. LaundryKu tidak bertanggung jawab atas kerugian operasional yang timbul akibat kelalaian internal toko, kehilangan barang cucian pelanggan fisik, atau force majeure.',
  },
];
