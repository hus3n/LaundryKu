'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { PRICING_PLANS, getWaRegisterUrl } from './landingData';

export default function LandingPricing() {
  const handleRegisterClick = (packageName: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getWaRegisterUrl(packageName), '_blank');
  };

  return (
    <section id="harga" className="py-24 border-t border-slate-200 dark:border-[#1DA9D0]/15 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-[#1DA9D0]/10 border border-sky-200 dark:border-[#1DA9D0]/20 text-xs font-semibold text-sky-700 dark:text-[#43D5CC]">
            💎 Paket Harga Terjangkau & Transparan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA]">Investasi Usaha Laundry yang Sangat Ekonomis</h2>
          <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm">Pilih paket langganan aplikasi kasir yang paling tepat untuk skala operasional bisnis laundry Anda.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
          className="grid md:grid-cols-3 gap-8"
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`p-8 rounded-3xl border relative flex flex-col justify-between ${
                plan.isPopular
                  ? 'border-2 border-sky-500 dark:border-[#1DA9D0] shadow-xl shadow-sky-500/10 dark:shadow-[#1DA9D0]/20 bg-gradient-to-b from-sky-50/90 via-white to-sky-50/40 dark:from-[#012040] dark:via-[#012040] dark:to-[#013D66]/40'
                  : 'glass-card-dark border-slate-200 dark:border-[#1DA9D0]/15 shadow-sm dark:shadow-none'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] text-[11px] font-bold shadow-lg shadow-[#1DA9D0]/30 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#010E1C]" />
                  {plan.badgeText}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EACA]">{plan.name}</h3>
                  <p className="text-slate-500 dark:text-[#F5EACA]/60 text-xs mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-slate-200 dark:border-[#1DA9D0]/15">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-[#F5EACA]">{plan.price}</span>
                  <span className="text-xs text-slate-500 dark:text-[#F5EACA]/60 font-medium">{plan.period}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 uppercase tracking-wider">Fasilitas Termasuk:</p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-[#F5EACA]/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleRegisterClick(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 group ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] shadow-[#1DA9D0]/25'
                      : 'bg-slate-100 dark:bg-[#013D66] text-slate-800 dark:text-[#F5EACA] border border-slate-200 dark:border-[#1DA9D0]/25 hover:bg-slate-200 dark:hover:bg-[#014775]'
                  }`}
                >
                  Pilih {plan.name}
                  <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
