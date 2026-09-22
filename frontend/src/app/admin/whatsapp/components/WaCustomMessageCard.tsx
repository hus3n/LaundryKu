'use client';

import React from 'react';
import { MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

interface WaCustomMessageCardProps {
  customName: string;
  setCustomName: (v: string) => void;
  customPhone: string;
  setCustomPhone: (v: string) => void;
  customMsg: string;
  setCustomMsg: (v: string) => void;
  sendingMsg: boolean;
  customSuccess: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function WaCustomMessageCard({
  customName,
  setCustomName,
  customPhone,
  setCustomPhone,
  customMsg,
  setCustomMsg,
  sendingMsg,
  customSuccess,
  onSubmit,
}: WaCustomMessageCardProps) {
  return (
    <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-3 sm:space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-[#43D5CC] text-teal-600" /> Kirim Pesan Custom via WA Toko
        </h3>
        <span className="text-[10px] sm:text-[11px] dark:text-[#EA8803] text-amber-600 flex items-center gap-1">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Jeda 10 detik per pesan
        </span>
      </div>

      {customSuccess && (
        <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {customSuccess}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-2.5 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nama Penerima</label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Contoh: Ibu Rina"
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nomor WA Penerima</label>
            <input
              type="text"
              required
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Isi Pesan Custom</label>
          <textarea
            rows={3}
            required
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Masukkan isi pesan yang ingin dikirim..."
            className="w-full p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] shadow-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sendingMsg}
            className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Masukkan Antrian Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
