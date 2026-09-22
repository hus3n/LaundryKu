'use client';

import React from 'react';
import { Bot, CheckCircle2, Clock, Unlink, Loader2 } from 'lucide-react';

interface TelegramStatus {
  isConnected: boolean;
  botUsername?: string;
  chatId?: string;
}

interface TelegramBotCardProps {
  telegramStatus: TelegramStatus;
  botToken: string;
  setBotToken: (v: string) => void;
  chatIdInput: string;
  setChatIdInput: (v: string) => void;
  connectingBot: boolean;
  onConnectBot: () => void;
  onSetChatId: () => void;
  onDisconnectBot: () => void;
}

export default function TelegramBotCard({
  telegramStatus,
  botToken,
  setBotToken,
  chatIdInput,
  setChatIdInput,
  connectingBot,
  onConnectBot,
  onSetChatId,
  onDisconnectBot,
}: TelegramBotCardProps) {
  return (
    <div className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5">
        <Bot className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />
        <h2 className="text-sm font-bold dark:text-[#F5EACA] text-slate-900">Hubungkan Bot Telegram</h2>
        {telegramStatus.isConnected && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Terhubung
          </span>
        )}
      </div>

      {telegramStatus.isConnected ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-[#F5EACA]/60 text-slate-600">Bot Username</span>
              <span className="text-xs font-mono text-[#1DA9D0] dark:text-[#43D5CC]">@{telegramStatus.botUsername}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-[#F5EACA]/60 text-slate-600">Chat ID</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-300">
                {telegramStatus.chatId || (
                  <span className="text-amber-600 dark:text-[#EA8803]">Belum diset - kirim /start ke bot</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-[#F5EACA]/60 text-slate-600">Auto Backup</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Setiap 1 Jam
              </span>
            </div>
          </div>

          {!telegramStatus.chatId && (
            <div className="space-y-2">
              <p className="text-[11px] text-amber-600 dark:text-[#EA8803]">
                💡 Chat ID bisa diisi otomatis dengan kirim <strong>/start</strong> ke bot Anda di Telegram, atau masukkan manual:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatIdInput}
                  onChange={(e) => setChatIdInput(e.target.value)}
                  placeholder="Masukkan Chat ID"
                  className="flex-1 px-3 py-2 rounded-lg dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                />
                <button
                  type="button"
                  onClick={onSetChatId}
                  className="px-3 py-2 rounded-lg bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/20 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/30 text-xs font-semibold hover:bg-[#1DA9D0]/25 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onDisconnectBot}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <Unlink className="w-3.5 h-3.5" /> Putuskan Bot Telegram
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#1DA9D0]/10 border border-[#1DA9D0]/20 text-[11px] text-[#1DA9D0] dark:text-[#43D5CC] space-y-2">
            <p className="font-semibold">📋 Cara Membuat Bot Telegram:</p>
            <ol className="list-decimal list-inside space-y-1 dark:text-[#F5EACA]/60 text-slate-600">
              <li>Buka Telegram, cari <strong>@BotFather</strong></li>
              <li>Kirim <strong>/newbot</strong>, ikuti instruksinya</li>
              <li>Salin <strong>Token Bot</strong> yang diberikan BotFather</li>
              <li>Paste token di kolom bawah ini</li>
            </ol>
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Token Bot Telegram</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz..."
              className="w-full px-3 py-2.5 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all font-mono"
            />
          </div>

          <button
            type="button"
            onClick={onConnectBot}
            disabled={connectingBot || !botToken.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {connectingBot ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            {connectingBot ? 'Menghubungkan...' : 'Hubungkan Bot Telegram'}
          </button>
        </div>
      )}
    </div>
  );
}
