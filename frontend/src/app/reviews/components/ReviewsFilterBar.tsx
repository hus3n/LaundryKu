'use client';

import React from 'react';
import { Star, Image as ImageIcon } from 'lucide-react';
import { Review } from '@/types';

interface ReviewsFilterBarProps {
  reviews: Review[];
  filterRating: number | 'all';
  onFilterRatingChange: (val: number | 'all') => void;
  filterWithPhoto: boolean;
  onFilterWithPhotoChange: (val: boolean) => void;
}

export default function ReviewsFilterBar({
  reviews,
  filterRating,
  onFilterRatingChange,
  filterWithPhoto,
  onFilterWithPhotoChange,
}: ReviewsFilterBarProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1DA9D0]/15">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterRatingChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterRating === 'all'
                ? 'bg-[#1DA9D0] text-[#010E1C]'
                : 'dark:bg-[#012040] bg-white border border-slate-200 dark:border-[#1DA9D0]/20 text-slate-600 dark:text-[#F5EACA]/70'
            }`}
          >
            Semua Bintang ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            return (
              <button
                key={star}
                onClick={() => onFilterRatingChange(star)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterRating === star
                    ? 'bg-[#EA8803] text-[#010E1C]'
                    : 'dark:bg-[#012040] bg-white border border-slate-200 dark:border-[#1DA9D0]/20 text-slate-600 dark:text-[#F5EACA]/70'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                {star} ({count})
              </button>
            );
          })}
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium dark:text-[#F5EACA]/80 text-slate-600">
          <input
            type="checkbox"
            checked={filterWithPhoto}
            onChange={(e) => onFilterWithPhotoChange(e.target.checked)}
            className="rounded text-[#1DA9D0] focus:ring-[#1DA9D0]"
          />
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-[#1DA9D0]" />
            Hanya dengan foto ({reviews.filter((r) => r.imageUrl).length})
          </span>
        </label>
      </div>
    </section>
  );
}
