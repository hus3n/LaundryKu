# Informasi Port Aplikasi HafalanKu

Dokumen ini mencatat alokasi port yang digunakan oleh layanan frontend, backend, database, dan service pendukung aplikasi **HafalanKu**.

---

## 🚀 Ringkasan Alokasi Port

| Service / Komponen | Port | Protokol / URL Default | Deskripsi & Fungsi |
| :--- | :---: | :--- | :--- |
| **Frontend** | `3000` | `http://localhost:3000` | Antarmuka Pengguna (Next.js 16 + React 19) |
| **Backend API** | `4000` | `http://localhost:4000/api/v1` | Server Utama REST API (Fastify + TypeScript) |
| **PostgreSQL** | `5432` | `postgresql://localhost:5432/hafalanku` | Relational DB Utama (Prisma ORM) |
| **MongoDB** | `27017` | `mongodb://localhost:27017/hafalanku` | NoSQL DB untuk Log Audit & Metrik |
| **Redis** | `6379` | `redis://localhost:6379` | In-Memory Cache untuk Dashboard & Rate Limiting |
| **WhatsApp Gateway** | `8000` | `http://localhost:8000` | Gateway Pengiriman Pesan & Notifikasi WA (Opsional) |

---

## 🛠️ Detail Konfigurasi Environment Variable

### 1. Frontend (`frontend/.env` / `environment`)
- `PORT`: `3000`
- `NEXT_PUBLIC_API_URL`: `http://localhost:4000/api/v1`

### 2. Backend (`backend/.env` / `environment`)
- `BACKEND_PORT`: `4000`
- `FRONTEND_URL`: `http://localhost:3000`
- `DATABASE_URL`: `postgresql://hafalanku_user:P@ssw0rdHafalanKu2026!@localhost:5432/hafalanku?schema=public`
- `MONGODB_URL`: `mongodb://localhost:27017/hafalanku`
- `REDIS_URL`: `redis://localhost:6379`
- `WA_GATEWAY_URL`: `http://localhost:8000`

---

## 🐳 Mapping Port Docker Compose (`docker-compose.coolify.yaml`)

```yaml
services:
  frontend:
    ports:
      - "3000:3000"

  backend:
    ports:
      - "4000:4000"

  hafalanku-postgres:
    # Port 5432 (Internal Container Service)

  hafalanku-mongo:
    # Port 27017 (Internal Container Service)

  hafalanku-redis:
    # Port 6379 (Internal Container Service)
```
