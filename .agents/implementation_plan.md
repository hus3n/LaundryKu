# PRD — LaundryKu v1.0: Webapp Pencatatan Laundry

> **Status**: ✅ Disetujui — Siap Implementasi
> **Tanggal**: 7 Agustus 2026

## 1. Ringkasan Eksekutif

**LaundryKu v1.0** adalah aplikasi web pencatatan laundry yang dirancang untuk mempermudah pemilik usaha laundry dalam mengelola operasional harian, mulai dari pencatatan cucian, manajemen karyawan, hingga notifikasi otomatis ke pelanggan melalui WhatsApp. Aplikasi ini menggunakan arsitektur terpisah antara **Frontend (Next.js + Tailwind CSS)** dan **Backend (Node.js + Express)** dengan **PostgreSQL + Prisma**, **MongoDB**, dan **Redis** sebagai layer data. Deployment menggunakan **Coolify** pada server mandiri.

### Tech Stack yang Dikonfirmasi

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database SQL** | PostgreSQL + Prisma ORM |
| **Database NoSQL** | MongoDB + Mongoose |
| **Cache** | Redis |
| **WhatsApp Gateway** | Baileys |
| **Animasi** | GSAP + Framer Motion |
| **Deployment** | Coolify (Self-Hosted Server) |
| **Containerization** | Docker + Docker Compose |

---

## 2. Tujuan Produk

| Tujuan | Deskripsi |
|--------|-----------|
| **Efisiensi Operasional** | Mengurangi pencatatan manual dan mempercepat alur kerja laundry |
| **Transparansi Status** | Pelanggan dapat mengetahui status cucian secara real-time via WhatsApp |
| **Manajemen Multi-Toko** | SuperAdmin dapat mengelola banyak toko laundry (admin) dari satu dashboard |
| **Skalabilitas** | Arsitektur terpisah frontend-backend memungkinkan scaling independen |

---

## 3. Pengguna & Peran (User Roles)

### 3.1 SuperAdmin — Administrator Utama

```mermaid
mindmap
  root((SuperAdmin))
    Kelola Admin
      Tambah Admin
      Edit Admin
      Hapus Admin
      Lihat Masa Aktif
      Perpanjang Masa Aktif
    WhatsApp Management
      Daftarkan WA Tertaut
      Kirim Info Masa Aktif
      Kirim Notifikasi ke Admin
    Monitoring
      Lihat Status Admin
      Lihat Status WA Admin
      Dashboard Super
```

**Hak Akses SuperAdmin:**
- CRUD data Admin (Pemilik Laundry)
- Melihat & mengelola masa aktif akun Admin
- Mendaftarkan WhatsApp tertaut untuk komunikasi ke Admin
- Mengirim notifikasi otomatis ke Admin ketika masa aktif akan berakhir
- Mengakses dashboard ringkasan seluruh Admin

---

### 3.2 Admin — Pemilik Laundry

```mermaid
mindmap
  root((Admin))
    Kelola Karyawan
      Tambah Karyawan
      Edit Karyawan
      Hapus Karyawan
    Kelola Paket
      Tambah Paket
      Edit Paket
      Hapus Paket
    Kelola Pelanggan
      Tambah Pelanggan
      Edit Pelanggan
      Hapus Pelanggan
    Dashboard
      Total Cucian
      Total Pendapatan
      Grafik Harian/Bulanan/Tahunan
      Grafik per Paket
      Statistik Karyawan
    WhatsApp Toko
      Pairing WA
      Template Pesan
      Kirim Pesan Custom
    Data Cucian
      Lihat Semua Cucian
      Edit Status Cucian
      Riwayat Cucian
```

**Hak Akses Admin:**
- CRUD data Karyawan, Paket, dan Pelanggan
- Dashboard utama pendapatan dengan grafik multi-dimensi
- Pairing WhatsApp toko & manajemen template pesan
- Melihat dan mengelola semua data cucian

---

### 3.3 Karyawan — Pekerja Laundry

```mermaid
mindmap
  root((Karyawan))
    Pencatatan Cucian
      Input Cucian Baru
      Pilih Paket
      Input Pelanggan
    Update Status
      Sedang Dikerjakan
      Selesai
      Sudah Diambil
    Lihat Data
      Data Cucian Global
      Status Cucian
```

**Hak Akses Karyawan:**
- Mencatat cucian baru
- Mengupdate status cucian
- Melihat data cucian global (toko tempatnya bekerja)

---

## 4. Epics & User Stories

### Epic 1: Autentikasi & Manajemen Akun

> *Sistem autentikasi multi-role untuk SuperAdmin, Admin, dan Karyawan*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-1.1 | Sebagai **pengunjung**, saya ingin melihat landing page LaundryKu agar saya memahami fitur dan cara mendaftar | P0 | Landing page menampilkan fitur, harga, dan tombol CTA daftar/login |
| US-1.2 | Sebagai **pengunjung**, saya ingin mendaftar sebagai Admin (Pemilik Laundry) agar saya bisa menggunakan aplikasi | P0 | Form pendaftaran yang auto-redirect ke WhatsApp SuperAdmin dengan pesan template |
| US-1.3 | Sebagai **pengguna**, saya ingin login dengan email & password agar saya bisa mengakses dashboard sesuai role | P0 | Login berhasil → redirect ke dashboard sesuai role (SuperAdmin/Admin/Karyawan) |
| US-1.4 | Sebagai **pengguna**, saya ingin logout agar saya bisa keluar dari akun saya | P0 | Tombol logout menghapus session & redirect ke landing page |
| US-1.5 | Sebagai **pengguna**, saya ingin mereset password jika lupa agar saya bisa kembali mengakses akun | P1 | Email reset password terkirim dengan link valid 24 jam |
| US-1.6 | Sebagai **Admin**, saya ingin membuat akun karyawan agar karyawan bisa menggunakan sistem | P0 | Admin bisa generate credentials untuk karyawan baru |

---

### Epic 2: Dashboard & Analitik (Admin)

> *Dashboard utama untuk monitoring bisnis laundry secara real-time*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-2.1 | Sebagai **Admin**, saya ingin melihat total cucian hari ini agar saya tahu volume kerja harian | P0 | Widget menampilkan jumlah cucian masuk hari ini |
| US-2.2 | Sebagai **Admin**, saya ingin melihat total pendapatan agar saya tahu performa bisnis | P0 | Widget menampilkan total pendapatan (hari/bulan/tahun) |
| US-2.3 | Sebagai **Admin**, saya ingin melihat cucian yang akan diambil hari ini agar saya bisa mempersiapkan | P0 | Daftar cucian dengan tenggat hari ini ditampilkan |
| US-2.4 | Sebagai **Admin**, saya ingin melihat grafik pendapatan berdasarkan hari/bulan/tahun agar saya bisa menganalisis tren | P1 | Grafik interaktif dengan filter periode waktu |
| US-2.5 | Sebagai **Admin**, saya ingin melihat grafik berdasarkan jenis paket agar saya tahu paket terlaris | P1 | Grafik pie/bar per kategori paket |
| US-2.6 | Sebagai **Admin**, saya ingin melihat statistik karyawan agar saya tahu produktivitas tiap karyawan | P1 | Tabel statistik cucian yang diselesaikan per karyawan |
| US-2.7 | Sebagai **Admin**, saya ingin melihat riwayat cucian masuk/keluar agar saya punya rekap transaksi | P0 | Tabel riwayat dengan filter tanggal, status, dan search |

---

### Epic 3: Manajemen Cucian

> *Pencatatan dan tracking cucian dari masuk hingga diambil pelanggan*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-3.1 | Sebagai **Karyawan**, saya ingin mencatat cucian baru dengan data lengkap agar tercatat di sistem | P0 | Form input: nama pelanggan, no WA, jenis cucian, paket, kuantitas, harga, catatan, tanggal |
| US-3.2 | Sebagai **Karyawan**, saya ingin memilih paket cucian dari daftar yang tersedia agar proses input cepat | P0 | Dropdown paket yang sudah diatur Admin |
| US-3.3 | Sebagai **Karyawan**, saya ingin mengupdate status cucian agar pelanggan tahu progress-nya | P0 | Pilihan status: Sedang Dikerjakan, Selesai, Sudah Diambil |
| US-3.4 | Sebagai **Admin/Karyawan**, saya ingin melihat semua data cucian secara global agar saya punya overview | P0 | Tabel data cucian dengan kolom: status, tanggal masuk, tanggal keluar, total harga, jumlah, pelanggan, no WA |
| US-3.5 | Sebagai **Admin**, saya ingin mengedit status pembayaran cucian agar catatan keuangan akurat | P0 | Toggle status bayar/belum bayar |
| US-3.6 | Sebagai **Karyawan**, saya ingin notifikasi WA dikirim otomatis ke pelanggan ketika status cucian berubah | P0 | WA terkirim otomatis saat: cucian masuk, status update, cucian siap diambil, cucian sudah diambil |

---

### Epic 4: Manajemen Paket

> *Pengelolaan paket layanan laundry*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-4.1 | Sebagai **Admin**, saya ingin menambah paket baru agar menyesuaikan layanan toko | P0 | Form input: nama paket, jenis cucian, harga, satuan, estimasi waktu |
| US-4.2 | Sebagai **Admin**, saya ingin mengedit paket yang sudah ada agar data tetap akurat | P0 | Form edit dengan data existing yang pre-filled |
| US-4.3 | Sebagai **Admin**, saya ingin menghapus paket yang tidak berlaku lagi | P1 | Soft delete dengan konfirmasi (paket yang sudah dipakai tidak bisa hard delete) |
| US-4.4 | Sebagai **Admin**, saya ingin melihat daftar semua paket agar saya tahu layanan yang tersedia | P0 | Tabel paket dengan search dan filter |

---

### Epic 5: Manajemen Karyawan

> *Pengelolaan data karyawan oleh Admin*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-5.1 | Sebagai **Admin**, saya ingin menambah karyawan baru beserta akun login-nya | P0 | Form input: nama, email, password, no HP |
| US-5.2 | Sebagai **Admin**, saya ingin mengedit data karyawan agar informasi tetap up-to-date | P0 | Form edit karyawan |
| US-5.3 | Sebagai **Admin**, saya ingin menghapus/menonaktifkan karyawan yang sudah keluar | P0 | Soft delete / deaktivasi akun |
| US-5.4 | Sebagai **Admin**, saya ingin melihat daftar semua karyawan | P0 | Tabel karyawan dengan status aktif/non-aktif |

---

### Epic 6: Manajemen Pelanggan

> *Pengelolaan data pelanggan oleh Admin*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-6.1 | Sebagai **Admin**, saya ingin menambah data pelanggan baru | P0 | Form input: nama, no WA, alamat (opsional) |
| US-6.2 | Sebagai **Admin**, saya ingin mengedit data pelanggan agar informasi tetap akurat | P0 | Form edit pelanggan |
| US-6.3 | Sebagai **Admin**, saya ingin menghapus pelanggan yang tidak aktif | P1 | Soft delete dengan konfirmasi |
| US-6.4 | Sebagai **Admin**, saya ingin melihat riwayat cucian per pelanggan agar bisa memberikan layanan lebih baik | P2 | Detail pelanggan menampilkan riwayat transaksi |

---

### Epic 7: Integrasi WhatsApp

> *Notifikasi otomatis dan komunikasi via WhatsApp*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-7.1 | Sebagai **Admin**, saya ingin pairing WhatsApp toko agar bisa kirim pesan otomatis | P0 | QR code pairing dengan status connect/disconnect real-time |
| US-7.2 | Sebagai **Admin**, saya ingin membuat template pesan WA agar komunikasi konsisten | P0 | Editor template dengan variabel dinamis (nama, status, tanggal) |
| US-7.3 | Sebagai **Admin**, saya ingin mengirim pesan custom ke pelanggan via WA toko | P1 | Form kirim pesan dengan pilih pelanggan dan isi pesan |
| US-7.4 | Sebagai **Sistem**, notifikasi WA otomatis terkirim saat cucian masuk | P0 | Pesan template terkirim otomatis ke no WA pelanggan |
| US-7.5 | Sebagai **Sistem**, notifikasi WA otomatis terkirim saat status cucian diupdate | P0 | Pesan template terkirim otomatis dengan jeda 10 detik antar pesan |
| US-7.6 | Sebagai **Sistem**, notifikasi WA otomatis terkirim saat cucian siap/sudah diambil | P0 | Pesan template terkirim otomatis |
| US-7.7 | Sebagai **SuperAdmin**, saya ingin mendaftarkan WA tertaut untuk komunikasi ke Admin | P0 | Pairing WA SuperAdmin untuk kirim info ke Admin |
| US-7.8 | Sebagai **SuperAdmin**, saya ingin mengirim notifikasi WA ke Admin saat masa aktif akan berakhir | P0 | Pesan WA otomatis H-7, H-3, H-1 sebelum masa aktif berakhir |

---

### Epic 8: SuperAdmin Management

> *Pengelolaan sistem secara keseluruhan oleh SuperAdmin*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-8.1 | Sebagai **SuperAdmin**, saya ingin menambah Admin (pemilik laundry) baru ke sistem | P0 | Form input: nama, email, password, nama toko, masa aktif |
| US-8.2 | Sebagai **SuperAdmin**, saya ingin mengedit data Admin | P0 | Form edit Admin |
| US-8.3 | Sebagai **SuperAdmin**, saya ingin menghapus Admin yang sudah tidak aktif | P0 | Soft delete Admin beserta seluruh data terkait |
| US-8.4 | Sebagai **SuperAdmin**, saya ingin melihat status masa aktif setiap Admin | P0 | Tabel Admin dengan kolom masa aktif, status (aktif/expired/hampir expired) |
| US-8.5 | Sebagai **SuperAdmin**, saya ingin memperpanjang masa aktif Admin | P0 | Pilihan tambah durasi (1/3/6/12 bulan) |
| US-8.6 | Sebagai **SuperAdmin**, saya ingin melihat status pairing WA setiap Admin | P1 | Indikator connect/disconnect per Admin |
| US-8.7 | Sebagai **SuperAdmin**, saya ingin melihat dashboard ringkasan seluruh Admin | P1 | Dashboard dengan total Admin aktif, expired, revenue |

---

### Epic 9: Landing Page

> *Halaman publik sebagai wajah aplikasi*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-9.1 | Sebagai **pengunjung**, saya ingin melihat informasi lengkap tentang LaundryKu | P0 | Hero section, fitur, cara kerja, harga, testimonial, FAQ |
| US-9.2 | Sebagai **pengunjung**, saya ingin mendaftar dengan mudah via tombol CTA | P0 | Tombol daftar yang redirect ke WhatsApp SuperAdmin dengan pesan template |
| US-9.3 | Sebagai **pengunjung**, saya ingin login dari landing page | P0 | Tombol login yang menuju halaman login |

---

### Epic 10: Fitur Pendukung (Disetujui)

> *Fitur pendukung yang disetujui untuk implementasi — meningkatkan kelengkapan dan pengalaman pengguna*

| ID | User Story | Prioritas | Kriteria Penerimaan |
|----|-----------|-----------|-------------------|
| US-10.1 | Sebagai **Admin**, saya ingin halaman **Pengaturan Toko** agar bisa mengatur info toko (nama, alamat, jam operasional, logo) | **P0** | Form pengaturan toko yang tersimpan dan tampil di struk/nota |
| US-10.2 | Sebagai **Admin**, saya ingin halaman **Cetak Nota/Struk** agar pelanggan punya bukti transaksi | **P0** | Generate nota PDF/cetak thermal printer dengan detail cucian |
| US-10.3 | Sebagai **Admin**, saya ingin fitur **Ekspor Laporan** agar saya bisa download data keuangan | **P1** | Ekspor laporan ke Excel/PDF dengan filter periode |
| US-10.4 | Sebagai **Admin**, saya ingin halaman **Profil Akun** agar bisa mengubah data pribadi dan password | **P0** | Form edit profil & change password |
| US-10.5 | Sebagai **Karyawan**, saya ingin halaman **Profil** agar bisa mengubah password saya | **P0** | Form change password untuk karyawan |
| US-10.6 | Sebagai **Admin**, saya ingin fitur **Notifikasi In-App** agar saya tahu event penting (cucian baru, cucian siap, dll) | **P1** | Bell icon dengan badge count dan dropdown notifikasi |
| US-10.7 | Sebagai **Admin**, saya ingin halaman **Log Aktivitas** agar saya bisa melacak siapa melakukan apa di sistem | **P1** | Tabel log dengan filter user, aksi, dan tanggal |
| US-10.8 | Sebagai **SuperAdmin**, saya ingin halaman **Pengaturan Sistem** agar bisa mengatur konfigurasi global | **P1** | Pengaturan harga langganan, template default, dll |
| US-10.9 | Sebagai **Karyawan**, saya ingin **autocomplete pelanggan** saat input cucian agar lebih cepat | **P0** | Search pelanggan existing atau input baru |
| US-10.10 | Sebagai **Admin**, saya ingin halaman **Manajemen Kategori Cucian** agar bisa mengatur jenis cucian (Kiloan, Satuan, Bed Cover, dll) | **P0** | CRUD kategori jenis cucian |

---

## 5. Activity Diagrams

### 5.1 Alur Login Pengguna

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Landing Page]
    B --> C[Klik Tombol Login]
    C --> D[Tampilkan Form Login]
    D --> E[Input Email & Password]
    E --> F{Validasi Input}
    F -->|Invalid| G[Tampilkan Error Validasi]
    G --> E
    F -->|Valid| H[Kirim Request ke Backend API]
    H --> I{Autentikasi Berhasil?}
    I -->|Gagal| J[Tampilkan Error Login]
    J --> E
    I -->|Berhasil| K{Cek Role Pengguna}
    K -->|SuperAdmin| L[Redirect ke Dashboard SuperAdmin]
    K -->|Admin| M{Cek Masa Aktif}
    M -->|Expired| N[Tampilkan Notifikasi Expired & Hubungi SuperAdmin]
    M -->|Aktif| O[Redirect ke Dashboard Admin]
    K -->|Karyawan| P[Redirect ke Halaman Cucian]
    L --> Q([Selesai])
    O --> Q
    P --> Q
    N --> Q
```

### 5.2 Alur Pendaftaran Admin Baru

```mermaid
flowchart TD
    A([Mulai]) --> B[Pengunjung Buka Landing Page]
    B --> C[Klik Tombol Daftar]
    C --> D[Isi Form Pendaftaran]
    D --> E[Sistem Generate Pesan Template WA]
    E --> F[Redirect ke WhatsApp SuperAdmin]
    F --> G[SuperAdmin Terima Pesan Pendaftaran]
    G --> H{SuperAdmin Setujui?}
    H -->|Tolak| I[Kirim WA Penolakan ke Calon Admin]
    H -->|Setujui| J[SuperAdmin Buat Akun Admin]
    J --> K[Set Masa Aktif Admin]
    K --> L[Kirim Kredensial via WA ke Admin Baru]
    L --> M[Admin Login Pertama Kali]
    M --> N[Setup Profil Toko]
    N --> O([Selesai])
    I --> O
```

### 5.3 Alur Pencatatan Cucian

```mermaid
flowchart TD
    A([Mulai]) --> B[Karyawan Buka Halaman Pencatatan]
    B --> C[Input / Pilih Pelanggan]
    C --> D{Pelanggan Existing?}
    D -->|Ya| E[Autocomplete Data Pelanggan]
    D -->|Tidak| F[Input Data Pelanggan Baru]
    F --> F1[Nama + No WhatsApp]
    E --> G[Pilih Jenis Cucian]
    F1 --> G
    G --> H[Pilih Paket dari Daftar]
    H --> I[Input Kuantitas]
    I --> J[Sistem Hitung Total Harga Otomatis]
    J --> K[Input Catatan Penting Opsional]
    K --> L[Set Tanggal Masuk Otomatis + Estimasi Selesai]
    L --> M{Validasi Data}
    M -->|Invalid| N[Tampilkan Error]
    N --> G
    M -->|Valid| O[Simpan ke Database]
    O --> P[Set Status = Masuk / Sedang Dikerjakan]
    P --> Q[Kirim Notifikasi WA ke Pelanggan]
    Q --> R[Tampilkan Konfirmasi Berhasil]
    R --> S([Selesai])
```

### 5.4 Alur Update Status Cucian

```mermaid
flowchart TD
    A([Mulai]) --> B[Karyawan Buka Data Cucian]
    B --> C[Pilih Cucian yang Akan Diupdate]
    C --> D[Klik Update Status]
    D --> E{Pilih Status Baru}
    E -->|Sedang Dikerjakan| F[Update Status DB]
    E -->|Selesai| G[Update Status DB + Set Tanggal Selesai]
    E -->|Sudah Diambil| H[Update Status DB + Set Tanggal Keluar]
    F --> I[Kirim Notifikasi WA Otomatis ke Pelanggan]
    G --> I
    H --> J{Sudah Bayar?}
    J -->|Sudah| K[Update Status Pembayaran = Lunas]
    J -->|Belum| L[Tampilkan Reminder Pembayaran]
    K --> I
    L --> I
    I --> M[Jeda 10 Detik Sebelum Kirim WA Berikutnya]
    M --> N[Tampilkan Konfirmasi Update]
    N --> O([Selesai])
```

### 5.5 Alur Pairing WhatsApp Toko (Admin)

```mermaid
flowchart TD
    A([Mulai]) --> B[Admin Buka Halaman Pairing WA]
    B --> C{Status WA Saat Ini?}
    C -->|Disconnected| D[Tampilkan Tombol Connect]
    C -->|Connected| E[Tampilkan Status Connected + Info WA]
    D --> F[Admin Klik Connect]
    F --> G[Backend Generate QR Code via WA Gateway]
    G --> H[Tampilkan QR Code di Frontend]
    H --> I[Admin Scan QR dari HP]
    I --> J{Scan Berhasil?}
    J -->|Timeout| K[Tampilkan Error Timeout]
    K --> F
    J -->|Berhasil| L[Update Status = Connected di DB]
    L --> M[Tampilkan Status Connected]
    E --> N{Admin Klik Disconnect?}
    N -->|Ya| O[Putuskan Koneksi WA]
    O --> P[Update Status = Disconnected di DB]
    P --> D
    N -->|Tidak| Q([Selesai])
    M --> Q
```

### 5.6 Alur Notifikasi Masa Aktif Admin (SuperAdmin)

```mermaid
flowchart TD
    A([Cron Job Harian]) --> B[Cek Semua Akun Admin]
    B --> C{Ada yang Masa Aktif Hampir Habis?}
    C -->|Tidak| D([Selesai])
    C -->|Ya| E{Berapa Hari Tersisa?}
    E -->|H-7| F[Kirim WA Reminder H-7]
    E -->|H-3| G[Kirim WA Reminder H-3]
    E -->|H-1| H[Kirim WA Reminder Urgent H-1]
    E -->|H-0 Expired| I[Nonaktifkan Akun Admin]
    I --> J[Kirim WA Notifikasi Akun Expired]
    F --> K[Log Notifikasi di Sistem]
    G --> K
    H --> K
    J --> K
    K --> D
```

### 5.7 Alur Dashboard Admin

```mermaid
flowchart TD
    A([Admin Login]) --> B[Load Dashboard]
    B --> C[Fetch Data Summary dari API]
    C --> D[Cache Data di Redis]
    D --> E[Render Widget Summary]
    E --> E1[Total Cucian Hari Ini]
    E --> E2[Total Pendapatan]
    E --> E3[Cucian Akan Diambil]
    E --> E4[Riwayat Terbaru]
    B --> F[Fetch Data Grafik]
    F --> G{Filter Periode?}
    G -->|Harian| H[Query Data Harian]
    G -->|Bulanan| I[Query Data Bulanan]
    G -->|Tahunan| J[Query Data Tahunan]
    H --> K[Render Grafik Interaktif]
    I --> K
    J --> K
    B --> L[Fetch Statistik Karyawan]
    L --> M[Render Tabel Produktivitas Karyawan]
    K --> N([Dashboard Lengkap Ditampilkan])
    M --> N
    E1 --> N
    E2 --> N
    E3 --> N
    E4 --> N
```

---

## 6. Arsitektur Teknis

### 6.1 Arsitektur Tingkat Tinggi

```mermaid
graph TB
    subgraph "Coolify - Self-Hosted Server"
        subgraph "Frontend - Next.js + Tailwind CSS"
            A[Landing Page] --> B[Auth Pages]
            B --> C[SuperAdmin Dashboard]
            B --> D[Admin Dashboard]
            B --> E[Karyawan Pages]
            F[Shared UI Components]
        end

        subgraph "Backend - Node.js + Express + TypeScript"
            G[REST API Gateway]
            G --> H[Auth Service]
            G --> I[Laundry Service]
            G --> J[User Management Service]
            G --> K[WhatsApp Service - Baileys]
            G --> L[Notification Service]
            G --> M[Report Service]
            G --> N1[Store Settings Service]
            G --> N2[Activity Log Service]
        end

        subgraph "Database Layer"
            N[(PostgreSQL + Prisma ORM)]
            O[(MongoDB + Mongoose)]
            P[(Redis)]
        end
    end

    C --> G
    D --> G
    E --> G

    H --> N
    H --> P
    I --> N
    J --> N
    K --> O
    L --> P
    L --> O
    M --> N
    N1 --> N
    N2 --> N

    K -.-> |Baileys SDK| WA[WhatsApp Server]
```

### 6.2 Pemisahan Database

| Database | Teknologi | Data yang Disimpan |
|----------|-----------|--------------------|
| **SQL (Primary)** | PostgreSQL + Prisma ORM | Users, Admin, Karyawan, Pelanggan, Cucian, Paket, Kategori, Transaksi, Pengaturan Toko, Log Aktivitas, Notifikasi In-App |
| **NoSQL (WhatsApp)** | MongoDB + Mongoose | Session WA (Baileys auth state), Riwayat Pesan, Template Pesan, Status Koneksi WA, Antrian Pesan |
| **Cache** | Redis | JWT Session Token, Dashboard Summary Cache, Rate Limiting, Antrian Notifikasi WA, Real-time Status |

### 6.3 Struktur Project

```
webapp-laundry/
├── frontend/                          # Next.js + Tailwind CSS App
│   ├── src/
│   │   ├── app/                       # App Router (Next.js 14+)
│   │   │   ├── (public)/              # Landing, Login, Register, Forgot Password
│   │   │   │   ├── page.tsx           # Landing page
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/[token]/
│   │   │   ├── (dashboard)/           # Auth layout wrapper
│   │   │   │   ├── superadmin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── admins/
│   │   │   │   │   ├── whatsapp/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── profile/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── laundry/
│   │   │   │   │   ├── packages/
│   │   │   │   │   ├── categories/
│   │   │   │   │   ├── employees/
│   │   │   │   │   ├── customers/
│   │   │   │   │   ├── whatsapp/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── activity-log/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── profile/
│   │   │   │   └── karyawan/
│   │   │   │       ├── laundry/
│   │   │   │       └── profile/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                    # Button, Card, Modal, Badge, etc.
│   │   │   ├── forms/                 # Form components + Zod validation
│   │   │   ├── charts/                # Chart.js / Recharts components
│   │   │   ├── tables/                # DataTable, pagination
│   │   │   ├── layouts/               # Sidebar, Header, DashboardLayout
│   │   │   └── whatsapp/              # QR display, status indicator
│   │   ├── hooks/                     # useDebounce, useQuery, useAuth, etc.
│   │   ├── lib/
│   │   │   ├── api/                   # Axios API client
│   │   │   ├── utils/                 # Formatters, helpers
│   │   │   ├── constants/             # App constants
│   │   │   └── validators/            # Zod schemas (shared)
│   │   ├── types/                     # TypeScript interfaces & types
│   │   ├── contexts/                  # React Context providers
│   │   └── styles/                    # Global CSS + Tailwind config
│   ├── public/                        # Static assets, images, favicon
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma              # PostgreSQL schema
│   │   ├── migrations/                # Prisma migrations
│   │   └── seed.ts                    # Database seed (SuperAdmin, etc.)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts            # Prisma client instance
│   │   │   ├── mongodb.ts             # Mongoose connection
│   │   │   ├── redis.ts               # Redis client
│   │   │   └── env.ts                 # Environment validation (Zod)
│   │   ├── controllers/               # Request handlers per domain
│   │   ├── middleware/
│   │   │   ├── auth.ts                # JWT verification
│   │   │   ├── rbac.ts                # Role-based access control
│   │   │   ├── validation.ts          # Zod request validation
│   │   │   └── rateLimiter.ts         # Rate limiting
│   │   ├── routes/                    # Express route definitions
│   │   ├── services/                  # Business logic layer
│   │   ├── models-nosql/              # Mongoose models (WA data)
│   │   ├── utils/                     # Helpers, formatters
│   │   ├── jobs/                      # Cron: masa aktif, reminder WA
│   │   ├── whatsapp/
│   │   │   ├── baileys.ts             # Baileys client setup
│   │   │   ├── messageQueue.ts        # WA message queue (10s delay)
│   │   │   └── templates.ts           # Template renderer
│   │   └── app.ts                     # Express app entry point
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml                 # PostgreSQL, MongoDB, Redis, Frontend, Backend
├── .env.example
├── coolify.json                       # Coolify deployment config (optional)
└── README.md
```

---

## 7. Daftar Halaman Aplikasi

### Frontend Route Map

| No | Route | Halaman | Role | Deskripsi |
|----|-------|---------|------|-----------|
| 1 | `/` | Landing Page | Public | Informasi produk, fitur, harga, CTA daftar/login |
| 2 | `/login` | Login | Public | Form login multi-role |
| 3 | `/register` | Daftar | Public | Form pendaftaran → redirect WA SuperAdmin |
| 4 | `/forgot-password` | Lupa Password | Public | Form reset password via email |
| 5 | `/reset-password/[token]` | Reset Password | Public | Form input password baru |
| 6 | `/superadmin/dashboard` | Dashboard SuperAdmin | SuperAdmin | Ringkasan seluruh Admin |
| 7 | `/superadmin/admins` | Kelola Admin | SuperAdmin | CRUD Admin + masa aktif |
| 8 | `/superadmin/admins/[id]` | Detail Admin | SuperAdmin | Detail Admin + status WA |
| 9 | `/superadmin/whatsapp` | Pairing WA SuperAdmin | SuperAdmin | QR code pairing WA SuperAdmin |
| 10 | `/superadmin/settings` | Pengaturan Sistem | SuperAdmin | Konfigurasi global |
| 11 | `/superadmin/profile` | Profil SuperAdmin | SuperAdmin | Edit profil & password |
| 12 | `/admin/dashboard` | Dashboard Admin | Admin | Statistik, grafik, ringkasan |
| 13 | `/admin/laundry` | Data Cucian Global | Admin | Semua data cucian + filter |
| 14 | `/admin/laundry/new` | Catat Cucian Baru | Admin | Form input cucian |
| 15 | `/admin/packages` | Kelola Paket | Admin | CRUD paket layanan |
| 16 | `/admin/categories` | Kelola Kategori | Admin | CRUD kategori cucian |
| 17 | `/admin/employees` | Kelola Karyawan | Admin | CRUD karyawan |
| 18 | `/admin/customers` | Kelola Pelanggan | Admin | CRUD pelanggan |
| 19 | `/admin/whatsapp` | Pairing WA Toko | Admin | QR code pairing + template |
| 20 | `/admin/reports` | Laporan & Ekspor | Admin | Ekspor data ke Excel/PDF |
| 21 | `/admin/activity-log` | Log Aktivitas | Admin | Riwayat aksi di sistem |
| 22 | `/admin/settings` | Pengaturan Toko | Admin | Info toko, logo, jam operasional |
| 23 | `/admin/profile` | Profil Admin | Admin | Edit profil & password |
| 24 | `/karyawan/laundry` | Data Cucian | Karyawan | Lihat data cucian toko |
| 25 | `/karyawan/laundry/new` | Catat Cucian Baru | Karyawan | Form input cucian |
| 26 | `/karyawan/profile` | Profil Karyawan | Karyawan | Edit password |

---

## 8. API Endpoints (Backend)

### 8.1 Autentikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login (semua role) |
| POST | `/api/auth/register` | Register calon Admin |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Request reset password |
| POST | `/api/auth/reset-password` | Reset password dengan token |
| GET | `/api/auth/me` | Get current user profile |

### 8.2 SuperAdmin

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/superadmin/dashboard` | Data dashboard SuperAdmin |
| GET | `/api/superadmin/admins` | List semua Admin |
| POST | `/api/superadmin/admins` | Tambah Admin baru |
| GET | `/api/superadmin/admins/:id` | Detail Admin |
| PUT | `/api/superadmin/admins/:id` | Edit Admin |
| DELETE | `/api/superadmin/admins/:id` | Hapus Admin |
| PATCH | `/api/superadmin/admins/:id/extend` | Perpanjang masa aktif |

### 8.3 Admin - Karyawan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/employees` | List karyawan |
| POST | `/api/admin/employees` | Tambah karyawan |
| PUT | `/api/admin/employees/:id` | Edit karyawan |
| DELETE | `/api/admin/employees/:id` | Hapus karyawan |

### 8.4 Admin - Paket & Kategori

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/packages` | List paket |
| POST | `/api/admin/packages` | Tambah paket |
| PUT | `/api/admin/packages/:id` | Edit paket |
| DELETE | `/api/admin/packages/:id` | Hapus paket |
| GET | `/api/admin/categories` | List kategori cucian |
| POST | `/api/admin/categories` | Tambah kategori |
| PUT | `/api/admin/categories/:id` | Edit kategori |
| DELETE | `/api/admin/categories/:id` | Hapus kategori |

### 8.5 Cucian (Laundry Orders)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/laundry` | List cucian (filter: status, tanggal, pelanggan) |
| POST | `/api/laundry` | Catat cucian baru |
| GET | `/api/laundry/:id` | Detail cucian |
| PUT | `/api/laundry/:id` | Edit cucian |
| PATCH | `/api/laundry/:id/status` | Update status cucian |
| PATCH | `/api/laundry/:id/payment` | Update status pembayaran |

### 8.6 Pelanggan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/customers` | List pelanggan |
| POST | `/api/customers` | Tambah pelanggan |
| PUT | `/api/customers/:id` | Edit pelanggan |
| DELETE | `/api/customers/:id` | Hapus pelanggan |
| GET | `/api/customers/:id/history` | Riwayat cucian pelanggan |
| GET | `/api/customers/search?q=` | Autocomplete search pelanggan |

### 8.7 WhatsApp

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/whatsapp/connect` | Inisiasi pairing WA |
| GET | `/api/whatsapp/qr` | Get QR code |
| GET | `/api/whatsapp/status` | Cek status koneksi |
| POST | `/api/whatsapp/disconnect` | Putuskan koneksi WA |
| GET | `/api/whatsapp/templates` | List template pesan |
| POST | `/api/whatsapp/templates` | Buat template baru |
| PUT | `/api/whatsapp/templates/:id` | Edit template |
| DELETE | `/api/whatsapp/templates/:id` | Hapus template |
| POST | `/api/whatsapp/send` | Kirim pesan custom |

### 8.8 Dashboard & Laporan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard/summary` | Summary cards data |
| GET | `/api/dashboard/chart?period=` | Data grafik (harian/bulanan/tahunan) |
| GET | `/api/dashboard/chart/packages` | Data grafik per paket |
| GET | `/api/dashboard/employees-stats` | Statistik karyawan |
| GET | `/api/reports/export?format=` | Ekspor laporan (xlsx/pdf) |

### 8.9 Sistem

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/activity-log` | Log aktivitas |
| GET | `/api/notifications` | Notifikasi in-app |
| PATCH | `/api/notifications/:id/read` | Tandai notifikasi dibaca |
| PUT | `/api/settings/store` | Update pengaturan toko |
| GET | `/api/settings/store` | Get pengaturan toko |
| PUT | `/api/profile` | Update profil user |
| PUT | `/api/profile/password` | Ganti password |

---

## 9. Desain Frontend — Panduan Skill

### Mengacu pada **antigravity-design-expert**:

- **Glassmorphism** pada card, modal, dan sidebar → `backdrop-filter: blur(12px)`, border semi-transparan
- **Elemen mengambang** (floating cards) dengan soft shadow berlapis
- **GSAP ScrollTrigger** untuk animasi masuk halaman landing page
- **Staggered animation** pada grid card dashboard dan tabel data
- **Parallax effect** pada landing page hero section
- **Transisi smooth** pada semua hover, focus, dan state change (min `0.3s ease-out`)
- **`prefers-reduced-motion`** dihormati untuk aksesibilitas

### Mengacu pada **cc-skill-frontend-patterns**:

- **Composition pattern** untuk komponen UI yang modular
- **Custom hooks** (useDebounce, useQuery) untuk data fetching
- **Context + Reducer** untuk state management global
- **React.memo, useMemo, useCallback** untuk performa
- **Lazy loading** untuk chart, tabel besar, dan komponen berat
- **Error Boundary** di setiap section utama
- **Framer Motion** untuk animasi list dan modal
- **Keyboard navigation** dan **focus management** untuk aksesibilitas

### Mengacu pada **cc-skill-coding-standards**:

- **Naming convention** yang jelas dan deskriptif
- **TypeScript strict mode** tanpa `any`
- **Immutability pattern** pada state updates
- **Error handling** komprehensif di setiap API call
- **Zod** untuk input validation
- **JSDoc** untuk public API functions
- **AAA pattern** (Arrange-Act-Assert) untuk testing
- **Early returns** menghindari deep nesting

---

## 10. Non-Functional Requirements

| Aspek | Requirement |
|-------|-------------|
| **Responsif** | Mendukung Desktop, Tablet, dan Mobile (mobile-first approach) |
| **Performa** | First Contentful Paint < 2 detik, Time to Interactive < 3 detik |
| **Keamanan** | JWT auth, bcrypt password hashing, rate limiting, CORS |
| **Caching** | Redis untuk session, dashboard data, dan antrian WA |
| **Notifikasi WA** | Jeda 10 detik antar pengiriman pesan untuk keamanan |
| **Accessibility** | WCAG 2.1 Level AA compliance |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |

---

## 11. Milestone Pengembangan

| Fase | Durasi | Deliverables |
|------|--------|-------------|
| **Fase 1: Foundation** | 2 minggu | Setup project (monorepo), Docker Compose, Prisma schema, auth system, landing page, login/register/forgot password |
| **Fase 2: Core Features** | 3 minggu | CRUD cucian, paket, kategori, karyawan, pelanggan, pengaturan toko, profil user, dashboard basic |
| **Fase 3: WhatsApp Integration** | 2 minggu | Baileys pairing, template pesan, notifikasi otomatis (10s delay queue), autocomplete pelanggan |
| **Fase 4: SuperAdmin** | 1 minggu | Dashboard SuperAdmin, kelola Admin, masa aktif, cron job reminder H-7/H-3/H-1 |
| **Fase 5: Advanced Features** | 2 minggu | Grafik analitik (Chart.js/Recharts), ekspor laporan (Excel/PDF), log aktivitas, cetak nota, notifikasi in-app |
| **Fase 6: Polish & Deploy** | 1 minggu | UI polish (GSAP animations, glassmorphism), responsive testing, Coolify deployment, bug fixing |

---

## 12. Deployment — Coolify (Self-Hosted Server)

### Arsitektur Deployment

```mermaid
graph LR
    subgraph "Coolify - Server Mandiri"
        subgraph "Docker Compose"
            FE["Frontend Container<br/>Next.js :3000"]
            BE["Backend Container<br/>Express :4000"]
            PG[("PostgreSQL :5432")]
            MG[("MongoDB :27017")]
            RD[("Redis :6379")]
        end
        RP["Reverse Proxy<br/>Traefik / Caddy"]
    end

    USER["User Browser"] --> RP
    RP --> FE
    RP --> BE
    BE --> PG
    BE --> MG
    BE --> RD
    FE --> BE
```

### Docker Compose Services

| Service | Image | Port | Volume |
|---------|-------|------|--------|
| `frontend` | Custom (Next.js build) | 3000 | — |
| `backend` | Custom (Node.js build) | 4000 | `./uploads:/app/uploads` |
| `postgres` | `postgres:16-alpine` | 5432 | `pgdata:/var/lib/postgresql/data` |
| `mongodb` | `mongo:7` | 27017 | `mongodata:/data/db` |
| `redis` | `redis:7-alpine` | 6379 | `redisdata:/data` |

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://laundryku:password@postgres:5432/laundryku
MONGODB_URI=mongodb://mongodb:27017/laundryku_wa
REDIS_URL=redis://redis:6379
JWT_SECRET=<random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://laundryku.yourdomain.com
PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=https://api.laundryku.yourdomain.com
```

---

## 13. Prisma Schema Overview (PostgreSQL)

```prisma
// Tabel-tabel utama yang akan dibuat:

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  phone         String?
  role          Role      @default(EMPLOYEE)
  isActive      Boolean   @default(true)
  adminId       String?   // FK ke Admin (untuk Karyawan)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Admin {
  id              String    @id @default(uuid())
  userId          String    @unique
  storeName       String
  storeAddress    String?
  storeLogo       String?
  storePhone      String?
  operatingHours  Json?
  subscriptionEnd DateTime
  isActive        Boolean   @default(true)
}

model LaundryOrder {
  id            String        @id @default(uuid())
  orderNumber   String        @unique
  customerId    String
  employeeId    String
  adminId       String
  status        OrderStatus   @default(RECEIVED)
  paymentStatus PaymentStatus @default(UNPAID)
  totalPrice    Decimal
  notes         String?
  dateIn        DateTime      @default(now())
  estimatedDone DateTime?
  dateOut       DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model LaundryItem {
  id            String   @id @default(uuid())
  orderId       String
  packageId     String
  categoryId    String
  quantity      Decimal
  price         Decimal
  subtotal      Decimal
}

model Package {
  id          String   @id @default(uuid())
  adminId     String
  name        String
  unit        String   // kg, pcs, meter, dll
  price       Decimal
  estimatedDuration Int // dalam jam
  isActive    Boolean  @default(true)
}

model Category {
  id        String   @id @default(uuid())
  adminId   String
  name      String   // Kiloan, Satuan, Bed Cover, dll
  isActive  Boolean  @default(true)
}

model Customer {
  id        String   @id @default(uuid())
  adminId   String
  name      String
  phone     String   // Nomor WhatsApp
  address   String?
}

model ActivityLog {
  id        String   @id @default(uuid())
  userId    String
  action    String
  entity    String
  entityId  String?
  details   Json?
  createdAt DateTime @default(now())
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  message   String
  isRead    Boolean  @default(false)
  type      String
  createdAt DateTime @default(now())
}

enum Role {
  SUPERADMIN
  ADMIN
  EMPLOYEE
}

enum OrderStatus {
  RECEIVED
  IN_PROGRESS
  DONE
  PICKED_UP
}

enum PaymentStatus {
  UNPAID
  PAID
}
```

---

## Verification Plan

### Automated Tests
- `npm run test` — Unit tests (Vitest/Jest) untuk services dan utils
- `npm run test:e2e` — End-to-end tests (Playwright) untuk critical flows
- `npx prisma validate` — Validasi Prisma schema
- `npm run build` — Build check frontend & backend

### Manual Verification
- Test semua 26 halaman di browser (desktop + mobile viewport)
- Test alur cucian end-to-end: input → update status → notifikasi WA
- Test pairing WhatsApp dan kirim pesan
- Test login/logout untuk ketiga role
- Test deployment di Coolify dengan Docker Compose
