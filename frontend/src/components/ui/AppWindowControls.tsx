'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize, Download, Monitor } from 'lucide-react';
import AppGuideModal from './app-window/AppGuideModal';
import { BeforeInstallPromptEvent } from './app-window/types';

export default function AppWindowControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

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
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          return;
        }
      } catch (err) {
        console.warn('Direct install failed:', err);
      }
    }
    setShowGuideModal(true);
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
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg dark:bg-[#1DA9D0]/10 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 dark:text-[#43D5CC] text-sky-700 hover:bg-[#1DA9D0]/20 dark:hover:text-[#F5EACA] hover:text-sky-900 text-xs font-medium transition-all shadow-sm shrink-0 cursor-pointer"
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
          className={`p-1.5 sm:p-2 rounded-lg border shrink-0 transition-all cursor-pointer ${
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

      {/* Modular Guide Modal via React Portal to prevent cutoff */}
      <AppGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onToggleFullscreen={toggleFullscreen}
        deferredPrompt={deferredPrompt}
        onDirectInstall={handleInstallClick}
      />
    </>
  );
}
