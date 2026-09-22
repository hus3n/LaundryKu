'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Printer, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthBrandPane() {
  const highlights = [
    {
      icon: MessageSquare,
      title: 'Nota WhatsApp Otomatis',
      desc: 'Kirim notifikasi status & struk digital otomatis langsung ke WhatsApp pelanggan tanpa repot simpan nomor.',
    },
    {
      icon: Printer,
      title: 'Cetak Bluetooth Thermal',
      desc: 'Dukungan penuh printer kasir thermal 58mm & 80mm via koneksi Bluetooth cepat dan stabil.',
    },
    {
      icon: BarChart3,
      title: 'Laporan Finansial & Omset',
      desc: 'Pantau omset harian, performa karyawan, dan status cucian secara realtime dari mana saja.',
    },
  ];

  return (
    <div className="relative hidden md:flex flex-col justify-between p-7 lg:p-9 bg-gradient-to-br from-slate-100 via-sky-50 to-teal-50 dark:from-[#01162C] dark:via-[#012040] dark:to-[#013455] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-[#1DA9D0]/20 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#1DA9D0]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#43D5CC]/15 dark:bg-[#015383]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group mb-6">
          <img
            src="/logo/laundryku.png"
            alt="LaundryKu Logo"
            className="w-11 h-11 rounded-2xl object-contain shadow-lg shadow-[#1DA9D0]/30 transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-[#F5EACA]">
                Laundry
                <span className="text-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] dark:bg-clip-text dark:text-transparent">
                  Ku
                </span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1DA9D0]/15 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#F5EACA]/60">
              Sistem Manajemen Laundry Modern
            </p>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-[#013D66]/60 border border-sky-300/60 dark:border-[#1DA9D0]/30 text-[11px] font-semibold text-sky-700 dark:text-[#43D5CC] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Aplikasi Kasir Laundry #1 di Indonesia
        </div>

        <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-[#F5EACA] leading-snug">
          Otomatiskan Kasir, Pantau Cucian & Tingkatkan Omset Toko Anda.
        </h2>
      </div>

      {/* Center Value Highlights */}
      <div className="relative z-10 my-8 space-y-4">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 dark:bg-[#012040]/50 border border-slate-200/60 dark:border-[#1DA9D0]/15 backdrop-blur-sm shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1DA9D0] to-[#015383] flex items-center justify-center shrink-0 shadow-md shadow-[#1DA9D0]/20 text-white">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F5EACA]">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-[#F5EACA]/70 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Trust Badge */}
      <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-[#1DA9D0]/20 flex items-center gap-2.5 text-xs text-slate-600 dark:text-[#F5EACA]/70">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Trial Gratis 30 Hari • Tanpa Kartu Kredit • Data Aman di Cloud</span>
      </div>
    </div>
  );
}
