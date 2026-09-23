'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import StoreLogoUploader from './components/StoreLogoUploader';

export default function StoreSettingsPage() {
  const { updateUser } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await api.get('/store');
        const data = res.data.data;
        if (data) {
          setStoreName(data.storeName || '');
          setStoreAddress(data.storeAddress || '');
          setStorePhone(data.storePhone || '');
          setStoreLogoUrl(data.storeLogo || null);
          setSubscriptionEnd(data.subscriptionEnd);
        }
      } catch (err) {
        console.error('Failed to load store settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await api.put('/store', {
        storeName,
        storeAddress,
        storePhone,
      });

      updateUser({ storeName });
      setMessage('Pengaturan toko berhasil disimpan.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menyimpan pengaturan toko.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUploaded = (newLogo: string) => {
    setStoreLogoUrl(newLogo);
    updateUser({ storeLogo: newLogo });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-6">
        <div>
          <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
            Pengaturan Toko Laundry
          </h1>
          <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">
            Atur profil toko, alamat, dan kontak yang tampil di nota/struk
          </p>
        </div>

        {message && (
          <div className="p-2.5 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="p-2.5 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-3 sm:space-y-6 shadow-sm">
          {loading ? (
            <div className="text-center py-6 sm:py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">
              Memuat profil toko...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
              <StoreLogoUploader
                storeLogoUrl={storeLogoUrl}
                onLogoUploaded={handleLogoUploaded}
              />

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                  Nama Toko Laundry *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Contoh: FreshClean Laundry 24"
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                  Nomor Telepon / WA Toko
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                  Alamat Toko Lengkap
                </label>
                <textarea
                  rows={2}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 45, Kecamatan Gambir, Jakarta Pusat"
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                />
              </div>

              {subscriptionEnd && (
                <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                  <span className="dark:text-[#F5EACA]/60 text-slate-500 text-[11px] sm:text-xs">
                    Masa Berlangganan:
                  </span>
                  <span className="font-bold dark:text-[#EA8803] text-amber-600 text-[11px] sm:text-xs">
                    {new Date(subscriptionEnd).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="pt-2 sm:pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
                  ) : (
                    <>
                      Simpan Perubahan
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
