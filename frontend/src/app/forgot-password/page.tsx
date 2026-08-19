'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shirt, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Gagal mengirim instruksi reset password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010E1C] text-[#F5EACA] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1DA9D0] to-[#43D5CC] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/30">
              <Shirt className="w-7 h-7 text-[#010E1C]" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#F5EACA] via-[#F5EACA]/90 to-[#43D5CC] bg-clip-text text-transparent">
              LaundryKu
            </span>
          </Link>
          <h1 className="text-xl font-bold text-[#F5EACA] mt-6">Reset Password Akun</h1>
          <p className="text-xs text-[#F5EACA]/60 mt-1">Masukkan email terdaftar untuk menerima link instruksi</p>
        </div>

        <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15 shadow-2xl backdrop-blur-2xl">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#F5EACA]">Instruksi Terkirim</h3>
              <p className="text-xs text-[#F5EACA]/80 leading-relaxed">
                Jika email <span className="text-[#43D5CC] font-semibold">{email}</span> terdaftar di LaundryKu, link reset password telah dikirimkan ke inbox Anda.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#43D5CC] hover:text-[#1DA9D0]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-2">
                  Alamat Email Akun
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@laundryku.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-sm text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-sm shadow-lg shadow-[#1DA9D0]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
                ) : (
                  <>
                    Kirim Link Reset
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#F5EACA]/60 hover:text-[#F5EACA]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Batal, kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

