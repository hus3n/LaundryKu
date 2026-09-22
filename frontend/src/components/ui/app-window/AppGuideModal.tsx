'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Maximize, Download, ExternalLink, ChevronDown, ChevronUp, Sparkles, Monitor } from 'lucide-react';
import { AppGuideModalProps } from './types';
import { INSTALL_METHODS } from './appGuideData';

export default function AppGuideModal({
  isOpen,
  onClose,
  onToggleFullscreen,
  deferredPrompt,
  onDirectInstall,
}: AppGuideModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showManualSteps, setShowManualSteps] = useState(false);

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

  const handleOpenStandaloneWindow = () => {
    window.open(
      window.location.href,
      'LaundryKuStandaloneWindow',
      'popup=yes,menubar=no,toolbar=no,location=no,status=no,width=1280,height=800'
    );
    onClose();
  };

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
            aria-labelledby="app-mode-title"
            className="relative w-full max-w-lg my-auto max-h-[86vh] sm:max-h-[88vh] flex flex-col dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 dark:text-[#F5EACA] text-slate-900"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b dark:border-[#1DA9D0]/15 border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 shrink-0">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3
                    id="app-mode-title"
                    className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5"
                  >
                    Buka dalam Mode Aplikasi
                  </h3>
                  <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500">
                    Jalankan kasir mandiri tanpa tab dan bilah peramban
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 dark:text-[#F5EACA]/60 text-slate-400 dark:hover:text-[#F5EACA] hover:text-slate-700 rounded-lg hover:bg-[#1DA9D0]/10 transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Content Actions */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-3 text-xs dark:text-[#F5EACA]/80 text-slate-700 overscroll-contain">
              {/* Option A: Direct Native Install if Prompt is active */}
              {deferredPrompt && onDirectInstall && (
                <button
                  onClick={() => {
                    onDirectInstall();
                    onClose();
                  }}
                  className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-left flex items-center justify-between gap-3 shadow-lg shadow-[#1DA9D0]/20 hover:opacity-95 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#010E1C]/15 flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5 text-[#010E1C]" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold flex items-center gap-1.5">
                        Pasang Aplikasi Sekarang
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] text-[#010E1C]/80 font-medium">
                        Klik untuk memasang langsung ke Desktop atau Layar Utama
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-[#010E1C] text-[#43D5CC] font-bold shrink-0">
                    Pasang
                  </span>
                </button>
              )}

              {/* Option B: Direct 1-Click Standalone Window */}
              <button
                onClick={handleOpenStandaloneWindow}
                className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl dark:bg-[#013D66]/70 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 text-left flex items-center justify-between gap-3 hover:dark:bg-[#013D66] hover:bg-sky-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold dark:text-[#F5EACA] text-slate-900">
                      Buka di Jendela Mandiri (Tanpa Tab)
                    </div>
                    <div className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500">
                      Buka langsung di jendela aplikasi bersih tanpa bilah tab browser
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-sky-700 font-semibold shrink-0 group-hover:bg-[#1DA9D0]/30 transition-colors">
                  Buka
                </span>
              </button>

              {/* Option C: Direct 1-Click Fullscreen (F11) */}
              <button
                onClick={() => {
                  onToggleFullscreen();
                  onClose();
                }}
                className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl dark:bg-[#013D66]/40 bg-amber-50/70 border dark:border-[#EA8803]/30 border-amber-200 text-left flex items-center justify-between gap-3 hover:dark:bg-[#013D66]/70 hover:bg-amber-100/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EA8803]/20 text-[#EA8803] flex items-center justify-center shrink-0">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
                      Mode Layar Penuh Kasir
                      <span className="text-[10px] bg-[#EA8803]/20 text-[#EA8803] px-1.5 py-0.5 rounded font-mono font-bold">
                        F11
                      </span>
                    </div>
                    <div className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500">
                      Sembunyikan seluruh tab &amp; taskbar untuk fokus transaksi kasir
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#EA8803]/20 text-[#EA8803] font-semibold shrink-0 group-hover:bg-[#EA8803]/30 transition-colors">
                  Aktifkan
                </span>
              </button>

              {/* Quick Browser Hint */}
              <div className="p-3 rounded-xl dark:bg-[#012040]/70 bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 text-[11px] sm:text-xs dark:text-[#F5EACA]/70 text-slate-600">
                <strong className="dark:text-[#43D5CC] text-sky-700">💡 Pasang Permanen di Komputer:</strong> Di Google Chrome atau Microsoft Edge, klik ikon <strong>Instal</strong> (ikon komputer bertanda panah ke bawah) di ujung kanan bilah alamat (URL bar) browser Anda.
              </div>

              {/* Collapsible Detailed Manual Guide for HP */}
              <div className="border dark:border-[#1DA9D0]/15 border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowManualSteps(!showManualSteps)}
                  className="w-full p-2.5 sm:p-3 flex items-center justify-between text-left text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 dark:hover:bg-[#013D66]/40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#43D5CC]" />
                    Panduan Pasang di HP (Android &amp; iPhone)
                  </span>
                  {showManualSteps ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showManualSteps && (
                  <div className="p-3 border-t dark:border-[#1DA9D0]/15 border-slate-200 space-y-2 text-[11px] dark:text-[#F5EACA]/70 text-slate-600">
                    <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/10 border-slate-200">
                      <strong className="dark:text-[#43D5CC] text-sky-700">📱 Android (Chrome):</strong> Tekan tombol titik tiga (<span className="font-bold">⋮</span>) kanan atas ➔ pilih <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Instal aplikasi&quot;</strong>.
                    </div>
                    <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/10 border-slate-200">
                      <strong className="dark:text-[#EA8803] text-amber-600">🍏 iPhone (Safari):</strong> Tekan ikon <strong className="dark:text-[#F5EACA] text-slate-900">Share</strong> (panah atas) ➔ pilih <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Add to Home Screen&quot;</strong>.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 pt-3 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] sm:text-[11px] dark:text-[#F5EACA]/50 text-slate-500">
                PWA Standalone Window
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0] bg-[#013D66] text-white dark:text-[#010E1C] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
