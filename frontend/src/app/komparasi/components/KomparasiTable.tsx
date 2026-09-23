'use client';

import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { COMPARISON_CATEGORIES } from '../komparasiData';
import { ComparisonRating } from '../types';

export default function KomparasiTable() {
  const renderCellContent = (value: ComparisonRating) => {
    if (value === 'yes') {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Check className="w-4 h-4 stroke-[3]" />
        </span>
      );
    }
    if (value === 'no') {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
          <X className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    if (value === 'partial') {
      return (
        <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Terbatas</span>
        </span>
      );
    }
    return <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-[#F5EACA]">{value}</span>;
  };

  return (
    <section id="tabel-komparasi" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Matriks Fitur &amp; Kemampuan Sistem
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75 max-w-2xl mx-auto">
          Perbandingan langsung antara aplikasi kasir khusus laundry (LaundryKu), aplikasi kasir umum toko retail, dan pembukuan manual buku nota rangkap.
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 bg-white/70 dark:bg-[#010E1C]/80 backdrop-blur-md shadow-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1DA9D0]/20 bg-slate-50/80 dark:bg-[#012040]/70">
              <th className="py-5 px-6 font-bold text-sm text-slate-700 dark:text-[#F5EACA] w-[40%]">
                Parameter &amp; Fitur Operasional
              </th>
              <th className="py-5 px-6 font-extrabold text-sm sm:text-base text-[#1DA9D0] dark:text-[#43D5CC] bg-[#1DA9D0]/5 dark:bg-[#1DA9D0]/10 text-center w-[25%] border-x border-[#1DA9D0]/20">
                <div className="flex flex-col items-center">
                  <span>LaundryKu v1.0</span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    (Khusus Laundry)
                  </span>
                </div>
              </th>
              <th className="py-5 px-6 font-semibold text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/70 text-center w-[18%]">
                POS Retail Umum
                <span className="block text-[10px] text-slate-400 font-normal">(Moka, Pawoon, dll)</span>
              </th>
              <th className="py-5 px-6 font-semibold text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/70 text-center w-[17%]">
                Buku Nota Kertas
                <span className="block text-[10px] text-slate-400 font-normal">(Tulis Tangan Manual)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_CATEGORIES.map((cat, catIdx) => (
              <React.Fragment key={cat.categoryName}>
                {/* Category Header Row */}
                <tr className="bg-slate-100/70 dark:bg-[#013D66]/40 border-y border-slate-200/80 dark:border-[#1DA9D0]/15">
                  <td
                    colSpan={4}
                    className="py-3 px-6 text-xs font-black uppercase tracking-wider text-[#013D66] dark:text-[#43D5CC]"
                  >
                    {catIdx + 1}. {cat.categoryName}
                  </td>
                </tr>

                {/* Features within Category */}
                {cat.features.map((feat) => (
                  <tr
                    key={feat.name}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-[#012040]/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA]">
                        {feat.name}
                      </div>
                      {feat.description && (
                        <div className="text-[11px] text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">
                          {feat.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-[#1DA9D0]/5 dark:bg-[#1DA9D0]/10 border-x border-[#1DA9D0]/20">
                      {renderCellContent(feat.laundryku)}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600 dark:text-[#F5EACA]/70">
                      {renderCellContent(feat.retailPos)}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600 dark:text-[#F5EACA]/70">
                      {renderCellContent(feat.manualBook)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
