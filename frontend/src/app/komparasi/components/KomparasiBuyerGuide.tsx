'use client';

import React from 'react';
import { Scale, MessageSquare, Printer, ShieldCheck, Wallet } from 'lucide-react';
import { BUYER_CRITERIA } from '../komparasiData';

export default function KomparasiBuyerGuide() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'scale':
        return <Scale className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'printer':
        return <Printer className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      default:
        return <Scale className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
    }
  };

  return (
    <section id="panduan-memilih" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1DA9D0] dark:text-[#43D5CC]">
          Buyer&apos;s Guide &amp; Kerangka Pengambilan Keputusan
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          5 Kriteria Wajib Memilih Aplikasi Kasir Laundry
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75">
          Sebelum memutuskan berlangganan atau membeli lisensi sistem kasir, pastikan platform yang Anda pilih memenuhi standar operasional spesifik industri laundry berikut:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUYER_CRITERIA.map((criterion, idx) => (
          <div
            key={criterion.number}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              idx === 0 || idx === 1
                ? 'bg-gradient-to-b from-white to-slate-50 dark:from-[#012040]/70 dark:to-[#010E1C] border-[#1DA9D0]/30 shadow-lg shadow-[#1DA9D0]/5'
                : 'bg-white/70 dark:bg-[#010E1C]/60 border-slate-200 dark:border-[#1DA9D0]/15'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#1DA9D0]/10 dark:bg-[#1DA9D0]/20 flex items-center justify-center">
                  {getIcon(criterion.iconName)}
                </div>
                <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                  {criterion.number}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2 leading-snug">
                {criterion.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/75 leading-relaxed">
                {criterion.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-[#015383] dark:text-[#43D5CC]/90">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-slate-400 mb-0.5">
                Mengapa ini penting?
              </span>
              {criterion.whyItMatters}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
