'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Save, Bot, Key, Globe, Plus, Trash2 } from 'lucide-react';

export default function GlobalBotSettingsPage() {
  const [config, setConfig] = useState({
    apiKeys: [''],
    provider: 'openai',
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
          provider: res.data.data.provider || 'openai',
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
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Provider AI Utama</label>
            <select
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
              className="w-full px-4 py-2 bg-surface rounded-xl border border-[#1DA9D0]/25 text-xs text-foreground"
            >
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="gemini">Google Gemini</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="deepseek">DeepSeek</option>
              <option value="groq">Groq</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1 flex justify-between">
              <span>Rotasi API Keys (Round-Robin)</span>
              <button type="button" onClick={addKey} className="text-[#43D5CC] flex items-center gap-1">
                <Plus className="w-3 h-3" /> Tambah Key
              </button>
            </label>
            <div className="space-y-2">
              {config.apiKeys.map((key, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="w-3.5 h-3.5 text-foreground/40" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-[#1DA9D0]/25 text-xs"
                      placeholder="Masukkan Kunci API (sk-...)"
                      value={key}
                      onChange={(e) => {
                        const arr = [...config.apiKeys];
                        arr[idx] = e.target.value;
                        setConfig({ ...config, apiKeys: arr });
                      }}
                    />
                  </div>
                  {config.apiKeys.length > 1 && (
                    <button onClick={() => removeKey(idx)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-foreground/50 mt-1">
              Tambahkan lebih dari satu kunci API untuk membagi beban (menghindari rate-limit).
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs"
          >
            {saving ? 'Menyimpan...' : 'Simpan Konfigurasi Global'}
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
