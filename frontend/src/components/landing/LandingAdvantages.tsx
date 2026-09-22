'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Layers, CheckCircle2, Smartphone } from 'lucide-react';

export default function LandingAdvantages() {
  return (
    <motion.section 
      id="keunggulan" 
      className="py-24 bg-slate-100/60 dark:bg-[#010E1C]/60 border-t border-slate-200 dark:border-[#1DA9D0]/15 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              🏆 Solusi Kasir Laundry Terpercaya
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] leading-tight">
              Mengapa Memilih LaundryKu Dibanding Buku Nota Manual?
            </h2>

            <p className="text-slate-600 dark:text-[#F5EACA]/70 text-sm leading-relaxed">
              Tinggalkan risiko nota kertas hilang, selisih kas kasir, atau repot mengirim pesan penagihan satu demi satu. LaundryKu menghadirkan otomatisasi total untuk meningkatkan omset dan kepuasan pelanggan laundry Anda.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5EACA]">Hemat Waktu Hingga 80% Operasional Kasir</h3>
                  <p className="text-xs text-slate-600 dark:text-[#F5EACA]/60 mt-0.5">Input order cepat dalam hitungan detik, kalkulasi harga otomatis, dan notifikasi terkirim seketika.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5EACA]">Bebas Biaya Per Pesan WhatsApp</h3>
                  <p className="text-xs text-slate-600 dark:text-[#F5EACA]/60 mt-0.5">Gunakan nomor WhatsApp toko Anda sendiri tanpa perlu top-up saldo SMS atau biaya langganan API berbayar per pesan.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5EACA]">Akses Multi-Device via HP & Komputer</h3>
                  <p className="text-xs text-slate-600 dark:text-[#F5EACA]/60 mt-0.5">Bisa dibuka bersamaan di handphone karyawan dan laptop pemilik toko secara real-time dari mana saja.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5EACA]">Data Terjamin Aman & Ter-Backup Harian</h3>
                  <p className="text-xs text-slate-600 dark:text-[#F5EACA]/60 mt-0.5">Terintegrasi dengan bot Telegram untuk backup otomatis basis data harian tanpa takut data hilang.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Comparison Card */}
          <motion.div 
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600 dark:text-[#43D5CC]" /> Perbandingan Sistem Kasir
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/15 flex justify-between items-center">
                <span className="text-slate-700 dark:text-[#F5EACA]/80 font-medium">Buku Nota Kertas Manual</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Kertas Sobek & Sulit Dilacak</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/15 flex justify-between items-center">
                <span className="text-slate-700 dark:text-[#F5EACA]/80 font-medium">Kirim Chat WhatsApp Manual</span>
                <span className="text-amber-600 dark:text-[#EA8803] font-semibold">Menyita Waktu Kasir & Rawan Lupa</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex justify-between items-center text-emerald-800 dark:text-emerald-300 font-bold">
                <span>Aplikasi Kasir LaundryKu v1.0</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Serba Otomatis & Terpusat
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-[#012040]/70 border border-sky-200 dark:border-[#1DA9D0]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-[#43D5CC] font-semibold">
                <Smartphone className="w-4 h-4" /> Kompatibel dengan Segala Perangkat
              </div>
              <p className="text-[11px] text-slate-600 dark:text-[#F5EACA]/60 leading-relaxed">
                Dapat dioperasikan di Android, iOS, Windows, macOS, printer kasir Bluetooth thermal 58mm/80mm, serta barcode scanner.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
