'use client';

import React from 'react';
import Link from 'next/link';

interface AuthHeaderProps {
  mode: 'login' | 'register';
}

export default function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <div className="text-center mb-5 sm:mb-6">
      <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5 group mb-2 sm:mb-3">
        <img
          src="/logo/laundryku.png"
          alt="LaundryKu"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-contain shadow-md shadow-[#1DA9D0]/30 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">
          Laundry
          <span className="text-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">
            Ku
          </span>
        </span>
      </Link>

      <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-[#F5EACA]">
        {mode === 'login' ? 'Masuk ke Aplikasi LaundryKu' : 'Mulai Usaha Laundry Digital Anda'}
      </h1>
      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">
        {mode === 'login'
          ? 'Pilih peran kasir, admin toko, atau superadmin'
          : 'Daftar sekarang dan nikmati akses trial gratis 30 hari'}
      </p>
    </div>
  );
}
