'use client';

import React from 'react';
import { MessageSquareQuote } from 'lucide-react';

interface ReviewsEmptyStateProps {
  onOpenModal: () => void;
}

export default function ReviewsEmptyState({ onOpenModal }: ReviewsEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <MessageSquareQuote className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
      <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-800">
        Belum ada ulasan untuk filter ini
      </h3>
      <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
        Jadilah yang pertama memberikan ulasan pada kategori ini!
      </p>
      <button
        onClick={onOpenModal}
        className="mt-4 px-4 py-2 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs shadow-md"
      >
        Beri Ulasan Pertama
      </button>
    </div>
  );
}
