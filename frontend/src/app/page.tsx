'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingAdvantages from '@/components/landing/LandingAdvantages';
import LandingReviews from '@/components/landing/LandingReviews';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingFaq from '@/components/landing/LandingFaq';
import LandingCta from '@/components/landing/LandingCta';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] selection:bg-[#1DA9D0] selection:text-white dark:selection:text-[#010E1C] overflow-hidden relative transition-colors duration-200">
      {/* Background Glow Spheres (Parallax) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/10 dark:bg-[#1DA9D0]/15 rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-400/10 dark:bg-[#015383]/20 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-sky-300/10 dark:bg-[#43D5CC]/10 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* Modular Landing Page Sections */}
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingAdvantages />
        <LandingReviews />
        <LandingPricing />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
