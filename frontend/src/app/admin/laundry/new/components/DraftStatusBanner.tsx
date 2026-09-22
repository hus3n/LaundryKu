'use client';

import React from 'react';
import { Save, RotateCcw, X } from 'lucide-react';
import { DraftStatus } from '@/hooks/useFormDraft';

interface DraftStatusBannerProps {
  draftStatus: DraftStatus;
  draftRestored: boolean;
  showRestoreBanner: boolean;
  onCloseRestoreBanner: () => void;
}

export function DraftStatusBadge({
  draftStatus,
  draftRestored,
  showRestoreBanner,
}: {
  draftStatus: DraftStatus;
  draftRestored: boolean;
  showRestoreBanner: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
      {draftStatus === 'saving' && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium dark:text-[#F5EACA]/60 text-slate-600 dark:bg-[#013D66]/80 bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-300 px-2.5 py-1.5 rounded-full animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA8803] inline-block" />
          Menyimpan draft...
        </span>
      )}
      {draftStatus === 'saved' && !showRestoreBanner && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium dark:text-[#F5EACA]/60 text-slate-600 dark:bg-[#013D66]/80 bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-300 px-2.5 py-1.5 rounded-full">
          <Save className="w-3 h-3 dark:text-[#43D5CC] text-teal-600" />
          Draft tersimpan
        </span>
      )}
      {draftRestored && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium dark:text-[#43D5CC] text-teal-700 dark:bg-[#1DA9D0]/10 bg-teal-50 border dark:border-[#1DA9D0]/30 border-teal-200 px-2.5 py-1.5 rounded-full">
          <RotateCcw className="w-3 h-3" />
          Draft dipulihkan
        </span>
      )}
    </div>
  );
}

export function DraftRestoreBanner({
  showRestoreBanner,
  onClose,
}: {
  showRestoreBanner: boolean;
  onClose: () => void;
}) {
  if (!showRestoreBanner) return null;

  return (
    <div className="p-3.5 rounded-xl dark:bg-[#1DA9D0]/10 bg-teal-50/70 border dark:border-[#1DA9D0]/25 border-teal-200 flex items-start justify-between gap-3 text-xs">
      <div className="flex items-start gap-2.5">
        <RotateCcw className="w-4 h-4 dark:text-[#43D5CC] text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold dark:text-[#43D5CC] text-teal-800">Draft formulir ditemukan & dipulihkan</p>
          <p className="dark:text-[#F5EACA]/60 text-slate-600 mt-0.5 leading-relaxed">
            Data Anda yang belum tersimpan sebelumnya telah dimuat kembali secara otomatis.
            Periksa kembali data di bawah sebelum menyimpan transaksi.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg dark:text-[#1DA9D0]/50 text-slate-400 dark:hover:text-[#F5EACA] hover:text-slate-700 dark:hover:bg-[#013D66] hover:bg-slate-200 transition-colors shrink-0"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
