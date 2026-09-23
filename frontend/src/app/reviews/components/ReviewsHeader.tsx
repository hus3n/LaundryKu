'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface ReviewsHeaderProps {
  onOpenModal: () => void;
}

export default function ReviewsHeader({ onOpenModal }: ReviewsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#010E1C]/80 border-b border-slate-200 dark:border-[#1DA9D0]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl border dark:border-[#1DA9D0]/20 border-slate-200 text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
          <BrandLogo />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={onOpenModal}
            className="px-4 py-2 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 hover:opacity-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Beri Ulasan</span>
          </button>
        </div>
      </div>
    </header>
  );
}
