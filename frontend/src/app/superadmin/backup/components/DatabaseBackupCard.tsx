'use client';

import React from 'react';
import { Cloud, Send, Download, Loader2, CheckCircle2, FileArchive } from 'lucide-react';

interface BackupItem {
  fileName: string;
  size: number;
}

interface DatabaseBackupCardProps {
  backingUp: boolean;
  backupResult: string | null;
  backups: BackupItem[];
  onTriggerBackup: () => void;
  onDownloadBackup: () => void;
  formatFileSize: (bytes: number) => string;
}

export default function DatabaseBackupCard({
  backingUp,
  backupResult,
  backups,
  onTriggerBackup,
  onDownloadBackup,
  formatFileSize,
}: DatabaseBackupCardProps) {
  return (
    <div className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <Cloud className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        <div>
          <h2 className="text-sm font-bold dark:text-[#F5EACA] text-slate-900">Backup Lengkap Sistem & Sesi</h2>
          <p className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">
            Mencakup Database (PostgreSQL & MongoDB), Kredensial Sesi WhatsApp, Pengeluaran, Outlet, dan Logo Toko.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onTriggerBackup}
          disabled={backingUp}
          className="py-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {backingUp ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {backingUp ? 'Sedang Backup...' : 'Backup → Telegram'}
        </button>

        <button
          type="button"
          onClick={onDownloadBackup}
          className="py-3 rounded-xl bg-[#1DA9D0]/10 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/30 text-xs font-semibold hover:bg-[#1DA9D0]/20 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> Download Lokal
        </button>
      </div>

      {backupResult && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{backupResult}</span>
        </div>
      )}

      {/* Recent backups */}
      {backups.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] dark:text-[#F5EACA]/50 text-slate-400 font-semibold uppercase tracking-wider">
            Riwayat Backup Lokal
          </p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {backups.slice(0, 5).map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <FileArchive className="w-3.5 h-3.5 text-[#1DA9D0]/60" />
                  <span className="text-[11px] dark:text-[#F5EACA]/80 text-slate-700 font-mono truncate max-w-[200px]">
                    {b.fileName}
                  </span>
                </div>
                <span className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400">{formatFileSize(b.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
