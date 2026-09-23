import { PillarFeature, WorkflowStep, RoiMetric, PillarFaqItem } from './types';

export const PILLAR_FEATURES: PillarFeature[] = [
  {
    title: 'Penimbangan Kiloan Desimal Presisi',
    badge: 'Khusus Laundry',
    description:
      'Pencatatan timbangan akurat hingga 2 angka di belakang koma (misal: 3,45 kg atau 5,20 kg). Sistem otomatis menghitung total harga sesuai tarif per kilo tanpa pembulatan manual yang merugikan pelanggan atau toko.',
    benefits: [
      'Perhitungan otomatis tarif normal, kilat, atau express',
      'Mendukung item satuan (bedcover, karpet, jas, sepatu, tas)',
      'Pengelompokan rak penyimpanan dan parfum cucian',
    ],
    icon: 'scale',
  },
  {
    title: 'Notifikasi WhatsApp Otomatis (Rp 0 Bebas Token)',
    badge: 'Hemat Biaya',
    description:
      'Pelanggan otomatis menerima pesan WhatsApp saat cucian selesai dan siap diambil. Terhubung via scan QR terenkripsi mandiri, sehingga tidak memerlukan pulsa kredit atau biaya per template pesan.',
    benefits: [
      'Pesan status cucian selesai terkirim instan',
      'Pengingat otomatis untuk cucian yang belum diambil',
      'Kirim struk nota digital (.png / PDF) langsung ke chat',
    ],
    icon: 'whatsapp',
  },
  {
    title: 'Cetak Nota Thermal Bluetooth & Digital',
    badge: 'Fleksibel',
    description:
      'Cetak nota kasir fisik menggunakan printer thermal 58mm atau 80mm via koneksi Bluetooth HP/Tablet maupun USB komputer. Tersedia juga opsi paperless berupa nota digital langsung ke WA.',
    benefits: [
      'Kompatibel dengan printer thermal kasir murah di pasaran',
      'Kustomisasi header toko, alamat, dan nomor kontak nota',
      'Format nota rapi dengan QR code pelunasan',
    ],
    icon: 'printer',
  },
  {
    title: 'Laporan Finansial & Analitik Omset Real-Time',
    badge: 'Manajemen Keuangan',
    description:
      'Pantau omset harian, mingguan, dan bulanan secara langsung dari genggaman Anda. Analisis laba bersih setelah dikurangi pengeluaran operasional (deterjen, listrik, parfum, dan gaji).',
    benefits: [
      'Grafik omset harian dan rekap pergeseran kas',
      'Pencatatan beban pengeluaran kasir & toko terpadu',
      'Ekspor laporan lengkap ke Excel untuk pembukuan',
    ],
    icon: 'chart',
  },
  {
    title: 'Auto-Backup Otomatis ke Telegram Pemilik',
    badge: 'Proteksi Maksimal',
    description:
      'Perangkat kasir rawan terkena cipratan air atau jatuh. Fitur auto-backup LaundryKu secara berkala mengirimkan cadangan data transaksi ke bot Telegram privat milik pemilik toko.',
    benefits: [
      'Data aman terlindungi di cloud database PostgreSQL',
      'Cadangan terkirim otomatis ke akun Telegram privat',
      'Pemulihan data instan jika HP kasir berganti atau rusak',
    ],
    icon: 'shield',
  },
  {
    title: 'Multi-Role Hak Akses & Multi-Outlet',
    badge: 'Skalabilitas Bisnis',
    description:
      'Pemisahan hak akses yang ketat antara SuperAdmin, Pemilik Usaha (Admin), dan Staf Kasir/Karyawan. Mencegah kebocoran data laba bersih toko kepada karyawan kasir.',
    benefits: [
      'Kasir hanya dapat input order dan ubah status proses',
      'Owner memiliki akses eksklusif laporan keuangan & audit log',
      'Dukungan kelola beberapa cabang outlet dalam 1 akun',
    ],
    icon: 'users',
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: 'Input Pesanan & Timbang Pakaian',
    desc: 'Kasir memasukkan nomor telepon pelanggan, menimbang pakaian dengan akurasi desimal, dan memilih paket durasi.',
    detail: 'Jika pelanggan lama, data nama terisi otomatis. Nota otomatis terbit dengan ID unik.',
    durationTag: 'Waktu: < 30 detik',
  },
  {
    step: 2,
    title: 'Cetak Nota Struk atau Kirim Nota Digital',
    desc: 'Cetak struk ke printer thermal Bluetooth 58mm/80mm atau bagikan nota digital gambar langsung ke chat WhatsApp.',
    detail: 'Pelanggan menerima rincian jumlah kiloan, total biaya, dan estimasi waktu selesai.',
    durationTag: 'Waktu: Instan',
  },
  {
    step: 3,
    title: 'Proses Pengerjaan (Cuci -> Kering -> Setrika)',
    desc: 'Karyawan memperbarui status tahapan cucian secara berurutan sesuai alur kerja laundry.',
    detail: 'Seluruh staf dapat memantau pakaian mana yang mendekati batas waktu pengerjaan (SLA).',
    durationTag: 'Sesuai Paket (Reguler/Express)',
  },
  {
    step: 4,
    title: 'Notifikasi Otomatis Cucian Selesai',
    desc: 'Saat status diubah ke "Siap Diambil", sistem secara otomatis mengirimkan pesan WhatsApp ke pelanggan.',
    detail: 'Pelanggan langsung tahu pakaian sudah wangi, rapi, dan siap diambil tanpa perlu ditelepon.',
    durationTag: 'Otomatis 0 Rupiah',
  },
  {
    step: 5,
    title: 'Pengambilan & Rekap Pembukuan Otomatis',
    desc: 'Pelanggan melunasi sisa tagihan, mengambil pakaian, dan transaksi langsung terbukukan ke laporan omset.',
    detail: 'Laporan laba kotor dan arus kas kasir langsung terupdate secara real-time.',
    durationTag: 'Waktu: 10 detik',
  },
];

export const ROI_METRICS: RoiMetric[] = [
  {
    metric: 'Waktu Mengabari Pelanggan Selesai',
    manualValue: '1-2 jam / hari (Ketik WA manual satu per satu)',
    laundrykuValue: '0 detik (Otomatis terkirim dari sistem)',
    savings: 'Hemat 30-60 jam kerja staf / bulan',
  },
  {
    metric: 'Biaya Notifikasi WhatsApp',
    manualValue: 'Rp 400 - Rp 600 / pesan (POS API resmi)',
    laundrykuValue: 'Rp 0 (Koneksi QR Scan Mandiri)',
    savings: 'Hemat Rp 300rb - Rp 600rb / bulan',
  },
  {
    metric: 'Risiko Kehilangan Nota Fisik & Baju Tertukar',
    manualValue: 'Sering terjadi (Buku nota robek / basah)',
    laundrykuValue: '0% (Tersimpan aman di Cloud & Telegram)',
    savings: 'Mencegah ganti rugi baju pelanggan jutaan rupiah',
  },
  {
    metric: 'Waktu Rekapitulasi Kas & Pembukuan',
    manualValue: '30-45 menit tiap tutup toko',
    laundrykuValue: '1 klik (Otomatis terhitung di dashboard)',
    savings: 'Hemat 20 jam kerja pembukuan / bulan',
  },
];

export const PILLAR_FAQS: PillarFaqItem[] = [
  {
    question: 'Apa itu aplikasi kasir laundry dan mengapa berbeda dari kasir minimarket biasa?',
    answer:
      'Aplikasi kasir laundry adalah perangkat lunak Point of Sale (POS) dan manajemen yang dirancang khusus untuk alur bisnis jasa cuci pakaian. Berbeda dengan kasir retail umum di mana barang langsung lunas dan dibawa pulang, usaha laundry membutuhkan pencatatan penitipan baju, penimbangan desimal, durasi pengerjaan (reguler/kilat/express), rak penyimpanan, serta notifikasi otomatis saat cucian siap diambil.',
  },
  {
    question: 'Apakah LaundryKu bisa dijalankan dari HP Android kasir tanpa PC komputer?',
    answer:
      'Sangat bisa. LaundryKu berbasis web modern responsif (PWA) yang dapat diakses dengan lancar dari HP Android, iPhone, iPad, laptop, maupun tablet kasir tanpa memerlukan perangkat keras khusus.',
  },
  {
    question: 'Bagaimana cara menghubungkan printer thermal kasir?',
    answer:
      'LaundryKu mendukung printer kasir thermal ukuran 58mm dan 80mm yang umum digunakan. Anda cukup menghubungkan printer via Bluetooth smartphone atau kabel USB komputer untuk mencetak nota struk kasir.',
  },
  {
    question: 'Berapa biaya langganan aplikasi kasir LaundryKu?',
    answer:
      'LaundryKu menawarkan sistem langganan transparan flat rate: mulai Rp 99.000 untuk 1 bulan (Starter), Rp 499.000 untuk 6 bulan (Pro), dan Rp 899.000 untuk 1 tahun (Enterprise). Tidak ada potongan komisi penjualan per nota dan tidak ada biaya per pesan WhatsApp.',
  },
  {
    question: 'Apakah saya bisa mengelola beberapa cabang laundry (multi-outlet)?',
    answer:
      'Ya, LaundryKu mendukung manajemen multi-outlet. Anda dapat memantau pendapatan dan performa seluruh cabang toko laundry Anda dalam satu dashboard admin terpadu.',
  },
];
