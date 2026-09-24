---
slug: optimize-laundryku-ux
status: approved
intent: clear
review_required: false
---

# Plan: optimize-laundryku-ux

## Context & Approach
1. **Cronjob Anti-Cold Start (Internal Backend):**
   - Kita akan menambahkan sebuah *cronjob* internal (berbasis `node-cron`) di dalam backend LaundryKu (`backend/src/jobs/keepAliveCron.ts`).
   - Cron ini akan berjalan setiap 5 menit untuk melakukan ping (HTTP GET) ke URL publik website (`https://laundryku.forapp.id`) sekaligus melakukan satu kueri ringan ke database (`prisma.$queryRaw`).
   - Ini memastikan Traefik Reverse Proxy Coolify, Server Next.js, dan koneksi *Pool* PostgreSQL tidak pernah memasuki fase istirahat (idle).

2. **Perbaikan UI Tombol Download:**
   - Kita akan merombak total komponen `frontend/src/app/components/DownloadAppButton.tsx`.
   - Menambahkan efek animasi sentuhan premium menggunakan `framer-motion` (sudah terinstal di project).
   - Memperbaiki desain *banner* agar tidak terlihat asal tempel (menggunakan gaya desain *modern app promo card*, memadukan warna *Orient Dark* dan *Curious Blue* khas LaundryKu dengan bayangan yang elegan).

## Todos

- [ ] 1. Create `backend/src/jobs/keepAliveCron.ts`: configure node-cron to run every 5 minutes, fetch 'https://laundryku.forapp.id', and run `prisma.$queryRaw\`SELECT 1\``.
- [ ] 2. Update `backend/src/app.ts`: import and initialize the keepAliveCron alongside existing cronjobs.
- [ ] 3. Refactor `frontend/src/app/components/DownloadAppButton.tsx`: redesign UI using `framer-motion` for premium feel, use Orient Dark & Curious Blue colors, improve banner layout into a modern app promo card.

## Final verification wave

- [ ] F1. Plan compliance audit: verify keepAliveCron exists and is registered, and DownloadAppButton uses framer-motion.
- [ ] F2. Code quality review: check for any `any` types or ts errors in both frontend and backend.
- [ ] F3. Manual QA & Scope Fidelity: ensure the backend still compiles successfully and the UI components don't break the frontend layout.
