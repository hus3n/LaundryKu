import React from 'react';

export interface JsonLdProps {
  baseUrl?: string;
  ratingValue?: string | number;
  reviewCount?: string | number;
}

export default function JsonLd({
  baseUrl,
  ratingValue = '4.9',
  reviewCount = '156',
}: JsonLdProps) {
  const siteUrl = (baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.forapp.id').replace(/\/$/, '');

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaundryKu',
    alternateName: [
      'LaundryKu POS',
      'LaundryKu v1.0',
      'Aplikasi LaundryKu',
      'LaundryKu Manajemen Laundry Digital',
    ],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Point of Sale (POS) & Laundry Management System',
    operatingSystem: 'All (Web, Android, iOS, Windows, macOS)',
    softwareVersion: '1.0',
    url: siteUrl,
    image: `${siteUrl}/logo/laundryku.png`,
    screenshot: `${siteUrl}/opengraph-image.png`,
    description:
      'Software POS kasir dan sistem manajemen laundry digital otomatis nomor 1 di Indonesia dengan notifikasi WhatsApp otomatis ke pelanggan tanpa biaya per pesan, cetak nota struk thermal bluetooth/USB, laporan keuangan omset real-time, dan auto-backup ke Telegram.',
    inLanguage: 'id-ID',
    brand: {
      '@type': 'Brand',
      name: 'LaundryKu',
      logo: `${siteUrl}/logo/laundryku.png`,
      slogan: 'Aplikasi Kasir Laundry & Software Manajemen Laundry Digital',
    },
    creator: {
      '@type': 'Organization',
      name: 'LaundryKu',
      url: siteUrl,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: '99000',
      highPrice: '899000',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: 'Paket Starter 1 Bulan',
          price: '99000',
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}#harga`,
          description: 'Solusi hemat operasional digital usaha laundry selama 1 bulan.',
        },
        {
          '@type': 'Offer',
          name: 'Paket Pro 6 Bulan',
          price: '499000',
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}#harga`,
          description: 'Paket terfavorit pemilik laundry hemat 15% dengan prioritas WA bot dan auto-backup.',
        },
        {
          '@type': 'Offer',
          name: 'Paket Enterprise 1 Tahun',
          price: '899000',
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}#harga`,
          description: 'Hemat maksimal 25% performa penuh 12 bulan untuk usaha laundry berkembang.',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(ratingValue),
      reviewCount: String(reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Notifikasi WhatsApp Otomatis ke Pelanggan saat Cucian Selesai (0 Rupiah Tanpa Biaya Token)',
      'Pencatatan Transaksi & Kasir POS Khusus Kiloan Desimal & Satuan',
      'Cetak Struk Nota Thermal Bluetooth / USB dan Generator Nota Gambar Digital',
      'Laporan Keuangan & Grafik Analitik Omset Harian, Bulanan, dan Tahunan',
      'Multi-Role Hak Akses (SuperAdmin, Admin Pemilik Toko, Kasir/Karyawan)',
      'Auto-Backup Data Toko Berkala Terintegrasi Bot Telegram Privat',
      'Multi-Outlet & Monitoring Masa Aktif Toko Tanpa Batas Kuota Order',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LaundryKu',
    alternateName: ['LaundryKu Indonesia', 'LaundryKu POS'],
    url: siteUrl,
    logo: `${siteUrl}/logo/laundryku.png`,
    description:
      'Penyedia platform kasir dan software manajemen laundry digital terpadu di Indonesia dengan notifikasi WhatsApp otomatis.',
    slogan: 'Aplikasi Kasir Laundry & Software Manajemen Laundry Digital',
    knowsAbout: [
      'Software Kasir Laundry',
      'Aplikasi POS Laundry',
      'Notifikasi WhatsApp Otomatis Laundry',
      'Manajemen Laundry Kiloan dan Satuan',
      'Cetak Nota Struk Thermal Bluetooth',
      'Laporan Keuangan & Pembukuan Usaha Laundry',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+6285229925593',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['Indonesian', 'id'],
    },
    sameAs: [
      'https://wa.me/6285229925593',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Fitur Unggulan',
        item: `${siteUrl}#fitur`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cara Kerja',
        item: `${siteUrl}#cara-kerja`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Paket Harga',
        item: `${siteUrl}#harga`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Tanya Jawab (FAQ)',
        item: `${siteUrl}#faq`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Apa itu LaundryKu dan apa keunggulannya dibanding aplikasi kasir biasa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LaundryKu adalah software kasir (POS) dan sistem manajemen laundry digital terintegrasi yang dirancang khusus untuk operasional usaha laundry kiloan maupun satuan. Keunggulannya meliputi notifikasi WhatsApp otomatis ke pelanggan saat cucian siap diambil, cetak nota struk thermal, laporan analitik omset real-time, dan auto-backup berkala ke Telegram.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah ada biaya tambahan per pesan WhatsApp yang terkirim ke pelanggan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tidak ada biaya tersembunyi ataupun pulsa/kredit per pesan. LaundryKu menghubungkan nomor WhatsApp toko Anda secara langsung menggunakan integrasi QR scanner, sehingga pengiriman pesan status cucian gratis dan tanpa batas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah saya membutuhkan perangkat komputer kasir khusus atau bisa pakai HP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LaundryKu berbasis web cloud responsif modern yang bisa diakses dengan lancar dari HP Android, iPhone, tablet iPad, laptop, maupun komputer kasir desktop tanpa perlu instalasi perangkat khusus.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana cara cetak nota struk untuk pelanggan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LaundryKu mendukung cetak nota langsung ke printer thermal 58mm/80mm via Bluetooth maupun kabel USB, serta menyediakan opsi nota struk digital berformat gambar atau PDF yang bisa langsung dikirim ke WhatsApp pelanggan.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah data keuangan dan riwayat pesanan pelanggan saya tersimpan aman?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Data Anda dijamin aman dengan basis data PostgreSQL terenkripsi dan sistem backup otomatis berkala ke akun Telegram privat Anda. Data omset, pelanggan, dan transaksi Anda tidak akan hilang meskipun perangkat kasir rusak.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana cara berlangganan dan memulai menggunakan LaundryKu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pilih paket yang sesuai (Starter, Pro, atau Enterprise), lalu hubungi SuperAdmin melalui WhatsApp di +62 852-2992-5593. Tim kami akan mengaktivasi toko Anda dalam hitungan menit dan mendampingi hingga siap operasional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah LaundryKu cocok untuk laundry kiloan, satuan, sepatu, dan express?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sangat cocok. LaundryKu dirancang fleksibel untuk mendukung penimbangan kiloan akurat desimal (misal 3,25 kg), paket satuan (jas, bedcover, selimut), laundry sepatu dan tas, hingga berbagai varian durasi pengerjaan seperti reguler, kilat, atau express.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah LaundryKu memotong komisi atau biaya transaksi per nota kasir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tidak ada potongan sama sekali. LaundryKu menggunakan skema langganan transparan flat bulanan atau tahunan tanpa potongan komisi persenan per nota maupun biaya admin tersembunyi.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana perbandingan LaundryKu dengan aplikasi kasir retail umum atau buku nota manual?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aplikasi kasir retail umum tidak memiliki alur kerja status cucian bertahap, perhitungan kiloan desimal, dan notifikasi WhatsApp siap-ambil. Sementara buku nota manual rentan hilang, robek basah, dan menyita waktu kasir. LaundryKu mengintegrasikan seluruh kebutuhan operasional laundry dalam satu sistem terpadu.',
        },
      },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cara Menggunakan Aplikasi Kasir LaundryKu untuk Operasional Laundry Digital',
    description:
      'Panduan langkah demi langkah menggunakan software kasir LaundryKu: mulai dari input order cucian, cetak nota, hingga kirim notifikasi WhatsApp otomatis saat cucian selesai.',
    totalTime: 'PT3M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Input Order Cucian (Kiloan atau Satuan)',
        text: 'Buka menu Kasir POS LaundryKu, pilih pelanggan, timbang pakaian kiloan (dengan akurasi desimal) atau pilih jenis cucian satuan (bedcover, jas, dsb), lalu pilih durasi pengerjaan (reguler/kilat/express).',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Cetak Nota Struk Thermal atau Bagikan Nota Digital',
        text: 'Cetak struk nota fisik menggunakan printer thermal Bluetooth 58mm/80mm atau buat nota gambar/PDF digital untuk dikirimkan langsung ke WhatsApp pelanggan.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Update Tahapan Pengerjaan Cucian',
        text: 'Perbarui alur status pengerjaan mulai dari antrian, proses cuci, proses kering, hingga setrika rapi secara real-time di sistem.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Kirim Notifikasi WhatsApp Otomatis Cucian Selesai',
        text: 'Saat status cucian diubah ke Selesai / Siap Diambil, sistem LaundryKu otomatis mengirim pesan WhatsApp ke pelanggan tanpa memotong pulsa/biaya pesan.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Pengambilan Cucian dan Pencatatan Pembukuan Otomatis',
        text: 'Pelanggan mengambil cucian dan melunasi pembayaran. Data transaksi langsung masuk ke rekapitulasi omset harian dan laporan laba-rugi toko.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
}
