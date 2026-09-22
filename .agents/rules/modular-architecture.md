---
trigger: always_on
description: Standard modular coding rules for frontend, backend, UI components, and state management in LaundryKu.
---

# Aturan Standar Pengembangan Kode Modular (LaundryKu)

Setiap penambahan, pembaruan, atau refactoring kode WAJIB mengikuti prinsip arsitektur modular yang telah ditetapkan di proyek ini. DILARANG membuat file monolitik berukuran besar (> 250–300 baris) dalam satu komponen/halaman.

---

## 1. Frontend: Struktur Halaman & Komponen (Atomic & Domain Slicing)

### Batasan Ukuran File
- **Maksimal baris kode:** Setiap file komponen atau halaman (`page.tsx`) diusahakan **< 200 baris**, toleransi maksimal 250 baris. Jika mendekati 250 baris, lakukan pemecahan (*slice*) menjadi sub-komponen.

### Struktur Modular Halaman (`app/[domain]/`)
Ketika membuat halaman atau fitur baru di bawah `frontend/src/app/[domain]/`, gunakan struktur modular berikut:
```text
app/[domain]/
├── page.tsx                    # Controller/Orchestrator utama (hanya state & perakitan komponen)
├── types.ts                    # Definisi Interface & Tipe Data spesifik domain
├── [domain]Data.ts             # Data statis, konfigurasi, menu list, dan mock data
├── components/                 # Sub-komponen modular terisolasi
│   ├── [Domain]Header.tsx      # Header & ringkasan navigasi
│   ├── [Domain]Metrics.tsx     # Statistik / KPI Cards
│   ├── [Domain]Table.tsx       # Tabel data & render baris
│   └── [Domain]Modal.tsx       # Dialog / Popup aksi
└── hooks/                      # Custom hooks spesifik domain (jika ada)
    └── use[Domain]State.ts
```

### Pemisahan Tanggung Jawab Komponen
1. **`page.tsx`:** Hanya bertindak sebagai *Orchestrator*. Tidak boleh memuat markup form panjang, tabel besar, SVG inline, atau daftar array statis berulang.
2. **Sub-komponen (`components/`):** Berfokus pada satu tanggung jawab (*Single Responsibility*), menerima data via `props` yang terdefinisi dengan jelas di `types.ts`.
3. **Data Statis & Konfigurasi:** Wajib dipisahkan ke `[domain]Data.ts` (contoh: array menu cepat, list opsi dropdown, navigasi tabs).

---

## 2. Formulir & Autentikasi Terpadu (Unified Auth Architecture)

1. **Prinsip 1 Card Split Screen:**
   - Panel autentikasi menggunakan kartu terpadu (`UnifiedAuthCard.tsx`) berukuran optimal (`max-w-5xl` pada layar lebar).
   - **Sisi Kiri:** Visual branding & ringkasan fitur unggulan (`AuthBrandPane.tsx`).
   - **Sisi Kanan:** Form interaktif (`LoginFormView.tsx` dan `RegisterFormView.tsx`) dengan toggle tab mulus.
2. **Pemisahan Tampilan Form:**
   - Sub-komponen input form dipisahkan per domain logika (misal `PlanSelector.tsx`, `RegisterFormFields.tsx`).
   - Jangan menyatukan state form pendaftaran multi-langkah ke dalam satu file besar.

---

## 3. Komponen UI Global (`components/ui/`)

1. Komponen antarmuka yang dapat digunakan kembali (*reusable UI*) wajib disimpan di `frontend/src/components/ui/`.
2. Selalu gunakan token tema CSS yang konsisten:
   - Primary: `#1DA9D0` (Curious Blue)
   - Secondary: `#43D5CC` (Turquoise)
   - Background Dark: `#010E1C` (Orient Dark) / `#012040` (Orient Medium)
   - Accent Warm: `#EA8803` (Tangerine) & `#F5EACA` (Sidecar)
3. Komponen input form wajib mendukung state `disabled`, `error`, dan mode `dark` / `light`.

---

## 4. Backend: Arsitektur Berlapis (Layered Architecture)

Untuk setiap penambahan modul atau API endpoint pada `backend/src/`:
```text
backend/src/
├── routes/[feature].routes.ts       # Definisi endpoint & middleware validasi (Zod Schema)
├── controllers/[feature].controller.ts # Menangani HTTP request/response & status code
├── services/[feature].service.ts    # Logika bisnis inti & query database (Prisma)
└── types/                           # Definisi tipe DTO & Prisma helpers
```

### Standar Backend:
1. **Validasi Input Zod:**
   - Selalu bersihkan input teks sensitif (misalnya email dengan `.trim().toLowerCase()`).
   - Validasi skema diletakkan di `*.routes.ts` atau modul skema terpisah, bukan di dalam controller.
2. **Tidak Menulis Query Prisma di Controller:**
   - Seluruh akses database Prisma atau Mongoose wajib dienkapsulasi di dalam `*.service.ts`.
3. **Error Handling:**
   - Gunakan try-catch terstruktur atau delegasikan ke error handler middleware.

---

## 5. Checklist Sebelum Melakukan Perubahan / Menyerahkan Kode

- [ ] Apakah ada file baru atau hasil edit yang melebihi 250 baris? (Jika ya, pecah ke sub-komponen/helpers).
- [ ] Apakah data array statis sudah diletakkan di file terpisah (`*Data.ts`)?
- [ ] Apakah tipe data didefinisikan secara eksplisit di `types.ts` / interface TypeScript (tanpa `any` berlebihan)?
- [ ] Apakah `npm run build` (frontend) dan `npm run build` (backend) berhasil tanpa error tipe/kompilasi?
- [ ] Apakah perubahan tidak mematahkan fungsionalitas komponen tetangga?
