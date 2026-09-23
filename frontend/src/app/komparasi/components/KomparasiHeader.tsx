'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function KomparasiHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#010E1C]/85 border-b border-slate-200 dark:border-[#1DA9D0]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-[#1DA9D0]/20 text-slate-600 dark:text-[#F5EACA]/75 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#012040] transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <BrandLogo size="sm" showSubtitle={false} />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-[#F5EACA]/75">
          <a href="#tabel-komparasi" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors">
            Tabel Komparasi
          </a>
          <a href="#panduan-memilih" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors">
            Panduan Memilih
          </a>
          <a href="#faq" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors">
            Tanya Jawab
          </a>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1DA9D0] hover:bg-[#43D5CC] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 transition-all hover:scale-102"
          >
            <span>Coba Gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
