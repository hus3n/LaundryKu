'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { RATING_LABELS } from './types';

interface StarRatingSelectorProps {
  rating: number;
  onChange: (rating: number) => void;
}

export default function StarRatingSelector({ rating, onChange }: StarRatingSelectorProps) {
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const currentDisplayRating = hoveredRating || rating;

  return (
    <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl dark:bg-[#012040]/70 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 text-center">
      <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/90 text-slate-700 mb-1.5">
        Penilaian Bintang Anda *
      </label>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-125 focus:outline-none"
            title={`${star} Bintang`}
          >
            <Star
              className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                star <= currentDisplayRating
                  ? 'fill-[#EA8803] text-[#EA8803] drop-shadow-md'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 text-[11px] sm:text-xs font-medium text-[#EA8803]">
        {RATING_LABELS[currentDisplayRating]}
      </div>
    </div>
  );
}
