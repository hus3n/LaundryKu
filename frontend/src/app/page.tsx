'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
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
import { LandingAuthProvider, useLandingAuth } from '@/contexts/LandingAuthContext';
import UnifiedAuthCard from '@/components/auth/UnifiedAuthCard';

function LandingPageContent() {
  const { authMode, closeAuth, setAuthMode } = useLandingAuth();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const isSplitActive = authMode !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] selection:bg-[#1DA9D0] selection:text-white dark:selection:text-[#010E1C] overflow-x-hidden relative transition-colors duration-200 flex">
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

      {/* Main Landing View (Left Side when Split, Full Width when Closed) */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className={`relative z-10 transition-all duration-300 ${
          isSplitActive
            ? 'w-full lg:w-[54%] xl:w-[56%] h-screen overflow-y-auto lg:border-r border-slate-200 dark:border-[#1DA9D0]/20 shadow-2xl'
            : 'w-full min-h-screen'
        }`}
      >
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
      </motion.div>

      {/* Split Auth Panel (Right Side on Desktop) */}
      <AnimatePresence>
        {isSplitActive && (
          <motion.aside
            key="split-auth-desktop"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="hidden lg:flex flex-col justify-center items-center w-[46%] xl:w-[44%] h-screen overflow-y-auto p-4 sm:p-6 xl:p-8 fixed right-0 top-0 z-30 bg-slate-50/95 dark:bg-[#010E1C]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-[#1DA9D0]/20 shadow-2xl"
          >
            {/* Split Close Button */}
            <button
              onClick={closeAuth}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/30 text-slate-500 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA] hover:bg-slate-100 dark:hover:bg-[#013D66] shadow-md transition-all cursor-pointer z-40 group"
              title="Tutup Tampilan Split"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>

            <div className="w-full max-w-md py-6">
              <UnifiedAuthCard
                activeMode={authMode}
                onModeChange={setAuthMode}
                isSplitView
                onClose={closeAuth}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Auth Panel (Slide-up on Mobile/Tablet) */}
      <AnimatePresence>
        {isSplitActive && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              key="mobile-split-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAuth}
              className="fixed inset-0 bg-slate-900/60 dark:bg-[#010E1C]/85 backdrop-blur-sm"
            />
            <motion.div
              key="mobile-split-drawer"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="relative w-full max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-[#012040] p-4 sm:p-6 border-t border-slate-200 dark:border-[#1DA9D0]/30 shadow-2xl z-50 flex flex-col items-center"
            >
              {/* Drag handle */}
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-[#1DA9D0]/30 mb-4 self-center" />

              <div className="w-full max-w-lg">
                <UnifiedAuthCard
                  activeMode={authMode}
                  onModeChange={setAuthMode}
                  isSplitView
                  onClose={closeAuth}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#010E1C]" />}>
      <LandingAuthProvider>
        <LandingPageContent />
      </LandingAuthProvider>
    </Suspense>
  );
}
