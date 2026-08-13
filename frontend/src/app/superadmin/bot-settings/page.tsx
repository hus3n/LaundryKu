'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Plus, Trash2, Edit2, Bot, AlertTriangle, Key } from 'lucide-react';

export default function BotSettingsPage() {
  const [config, setConfig] = useState<any>({
    greetingMessage: '',
    isGreetingActive: false,
    aiApiKey: '',
    aiProvider: null,
    isAiActive: false,
  });
  const [autoReplies, setAutoReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

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
      setConfig(confRes.data.data);
      setAutoReplies(replyRes.data.data);
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
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          Memuat pengaturan bot...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" /> Pengaturan Bot WhatsApp
          </h1>
          <p className="text-xs text-slate-400 mt-1">Konfigurasi balasan otomatis dan integrasi AI</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-400">Mode Testing (SuperAdmin Only)</h3>
            <p className="text-xs text-amber-300 mt-1">
              Fitur ini saat ini hanya tersedia untuk SuperAdmin guna keperluan testing internal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Section 1: Greeting */}
            <section className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white">Pesan Sapaan Otomatis</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config?.isGreetingActive || false}
                    onChange={(e) => setConfig({ ...config, isGreetingActive: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>
              <p className="text-xs text-slate-400">Pesan yang dikirim otomatis saat pelanggan pertama kali chat.</p>
              <textarea
                rows={4}
                value={config?.greetingMessage || ''}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                placeholder="Halo, ada yang bisa dibantu?"
              />
              <button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Simpan Konfigurasi
              </button>
            </section>

            {/* Section 3: AI Integration */}
            <section className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" /> Integrasi AI (Fallback)
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config?.isAiActive || false}
                    onChange={(e) => setConfig({ ...config, isAiActive: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-xs text-slate-400">
                AI akan secara otomatis menjawab pesan yang tidak ada di dalam kata kunci Auto-Reply.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provider AI</label>
                  <select
                    value={config?.aiProvider || ''}
                    onChange={(e) => setConfig({ ...config, aiProvider: e.target.value || null })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="">-- Pilih Provider --</option>
                    <option value="openai">OpenAI (ChatGPT)</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">API Key</label>
                  <input
                    type="password"
                    value={config?.aiApiKey || ''}
                    onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                    placeholder="Masukkan API Key (cth: sk-...)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah kunci saat ini.</p>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Simpan Konfigurasi AI
                </button>
              </div>
            </section>
          </div>

          {/* Section 2: Auto Reply */}
          <section className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="font-bold text-white">Pesan Otomatis (Auto-Reply)</h2>
            
            <form onSubmit={handleAddAutoReply} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-brand-400">Tambah Aturan Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Kata Kunci (cth: promo)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  required
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Balasan..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 md:col-span-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingReply}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-3 px-4">Kata Kunci</th>
                    <th className="py-3 px-4">Balasan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {autoReplies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">Belum ada aturan auto-reply</td>
                    </tr>
                  ) : (
                    autoReplies.map((reply) => (
                      <tr key={reply._id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-brand-300">"{reply.keyword}"</td>
                        <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate" title={reply.reply}>
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
                            <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteAutoReply(reply._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
