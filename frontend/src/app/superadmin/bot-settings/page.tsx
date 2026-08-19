'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Edit2,
  Bot,
  AlertTriangle,
  Key,
  Globe,
  Cpu,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Radio,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

const AI_PRESETS: Record<
  string,
  { label: string; baseUrl: string; defaultModel: string; placeholderKey: string }
> = {
  openai: {
    label: 'OpenAI (ChatGPT)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    placeholderKey: 'sk-...',
  },
  deepseek: {
    label: 'DeepSeek AI',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    placeholderKey: 'sk-...',
  },
  groq: {
    label: 'Groq (Ultra-fast LLM)',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    placeholderKey: 'gsk_...',
  },
  gemini: {
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-1.5-flash',
    placeholderKey: 'AIzaSy...',
  },
  openrouter: {
    label: 'OpenRouter (Multi-Model Hub)',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
    placeholderKey: 'sk-or-v1-...',
  },
  anthropic: {
    label: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    placeholderKey: 'sk-ant-...',
  },
  ollama: {
    label: 'Ollama (Local AI / Self-Hosted)',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    placeholderKey: 'ollama (kosongkan / ketik bebas)',
  },
  custom: {
    label: 'Custom (Semua Endpoint OpenAI-Compatible / Proxy)',
    baseUrl: '',
    defaultModel: 'gpt-4o-mini',
    placeholderKey: 'API key penyedia Anda...',
  },
};

export default function BotSettingsPage() {
  const [config, setConfig] = useState<any>({
    greetingMessage: '',
    isGreetingActive: false,
    aiApiKey: '',
    aiProvider: 'openai',
    aiBaseUrl: '',
    aiModel: '',
    aiSystemPrompt: '',
    isAiActive: false,
  });
  const [autoReplies, setAutoReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Test AI Connection States
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    reply?: string;
    modelUsed?: string;
    providerUsed?: string;
    error?: string;
  } | null>(null);

  // Form State
  const [newKeyword, setNewKeyword] = useState('');
  const [newReply, setNewReply] = useState('');
  const [isAddingReply, setIsAddingReply] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [confRes, replyRes] = await Promise.all([
        api.get('/bot/config'),
        api.get('/bot/auto-replies'),
      ]);
      const loaded = confRes.data.data || {};
      setConfig({
        ...loaded,
        aiProvider: loaded.aiProvider || 'openai',
        aiBaseUrl: loaded.aiBaseUrl || '',
        aiModel: loaded.aiModel || '',
        aiSystemPrompt:
          loaded.aiSystemPrompt ||
          'Anda adalah asisten AI ramah dan profesional untuk layanan LaundryKu. Jawab pertanyaan pelanggan dengan sopan, jelas, dan informatif.',
      });
      setAutoReplies(replyRes.data.data || []);
    } catch (err: any) {
      if (err.response?.status !== 403) {
        console.error('Failed to load bot settings', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProviderChange = (newProvider: string) => {
    const preset = AI_PRESETS[newProvider];
    setConfig((prev: any) => ({
      ...prev,
      aiProvider: newProvider,
      aiBaseUrl: preset ? preset.baseUrl : prev.aiBaseUrl,
      aiModel: preset ? preset.defaultModel : prev.aiModel,
    }));
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await api.put('/bot/config', config);
      alert('Konfigurasi berhasil disimpan!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan konfigurasi');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTestAi = async () => {
    setIsTestingAi(true);
    setTestResult(null);
    try {
      const res = await api.post('/bot/test-ai', {
        apiKey: config.aiApiKey,
        provider: config.aiProvider,
        baseUrl: config.aiBaseUrl,
        model: config.aiModel,
        systemPrompt: config.aiSystemPrompt,
      });
      setTestResult(res.data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.response?.data?.error || err.message || 'Gagal menguji koneksi AI',
      });
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleAddAutoReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingReply(true);
    try {
      await api.post('/bot/auto-replies', { keyword: newKeyword, reply: newReply });
      setNewKeyword('');
      setNewReply('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menambahkan auto-reply');
    } finally {
      setIsAddingReply(false);
    }
  };

  const handleToggleAutoReply = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/bot/auto-replies/${id}/toggle`, { isActive });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengubah status');
    }
  };

  const handleDeleteAutoReply = async (id: string) => {
    if (!confirm('Hapus auto-reply ini?')) return;
    try {
      await api.delete(`/bot/auto-replies/${id}`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-[#F5EACA]/60 text-sm">
          Memuat pengaturan bot...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F5EACA] flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#43D5CC]" /> Pengaturan Bot WhatsApp & AI Universal
          </h1>
          <p className="text-xs text-[#F5EACA]/60 mt-1">
            Konfigurasi balasan otomatis, pesan sapaan, dan integrasi kecerdasan buatan (AI) dari berbagai penyedia dan custom endpoint.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#1DA9D0]/30 bg-[#1DA9D0]/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#43D5CC] mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-[#43D5CC] text-xs sm:text-sm">Universal AI Connector Aktif</h3>
            <p className="text-xs text-[#F5EACA]/80 mt-0.5">
              Anda dapat menghubungkan <strong>semua jenis AI</strong>: OpenAI, DeepSeek, Groq, Google Gemini, OpenRouter, Claude, Ollama lokal, hingga custom base URL / proxy API key pihak ketiga.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Section 1: Greeting */}
            <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#F5EACA] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#43D5CC]" /> Pesan Sapaan Otomatis
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config?.isGreetingActive || false}
                    onChange={(e) => setConfig({ ...config, isGreetingActive: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-[#013D66] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1DA9D0]"></div>
                </label>
              </div>
              <p className="text-xs text-[#F5EACA]/60">Pesan yang dikirim otomatis saat pelanggan pertama kali menyapa.</p>
              <textarea
                rows={3}
                value={config?.greetingMessage || ''}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                placeholder="Halo, ada yang bisa dibantu?"
              />
              <button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Simpan Pesan Sapaan
              </button>
            </section>

            {/* Section 2: Universal AI Integration */}
            <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#F5EACA] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Integrasi AI Universal (Fallback)
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config?.isAiActive || false}
                    onChange={(e) => setConfig({ ...config, isAiActive: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-[#013D66] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-xs text-[#F5EACA]/60">
                AI akan secara cerdas membalas pertanyaan pelanggan jika pesan tidak cocok dengan nomor nota ataupun kata kunci Auto-Reply.
              </p>

              <div className="space-y-4 pt-2">
                {/* Provider Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#43D5CC]" /> Provider AI
                  </label>
                  <select
                    value={config?.aiProvider || 'custom'}
                    onChange={(e) => handleProviderChange(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                  >
                    {Object.entries(AI_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base URL Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" /> Base URL Endpoint
                    </label>
                    <span className="text-[10px] text-[#F5EACA]/50 font-mono">Dapat disesuaikan bebas</span>
                  </div>
                  <input
                    type="text"
                    value={config?.aiBaseUrl || ''}
                    onChange={(e) => setConfig({ ...config, aiBaseUrl: e.target.value })}
                    placeholder="https://api.openai.com/v1 atau https://api.deepseek.com/v1"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] font-mono placeholder:font-sans placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                  />
                  <p className="text-[10px] text-[#F5EACA]/50 mt-1">
                    Mendukung semua endpoint REST OpenAI-compatible, cloud proxy, Ollama lokal (<code className="text-[#43D5CC]">http://localhost:11434/v1</code>), atau gateway API lainnya.
                  </p>
                </div>

                {/* Model Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#43D5CC]" /> Model Name
                  </label>
                  <input
                    type="text"
                    value={config?.aiModel || ''}
                    onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                    placeholder="cth: gpt-4o-mini, deepseek-chat, llama-3.3-70b-versatile, gemini-1.5-flash"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] font-mono placeholder:font-sans placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                {/* API Key Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#EA8803]" /> API Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-[#F5EACA]/60 hover:text-[#F5EACA] inline-flex items-center gap-1"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] font-mono placeholder:font-sans placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                  />
                  <p className="text-[10px] text-[#F5EACA]/50 mt-1">
                    {config?.aiApiKey?.startsWith('••••••••')
                      ? 'Kunci saat ini tersimpan aman di server. Kosongkan jika tidak ingin mengubah.'
                      : 'Kunci akan dienkripsi dan disimpan dengan aman.'}
                  </p>
                </div>

                {/* System Prompt Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">
                    Instruksi Karakter & Pengetahuan AI (System Prompt)
                  </label>
                  <textarea
                    rows={3}
                    value={config?.aiSystemPrompt || ''}
                    onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
                    placeholder="Instruksi kepribadian dan aturan menjawab untuk asisten AI..."
                    className="w-full p-3 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                {/* Test AI Result Badge */}
                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl text-xs border ${
                      testResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {testResult.success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Koneksi AI Berhasil!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Koneksi AI Gagal:</span>
                        </>
                      )}
                    </div>
                    <div className="text-[11px] opacity-90 break-words">
                      {testResult.success ? (
                        <>
                          <span className="font-semibold text-[#F5EACA]">Respon AI:</span> &quot;{testResult.reply}&quot;
                          {testResult.modelUsed && (
                            <div className="mt-1 text-[10px] text-[#F5EACA]/60">
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
                    onClick={handleTestAi}
                    disabled={isTestingAi}
                    className="px-4 py-2 rounded-xl bg-[#013D66] hover:bg-[#014775] text-[#F5EACA] border border-[#1DA9D0]/25 font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isTestingAi ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#43D5CC]" />
                        Menguji Koneksi...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#43D5CC]" />
                        Test Koneksi AI
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    disabled={savingConfig}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    <Save className="w-4 h-4" /> Simpan Konfigurasi AI
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Section 3: Auto Reply Keywords */}
          <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-6">
            <div>
              <h2 className="font-bold text-[#F5EACA]">Pesan Otomatis Kata Kunci (Auto-Reply)</h2>
              <p className="text-xs text-[#F5EACA]/60 mt-0.5">
                Balasan instan berdasarkan kata kunci spesifik sebelum dilempar ke AI.
              </p>
            </div>

            <form
              onSubmit={handleAddAutoReply}
              className="p-4 rounded-xl bg-[#012040] border border-[#1DA9D0]/15 space-y-3"
            >
              <h3 className="text-xs font-semibold text-[#43D5CC]">Tambah Aturan Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Kata Kunci (cth: harga)"
                  className="w-full px-3 py-2 rounded-lg bg-[#010E1C] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                />
                <input
                  type="text"
                  required
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Balasan otomatis..."
                  className="w-full px-3 py-2 rounded-lg bg-[#010E1C] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0] md:col-span-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingReply}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Tambah Kata Kunci
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1DA9D0]/15 text-[#F5EACA]/60 font-medium">
                    <th className="py-3 px-4">Kata Kunci</th>
                    <th className="py-3 px-4">Balasan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1DA9D0]/10">
                  {autoReplies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#F5EACA]/50">
                        Belum ada aturan kata kunci auto-reply
                      </td>
                    </tr>
                  ) : (
                    autoReplies.map((reply) => (
                      <tr key={reply._id} className="hover:bg-[#013D66]/50">
                        <td className="py-3 px-4 font-semibold text-[#43D5CC]">&quot;{reply.keyword}&quot;</td>
                        <td className="py-3 px-4 text-[#F5EACA]/80 max-w-[200px] truncate" title={reply.reply}>
                          {reply.reply}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={reply.isActive}
                              onChange={(e) => handleToggleAutoReply(reply._id, e.target.checked)}
                            />
                            <div className="w-7 h-4 bg-[#013D66] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteAutoReply(reply._id)}
                            className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

