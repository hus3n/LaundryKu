'use client';

import React from 'react';
import { CloudUpload, AlertCircle, Upload, Loader2, ShieldCheck } from 'lucide-react';

interface DatabaseRestoreCardProps {
  restoreFile: File | null;
  setRestoreFile: (file: File | null) => void;
  restoring: boolean;
  restoreResult: { success: boolean; message: string } | null;
  onRestore: () => void;
  formatFileSize: (bytes: number) => string;
}

export default function DatabaseRestoreCard({
  restoreFile,
  setRestoreFile,
  restoring,
  restoreResult,
  onRestore,
  formatFileSize,
}: DatabaseRestoreCardProps) {
  return (
    <div className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <CloudUpload className="w-5 h-5 text-amber-600 dark:text-[#EA8803]" />
        <div>
          <h2 className="text-sm font-bold dark:text-[#F5EACA] text-slate-900">Restore Lengkap Sistem & Sesi</h2>
          <p className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">
            Mengembalikan seluruh data transaksi, AI bot, media, dan otomatis menghubungkan ulang sesi WhatsApp aktif.
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-[#EA8803]/10 border border-amber-500/25 dark:border-[#EA8803]/30 text-[11px] text-amber-700 dark:text-[#EA8803] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Perhatian:</strong> Proses restore akan menghapus seluruh data saat ini dan menggantinya dengan data dari file backup. Pastikan Anda telah membuat backup terbaru sebelum melanjutkan.
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Upload File Backup (.zip)</label>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
            className="w-full text-xs dark:text-[#F5EACA]/60 text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold dark:file:bg-[#013D66] file:bg-slate-100 dark:file:text-[#F5EACA] file:text-slate-800 dark:hover:file:bg-[#014775] hover:file:bg-slate-200 cursor-pointer"
          />
          {restoreFile && (
            <p className="text-[11px] dark:text-[#F5EACA]/60 text-slate-600 mt-1">
              📁 {restoreFile.name} ({formatFileSize(restoreFile.size)})
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onRestore}
          disabled={restoring || !restoreFile}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EA8803] to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {restoring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Sedang Melakukan Restore...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Jalankan Restore
            </>
          )}
        </button>
      </div>

      {restoreResult && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            restoreResult.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {restoreResult.success ? (
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{restoreResult.message}</span>
        </div>
      )}
    </div>
  );
}
