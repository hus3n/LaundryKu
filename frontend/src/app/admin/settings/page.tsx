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
    const cleanPath = storeLogoUrl.startsWith('/') ? storeLogoUrl.slice(1) : storeLogoUrl;
    return `/${cleanPath}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-6">
        <div>
          <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Pengaturan Toko Laundry</h1>
          <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Atur profil toko, alamat, dan kontak yang tampil di nota/struk</p>
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
            <div className="text-center py-6 sm:py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat profil toko...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
              
              {/* Upload Logo */}
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200">
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-2 sm:mb-3">Logo Toko</label>
                
                {/* Preview Logo */}
                <div className="mb-2 sm:mb-4">
                  {(logoPreview || storeLogoUrl) ? (
                    <img
                      src={getLogoDisplayUrl()!}
                      alt="Logo Toko"
                      className="w-16 h-16 sm:w-24 sm:h-24 object-contain border dark:border-[#1DA9D0]/25 border-slate-300 bg-white rounded-lg sm:rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-dashed dark:border-[#1DA9D0]/25 border-slate-300 rounded-lg sm:rounded-xl flex items-center justify-center dark:text-[#F5EACA]/50 text-slate-400 text-[10px] sm:text-xs text-center p-1">
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
                <div className="flex gap-2 sm:gap-3 items-center">
                  <label
                    htmlFor="logoUpload"
                    className="cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 border dark:border-[#1DA9D0]/25 border-slate-300 rounded-lg text-xs font-medium dark:text-[#F5EACA]/80 text-slate-700 dark:hover:bg-[#013D66] hover:bg-slate-200 transition-colors"
                  >
                    Pilih File
                  </label>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleUploadLogo}
                      disabled={isUploadingLogo}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold rounded-lg text-xs hover:opacity-95 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isUploadingLogo ? 'Mengupload...' : 'Upload Logo'}
                    </button>
                  )}
                </div>
                {logoFile && (
                  <p className="text-[10px] dark:text-[#43D5CC] text-teal-600 mt-1 sm:mt-2">File dipilih: {logoFile.name}</p>
                )}
                <p className="text-[9px] sm:text-[10px] dark:text-[#F5EACA]/50 text-slate-400 mt-0.5 sm:mt-1">Format: JPG, PNG, WebP. Maks 2MB.</p>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nama Toko Laundry *</label>
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
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nomor Telepon / WA Toko</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Alamat Toko Lengkap</label>
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
                  <span className="dark:text-[#F5EACA]/60 text-slate-500 text-[11px] sm:text-xs">Masa Berlangganan:</span>
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
