'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQS } from './landingData';

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <motion.section
      id="faq"
      className="py-24 bg-slate-100/60 dark:bg-[#010E1C]/60 border-t border-slate-200 dark:border-[#1DA9D0]/15 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-[#1DA9D0]/10 border border-sky-200 dark:border-[#1DA9D0]/20 text-xs font-semibold text-sky-700 dark:text-[#43D5CC]">
            <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab Seputar LaundryKu
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-[#F5EACA]">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          <p className="text-slate-600 dark:text-[#F5EACA]/60 text-sm">
            Semua hal yang perlu Anda ketahui mengenai aplikasi kasir dan sistem manajemen laundry digital LaundryKu.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-card-dark rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/15 overflow-hidden transition-colors shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1DA9D0]"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base text-slate-900 dark:text-[#F5EACA] flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-[#1DA9D0]/20 border border-sky-200 dark:border-[#1DA9D0]/30 text-sky-700 dark:text-[#43D5CC] flex items-center justify-center text-xs shrink-0 font-bold">
                      Q{index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-sky-600 dark:text-[#43D5CC]"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-[#F5EACA]/70 leading-relaxed border-t border-slate-100 dark:border-[#1DA9D0]/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
