'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Sparkles } from 'lucide-react';
import ReviewModal from './ReviewModal';

export default function FloatingReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.aside
        aria-label="Tombol Beri Ulasan"
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-40 select-none print:hidden"
      >
        <motion.button
          type="button"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md cursor-pointer border
            /* Light Mode */
            bg-white/95 text-slate-800 border-amber-300/80 shadow-amber-500/10 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20
            /* Dark Mode */
            dark:bg-[#011627]/95 dark:text-[#F5EACA] dark:border-[#EA8803]/40 dark:shadow-[0_4px_18px_rgba(234,136,3,0.2)] dark:hover:border-[#EA8803]/70 dark:hover:shadow-[0_8px_25px_rgba(234,136,3,0.35)]"
          aria-label="Beri Ulasan LaundryKu"
        >
          {/* Pulsing Star Icon container */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="absolute -inset-0.5 sm:-inset-1 rounded-full bg-[#EA8803]/20 animate-ping opacity-75 pointer-events-none" />
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-[#EA8803] to-[#F5EACA] flex items-center justify-center shadow-md shadow-[#EA8803]/30">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#010E1C] text-[#010E1C]" />
            </div>
          </div>

          {/* Text & Badge */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-tight flex items-center gap-1 leading-tight dark:text-[#F5EACA] text-slate-900 group-hover:text-[#EA8803] dark:group-hover:text-[#EA8803] transition-colors">
              <span className="inline sm:hidden">Ulasan</span>
              <span className="hidden sm:inline">Beri Ulasan</span>
              <Sparkles className="w-3 h-3 text-[#EA8803] hidden md:inline" />
            </span>
            <span className="text-[9px] md:text-[10px] dark:text-[#F5EACA]/60 text-slate-500 font-medium hidden md:inline leading-none mt-0.5">
              Bagikan pengalamanmu
            </span>
          </div>
        </motion.button>
      </motion.aside>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
