'use client';

import React from 'react';
import LandingFooter from '@/components/landing/LandingFooter';
import PillarHeader from './components/PillarHeader';
import PillarHero from './components/PillarHero';
import PillarKeyPillars from './components/PillarKeyPillars';
import PillarWorkflowSteps from './components/PillarWorkflowSteps';
import PillarRoiCalculatorTeaser from './components/PillarRoiCalculatorTeaser';
import PillarFaq from './components/PillarFaq';
import PillarCta from './components/PillarCta';
import PillarJsonLd from './components/PillarJsonLd';

export default function AplikasiKasirLaundryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] transition-colors duration-200">
      <PillarHeader />

      <main>
        <PillarHero />
        <PillarKeyPillars />
        <PillarWorkflowSteps />
        <PillarRoiCalculatorTeaser />
        <PillarFaq />
        <PillarCta />
      </main>

      <LandingFooter />
      <PillarJsonLd />
    </div>
  );
}
