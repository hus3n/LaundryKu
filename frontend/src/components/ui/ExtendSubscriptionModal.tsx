'use client';

import React, { useState } from 'react';
import { Calendar, Clock, X, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface ExtendSubscriptionModalProps {
  admin: {
    id: string;
    storeName: string;
    subscriptionEnd: string;
    user?: {
      name?: string;
      email?: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (months: number, newEndDate: Date) => void;
}

export default function ExtendSubscriptionModal({
  admin,
  isOpen,
  onClose,
  onSuccess,
}: ExtendSubscriptionModalProps) {
  const [months, setMonths] = useState<number>(3);
  const [customMonths, setCustomMonths] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!admin) return null;

  // Calculate dates
  const currentEnd = new Date(admin.subscriptionEnd);
  const now = new Date();
  const baseDate = currentEnd > now ? currentEnd : now;

  const selectedMonths = isCustom ? (parseInt(customMonths, 10) || 0) : months;

  const calculatedNewEnd = new Date(baseDate);
  if (selectedMonths > 0) {
    calculatedNewEnd.setMonth(calculatedNewEnd.getMonth() + selectedMonths);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonths <= 0) {
      setErrorMsg('Masukkan durasi perpanjangan yang valid (minimal 1 bulan)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await api.patch(`/superadmin/admins/${admin.id}/extend`, {
        additionalMonths: selectedMonths,
      });
      onSuccess(selectedMonths, calculatedNewEnd);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Gagal memperpanjang masa aktif');
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthOptions = [
    { value: 1, label: '1 Bulan', badge: 'Standar' },
    { value: 3, label: '3 Bulan', badge: 'Populer' },
    { value: 6, label: '6 Bulan', badge: 'Hemat 10%' },
    { value: 12, label: '12 Bulan (1 Thn)', badge: 'Hemat 20%' },
  ];

  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="glass-card-dark p-6 sm:p-7 rounded-3xl border border-slate-800/80 max-w-lg w-full shadow-2xl shadow-emerald-950/20 relative space-y-6 pointer-events-auto">
          
          {/* Close Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
  
          {/* Modal Header */}
          <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Perpanjang Masa Aktif Toko
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan durasi langganan untuk <span className="text-emerald-300 font-semibold">{admin.storeName}</span>
            </p>
          </div>
        </div>

        {/* Info Card current subscription */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Pemilik Toko</span>
            <span className="text-slate-200 font-semibold">{admin.user?.name || '-'}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Berakhir Saat Ini</span>
            <span className={`font-semibold ${new Date(admin.subscriptionEnd) < new Date() ? 'text-rose-400' : 'text-slate-200'}`}>
              {new Date(admin.subscriptionEnd).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Pilih Durasi Perpanjangan
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {monthOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setMonths(opt.value);
                    setIsCustom(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    !isCustom && months === opt.value
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {!isCustom && months === opt.value && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-medium mt-1">
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom month option toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                {isCustom ? '← Pilih opsi standar' : '+ Input durasi bulan kustom'}
              </button>
              {isCustom && (
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Masukkan jumlah bulan (contoh: 2, 5, 24)"
                    value={customMonths}
                    onChange={(e) => setCustomMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* New Expiry Date Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tanggal Kadaluarsa Baru:</span>
            </div>
            <span className="font-bold text-emerald-400 text-sm">
              {selectedMonths > 0
                ? calculatedNewEnd.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </span>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Batal
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting || selectedMonths <= 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Konfirmasi Perpanjangan
              </>
            )}
          </motion.button>
        </div>
        </form>
      </div>
    </motion.div>
    </>
  );
}
