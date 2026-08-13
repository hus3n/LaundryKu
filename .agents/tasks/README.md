# 📋 LaundryKu — Daftar Task Pengembangan Fitur Baru

Setiap file task di bawah ini adalah satu unit pekerjaan yang harus diselesaikan **secara berurutan dan tuntas** sebelum pindah ke task berikutnya.

> ⚠️ **ATURAN WAJIB SEBELUM MENGERJAKAN TASK APA PUN:**
> 1. Baca file task secara **keseluruhan** sebelum menulis satu baris kode pun.
> 2. Jangan melakukan estimasi atau asumsi. Ikuti spesifikasi secara persis.
> 3. Ikuti urutan FASE dalam setiap file task dengan ketat.
> 4. Setiap fase harus selesai dan diverifikasi sebelum melanjutkan ke fase berikutnya.
> 5. Jangan memodifikasi file yang tidak disebutkan dalam task.

---

## 🗂️ Urutan Task

| No | File Task | Fitur | Prioritas |
|----|-----------|-------|-----------|
| 1 | [TASK-01-jumlah-baju.md](./TASK-01-jumlah-baju.md) | Kolom Jumlah Baju di Order | 🔴 Tinggi |
| 2 | [TASK-02-upload-logo.md](./TASK-02-upload-logo.md) | Upload Logo Toko Admin | 🔴 Tinggi |
| 3 | [TASK-03-pencatatan-pengeluaran.md](./TASK-03-pencatatan-pengeluaran.md) | Pencatatan Pengeluaran + Grafik + CSV | 🔴 Tinggi |
| 4 | [TASK-04-export-pelanggan.md](./TASK-04-export-pelanggan.md) | Export Data Pelanggan CSV (Deduplikasi) | 🟡 Sedang |
| 5 | [TASK-05-logika-bisnis-wa.md](./TASK-05-logika-bisnis-wa.md) | Logika Bisnis Akun Gratis vs Berbayar WA | 🔴 Tinggi |
| 6 | [TASK-06-bot-message-superadmin.md](./TASK-06-bot-message-superadmin.md) | Halaman Bot Pesan WA Superadmin | 🟡 Sedang |
| 7 | [TASK-07-logo-pada-nota.md](./TASK-07-logo-pada-nota.md) | Logo Toko pada Nota Cetak | 🟡 Sedang |
| 8 | [TASK-08-logo-aplikasi.md](./TASK-08-logo-aplikasi.md) | Desain Logo Aplikasi LaundryKu | 🟢 Rendah |

---

## 🏗️ Arsitektur Proyek (Wajib Dipahami)

### Stack Teknologi
- **Backend**: Node.js + Express + TypeScript, PostgreSQL (Prisma ORM), MongoDB (WA templates/logs)
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **WA**: Baileys (WhatsApp Web API)

### Struktur Direktori Penting
```
LaundryKu/
├── backend/
│   └── src/
│       ├── app.ts                    ← Entry point, daftarkan routes baru di sini
│       ├── controllers/              ← Handler HTTP request
│       ├── services/                 ← Business logic + Prisma queries
│       ├── routes/                   ← Definisi endpoint API
│       ├── middleware/               ← auth.ts, rbac.ts, validation.ts
│       ├── models-nosql/             ← Mongoose models (MongoDB)
│       └── whatsapp/
│           └── baileys.ts            ← Logika WA session + notifikasi
├── backend/prisma/
│   └── schema.prisma                 ← Skema database PostgreSQL
└── frontend/
    └── src/
        ├── app/
        │   ├── admin/                ← Halaman admin (route /admin/...)
        │   └── superadmin/           ← Halaman superadmin
        ├── components/               ← Komponen UI reusable
        └── lib/
            └── api.ts                ← Fungsi pemanggil API
```

### Pattern Respons API (Wajib Konsisten)
```json
// Sukses
{ "success": true, "data": {...}, "message": "..." }

// Error
{ "success": false, "error": "Pesan error yang jelas." }
```
