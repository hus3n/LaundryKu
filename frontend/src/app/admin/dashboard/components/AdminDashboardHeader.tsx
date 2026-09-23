'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import DownloadAllDataButton from '@/components/ui/DownloadAllDataButton';

export default function AdminDashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
      <div>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
          Dashboard Utama Laundry
        </h1>
        <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">
          Ringkasan transaksi, pendapatan, dan aktivitas cucian toko Anda
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
        <DownloadAllDataButton />
        <Link
          href="/admin/laundry/new"
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-sm shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Catat Cucian Baru
        </Link>
      </div>
    </div>
  );
}
