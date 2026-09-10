'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import {
  Save,
  Plus,
  Trash2,
  Bot,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function AdminBotSettingsPage() {
  const [config, setConfig] = useState<any>({
    greetingMessage: '',
    isGreetingActive: false,
    aiSystemPrompt: '',
    isAiActive: false,
    isAiEnabledBySuperadmin: false,
    aiDailyLimit: 100,
    aiUsageToday: 0,
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
      const loaded = confRes.data.data || {};

      setConfig({
        ...loaded,
        aiSystemPrompt:
          loaded.aiSystemPrompt ||
          'Anda adalah asisten AI ramah dan profesional untuk layanan LaundryKu. Jawab pertanyaan pelanggan dengan sopan, jelas, dan informatif.',
      });
      setAutoReplies(replyRes.data.data || []);
    } catch (err: any) {
      console.error('Failed to load bot settings', err);
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
      alert('Pengaturan Bot berhasil disimpan!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan pengaturan');
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
        <div className="flex items-center justify-center h-64 text-foreground/60 text-sm">
          Memuat pengaturan bot...
        </div>
      </DashboardLayout>
    );
  }

  const usagePercent = Math.min(100, Math.round((config.aiUsageToday / (config.aiDailyLimit || 1)) * 100));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#43D5CC]" /> Pengaturan Bot WhatsApp
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Konfigurasi balasan otomatis, pesan sapaan, dan kepribadian AI toko Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            
            {/* Section 1: Universal AI Integration (Read-only Quota + Prompt Editable) */}
            <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Pusat AI Pintar (Langganan)
                </h2>
                {config.isAiEnabledBySuperadmin && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={config?.isAiActive || false}
                      onChange={(e) => setConfig({ ...config, isAiActive: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#1DA9D0] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                )}
              </div>

              {!config.isAiEnabledBySuperadmin ? (
                <div className="p-4 bg-muted/30 border border-muted-hover rounded-xl flex items-center gap-3">
                  <Lock className="w-8 h-8 text-foreground/40 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/80">Akses AI Terkunci</h3>
                    <p className="text-[10px] text-foreground/50 mt-1">
                      Platform AI Pintar belum diaktifkan untuk toko Anda. Silakan hubungi pusat/Superadmin untuk berlangganan Paket AI.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-[#1DA9D0]/10 border border-[#1DA9D0]/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground/80">Sisa Kuota Tanya AI:</span>
                      <span className="font-bold text-[#43D5CC]">{config.aiUsageToday} / {config.aiDailyLimit}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${usagePercent > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC]'}`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-foreground/50">
                      Kuota akan di-reset otomatis setiap hari jam 00:00. Sistem AI dikontrol aman oleh Pusat.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Kepribadian AI & Aturan Khusus Toko
                    </label>
                    <textarea
                      rows={4}
                      value={config?.aiSystemPrompt || ''}
                      onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
                      placeholder="Contoh: Kamu adalah admin LaundryKu cabang Sudirman. Gunakan bahasa gaul Jakarta..."
                      className="w-full p-3 rounded-xl bg-surface border border-[#1DA9D0]/25 text-xs text-foreground focus:outline-none focus:border-[#1DA9D0]"
                    />
                    <p className="text-[10px] text-foreground/50 mt-1">
                      Catatan: AI sudah otomatis mengetahui nama toko dan daftar harga paket Anda. Anda hanya perlu memberi instruksi gaya bahasa/pelayanan.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    disabled={savingConfig}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs"
                  >
                    {savingConfig ? 'Menyimpan...' : 'Simpan Setelan AI'}
                  </button>
                </>
              )}
            </section>

            {/* Section 2: Greeting */}
            <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#43D5CC]" /> Sapaan Otomatis (Fallback)
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config?.isGreetingActive || false}
                    onChange={(e) => setConfig({ ...config, isGreetingActive: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#1DA9D0] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
              <p className="text-xs text-foreground/60">Pesan statis yang dikirim jika AI mati/kuota habis saat ada sapaan (Halo, Pagi).</p>
              <textarea
                rows={3}
                value={config?.greetingMessage || ''}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                className="w-full p-3 rounded-xl bg-surface border border-[#1DA9D0]/25 text-xs text-foreground focus:outline-none focus:border-[#1DA9D0]"
              />
              <button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs"
              >
                <Save className="w-4 h-4 inline-block mr-1" /> Simpan Sapaan
              </button>
            </section>

          </div>

          {/* Section 3: Auto Reply Keywords */}
          <section className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-6">
            <div>
              <h2 className="font-bold text-foreground">Pesan Kata Kunci (Auto-Reply)</h2>
              <p className="text-xs text-foreground/60 mt-0.5">
                Balasan mutlak berdasarkan teks persis. (Memotong jalan AI).
              </p>
            </div>

            <form
              onSubmit={handleAddAutoReply}
              className="p-4 rounded-xl bg-surface border border-[#1DA9D0]/15 space-y-3"
            >
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  required
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Kata Kunci (cth: promo)"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-[#1DA9D0]/25 text-xs"
                />
                <input
                  type="text"
                  required
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Balasan otomatis..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-[#1DA9D0]/25 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingReply}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold text-xs"
                >
                  <Plus className="w-4 h-4 inline-block mr-1" /> Tambah 
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1DA9D0]/15 text-foreground/60 font-medium">
                    <th className="py-2 px-2">Kunci</th>
                    <th className="py-2 px-2">Balasan</th>
                    <th className="py-2 px-2 text-center">Status</th>
                    <th className="py-2 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1DA9D0]/10">
                  {autoReplies.map((reply) => (
                    <tr key={reply._id} className="hover:bg-muted/50">
                      <td className="py-2 px-2 font-semibold text-[#43D5CC]">{reply.keyword}</td>
                      <td className="py-2 px-2 text-foreground/80 truncate max-w-[150px]">{reply.reply}</td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={reply.isActive}
                          onChange={(e) => handleToggleAutoReply(reply._id, e.target.checked)}
                          className="w-4 h-4 rounded text-[#43D5CC]"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteAutoReply(reply._id)}
                          className="text-rose-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
