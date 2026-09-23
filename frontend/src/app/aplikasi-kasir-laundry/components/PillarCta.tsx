'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export default function PillarCta() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#012040] via-[#010E1C] to-[#013D66] border border-[#1DA9D0]/30 p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#1DA9D0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#43D5CC]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#43D5CC] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mulai Transformasi Digital Toko Anda</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F5EACA] tracking-tight leading-tight">
            Tingkatkan Omset &amp; Kepuasan Pelanggan Laundry Anda Hari Ini
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#F5EACA]/80 leading-relaxed">
            Dapatkan akses penuh ke sistem kasir, notifikasi WhatsApp otomatis, dan pencatatan keuangan akurat dalam 3 menit.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#1DA9D0]/30 hover:opacity-95 transition-all"
            >
              <span>Daftar Akun Toko Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/6285229925593?text=Halo%20SuperAdmin%20LaundryKu,%20saya%20ingin%20berlangganan%20aplikasi%20kasir%20laundry"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#43D5CC]" />
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
