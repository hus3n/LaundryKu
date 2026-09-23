'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowDown } from 'lucide-react';

export default function KomparasiHero() {
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
        <span>Analisis Obyektif &amp; Panduan Pemilihan Software 2026</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#F5EACA] tracking-tight leading-tight"
      >
        LaundryKu vs POS Retail Umum vs{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC]">
          Buku Nota Manual
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-slate-600 dark:text-[#F5EACA]/80 max-w-3xl mx-auto leading-relaxed"
      >
        Bandingkan fitur secara transparan. Temukan mengapa ratusan pengusaha laundry kiloan dan satuan beralih dari buku nota fisik atau mesin kasir retail umum ke sistem kasir berbasis alur laundry modern.
      </motion.p>

      {/* Value Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/90"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          WhatsApp Otomatis Rp 0
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          Timbangan Desimal Presisi
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          Auto-Backup Telegram Privat
        </span>
      </motion.div>

      {/* Quick Jump Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <a
          href="#tabel-komparasi"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/30 shadow-md text-xs sm:text-sm font-bold text-slate-800 dark:text-[#F5EACA] hover:border-[#1DA9D0] transition-all group"
        >
          <span>Lihat Tabel Perbandingan Lengkap</span>
          <ArrowDown className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC] group-hover:translate-y-0.5 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
