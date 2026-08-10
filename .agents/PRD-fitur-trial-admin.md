# PRD: Fitur Trial Akun Admin LaundryKu

**Versi**: 1.0  
**Tanggal**: 2026-08-08  
**Status**: Draft  
**Dibuat oleh**: Tim Product LaundryKu

---

## 1. Ringkasan Eksekutif

Fitur **Trial Admin** memungkinkan SuperAdmin untuk membuat akun Admin toko dengan masa percobaan terbatas (3–7 hari) tanpa perlu melakukan pembayaran langganan terlebih dahulu. Setelah masa trial berakhir, sistem secara otomatis mengunci dan menghapus akun tersebut, serta mengirimkan notifikasi WhatsApp kepada Admin terkait agar segera melakukan perpanjangan berlangganan.

---

## 2. Latar Belakang & Tujuan

### Masalah Saat Ini
- Calon pelanggan Admin tidak dapat mencoba aplikasi sebelum berlangganan.
- Tidak ada mekanisme konversi dari pengguna coba-coba menjadi pelanggan berbayar.
- SuperAdmin harus mengelola proses onboarding secara manual.

### Tujuan Fitur
- Menurunkan hambatan awal bagi calon Admin untuk mencoba LaundryKu.
- Meningkatkan konversi dari trial ke pelanggan berbayar melalui notifikasi WA otomatis.
- Mengotomatiskan siklus hidup akun trial (pembuatan → notifikasi → kunci → hapus).

---

## 3. Spesifikasi Kebutuhan Fungsional

### 3.1 Pembuatan Akun Trial oleh SuperAdmin

**Aktor**: SuperAdmin  
**Halaman**: `/superadmin/admins`

**Alur Pembuatan**:
1. Di halaman Kelola Admin, SuperAdmin menekan tombol baru **"Buat Akun Trial"**.
2. Muncul modal dengan form field berikut:
   - Nama Toko Laundry *(required)*
   - Nama Pemilik / Admin *(required)*
   - Email Login *(required)*
   - Password Login *(required)*
   - No. WhatsApp Pemilik *(required — digunakan untuk notifikasi)*
   - Durasi Trial: **Dropdown 3 hari / 5 hari / 7 hari** *(default: 7 hari)*
3. Sistem membuat akun Admin dengan field baru `isTrial: true` dan `subscriptionEnd = now() + durasi`.
4. Sistem otomatis mengirimkan pesan WhatsApp selamat datang kepada Admin yang baru saja terdaftar (template baru: `TRIAL_WELCOME`).
5. SuperAdmin melihat badge **"TRIAL"** pada baris akun tersebut di tabel.

**Aturan Bisnis**:
- Akun trial **tidak dapat diubah** menjadi akun reguler dari dalam modal buat akun — harus melalui proses perpanjangan berbayar oleh SuperAdmin.
- Akun trial ditampilkan dengan badge **kuning/amber** yang berbeda dari akun reguler.
- SuperAdmin tetap bisa memperpanjang akun trial menjadi akun berbayar melalui fitur "Perpanjang Masa Aktif" yang sudah ada.

---

### 3.2 Notifikasi WhatsApp Otomatis Pengingat Masa Trial

**Sistem**: Cron Job terjadwal  
**Frekuensi**: Setiap hari pukul 09.00 pagi (server time)

**Skenario Notifikasi**:

| Kondisi | Aksi Sistem |
|---|---|
| Masa trial tersisa ≤ 7 hari | Kirim WA notifikasi pengingat ke nomor Admin |
| Masa trial tersisa ≤ 3 hari | Kirim WA notifikasi mendesak + link chat WA SuperAdmin |
| Masa trial tersisa ≤ 1 hari | Kirim WA notifikasi final (hari terakhir) |
| Masa trial = 0 (kadaluarsa) | Kunci akun + hapus data akun otomatis |

**Template Pesan WA Baru (`TRIAL_REMINDER`)**:
```
Halo Kak {{nama_admin}} ({{nama_toko}}), 👋

Masa TRIAL gratis LaundryKu Anda akan berakhir dalam *{{sisa_hari}} hari* lagi ({{tanggal_expired}}).

Agar usaha laundry Anda tetap berjalan lancar dan data tidak hilang, segera lakukan perpanjangan berlangganan sekarang! 🚀

📞 *Hubungi SuperAdmin untuk berlangganan:*
wa.me/{{nomor_wa_superadmin}}

Jangan sampai kehabisan! Seluruh data transaksi akan TERHAPUS jika masa trial berakhir. 🙏
```

**Template Pesan WA Selamat Datang (`TRIAL_WELCOME`)**:
```
Selamat Datang di LaundryKu! 🎉🧺

Halo Kak {{nama_admin}}, akun trial LaundryKu untuk toko *{{nama_toko}}* berhasil dibuat!

━━━━━━━━━━━━━━━━━━
🔑 *Email Login*: {{email}}
⏳ *Masa Trial*: {{durasi_hari}} hari (hingga {{tanggal_expired}})
🌐 *Link Aplikasi*: {{url_aplikasi}}
━━━━━━━━━━━━━━━━━━

Silakan login dan mulai eksplorasi semua fitur LaundryKu selama masa trial berlangsung.

Jika ada pertanyaan, hubungi kami di:
📞 wa.me/{{nomor_wa_superadmin}}

Selamat mencoba! 🙏
```

---

### 3.3 Penguncian & Penghapusan Akun Trial Otomatis

**Sistem**: Cron Job terjadwal  
**Frekuensi**: Setiap hari pukul 00.01 malam

**Alur Penghapusan**:
1. Sistem memindai seluruh akun Admin dengan `isTrial = true` dan `subscriptionEnd <= now()`.
2. Untuk setiap akun yang ditemukan:
   a. Ubah `isActive = false` pada `User` dan `Admin`.
   b. Kirim notifikasi WA terakhir: "Masa trial Anda telah berakhir..."
   c. Jalankan penghapusan data secara **soft-delete** dulu (tandai sebagai `isDeleted = true`, simpan 24 jam).
   d. Setelah 24 jam, lakukan **hard-delete** pada seluruh data terkait admin tersebut (orders, customers, packages, employees, categories).
3. Catat event penghapusan di activity log SuperAdmin.

> ⚠️ **Catatan Keamanan**: Hard-delete permanen hanya dilakukan setelah 24 jam sejak akun dikunci — memberikan window waktu bagi SuperAdmin untuk menyelamatkan data jika diperlukan.

---

## 4. Spesifikasi Kebutuhan Non-Fungsional

| Aspek | Spesifikasi |
|---|---|
| **Performa Cron Job** | Selesai dalam < 30 detik untuk max 1.000 akun trial |
| **Notifikasi WA** | Dikirim melalui queue (tidak blocking, max 3 retry) |
| **Keamanan Data** | Soft-delete dulu 24 jam sebelum hard-delete |
| **Idempotency** | Cron job tidak mengirim duplikat notifikasi dalam 24 jam |

---

## 5. Perubahan Database (Schema Prisma)

### Tambahan Field pada Model `Admin`:
```prisma
model Admin {
  // ... field yang sudah ada ...

  isTrial          Boolean   @default(false)       // NEW: apakah akun ini adalah trial?
  trialDays        Int?                            // NEW: durasi trial awal (3/5/7 hari)
  isDeleted        Boolean   @default(false)       // NEW: soft delete flag
  deletedAt        DateTime?                       // NEW: waktu penandaan soft delete
}
```

### Tambahan Template WA baru di `WATemplate` (MongoDB):
```
type: "TRIAL_WELCOME"
type: "TRIAL_REMINDER"
type: "TRIAL_EXPIRED"
```

---

## 6. Perubahan API Backend

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/superadmin/admins/trial` | Buat akun trial baru | SuperAdmin |
| `GET` | `/superadmin/admins?filter=trial` | Daftar akun trial | SuperAdmin |
| `PATCH` | `/superadmin/admins/:id/convert-to-paid` | Konversi trial → berbayar | SuperAdmin |
| `DELETE` | `/superadmin/admins/trial/cleanup` | Manual trigger cleanup | SuperAdmin |

---

## 7. Perubahan Frontend

### File yang Dimodifikasi:
| File | Perubahan |
|---|---|
| `frontend/src/app/superadmin/admins/page.tsx` | Tambah tombol "Buat Akun Trial", badge TRIAL, modal form trial |
| `frontend/src/components/ui/CreateTrialModal.tsx` | *[BARU]* Komponen modal buat akun trial |

### UI Detail:
- Tombol **"+ Buat Akun Trial"** ditempatkan di sebelah kanan tombol "Daftarkan Admin Baru" di halaman `/superadmin/admins`.
- Baris akun trial di tabel menampilkan badge **`TRIAL • X Hari Tersisa`** berwarna amber/kuning.
- Akun trial yang sudah kadaluarsa (overdue) menampilkan badge **`TRIAL EXPIRED`** berwarna merah.

---

## 8. Cron Jobs Baru

### File: `backend/src/jobs/trialExpiry.job.ts` *(BARU)*

| Job | Jadwal | Fungsi |
|---|---|---|
| `checkTrialExpiryAndNotify` | Setiap hari 09:00 WIB | Kirim notifikasi WA reminder sesuai sisa hari trial |
| `cleanupExpiredTrialAccounts` | Setiap hari 00:01 WIB | Kunci + soft-delete akun trial kadaluarsa |
| `hardDeleteExpiredTrials` | Setiap hari 00:30 WIB | Hard-delete akun soft-deleted yang sudah > 24 jam |

---

## 9. Alur Lengkap (Flowchart)

```
SuperAdmin Buat Trial
        │
        ▼
[Kirim WA TRIAL_WELCOME ke Admin]
        │
        ▼
[Hari 1-6: Admin gunakan aplikasi]
        │
        ▼
[Hari ke-7: Sisa ≤ 7 hari → Kirim WA TRIAL_REMINDER (3x: -7d, -3d, -1d)]
        │
        ├─── Admin hubungi SuperAdmin & bayar
        │         └── SuperAdmin klik "Perpanjang Masa Aktif" (fitur existing)
        │                   └── isTrial = false, subscriptionEnd diperbarui
        │
        └─── Admin tidak bayar
                  └── [Hari ke-0: TRIAL_EXPIRED WA dikirim]
                             └── [isActive = false → soft-delete]
                                       └── [+24 jam → hard-delete permanen]
```

---

## 10. Kriteria Penerimaan (Acceptance Criteria)

- [x] SuperAdmin dapat membuat akun trial dengan durasi 3, 5, atau 7 hari dari halaman `/superadmin/admins`.
- [x] Pesan WA selamat datang terkirim otomatis saat akun trial dibuat.
- [x] Cron job mengirim 3 notifikasi WA: saat sisa 7 hari, 3 hari, dan 1 hari.
- [x] Notifikasi WA mengandung link WA SuperAdmin untuk perpanjangan.
- [x] Akun trial dikunci otomatis saat `subscriptionEnd` tercapai.
- [x] Hard-delete permanen terjadi 24 jam setelah soft-delete.
- [x] Badge TRIAL ditampilkan di tabel dengan sisa hari yang akurat.
- [x] SuperAdmin dapat mengkonversi akun trial menjadi akun berbayar melalui "Perpanjang Masa Aktif".
- [x] Tidak ada duplikasi notifikasi WA dalam satu hari yang sama.

---

## 11. Estimasi Pengerjaan

| Task | Estimasi |
|---|---|
| Backend: Schema DB + migration | 0.5 hari |
| Backend: API endpoint trial | 1 hari |
| Backend: Cron job + WA templates | 1 hari |
| Frontend: Modal + badge UI | 1 hari |
| Testing & QA | 0.5 hari |
| **Total** | **4 hari** |
