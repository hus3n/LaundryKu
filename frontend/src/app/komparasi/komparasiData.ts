import { ComparisonCategory, BuyerCriterion, BuyerFaqItem } from './types';

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    categoryName: 'Operasional Kasir & Penimbangan',
    features: [
      {
        name: 'Timbangan Kiloan Desimal Akurat (contoh: 3,45 kg)',
        laundryku: 'yes',
        retailPos: 'partial',
        manualBook: 'yes',
        description: 'Perhitungan otomatis hingga pecahan gram tanpa pembulatan merugikan.',
        isHighlight: true,
      },
      {
        name: 'Dukungan Order Satuan (Bedcover, Jas, Sepatu, Tas)',
        laundryku: 'yes',
        retailPos: 'yes',
        manualBook: 'yes',
        description: 'Kategori khusus item non-kiloan dengan tarif satuan fleksibel.',
      },
      {
        name: 'Pilihan Durasi Pengerjaan (Reguler, Kilat, Express)',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'partial',
        description: 'Penetapan tarif berbeda dan estimasi jam selesai otomatis.',
        isHighlight: true,
      },
      {
        name: 'Alur Status Cucian (Antri -> Cuci -> Kering -> Setrika -> Siap)',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'no',
        description: 'Pelacakan tahapan proses cuci secara real-time antar staf.',
        isHighlight: true,
      },
    ],
  },
  {
    categoryName: 'Komunikasi & Notifikasi Pelanggan',
    features: [
      {
        name: 'Notifikasi WhatsApp Otomatis Cucian Selesai',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'no',
        description: 'Sistem otomatis kirim WA saat cucian selesai tanpa perlu mengetik manual.',
        isHighlight: true,
      },
      {
        name: 'Biaya Per Pesan WhatsApp',
        laundryku: 'Rp 0 (Gratis Tanpa Batas)',
        retailPos: 'Rp 300 - Rp 600 / pesan',
        manualBook: 'Gratis (Ketik HP Manual)',
        description: 'Koneksi QR scan mandiri tanpa kuota token berbayar.',
        isHighlight: true,
      },
      {
        name: 'Pengiriman Nota Digital (Gambar & PDF)',
        laundryku: 'yes',
        retailPos: 'partial',
        manualBook: 'no',
        description: 'Nota langsung tersimpan di chat WhatsApp pelanggan.',
      },
      {
        name: 'Pengingat Otomatis Cucian Belum Diambil',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'no',
        description: 'Mencegah tumpukan cucian mengendap berbulan-bulan di outlet.',
      },
    ],
  },
  {
    categoryName: 'Peralatan & Hardware',
    features: [
      {
        name: 'Cetak Nota Thermal Bluetooth & USB (58mm / 80mm)',
        laundryku: 'yes',
        retailPos: 'yes',
        manualBook: 'no',
        description: 'Kompatibel dengan aneka printer kasir murah di pasaran.',
      },
      {
        name: 'Dapat Digunakan di HP Android & iPhone Biasa',
        laundryku: 'yes',
        retailPos: 'partial',
        manualBook: 'yes',
        description: 'Cukup browser smartphone kasir tanpa wajib beli tablet khusus.',
      },
      {
        name: 'Tidak Memerlukan Mesin Kasir Mahal Khusus',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'yes',
        description: 'Menghemat biaya modal awal jutaan rupiah bagi outlet baru.',
      },
    ],
  },
  {
    categoryName: 'Keamanan Data & Biaya Langganan',
    features: [
      {
        name: 'Auto-Backup Otomatis ke Bot Telegram Pemilik',
        laundryku: 'yes',
        retailPos: 'no',
        manualBook: 'no',
        description: 'Arsip cadangan data transaksi aman jika HP kasir rusak/hilang.',
        isHighlight: true,
      },
      {
        name: 'Potongan Komisi / Biaya Per Transaksi Nota',
        laundryku: '0% (Tanpa Potongan)',
        retailPos: '0.5% - 2% / transaksi',
        manualBook: '0%',
        description: '100% omset cucian milik pemilik usaha tanpa potongan persenan.',
        isHighlight: true,
      },
      {
        name: 'Biaya Langganan Bulanan',
        laundryku: 'Mulai Rp 99.000 / bln',
        retailPos: 'Rp 150.000 - Rp 350.000 / bln',
        manualBook: 'Biaya cetak nota rangkap',
        description: 'Harga terjangkau flat rate tanpa biaya tersembunyi.',
      },
    ],
  },
];

export const BUYER_CRITERIA: BuyerCriterion[] = [
  {
    number: '01',
    title: 'Kesesuaian Alur Kerja Industri Laundry',
    description:
      'Aplikasi kasir retail umum dibuat untuk barang yang langsung dibawa pulang pembeli saat bayar. Laundry membutuhkan alur penitipan pakaian: penimbangan kiloan desimal, pilihan durasi proses, pencatatan rak simpan, hingga status cucian siap ambil.',
    whyItMatters: 'Mencegah baju pelanggan tertukar, hilang, atau salah hitung timbangan desimal.',
    iconName: 'scale',
  },
  {
    number: '02',
    title: 'Biaya Otomasi WhatsApp Tanpa Beban Kuota',
    description:
      'Pelanggan modern menolak panggilan telepon dan lebih suka notifikasi WhatsApp instan saat cucian selesai. Pastikan software tidak memungut biaya token per pesan yang membengkakkan pengeluaran bulanan.',
    whyItMatters: 'Menghemat biaya operasional hingga ratusan ribu rupiah per bulan dibanding POS API berbayar.',
    iconName: 'message',
  },
  {
    number: '03',
    title: 'Fleksibilitas Perangkat Kasir (Hardware Agnostic)',
    description:
      'Hindari software kasir yang memaksa pembelian tablet iPad atau mesin kasir khusus bernilai puluhan juta. Pilih aplikasi yang ringan dijalankan dari smartphone Android staf atau laptop toko yang sudah ada.',
    whyItMatters: 'Meminimalkan modal awal membuka cabang baru atau mengganti kasir.',
    iconName: 'printer',
  },
  {
    number: '04',
    title: 'Proteksi Data & Cadangan Mandiri',
    description:
      'Perangkat kasir rawan terkena percikan air cuci, jatuh, atau dicuri. Sistem wajib memiliki sinkronisasi cloud real-time serta fitur backup otomatis berkala ke kanal privat pemilik usaha seperti Telegram.',
    whyItMatters: 'Riwayat piutang dan data omset pelanggan tetap aman dan dapat dipulihkan dalam 1 menit.',
    iconName: 'shield',
  },
  {
    number: '05',
    title: 'Transparansi Tarif Flat Tanpa Potongan Komisi',
    description:
      'Beberapa penyedia kasir menawarkan harga awal murah namun memotong persentase komisi dari setiap nota atau pencairan QRIS. Pilihlah langganan flat bulanan/tahunan yang adil bagi pengusaha.',
    whyItMatters: 'Mempertahankan margin keuntungan bersih cucian agar bisnis tumbuh sehat.',
    iconName: 'wallet',
  },
];

export const BUYER_FAQS: BuyerFaqItem[] = [
  {
    question: 'Mengapa saya tidak sebaiknya memakai aplikasi kasir retail umum (seperti Moka atau Qasir) untuk laundry?',
    answer:
      'Aplikasi kasir retail umum dirancang untuk toko kelontong atau restoran dengan model jual-langsung-bawa-pulang. Mereka tidak memiliki fitur pelacakan tahapan cucian (Cuci, Kering, Setrika), perhitungan desimal kiloan gram secara natural, durasi reguler vs express, dan yang terpenting: tidak ada integrasi otomatis kirim pesan WhatsApp ke pelanggan ketika pakaian sudah bersih dan siap diambil.',
    category: 'feature',
  },
  {
    question: 'Apa risiko terbesar jika tetap mencatat transaksi dengan buku nota kertas manual?',
    answer:
      'Buku nota manual memiliki risiko tinggi nota hilang terselip, rusak akibat terkena air cucian, tulisan kasir tidak terbaca, serta rawan kebocoran kas (kecurangan staf). Selain itu, kasir harus mengetik manual nomor WA pelanggan satu per satu yang sangat menyita waktu operasional jam sibuk.',
    category: 'feature',
  },
  {
    question: 'Bagaimana LaundryKu bisa mengirim notifikasi WhatsApp tanpa biaya pulsa/token per pesan?',
    answer:
      'LaundryKu menggunakan integrasi QR scanner mandiri yang menghubungkan nomor WhatsApp outlet Anda langsung dengan sistem. Pesan terkirim menggunakan jaringan internet nomor toko Anda sendiri, sehingga Anda tidak dibebankan biaya per pesan seperti pada WhatsApp Business Cloud API resmi.',
    category: 'pricing',
  },
  {
    question: 'Apakah LaundryKu memerlukan printer khusus yang mahal?',
    answer:
      'Tidak. LaundryKu mendukung printer kasir thermal standar ukuran 58mm maupun 80mm yang banyak dijual di marketplace seharga Rp 150.000 - Rp 300.000. Koneksi dapat dilakukan via Bluetooth smartphone atau kabel USB laptop. Anda juga dapat memilih tanpa cetak kertas dengan mengirimkan nota digital langsung ke WhatsApp.',
    category: 'hardware',
  },
  {
    question: 'Apakah data omset dan daftar pelanggan saya aman jika HP kasir rusak?',
    answer:
      'Sangat aman. Seluruh data transaksi LaundryKu tersimpan di cloud database PostgreSQL berstandar enterprise. Selain itu, LaundryKu dilengkapi sistem auto-backup otomatis yang mengirimkan arsip basis data secara berkala ke bot Telegram privat milik Anda.',
    category: 'security',
  },
];
