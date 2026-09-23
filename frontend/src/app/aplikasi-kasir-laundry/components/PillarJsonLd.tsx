import React from 'react';
import { PILLAR_FAQS } from '../aplikasiKasirLaundryData';

export default function PillarJsonLd() {
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
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Panduan Lengkap Aplikasi Kasir Laundry & Software Manajemen Laundry Digital 2026',
    description:
      'Panduan mendalam tentang sistem kasir laundry modern di Indonesia: penimbangan desimal, notifikasi WhatsApp otomatis 0 Rupiah, cetak struk thermal, dan auto-backup ke Telegram.',
    author: {
      '@type': 'Organization',
      name: 'LaundryKu Editorial Team',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LaundryKu',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo/laundryku.png`,
      },
    },
    datePublished: '2026-01-15T08:00:00+07:00',
    dateModified: '2026-03-24T10:00:00+07:00',
    mainEntityOfPage: `${siteUrl}/aplikasi-kasir-laundry`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PILLAR_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
