'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LandingHowItWorks() {
  return (
    <motion.section 
      id="cara-kerja" 
      className="py-24 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-[#1DA9D0]/10 border border-sky-200 dark:border-[#1DA9D0]/20 text-xs font-semibold text-sky-700 dark:text-[#43D5CC]">
            ⚡ Sederhana & Efisien
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-[#F5EACA]">4 Langkah Mudah Cara Kerja LaundryKu</h2>
          <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm">Alur operasional yang dirancang agar kasir dan staf dapat memproses order cucian dalam hitungan detik.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none relative space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-[#1DA9D0]/20 text-sky-700 dark:text-[#43D5CC] font-bold flex items-center justify-center text-base border border-sky-200 dark:border-[#1DA9D0]/30">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-[#F5EACA] text-base">Terima & Input Order</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-xs leading-relaxed">
              Kasir memasukkan nomor pelanggan, memilih paket kiloan/satuan, dan menimbang berat pakaian.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none relative space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#1DA9D0]/20 text-teal-700 dark:text-[#43D5CC] font-bold flex items-center justify-center text-base border border-teal-200 dark:border-[#1DA9D0]/30">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-[#F5EACA] text-base">Proses Pencucian</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-xs leading-relaxed">
              Pakaian diproses (Cuci, Kering, Setrika). Status order diperbarui dengan mudah dari HP atau komputer kasir.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none relative space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-base border border-emerald-200 dark:border-emerald-500/30">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-[#F5EACA] text-base">Notifikasi WA Otomatis</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-xs leading-relaxed">
              Begitu status diganti ke <em>SELESAI</em>, sistem otomatis mengirim pesan WhatsApp ke pelanggan bahwa cucian siap diambil.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none relative space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#015383]/20 text-indigo-700 dark:text-[#43D5CC] font-bold flex items-center justify-center text-base border border-indigo-200 dark:border-[#015383]/30">
              4
            </div>
            <h3 className="font-bold text-slate-900 dark:text-[#F5EACA] text-base">Ambil & Cetak Nota Struk</h3>
            <p className="text-slate-600 dark:text-[#F5EACA]/60 text-xs leading-relaxed">
              Pelanggan mengambil cucian dan membayar lunas. Kasir dapat mencetak nota thermal atau membagikan e-nota.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
