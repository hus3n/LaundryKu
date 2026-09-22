'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize, 
  Minimize, 
  Download, 
  Monitor, 
  X, 
  ExternalLink, 
  HelpCircle, 
  Sparkles,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function AppWindowControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone/PWA mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // PWA beforeinstallprompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Standalone status badge or Install App Button */}
        {isStandalone ? (
          <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-[#43D5CC]/10 bg-teal-50 border dark:border-[#43D5CC]/25 border-teal-200 dark:text-[#43D5CC] text-teal-700 text-[11px] font-medium shrink-0">
            <Monitor className="w-3.5 h-3.5" />
            Mode Aplikasi
          </span>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInstallClick}
            title="Instal / Buka sebagai Aplikasi Tanpa Tab Browser"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg dark:bg-[#1DA9D0]/10 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 dark:text-[#43D5CC] text-sky-700 hover:bg-[#1DA9D0]/20 dark:hover:text-[#F5EACA] hover:text-sky-900 text-xs font-medium transition-all shadow-sm shrink-0"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Mode Aplikasi</span>
          </motion.button>
        )}

        {/* Fullscreen Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Mode Layar Penuh (Esc / F11)' : 'Sembunyikan Tab & Masuk Layar Penuh (F11)'}
          className={`p-1.5 sm:p-2 rounded-lg border shrink-0 transition-all ${
            isFullscreen
              ? 'bg-[#EA8803]/15 border-[#EA8803]/30 text-[#EA8803] shadow-[#EA8803]/20 shadow-sm'
              : 'dark:bg-[#013D66]/80 bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-200 dark:text-[#F5EACA]/80 text-slate-700 dark:hover:text-[#F5EACA] hover:text-slate-900 dark:hover:bg-[#013D66] hover:bg-slate-200'
          }`}
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </motion.button>
      </div>

      {/* Guide Modal on how to hide browser tabs / open as standalone */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="fixed inset-0 bg-[#010E1C]/80 dark:bg-[#010E1C]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg max-h-[88vh] sm:max-h-[85vh] flex flex-col dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 dark:text-[#F5EACA] text-slate-900"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b dark:border-[#1DA9D0]/15 border-slate-200 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 shrink-0">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
                      Panduan Memasang Aplikasi LaundryKu
                    </h3>
                    <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500">
                      Jalankan sebagai aplikasi mandiri di HP &amp; Komputer tanpa tab browser
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 dark:text-[#F5EACA]/60 text-slate-400 dark:hover:text-[#F5EACA] hover:text-slate-700 rounded-lg hover:bg-[#1DA9D0]/10 transition-colors shrink-0"
                  aria-label="Tutup Panduan"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Options Guide */}
              <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3 text-xs dark:text-[#F5EACA]/80 text-slate-700 overscroll-contain">
                {/* Method 1: HP Android & iPhone */}
                <div className="p-3 sm:p-3.5 rounded-xl dark:bg-[#013D66]/50 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 flex gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold dark:text-[#F5EACA] text-slate-900 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#43D5CC] shrink-0" />
                      <span>Pasang di HP (Android &amp; iPhone)</span>
                    </div>
                    <p className="dark:text-[#F5EACA]/70 text-slate-600 leading-relaxed mb-2 text-[11px] sm:text-xs">
                      Aplikasi akan otomatis terpasang di layar utama HP seperti aplikasi mandiri Play Store / App Store:
                    </p>
                    <div className="space-y-1.5 text-[11px] sm:text-xs">
                      <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/15 border-slate-200">
                        <strong className="dark:text-[#43D5CC] text-sky-700">📱 HP Android (Chrome):</strong> Tekan tombol menu titik tiga (<span className="font-bold">⋮</span>) di pojok kanan atas browser ➔ pilih <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Instal aplikasi&quot;</strong> atau <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Tambahkan ke Layar Utama&quot;</strong>.
                      </div>
                      <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/15 border-slate-200">
                        <strong className="dark:text-[#EA8803] text-amber-600">🍏 iPhone (Safari):</strong> Tekan ikon <strong className="dark:text-[#F5EACA] text-slate-900">Share / Bagikan</strong> (kotak tanda panah atas) di menu bilah bawah ➔ geser ke bawah dan pilih <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Tambahkan ke Layar Utama&quot; (Add to Home Screen)</strong>.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 2: Laptop & Komputer PC */}
                <div className="p-3 sm:p-3.5 rounded-xl dark:bg-[#013D66]/50 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 flex gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-sky-600 flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold dark:text-[#F5EACA] text-slate-900 mb-1 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#43D5CC] shrink-0" />
                      <span>Pasang di Komputer / Laptop (Desktop App)</span>
                    </div>
                    <p className="dark:text-[#F5EACA]/70 text-slate-600 leading-relaxed mb-2 text-[11px] sm:text-xs">
                      Buka kasir seketika dari Shortcut Desktop &amp; Taskbar tanpa membuka tab peramban web:
                    </p>
                    <div className="space-y-1.5 text-[11px] sm:text-xs">
                      <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/15 border-slate-200">
                        <strong className="dark:text-[#43D5CC] text-sky-700">💻 Google Chrome &amp; Microsoft Edge:</strong> Klik ikon <strong className="dark:text-[#F5EACA] text-slate-900">&quot;Instal LaundryKu&quot;</strong> (ikon komputer dengan panah ke bawah) yang muncul di ujung kanan bilah alamat (URL bar).
                      </div>
                      <div className="p-2 rounded-lg dark:bg-[#012040]/70 bg-white border dark:border-[#1DA9D0]/15 border-slate-200">
                        Atau klik menu titik tiga (<span className="font-bold">⋮</span>) di pojok kanan atas browser ➔ pilih <strong className="dark:text-[#F5EACA] text-slate-900">Simpan dan Bagikan</strong> ➔ klik <strong className="dark:text-[#43D5CC] text-sky-600">&quot;Instal LaundryKu...&quot;</strong>.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 3: Layar Penuh (F11) */}
                <div className="p-3 sm:p-3.5 rounded-xl dark:bg-[#013D66]/50 bg-slate-50 border dark:border-[#1DA9D0]/20 border-slate-200 flex gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#EA8803]/20 text-[#EA8803] flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold dark:text-[#F5EACA] text-slate-900 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-[#EA8803]" />
                        Mode Layar Penuh Seketika
                      </span>
                      <span className="text-[10px] bg-[#EA8803]/20 text-[#EA8803] px-1.5 py-0.5 rounded font-mono font-bold">
                        F11
                      </span>
                    </div>
                    <p className="dark:text-[#F5EACA]/70 text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      Sembunyikan tab dan bilah alamat seketika dengan menekan tombol <kbd className="px-1.5 py-0.5 dark:bg-[#013D66] bg-slate-200 border dark:border-[#1DA9D0]/30 border-slate-300 rounded font-mono">F11</kbd> pada keyboard atau tekan tombol di bawah ini:
                    </p>
                    <button
                      onClick={() => {
                        toggleFullscreen();
                        setShowGuideModal(false);
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#EA8803] text-white font-bold text-xs hover:bg-[#EA8803]/90 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                      Aktifkan Layar Penuh Sekarang
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 sm:mt-4 pt-3 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[10px] sm:text-[11px] dark:text-[#F5EACA]/50 text-slate-500">
                  Didukung teknologi PWA (Progressive Web App)
                </span>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0] bg-[#013D66] text-white dark:text-[#010E1C] font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Mengerti &amp; Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
