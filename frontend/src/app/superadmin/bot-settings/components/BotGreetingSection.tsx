'use client';

import React from 'react';
import { MessageSquare, Save } from 'lucide-react';
import { BotConfig } from '../botSettingsData';

interface BotGreetingSectionProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  onSave: () => void;
  saving: boolean;
}

export default function BotGreetingSection({
  config,
  setConfig,
  onSave,
  saving,
}: BotGreetingSectionProps) {
  return (
    <section className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" /> Pesan Sapaan Otomatis
        </h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={config?.isGreetingActive || false}
            onChange={(e) => setConfig({ ...config, isGreetingActive: e.target.checked })}
          />
          <div className="w-9 h-5 dark:bg-[#013D66] bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1DA9D0]"></div>
        </label>
      </div>
      <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Pesan yang dikirim otomatis saat pelanggan pertama kali menyapa.</p>
      <textarea
        rows={3}
        value={config?.greetingMessage || ''}
        onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
        className="w-full p-3 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
        placeholder="Halo, ada yang bisa dibantu?"
      />
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <Save className="w-4 h-4" /> Simpan Pesan Sapaan
      </button>
    </section>
  );
}
