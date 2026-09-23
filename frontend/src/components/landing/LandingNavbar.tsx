'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-[#010E1C]/85 border-b border-slate-200 dark:border-[#1DA9D0]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0 group">
          <img
            src="/logo/laundryku.png"
            alt="Logo LaundryKu - Aplikasi Kasir Laundry Digital"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md shadow-[#1DA9D0]/30 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5EACA] tracking-tight">
              Laundry<span className="text-[#1DA9D0] dark:text-[#43D5CC]">Ku</span>
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1DA9D0]/10 dark:bg-[#1DA9D0]/20 text-[#015383] dark:text-[#43D5CC] border border-[#1DA9D0]/25 uppercase tracking-wide">
              POS Cloud
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Menu Navigasi Utama" className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm text-slate-600 dark:text-[#F5EACA]/75 font-semibold tracking-normal">
          <a href="#fitur" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">Fitur POS</a>
          <a href="#cara-kerja" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">Cara Kerja</a>
          <a href="#keunggulan" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">Keunggulan</a>
          <a href="#harga" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">Paket Harga</a>
          <a href="#reviews" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">Ulasan Mitra</a>
          <a href="#faq" className="hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors py-1">FAQ</a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/90 hover:text-[#1DA9D0] dark:hover:text-[#43D5CC] transition-colors"
          >
            Masuk Kasir
          </Link>
          <Link
            href="/register"
            className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] shadow-md shadow-[#1DA9D0]/20 flex items-center gap-1.5 sm:gap-2 group shrink-0 transition-all"
          >
            <span className="sm:hidden">Daftar</span>
            <span className="hidden sm:inline">Coba Gratis 30 Hari</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
