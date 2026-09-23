'use client';

import React from 'react';
import { ROI_METRICS } from '../aplikasiKasirLaundryData';
import { TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function PillarRoiCalculatorTeaser() {
  return (
    <section id="simulasi-roi" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1DA9D0] dark:text-[#43D5CC]">
          Efisiensi Bisnis &amp; Dampak Finansial
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Berapa Penghematan yang Didapat Outlet Anda?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75">
          Simulasi penghematan biaya dan jam kerja staf kasir per bulan dibandingkan pencatatan manual atau sistem kasir dengan kuota token berbayar.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 bg-white/70 dark:bg-[#010E1C]/80 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1DA9D0]/20 bg-slate-50 dark:bg-[#012040]/70 text-xs sm:text-sm">
              <th className="py-4 px-6 font-bold text-slate-700 dark:text-[#F5EACA]">Aktivitas Operasional</th>
              <th className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">Cara Manual / POS Umum</th>
              <th className="py-4 px-6 font-bold text-[#1DA9D0] dark:text-[#43D5CC] bg-[#1DA9D0]/10 border-x border-[#1DA9D0]/20 text-center">
                Bersama LaundryKu
              </th>
              <th className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">Efisiensi &amp; Penghematan</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {ROI_METRICS.map((row) => (
              <tr
                key={row.metric}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-[#012040]/30 transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-slate-900 dark:text-[#F5EACA]">
                  {row.metric}
                </td>
                <td className="py-4 px-6 text-slate-600 dark:text-[#F5EACA]/70">
                  {row.manualValue}
                </td>
                <td className="py-4 px-6 text-center font-bold text-[#015383] dark:text-[#43D5CC] bg-[#1DA9D0]/5 border-x border-[#1DA9D0]/20">
                  {row.laundrykuValue}
                </td>
                <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                  {row.savings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
