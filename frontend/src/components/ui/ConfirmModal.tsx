'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
  isSubmitting = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  // NOTE: isOpen is controlled outside using AnimatePresence now, 
  // but we keep the prop for consistency or double check.
  // The wrapper should be <AnimatePresence>{isOpen && <ConfirmModal />}</AnimatePresence>

  const colorStyles = {
    danger: {
      bgIcon: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      btn: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-900/30',
    },
    warning: {
      bgIcon: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      btn: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-900/30',
    },
    info: {
      bgIcon: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
      btn: 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 shadow-brand-900/30',
    },
  }[type];

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="glass-card-dark p-6 sm:p-7 rounded-3xl border border-slate-800/80 max-w-md w-full shadow-2xl relative space-y-5 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>

          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${colorStyles.bgIcon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
            >
              {cancelText}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 ${colorStyles.btn} disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                confirmText
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
