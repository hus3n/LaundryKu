'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt } from 'lucide-react';

export default function ResetPasswordHeader() {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#1DA9D0] dark:bg-gradient-to-tr dark:from-[#1DA9D0] dark:to-[#43D5CC] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/30">
          <Shirt className="w-7 h-7 text-[#010E1C]" />
        </div>
        <span className="text-2xl font-bold text-slate-900 dark:bg-gradient-to-r dark:from-[#F5EACA] dark:via-[#F5EACA]/90 dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">
          LaundryKu
        </span>
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900 mt-6">
        Buat Kata Sandi Baru
      </h1>
      <p className="text-xs sm:text-sm dark:text-[#F5EACA]/60 text-slate-500 mt-1 max-w-sm mx-auto">
        Tentukan kata sandi baru yang aman untuk akun toko LaundryKu Anda.
      </p>
    </div>
  );
}
