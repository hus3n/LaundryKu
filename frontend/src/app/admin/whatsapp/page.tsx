'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { 
  QrCode, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  MessageSquare, 
  Send, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Code,
  LogOut,
  XCircle,
  Trash2,
  Play
} from 'lucide-react';
import type { WATemplate } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export default function WhatsAppPairingPage() {
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [phoneConnected, setPhoneConnected] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscriptionCode, setSubscriptionCode] = useState<string | null>(null);

  const [templates, setTemplates] = useState<WATemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  // Custom Message Form
  const [customPhone, setCustomPhone] = useState('');
  const [customName, setCustomName] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [customSuccess, setCustomSuccess] = useState<string | null>(null);

  const [pendingQueueCount, setPendingQueueCount] = useState<number>(0);

  const loadWAStatus = async () => {
    try {
      const res = await api.get('/whatsapp/status');
      const data = res.data.data;
      if (data) {
        setStatus(data.status);
        setPhoneConnected(data.phoneConnected || null);
        setQrCode(data.qrCode || null);
        if (typeof data.pendingQueueCount === 'number') {
          setPendingQueueCount(data.pendingQueueCount);
        }
      }
    } catch (err) {
      console.error('Failed to load WA status', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const res = await api.get('/whatsapp/templates');
      const list = res.data.data || [];
      setTemplates(list);
      if (list.length > 0) {
        setSelectedTemplateId(list[0]._id);
        setTemplateContent(list[0].content);
      }
    } catch (err) {
      console.error('Failed to load templates', err);
    }
  };

  useEffect(() => {
    loadWAStatus();
    loadTemplates();

    // Auto-poll WA status every 4s continuously so refresh and status changes are instant
    const interval = setInterval(() => {
      loadWAStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setLoadingStatus(true);
    setSubscriptionError(null);
    try {
      const res = await api.post('/whatsapp/connect');
      setStatus(res.data.data.status);
      setQrCode(res.data.data.qrCode);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.code && ['SUBSCRIPTION_EXPIRED', 'ACCOUNT_INACTIVE'].includes(errorData.code)) {
        setSubscriptionError(errorData.error);
        setSubscriptionCode(errorData.code);
      } else {
        alert(getApiErrorMessage(err, 'Gagal memulai pairing WhatsApp'));
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSimulatePairing = async () => {
    try {
      const testPhone = prompt('Masukkan nomor WhatsApp toko (contoh: 081234567890):', '081234567890');
      if (testPhone) {
        await api.post('/whatsapp/confirm-simulated', { phone: testPhone });
        loadWAStatus();
      }
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal pairing'));
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Putuskan koneksi WhatsApp ini? Anda dapat menautkan nomor WhatsApp baru setelahnya.')) {
      return;
    }
    setIsDisconnecting(true);
    try {
      await api.post('/whatsapp/disconnect');
      setStatus('DISCONNECTED');
      setPhoneConnected(null);
      setQrCode(null);
      await loadWAStatus();
      alert('Koneksi WhatsApp berhasil diputuskan. Anda dapat menautkan nomor WhatsApp baru sekarang.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal memutuskan WA'));
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleClearQueue = async () => {
    if (!confirm('Hapus semua pesan yang tertahan dalam antrean? Pesan tidak akan dikirim.')) return;
    try {
      const res = await api.post('/whatsapp/clear-queue');
      alert(res.data.message || 'Antrean berhasil dibersihkan.');
      loadWAStatus();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal membersihkan antrean'));
    }
  };

  const handleRetryQueue = async () => {
    try {
      const res = await api.post('/whatsapp/retry-queue');
      alert(res.data.message || 'Antrean pengiriman dipicu ulang.');
      loadWAStatus();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal memicu antrean'));
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = templates.find((t) => t._id === id);
    if (tmpl) {
      setTemplateContent(tmpl.content);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplateId) return;
    setSavingTemplate(true);
    try {
      await api.put(`/whatsapp/templates/${selectedTemplateId}`, { content: templateContent });
      alert('Template pesan berhasil disimpan!');
      loadTemplates();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan template'));
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMsg(true);
    setCustomSuccess(null);

    try {
      await api.post('/whatsapp/send-custom', {
        recipientPhone: customPhone,
        recipientName: customName,
        message: customMsg,
      });

      setCustomSuccess('Pesan telah dimasukkan ke antrian pengiriman (jeda 10 detik).');
      setCustomPhone('');
      setCustomName('');
      setCustomMsg('');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal mengirim pesan custom'));
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrasi WhatsApp Toko</h1>
          <p className="text-xs text-slate-400 mt-1">Pairing perangkat WhatsApp gateway, atur template pesan, dan pengiriman notifikasi</p>
        </div>

        {subscriptionError && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-400">
                  {subscriptionCode === 'SUBSCRIPTION_EXPIRED'
                    ? 'Masa Aktif Akun Telah Berakhir'
                    : 'Akun Tidak Aktif'}
                </h3>
                <p className="text-sm text-amber-300 mt-1">{subscriptionError}</p>
                {subscriptionCode !== 'ACCOUNT_INACTIVE' && (
                  <p className="text-sm text-amber-500 mt-2">
                    Hubungi administrator LaundryKu untuk memperpanjang masa aktif akun.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pairing Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-6 text-center">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Status Koneksi WA:</span>
              <span
                className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                  status === 'CONNECTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : status === 'CONNECTING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {status === 'CONNECTED' ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" /> Terhubung
                  </>
                ) : status === 'CONNECTING' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pairing...
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" /> Terputus
                  </>
                )}
              </span>
            </div>

            {/* Pending Queue Count Card */}
            {pendingQueueCount > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Antrean Tertahan:
                  </span>
                  <span className="font-bold text-amber-200 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    {pendingQueueCount} Pesan
                  </span>
                </div>
                <p className="text-[10px] text-amber-400/80 text-left">
                  {status === 'CONNECTED'
                    ? 'Pesan sedang dikirim bergantian dengan jeda aman 10 detik.'
                    : 'Pesan tertunda sampai WhatsApp toko terhubung kembali.'}
                </p>
                <div className="flex gap-2 pt-1">
                  {status === 'CONNECTED' && (
                    <button
                      type="button"
                      onClick={handleRetryQueue}
                      className="flex-1 py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
                    >
                      <Play className="w-3 h-3" /> Kirim Sekarang
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearQueue}
                    className="flex-1 py-1 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Bersihkan
                  </button>
                </div>
              </div>
            )}

            {/* QR Container */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
              {status === 'CONNECTED' ? (
                <div className="space-y-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-white text-sm">WA Toko Aktif</h4>
                  <p className="text-xs text-slate-400">{phoneConnected || '0812-3456-7890'}</p>
                </div>
              ) : qrCode ? (
                <div className="space-y-3">
                  <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-xl border">
                    <img src={qrCode} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[11px] text-amber-300">Scan QR Code dengan WhatsApp HP Toko</p>
                  <button
                    onClick={handleSimulatePairing}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30"
                  >
                    Simulasi Pairing Berhasil
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Klik "Hubungkan WA" untuk generate QR Code</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {status === 'CONNECTED' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDisconnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Memutuskan WhatsApp...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" /> Putuskan Koneksi WA
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400">
                    Klik tombol di atas untuk melepas tautan dan mengganti ke nomor WhatsApp lain.
                  </p>
                </div>
              ) : status === 'CONNECTING' ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleConnect}
                      disabled={loadingStatus}
                      className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                      Refresh QR
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      disabled={isDisconnecting}
                      className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {isDisconnecting ? 'Mereset...' : 'Batalkan Pairing'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Jika QR kedaluwarsa atau ingin ganti nomor, klik "Batalkan Pairing" lalu hubungkan kembali.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={loadingStatus || !!subscriptionError}
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingStatus ? 'animate-spin' : ''}`} />
                  Hubungkan WA Toko
                </button>
              )}
            </div>
          </div>

          {/* Template Editor */}
          <div className="md:col-span-2 glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-brand-400" /> Editor Template Pesan WA
              </h3>
              <button
                onClick={handleSaveTemplate}
                disabled={savingTemplate}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Simpan Template
              </button>
            </div>

            {/* Template Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl._id}
                  onClick={() => handleSelectTemplate(tmpl._id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedTemplateId === tmpl._id
                      ? 'bg-brand-500 text-white border-brand-400 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            {/* Editor Area */}
            <div className="space-y-3">
              <textarea
                rows={7}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono leading-relaxed"
              />

              {/* Dynamic Variables Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Variabel Dinamis yang Tersedia:</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;nama_pelanggan&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;no_nota&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;detail_item&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;total_harga&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;status_bayar&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;estimasi_selesai&#125;&#125;</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono">&#123;&#123;nama_toko&#125;&#125;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Message Sender */}
        <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" /> Kirim Pesan Custom via WA Toko
            </h3>
            <span className="text-[11px] text-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Jeda 10 detik per pengiriman pesan
            </span>
          </div>

          {customSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {customSuccess}
            </div>
          )}

          <form onSubmit={handleSendCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Penerima</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: Ibu Rina"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor WA Penerima</label>
                <input
                  type="text"
                  required
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Isi Pesan Custom</label>
              <textarea
                rows={3}
                required
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Masukkan isi pesan yang ingin dikirim..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendingMsg}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Masukkan Antrian Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
