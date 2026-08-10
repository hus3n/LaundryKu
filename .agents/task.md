# LaundryKu v1.0 — Task List

## Fase 1: Foundation
- [x] Setup project structure (monorepo: frontend/ + backend/)
- [x] Docker Compose (PostgreSQL, MongoDB, Redis)
- [x] Backend: Express + TypeScript + Prisma setup
  - [x] Prisma schema (semua model)
  - [x] Database seed (SuperAdmin)
  - [x] Config files (database, redis, mongodb, env validation)
  - [x] Middleware (auth JWT, RBAC, validation, rate limiter, error handler)
  - [x] Auth routes & controllers (login, register-request, forgot/reset password, me)
- [x] Frontend: Next.js + Tailwind CSS setup
  - [x] Tailwind config + global styles (glassmorphism theme)
  - [x] Auth context & hooks (useAuth, API client)
- [x] Landing Page (hero, fitur, 3D cards, CTA WhatsApp auto-redirect)
- [x] Auth Pages (Login multi-role, Forgot Password)

## Fase 2: Core Features
- [x] CRUD Cucian (LaundryOrder + LaundryItem)
- [x] CRUD Paket (Package CRUD)
- [x] CRUD Kategori Cucian (Category CRUD)
- [x] CRUD Karyawan (Employee CRUD)
- [x] CRUD Pelanggan + Autocomplete
- [x] Pengaturan Toko (Store Settings)
- [x] Dashboard Layout & Admin Dashboard
- [x] Global Laundry List + Status & Payment Update

## Fase 3: WhatsApp Integration
- [x] Baileys client setup & QR pairing simulator (`backend/src/whatsapp/baileys.ts`)
- [x] Message queue dengan jeda wajib 10 detik (`backend/src/whatsapp/messageQueue.ts`)
- [x] Mongoose NoSQL models (`WASession`, `WATemplate`, `WAMessageLog`)
- [x] Template pesan CRUD dengan variabel dinamis (`ORDER_RECEIVED`, `ORDER_IN_PROGRESS`, `ORDER_DONE`, `ORDER_PICKED_UP`)
- [x] Notifikasi otomatis pada pencatatan & update status cucian
- [x] Halaman Frontend Pairing WA & Editor Template (`src/app/admin/whatsapp/page.tsx`)

## Fase 4: SuperAdmin
- [x] Dashboard SuperAdmin (`src/app/superadmin/dashboard/page.tsx`)
- [x] Kelola Admin Toko CRUD (`src/app/superadmin/admins/page.tsx`)
- [x] Perpanjang masa aktif (durasi 1, 3, 6, 12 bulan)
- [x] Cron job harian reminder WA (H-7, H-3, H-1) & auto-deaktivasi akun expired (`backend/src/jobs/subscriptionCron.ts`)
- [x] SuperAdmin WA pairing route (`src/app/superadmin/whatsapp/page.tsx`)

## Fase 5: Advanced Features
- [x] Grafik analitik (CSS Bar Chart) — harian/bulanan/tahunan + per paket (`src/app/admin/reports/page.tsx`)
- [x] Statistik karyawan (`backend/src/services/analytics.service.ts`)
- [x] Ekspor laporan (CSV / Excel format)
- [x] Log aktivitas (`src/app/admin/activity-log/page.tsx`)
- [x] Cetak thermal nota/struk modal (`src/components/ui/ReceiptModal.tsx`)

## Fase 6: Polish & Deploy
- [x] Glassmorphism theme polish & responsive layout (`globals.css`, `tailwind.config.ts`)
- [x] Responsive testing across mobile, tablet, and desktop viewports
- [x] Multi-stage Dockerfile Backend (`backend/Dockerfile`)
- [x] Multi-stage Dockerfile Frontend (`frontend/Dockerfile`)
- [x] Production Docker Compose (`docker-compose.prod.yml`)
- [x] Coolify deployment configuration (`coolify.json`)
