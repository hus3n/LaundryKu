import React from 'react';
import { BUYER_FAQS } from '../komparasiData';

export default function KomparasiJsonLd() {
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
        name: 'Komparasi: LaundryKu vs POS Retail vs Nota Manual',
        item: `${siteUrl}/komparasi`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BUYER_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Komparasi Software Kasir Laundry: LaundryKu vs POS Retail & Buku Nota Manual',
    url: `${siteUrl}/komparasi`,
    description:
      'Perbandingan obyektif aplikasi kasir laundry vs POS retail konvensional (Moka, Pawoon, Olsera) dan buku nota manual: fitur timbangan kiloan, WhatsApp gratis Rp 0, dan auto backup Telegram.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'LaundryKu',
      url: siteUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Perbandingan Aplikasi Kasir Laundry Indonesia',
    },
  };

  return (
    <>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
    </>
  );
}
