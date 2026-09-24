'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import UnifiedAuthCard from '@/components/auth/UnifiedAuthCard';
import { DownloadAppButton } from '@/app/components/DownloadAppButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-3 sm:p-6 sm:py-12 relative overflow-hidden transition-colors">
      {/* Top navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#F5EACA]/80 hover:text-slate-900 dark:hover:text-[#F5EACA] bg-white/80 dark:bg-[#012040]/80 border border-slate-200 dark:border-[#1DA9D0]/20 shadow-xs backdrop-blur-md transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#015383]/20 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <Suspense fallback={<div className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat halaman masuk...</div>}>
          <UnifiedAuthCard initialMode="login" />
        </Suspense>
        
        <div className="mt-8">
          <DownloadAppButton variant="outline" className="bg-white/80 dark:bg-[#012040]/80 backdrop-blur-sm shadow-sm" />
        </div>
      </div>
    </div>
  );
}
