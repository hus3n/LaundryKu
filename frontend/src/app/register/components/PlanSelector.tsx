'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react';
import { PlanType } from '../types';
import { cardHover, slideUp } from '@/lib/animations';

interface PlanSelectorProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  durationMonths: number;
  onChangeDuration: (months: number) => void;
}

export type SubscriptionTier = 'single' | 'unlimited' | 'enterprise';

interface TierPricing {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  options: {
    months: number;
    label: string;
    price: string;
    discount?: string | null;
  }[];
}

const SUBSCRIPTION_TIERS: TierPricing[] = [
  {
    id: 'single',
    name: 'Tanpa Cabang',
    badge: 'Mulai 30k',
    options: [
      { months: 1, label: '1 Bulan', price: 'Rp 30.000', discount: null },
      { months: 6, label: '6 Bulan', price: 'Rp 180.000', discount: 'Prioritas' },
      { months: 12, label: '1 Tahun', price: 'Rp 350.000', discount: 'Paling Hemat' },
    ],
  },
  {
    id: 'unlimited',
    name: 'Cabang & Karyawan Tak Terbatas',
    badge: 'Terpopuler',
    options: [
      { months: 1, label: '1 Bulan', price: 'Rp 77.000', discount: null },
      { months: 6, label: '6 Bulan', price: 'Rp 440.000', discount: 'Prioritas' },
      { months: 12, label: '1 Tahun', price: 'Rp 770.000', discount: 'Hemat Maksimal' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Dedicated',
    options: [
      { months: 1, label: '1 Bulan', price: 'Rp 300.000', discount: 'Dedicated SLA' },
      { months: 6, label: '6 Bulan', price: 'Rp 1.800.000', discount: 'Dedicated SLA' },
      { months: 12, label: '1 Tahun', price: 'Rp 3.600.000', discount: 'Dedicated SLA' },
    ],
  },
];

export default function PlanSelector({
  selectedPlan,
  onSelectPlan,
  durationMonths,
  onChangeDuration,
}: PlanSelectorProps) {
  const [activeTier, setActiveTier] = useState<SubscriptionTier>('single');

  const currentTierData = SUBSCRIPTION_TIERS.find((t) => t.id === activeTier) || SUBSCRIPTION_TIERS[0];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-[#F5EACA] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
          Pilih Paket Akun Toko:
        </label>
        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#F5EACA]/60">
          Dapat di-upgrade sewaktu-waktu
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* Card 1: Trial 30 Hari Premium */}
        <motion.div
          variants={slideUp}
          whileHover={cardHover.hover}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectPlan('TRIAL')}
          className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
            selectedPlan === 'TRIAL'
              ? 'border-2 border-[#1DA9D0] bg-sky-50/70 dark:bg-[#012040] shadow-md shadow-[#1DA9D0]/20'
              : 'border-slate-200 dark:border-[#1DA9D0]/20 bg-white dark:bg-[#012040]/40 hover:border-slate-300 dark:hover:border-[#1DA9D0]/40'
          }`}
        >
          <div className="absolute -top-2 right-2.5 sm:-top-2.5 sm:right-3 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1DA9D0] text-[#010E1C] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
            Rekomendasi
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-100 dark:bg-[#013D66] flex items-center justify-center text-[#1DA9D0] dark:text-[#43D5CC] shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F5EACA]">Trial 30 Hari</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#F5EACA]/60">Akses Premium Penuh</p>
              </div>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-[#1DA9D0]/15">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5EACA]">Rp 0</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#F5EACA]/60 font-medium">/ 30 hari</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Coba gratis tanpa kartu kredit
              </p>
            </div>

            <ul className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 text-[10px] sm:text-[11px] text-slate-600 dark:text-[#F5EACA]/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Semua Fitur Premium Terbuka</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Notifikasi WhatsApp Otomatis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Kasir POS &amp; Cetak Struk Nota</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Laporan Omset &amp; Pengeluaran</span>
              </li>
            </ul>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
            <span
              className={`text-[11px] sm:text-xs font-bold ${
                selectedPlan === 'TRIAL'
                  ? 'text-[#1DA9D0] dark:text-[#43D5CC]'
                  : 'text-slate-500 dark:text-[#F5EACA]/60'
              }`}
            >
              {selectedPlan === 'TRIAL' ? '✓ Terpilih' : 'Pilih Trial 30 Hari'}
            </span>
          </div>
        </motion.div>

        {/* Card 2: Langsung Berlangganan Premium */}
        <motion.div
          variants={slideUp}
          whileHover={cardHover.hover}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectPlan('DIRECT_SUBSCRIPTION')}
          className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
            selectedPlan === 'DIRECT_SUBSCRIPTION'
              ? 'border-2 border-emerald-500 bg-emerald-50/60 dark:bg-[#012040] shadow-md shadow-emerald-500/20'
              : 'border-slate-200 dark:border-[#1DA9D0]/20 bg-white dark:bg-[#012040]/40 hover:border-slate-300 dark:hover:border-[#1DA9D0]/40'
          }`}
        >
          <div className="absolute -top-2 right-2.5 sm:-top-2.5 sm:right-3 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
            Full Premium
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F5EACA]">Langganan</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#F5EACA]/60">Langsung Aktif</p>
              </div>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-[#1DA9D0]/15">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5EACA]">Mulai 30rb</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#F5EACA]/60 font-medium">/ bulan</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Bebas batasan masa uji coba
              </p>
            </div>

            <ul className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 text-[10px] sm:text-[11px] text-slate-600 dark:text-[#F5EACA]/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Semua Fitur Premium Siap Pakai</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Prioritas Integrasi WhatsApp Toko</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Auto-Backup Rutin ke Telegram</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Support Prioritas Teknis</span>
              </li>
            </ul>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
            <span
              className={`text-[11px] sm:text-xs font-bold ${
                selectedPlan === 'DIRECT_SUBSCRIPTION'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-[#F5EACA]/60'
              }`}
            >
              {selectedPlan === 'DIRECT_SUBSCRIPTION' ? '✓ Terpilih' : 'Pilih Langganan'}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Gratis (Dasar) */}
        <motion.div
          variants={slideUp}
          whileHover={cardHover.hover}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectPlan('FREE')}
          className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
            selectedPlan === 'FREE'
              ? 'border-2 border-slate-700 dark:border-slate-400 bg-slate-100/80 dark:bg-[#012040] shadow-md'
              : 'border-slate-200 dark:border-[#1DA9D0]/20 bg-white dark:bg-[#012040]/40 hover:border-slate-300 dark:hover:border-[#1DA9D0]/40'
          }`}
        >
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F5EACA]">Paket Gratis</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#F5EACA]/60">Akses Kasir Dasar</p>
              </div>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-[#1DA9D0]/15">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5EACA]">Rp 0</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#F5EACA]/60 font-medium">/ selamanya</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#F5EACA]/60 font-semibold mt-0.5">
                Tanpa batas waktu pemakaian
              </p>
            </div>

            <ul className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 text-[10px] sm:text-[11px] text-slate-600 dark:text-[#F5EACA]/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Kasir POS &amp; Kelola Order</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Cetak Nota Struk Thermal / PDF</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                <span>Kelola Pelanggan &amp; Paket Cuci</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 dark:text-[#F5EACA]/40">
                <span className="w-3 h-3 text-center font-bold">✕</span>
                <span>Tanpa Notifikasi WA Otomatis</span>
              </li>
            </ul>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
            <span
              className={`text-[11px] sm:text-xs font-bold ${
                selectedPlan === 'FREE'
                  ? 'text-slate-800 dark:text-slate-200'
                  : 'text-slate-500 dark:text-[#F5EACA]/60'
              }`}
            >
              {selectedPlan === 'FREE' ? '✓ Terpilih' : 'Pilih Paket Gratis'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* If Direct Subscription is selected, show Tier and Duration Selector */}
      {selectedPlan === 'DIRECT_SUBSCRIPTION' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/80 dark:bg-[#012040]/70 border border-emerald-300 dark:border-emerald-500/30 space-y-3"
        >
          {/* Tier Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-900 dark:text-emerald-300">
                1. Pilih Skala Paket:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SUBSCRIPTION_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTier(tier.id)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    activeTier === tier.id
                      ? 'border-2 border-emerald-600 dark:border-emerald-400 bg-white dark:bg-[#013D66] shadow-sm'
                      : 'border-slate-200 dark:border-[#1DA9D0]/20 bg-white/60 dark:bg-[#012040]/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      {tier.badge}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-slate-900 dark:text-[#F5EACA] mt-1 leading-snug">
                    {tier.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-900 dark:text-emerald-300">
                2. Pilih Periode Tagihan:
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                Aktivasi instan
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {currentTierData.options.map((opt) => (
                <button
                  key={opt.months}
                  type="button"
                  onClick={() => onChangeDuration(opt.months)}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border text-center transition-all cursor-pointer ${
                    durationMonths === opt.months
                      ? 'border-2 border-emerald-600 dark:border-emerald-400 bg-white dark:bg-[#013D66] shadow-sm text-slate-900 dark:text-[#F5EACA]'
                      : 'border-slate-200 dark:border-[#1DA9D0]/20 bg-white/70 dark:bg-[#012040]/50 text-slate-700 dark:text-[#F5EACA]/70 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {opt.price}
                  </div>
                  {opt.discount && (
                    <span className="inline-block mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-[8px] sm:text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                      {opt.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
