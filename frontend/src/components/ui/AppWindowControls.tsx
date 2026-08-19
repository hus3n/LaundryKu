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
      <div className="flex items-center gap-2">
        {/* Standalone status badge or Install App Button */}
        {isStandalone ? (
          <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#43D5CC]/10 border border-[#43D5CC]/25 text-[#43D5CC] text-[11px] font-medium">
            <Monitor className="w-3.5 h-3.5" />
            Mode Aplikasi
          </span>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInstallClick}
            title="Instal / Buka sebagai Aplikasi Tanpa Tab Browser"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1DA9D0]/10 border border-[#1DA9D0]/30 text-[#43D5CC] hover:bg-[#1DA9D0]/20 hover:text-[#F5EACA] text-xs font-medium transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#43D5CC]" />
            <span className="hidden sm:inline">Mode Aplikasi (Tanpa Tab)</span>
          </motion.button>
        )}

        {/* Fullscreen Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Mode Layar Penuh (Esc / F11)' : 'Sembunyikan Tab & Masuk Layar Penuh (F11)'}
          className={`p-2 rounded-lg border transition-all ${
            isFullscreen
              ? 'bg-[#EA8803]/15 border-[#EA8803]/30 text-[#EA8803] shadow-[#EA8803]/20 shadow-sm'
              : 'bg-[#013D66]/80 border-[#1DA9D0]/25 text-[#F5EACA]/80 hover:text-[#F5EACA] hover:bg-[#013D66]'
          }`}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Guide Modal on how to hide browser tabs / open as standalone */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="fixed inset-0 bg-[#010E1C]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg bg-[#012040] border border-[#1DA9D0]/25 rounded-2xl p-6 shadow-2xl z-10 text-[#F5EACA] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#1DA9D0]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC]">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F5EACA] flex items-center gap-2">
                      Jalankan Tanpa Tab Browser
                    </h3>
                    <p className="text-xs text-[#F5EACA]/60">
                      Tampilan seperti software aplikasi desktop asli (POS Mandiri)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 text-[#F5EACA]/60 hover:text-[#F5EACA] rounded-lg hover:bg-[#1DA9D0]/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options Guide */}
              <div className="space-y-3.5 text-xs text-[#F5EACA]/80">
                {/* Method 1: Layar Penuh (F11) */}
                <div className="p-3.5 rounded-xl bg-[#013D66]/50 border border-[#1DA9D0]/20 flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EA8803]/20 text-[#EA8803] flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#F5EACA] mb-1 flex items-center justify-between">
                      <span>Mode Layar Penuh Seketika (Shortcut F11)</span>
                      <span className="text-[10px] bg-[#EA8803]/20 text-[#EA8803] px-2 py-0.5 rounded font-mono font-bold">
                        F11
                      </span>
                    </div>
                    <p className="text-[#F5EACA]/60 leading-relaxed">
                      Tekan tombol <kbd className="px-1.5 py-0.5 bg-[#013D66] border border-[#1DA9D0]/30 rounded text-[#F5EACA] font-mono">F11</kbd> di keyboard atau klik tombol di bawah untuk menyembunyikan semua tab dan bilah alamat browser seketika.
                    </p>
                    <button
                      onClick={() => {
                        toggleFullscreen();
                        setShowGuideModal(false);
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#EA8803] text-[#010E1C] font-bold text-xs hover:bg-[#EA8803]/90 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                      Aktifkan Layar Penuh Sekarang
                    </button>
                  </div>
                </div>

                {/* Method 2: Install PWA (Chrome / Edge) */}
                <div className="p-3.5 rounded-xl bg-[#013D66]/50 border border-[#1DA9D0]/20 flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#F5EACA] mb-1">
                      Instal Aplikasi (Desktop / HP)
                    </div>
                    <p className="text-[#F5EACA]/60 leading-relaxed mb-2">
                      Aplikasi akan memiliki ikon sendiri di Desktop & Taskbar tanpa membuka tab web:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#F5EACA]/60 pl-1">
                      <li>
                        <strong className="text-[#F5EACA]">Google Chrome / Edge (Laptop/PC):</strong> Klik ikon <span className="text-[#43D5CC] font-medium">Instal LaundryKu</span> (ikon komputer/download) di ujung kanan bilah alamat (URL bar) browser Anda.
                      </li>
                      <li>
                        <strong className="text-[#F5EACA]">Android / iPhone:</strong> Buka Menu browser ⋮ atau Share ➔ pilih <span className="text-[#43D5CC] font-medium">&quot;Tambahkan ke Layar Utama&quot;</span>.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Method 3: Chrome App Window Shortcut */}
                <div className="p-3.5 rounded-xl bg-[#013D66]/50 border border-[#1DA9D0]/20 flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#F5EACA] mb-1">
                      Menu Browser ➔ Simpan &amp; Pasang sebagai Aplikasi
                    </div>
                    <p className="text-[#F5EACA]/60 leading-relaxed">
                      Di Chrome: Klik menu titik tiga <span className="text-[#F5EACA] font-bold">⋮</span> di pojok kanan atas browser ➔ Pilih <strong className="text-[#F5EACA]">Simpan dan Bagikan</strong> ➔ Klik <strong className="text-[#43D5CC]">Instal LaundryKu</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-[#1DA9D0]/15 flex justify-end">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#013D66] text-[#F5EACA]/80 hover:text-[#F5EACA] hover:bg-[#014775] font-medium text-xs transition-colors"
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
