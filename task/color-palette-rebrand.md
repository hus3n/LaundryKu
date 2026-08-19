# 🎨 Task: Rebrand Palet Warna LaundryKu

## Deskripsi
Ubah seluruh penggunaan warna pada aplikasi LaundryKu mengikuti palet warna baru berbasis tema biru dalam (aurora/nordic), dengan **Orient** (`#015383`) sebagai warna latar belakang paling gelap, dipadukan dengan warna-warna pendukung cerah berikut:

---

## 🎨 Palet Warna Baru

| Nama             | Hex       | RGB            | Peran                              |
|------------------|-----------|----------------|------------------------------------|
| **Orient**       | `#015383` | 1, 83, 131     | Background utama (paling gelap)    |
| **Curious Blue** | `#1DA9D0` | 29, 169, 208   | Warna brand/primary CTA            |
| **Turquoise**    | `#43D5CC` | 67, 213, 204   | Warna aksen / highlight sukses     |
| **Tangerine**    | `#EA8803` | 234, 136, 3    | Warna aksen oranye / peringatan    |
| **Sidecar**      | `#F5EACA` | 245, 234, 202  | Warna teks utama / latar terang    |

### Turunan Warna Orient (Kedalaman Panel)
| Token             | Hex       | Peran                      |
|-------------------|-----------|----------------------------|
| Orient Gelap      | `#012040` | Sidebar, header             |
| Orient Sedang     | `#013D66` | Kartu / panel              |
| Orient Paling Gelap | `#010E1C` | Body background           |

---

## 📐 Mapping Warna Lama → Baru

| Peran                       | Lama (Tailwind)         | Baru                              |
|-----------------------------|-------------------------|-----------------------------------|
| Background body             | `bg-slate-950`          | `bg-[#010E1C]`                    |
| Sidebar / header            | `bg-slate-900`          | `bg-[#012040]`                    |
| Kartu / panel               | `bg-slate-800`          | `bg-[#013D66]`                    |
| Border                      | `border-slate-800`      | `border-[#1DA9D0]/15`             |
| Brand primary (CTA)         | `brand-500` / `#0c8de9` | `#1DA9D0` (Curious Blue)          |
| Brand hover                 | `brand-400`             | `#43D5CC` (Turquoise)             |
| Teks utama                  | `text-white`            | `text-[#F5EACA]`                  |
| Teks sekunder               | `text-slate-400`        | `text-[#1DA9D0]/70`               |
| Aksen sukses (non-semantik) | `text-emerald-400`      | `text-[#43D5CC]`                  |
| Aksen peringatan            | `text-amber-400`        | `text-[#EA8803]`                  |

---

## 📁 File yang Perlu Dimodifikasi

### FASE 1 - Token & Config (Lakukan PERTAMA)

#### [x] `frontend/tailwind.config.ts`
Ganti seluruh blok `colors` dengan palet baru:

```ts
colors: {
  brand: {
    50:  '#e8f9fd',
    100: '#c4f0f8',
    200: '#88e1f0',
    300: '#43D5CC',
    400: '#43D5CC',
    500: '#1DA9D0',  // Curious Blue — primary
    600: '#1590B2',
    700: '#0F7090',
    800: '#015383',  // Orient
    900: '#012E4A',
    950: '#011B2E',
  },
  orient: {
    DEFAULT: '#015383',
    medium:  '#013D66',
    dark:    '#012040',
    deeper:  '#011B2E',
    darkest: '#010E1C',
  },
  turquoise: {
    DEFAULT: '#43D5CC',
  },
  tangerine: {
    DEFAULT: '#EA8803',
  },
  sidecar: {
    DEFAULT: '#F5EACA',
    muted:   '#D4C8A2',
  },
}
```

#### [x] `frontend/src/app/globals.css`
```css
/* Body */
body {
  background: #010E1C;
  color: #F5EACA;
}

/* Glass card */
.glass-card {
  background: rgba(1, 83, 131, 0.35);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(67, 213, 204, 0.18);
  box-shadow: 0 8px 32px rgba(1, 14, 28, 0.4);
}

/* Glass card dark */
.glass-card-dark {
  background: rgba(1, 32, 64, 0.88);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(29, 169, 208, 0.2);
  box-shadow: 0 10px 40px rgba(1, 14, 28, 0.5);
}

/* Glass input */
.glass-input {
  background: rgba(1, 61, 102, 0.5);
  border: 1px solid rgba(29, 169, 208, 0.3);
  color: #F5EACA;
}

/* Scrollbar */
::-webkit-scrollbar-thumb { background: #1DA9D0; }
::-webkit-scrollbar-thumb:hover { background: #43D5CC; }
```

---

### FASE 2 - Layout & Shell

#### [x] `frontend/src/components/layouts/DashboardLayout.tsx`
- `min-h-screen bg-slate-950` → `min-h-screen bg-[#010E1C]`
- `bg-slate-900/80` → `bg-[#012040]/80` (sidebar)
- `border-r border-slate-800/80` → `border-r border-[#1DA9D0]/15`
- `bg-slate-950/80` → `bg-[#010E1C]/85` (mobile overlay)
- `bg-slate-900` → `bg-[#012040]` (mobile sidebar)
- `border-slate-800` → `border-[#1DA9D0]/15`
- `bg-slate-900/40` → `bg-[#012040]/40` (header)
- `bg-slate-800/60` → `bg-[#1DA9D0]/10` (hover nav item)
- `hover:bg-slate-800` → `hover:bg-[#1DA9D0]/10`
- `from-brand-500 to-brand-600` → `from-[#1DA9D0] to-[#43D5CC]` (active indicator)
- `text-slate-400` → `text-[#F5EACA]/60`
- `text-white` → `text-[#F5EACA]`
- `bg-slate-800 border-slate-700` → `bg-[#013D66] border-[#1DA9D0]/25` (avatar)
- `text-brand-400` → `text-[#43D5CC]`

---

### FASE 3 - Halaman Admin

#### [x] `admin/dashboard/page.tsx`
- Semua `bg-slate-9xx`, `bg-slate-8xx` → Orient derivatives
- `border-slate-8xx` → `border-[#1DA9D0]/15`
- Warna chart: ganti ke `fill="#1DA9D0"` dan `fill="#43D5CC"`
- `text-brand-xxx` → `text-[#1DA9D0]` atau `text-[#43D5CC]`

#### [x] `admin/laundry/page.tsx`
- Kartu tabel → Orient
- Tombol CTA → Curious Blue

#### [x] `admin/laundry/new/page.tsx`
- Form input background → Orient sedang
- Tombol submit → `bg-[#1DA9D0]` hover `bg-[#43D5CC]`

#### [x] `admin/whatsapp/page.tsx`
- QR container → `bg-[#011B2E] border-[#1DA9D0]/20`
- Tombol connect → Curious Blue

#### [x] `admin/packages/page.tsx`
#### [x] `admin/categories/page.tsx`
#### [x] `admin/customers/page.tsx`
#### [x] `admin/employees/page.tsx`
#### [x] `admin/outlets/page.tsx`
#### [x] `admin/expenses/page.tsx`
#### [x] `admin/reports/page.tsx`
#### [x] `admin/settings/page.tsx`
#### [x] `admin/activity-log/page.tsx`
- Semua: ganti slate → Orient, brand → Curious Blue/Turquoise

---

### FASE 4 - Halaman Auth

#### [x] `app/login/page.tsx`
- Background gradient: `from-[#010E1C] via-[#012040] to-[#015383]`
- Card: `bg-[#012040]` border `[#1DA9D0]/30`
- Tombol login: `bg-[#1DA9D0]` hover `bg-[#43D5CC]`
- Input focus glow: `shadow-[#1DA9D0]/30`

#### [x] `app/forgot-password/page.tsx`
- Sama seperti login page

---

### FASE 5 - Halaman SuperAdmin

#### [x] `superadmin/dashboard/page.tsx`
#### [x] `superadmin/admins/page.tsx`
#### [x] `superadmin/bot-settings/page.tsx`
#### [x] `superadmin/backup/page.tsx`
- Sama seperti admin pages

---

### FASE 6 - Komponen UI (Modals)

#### [x] `components/ui/ConfirmModal.tsx`
#### [x] `components/ui/OrderLogModal.tsx`
#### [x] `components/ui/ReceiptModal.tsx`
#### [x] `components/ui/ExtendSubscriptionModal.tsx`
#### [x] `components/ui/CreateTrialModal.tsx`
#### [x] `components/ui/AppWindowControls.tsx`
- Overlay: `bg-slate-950/80` → `bg-[#010E1C]/85`
- Panel: `bg-slate-900` → `bg-[#012040]`
- Border: `border-slate-800` → `border-[#1DA9D0]/25`

---

### FASE 7 - Verifikasi & Push

#### [x] Jalankan `npx tsc --noEmit` di frontend (0 errors)
#### [x] Review visual seluruh halaman di browser
#### [x] Jalankan `graphify update .`
#### [x] Commit dan push ke GitHub

---

## 🔧 Tabel Konversi Kelas Tailwind (Quick Reference)

| Lama                    | Baru                        |
|-------------------------|-----------------------------|
| `bg-slate-950`          | `bg-[#010E1C]`              |
| `bg-slate-900`          | `bg-[#012040]`              |
| `bg-slate-900/80`       | `bg-[#012040]/80`           |
| `bg-slate-900/40`       | `bg-[#012040]/40`           |
| `bg-slate-800`          | `bg-[#013D66]`              |
| `bg-slate-800/60`       | `bg-[#1DA9D0]/10`           |
| `bg-slate-700`          | `bg-[#1DA9D0]/20`           |
| `border-slate-800`      | `border-[#1DA9D0]/15`       |
| `border-slate-700`      | `border-[#1DA9D0]/25`       |
| `text-white`            | `text-[#F5EACA]`            |
| `text-slate-300`        | `text-[#F5EACA]/80`         |
| `text-slate-400`        | `text-[#F5EACA]/60`         |
| `text-slate-500`        | `text-[#1DA9D0]/50`         |
| `brand-500`             | `[#1DA9D0]`                 |
| `brand-400`             | `[#43D5CC]`                 |
| `shadow-brand-500/20`   | `shadow-[#1DA9D0]/20`       |
| `text-emerald-400`      | `text-[#43D5CC]`            |
| `bg-emerald-500/20`     | `bg-[#43D5CC]/15`           |
| `border-emerald-500/30` | `border-[#43D5CC]/30`       |
| `text-amber-400`        | `text-[#EA8803]`            |
| `bg-amber-500/10`       | `bg-[#EA8803]/10`           |
| `border-amber-500/30`   | `border-[#EA8803]/30`       |

---

## ⚠️ Catatan Penting

1. **Warna semantik TETAP dipertahankan:**
   - `rose` → error / hapus / bahaya
   - `emerald` → sukses badge status order (sudah dikenal user)
2. **Tangerine** (`#EA8803`) menggantikan `amber` untuk elemen warning non-semantik.
3. **Sidecar** (`#F5EACA`) menggantikan `text-white` agar tidak terlalu kontras di atas background biru gelap.
4. **Turquoise** (`#43D5CC`) menggantikan emerald pada elemen UI non-status (icon aktif, border sukses, dsb).
5. **Curious Blue** (`#1DA9D0`) adalah warna primary — tombol CTA, sidebar indicator aktif, link.
6. **Urutan WAJIB:** Fase 1 (tailwind.config + globals.css) HARUS selesai sebelum fase lainnya.
