import { PrivacySection, PrivacyMeta } from './types';

export const PRIVACY_META: PrivacyMeta = {
  lastUpdated: 'September 2026',
  encryptionStatus: 'TLS 1.3 / AES-256',
  dataSovereignty: 'Server Terenkripsi Cloud',
  title: 'Kebijakan Privasi & Perlindungan Data',
  subtitle:
    'LaundryKu menghargai privasi dan keamanan data bisnis Anda. Halaman ini menjelaskan bagaimana data toko, pelanggan, dan transaksi Anda kami kumpulkan, kelola, serta lindungi secara ketat.',
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    number: 1,
    title: 'Prinsip Privasi & Kepatuhan Regulasi',
    intro:
      'LaundryKu mematuhi ketentuan perundang-undangan Republik Indonesia, khususnya Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) serta Undang-Undang Informasi dan Transaksi Elektronik (UU ITE). Kami memproses data hanya sesuai tujuan sah operasional laundry dan tidak pernah menjual data pribadi kepada pihak ketiga untuk kepentingan iklan atau komersial luar.',
  },
  {
    number: 2,
    title: 'Kategori Data yang Dikumpulkan',
    intro: 'Data yang diproses dalam ekosistem LaundryKu meliputi:',
    items: [
      'Data Akun Pemilik & Karyawan: Nama pengelola, alamat email, nomor telepon WhatsApp, kata sandi (tersimpan dalam bentuk cryptographic hash satu arah bcrypt), nama toko, dan alamat outlet.',
      'Data Pelanggan Toko: Nama pelanggan laundry dan nomor WhatsApp yang diinput oleh kasir/admin saat pembuatan order cucian.',
      'Data Transaksi & Operasional: Jenis layanan paket, berat kiloan desimal/jumlah satuan, nominal harga, metode pembayaran, status cucian, dan catatan khusus cucian.',
      'Data Teknis: Alamat IP, jenis browser, perangkat akses, dan log riwayat aktivitas operasional untuk tujuan audit keamanan internal toko.',
    ],
  },
  {
    number: 3,
    title: 'Tujuan Pemrosesan Data',
    intro: 'Kami menggunakan data yang dikumpulkan untuk:',
    items: [
      'Menyediakan layanan kasir POS, kalkulasi harga otomatis, dan cetak nota struk kasir.',
      'Mengirimkan notifikasi status cucian dan struk digital melalui bot WhatsApp toko Anda secara langsung ke nomor WhatsApp pelanggan yang bersangkutan.',
      'Menyusun grafik analitik omset, laba-rugi, dan laporan performa kasir secara real-time.',
      'Melakukan pencadangan (auto-backup) basis data terenkripsi untuk perlindungan dari bencana teknis perangkat.',
    ],
  },
  {
    number: 4,
    title: 'Keamanan & Enkripsi Data',
    intro: 'Keamanan data Anda dijaga melalui standar rekayasa perangkat lunak modern:',
    items: [
      'Enkripsi Lalu Lintas: Seluruh komunikasi antara browser kasir dan server dilindungi protokol enkripsi HTTPS dengan sertifikat SSL/TLS modern.',
      'Penyimpanan Password: Kata sandi tidak pernah disimpan dalam bentuk teks polos (plain text), melainkan diacak menggunakan algoritma salt & hash bcrypt.',
      'Isolasi Multi-Tenant: Data antar toko laundry dipisahkan secara logis sehingga toko lain tidak dapat melihat atau mengakses data pelanggan maupun transaksi Anda.',
    ],
  },
  {
    number: 5,
    title: 'Penggunaan Cookie & Sesi Lokal',
    intro:
      'LaundryKu menggunakan penyimpanan sesi browser (JWT session token) dan preferensi antarmuka lokal (seperti tema Terang/Gelap) untuk mempertahankan status login akun kasir Anda tanpa perlu login berulang saat membuka aplikasi. Kami tidak menggunakan cookie pelacak pihak ketiga (third-party tracking cookies) untuk periklanan lintas situs.',
  },
  {
    number: 6,
    title: 'Hak Subjek Data (Pemilik Toko & Pelanggan)',
    intro: 'Sesuai UU PDP, Anda sebagai pemilik toko maupun pelanggan Anda berhak:',
    items: [
      'Meminta salinan data transaksi atau riwayat pelanggan yang tersimpan dalam sistem.',
      'Mengubah atau memperbarui informasi pelanggan yang keliru melalui menu Pelanggan.',
      'Meminta penghapusan permanen akun dan seluruh arsip transaksi toko Anda apabila memutuskan berhenti menggunakan platform.',
    ],
  },
];
