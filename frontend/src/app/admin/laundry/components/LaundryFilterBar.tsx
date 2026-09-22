'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface LaundryFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function LaundryFilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  onSearchSubmit,
}: LaundryFilterBarProps) {
  return (
    <div className="glass-card-dark p-2 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 flex flex-col md:flex-row gap-2 sm:gap-4 justify-between items-center shadow-sm">
      <form onSubmit={onSearchSubmit} className="relative w-full md:w-80">
        <Search className="w-3.5 h-3.5 dark:text-[#1DA9D0]/50 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nota, pelanggan, no WA..."
          className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
        />
      </form>

      <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 md:flex-none px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA]/80 text-slate-800 focus:outline-none focus:border-[#1DA9D0]"
        >
          <option value="">Semua Status</option>
          <option value="RECEIVED">Masuk</option>
          <option value="IN_PROGRESS">Dikerjakan</option>
          <option value="DONE">Selesai</option>
          <option value="PICKED_UP">Diambil</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="flex-1 md:flex-none px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA]/80 text-slate-800 focus:outline-none focus:border-[#1DA9D0]"
        >
          <option value="">Semua Bayar</option>
          <option value="UNPAID">Belum Bayar</option>
          <option value="PAID">Lunas</option>
        </select>
      </div>
    </div>
  );
}
