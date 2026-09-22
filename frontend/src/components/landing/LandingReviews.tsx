'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Sparkles, ArrowRight, Building2, MessageSquarePlus } from 'lucide-react';
import { api } from '@/lib/api';
import { Review } from '@/types';
import ReviewModal from '@/components/ui/ReviewModal';
import { maskText } from '@/lib/utils';

const DEFAULT_TOP_REVIEWS: Review[] = [
  {
    id: 'sample-1',
    name: 'Budi Santoso',
    storeName: 'Kinclong Laundry Express',
    role: 'Owner Laundry',
    rating: 5,
    comment:
      'Semenjak pakai LaundryKu, nota kasir dan notifikasi WhatsApp ke pelanggan jalan otomatis. Pelanggan senang karena dapat update saat cucian siap diambil, omset kami naik 30%!',
    imageUrl: null,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Siti Aminah',
    storeName: 'Berkah Laundry Kiloan',
    role: 'Kasir & Pengelola',
    rating: 5,
    comment:
      'Tampilan aplikasi sangat bersih dan mudah digunakan oleh karyawan baru. Hitung timbangan cepat dan struk nota bluetooth langsung cetak dalam hitungan detik tanpa ribet.',
    imageUrl: null,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Hendri Wijaya',
    storeName: 'Fresh & Clean Laundry',
    role: 'Owner 3 Cabang',
    rating: 5,
    comment:
      'Sangat membantu memantau omset 3 cabang sekaligus dari HP. Fitur auto-backup ke bot Telegram privat bikin tenang karena data usaha selalu aman terlindungi.',
    imageUrl: null,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
];

export default function LandingReviews() {
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_TOP_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadTopReviews() {
      try {
        const res = await api.get('/reviews', {
          params: { bestOnly: true, limit: 3 },
        });
        if (res.data?.data && res.data.data.length > 0) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load top reviews for landing page', err);
      }
    }
    loadTopReviews();
  }, []);

  const handleReviewSuccess = (newReview: Review) => {
    // If it's a 5 star, prepend to display
    if (newReview.rating >= 4) {
      setReviews((prev) => [newReview, ...prev.slice(0, 2)]);
    }
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EA8803]/10 border border-[#EA8803]/25 text-[#EA8803] text-xs font-bold mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            3 Ulasan Terbaik Pilihan
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold dark:text-[#F5EACA] text-slate-900 tracking-tight"
          >
            Dipercaya & Dicintai Pengusaha Laundry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm dark:text-[#F5EACA]/70 text-slate-600"
          >
            Simak ulasan terbaik dari pemilik bisnis dan kasir yang telah merasakan langsung kemudahan operasional dan peningkatan omset usaha bersama LaundryKu.
          </motion.p>
        </div>

        {/* 3 Best Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {reviews.slice(0, 3).map((review, idx) => (
            <motion.div
              key={review.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * idx, duration: 0.4 }}
              className="glass-card-dark p-6 sm:p-7 rounded-3xl border dark:border-[#1DA9D0]/20 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                {/* Stars and Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EA8803] text-[#EA8803]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EA8803]/10 text-[#EA8803] border border-[#EA8803]/20">
                    Bintang 5 ★
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm dark:text-[#F5EACA]/90 text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Uploaded image if exists */}
                {review.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={review.imageUrl}
                      alt={`Foto ulasan dari ${maskText(review.name)}`}
                      className="w-full h-36 object-cover rounded-2xl border dark:border-[#1DA9D0]/20 border-slate-200 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Reviewer identity */}
              <div className="pt-4 border-t dark:border-[#1DA9D0]/10 border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1DA9D0] dark:bg-gradient-to-tr dark:from-[#1DA9D0] dark:to-[#43D5CC] flex items-center justify-center font-bold text-[#010E1C] text-sm shadow-md shrink-0">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm dark:text-[#F5EACA] text-slate-900 truncate">
                      {maskText(review.name)}
                    </span>
                    <span title="Terverifikasi" className="inline-flex shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] dark:text-[#F5EACA]/60 text-slate-500 truncate">
                    {review.storeName ? (
                      <>
                        <Building2 className="w-3 h-3 text-[#1DA9D0] shrink-0" />
                        <span className="truncate">{maskText(review.storeName)}</span>
                      </>
                    ) : (
                      <span>{review.role || 'Owner Usaha Laundry'}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/reviews"
            className="px-6 py-3 rounded-2xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/30 border-slate-200 text-xs sm:text-sm font-bold dark:text-[#F5EACA] text-slate-800 hover:border-[#1DA9D0] dark:hover:text-[#43D5CC] shadow-md transition-all inline-flex items-center gap-2 group"
          >
            <span>Lihat Semua Ulasan & Foto</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#1DA9D0]" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs sm:text-sm shadow-lg shadow-[#EA8803]/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Tulis Ulasan Anda</span>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </section>
  );
}
