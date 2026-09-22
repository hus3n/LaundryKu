'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface KaryawanHeaderProps {
  userName?: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function KaryawanHeader({
  userName,
  loading,
  onRefresh,
}: KaryawanHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#1DA9D0]/15">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1DA9D0]/15 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/30 uppercase tracking-wider">
            Portal Kasir & Staf
          </span>
        </div>
        <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5EACA] mt-1">
          Dashboard Karyawan Laundry
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">
          Selamat bertugas,{' '}
          <span className="font-semibold text-slate-800 dark:text-[#F5EACA]">
            {userName}
          </span>
          ! Kelola penerimaan dan proses cucian dengan mudah.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          leftIcon={
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1DA9D0]' : ''}`}
            />
          }
        >
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Link href="/karyawan/laundry/new">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Catat Cucian Baru
          </Button>
        </Link>
      </div>
    </div>
  );
}
