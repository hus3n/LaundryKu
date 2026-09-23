'use client';

import React from 'react';

interface OutletModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  name: string;
  address: string;
  phone: string;
  onNameChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OutletModal({
  isOpen,
  isEditing,
  isSubmitting,
  name,
  address,
  phone,
  onNameChange,
  onAddressChange,
  onPhoneChange,
  onClose,
  onSubmit,
}: OutletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm">
      <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 shadow-2xl">
        <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
          {isEditing ? 'Edit Outlet' : 'Tambah Outlet Baru'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
              Nama Outlet *
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Contoh: Cabang Utama"
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
              Alamat (Opsional)
            </label>
            <textarea
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              rows={2}
              placeholder="Alamat lengkap outlet..."
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
              Nomor Telepon (Opsional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div className="pt-2 sm:pt-4 flex justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all shadow-sm"
            >
              {isEditing ? 'Simpan' : 'Tambah Outlet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
