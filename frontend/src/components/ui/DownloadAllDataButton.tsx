'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { downloadAllDataExcel } from '@/lib/export';

interface DownloadAllDataButtonProps {
  className?: string;
  label?: string;
}

export default function DownloadAllDataButton({
  className = '',
  label = 'Download Seluruh Data (Excel)',
}: DownloadAllDataButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadAllDataExcel();
    } catch (err: any) {
      console.error('Failed to export all data:', err);
      alert(err.message || 'Gagal mendownload seluruh data. Coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 border border-emerald-500/30 ${className}`}
      title="Download 1 file Excel lengkap mencakup Pelanggan, Transaksi Cucian, Riwayat Status, Laporan Keuangan & Analitik Grafik"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Menyiapkan Excel...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
