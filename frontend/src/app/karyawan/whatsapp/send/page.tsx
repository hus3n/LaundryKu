'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Send, MessageCircle } from 'lucide-react';

export default function KaryawanSendWAMessage() {
  const [customPhone, setCustomPhone] = useState('');
  const [customName, setCustomName] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [customSuccess, setCustomSuccess] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const handleSendCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMsg(true);
    setCustomSuccess(null);
    setCustomError(null);

    try {
      await api.post('/whatsapp/send-custom', {
        recipientPhone: customPhone,
        recipientName: customName,
        message: customMsg,
      });
      setCustomSuccess('Pesan berhasil dikirim (atau masuk antrean jika sibuk).');
      setCustomMsg('');
    } catch (err: any) {
      setCustomError(err.response?.data?.error || 'Gagal mengirim pesan.');
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kirim Pesan WhatsApp</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Kirim pesan informasi tambahan ke pelanggan secara manual (misal: pakaian luntur, dll).
          </p>
        </div>

        <div className="glass-card-dark p-6 rounded-3xl border border-[#1DA9D0]/25">
          <form onSubmit={handleSendCustomMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                  Nama Pelanggan / Tujuan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-[#1DA9D0]/25 text-foreground focus:outline-none focus:border-[#1DA9D0] text-sm"
                  placeholder="Misal: Budi"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                  Nomor Handphone (WA) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-[#1DA9D0]/25 text-foreground focus:outline-none focus:border-[#1DA9D0] text-sm"
                  placeholder="Misal: 08123456789"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-foreground/60 mb-2 uppercase tracking-wider">
                Isi Pesan <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-[#1DA9D0]/25 text-foreground focus:outline-none focus:border-[#1DA9D0] text-sm resize-none"
                placeholder="Ketik pesan di sini..."
              />
            </div>

            {customSuccess && (
              <div className="p-4 rounded-xl bg-[#43D5CC]/10 border border-[#43D5CC]/30 text-[#43D5CC] text-xs">
                ✅ {customSuccess}
              </div>
            )}

            {customError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                ❌ {customError}
              </div>
            )}

            <button
              type="submit"
              disabled={sendingMsg}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-90 text-[#010E1C] font-bold text-sm transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sendingMsg ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-[#010E1C] rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pesan WhatsApp Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
