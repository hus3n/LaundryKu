'use client';

import React, { useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface ReviewImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  onError: (msg: string | null) => void;
}

export default function ReviewImageUploader({
  imagePreview,
  onImageSelect,
  onImageRemove,
  onError,
}: ReviewImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      onError('Format gambar harus JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Ukuran gambar maksimal 5MB.');
      return;
    }

    onError(null);
    onImageSelect(file);
  };

  const handleRemove = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
        Foto Ulasan / Toko / Profil (Opsional)
      </label>

      {imagePreview ? (
        <div className="relative inline-block mt-1">
          <img
            src={imagePreview}
            alt="Preview Foto Ulasan"
            className="w-24 h-24 object-cover rounded-xl border-2 dark:border-[#1DA9D0]/40 border-slate-300 shadow-md"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow transition-colors"
            title="Hapus gambar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed dark:border-[#1DA9D0]/30 border-slate-300 rounded-xl p-3 text-center hover:border-[#1DA9D0] dark:hover:border-[#43D5CC] transition-colors dark:bg-[#012040]/30 bg-slate-50"
        >
          <div className="flex items-center justify-center gap-2 text-xs dark:text-[#F5EACA]/70 text-slate-500">
            <ImageIcon className="w-4 h-4 text-[#1DA9D0]" />
            <span>Klik untuk upload foto (Maks. 5MB)</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
