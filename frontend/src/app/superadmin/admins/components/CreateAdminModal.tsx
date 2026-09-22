'use client';

import React from 'react';
import PasswordInput from '@/components/ui/PasswordInput';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  createErrorMsg: string | null;
  storeName: string;
  setStoreName: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  durationMonths: number;
  setDurationMonths: (v: number) => void;
  isSubmitting: boolean;
}

export default function CreateAdminModal({
  isOpen,
  onClose,
  onSubmit,
  createErrorMsg,
  storeName,
  setStoreName,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
  durationMonths,
  setDurationMonths,
  isSubmitting,
}: CreateAdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#010E1C]/80 backdrop-blur-sm">
      <div className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/20 border-slate-200 max-w-md w-full space-y-4 shadow-2xl">
        <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-900">Daftarkan Admin Toko Baru</h3>

        {createErrorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs">
            {createErrorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Nama Toko Laundry</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: FreshClean Laundry"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Nama Pemilik / Admin</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bpk. Ahmad"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Email Login</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmad@laundry.com"
                className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Password</label>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">No. WhatsApp Pemilik</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Durasi Awal Berlangganan</label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
            >
              <option value={1} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">1 Bulan</option>
              <option value={3} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">3 Bulan</option>
              <option value={6} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">6 Bulan</option>
              <option value={12} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">12 Bulan (1 Tahun)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-transparent border-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] text-xs font-bold disabled:opacity-50"
            >
              Daftarkan Admin Toko
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
