'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiredMsg, setExpiredMsg] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setExpiredMsg(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'SUPERADMIN') {
        router.push('/superadmin/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'EMPLOYEE') {
        router.push('/karyawan/laundry');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'SUPERADMIN') {
        router.push('/superadmin/dashboard');
      } else if (loggedUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/karyawan/laundry');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo & Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="text-center mb-4 sm:mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
          <img
            src="/logo/laundryku.png"
            alt="LaundryKu"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-contain shadow-lg shadow-[#1DA9D0]/30 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:bg-gradient-to-r dark:from-[#F5EACA] dark:via-[#F5EACA]/90 dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">
            Laundry<span className="text-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">Ku</span>{' '}
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 text-[#1DA9D0] dark:text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold dark:text-[#F5EACA] text-slate-900 mt-3 sm:mt-6">Masuk ke Akun Anda</h1>
        <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">SuperAdmin, Owner (Admin), atau Staf Karyawan</p>
      </motion.div>

      {/* Card Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="glass-card-dark p-4 sm:p-8 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-2xl backdrop-blur-2xl"
      >
        <AnimatePresence>
          {expiredMsg && (
            <motion.div 
              key="expired-msg"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-3 sm:mb-6 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-amber-500/10 dark:bg-[#EA8803]/10 border border-amber-500/30 dark:border-[#EA8803]/30 text-amber-700 dark:text-[#EA8803] text-xs flex items-center gap-2 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-[#EA8803]" />
              Sesi Anda telah berakhir. Silakan login kembali.
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="login-error"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-3 sm:mb-6 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1 sm:mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@laundryku.com"
                className="w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs sm:text-sm dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] sm:text-xs text-[#1DA9D0] dark:text-[#43D5CC] hover:underline transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-8.5 sm:pl-10 pr-10 sm:pr-11 py-2 sm:py-3 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs sm:text-sm dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA] focus:outline-none p-1 rounded-lg transition-colors"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs sm:text-sm shadow-lg shadow-[#1DA9D0]/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full" />
            ) : (
              <>
                Masuk Sekarang
                <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></motion.span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t dark:border-[#1DA9D0]/15 border-slate-200 text-center space-y-1.5 sm:space-y-2">
          <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/70 text-slate-600">
            Belum punya akun laundry toko?{' '}
            <Link
              href="/register"
              className="text-[#1DA9D0] dark:text-[#43D5CC] font-bold hover:underline"
            >
              Daftar Akun Baru (Trial 30 Hari)
            </Link>
          </p>
          <div>
            <a
              href="https://wa.me/?text=Halo%20SuperAdmin%20LaundryKu,%20saya%20ingin%20mendaftar%20akun%20Admin"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-[#F5EACA]/80 transition-colors inline-block"
            >
              atau hubungi SuperAdmin via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#015383]/20 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />

      <Suspense fallback={<div className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

