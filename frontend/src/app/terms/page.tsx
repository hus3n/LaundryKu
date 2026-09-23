import React from 'react';
import type { Metadata } from 'next';
import LegalHeader from '@/components/legal/LegalHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import TermsHero from './components/TermsHero';
import TermsContent from './components/TermsContent';
import TermsContactCard from './components/TermsContactCard';
import { TERMS_META, TERMS_SECTIONS } from './termsData';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan Layanan | LaundryKu POS',
  description:
    'Syarat dan ketentuan resmi penggunaan aplikasi kasir LaundryKu, lisensi penggunaan SaaS, hak kepemilikan data toko, dan integrasi WhatsApp otomatis untuk pemilik usaha laundry.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Syarat dan Ketentuan Layanan - LaundryKu POS Laundry',
    description:
      'Ketentuan penggunaan platform kasir dan manajemen laundry digital terpadu LaundryKu di Indonesia.',
    url: '/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.forapp.id').replace(/\/$/, '');

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Syarat dan Ketentuan Layanan LaundryKu',
    url: `${siteUrl}/terms`,
    description:
      'Syarat dan ketentuan resmi penggunaan aplikasi kasir LaundryKu dan sistem manajemen laundry digital otomatis.',
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
          name: 'Syarat & Ketentuan',
          item: `${siteUrl}/terms`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010E1C] text-slate-800 dark:text-[#F5EACA] flex flex-col transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      <LegalHeader currentTab="terms" />

      <TermsHero meta={TERMS_META} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 space-y-10 text-sm leading-relaxed">
        <TermsContent sections={TERMS_SECTIONS} />
        <TermsContactCard />
      </main>

      <LandingFooter />
    </div>
  );
}
