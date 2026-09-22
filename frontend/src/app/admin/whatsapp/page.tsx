'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import type { WATemplate } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import WaPairingStatusCard from './components/WaPairingStatusCard';
import WaTemplateEditorCard from './components/WaTemplateEditorCard';
import WaCustomMessageCard from './components/WaCustomMessageCard';

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
          <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Integrasi WhatsApp Toko</h1>
          <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
            Pairing perangkat WhatsApp gateway, atur template pesan, dan pengiriman notifikasi
          </p>
        </div>

        {subscriptionError && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 dark:text-[#EA8803] text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium dark:text-[#EA8803] text-amber-700">
                  {subscriptionCode === 'SUBSCRIPTION_EXPIRED'
                    ? 'Masa Aktif Akun Telah Berakhir'
                    : 'Akun Tidak Aktif'}
                </h3>
                <p className="text-sm dark:text-[#F5EACA]/80 text-slate-700 mt-1">{subscriptionError}</p>
                {subscriptionCode !== 'ACCOUNT_INACTIVE' && (
                  <p className="text-sm dark:text-[#EA8803] text-amber-700 mt-2">
                    Hubungi administrator LaundryKu untuk memperpanjang masa aktif akun.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WaPairingStatusCard
            status={status}
            phoneConnected={phoneConnected}
            qrCode={qrCode}
            loadingStatus={loadingStatus}
            isDisconnecting={isDisconnecting}
            pendingQueueCount={pendingQueueCount}
            hasSubscriptionError={!!subscriptionError}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onSimulatePairing={handleSimulatePairing}
            onClearQueue={handleClearQueue}
            onRetryQueue={handleRetryQueue}
          />

          <WaTemplateEditorCard
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            templateContent={templateContent}
            savingTemplate={savingTemplate}
            onSelectTemplate={handleSelectTemplate}
            onChangeContent={setTemplateContent}
            onSaveTemplate={handleSaveTemplate}
          />
        </div>

        <WaCustomMessageCard
          customName={customName}
          setCustomName={setCustomName}
          customPhone={customPhone}
          setCustomPhone={setCustomPhone}
          customMsg={customMsg}
          setCustomMsg={setCustomMsg}
          sendingMsg={sendingMsg}
          customSuccess={customSuccess}
          onSubmit={handleSendCustom}
        />
      </div>
    </DashboardLayout>
  );
}
