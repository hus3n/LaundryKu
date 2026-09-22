'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getWaRegisterUrl } from './landingData';

export default function LandingNavbar() {
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getWaRegisterUrl(), '_blank');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-[#010E1C]/80 border-b border-slate-200 dark:border-[#1DA9D0]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <img
            src="/logo/laundryku.png"
            alt="Logo LaundryKu - Aplikasi Kasir Laundry Digital"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md shadow-[#1DA9D0]/30 shrink-0"
          />
          <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-[#F5EACA] truncate">
            Laundry<span className="text-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">Ku</span>{' '}
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-[#1DA9D0]/15 border border-[#1DA9D0]/30 text-sky-700 dark:text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>

        <nav aria-label="Menu Navigasi Utama" className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-600 dark:text-[#F5EACA]/80 font-medium">
          <a href="#fitur" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Fitur Utama</a>
          <a href="#cara-kerja" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Cara Kerja</a>
          <a href="#keunggulan" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Keunggulan</a>
          <a href="#reviews" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Ulasan</a>
          <a href="#harga" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Harga</a>
          <a href="#faq" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-[#F5EACA]/80 hover:text-slate-950 dark:hover:text-[#F5EACA] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] shadow-md shadow-[#1DA9D0]/20 flex items-center gap-1 sm:gap-2 group shrink-0 transition-all"
          >
            <span className="sm:hidden">Daftar</span>
            <span className="hidden sm:inline">Daftar Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </header>
  );
}
