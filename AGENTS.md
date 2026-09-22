# LaundryKu Agent Instructions & Operational Rules

Rules ini berlaku untuk setiap agent, subagent, atau sesi pengembangan pada repository LaundryKu.

## Core Directives

1. **Prinsip Modularitas Mutlak (Wajib):**
   - Ikuti aturan di `.agents/rules/modular-architecture.md`.
   - DILARANG membuat komponen atau halaman monolitik (hindari file > 200–250 baris).
   - Setiap fitur atau halaman baru di `frontend/src/app/[domain]/` wajib dipecah menjadi:
     - `page.tsx` (orchestrator ringkas)
     - `types.ts` (tipe & interface)
     - `[domain]Data.ts` (konfigurasi data / mock statis)
     - `components/` (sub-komponen terisolasi)
   - Backend wajib mematuhi pemisahan: `routes/` (validasi Zod) -> `controllers/` (HTTP) -> `services/` (business logic & database).

2. **Konsistensi UI & Desain:**
   - Gunakan palet warna resmi LaundryKu:
     - Orient Dark: `#010E1C`, `#012040`, `#013D66`
     - Curious Blue: `#1DA9D0`
     - Turquoise: `#43D5CC`
     - Tangerine: `#EA8803`
     - Sidecar: `#F5EACA`
   - Form otentikasi login & registrasi menggunakan kartu terpadu 1-card split screen (`UnifiedAuthCard.tsx` + `AuthBrandPane.tsx`).

3. **Verifikasi Kualitas:**
   - Jalankan `npm run build` pada `frontend` dan `backend` setelah setiap pembaruan arsitektur atau penambahan kode untuk memastikan tidak ada compile/type error.
