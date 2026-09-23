'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { ReviewModalProps } from './review-modal/types';
import StarRatingSelector from './review-modal/StarRatingSelector';
import ReviewImageUploader from './review-modal/ReviewImageUploader';

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [role, setRole] = useState('Owner Laundry');
  const [comment, setComment] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleReset = () => {
    setName('');
    setStoreName('');
    setRole('Owner Laundry');
    setComment('');
    setRating(5);
    handleImageRemove();
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama Anda wajib diisi.');
      return;
    }
    if (!comment.trim()) {
      setError('Tuliskan ulasan atau pengalaman Anda.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (storeName.trim()) formData.append('storeName', storeName.trim());
      if (role.trim()) formData.append('role', role.trim());
      formData.append('rating', rating.toString());
      formData.append('comment', comment.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      if (onSuccess && res.data?.data) {
        onSuccess(res.data.data);
      }

      setTimeout(() => {
        handleReset();
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengirimkan ulasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg my-6 sm:my-8 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl dark:bg-[#011627] bg-white border dark:border-[#1DA9D0]/30 border-slate-200 dark:text-[#F5EACA] text-slate-900 transition-colors"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#EA8803] dark:bg-gradient-to-tr dark:from-[#EA8803] dark:to-[#F5EACA] flex items-center justify-center shadow-md shadow-[#EA8803]/25 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#010E1C]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold dark:text-[#F5EACA] text-slate-900">
                Beri Ulasan LaundryKu
              </h3>
              <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500">
                Bagikan pengalaman Anda menggunakan aplikasi LaundryKu
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-6 sm:py-8 text-center space-y-2.5 sm:space-y-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>
              <h4 className="text-base sm:text-lg font-bold dark:text-[#F5EACA] text-slate-900">
                Terima Kasih Banyak!
              </h4>
              <p className="text-xs dark:text-[#F5EACA]/70 text-slate-600 max-w-sm mx-auto">
                Ulasan berbintang dan foto Anda berhasil disimpan dan akan sangat bermanfaat bagi kemajuan LaundryKu!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {error && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <StarRatingSelector rating={rating} onChange={setRating} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                    Nama Usaha / Toko (Opsional)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Contoh: Kinclong Laundry"
                    className="w-full px-3 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                  Peran / Jabatan
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                >
                  <option value="Owner Laundry">Owner Laundry</option>
                  <option value="Pengelola / Manajer">Pengelola / Manajer Cabang</option>
                  <option value="Kasir Laundry">Kasir Laundry</option>
                  <option value="Karyawan Operasional">Karyawan Operasional</option>
                  <option value="Pelanggan Setia">Pelanggan Setia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                  Ulasan & Pengalaman Anda *
                </label>
                <textarea
                  required
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan fitur favorit Anda, kemudahan operasional, peningkatan omset, atau kesan menggunakan LaundryKu..."
                  className="w-full px-3 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0] resize-none"
                />
              </div>

              <ReviewImageUploader
                imagePreview={imagePreview}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                onError={setError}
              />

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border dark:border-[#1DA9D0]/20 border-slate-300 text-xs font-medium dark:text-[#F5EACA]/70 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#F5EACA] text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/25 flex items-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirimkan...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 fill-[#010E1C]" />
                      Kirim Ulasan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
