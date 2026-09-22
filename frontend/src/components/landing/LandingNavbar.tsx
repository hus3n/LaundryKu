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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo/laundryku.png"
            alt="Logo LaundryKu - Aplikasi Kasir Laundry Digital"
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-[#1DA9D0]/30"
          />
          <span className="text-xl font-extrabold text-slate-900 dark:text-[#F5EACA]">
            Laundry<span className="bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] bg-clip-text text-transparent">Ku</span>{' '}
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1DA9D0]/15 border border-[#1DA9D0]/30 text-sky-700 dark:text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>

        <nav aria-label="Menu Navigasi Utama" className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-[#F5EACA]/80 font-medium">
          <a href="#fitur" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Fitur Utama</a>
          <a href="#cara-kerja" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Cara Kerja</a>
          <a href="#keunggulan" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Keunggulan</a>
          <a href="#reviews" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Ulasan</a>
          <a href="#harga" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Harga</a>
          <a href="#faq" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-[#F5EACA]/80 hover:text-slate-950 dark:hover:text-[#F5EACA] transition-colors"
          >
            Masuk
          </Link>
          <motion.button
            whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRegisterClick}
            className="px-4 sm:px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] shadow-lg shadow-[#1DA9D0]/25 flex items-center gap-2 group shrink-0"
          >
            <span>Daftar Sekarang</span>
            <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
