'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ResetPasswordSuccessProps } from '../types';

export default function ResetPasswordSuccess({ onGoToLogin }: ResetPasswordSuccessProps) {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold dark:text-[#F5EACA] text-slate-900">
          Kata Sandi Berhasil Diperbarui!
        </h3>
        <p className="text-xs sm:text-sm dark:text-[#F5EACA]/80 text-slate-600 leading-relaxed max-w-xs mx-auto">
          Kata sandi akun LaundryKu Anda telah berhasil diubah. Silakan masuk menggunakan kata sandi baru Anda.
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/login"
          onClick={onGoToLogin}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-sm shadow-lg shadow-[#1DA9D0]/25 hover:opacity-95 transition-all"
        >
          <span>Masuk ke Akun Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
