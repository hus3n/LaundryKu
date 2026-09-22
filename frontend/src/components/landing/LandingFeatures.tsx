'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Users, Shirt, Printer, ShieldCheck } from 'lucide-react';

export default function LandingFeatures() {
  return (
    <motion.section 
      id="fitur" 
      className="py-24 bg-slate-100/60 dark:bg-[#010E1C]/60 border-t border-slate-200 dark:border-[#1DA9D0]/15 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-[#F5EACA]">Fitur Lengkap Aplikasi Kasir & Manajemen Laundry</h2>
          <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm">Dirancang khusus menjawab kebutuhan harian pemilik usaha laundry kiloan maupun satuan, kasir, dan pelanggan.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-[#1DA9D0]/20 border border-sky-200 dark:border-[#1DA9D0]/30 flex items-center justify-center text-sky-600 dark:text-[#43D5CC] mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">WhatsApp Auto-Notification</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Pelanggan menerima pesan WhatsApp otomatis saat order dibuat, cucian selesai dicuci, hingga lunas diambil tanpa perlu biaya per pesan.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-[#1DA9D0]/20 border border-teal-200 dark:border-[#1DA9D0]/30 flex items-center justify-center text-teal-600 dark:text-[#43D5CC] mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">Analitik & Grafik Omset Keuangan</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Pantau tren omset harian, pendapatan bulanan, filter paket cucian terlaris, serta pencatatan pengeluaran operasional toko laundry secara terpusat.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-[#1DA9D0]/20 border border-indigo-200 dark:border-[#1DA9D0]/30 flex items-center justify-center text-indigo-600 dark:text-[#43D5CC] mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">Multi-Role Staf & Kasir</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Hak akses terproteksi: SuperAdmin untuk kelola lisensi, Admin Toko untuk monitor omset dan laporan, serta Kasir/Karyawan untuk input order cepat.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-[#1DA9D0]/20 border border-sky-200 dark:border-[#1DA9D0]/30 flex items-center justify-center text-sky-600 dark:text-[#43D5CC] mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">Katalog Paket & Layanan Fleksibel</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Bebas sesuaikan paket kiloan reguler, kilat/express, paket satuan boneka, karpet, bed cover lengkap dengan estimasi durasi pengerjaan.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-[#EA8803]/20 border border-amber-200 dark:border-[#EA8803]/30 flex items-center justify-center text-amber-600 dark:text-[#EA8803] mb-6">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">Cetak Nota Thermal & Digital PDF</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Cetak struk nota kasir ke printer Bluetooth / USB kasir dalam ukuran 58mm & 80mm, serta kirim e-nota digital profesional berlogo toko.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-8 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2">Keamanan Data & Auto-Backup Telegram</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm leading-relaxed">
              Data toko Anda diamankan dengan database PostgreSQL terenkripsi dan sistem backup otomatis harian langsung ke bot Telegram privat.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
