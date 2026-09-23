'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Building2, Calendar } from 'lucide-react';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
  onImageClick: (url: string) => void;
}

export default function ReviewCard({ review, onImageClick }: ReviewCardProps) {
  const dateStr = new Date(review.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: User details & Stars */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1DA9D0] dark:bg-gradient-to-tr dark:from-[#1DA9D0] dark:to-[#43D5CC] flex items-center justify-center font-bold text-[#010E1C] text-sm shadow-md shrink-0">
              {review.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm dark:text-[#F5EACA] text-slate-900">
                  {review.name}
                </span>
                <span title="Terverifikasi" className="inline-flex">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] dark:text-[#F5EACA]/60 text-slate-500">
                {review.storeName ? (
                  <span className="flex items-center gap-1 truncate max-w-[170px]">
                    <Building2 className="w-3 h-3 text-[#1DA9D0] shrink-0" />
                    <span className="truncate">{review.storeName}</span>
                  </span>
                ) : (
                  <span>{review.role || 'Pengguna LaundryKu'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[...Array(review.rating)].map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-[#EA8803] text-[#EA8803]" />
            ))}
          </div>
        </div>

        {/* Role badge if storeName was shown */}
        {review.storeName && (
          <div className="mb-2.5">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#1DA9D0]/10 text-[#1DA9D0] dark:text-[#43D5CC]">
              {review.role || 'Pengguna'}
            </span>
          </div>
        )}

        {/* Comment text */}
        <p className="text-xs sm:text-sm dark:text-[#F5EACA]/85 text-slate-700 leading-relaxed italic">
          &ldquo;{review.comment}&rdquo;
        </p>

        {/* Uploaded Image thumbnail */}
        {review.imageUrl && (
          <div className="mt-3.5">
            <img
              src={review.imageUrl}
              alt={`Foto ulasan oleh ${review.name}`}
              onClick={() => onImageClick(review.imageUrl!)}
              className="w-full max-h-48 object-cover rounded-2xl border dark:border-[#1DA9D0]/20 border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            />
            <span className="block text-[10px] text-slate-400 dark:text-[#F5EACA]/40 mt-1">
              Klik gambar untuk memperbesar
            </span>
          </div>
        )}
      </div>

      {/* Date footer */}
      <div className="mt-4 pt-3 border-t dark:border-[#1DA9D0]/10 border-slate-100 flex items-center justify-between text-[11px] dark:text-[#F5EACA]/40 text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </span>
        <span className="text-emerald-500 font-medium">Verified User</span>
      </div>
    </motion.div>
  );
}
