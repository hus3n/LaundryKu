'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Maximize } from 'lucide-react';
import { AppGuideModalProps } from './types';
import { INSTALL_METHODS } from './appGuideData';

export default function AppGuideModal({
  isOpen,
  onClose,
  onToggleFullscreen,
}: AppGuideModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with click-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#010E1C]/80 dark:bg-[#010E1C]/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-guide-title"
            className="relative w-full max-w-lg my-auto max-h-[86vh] sm:max-h-[88vh] flex flex-col dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 dark:text-[#F5EACA] text-slate-900"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b dark:border-[#1DA9D0]/15 border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 shrink-0">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3
                    id="app-guide-title"
                    className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2"
                  >
                    Panduan Memasang Aplikasi LaundryKu
                  </h3>
                  <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500">
                    Jalankan sebagai aplikasi mandiri di HP &amp; Komputer tanpa tab browser
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 dark:text-[#F5EACA]/60 text-slate-400 dark:hover:text-[#F5EACA] hover:text-slate-700 rounded-lg hover:bg-[#1DA9D0]/10 transition-colors shrink-0"
                aria-label="Tutup Panduan"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Guide Content */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-3 text-xs dark:text-[#F5EACA]/80 text-slate-700 overscroll-contain">
              {INSTALL_METHODS.map((method) => {
                const IconComponent = method.icon;
                const isAmber = method.colorScheme === 'amber';

                return (
                  <div
                    key={method.step}
                    className="p-3 sm:p-3.5 rounded-xl dark:bg-[#013D66]/50 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 flex gap-2.5 sm:gap-3"
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold shrink-0 text-xs ${
                        isAmber
                          ? 'bg-[#EA8803]/20 text-[#EA8803]'
                          : 'bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-sky-600'
                      }`}
                    >
                      {method.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold dark:text-[#F5EACA] text-slate-900 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <IconComponent
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isAmber ? 'text-[#EA8803]' : 'text-[#43D5CC]'
                            }`}
                          />
                          <span>{method.title}</span>
                        </span>
                        {method.badge && (
                          <span className="text-[10px] bg-[#EA8803]/20 text-[#EA8803] px-1.5 py-0.5 rounded font-mono font-bold">
                            {method.badge}
                          </span>
                        )}
                      </div>

                      <p className="dark:text-[#F5EACA]/70 text-slate-600 leading-relaxed mb-2 text-[11px] sm:text-xs">
                        {method.subtitle}
                      </p>

                      {method.instructions.length > 0 && (
                        <div className="space-y-1.5 text-[11px] sm:text-xs">
                          {method.instructions.map((inst, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/15 border-slate-200"
                            >
                              <strong className="dark:text-[#43D5CC] text-sky-700 block sm:inline mr-1">
                                {inst.device}:
                              </strong>
                              <span>{inst.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {method.actionButton && (
                        <button
                          onClick={() => {
                            onToggleFullscreen();
                            onClose();
                          }}
                          className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#EA8803] text-white font-bold text-xs hover:bg-[#EA8803]/90 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Maximize className="w-3.5 h-3.5" />
                          {method.actionButton.label}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 pt-3 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] sm:text-[11px] dark:text-[#F5EACA]/50 text-slate-500">
                Didukung teknologi PWA (Progressive Web App)
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0] bg-[#013D66] text-white dark:text-[#010E1C] font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Mengerti &amp; Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
