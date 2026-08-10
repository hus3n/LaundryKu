# PRD: Fitur Feedback & Bug Report Admin/Karyawan

**Versi**: 1.0  
**Tanggal**: 2026-08-08  
**Status**: Draft  
**Dibuat oleh**: Tim Product LaundryKu

---

## 1. Ringkasan Eksekutif

Fitur **Feedback & Bug Report** memungkinkan Admin toko dan Karyawan untuk melaporkan bug, error, atau memberikan masukan (ulasan) tentang aplikasi langsung dari dalam dashboard mereka. Laporan tersebut secara otomatis diteruskan ke SuperAdmin melalui WhatsApp. SuperAdmin dapat memperbarui status laporan, dan ketika status diubah menjadi "Selesai / Diperbaiki", Admin dan Karyawan pelapor mendapatkan notifikasi WhatsApp secara otomatis.

---

## 2. Latar Belakang & Tujuan

### Masalah Saat Ini
- Admin dan Karyawan tidak memiliki jalur resmi untuk melaporkan bug atau memberikan masukan.
- Laporan bug tercecer di grup WhatsApp dan susah ditrack perkembangannya.
- SuperAdmin kesulitan memprioritaskan perbaikan karena tidak ada sistem pelacakan terstruktur.

### Tujuan Fitur
- Menyediakan saluran resmi pelaporan bug / feedback langsung dari dalam aplikasi.
- Memudahkan SuperAdmin melacak, merespons, dan menutup laporan.
- Meningkatkan kepercayaan pengguna dengan notifikasi WA saat bug diperbaiki.

---

## 3. User Stories

| ID | Aktor | User Story |
|---|---|---|
| US-1 | Admin | Sebagai Admin, saya ingin melaporkan bug dari halaman dashboard saya, agar SuperAdmin mengetahui masalah yang saya alami. |
| US-2 | Karyawan | Sebagai Karyawan, saya ingin memberikan feedback tentang fitur yang sulit digunakan. |
| US-3 | Admin/Karyawan | Saya ingin melihat daftar laporan saya beserta statusnya (Menunggu, Diproses, Selesai). |
| US-4 | Admin/Karyawan | Saya ingin mendapat notifikasi WA saat bug yang saya laporkan sudah diperbaiki. |
| US-5 | SuperAdmin | Saya ingin melihat semua laporan masuk, memfilter berdasarkan tipe dan status. |
| US-6 | SuperAdmin | Saya ingin memperbarui status laporan dan merespons langsung ke pelapor via WA. |

---

## 4. Spesifikasi Kebutuhan Fungsional

### 4.1 Halaman Feedback Admin (`/admin/feedback`)

**Aktor**: Admin Toko  
**Akses**: Menu sidebar Admin dengan ikon 🐞 atau 💬

**Tampilan Halaman**:
1. **Tombol "Buat Laporan Baru"** — membuka modal form laporan.
2. **Tabel Riwayat Laporan** milik Admin tersebut, berisi:
   - No. Laporan (auto-generate: `FB-YYYYMMDD-001`)
   - Judul / Ringkasan
   - Tipe: `Bug` | `Error` | `Saran Fitur` | `Masukan Umum`
   - Halaman/Fitur Terdampak
   - Status: `MENUNGGU` | `DIPROSES` | `SELESAI` | `DITOLAK`
   - Tanggal Dibuat
   - Aksi: Lihat Detail

**Modal Form Buat Laporan**:
```
Tipe Laporan*  : [Dropdown: Bug | Error | Saran Fitur | Masukan Umum]
Judul*         : [Input text, max 100 char]
Halaman/Fitur* : [Input text, contoh: "Halaman Transaksi Baru"]
Deskripsi*     : [Textarea, min 20 char, max 1000 char]
Tingkat Urgensi: [Dropdown: Rendah | Sedang | Tinggi | Kritis]
Screenshot     : [File upload opsional, max 3 gambar, max 5MB each]
```

**Aturan Bisnis**:
- Admin hanya dapat melihat laporan yang ia buat sendiri.
- Admin tidak dapat mengedit atau menghapus laporan yang sudah dikirim.
- Maksimal 10 laporan aktif (status belum SELESAI) per Admin dalam satu waktu.

---

### 4.2 Halaman Feedback Karyawan

**Aktor**: Karyawan  
**Akses**: Floating button ikon 🐞 yang muncul di semua halaman karyawan (`/karyawan/**`)

**Implementasi**:
- Bukan halaman terpisah, melainkan **floating action button** di pojok kanan bawah layar.
- Saat diklik, muncul modal yang sama dengan form laporan Admin.
- Riwayat laporan karyawan dapat dilihat melalui floating button yang sama (tab kedua: "Riwayat Laporan").

**Aturan Bisnis**:
- Karyawan hanya dapat melihat laporan yang ia buat sendiri.
- Karyawan dikaitkan dengan Admin toko mereka (laporan juga diteruskan ke Admin toko terkait sebagai informasi).

---

### 4.3 Penerusan Laporan ke SuperAdmin via WhatsApp

**Trigger**: Saat laporan baru dibuat dan disimpan ke database.

**Template WA ke SuperAdmin (`FEEDBACK_NEW_REPORT`)**:
```
🐞 *LAPORAN BARU MASUK* — LaundryKu

━━━━━━━━━━━━━━━━━━
📋 *No. Laporan*: {{no_laporan}}
🏪 *Toko*: {{nama_toko}} ({{nama_admin}})
👤 *Dilaporkan oleh*: {{nama_pelapor}} ({{role_pelapor}})
🏷️ *Tipe*: {{tipe_laporan}}
⚠️ *Urgensi*: {{urgensi}}
📍 *Halaman/Fitur*: {{halaman_terdampak}}
━━━━━━━━━━━━━━━━━━

📝 *Deskripsi*:
{{deskripsi}}

📅 Dilaporkan: {{tanggal_dibuat}}

*Buka Dashboard SuperAdmin untuk merespons laporan ini.*
```

**Nomor WA SuperAdmin**: Diambil dari konfigurasi sistem (`SUPERADMIN_WA_NUMBER` di env).

---

### 4.4 Notifikasi WA ke Pelapor Saat Bug Diperbaiki

**Trigger**: SuperAdmin mengubah status laporan menjadi `SELESAI`.

**Template WA ke Pelapor (`FEEDBACK_RESOLVED`)**:
```
✅ *Laporan Anda Telah Ditangani!* — LaundryKu

Halo Kak {{nama_pelapor}}, 

Laporan yang Anda ajukan sebelumnya telah berhasil *DISELESAIKAN* oleh tim kami! 🎉

━━━━━━━━━━━━━━━━━━
📋 *No. Laporan*: {{no_laporan}}
📝 *Judul*: {{judul_laporan}}
📅 *Tanggal Laporan*: {{tanggal_dibuat}}
✅ *Status*: SELESAI / DIPERBAIKI
━━━━━━━━━━━━━━━━━━

💬 *Catatan dari Tim LaundryKu*:
{{catatan_resolusi}}

Silakan coba kembali fitur tersebut dan hubungi kami jika masih ada kendala. Terima kasih atas laporan Anda yang membantu kami berkembang! 🙏
```

---

### 4.5 Halaman Manajemen Feedback SuperAdmin (`/superadmin/feedback`)

**Aktor**: SuperAdmin  
**Fitur Halaman**:

1. **Tabel Semua Laporan** dengan filter:
   - Filter Tipe: Bug / Error / Saran Fitur / Masukan Umum / Semua
   - Filter Status: Menunggu / Diproses / Selesai / Ditolak / Semua
   - Filter Urgensi: Kritis / Tinggi / Semua
   - Pencarian: by Nama Toko / No. Laporan

2. **Baris tabel** menampilkan:
   - No. Laporan
   - Nama Toko & Pelapor
   - Tipe + Urgensi (badge berwarna)
   - Judul
   - Status (badge)
   - Tanggal
   - Tombol Aksi: Detail / Update Status

3. **Modal Detail Laporan**:
   - Tampilkan semua info laporan + screenshot (jika ada)
   - Form update status: `[Dropdown: MENUNGGU | DIPROSES | SELESAI | DITOLAK]`
   - Textarea: "Catatan Resolusi / Balasan ke Pelapor" *(wajib diisi saat status = SELESAI)*
   - Tombol: **"Simpan & Kirim Notifikasi WA"** (jika status = SELESAI)

---

## 5. Perubahan Database (Schema Prisma)

### Model Baru: `FeedbackReport`
```prisma
enum FeedbackType {
  BUG
  ERROR
  FEATURE_REQUEST
  GENERAL
}

enum FeedbackStatus {
  PENDING
  IN_PROGRESS
  RESOLVED
  REJECTED
}

enum FeedbackUrgency {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model FeedbackReport {
  id              String          @id @default(uuid())
  reportNumber    String          @unique  // e.g. FB-20260808-001
  reportedById    String
  reportedBy      User            @relation(fields: [reportedById], references: [id], onDelete: Cascade)
  adminId         String?         // Admin toko terkait (untuk karyawan: adminId dari karyawan)
  type            FeedbackType    @default(BUG)
  urgency         FeedbackUrgency @default(MEDIUM)
  title           String
  affectedPage    String?
  description     String          @db.Text
  screenshotUrls  String[]        // Array URL gambar screenshot
  status          FeedbackStatus  @default(PENDING)
  resolutionNote  String?         // Catatan penjelasan dari SuperAdmin
  resolvedAt      DateTime?
  waNotifiedAt    DateTime?       // Waktu terakhir WA notifikasi dikirim ke pelapor
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

---

## 6. Perubahan API Backend

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/feedback` | Buat laporan baru | Admin / Employee |
| `GET` | `/feedback/my` | Ambil daftar laporan milik saya | Admin / Employee |
| `GET` | `/feedback/:id` | Detail laporan (hanya milik sendiri) | Admin / Employee |
| `GET` | `/superadmin/feedback` | Semua laporan (dengan filter) | SuperAdmin |
| `GET` | `/superadmin/feedback/:id` | Detail laporan apapun | SuperAdmin |
| `PATCH` | `/superadmin/feedback/:id/status` | Update status + kirim WA | SuperAdmin |

### File Backend Baru:
```
backend/src/controllers/feedback.controller.ts
backend/src/routes/feedback.routes.ts
backend/src/services/feedback.service.ts
```

---

## 7. Perubahan Frontend

### File Baru:
| File | Deskripsi |
|---|---|
| `frontend/src/app/admin/feedback/page.tsx` | Halaman daftar feedback Admin |
| `frontend/src/app/superadmin/feedback/page.tsx` | Halaman manajemen feedback SuperAdmin |
| `frontend/src/components/ui/FeedbackModal.tsx` | Modal form buat laporan |
| `frontend/src/components/ui/FeedbackDetailModal.tsx` | Modal detail laporan (untuk SuperAdmin) |
| `frontend/src/components/ui/FeedbackFAB.tsx` | Floating Action Button 🐞 untuk karyawan |

### Modifikasi File:
| File | Perubahan |
|---|---|
| `frontend/src/components/layouts/DashboardLayout.tsx` | Tambah menu "Laporan & Feedback" di sidebar Admin |
| `frontend/src/app/karyawan/laundry/page.tsx` | Import & render `FeedbackFAB` component |

---

## 8. Alur Lengkap (Flowchart)

```
Admin/Karyawan Buat Laporan
        │
        ▼
[Simpan ke DB: FeedbackReport (status: PENDING)]
        │
        ▼
[Kirim WA FEEDBACK_NEW_REPORT ke SuperAdmin]
        │
        ▼
[SuperAdmin lihat di /superadmin/feedback]
        │
        ├── Update status → DIPROSES
        │         └── Status berubah di tabel pelapor
        │
        └── Update status → SELESAI + isi "Catatan Resolusi"
                  │
                  ▼
        [Kirim WA FEEDBACK_RESOLVED ke nomor WA pelapor]
                  │
                  ▼
        [Status di halaman pelapor berubah → ✅ SELESAI]
```

---

## 9. Kriteria Penerimaan (Acceptance Criteria)

- [x] Admin dapat membuat laporan dari halaman `/admin/feedback` dengan semua field yang diperlukan.
- [x] Karyawan dapat membuat laporan melalui floating button yang muncul di semua halaman karyawan.
- [x] Notifikasi WA terkirim ke nomor SuperAdmin setiap kali laporan baru dibuat.
- [x] Admin/Karyawan dapat melihat daftar laporan mereka beserta status saat ini.
- [x] SuperAdmin dapat melihat semua laporan dengan filter berdasarkan tipe, status, dan urgensi.
- [x] SuperAdmin dapat mengubah status laporan dan menambahkan catatan resolusi.
- [x] Notifikasi WA terkirim ke nomor WA pelapor saat status diubah menjadi SELESAI.
- [x] Screenshot dapat diupload (opsional, max 3 file × 5MB).
- [x] Tidak ada Admin/Karyawan yang dapat melihat laporan milik pengguna lain.

---

## 10. Estimasi Pengerjaan

| Task | Estimasi |
|---|---|
| Backend: Schema DB + migration | 0.5 hari |
| Backend: API feedback CRUD | 1 hari |
| Backend: WA notifikasi + templates | 0.5 hari |
| Frontend: Halaman Admin feedback | 1 hari |
| Frontend: Floating Button Karyawan | 0.5 hari |
| Frontend: Halaman SuperAdmin feedback | 1 hari |
| Testing & QA | 0.5 hari |
| **Total** | **5 hari** |
