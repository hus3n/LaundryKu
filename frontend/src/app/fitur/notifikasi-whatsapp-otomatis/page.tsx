'use client';

import React from 'react';
import LandingFooter from '@/components/landing/LandingFooter';
import WhatsAppHero from './components/WhatsAppHero';
import WhatsAppBenefits from './components/WhatsAppBenefits';
import WhatsAppMessagePreview from './components/WhatsAppMessagePreview';
import WhatsAppCta from './components/WhatsAppCta';
import WhatsAppJsonLd from './components/WhatsAppJsonLd';

export default function WhatsAppFiturPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] transition-colors duration-200">
      <main>
        <WhatsAppHero />
        <WhatsAppBenefits />
        <WhatsAppMessagePreview />
        <WhatsAppCta />
      </main>

      <LandingFooter />
      <WhatsAppJsonLd />
    </div>
  );
}
