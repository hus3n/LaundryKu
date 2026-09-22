'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getWaRegisterUrl } from './landingData';

export default function LandingCta() {
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getWaRegisterUrl(), '_blank');
  };

  return (
    <motion.section 
      className="py-20 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="p-10 sm:p-14 rounded-3xl border border-sky-200 dark:border-[#1DA9D0]/30 text-center relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100/70 dark:from-[#012040] dark:via-[#012040] dark:to-[#013D66] shadow-xl dark:shadow-2xl transition-colors duration-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 dark:bg-[#1DA9D0]/20 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] mb-4">
            Siap Modernisasi Toko Laundry Anda Sekarang?
          </h2>
          <p className="text-slate-600 dark:text-[#F5EACA]/80 text-base max-w-xl mx-auto mb-8">
            Hubungi SuperAdmin via WhatsApp di <strong className="text-sky-600 dark:text-[#43D5CC] font-bold">+62 852-2992-5593</strong> untuk mendaftarkan toko Anda dan langsung mulai gunakan aplikasi LaundryKu hari ini.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRegisterClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-base shadow-xl shadow-[#1DA9D0]/30 inline-flex items-center gap-3 group"
          >
            Hubungi SuperAdmin di WhatsApp (085229925593)
            <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-5 h-5" /></motion.span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
