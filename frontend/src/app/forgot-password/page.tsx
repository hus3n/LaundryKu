'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shirt, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { SUPERADMIN_WA_NUMBER } from '@/components/landing/landingData';

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
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1DA9D0] dark:bg-gradient-to-tr dark:from-[#1DA9D0] dark:to-[#43D5CC] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/30">
              <Shirt className="w-7 h-7 text-[#010E1C]" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:bg-gradient-to-r dark:from-[#F5EACA] dark:via-[#F5EACA]/90 dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">
              LaundryKu
            </span>
          </Link>
          <h1 className="text-xl font-bold dark:text-[#F5EACA] text-slate-900 mt-6">Reset Password Akun</h1>
          <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">Masukkan email terdaftar untuk menerima link instruksi</p>
        </div>

        <div className="glass-card-dark p-8 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-2xl backdrop-blur-2xl">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold dark:text-[#F5EACA] text-slate-900">Instruksi Terkirim</h3>
              <p className="text-xs dark:text-[#F5EACA]/80 text-slate-700 leading-relaxed">
                Jika email <span className="text-[#1DA9D0] dark:text-[#43D5CC] font-semibold">{email}</span> terdaftar di LaundryKu, tautan reset password telah dikirimkan ke kotak masuk Anda.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20 text-[11px] text-slate-500 dark:text-[#F5EACA]/60 text-left">
                💡 <strong>Tips:</strong> Periksa juga folder <em>Spam / Junk</em> jika pesan belum tiba dalam 2 menit. Tautan aktif selama 24 jam.
              </div>
              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] hover:opacity-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </Link>
                <a
                  href={`https://wa.me/${SUPERADMIN_WA_NUMBER}?text=Halo%20Admin%20LaundryKu,%20saya%20sudah%20mengirim%20permintaan%20reset%20password%20untuk%20email%20${encodeURIComponent(email)}%20namun%20memerlukan%20bantuan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-600 dark:text-[#F5EACA]/70 hover:text-emerald-600 dark:hover:text-emerald-400 py-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tidak menerima email? Hubungi Bantuan CS WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-2">
                  Alamat Email Akun
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@laundryku.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-sm dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-sm shadow-lg shadow-[#1DA9D0]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                  className="inline-flex items-center gap-2 text-xs font-medium dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#F5EACA] hover:text-slate-900 transition-colors"
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

