'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import { TermsMeta } from '../types';

interface TermsHeroProps {
  meta: TermsMeta;
}

export default function TermsHero({ meta }: TermsHeroProps) {
  return (
    <section className="py-10 sm:py-14 border-b border-slate-200 dark:border-[#1DA9D0]/15 bg-white/50 dark:bg-[#012040]/40 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1DA9D0]/15 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/25 text-xs font-semibold mb-4">
          <Scale className="w-3.5 h-3.5" />
          <span>Ketentuan Hukum &amp; Penggunaan Layanan</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight leading-tight">
          {meta.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75 leading-relaxed">
          {meta.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#F5EACA]/60">
          <span>Terakhir diperbarui: <strong>{meta.lastUpdated}</strong></span>
          <span>•</span>
          <span>Versi Dokumen: <strong>{meta.documentVersion}</strong></span>
          <span>•</span>
          <span>Wilayah: <strong>{meta.jurisdiction}</strong></span>
        </div>
      </div>
    </section>
  );
}
