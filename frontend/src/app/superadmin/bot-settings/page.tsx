'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Save, Bot, Key, Globe, Plus, Trash2, Cpu, Sparkles } from 'lucide-react';

export default function GlobalBotSettingsPage() {
  const [config, setConfig] = useState({
    apiKeys: [''],
    provider: 'custom',
    baseUrl: '',
    models: [''],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/superadmin/bot-config');
      if (res.data?.data) {
        setConfig({
          apiKeys: res.data.data.apiKeys?.length ? res.data.data.apiKeys : [''],
          provider: res.data.data.provider || 'custom',
          baseUrl: res.data.data.baseUrl || '',
          models: res.data.data.models?.length ? res.data.data.models : [''],
        });
      }
    } catch (err: any) {
      console.error('Failed to load global bot config', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...config,
        apiKeys: config.apiKeys.filter((k) => k.trim() !== ''),
        models: config.models.filter((m) => m.trim() !== ''),
      };
      await api.post('/superadmin/bot-config', payload);
      alert('Global AI Configuration saved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  const addKey = () => setConfig(p => ({ ...p, apiKeys: [...p.apiKeys, ''] }));
  const removeKey = (idx: number) => setConfig(p => {
    const arr = [...p.apiKeys];
    arr.splice(idx, 1);
    return { ...p, apiKeys: arr };
  });

  const addModel = () => setConfig(p => ({ ...p, models: [...p.models, ''] }));
  const removeModel = (idx: number) => setConfig(p => {
    const arr = [...p.models];
    arr.splice(idx, 1);
    return { ...p, models: arr };
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-foreground/60 text-sm">
          Memuat konfigurasi global...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#43D5CC]" /> Pengaturan Kunci API Pusat (Global)
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Konfigurasi utama sistem AI terpusat untuk semua cabang admin.
          </p>
        </div>

        <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Provider API Utama</label>
            <select
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
              className="w-full px-4 py-2 bg-surface rounded-xl border border-[#1DA9D0]/25 text-xs text-foreground"
            >
              <option value="custom">Custom (OpenAI-Compatible & Semua Provider)</option>
              <option value="openai">OpenAI (ChatGPT Native)</option>
              <option value="gemini">Google Gemini Native</option>
              <option value="anthropic">Anthropic Claude Native</option>
              <option value="deepseek">DeepSeek Native</option>
              <option value="groq">Groq Native</option>
              <option value="openrouter">OpenRouter Server</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Base URL Endpoint
              </label>
              <span className="text-[10px] text-foreground/50 font-mono">Opsional / Custom Proxy</span>
            </div>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="Contoh: https://api.openai.com/v1 atau http://localhost:11434/v1"
              className="w-full px-4 py-2 rounded-xl bg-background border border-[#1DA9D0]/25 text-xs text-foreground font-mono placeholder:font-sans placeholder:text-foreground/30 focus:outline-none focus:border-[#1DA9D0]"
            />
            <p className="text-[10px] text-foreground/50 mt-1">
              Digunakan jika Anda menggunakan layanan pihak ketiga, proxy, atau AI lokal seperti Ollama. Kosongkan jika ingin memakai Base URL bawaan provider.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1 flex justify-between items-end">
              <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-[#EA8803]"/> Rotasi API Keys (Round-Robin)</span>
              <button type="button" onClick={addKey} className="text-[#43D5CC] flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Tambah Key
              </button>
            </label>
            <div className="space-y-2 mt-2">
              {config.apiKeys.map((key, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl bg-background border border-[#1DA9D0]/25 text-xs font-mono"
                    placeholder="Masukkan Kunci API (sk-...)"
                    value={key}
                    onChange={(e) => {
                      const arr = [...config.apiKeys];
                      arr[idx] = e.target.value;
                      setConfig({ ...config, apiKeys: arr });
                    }}
                  />
                  {config.apiKeys.length > 1 && (
                    <button onClick={() => removeKey(idx)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-foreground/50 mt-1">
              Sistem akan membagi rata *request* ke semua kunci API yang ada secara bergiliran agar tidak terkena limit / Error 429.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1 flex justify-between items-end">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-400"/> Model Fallback / Rotasi Model</span>
              <button type="button" onClick={addModel} className="text-[#43D5CC] flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Tambah Model
              </button>
            </label>
            <div className="space-y-2 mt-2">
              {config.models.map((model, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center relative">
                  <div className="w-full flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#1DA9D0]/25 bg-muted text-[10px] text-foreground/60 w-16 justify-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-r-xl bg-background border border-[#1DA9D0]/25 text-xs font-mono"
                      placeholder="Contoh: gpt-4o-mini"
                      value={model}
                      onChange={(e) => {
                        const arr = [...config.models];
                        arr[idx] = e.target.value;
                        setConfig({ ...config, models: arr });
                      }}
                    />
                  </div>
                  {config.models.length > 1 && (
                    <button onClick={() => removeModel(idx)} className="p-2 ml-auto text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-foreground/50 mt-1">
              Tentukan model yang akan dipakai (cth: <code className="text-[#43D5CC]">gpt-4o-mini</code>, <code className="text-[#43D5CC]">llama-3.3-70b-versatile</code>). Saat model #1 error / kehabisan limit provider, sistem akan otomatis jatuh ke model #2, dan seterusnya.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-sm shadow-xl flex justify-center items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {saving ? 'Menyimpan Konfigurasi...' : 'Terapkan Konfigurasi Global'}
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
