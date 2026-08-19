'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        className="text-center mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img
            src="/logo/laundryku-icon.svg"
            alt="LaundryKu"
            className="w-12 h-12 rounded-2xl shadow-lg shadow-[#1DA9D0]/30 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#F5EACA] via-[#F5EACA]/90 to-[#43D5CC] bg-clip-text text-transparent">
            Laundry<span className="bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] bg-clip-text text-transparent">Ku</span>{' '}
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-[#F5EACA] mt-6">Masuk ke Akun Anda</h1>
        <p className="text-xs text-[#F5EACA]/60 mt-1">SuperAdmin, Owner (Admin), atau Staf Karyawan</p>
      </motion.div>

      {/* Card Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15 shadow-2xl backdrop-blur-2xl"
      >
        <AnimatePresence>
          {expiredMsg && (
            <motion.div 
              key="expired-msg"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-6 p-3.5 rounded-xl bg-[#EA8803]/10 border border-[#EA8803]/30 text-[#EA8803] text-xs flex items-center gap-2.5 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EA8803]" />
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
              className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@laundryku.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-sm text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#F5EACA]/80">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#43D5CC] hover:text-[#1DA9D0] transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-sm text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-sm shadow-lg shadow-[#1DA9D0]/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full" />
            ) : (
              <>
                Masuk Sekarang
                <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1DA9D0]/15 text-center">
          <p className="text-xs text-[#F5EACA]/60">
            Belum punya akun laundry toko?{' '}
            <a
              href="https://wa.me/?text=Halo%20SuperAdmin%20LaundryKu,%20saya%20ingin%20mendaftar%20akun%20Admin"
              target="_blank"
              rel="noreferrer"
              className="text-[#43D5CC] font-semibold hover:underline"
            >
              Daftar via WA SuperAdmin
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#010E1C] text-[#F5EACA] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#015383]/20 rounded-full blur-[100px] pointer-events-none" />

      <Suspense fallback={<div className="text-xs text-[#F5EACA]/60">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

