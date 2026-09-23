'use client';

import React from 'react';
import LandingFooter from '@/components/landing/LandingFooter';
import KomparasiHeader from './components/KomparasiHeader';
import KomparasiHero from './components/KomparasiHero';
import KomparasiTable from './components/KomparasiTable';
import KomparasiBuyerGuide from './components/KomparasiBuyerGuide';
import KomparasiFaq from './components/KomparasiFaq';
import KomparasiCta from './components/KomparasiCta';
import KomparasiJsonLd from './components/KomparasiJsonLd';

export default function KomparasiPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] transition-colors duration-200">
      <KomparasiHeader />

      <main>
        <KomparasiHero />
        <KomparasiTable />
        <KomparasiBuyerGuide />
        <KomparasiFaq />
        <KomparasiCta />
      </main>

      <LandingFooter />
      <KomparasiJsonLd />
    </div>
  );
}
