'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, MessageSquare, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { containerVariants, itemVariants } from './landingData';

export default function LandingHero() {
  return (
    <section className="relative pt-16 sm:pt-20 pb-28 sm:pb-32 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-7 sm:space-y-8">
          {/* Top Pill Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1DA9D0]/10 dark:bg-[#012040] border border-[#1DA9D0]/25 text-xs font-bold text-[#015383] dark:text-[#43D5CC] backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1DA9D0] dark:text-[#43D5CC] shrink-0 animate-pulse" />
            <span>Sistem Kasir POS &amp; Otomasi Laundry #1 di Indonesia</span>
          </motion.div>

          {/* Main Headline H1 */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-[#F5EACA] leading-[1.12]"
          >
            Kelola Usaha Laundry Lebih{' '}
            <span className="bg-gradient-to-r from-[#013D66] via-[#1DA9D0] to-[#015383] dark:from-[#1DA9D0] dark:via-[#43D5CC] dark:to-[#F5EACA] bg-clip-text text-transparent">
              Modern, Cepat &amp; Otomatis
            </span>
          </motion.h1>

          {/* Subtitle Copywriting */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-[#F5EACA]/75 leading-relaxed max-w-xl font-normal"
          >
            Tinggalkan pencatatan nota manual yang berisiko selisih. <strong className="font-bold text-slate-900 dark:text-[#F5EACA]">LaundryKu</strong> menghadirkan sistem kasir POS cloud terpadu dengan notifikasi WhatsApp otomatis ke pelanggan, cetak struk thermal instan, dan laporan omset laba-rugi akurat secara <em>real-time</em>.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link href="/register" className="flex-1 sm:flex-none">
              <motion.div
                whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:via-[#015383] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-sm sm:text-base shadow-xl shadow-[#1DA9D0]/20 flex items-center justify-center gap-3 group transition-all cursor-pointer"
              >
                <span>Mulai Coba Gratis 30 Hari</span>
                <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></motion.span>
              </motion.div>
            </Link>
            <Link href="/login" className="flex-1 sm:flex-none">
              <motion.div
                whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-white dark:bg-[#013D66] text-slate-800 dark:text-[#F5EACA] border border-slate-200 dark:border-[#1DA9D0]/25 font-semibold text-sm sm:text-base text-center hover:bg-slate-50 dark:hover:bg-[#014775] transition-colors shadow-sm dark:shadow-none cursor-pointer"
              >
                Masuk ke Aplikasi Kasir
              </motion.div>
            </Link>
          </motion.div>

          {/* Key Value Proposition Metrics */}
          <motion.div variants={itemVariants} className="pt-6 grid grid-cols-3 gap-4 sm:gap-6 border-t border-slate-200 dark:border-[#1DA9D0]/15">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">Bebas Potongan Komisi</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">0 Rupiah</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">Biaya Notifikasi WA</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5EACA]">24/7</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60 mt-0.5">Akses Cloud &amp; Telegram Backup</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Hero Card Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="relative"
        >
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="glass-card-dark p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/25 shadow-xl dark:shadow-2xl relative z-20 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-[#1DA9D0]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-[#1DA9D0]/20 border border-sky-200 dark:border-[#1DA9D0]/30 flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-sky-600 dark:text-[#43D5CC]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5EACA]">Nota #LK-2026-089</h3>
                    <p className="text-xs text-slate-500 dark:text-[#F5EACA]/60">Pelanggan: Ibu Rina (0812-3456-7890)</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                  Selesai &amp; Siap Diambil
                </span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1DA9D0]/10">
                  <span className="text-slate-500 dark:text-[#F5EACA]/60">Paket Cucian</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F5EACA]">Cuci Komplit Kiloan (5 kg)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1DA9D0]/10">
                  <span className="text-slate-500 dark:text-[#F5EACA]/60">Total Pembayaran</span>
                  <span className="font-bold text-sky-600 dark:text-[#43D5CC] text-sm">Rp 35.000 (Lunas)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 dark:text-[#F5EACA]/60">Notifikasi WA Toko</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim Otomatis
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">WhatsApp Pelanggan:</p>
                  <p className="text-emerald-700 dark:text-emerald-200/80 leading-relaxed">
                    &quot;Halo Kak Rina, cucian Anda #LK-2026-089 sudah SELESAI dan siap diambil...&quot;
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="absolute -top-6 -left-6 w-full h-full glass-card-dark p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/15 opacity-60 transform -rotate-3 z-10 hidden sm:block pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-full h-full glass-card-dark p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/15 opacity-40 transform rotate-3 z-0 hidden sm:block pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
