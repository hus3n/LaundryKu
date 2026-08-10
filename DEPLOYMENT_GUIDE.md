# 📘 Panduan Lengkap Jalankan & Deploy LaundryKu v1.0

Dokumen ini berisi panduan langkah-demi-langkah yang sangat detail dan lengkap untuk **menjalankan aplikasi secara lokal** dan **melakukan deployment ke VPS Server Mandiri menggunakan Coolify**.

---

## 🛠️ BAGIAN 1: CARA MENJALANKAN DI KOMPUTER LOKAL

### Metode A: Tanpa Docker (Menggunakan Node.js & SQLite)

Metode ini cocok untuk pengujian cepat di Windows tanpa perlu menginstall Docker Desktop.

#### 1. Persiapan Backend API
Buka Terminal / PowerShell di folder project:
```powershell
cd backend

# 1. Install dependencies
npm install

# 2. Inisialisasi Database SQLite Lokal
npm run prisma:dev:push

# 3. Seed Akun SuperAdmin Pertama
npm run prisma:seed

# 4. Jalankan Server Backend API
npm run dev
```
- **Backend API**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

#### 2. Persiapan Frontend Web App
Buka Terminal baru:
```powershell
cd frontend

# 1. Install dependencies
npm install

# 2. Jalankan Next.js Web App
npm run dev
```
- **Aplikasi Web**: `http://localhost:3001`

---

### Metode B: Menggunakan Docker Desktop (Komplit dengan Postgres, MongoDB, Redis)

Jika komputer Anda memiliki Docker Desktop:
```powershell
# 1. Jalankan semua kontainer database
docker-compose up -d

# 2. Inisialisasi Database PostgreSQL
cd backend
npx prisma db push
npx prisma db seed
npm run dev

# 3. Jalankan Frontend
cd ../frontend
npm run dev
```

---

## 🔑 Kredensial Login Default (Semua Mode)

- **Role**: SuperAdmin (Platform Manager)
- **URL Login**: `http://localhost:3001/login`
- **Email**: `superadmin@laundryku.com`
- **Password**: `SuperAdmin@2026`

### ⚙️ Cara Mengubah Kredensial SuperAdmin Pertama:
Jika Anda ingin mengubah email, nama, atau password default SuperAdmin:

1. **Ubah file `backend/.env`**:
   ```env
   SUPERADMIN_EMAIL=email_baru_anda@domain.com
   SUPERADMIN_PASSWORD=PasswordBaruAnda123!
   SUPERADMIN_NAME=Nama Super Admin Baru
   ```
2. **Atau Ubah Fallback di `backend/prisma/seed.ts`**:
   ```typescript
   const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'email_baru_anda@domain.com';
   const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'PasswordBaruAnda123!';
   ```
3. **Jalankan Seed Ulang**:
   ```powershell
   cd backend
   npm run prisma:seed
   ```

---

## 🚀 BAGIAN 2: PANDUAN DEPLOY LENGKAP KE VPS SERVER MANDIRI (COOLIFY)

**Coolify** adalah PaaS open-source (seperti Vercel / Heroku versi self-hosted) yang berjalan di VPS milik sendiri. Mengelola kontainer, domain SSL, database, dan auto-deploy dari Git secara otomatis.

### Spesifikasi VPS yang Direkomendasikan
- **OS**: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS (64-bit)
- **RAM**: Minimal 2 GB (Rekomendasi 4 GB untuk performa maksimal)
- **CPU**: 2 vCPU
- **Disk**: 30 GB SSD

---

### Langkah 1: Install Coolify di VPS Ubuntu

1. SSH masuk ke VPS Anda:
   ```bash
   ssh root@ip_vps_anda
   ```

2. Jalankan perintah instalasi resmi Coolify (1 baris):
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

3. Setelah selesai (sekitar 2-3 menit), buka Dashboard Coolify di browser:
   `http://ip_vps_anda:8000`

4. Buat akun administrator Coolify pertama Anda.

---

### Langkah 2: Pengaturan Domain & DNS

Di dashboard penyedia domain Anda (Cloudflare, Namecheap, Niagahoster, dll), tambahkan 2 buah **A Record**:

| Type | Name | Target / Content | Description |
|------|------|------------------|-------------|
| `A` | `laundryku` | `IP_VPS_ANDA` | Domain Aplikasi Frontend (contoh: `laundryku.domainanda.com`) |
| `A` | `api-laundryku` | `IP_VPS_ANDA` | Domain API Gateway Backend (contoh: `api-laundryku.domainanda.com`) |

---

### Langkah 3: Menghubungkan Repository Git ke Coolify

1. Push seluruh folder project `webapp-laundry` ini ke repository **GitHub** atau **GitLab** Anda (Public / Private).
2. Di Dashboard Coolify:
   - Klik **Projects** → **Default** → **Production**
   - Klik **+ New** → Pilih **Public Repository** atau **Private Repository (GitHub App)**.
   - Paste URL repository GitHub Anda: `https://github.com/username/webapp-laundry`
   - Pada pilihan Build Pack, pilih **Docker Compose**.
   - Set **Docker Compose Location**: `docker-compose.prod.yml`

---

### Langkah 4: Konfigurasi Environment Variables di Coolify

Di menu **Environment Variables** pada aplikasi Coolify, masukkan variabel berikut:

```env
# 1. Database Passwords & Secrets
POSTGRES_PASSWORD=BuatPasswordDatabaseYangSangatAman2026!
JWT_SECRET=BuatJWTSecretKeySangatPanjangDanAman2026!

# 2. URLs Domain
FRONTEND_URL=https://laundryku.domainanda.com
NEXT_PUBLIC_API_URL=https://api-laundryku.domainanda.com/api
```

---

### Langkah 5: Hubungkan Domain & Aktifkan SSL Auto-Renew

1. Pada service **Frontend** di Coolify:
   - Set **FQDN / Custom Domain**: `https://laundryku.domainanda.com`
   - Port: `3001`

2. Pada service **Backend** di Coolify:
   - Set **FQDN / Custom Domain**: `https://api-laundryku.domainanda.com`
   - Port: `4000`

*Coolify akan otomatis menerbitkan sertifikat **SSL Let's Encrypt (HTTPS)** gratis dan memperbaruinya secara otomatis.*

---

### Langkah 6: Deploy & Inisialisasi Database Pertama Kali

1. Klik tombol **Deploy** di Coolify.
2. Coolify akan melakukan *multi-stage build* untuk Frontend & Backend secara otomatis.
3. Setelah status aplikasi **Healthy / Running**, buka terminal di Coolify (atau via SSH) untuk melakukan migrasi & seed database pertama:
   ```bash
   docker exec -it laundryku-backend npx prisma db push
   docker exec -it laundryku-backend npx prisma db seed
   ```

🎉 **Selamat! Aplikasi LaundryKu v1.0 kini sudah aktif secara live di server mandiri Anda!**

- **Frontend App**: `https://laundryku.domainanda.com`
- **Backend API**: `https://api-laundryku.domainanda.com/health`
