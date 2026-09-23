'use client';

import React from 'react';

interface PackageModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  name: string;
  unit: string;
  price: string;
  durationValue: string;
  durationUnit: string;
  onNameChange: (val: string) => void;
  onUnitChange: (val: string) => void;
  onPriceChange: (val: string) => void;
  onDurationValueChange: (val: string) => void;
  onDurationUnitChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PackageModal({
  isOpen,
  isEditing,
  isSubmitting,
  name,
  unit,
  price,
  durationValue,
  durationUnit,
  onNameChange,
  onUnitChange,
  onPriceChange,
  onDurationValueChange,
  onDurationUnitChange,
  onClose,
  onSubmit,
}: PackageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm">
      <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 shadow-2xl">
        <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
          {isEditing ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
              Nama Paket
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Contoh: Cuci Komplit, Setrika Saja"
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                Satuan Unit
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => onUnitChange(e.target.value)}
                placeholder="kg, pcs, meter"
                className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="7000"
                className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
              Estimasi Pengerjaan
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                min={1}
                value={durationValue}
                onChange={(e) => onDurationValueChange(e.target.value)}
                placeholder="24"
                className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
              />
              <select
                value={durationUnit}
                onChange={(e) => onDurationUnitChange(e.target.value)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0] w-20 sm:w-24 shrink-0"
              >
                <option value="jam" className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                  Jam
                </option>
                <option value="hari" className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                  Hari
                </option>
              </select>
            </div>
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
              {isEditing ? 'Simpan' : 'Tambah Paket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
