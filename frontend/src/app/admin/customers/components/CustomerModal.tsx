'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  name: string;
  phone: string;
  address: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CustomerModal({
  isOpen,
  isEditing,
  isSubmitting,
  name,
  phone,
  address,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onClose,
  onSubmit,
}: CustomerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="overlay"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
      >
        <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 pointer-events-auto shadow-2xl">
          <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
            {isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
          </h3>

          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                Nama Pelanggan
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Contoh: Ibu Rina"
                className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                Alamat (Opsional)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                placeholder="Alamat domisili pelanggan"
                className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>

            <div className="pt-2 sm:pt-3 flex justify-end gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
              >
                Batal
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all shadow-sm"
              >
                {isEditing ? 'Simpan' : 'Tambah'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
