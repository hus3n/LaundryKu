'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginFormViewProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  error: string | null;
  expiredMsg: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToRegister: () => void;
}

export default function LoginFormView({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  expiredMsg,
  isSubmitting,
  onSubmit,
  onSwitchToRegister,
}: LoginFormViewProps) {
  return (
    <motion.div
      key="auth-login-view"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
    >
      {expiredMsg && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 dark:bg-[#EA8803]/10 border border-amber-500/30 text-amber-700 dark:text-[#EA8803] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-[#EA8803]" />
          Sesi Anda telah berakhir. Silakan login kembali.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-4">
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@laundryku.com"
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-[#012040] border border-slate-300 dark:border-[#1DA9D0]/25 text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA] placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] sm:text-xs text-[#1DA9D0] dark:text-[#43D5CC] hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-[#012040] border border-slate-300 dark:border-[#1DA9D0]/25 text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA] placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA] p-1 cursor-pointer"
              aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-2.5 sm:py-3 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs sm:text-sm shadow-md shadow-[#1DA9D0]/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all mt-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
          ) : (
            <>
              Masuk Sekarang
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Bottom Switch Link */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#F5EACA]/70">
          Belum punya akun toko laundry?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#1DA9D0] dark:text-[#43D5CC] font-bold hover:underline cursor-pointer ml-1"
          >
            Daftar Akun Baru (Trial 30 Hari)
          </button>
        </p>
      </div>
    </motion.div>
  );
}
