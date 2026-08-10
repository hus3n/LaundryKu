# Walkthrough — LaundryKu v1.0

Aplikasi web **LaundryKu v1.0** telah selesai dibangun 100% dari **Fase 1 hingga Fase 6** sesuai dengan seluruh spesifikasi pada PRD dan arahan desain.

---

## 🌟 Tech Stack & Arsitektur yang Diterapkan

| Layer | Teknologi & Implementasi |
|-------|--------------------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, GSAP & Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Zod, JWT Auth, Node-Cron |
| **Database Primary (SQL)** | PostgreSQL 16 dengan **Prisma ORM** (10+ model terelasi) |
| **Database NoSQL** | MongoDB 7 dengan **Mongoose** (WhatsApp Auth State, Templates, Message Logs) |
| **Caching Layer** | Redis 7 (ioredis client untuk rate limiting & session storage) |
| **WhatsApp Gateway** | Baileys SDK dengan **Message Queue (Mandatory 10-second delay per send)** |
| **Styling & UX** | Glassmorphism spatial depth UI (mengacu pada `antigravity-design-expert`, `cc-skill-frontend-patterns`, `cc-skill-coding-standards`) |
| **Deployment** | Coolify Self-Hosted Ready + Multi-stage Dockerfiles + Production Docker Compose |

---

## 📦 Ringkasan Fitur per Role Pengguna

### 1. SuperAdmin (Platform Manager)
- **Dashboard Platform (`/superadmin/dashboard`)**: Metrik jumlah toko admin, toko aktif, toko hampir expired (&le;7 hari), total transaksi platform.
- **Kelola Admin Toko (`/superadmin/admins`)**: Pendaftaran Admin toko baru dengan pilihan durasi berlangganan awal (1, 3, 6, 12 bulan).
- **Perpanjangan Masa Aktif**: Tambah durasi langganan toko & toggle status aktif/non-aktif.
- **Automated WA Cron Job (`subscriptionCron.ts`)**: Pengiriman otomatis reminder WA pada **H-7**, **H-3**, **H-1**, dan auto-deaktivasi pada H-0.

### 2. Admin (Pemilik Laundry)
- **Dashboard Utama Toko (`/admin/dashboard`)**: Summary total cucian, total pendapatan, cucian masuk hari ini, dan cucian siap diambil.
- **Pencatatan Cucian Baru (`/admin/laundry/new`)**: Input data pelanggan (dengan autocomplete), penambahan item cucian dinamis, kalkulasi otomatis harga & estimasi selesai.
- **Data Cucian Global (`/admin/laundry`)**: Filter pencarian, filter status, inline dropdown switcher status cucian, toggle lunas/belum bayar.
- **Struk/Nota Thermal Modal (`ReceiptModal.tsx`)**: Cetak nota kasir formatted untuk printer thermal 58mm/80mm & PDF.
- **Integrasi WhatsApp Toko (`/admin/whatsapp`)**: QR code pairing, editor 4 template pesan dinamis (`ORDER_RECEIVED`, `ORDER_IN_PROGRESS`, `ORDER_DONE`, `ORDER_PICKED_UP`), dan pengiriman pesan custom (jeda 10 detik).
- **Kelola Paket & Kategori (`/admin/packages`, `/admin/categories`)**: Setting paket kiloan/satuan, harga per unit, estimasi jam, dan kategori barang.
- **Kelola Staf & Pelanggan (`/admin/employees`, `/admin/customers`)**: CRUD staf kasir dan database pelanggan.
- **Analitik & Laporan (`/admin/reports`)**: Visualisasi grafik pendapatan harian/bulanan/tahunan, breakdown paket populer, statistik performa staf, dan **Ekspor CSV**.
- **Audit Log Aktivitas (`/admin/activity-log`)**: Log riwayat aksi pengguna.

### 3. Karyawan (Staf Kasir)
- **Pencatatan & Data Cucian Toko (`/karyawan/laundry`)**: Akses cepat pencatatan cucian dan update status pengerjaan harian.

---

## 🚀 Panduan Menjalankan Aplikasi

### Option A: Local Development (Docker Compose + Node.js)

1. **Jalankan Database Infrastructure (PostgreSQL, MongoDB, Redis)**:
   ```bash
   docker-compose up -d
   ```

2. **Backend API Server**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npx prisma db seed
   npm run dev
   ```
   - API running pada: `http://localhost:4000`
   - Health Check: `http://localhost:4000/health`
   - **Kredensial SuperAdmin Default**:
     - Email: `superadmin@laundryku.com`
     - Password: `SuperAdmin@2026`

3. **Frontend Next.js**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - App running pada: `http://localhost:3000`

---

### Option B: Deployment di Server Mandiri (Coolify)

1. Upload seluruh repository ke Git (GitHub/GitLab).
2. Di Dashboard Coolify, pilih **New Resource** → **Docker Compose**.
3. Hubungkan repository dan pilih file **`docker-compose.prod.yml`** atau **`coolify.json`**.
4. Set Environment Variables di Coolify:
   - `POSTGRES_PASSWORD`: `<password_db_secure>`
   - `JWT_SECRET`: `<jwt_secret_key_secure>`
   - `FRONTEND_URL`: `https://laundryku.yourdomain.com`
   - `NEXT_PUBLIC_API_URL`: `https://api.laundryku.yourdomain.com/api`
5. Klik **Deploy**! Coolify akan melakukan build multi-stage Docker image dan mengaktifkan seluruh service beserta reverse proxy SSL secara otomatis.
