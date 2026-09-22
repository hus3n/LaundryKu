'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface OrderSummaryCardProps {
  notes: string;
  setNotes: (v: string) => void;
  fragrance: string;
  setFragrance: (v: string) => void;
  clothesCount?: number;
  setClothesCount: (v: number | undefined) => void;
  paymentStatus: 'UNPAID' | 'PAID';
  setPaymentStatus: (v: 'UNPAID' | 'PAID') => void;
  paymentMethod: 'CASH' | 'QRIS';
  setPaymentMethod: (v: 'CASH' | 'QRIS') => void;
  totalPrice: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  onCancel: () => void;
}

export default function OrderSummaryCard({
  notes,
  setNotes,
  fragrance,
  setFragrance,
  clothesCount,
  setClothesCount,
  paymentStatus,
  setPaymentStatus,
  paymentMethod,
  setPaymentMethod,
  totalPrice,
  isSubmitting,
  canSubmit,
  onCancel,
}: OrderSummaryCardProps) {
  return (
    <div className="glass-card-dark p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-3.5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Catatan Penting</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Baju putih dipisah, luntur"
            className="w-full px-3 py-1.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] mb-1.5 sm:mb-2.5"
          />

          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
            Parfum yang Digunakan (Opsional)
          </label>
          <input
            type="text"
            value={fragrance}
            onChange={(e) => setFragrance(e.target.value)}
            placeholder="Contoh: Molto Lavender, Downy Sunrise Fresh"
            className="w-full px-3 py-1.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
          />
          <p className="text-[9px] dark:text-[#1DA9D0]/50 text-slate-400 mt-0.5 mb-1.5 sm:mb-2.5">
            Tulis nama parfum sesuai ketersediaan stok
          </p>

          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
            Jumlah Baju (helai) <span className="dark:text-[#1DA9D0]/50 text-slate-400 font-normal">(opsional)</span>
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={clothesCount ?? ''}
            onChange={(e) => setClothesCount(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Contoh: 10"
            className="w-full px-3 py-1.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
          />
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Status Pembayaran</label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentStatus('UNPAID')}
              className={`py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold border transition-all ${
                paymentStatus === 'UNPAID'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40'
                  : 'dark:bg-[#012040] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/20 border-slate-200'
              }`}
            >
              Belum Bayar
            </button>
            <button
              type="button"
              onClick={() => setPaymentStatus('PAID')}
              className={`py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold border transition-all ${
                paymentStatus === 'PAID'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                  : 'dark:bg-[#012040] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/20 border-slate-200'
              }`}
            >
              Lunas
            </button>
          </div>

          {paymentStatus === 'PAID' && (
            <div className="mt-2 sm:mt-2.5">
              <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold border transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                      : 'dark:bg-[#012040] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/20 border-slate-200'
                  }`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold border transition-all ${
                    paymentMethod === 'QRIS'
                      ? 'dark:bg-[#1DA9D0]/20 bg-sky-100 dark:text-[#43D5CC] text-sky-700 dark:border-[#1DA9D0]/40 border-sky-300'
                      : 'dark:bg-[#012040] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/20 border-slate-200'
                  }`}
                >
                  📱 QRIS
                </button>
              </div>
            </div>
          )}

          <div className="mt-2.5 sm:mt-3.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl dark:bg-[#012040]/80 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 flex justify-between items-center">
            <span className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-600 font-medium">Total Tagihan:</span>
            <span className="text-sm sm:text-base font-bold dark:text-[#43D5CC] text-teal-600">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 sm:pt-3 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-1.5 sm:gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="w-full sm:w-auto px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-sm shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
          ) : (
            <>
              Simpan Transaksi
              <CheckCircle2 className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
