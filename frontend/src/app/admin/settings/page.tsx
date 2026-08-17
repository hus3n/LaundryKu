'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StoreSettingsPage() {
  const { updateUser } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimum 2MB.');
      return;
    }
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      const res = await api.post('/store/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data.success) {
        alert('Logo berhasil diupload!');
        const newLogo = res.data.data.storeLogo;
        setStoreLogoUrl(newLogo);
        updateUser({ storeLogo: newLogo });
        setLogoFile(null);
        setLogoPreview(null);
      } else {
        alert(`Gagal upload logo: ${res.data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      console.error('Error upload logo:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Terjadi kesalahan saat upload logo.';
      alert(`Gagal upload logo: ${errorMsg}`);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const getLogoDisplayUrl = () => {
    if (logoPreview) return logoPreview;
    if (!storeLogoUrl) return null;
    if (storeLogoUrl.startsWith('http://') || storeLogoUrl.startsWith('https://')) return storeLogoUrl;
    const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001').replace(/\/api\/?$/, '');
    const cleanPath = storeLogoUrl.startsWith('/') ? storeLogoUrl.slice(1) : storeLogoUrl;
    return `${backendBase}/${cleanPath}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pengaturan Toko Laundry</h1>
          <p className="text-xs text-slate-400 mt-1">Atur profil toko, alamat, dan kontak yang akan tampil di nota/struk</p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-6">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Memuat profil toko...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Upload Logo */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-3">Logo Toko</label>
                
                {/* Preview Logo */}
                <div className="mb-4">
                  {(logoPreview || storeLogoUrl) ? (
                    <img
                      src={getLogoDisplayUrl()!}
                      alt="Logo Toko"
                      className="w-24 h-24 object-contain border border-slate-700 bg-white rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-xs text-center">
                      Belum ada logo
                    </div>
                  )}
                </div>
                
                {/* Input File */}
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <label
                    htmlFor="logoUpload"
                    className="cursor-pointer px-4 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Pilih File
                  </label>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleUploadLogo}
                      disabled={isUploadingLogo}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                    >
                      {isUploadingLogo ? 'Mengupload...' : 'Upload Logo'}
                    </button>
                  )}
                </div>
                {logoFile && (
                  <p className="text-[10px] text-brand-400 mt-2">File dipilih: {logoFile.name}</p>
                )}
                <p className="text-[10px] text-slate-500 mt-1">Format: JPG, PNG, WebP. Maks 2MB.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Toko Laundry *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Contoh: FreshClean Laundry 24"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nomor Telepon / WA Toko</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat Toko Lengkap</label>
                <textarea
                  rows={3}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 45, Kecamatan Gambir, Jakarta Pusat"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              {subscriptionEnd && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Masa Aktif Berlangganan Toko:</span>
                  <span className="font-bold text-amber-400">
                    {new Date(subscriptionEnd).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Simpan Perubahan
                      <CheckCircle2 className="w-4 h-4" />
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
