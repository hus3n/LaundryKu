'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PILLAR_FAQS } from '../aplikasiKasirLaundryData';

export default function PillarFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DA9D0]/10 dark:bg-[#1DA9D0]/20 text-[#015383] dark:text-[#43D5CC] text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tanya Jawab Seputar Software POS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-[#F5EACA]/75">
          Jawaban lengkap seputar fitur, kompatibilitas printer, dan skema harga aplikasi kasir LaundryKu.
        </p>
      </div>

      <div className="space-y-3.5">
        {PILLAR_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#1DA9D0]/40 bg-white dark:bg-[#012040]/50 shadow-md shadow-[#1DA9D0]/5'
                  : 'border-slate-200 dark:border-[#1DA9D0]/15 bg-white/60 dark:bg-[#010E1C]/60 hover:border-slate-300 dark:hover:border-[#1DA9D0]/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#F5EACA] leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-[#1DA9D0] dark:text-[#43D5CC] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/80 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
