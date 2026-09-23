import React from 'react';
import type { Metadata } from 'next';
import LegalHeader from '@/components/legal/LegalHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import PrivacyHero from './components/PrivacyHero';
import PrivacyContent from './components/PrivacyContent';
import PrivacyContactCard from './components/PrivacyContactCard';
import { PRIVACY_META, PRIVACY_SECTIONS } from './privacyData';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi & Keamanan Data | LaundryKu POS',
  description:
    'Kebijakan privasi resmi LaundryKu mengenai pengumpulan data toko, data pelanggan laundry, enkripsi HTTPS/TLS 1.3, dan kepatuhan terhadap UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022).',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Kebijakan Privasi & Keamanan Data - LaundryKu',
    description:
      'Komitmen perlindungan privasi data pelanggan dan operasional laundry Anda dengan enkripsi modern dan standar UU PDP.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.forapp.id').replace(/\/$/, '');

  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Kebijakan Privasi LaundryKu',
    url: `${siteUrl}/privacy`,
    description:
      'Kebijakan privasi resmi LaundryKu, perlindungan data pribadi dan bisnis laundry, serta enkripsi cloud.',
    inLanguage: 'id-ID',
    breadcrumb: {
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
          name: 'Kebijakan Privasi',
          item: `${siteUrl}/privacy`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010E1C] text-slate-800 dark:text-[#F5EACA] flex flex-col transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <LegalHeader currentTab="privacy" />

      <PrivacyHero meta={PRIVACY_META} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 space-y-10 text-sm leading-relaxed">
        <PrivacyContent sections={PRIVACY_SECTIONS} />
        <PrivacyContactCard />
      </main>

      <LandingFooter />
    </div>
  );
}
