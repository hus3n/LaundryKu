'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Store, Mail } from 'lucide-react';
import { PlanType } from '../types';

interface RegisterSuccessModalProps {
  isOpen: boolean;
  storeName: string;
  email: string;
  planType: PlanType;
  durationMonths?: number;
  onContinue: () => void;
}

export default function RegisterSuccessModal({
  isOpen,
  storeName,
  email,
  planType,
  durationMonths = 1,
  onContinue,
}: RegisterSuccessModalProps) {
  if (!isOpen) return null;

  const getPlanBadge = () => {
    switch (planType) {
      case 'TRIAL':
        return {
          title: 'Trial 30 Hari Premium Aktif',
          desc: 'Anda memiliki akses penuh tanpa biaya selama 30 hari ke depan termasuk fitur WhatsApp bot.',
          color: 'bg-[#1DA9D0] text-[#010E1C]',
        };
      case 'DIRECT_SUBSCRIPTION':
        return {
          title: `Langganan Premium (${durationMonths} Bulan) Aktif`,
          desc: 'Akun toko Anda telah aktif dengan akses penuh semua fitur sistem kasir dan WhatsApp otomatis.',
          color: 'bg-emerald-500 text-white',
        };
      case 'FREE':
        return {
          title: 'Paket Gratis (Dasar) Aktif',
          desc: 'Akun kasir laundry Anda aktif selamanya untuk pencatatan transaksi kasir POS.',
          color: 'bg-slate-800 text-white',
        };
    }
  };

  const planInfo = getPlanBadge();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white dark:bg-[#012040] rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/30 shadow-2xl p-6 sm:p-8 relative text-center space-y-5"
        >
          {/* Top icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#F5EACA]/70">
              Selamat datang di LaundryKu. Akun toko laundry Anda telah berhasil dibuat dan siap digunakan.
            </p>
          </div>

          {/* Account Card Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#013D66]/40 border border-slate-200 dark:border-[#1DA9D0]/15 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-[#F5EACA]/60 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Toko:
              </span>
              <span className="font-bold text-slate-900 dark:text-[#F5EACA]">{storeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-[#F5EACA]/60 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email:
              </span>
              <span className="font-bold text-slate-900 dark:text-[#F5EACA]">{email}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-[#1DA9D0]/15">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 dark:text-[#F5EACA]/60 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1DA9D0]" /> Status Paket:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${planInfo.color}`}>
                  {planInfo.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-[#F5EACA]/70 leading-relaxed mt-1">
                {planInfo.desc}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full py-3.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Masuk ke Dashboard Sekarang
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
