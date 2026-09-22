'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterHeader() {
  return (
    <div className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-8">
      <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
        <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#013D66] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/20 p-1.5 sm:p-2 border border-[#1DA9D0]/20">
          <Image
            src="/logo/laundryku-transparent.png"
            alt="LaundryKu Logo"
            width={36}
            height={36}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Laundry<span className="text-[#1DA9D0] dark:text-[#43D5CC]">Ku</span>
        </span>
      </Link>
      <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5EACA]">
        Daftar Akun Toko Laundry
      </h1>
      <p className="text-[11px] sm:text-sm text-slate-600 dark:text-[#F5EACA]/70 max-w-md mx-auto">
        Mulai kelola operasional kasir, WhatsApp notifikasi, dan keuangan laundry Anda secara terpadu.
      </p>
    </div>
  );
}
