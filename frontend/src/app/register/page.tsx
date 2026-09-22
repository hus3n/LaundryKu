'use client';

import React, { Suspense } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import UnifiedAuthCard from '@/components/auth/UnifiedAuthCard';

export default function RegisterPage() {
  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-3 sm:p-6 sm:py-12 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#015383]/20 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />

      <Suspense fallback={<div className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat formulir pendaftaran...</div>}>
        <UnifiedAuthCard initialMode="register" />
      </Suspense>
    </div>
  );
}
