import React from 'react';

export default function WhatsAppJsonLd() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.com').replace(/\/$/, '');

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
        name: 'Aplikasi Kasir Laundry',
        item: `${siteUrl}/aplikasi-kasir-laundry`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Notifikasi WhatsApp Otomatis',
        item: `${siteUrl}/fitur/notifikasi-whatsapp-otomatis`,
      },
    ],
  };

  const featureSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaundryKu WhatsApp Notification Gateway',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    featureList: [
      'Scan QR WhatsApp Mandiri',
      'Notifikasi Cucian Selesai Otomatis',
      'Struk Nota Digital via WhatsApp',
      'Pengingat Cucian Siap Diambil',
      'Bebas Biaya Token per Pesan',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSchema) }}
      />
    </>
  );
}
