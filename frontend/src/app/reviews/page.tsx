'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ArrowLeft,
  Sparkles,
  Plus,
  ShieldCheck,
  Building2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  MessageSquareQuote,
} from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ReviewModal from '@/components/ui/ReviewModal';
import { api } from '@/lib/api';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterWithPhoto, setFilterWithPhoto] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat ulasan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewCreated = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (filterWithPhoto && !r.imageUrl) return false;
    return true;
  });

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] transition-colors duration-200">
      {/* Top Navbar */}
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
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 hover:opacity-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Beri Ulasan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
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
              Berdasarkan {reviews.length} ulasan terverifikasi
            </p>
          </div>

          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="text-center sm:text-right">
            <button
              onClick={() => setIsModalOpen(true)}
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

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1DA9D0]/15">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterRating('all')}
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
                  onClick={() => setFilterRating(star)}
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
              onChange={(e) => setFilterWithPhoto(e.target.checked)}
              className="rounded text-[#1DA9D0] focus:ring-[#1DA9D0]"
            />
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#1DA9D0]" />
              Hanya dengan foto ({reviews.filter((r) => r.imageUrl).length})
            </span>
          </label>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl dark:bg-[#012040]/40 bg-slate-200/60 animate-pulse border border-slate-200 dark:border-[#1DA9D0]/10"
              />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquareQuote className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-800">
              Belum ada ulasan untuk filter ini
            </h3>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
              Jadilah yang pertama memberikan ulasan pada kategori ini!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs shadow-md"
            >
              Beri Ulasan Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => {
              const dateStr = new Date(review.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <motion.div
                  key={review.id}
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
                          onClick={() => setSelectedImage(review.imageUrl || null)}
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
            })}
          </div>
        )}
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReviewCreated}
      />

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={selectedImage}
              alt="Foto Ulasan Diperbesar"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
