'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Radio,
  Globe,
  Cpu,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Save,
} from 'lucide-react';
import { BotConfig, TestAiResult, AI_PRESETS } from '../botSettingsData';

interface BotAiConfigSectionProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  onSave: () => void;
  saving: boolean;
  onTestAi: () => void;
  isTestingAi: boolean;
  testResult: TestAiResult | null;
  onProviderChange: (provider: string) => void;
}

export default function BotAiConfigSection({
  config,
  setConfig,
  onSave,
  saving,
  onTestAi,
  isTestingAi,
  testResult,
  onProviderChange,
}: BotAiConfigSectionProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <section className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Integrasi AI Universal (Fallback)
        </h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={config?.isAiActive || false}
            onChange={(e) => setConfig({ ...config, isAiActive: e.target.checked })}
          />
          <div className="w-9 h-5 dark:bg-[#013D66] bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
      <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500">
        AI akan secara cerdas membalas pertanyaan pelanggan jika pesan tidak cocok dengan nomor nota ataupun kata kunci Auto-Reply.
      </p>

      <div className="space-y-4 pt-2">
        {/* Provider Selector */}
        <div>
          <label className="text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#1DA9D0] dark:text-[#43D5CC]" /> Provider AI
          </label>
          <select
            value={config?.aiProvider || 'custom'}
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
          >
            {Object.entries(AI_PRESETS).map(([key, item]) => (
              <option key={key} value={key} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Base URL Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Base URL Endpoint
            </label>
            <span className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400 font-mono">Dapat disesuaikan bebas</span>
          </div>
          <input
            type="text"
            value={config?.aiBaseUrl || ''}
            onChange={(e) => setConfig({ ...config, aiBaseUrl: e.target.value })}
            placeholder="https://api.openai.com/v1 atau https://api.deepseek.com/v1"
            className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
          />
          <p className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400 mt-1">
            Mendukung semua endpoint REST OpenAI-compatible, cloud proxy, Ollama lokal (<code className="text-[#1DA9D0] dark:text-[#43D5CC]">http://localhost:11434/v1</code>), atau gateway API lainnya.
          </p>
        </div>

        {/* Model Name Input */}
        <div>
          <label className="text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#1DA9D0] dark:text-[#43D5CC]" /> Model Name
          </label>
          <input
            type="text"
            value={config?.aiModel || ''}
            onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
            placeholder="cth: gpt-4o-mini, deepseek-chat, llama-3.3-70b-versatile, gemini-1.5-flash"
            className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
          />
        </div>

        {/* API Key Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600 dark:text-[#EA8803]" /> API Key
            </label>
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#F5EACA] hover:text-slate-900 inline-flex items-center gap-1"
            >
              {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showApiKey ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={config?.aiApiKey || ''}
            onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
            placeholder={AI_PRESETS[config?.aiProvider]?.placeholderKey || 'Masukkan API Key Anda...'}
            className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
          />
          <p className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400 mt-1">
            {config?.aiApiKey?.startsWith('••••••••')
              ? 'Kunci saat ini tersimpan aman di server. Kosongkan jika tidak ingin mengubah.'
              : 'Kunci akan dienkripsi dan disimpan dengan aman.'}
          </p>
        </div>

        {/* System Prompt Input */}
        <div>
          <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
            Instruksi Karakter & Pengetahuan AI (System Prompt)
          </label>
          <textarea
            rows={3}
            value={config?.aiSystemPrompt || ''}
            onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
            placeholder="Instruksi kepribadian dan aturan menjawab untuk asisten AI..."
            className="w-full p-3 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
          />
        </div>

        {/* Test AI Result Badge */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl text-xs border ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {testResult.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Koneksi AI Berhasil!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span>Koneksi AI Gagal:</span>
                </>
              )}
            </div>
            <div className="text-[11px] opacity-90 break-words">
              {testResult.success ? (
                <>
                  <span className="font-semibold dark:text-[#F5EACA] text-slate-900">Respon AI:</span> &quot;{testResult.reply}&quot;
                  {testResult.modelUsed && (
                    <div className="mt-1 text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
                      Model: {testResult.modelUsed} · Provider: {testResult.providerUsed}
                    </div>
                  )}
                </>
              ) : (
                testResult.error
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onTestAi}
            disabled={isTestingAi}
            className="px-4 py-2 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:hover:bg-[#014775] hover:bg-slate-200 dark:text-[#F5EACA] text-slate-800 border dark:border-[#1DA9D0]/25 border-slate-300 font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isTestingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#1DA9D0] dark:text-[#43D5CC]" />
                Menguji Koneksi...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#1DA9D0] dark:text-[#43D5CC]" />
                Test Koneksi AI
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" /> Simpan Konfigurasi AI
          </button>
        </div>
      </div>
    </section>
  );
}
