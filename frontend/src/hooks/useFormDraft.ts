'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Status draft yang akan ditampilkan di UI.
 * - 'idle'   : Tidak ada perubahan sejak terakhir disimpan atau halaman baru dibuka
 * - 'saving' : Debounce timer sedang berjalan, belum disimpan ke localStorage
 * - 'saved'  : Data berhasil disimpan ke localStorage
 */
export type DraftStatus = 'idle' | 'saving' | 'saved';

interface UseFormDraftOptions<T> {
  /** Key unik untuk localStorage. Contoh: 'laundry_new_order_draft' */
  storageKey: string;
  /** Nilai form saat ini yang ingin disimpan (objek lengkap dari semua state) */
  currentValue: T;
  /** Callback untuk update semua state sekaligus saat draft ditemukan */
  onRestore: (savedValue: T) => void;
  /** Callback untuk mengubah status draft di komponen pemanggil */
  onStatusChange: (status: DraftStatus) => void;
  /** Waktu debounce dalam milidetik sebelum menyimpan. Default: 600 */
  debounceMs?: number;
}

/**
 * Hook untuk auto-save form ke localStorage dengan debounce dan
 * perlindungan lifecycle browser mobile (visibilitychange + pagehide).
 *
 * Cara pakai:
 * 1. Panggil hook ini di dalam komponen form
 * 2. Berikan `currentValue` berisi seluruh state form sebagai satu objek
 * 3. Gunakan `clearDraft()` yang dikembalikan untuk menghapus draft setelah submit berhasil
 */
export function useFormDraft<T>({
  storageKey,
  currentValue,
  onRestore,
  onStatusChange,
  debounceMs = 600,
}: UseFormDraftOptions<T>) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref untuk menyimpan nilai terbaru agar dapat diakses dari event listener
  // tanpa perlu re-register listener setiap render
  const currentValueRef = useRef<T>(currentValue);
  // Flag untuk mencegah auto-save menimpa data sebelum restore selesai
  const isRestoredRef = useRef(false);

  // Selalu perbarui ref dengan nilai terbaru
  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  // ─── STEP 1: Muat draft saat komponen pertama kali di-mount ──────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        onRestore(parsed);
        onStatusChange('saved');
      }
    } catch (err) {
      // Jika JSON rusak, hapus saja
      console.warn('[useFormDraft] Draft tidak dapat dibaca, menghapus...', err);
      localStorage.removeItem(storageKey);
    }
    isRestoredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya dijalankan sekali saat mount. Dependency sengaja dikosongkan.

  // ─── Fungsi internal: simpan ke localStorage tanpa debounce ──────────────
  const saveNow = useCallback(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentValueRef.current));
      onStatusChange('saved');
    } catch (err) {
      console.error('[useFormDraft] Gagal menyimpan draft:', err);
    }
  }, [storageKey, onStatusChange]);

  // ─── STEP 2: Debounced auto-save saat nilai form berubah ─────────────────
  useEffect(() => {
    // Jangan simpan sebelum restore selesai di-apply
    if (!isRestoredRef.current) return;

    onStatusChange('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveNow();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentValue, debounceMs, saveNow, onStatusChange]);

  // ─── STEP 3: Jaring pengaman mobile — simpan saat tab/browser disembunyikan
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Batalkan timer debounce yang mungkin masih berjalan
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        saveNow();
      }
    };

    const handlePageHide = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      saveNow();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [saveNow]);

  // ─── STEP 4: Fungsi untuk menghapus draft (panggil setelah submit sukses)
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      onStatusChange('idle');
    } catch (err) {
      console.error('[useFormDraft] Gagal menghapus draft:', err);
    }
  }, [storageKey, onStatusChange]);

  return { clearDraft };
}
