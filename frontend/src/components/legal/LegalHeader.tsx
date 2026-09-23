'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface LegalHeaderProps {
  currentTab: 'terms' | 'privacy';
}

export default function LegalHeader({ currentTab }: LegalHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-[#1DA9D0]/15 bg-white/90 dark:bg-[#010E1C]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Back to Home */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#F5EACA]/80 hover:text-slate-900 dark:hover:text-[#F5EACA] bg-slate-100 dark:bg-[#012040] hover:bg-slate-200 dark:hover:bg-[#013D66] transition-all"
            title="Kembali ke Beranda LaundryKu"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>

          <Link href="/" className="hover:opacity-95 transition-opacity">
            <BrandLogo size="sm" showSubtitle={false} />
          </Link>
        </div>

        {/* Center: Switch between Terms & Privacy */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20 text-xs font-medium">
          <Link
            href="/terms"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'terms'
                ? 'bg-white dark:bg-[#1DA9D0] text-slate-900 dark:text-[#010E1C] font-bold shadow-xs'
                : 'text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Syarat &amp;</span> Ketentuan
          </Link>
          <Link
            href="/privacy"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'privacy'
                ? 'bg-white dark:bg-[#1DA9D0] text-slate-900 dark:text-[#010E1C] font-bold shadow-xs'
                : 'text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Kebijakan</span> Privasi
          </Link>
        </div>

        {/* Right: ThemeToggle & CTA */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/register"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#010E1C] bg-[#1DA9D0] hover:bg-[#43D5CC] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] shadow-xs transition-all"
          >
            <span>Coba Gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
