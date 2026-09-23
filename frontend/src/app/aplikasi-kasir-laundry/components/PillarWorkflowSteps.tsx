'use client';

import React from 'react';
import { WORKFLOW_STEPS } from '../aplikasiKasirLaundryData';
import { ArrowDown } from 'lucide-react';

export default function PillarWorkflowSteps() {
  return (
    <section id="alur-pos" className="scroll-mt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1DA9D0] dark:text-[#43D5CC]">
          Alur Transaksi &amp; Operasional
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Bagaimana Alur Kerja Kasir LaundryKu Bekerja?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75">
          Proses penerimaan cucian hingga serah terima yang dirancang ringkas agar kasir dapat melayani pelanggan dalam hitungan detik tanpa antrean panjang.
        </p>
      </div>

      <div className="space-y-4">
        {WORKFLOW_STEPS.map((step, idx) => (
          <div
            key={step.step}
            className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 bg-white/80 dark:bg-[#010E1C]/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-[#1DA9D0]/20">
                {step.step}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#F5EACA]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/75 mt-1 leading-relaxed">
                  {step.desc}
                </p>
                <div className="text-[11px] text-[#015383] dark:text-[#43D5CC] font-medium mt-1.5">
                  {step.detail}
                </div>
              </div>
            </div>

            <div className="shrink-0 self-start md:self-center">
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#012040] text-slate-700 dark:text-[#F5EACA] text-xs font-semibold border border-slate-200 dark:border-[#1DA9D0]/20">
                {step.durationTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
