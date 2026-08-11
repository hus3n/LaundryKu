# LaundryKu — High-Priority Task: Auto-Save Draft Form Pencatatan Cucian

> **Dibuat oleh**: Senior Engineer  
> **Tanggal**: 2026-08-11  
> **Stack**: Next.js 14 (App Router, TypeScript, React Hooks)  
> **Aturan Utama**: JANGAN membuat asumsi. Ikuti setiap langkah secara berurutan. JANGAN melewati satu langkah pun. Jika ada kode yang harus ditulis secara verbatim (kata per kata), salin persis seperti tertera.

---

## Latar Belakang & Tujuan

Halaman **Pencatatan Cucian Baru** (`frontend/src/app/admin/laundry/new/page.tsx`) adalah form berisi banyak field yang sering diisi oleh karyawan di perangkat mobile. Jika browser tiba-tiba ditutup, crash, atau pengguna tidak sengaja berpindah halaman, seluruh data yang sudah diketik akan **hilang**.

Fitur ini menambahkan mekanisme **auto-save draft ke `localStorage`** dengan:
1. Penyimpanan otomatis saat pengguna mengetik (debounce 600ms)
2. Penyimpanan paksa saat browser/tab diminimalkan atau ditutup (`visibilitychange` + `pagehide`)
3. Pemulihan draft otomatis saat halaman dibuka kembali, dengan banner notifikasi
4. Penghapusan draft otomatis setelah form berhasil dikirim
5. Indikator status draft yang terlihat di UI (Tersimpan / Menyimpan... / Ada Draft)

---

## Struktur File yang Akan Dibuat / Dimodifikasi

| Aksi | File |
|------|------|
| **BUAT BARU** | `frontend/src/hooks/useFormDraft.ts` |
| **MODIFIKASI** | `frontend/src/app/admin/laundry/new/page.tsx` |

---

## TASK 1 — Buat Custom Hook `useFormDraft`

### File: `frontend/src/hooks/useFormDraft.ts`

Folder `frontend/src/hooks/` **belum ada**. Buat folder ini terlebih dahulu, lalu buat file `useFormDraft.ts` di dalamnya.

Buat file baru dengan konten **persis** sebagai berikut:

```typescript
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
```

**Verifikasi**: Pastikan file dibuat di path `frontend/src/hooks/useFormDraft.ts` dan tidak ada error TypeScript saat menyimpan file.

---

## TASK 2 — Modifikasi Halaman Form Pencatatan Cucian

### File: `frontend/src/app/admin/laundry/new/page.tsx`

File ini saat ini memiliki **435 baris**. Berikut adalah semua perubahan yang perlu dilakukan, dijelaskan secara berurutan dari atas ke bawah file.

---

### 2.1 — Perbarui Baris Import (Baris 1–8)

**Temukan** blok import berikut di paling atas file:
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Shirt, Plus, Trash2, CheckCircle2, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import QuantityInput from '@/components/ui/QuantityInput';
```

**Ganti seluruh blok itu** dengan:
```tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Shirt, Plus, Trash2, CheckCircle2, User, AlertCircle, Save, RotateCcw, X } from 'lucide-react';
import QuantityInput from '@/components/ui/QuantityInput';
import { useFormDraft, DraftStatus } from '@/hooks/useFormDraft';
```

**Perhatian**: `Phone` dan `MapPin` dihapus dari import lucide karena tidak digunakan di komponen ini. `Save`, `RotateCcw`, dan `X` ditambahkan untuk UI indikator draft.

---

### 2.2 — Definisikan Interface `DraftData` dan `DRAFT_KEY`

**Temukan** baris berikut (sekitar baris 10):
```tsx
interface PackageItem {
```

**Tambahkan** blok kode berikut **tepat DI ATAS** `interface PackageItem` (jangan hapus PackageItem):

```tsx
/** Kunci unik localStorage untuk draft form ini */
const DRAFT_KEY = 'laundryku_new_order_draft_v1';

/**
 * Shape data yang disimpan sebagai draft.
 * Harus mencakup SEMUA state form yang ingin dipulihkan.
 */
interface DraftData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  fragrance: string;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod: 'CASH' | 'QRIS';
  selectedOutletId: string;
  items: Array<{ packageId: string; categoryId: string; quantity: number }>;
}

```

---

### 2.3 — Tambahkan State Baru untuk Draft di Dalam Komponen

**Temukan** blok deklarasi state di dalam komponen (sekitar baris 25–44). State saat ini terakhir diakhiri dengan:
```tsx
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
```

**Tambahkan** tiga state baru **tepat setelah** baris `const [error, ...]` tersebut:

```tsx
  // ─── State untuk fitur Auto-Save Draft ────────────────────────────────────
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');
  const [draftRestored, setDraftRestored] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
```

---

### 2.4 — Buat Objek `currentDraftValue` dan Callback `handleRestore`

**Temukan** fungsi `handleQuantityChange` di dalam komponen (sekitar baris 99–103):
```tsx
  const handleQuantityChange = (index: number, newValue: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, Math.floor(newValue));
    setItems(newItems);
  };
```

**Tambahkan** blok kode berikut **tepat setelah** fungsi `handleQuantityChange`, **sebelum** komentar `// Calculate total price live`:

```tsx
  // ─── Objek yang merangkum SELURUH state form untuk disimpan sebagai draft ─
  // Dibuat dengan useMemo agar referensinya stabil dan tidak memicu render berlebih.
  // Catatan: Kita tidak menggunakan useMemo di sini karena kita perlu nilai terbaru
  // di setiap render. Object literal biasa sudah cukup karena useFormDraft
  // menggunakan ref untuk membandingkan nilai.
  const currentDraftValue: DraftData = {
    customerName,
    customerPhone,
    customerAddress,
    notes,
    fragrance,
    paymentStatus,
    paymentMethod,
    selectedOutletId,
    items,
  };

  // ─── Callback: dipanggil oleh hook saat draft ditemukan di localStorage ───
  // Fungsi ini harus me-restore SELURUH state sekaligus dari satu objek.
  const handleRestore = useCallback((saved: DraftData) => {
    setCustomerName(saved.customerName ?? '');
    setCustomerPhone(saved.customerPhone ?? '');
    setCustomerAddress(saved.customerAddress ?? '');
    setNotes(saved.notes ?? '');
    setFragrance(saved.fragrance ?? '');
    setPaymentStatus(saved.paymentStatus ?? 'UNPAID');
    setPaymentMethod(saved.paymentMethod ?? 'CASH');
    setSelectedOutletId(saved.selectedOutletId ?? '');
    // Items: hanya restore jika array tidak kosong untuk menghindari item kosong
    if (saved.items && saved.items.length > 0) {
      setItems(saved.items);
    }
    setDraftRestored(true);
    setShowRestoreBanner(true);
  }, []);

```

---

### 2.5 — Panggil Hook `useFormDraft`

**Temukan** fungsi `handleSubmit` di dalam komponen (sekitar baris 112):
```tsx
  const handleSubmit = async (e: React.FormEvent) => {
```

**Tambahkan** pemanggilan hook **tepat SEBELUM** `handleSubmit`:

```tsx
  // ─── Inisialisasi Auto-Save Draft ─────────────────────────────────────────
  const { clearDraft } = useFormDraft<DraftData>({
    storageKey: DRAFT_KEY,
    currentValue: currentDraftValue,
    onRestore: handleRestore,
    onStatusChange: setDraftStatus,
    debounceMs: 600,
  });

```

---

### 2.6 — Panggil `clearDraft()` di dalam `handleSubmit` Setelah Submit Berhasil

**Temukan** baris `router.push('/admin/laundry');` di dalam fungsi `handleSubmit`:
```tsx
      router.push('/admin/laundry');
```

**Ganti baris itu** dengan dua baris berikut:
```tsx
      clearDraft(); // Hapus draft setelah berhasil submit
      router.push('/admin/laundry');
```

---

### 2.7 — Tambahkan Komponen UI di JSX

Sekarang kita tambahkan dua elemen UI: **banner restore** dan **indikator status draft** di header halaman.

#### 2.7.1 — Perbarui Header Halaman (Tambah Indikator Status Draft)

**Temukan** blok JSX header halaman berikut (sekitar baris 142–146):
```tsx
        <div>
          <h1 className="text-2xl font-bold text-white">Pencatatan Cucian Baru</h1>
          <p className="text-xs text-slate-400 mt-1">Input transaksi cucian masuk dan pilih paket layanan</p>
        </div>
```

**Ganti seluruh blok itu** dengan:
```tsx
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Pencatatan Cucian Baru</h1>
            <p className="text-xs text-slate-400 mt-1">Input transaksi cucian masuk dan pilih paket layanan</p>
          </div>

          {/* Indikator Status Draft */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {draftStatus === 'saving' && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Menyimpan draft...
              </span>
            )}
            {draftStatus === 'saved' && !showRestoreBanner && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-full">
                <Save className="w-3 h-3 text-emerald-400" />
                Draft tersimpan
              </span>
            )}
            {draftRestored && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-brand-300 bg-brand-500/10 border border-brand-500/30 px-2.5 py-1.5 rounded-full">
                <RotateCcw className="w-3 h-3" />
                Draft dipulihkan
              </span>
            )}
          </div>
        </div>
```

#### 2.7.2 — Tambahkan Banner Notifikasi Restore Draft

**Temukan** blok error alert berikut (sekitar baris 148–153):
```tsx
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}
```

**Tambahkan** blok banner berikut **tepat DI ATAS** blok error (jangan hapus blok error):

```tsx
        {/* Banner: Draft Dipulihkan dari localStorage */}
        {showRestoreBanner && (
          <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-300">Draft formulir ditemukan & dipulihkan</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Data Anda yang belum tersimpan sebelumnya telah dimuat kembali secara otomatis.
                  Periksa kembali data di bawah sebelum menyimpan transaksi.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowRestoreBanner(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

```

---

## TASK 3 — Verifikasi Akhir (Checklist)

Setelah semua perubahan dilakukan, lakukan verifikasi berikut **sebelum menganggap task selesai**:

### 3.1 — Verifikasi TypeScript Build

Jalankan perintah berikut dari folder `frontend/`:
```bash
npx tsc --noEmit
```
**Hasil yang diharapkan**: Tidak ada error TypeScript. Jika ada error, perbaiki sebelum melanjutkan.

### 3.2 — Verifikasi Manual di Browser

1. Buka halaman `/admin/laundry/new` di browser
2. Isi beberapa field (nama pelanggan, nomor WA)
3. Tunggu **0.6 detik** setelah berhenti mengetik → indikator "Draft tersimpan" harus muncul di header kanan atas
4. Tutup tab atau tekan Ctrl+W (atau pada HP: minimize browser)
5. Buka kembali halaman `/admin/laundry/new`
6. **Banner biru "Draft formulir ditemukan & dipulihkan"** harus muncul di atas form
7. Semua field yang tadi diisi harus terisi kembali secara otomatis
8. Isi form hingga lengkap dan klik "Simpan Transaksi"
9. Setelah berhasil disimpan dan diarahkan ke `/admin/laundry`, kembali ke `/admin/laundry/new`
10. **Banner TIDAK BOLEH muncul lagi** — karena draft sudah dihapus setelah submit berhasil

### 3.3 — Verifikasi localStorage di Browser DevTools

1. Buka DevTools (F12) → Tab **Application** → **Local Storage** → pilih domain `localhost`
2. Saat mengisi form, pastikan key `laundryku_new_order_draft_v1` muncul berisi JSON
3. Setelah submit berhasil, pastikan key tersebut **hilang** dari localStorage

---

## Catatan Penting untuk AI Pelaksana

- **JANGAN** menambahkan `currentDraftValue` sebagai dependency di `useEffect` manapun kecuali di dalam hook `useFormDraft` sendiri — hal ini akan menyebabkan infinite render loop.
- **JANGAN** memanggil `handleRestore` lebih dari sekali — hook sudah menjaga ini dengan flag internal `isRestoredRef`.
- Field `items` di draft menyimpan `packageId` dan `categoryId` berupa **string UUID**. Saat restore, ID ini mungkin tidak lagi valid jika data paket/kategori berubah di server. Ini adalah perilaku yang **diterima** — sistem akan tetap menampilkan item dengan ID tersebut, dan user tinggal memperbaikinya.
- Konstanta `DRAFT_KEY` menggunakan suffix `_v1` agar jika struktur `DraftData` berubah di masa depan, bisa dinaikkan ke `_v2` dan draft lama tidak akan di-restore secara salah.
