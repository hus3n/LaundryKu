'use client';

import React from 'react';
import {
  QrCode,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Clock,
  LogOut,
  XCircle,
  Trash2,
  Play,
} from 'lucide-react';

interface WaPairingStatusCardProps {
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  phoneConnected: string | null;
  qrCode: string | null;
  loadingStatus: boolean;
  isDisconnecting: boolean;
  pendingQueueCount: number;
  hasSubscriptionError: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSimulatePairing: () => void;
  onClearQueue: () => void;
  onRetryQueue: () => void;
}

export default function WaPairingStatusCard({
  status,
  phoneConnected,
  qrCode,
  loadingStatus,
  isDisconnecting,
  pendingQueueCount,
  hasSubscriptionError,
  onConnect,
  onDisconnect,
  onSimulatePairing,
  onClearQueue,
  onRetryQueue,
}: WaPairingStatusCardProps) {
  return (
    <div className="md:col-span-1 glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-6 text-center shadow-sm">
      <div className="flex justify-between items-center text-xs">
        <span className="dark:text-[#F5EACA]/60 text-slate-500">Status Koneksi WA:</span>
        <span
          className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
            status === 'CONNECTED'
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
              : status === 'CONNECTING'
              ? 'bg-amber-500/20 text-amber-600 dark:text-[#EA8803] border border-amber-500/30'
              : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
          }`}
        >
          {status === 'CONNECTED' ? (
            <>
              <Wifi className="w-3.5 h-3.5" /> Terhubung
            </>
          ) : status === 'CONNECTING' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pairing...
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" /> Terputus
            </>
          )}
        </span>
      </div>

      {/* Pending Queue Count Card */}
      {pendingQueueCount > 0 && (
        <div className="p-3.5 rounded-2xl dark:bg-[#EA8803]/10 bg-amber-50 border dark:border-[#EA8803]/30 border-amber-200 dark:text-[#EA8803] text-amber-700 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 dark:text-[#EA8803] text-amber-600" /> Antrean Tertahan:
            </span>
            <span className="font-bold dark:text-[#F5EACA] text-slate-900 dark:bg-[#EA8803]/20 bg-amber-100 px-2.5 py-0.5 rounded-full border dark:border-[#EA8803]/40 border-amber-300">
              {pendingQueueCount} Pesan
            </span>
          </div>
          <p className="text-[10px] dark:text-[#EA8803]/80 text-amber-700 text-left">
            {status === 'CONNECTED'
              ? 'Pesan sedang dikirim bergantian dengan jeda aman 10 detik.'
              : 'Pesan tertunda sampai WhatsApp toko terhubung kembali.'}
          </p>
          <div className="flex gap-2 pt-1">
            {status === 'CONNECTED' && (
              <button
                type="button"
                onClick={onRetryQueue}
                className="flex-1 py-1 px-2 rounded-lg dark:bg-[#EA8803]/20 bg-amber-100 dark:hover:bg-[#EA8803]/30 hover:bg-amber-200 border dark:border-[#EA8803]/40 border-amber-300 dark:text-[#F5EACA] text-slate-800 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Play className="w-3 h-3" /> Kirim Sekarang
              </button>
            )}
            <button
              type="button"
              onClick={onClearQueue}
              className="flex-1 py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan
            </button>
          </div>
        </div>
      )}

      {/* QR Container */}
      <div className="p-4 rounded-2xl dark:bg-[#011B2E] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex flex-col items-center justify-center min-h-[220px]">
        {status === 'CONNECTED' ? (
          <div className="space-y-3 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-bold dark:text-[#F5EACA] text-slate-900 text-sm">WA Toko Aktif</h4>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500">{phoneConnected || '0812-3456-7890'}</p>
          </div>
        ) : qrCode ? (
          <div className="space-y-3">
            <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
              <img src={qrCode} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-[11px] dark:text-[#EA8803] text-amber-600">Scan QR Code dengan WhatsApp HP Toko</p>
            <button
              type="button"
              onClick={onSimulatePairing}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25"
            >
              Simulasi Pairing Berhasil
            </button>
          </div>
        ) : (
          <div className="space-y-3 py-6">
            <QrCode className="w-12 h-12 dark:text-[#1DA9D0]/40 text-slate-300 mx-auto" />
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Klik &quot;Hubungkan WA&quot; untuk generate QR Code</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {status === 'CONNECTED' ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onDisconnect}
              disabled={isDisconnecting}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDisconnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Memutuskan WhatsApp...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" /> Putuskan Koneksi WA
                </>
              )}
            </button>
            <p className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
              Klik tombol di atas untuk melepas tautan dan mengganti ke nomor WhatsApp lain.
            </p>
          </div>
        ) : status === 'CONNECTING' ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onConnect}
                disabled={loadingStatus}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                Refresh QR
              </button>
              <button
                type="button"
                onClick={onDisconnect}
                disabled={isDisconnecting}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                {isDisconnecting ? 'Mereset...' : 'Batalkan Pairing'}
              </button>
            </div>
            <p className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
              Jika QR kedaluwarsa atau ingin ganti nomor, klik &quot;Batalkan Pairing&quot; lalu hubungkan kembali.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            disabled={loadingStatus || hasSubscriptionError}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loadingStatus ? 'animate-spin' : ''}`} />
            Hubungkan WA Toko
          </button>
        )}
      </div>
    </div>
  );
}
