'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';
import { ResetPasswordFormProps } from '../types';

export default function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Kata sandi minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password,
      });
      onSuccess();
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          'Gagal mengatur ulang kata sandi. Token mungkin sudah kedaluwarsa atau tidak valid.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpiredError = error && (
    error.toLowerCase().includes('kadaluarsa') ||
    error.toLowerCase().includes('tidak valid') ||
    error.toLowerCase().includes('token')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
          {isExpiredError && (
            <Link
              href="/forgot-password"
              className="text-[#1DA9D0] dark:text-[#43D5CC] font-semibold underline text-[11px] ml-6 hover:opacity-80"
            >
              Minta link reset baru di sini &rarr;
            </Link>
          )}
        </div>
      )}

      {/* Password Baru */}
      <div>
        <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-2">
          Kata Sandi Baru
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full pl-10 pr-11 py-3 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-sm dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA] focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Konfirmasi Password Baru */}
      <div>
        <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-2">
          Konfirmasi Kata Sandi Baru
        </label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showConfirm ? 'text' : 'password'}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="w-full pl-10 pr-11 py-3 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-sm dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA] focus:outline-none"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-sm shadow-lg shadow-[#1DA9D0]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
        ) : (
          <span>Simpan Kata Sandi Baru</span>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#F5EACA] hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Batal, kembali ke Login
        </Link>
      </div>
    </form>
  );
}
