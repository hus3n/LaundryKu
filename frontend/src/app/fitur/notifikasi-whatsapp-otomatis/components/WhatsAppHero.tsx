'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function WhatsAppHero() {
  return (
    <section className="relative pt-6 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-[#1DA9D0]/15">
        <div className="flex items-center gap-3">
          <Link
            href="/aplikasi-kasir-laundry"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-[#1DA9D0]/20 text-slate-600 dark:text-[#F5EACA]/75 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#012040] transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Panduan Kasir</span>
          </Link>
          <Link href="/">
            <BrandLogo size="sm" showSubtitle={false} />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/register"
            className="px-3.5 py-2 rounded-xl bg-[#1DA9D0] hover:bg-[#43D5CC] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-md transition-all"
          >
            Coba Gratis
          </Link>
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase mb-6">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Fitur Unggulan Gateway Komunikasi LaundryKu</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#F5EACA] tracking-tight leading-tight">
        Notifikasi WhatsApp Otomatis Laundry:{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC]">
          Rp 0 Tanpa Biaya Token
        </span>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-[#F5EACA]/80 max-w-3xl mx-auto leading-relaxed">
        Kirim pesan otomatis saat cucian siap diambil, kirim nota struk digital, dan ingatkan pelanggan tanpa perlu mengetik manual di HP kasir satu per satu.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/90">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Koneksi QR Scan Mandiri
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Unlimited Pesan Tanpa Kuota
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Format Nota Gambar &amp; PDF
        </span>
      </div>
    </section>
  );
}
