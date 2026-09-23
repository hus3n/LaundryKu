'use client';

import React from 'react';

interface ReviewImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ReviewImageLightbox({
  imageUrl,
  onClose,
}: ReviewImageLightboxProps) {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
    >
      <div className="relative max-w-3xl max-h-[85vh]">
        <img
          src={imageUrl}
          alt="Foto Ulasan Diperbesar"
          className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
        />
      </div>
    </div>
  );
}
