'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Bot, Sparkles } from 'lucide-react';
import {
  BotConfig,
  AutoReplyItem,
  TestAiResult,
  AI_PRESETS,
} from './botSettingsData';
import BotGreetingSection from './components/BotGreetingSection';
import BotAiConfigSection from './components/BotAiConfigSection';
import BotAutoRepliesSection from './components/BotAutoRepliesSection';

const DEFAULT_CONFIG: BotConfig = {
  greetingMessage: '',
  isGreetingActive: false,
  aiApiKey: '',
  aiProvider: 'openai',
  aiBaseUrl: '',
  aiModel: '',
  aiSystemPrompt:
    'Anda adalah asisten AI ramah dan profesional untuk layanan LaundryKu. Jawab pertanyaan pelanggan dengan sopan, jelas, dan informatif.',
  isAiActive: false,
};

export default function BotSettingsPage() {
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [autoReplies, setAutoReplies] = useState<AutoReplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<TestAiResult | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [confRes, replyRes] = await Promise.all([
        api.get('/bot/config'),
        api.get('/bot/auto-replies'),
      ]);
      const loaded = confRes.data.data || {};
      setConfig({
        ...DEFAULT_CONFIG,
        ...loaded,
        aiProvider: loaded.aiProvider || 'openai',
        aiBaseUrl: loaded.aiBaseUrl || '',
        aiModel: loaded.aiModel || '',
        aiSystemPrompt: loaded.aiSystemPrompt || DEFAULT_CONFIG.aiSystemPrompt,
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
    setConfig((prev) => ({
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

  const handleAddAutoReply = async (keyword: string, reply: string) => {
    try {
      await api.post('/bot/auto-replies', { keyword, reply });
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menambahkan auto-reply');
    }
  };

  const handleToggleAutoReply = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/bot/auto-replies/${id}/toggle`, { isActive });
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengubah status');
    }
  };

  const handleDeleteAutoReply = async (id: string) => {
    if (!confirm('Hapus auto-reply ini?')) return;
    try {
      await api.delete(`/bot/auto-replies/${id}`);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 dark:text-[#F5EACA]/60 text-slate-500 text-sm">
          Memuat pengaturan bot...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#1DA9D0] dark:text-[#43D5CC]" /> Pengaturan Bot WhatsApp & AI Universal
          </h1>
          <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
            Konfigurasi balasan otomatis, pesan sapaan, dan integrasi kecerdasan buatan (AI) dari berbagai penyedia dan custom endpoint.
          </p>
        </div>

        <div className="p-4 rounded-xl border dark:border-[#1DA9D0]/30 border-[#1DA9D0]/20 dark:bg-[#1DA9D0]/10 bg-sky-50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC] mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-[#1DA9D0] dark:text-[#43D5CC] text-xs sm:text-sm">Universal AI Connector Aktif</h3>
            <p className="text-xs dark:text-[#F5EACA]/80 text-slate-700 mt-0.5">
              Anda dapat menghubungkan <strong>semua jenis AI</strong>: OpenAI, DeepSeek, Groq, Google Gemini, OpenRouter, Claude, Ollama lokal, hingga custom base URL / proxy API key pihak ketiga.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BotGreetingSection
              config={config}
              setConfig={setConfig}
              onSave={handleSaveConfig}
              saving={savingConfig}
            />
            <BotAiConfigSection
              config={config}
              setConfig={setConfig}
              onSave={handleSaveConfig}
              saving={savingConfig}
              onTestAi={handleTestAi}
              isTestingAi={isTestingAi}
              testResult={testResult}
              onProviderChange={handleProviderChange}
            />
          </div>

          <div>
            <BotAutoRepliesSection
              autoReplies={autoReplies}
              onAddAutoReply={handleAddAutoReply}
              onToggleAutoReply={handleToggleAutoReply}
              onDeleteAutoReply={handleDeleteAutoReply}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
