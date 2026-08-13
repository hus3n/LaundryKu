# TASK-08 — Desain Logo Aplikasi LaundryKu

**Status:** ✅ Selesai  
**Prioritas:** 🟢 Rendah  
**Estimasi:** 1–2 jam  

---

## 🎯 Tujuan

Membuat logo aplikasi LaundryKu dalam beberapa opsi varian. Logo harus:
1. Mencerminkan visi dan misi aplikasi: **digitalisasi & modernisasi manajemen laundry**
2. Terlihat profesional, bersih, dan mudah dikenali
3. Tersedia dalam format SVG (scalable) agar bisa dipakai di berbagai ukuran
4. Disajikan dalam **minimal 3 opsi** agar pemilik bisa memilih

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Visi & Misi LaundryKu
- **Visi:** Menjadi platform manajemen laundry digital terdepan di Indonesia
- **Misi:** Memudahkan pemilik laundry dalam mencatat, mengelola, dan mengembangkan bisnis laundry mereka
- **Target pengguna:** Pemilik laundry kecil-menengah di Indonesia

### Elemen Visual yang Relevan
- Pakaian, mesin cuci, gelembung sabun, air, kebersihan
- Warna yang cocok: biru (kepercayaan, kebersihan), putih (bersih), hijau (segar)
- Gaya: modern, minimalis, profesional — bukan kartun

### Lokasi Penyimpanan File Logo
Simpan file logo di: `frontend/public/logo/`

---

## 🔧 FASE 1 — Buat 3 Opsi Logo dalam SVG

Buat file SVG untuk masing-masing opsi logo. Setiap SVG harus:
- Ukuran viewBox: `0 0 200 60` (landscape, cocok untuk header app)
- Versi ikon bulat: `0 0 60 60` (untuk favicon/app icon)
- Menggunakan font yang di-embed atau font system sans-serif

---

### Opsi A — Logo Teks Modern dengan Ikon Mesin Cuci

**File:** `frontend/public/logo/logo-option-a.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60">
  <defs>
    <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Ikon: Mesin Cuci Stilasi -->
  <rect x="4" y="8" width="44" height="44" rx="8" fill="url(#grad-a)" />
  <!-- Pintu mesin cuci (lingkaran) -->
  <circle cx="26" cy="30" r="14" fill="none" stroke="white" stroke-width="2.5" />
  <circle cx="26" cy="30" r="9" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
  <!-- Tombol-tombol kecil di atas -->
  <circle cx="14" cy="15" r="2.5" fill="white" />
  <circle cx="21" cy="15" r="2.5" fill="rgba(255,255,255,0.5)" />
  <!-- Gelembung kecil di dalam pintu -->
  <circle cx="22" cy="27" r="3" fill="rgba(255,255,255,0.3)" />
  <circle cx="30" cy="33" r="2" fill="rgba(255,255,255,0.25)" />

  <!-- Teks: LaundryKu -->
  <text x="58" y="28" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1e3a5f">
    Laundry
  </text>
  <text x="58" y="50" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="url(#grad-a)">
    Ku
  </text>
  <!-- Tagline -->
  <text x="60" y="58" font-family="Arial, sans-serif" font-size="8" fill="#94a3b8" letter-spacing="1">
    LAUNDRY DIGITAL
  </text>
</svg>
```

---

### Opsi B — Logo Monogram Lingkaran Bersih

**File:** `frontend/public/logo/logo-option-b.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60">
  <defs>
    <linearGradient id="grad-b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f766e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background lingkaran -->
  <circle cx="30" cy="30" r="26" fill="url(#grad-b)" />

  <!-- Gelombang air stilasi (3 gelombang) -->
  <path d="M 12 32 Q 17 26, 22 32 Q 27 38, 32 32 Q 37 26, 42 32 Q 47 38, 48 34"
        fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" />
  <path d="M 14 38 Q 19 32, 24 38 Q 29 44, 34 38 Q 39 32, 44 38"
        fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" />

  <!-- Huruf L stilasi di atas gelombang -->
  <text x="19" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="900"
        fill="white" text-anchor="middle">L</text>
  <text x="41" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="900"
        fill="white" text-anchor="middle">K</text>

  <!-- Teks nama -->
  <text x="68" y="26" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#134e4a">
    LaundryKu
  </text>
  <!-- Garis bawah dekoratif -->
  <rect x="68" y="32" width="120" height="2" rx="1" fill="url(#grad-b)" />
  <!-- Tagline -->
  <text x="68" y="48" font-family="Arial, sans-serif" font-size="10" fill="#64748b">
    Manajemen Laundry Digital
  </text>
</svg>
```

---

### Opsi C — Logo Minimalisme Tipografi + Simbol Air

**File:** `frontend/public/logo/logo-option-c.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60">
  <defs>
    <linearGradient id="grad-c" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4f46e5;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Simbol tetesan air + pakaian -->
  <!-- Tetesan besar -->
  <path d="M 26 8 C 26 8, 10 24, 10 34 C 10 43, 17.2 50, 26 50 C 34.8 50, 42 43, 42 34 C 42 24, 26 8, 26 8 Z"
        fill="url(#grad-c)" />
  <!-- Kilap di dalam tetesan (efek 3D) -->
  <ellipse cx="20" cy="28" rx="4" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-20, 20, 28)" />
  <!-- Ikon baju mini di dalam tetesan -->
  <path d="M 19 32 L 22 29 L 26 31 L 30 29 L 33 32 L 31 32 L 31 40 L 21 40 L 21 32 Z"
        fill="white" opacity="0.85" />

  <!-- Teks Laundry -->
  <text x="52" y="30" font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="21" font-weight="800" fill="#1e1b4b" letter-spacing="-0.5">
    LAUNDRY
  </text>
  <!-- Ku dengan aksen warna -->
  <text x="52" y="52" font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="21" font-weight="800" fill="url(#grad-c)" letter-spacing="2">
    KU
  </text>
  <!-- Garis vertikal pembatas -->
  <rect x="156" y="16" width="2" height="32" rx="1" fill="#e2e8f0" />
  <!-- Tagline di samping kanan -->
  <text x="165" y="29" font-family="Arial, sans-serif" font-size="8" fill="#94a3b8" letter-spacing="1">
    SMART
  </text>
  <text x="165" y="41" font-family="Arial, sans-serif" font-size="8" fill="#94a3b8" letter-spacing="1">
    LAUNDRY
  </text>
  <text x="165" y="53" font-family="Arial, sans-serif" font-size="8" fill="#94a3b8" letter-spacing="1">
    MANAGER
  </text>
</svg>
```

---

## 🔧 FASE 2 — Buat Versi Favicon/App Icon (Square)

Untuk setiap opsi, buat versi ikon persegi (hanya bagian ikon, tanpa teks) dengan ukuran `60x60`:

**File:** `frontend/public/logo/icon-option-a.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <defs>
    <linearGradient id="gi-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb" />
      <stop offset="100%" style="stop-color:#0ea5e9" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="56" height="56" rx="12" fill="url(#gi-a)" />
  <circle cx="30" cy="32" r="16" fill="none" stroke="white" stroke-width="3" />
  <circle cx="30" cy="32" r="10" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
  <circle cx="12" cy="14" r="3.5" fill="white" />
  <circle cx="21" cy="14" r="3.5" fill="rgba(255,255,255,0.5)" />
  <circle cx="25" cy="28" r="3.5" fill="rgba(255,255,255,0.3)" />
  <circle cx="35" cy="36" r="2.5" fill="rgba(255,255,255,0.25)" />
</svg>
```

**File:** `frontend/public/logo/icon-option-b.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <defs>
    <linearGradient id="gi-b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f766e" />
      <stop offset="100%" style="stop-color:#06b6d4" />
    </linearGradient>
  </defs>
  <circle cx="30" cy="30" r="28" fill="url(#gi-b)" />
  <path d="M 10 33 Q 16 25, 22 33 Q 28 41, 34 33 Q 40 25, 50 33"
        fill="none" stroke="white" stroke-width="3" stroke-linecap="round" />
  <path d="M 12 41 Q 18 33, 24 41 Q 30 49, 36 41 Q 42 33, 48 41"
        fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" />
  <text x="30" y="28" font-family="Arial, sans-serif" font-size="16" font-weight="900"
        fill="white" text-anchor="middle">LK</text>
</svg>
```

**File:** `frontend/public/logo/icon-option-c.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <defs>
    <linearGradient id="gi-c" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1" />
      <stop offset="100%" style="stop-color:#4f46e5" />
    </linearGradient>
  </defs>
  <path d="M 30 4 C 30 4, 8 22, 8 36 C 8 49, 18 56, 30 56 C 42 56, 52 49, 52 36 C 52 22, 30 4, 30 4 Z"
        fill="url(#gi-c)" />
  <ellipse cx="21" cy="28" rx="5" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-20, 21, 28)" />
  <path d="M 20 34 L 24 29 L 30 32 L 36 29 L 40 34 L 37 34 L 37 46 L 23 46 L 23 34 Z"
        fill="white" opacity="0.9" />
</svg>
```

---

## 🔧 FASE 3 — Halaman Preview Logo

**File baru yang dibuat:** `frontend/src/app/superadmin/logo-preview/page.tsx`

Buat halaman preview sederhana agar logo bisa dilihat dan dipilih secara visual:

```tsx
'use client';

export default function LogoPreviewPage() {
  const options = [
    {
      id: 'A',
      name: 'Opsi A — Mesin Cuci Modern',
      description: 'Ikon mesin cuci stylized dengan gradasi biru. Cocok untuk kesan teknologi & kepercayaan.',
      logoSrc: '/logo/logo-option-a.svg',
      iconSrc: '/logo/icon-option-a.svg',
      palette: ['#2563eb', '#0ea5e9'],
    },
    {
      id: 'B',
      name: 'Opsi B — Gelombang Air Segar',
      description: 'Ikon lingkaran dengan gelombang air. Cocok untuk kesan segar, bersih, dan alami.',
      logoSrc: '/logo/logo-option-b.svg',
      iconSrc: '/logo/icon-option-b.svg',
      palette: ['#0f766e', '#06b6d4'],
    },
    {
      id: 'C',
      name: 'Opsi C — Tetesan Minimalis',
      description: 'Simbol tetesan air dengan ikon baju di dalamnya. Cocok untuk kesan premium dan elegan.',
      logoSrc: '/logo/logo-option-c.svg',
      iconSrc: '/logo/icon-option-c.svg',
      palette: ['#6366f1', '#4f46e5'],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
          Pilihan Logo LaundryKu
        </h1>
        <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>
          Berikut adalah 3 opsi logo yang tersedia. Pilih logo yang paling mencerminkan identitas aplikasi Anda.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {options.map((opt) => (
            <div
              key={opt.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                {/* Ikon Besar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img src={opt.iconSrc} alt={`Icon ${opt.id}`} style={{ width: '80px', height: '80px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>App Icon</span>
                </div>

                {/* Logo Landscape */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={opt.logoSrc} alt={`Logo ${opt.id}`} style={{ height: '50px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Logo Penuh</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>
                    {opt.name}
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                    {opt.description}
                  </p>
                  {/* Palet Warna */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Warna:</span>
                    {opt.palette.map((color) => (
                      <div
                        key={color}
                        title={color}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: color,
                          border: '2px solid #f1f5f9',
                        }}
                      />
                    ))}
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{opt.palette.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Preview di Background Gelap */}
              <div style={{
                marginTop: '24px',
                background: '#0f172a',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
              }}>
                <span style={{ color: '#475569', fontSize: '12px' }}>Dark bg:</span>
                <img src={opt.iconSrc} alt="" style={{ width: '40px', height: '40px' }} />
                <img src={opt.logoSrc} alt="" style={{ height: '36px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#eff6ff',
          borderRadius: '12px',
          border: '1px solid #bfdbfe',
        }}>
          <p style={{ color: '#1e40af', fontSize: '14px', fontWeight: '600' }}>
            📌 Cara Memilih Logo
          </p>
          <p style={{ color: '#3b82f6', fontSize: '13px', marginTop: '8px' }}>
            Setelah memilih opsi, hubungi developer untuk mengintegrasikan logo ke seluruh aplikasi
            (favicon, header, loading screen, nota cetak).
            File SVG tersedia di: <code>frontend/public/logo/</code>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 FASE 4 — Daftarkan Favicon Sementara

**File yang diubah:** `frontend/src/app/layout.tsx`

Tambahkan metadata favicon sementara menggunakan salah satu icon SVG (gunakan Opsi A sebagai default):

```tsx
export const metadata = {
  // ... metadata yang sudah ada ...
  icons: {
    icon: '/logo/icon-option-a.svg',
  },
};
```

**Catatan:** Ganti `/logo/icon-option-a.svg` setelah pemilik memilih opsi logo.

---

## ✅ Checklist Verifikasi

- [x] Folder `frontend/public/logo/` terbuat dan berisi 6 file SVG (3 logo + 3 icon)
- [x] Halaman `/superadmin/logo-preview` dapat diakses dan menampilkan 3 opsi logo
- [x] Setiap opsi menampilkan versi logo penuh DAN versi ikon (square)
- [x] Setiap opsi menampilkan preview di background gelap
- [x] File SVG tidak memiliki dependency eksternal (tidak memerlukan font CDN)
- [x] Logo terlihat jelas dan proporsional di ukuran kecil (ikon 80px) dan besar
- [x] Favicon browser ter-update menggunakan icon SVG yang dipilih
- [x] Tidak ada error console di halaman preview

---

## 🚫 Larangan

- JANGAN menggunakan gambar PNG/JPG — gunakan SVG murni
- JANGAN menggunakan font CDN (Google Fonts, dll) di dalam SVG — gunakan system font: `Arial, sans-serif`
- JANGAN mengubah file layout utama secara besar-besaran hanya untuk favicon
- JANGAN memilih logo secara sepihak — tampilkan semua opsi dan biarkan pemilik yang memilih
