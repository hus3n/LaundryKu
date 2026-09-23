'use client';

import React from 'react';
import { Star, Sparkles, Plus } from 'lucide-react';

interface ReviewsHeroProps {
  averageRating: string;
  reviewCount: number;
  onOpenModal: () => void;
}

export default function ReviewsHero({
  averageRating,
  reviewCount,
  onOpenModal,
}: ReviewsHeroProps) {
  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA8803]/10 border border-[#EA8803]/20 text-[#EA8803] text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Testimoni & Pengalaman Pengguna
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight dark:text-[#F5EACA] text-slate-900">
        Ulasan Nyata dari Pengusaha Laundry
      </h1>
      <p className="mt-3 text-sm sm:text-base max-w-2xl mx-auto dark:text-[#F5EACA]/70 text-slate-600">
        Simak bagaimana ribuan kasir, staf operasional, dan pemilik toko laundry di seluruh Indonesia menyederhanakan bisnis dan meningkatkan omset mereka bersama LaundryKu.
      </p>

      {/* Rating Summary Card */}
      <div className="mt-8 max-w-2xl mx-auto glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/20 border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="text-center sm:text-left">
          <div className="text-4xl sm:text-5xl font-black text-[#EA8803] flex items-center justify-center sm:justify-start gap-2">
            {averageRating}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-[#EA8803] text-[#EA8803]" />
              ))}
            </div>
          </div>
          <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
            Berdasarkan {reviewCount} ulasan terverifikasi
          </p>
        </div>

        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        <div className="text-center sm:text-right">
          <button
            onClick={onOpenModal}
            className="px-5 py-2.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tulis Pengalaman Anda
          </button>
          <p className="text-[11px] dark:text-[#F5EACA]/50 text-slate-400 mt-1.5">
            Dapat menyertakan foto toko / struk
          </p>
        </div>
      </div>
    </section>
  );
}
