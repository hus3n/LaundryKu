'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, Star } from 'lucide-react';

export default function PillarHero() {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1DA9D0]/10 dark:bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 text-[#015383] dark:text-[#43D5CC] text-xs font-bold tracking-wide uppercase mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Panduan Lengkap &amp; Standar Software POS Laundry 2026</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#F5EACA] tracking-tight leading-tight"
      >
        Aplikasi Kasir Laundry Digital:{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC]">
          Otomatisasi Operasional &amp; WhatsApp Rp 0
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-slate-600 dark:text-[#F5EACA]/80 max-w-3xl mx-auto leading-relaxed"
      >
        Software kasir laundry cloud modern terpadu yang membebaskan pemilik usaha dari buku nota manual: penimbangan kiloan desimal presisi, cetak struk nota thermal Bluetooth, serta notifikasi WhatsApp otomatis saat cucian siap diambil tanpa biaya token per pesan.
      </motion.p>

      {/* Trust Rating & Value Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/90"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          Rating 4.9 dari 150+ Mitra Laundry
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          100% Bebas Komisi Transaksi
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          Akses Dari HP Android &amp; iOS
        </span>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
      >
        <Link
          href="/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#1DA9D0]/25 hover:opacity-95 transition-all"
        >
          <span>Mulai Coba Gratis Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/komparasi"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/30 text-xs sm:text-sm font-bold text-slate-800 dark:text-[#F5EACA] hover:border-[#1DA9D0] transition-all"
        >
          <span>Bandingkan dengan POS Lain</span>
        </Link>
      </motion.div>
    </section>
  );
}
