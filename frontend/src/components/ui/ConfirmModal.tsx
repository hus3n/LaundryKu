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
      btn: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-900/30 text-white font-semibold',
    },
    warning: {
      bgIcon: 'bg-[#EA8803]/20 text-[#EA8803] border-[#EA8803]/30',
      btn: 'bg-gradient-to-r from-[#EA8803] to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold shadow-[#EA8803]/30',
    },
    info: {
      bgIcon: 'bg-[#1DA9D0]/20 text-[#43D5CC] border-[#1DA9D0]/30',
      btn: 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold shadow-[#1DA9D0]/30',
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
        className="fixed inset-0 z-[60] bg-[#010E1C]/80 backdrop-blur-md"
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
        <div className="glass-card-dark p-6 sm:p-7 rounded-3xl border border-[#1DA9D0]/15 max-w-md w-full shadow-2xl relative space-y-5 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#012040] text-[#F5EACA]/60 hover:text-[#F5EACA] hover:bg-[#013D66] transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>

          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${colorStyles.bgIcon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5EACA]">{title}</h3>
              <p className="text-xs text-[#F5EACA]/80 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1DA9D0]/10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-[#012040] hover:bg-[#013D66] text-[#F5EACA]/80 text-xs font-semibold border border-[#1DA9D0]/15 transition-colors"
            >
              {cancelText}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 ${colorStyles.btn} disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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

