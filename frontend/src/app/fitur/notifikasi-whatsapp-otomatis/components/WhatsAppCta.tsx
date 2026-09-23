'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, BookOpen, Layers } from 'lucide-react';

export default function WhatsAppCta() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-gradient-to-br from-[#012040] via-[#010E1C] to-[#013D66] border border-[#1DA9D0]/30 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5EACA] tracking-tight">
            Hubungkan WhatsApp Toko Laundry Anda Sekarang
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#F5EACA]/80 leading-relaxed">
            Scan QR langsung dari dashboard toko Anda dalam 1 menit dan nikmati pengiriman pesan notifikasi otomatis tanpa biaya kuota.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-extrabold text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all"
            >
              <span>Aktivasi Akun Toko Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/6285229925593?text=Halo%20Admin%20LaundryKu,%20saya%20tertarik%20dengan%20fitur%20notifikasi%20WhatsApp%20otomatis%20gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#43D5CC]" />
              <span>Tanya SuperAdmin WA</span>
            </a>
          </div>

          {/* Contextual Internal Links Back to Pillar & Comparison */}
          <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#F5EACA]/75">
            <Link
              href="/aplikasi-kasir-laundry"
              className="inline-flex items-center gap-1.5 hover:text-[#43D5CC] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pelajari Seluruh Fitur Aplikasi Kasir Laundry</span>
            </Link>
            <Link
              href="/komparasi"
              className="inline-flex items-center gap-1.5 hover:text-[#43D5CC] transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bandingkan Biaya Notifikasi vs POS Konvensional</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
