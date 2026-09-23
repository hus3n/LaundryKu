'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

interface StoreLogoUploaderProps {
  storeLogoUrl: string | null;
  onLogoUploaded: (newLogo: string) => void;
}

export default function StoreLogoUploader({
  storeLogoUrl,
  onLogoUploaded,
}: StoreLogoUploaderProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
        onLogoUploaded(newLogo);
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
    <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200">
      <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-2 sm:mb-3">
        Logo Toko
      </label>

      {/* Preview Logo */}
      <div className="mb-2 sm:mb-4">
        {logoPreview || storeLogoUrl ? (
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
        <p className="text-[10px] dark:text-[#43D5CC] text-teal-600 mt-1 sm:mt-2">
          File dipilih: {logoFile.name}
        </p>
      )}
      <p className="text-[9px] sm:text-[10px] dark:text-[#F5EACA]/50 text-slate-400 mt-0.5 sm:mt-1">
        Format: JPG, PNG, WebP. Maks 2MB.
      </p>
    </div>
  );
}
