'use client';

import React from 'react';
import { Shirt, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';

interface KaryawanMetricsProps {
  todayCount: number;
  inProgressCount: number;
  readyCount: number;
  pickedUpCount: number;
}

export default function KaryawanMetrics({
  todayCount,
  inProgressCount,
  readyCount,
  pickedUpCount,
}: KaryawanMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <Card hoverEffect glass className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#F5EACA]/60">
            Cucian Masuk Hari Ini
          </span>
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Shirt className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">
          {todayCount}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-[#F5EACA]/50">Order hari ini</span>
      </Card>

      <Card hoverEffect glass className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#F5EACA]/60">
            Sedang Diproses
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-[#EA8803] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-[#EA8803]">
          {inProgressCount}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-[#F5EACA]/50">Cuci, Kering, Setrika</span>
      </Card>

      <Card hoverEffect glass className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#F5EACA]/60">
            Siap Diambil
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {readyCount}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-[#F5EACA]/50">Menunggu pelanggan</span>
      </Card>

      <Card hoverEffect glass className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#F5EACA]/60">
            Sudah Diambil
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">
          {pickedUpCount}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-[#F5EACA]/50">Transaksi selesai</span>
      </Card>
    </div>
  );
}
