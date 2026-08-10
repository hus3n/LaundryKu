# Task List: Implementasi Fitur Trial Akun Admin

> **Referensi PRD**: `.agents/PRD-fitur-trial-admin.md`
> **Stack**: TypeScript · Prisma · PostgreSQL · Express · Next.js · node-cron · Baileys WA

---

## ATURAN PENTING SEBELUM MULAI

1. **Jangan ubah file lain** selain yang disebutkan di setiap task.
2. **Urutan task wajib diikuti** — setiap tahap bergantung pada tahap sebelumnya.
3. Setelah selesai tiap fase, **jalankan perintah verifikasi** yang tertulis.
4. Semua kode ditulis dalam **TypeScript**.
5. Import selalu pakai ekstensi `.js` (ES Module): `import { x } from '../config/y.js'`

---

## RINGKASAN FILE

| Status | File | Keterangan |
|---|---|---|
| BARU | `backend/src/jobs/trialExpiry.job.ts` | 3 cron job trial |
| BARU | `frontend/src/components/ui/CreateTrialModal.tsx` | Modal form buat trial |
| DIUBAH | `backend/prisma/schema.prisma` | +4 field di model Admin |
| DIUBAH | `backend/.env` | +2 env variable |
| DIUBAH | `backend/src/config/env.ts` | +2 field schema validation |
| DIUBAH | `backend/src/services/superadmin.service.ts` | +3 fungsi service trial |
| DIUBAH | `backend/src/controllers/superadmin.controller.ts` | +1 fungsi handler + import |
| DIUBAH | `backend/src/routes/superadmin.routes.ts` | +1 schema + 1 route |
| DIUBAH | `backend/src/app.ts` | Daftarkan cron jobs |
| DIUBAH | `frontend/src/app/superadmin/admins/page.tsx` | Integrasi modal + badge TRIAL |

---

## FASE 1 — DATABASE SCHEMA

### TASK 1.1 — Tambah 4 Field Baru di Prisma Schema

**File**: `backend/prisma/schema.prisma`

**Lokasi**: Cari baris `isActive Boolean @default(true)` di `model Admin {}` (baris 59).
Sisipkan 4 baris baru SETELAH baris tersebut:

```
  isTrial          Boolean   @default(false)
  trialDays        Int?
  isDeleted        Boolean   @default(false)
  deletedAt        DateTime?
```

**Verifikasi**:
```
cd backend
npx prisma db push
```
Output sukses: `Your database is now in sync with your Prisma schema.`

---

### TASK 1.2 — Tambah Environment Variable

**File**: `backend/.env`

Tambahkan di AKHIR file:
```
SUPERADMIN_WA_NUMBER=6285229925593
APP_URL=http://localhost:3000
```

---

### TASK 1.3 — Validasi Env TypeScript

**File**: `backend/src/config/env.ts`

Sisipkan 2 baris SETELAH `SMTP_FROM: z.string().optional(),` (baris 23):
```
  SUPERADMIN_WA_NUMBER: z.string().default('6285229925593'),
  APP_URL: z.string().default('http://localhost:3000'),
```

---

## FASE 2 — BACKEND SERVICE

### TASK 2.1 — Tambah Fungsi `createTrialAdmin`

**File**: `backend/src/services/superadmin.service.ts`

Tambahkan fungsi ini DI BAWAH fungsi `createAdminWithStore` (sekitar baris 136):

```typescript
export async function createTrialAdmin(data: {
  storeName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  trialDays: 3 | 5 | 7;
  storeAddress?: string;
}) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error('Email pengelola sudah terdaftar.');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const subscriptionEnd = new Date();
  subscriptionEnd.setDate(subscriptionEnd.getDate() + data.trialDays);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: 'ADMIN' as any,
        isActive: true,
      },
    });
    const admin = await tx.admin.create({
      data: {
        userId: user.id,
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storePhone: data.phone,
        subscriptionEnd,
        isActive: true,
        isTrial: true,
        trialDays: data.trialDays,
      },
    });
    return { user, admin };
  });
}
```

---

### TASK 2.2 — Tambah Fungsi Cleanup Trial

**File**: `backend/src/services/superadmin.service.ts`

Tambahkan DI BAWAH fungsi `createTrialAdmin`:

```typescript
export async function cleanupExpiredTrials() {
  const now = new Date();
  const expiredTrials = await prisma.admin.findMany({
    where: {
      isTrial: true,
      isDeleted: false,
      isActive: true,
      subscriptionEnd: { lte: now },
    },
    include: { user: true },
  });

  const results = [];
  for (const admin of expiredTrials) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: admin.userId }, data: { isActive: false } });
      await tx.admin.update({
        where: { id: admin.id },
        data: { isActive: false, isDeleted: true, deletedAt: now },
      });
    });
    results.push({
      adminId: admin.id,
      storeName: admin.storeName,
      phone: admin.user?.phone,
      name: admin.user?.name,
    });
  }
  return results;
}

export async function hardDeleteExpiredTrials() {
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const toDelete = await prisma.admin.findMany({
    where: {
      isTrial: true,
      isDeleted: true,
      deletedAt: { lte: cutoffTime },
    },
    include: { user: true },
  });
  for (const admin of toDelete) {
    await prisma.$transaction(async (tx) => {
      await tx.admin.delete({ where: { id: admin.id } });
      await tx.user.delete({ where: { id: admin.userId } });
    });
  }
  return toDelete.length;
}
```

---

## FASE 3 — BACKEND CONTROLLER

### TASK 3.1 — Update `superadmin.controller.ts`

**File**: `backend/src/controllers/superadmin.controller.ts`

**Langkah 1** — Tambah `createTrialAdmin` ke import service (baris 3-10):
```typescript
import {
  getSuperAdminDashboardData,
  getAllAdmins,
  createAdminWithStore,
  createTrialAdmin,          // TAMBAHKAN INI
  extendAdminSubscription,
  toggleAdminStatus,
  deleteAdmin,
} from '../services/superadmin.service.js';
```

**Langkah 2** — Tambah 2 import baru setelah semua import:
```typescript
import { waQueue } from '../whatsapp/messageQueue.js';
import { env } from '../config/env.js';
```

**Langkah 3** — Tambah fungsi di AKHIR FILE (setelah `removeAdmin`):
```typescript
export async function createTrial(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await createTrialAdmin(req.body);
    const { user, admin } = result;
    const trialDays: number = req.body.trialDays;

    const expiredDate = new Date(admin.subscriptionEnd).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    if (user.phone) {
      waQueue.enqueue({
        adminId: admin.id,
        recipientPhone: user.phone,
        recipientName: user.name,
        message: `Selamat Datang di LaundryKu!\n\nHalo Kak ${user.name}, akun trial toko *${admin.storeName}* berhasil dibuat!\n\nEmail: ${user.email}\nMasa Trial: ${trialDays} hari (hingga ${expiredDate})\nLink: ${env.APP_URL}\n\nHubungi SuperAdmin: wa.me/${env.SUPERADMIN_WA_NUMBER}`,
      });
    }

    res.status(201).json({
      success: true,
      message: `Akun trial ${trialDays} hari untuk toko "${admin.storeName}" berhasil dibuat.`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
```

---

## FASE 4 — BACKEND ROUTE

### TASK 4.1 — Tambah Route `/admins/trial`

**File**: `backend/src/routes/superadmin.routes.ts`

**Langkah 1** — Tambah `createTrial` ke import controller:
```typescript
import {
  getDashboard,
  getAdmins,
  addAdmin,
  createTrial,          // TAMBAHKAN INI
  extendSubscription,
  toggleStatus,
  removeAdmin,
} from '../controllers/superadmin.controller.js';
```

**Langkah 2** — Tambah schema baru SETELAH `extendSchema`:
```typescript
const createTrialSchema = z.object({
  body: z.object({
    storeName:    z.string().min(2),
    name:         z.string().min(2),
    email:        z.string().email(),
    password:     z.string().min(6),
    phone:        z.string().min(6),
    trialDays:    z.coerce.number().refine((v) => [3, 5, 7].includes(v), {
      message: 'Durasi trial hanya boleh 3, 5, atau 7 hari',
    }),
    storeAddress: z.string().optional().nullable(),
  }),
});
```

**Langkah 3** — Tambah route. WAJIB diletakkan SEBELUM route `/:id` agar Express tidak salah parsing!

Urutan route yang benar:
```typescript
router.get('/dashboard', getDashboard);
router.get('/admins', getAdmins);
router.post('/admins', validate(createAdminSchema), addAdmin);
router.post('/admins/trial', validate(createTrialSchema), createTrial);  // <-- BARU
router.patch('/admins/:id/extend', validate(extendSchema), extendSubscription);
router.patch('/admins/:id/toggle-status', validate(toggleSchema), toggleStatus);
router.delete('/admins/:id', removeAdmin);
```

---

## FASE 5 — CRON JOB

### TASK 5.1 — Buat File Baru `trialExpiry.job.ts`

**File**: `backend/src/jobs/trialExpiry.job.ts` (FILE BARU)

Buat file baru dan isi dengan kode berikut:

```typescript
import cron from 'node-cron';
import { prisma } from '../config/database.js';
import { waQueue } from '../whatsapp/messageQueue.js';
import { env } from '../config/env.js';
import { cleanupExpiredTrials, hardDeleteExpiredTrials } from '../services/superadmin.service.js';

function getRemainingDays(subscriptionEnd: Date): number {
  const now = new Date();
  return Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Cron 1: Kirim WA reminder (setiap hari pukul 09:00)
function initTrialReminderCron() {
  cron.schedule('0 9 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron reminder trial...');
    try {
      const now = new Date();
      const trialAdmins = await prisma.admin.findMany({
        where: { isTrial: true, isActive: true, isDeleted: false, subscriptionEnd: { gt: now } },
        include: { user: true },
      });

      for (const admin of trialAdmins) {
        const remainingDays = getRemainingDays(new Date(admin.subscriptionEnd));
        const phone = admin.user?.phone;
        const name = admin.user?.name || admin.storeName;

        // Hanya kirim di hari ke-7, 3, dan 1 sisa
        if (!phone || ![7, 3, 1].includes(remainingDays)) continue;

        waQueue.enqueue({
          adminId: admin.id,
          recipientPhone: phone,
          recipientName: name,
          message: `Halo Kak ${name} (${admin.storeName}),\n\nMasa TRIAL LaundryKu Anda berakhir dalam *${remainingDays} hari* (${formatDate(new Date(admin.subscriptionEnd))}).\n\nHubungi SuperAdmin untuk berlangganan:\nwa.me/${env.SUPERADMIN_WA_NUMBER}`,
        });
        console.log(`[TRIAL] Reminder ${remainingDays} hari dikirim ke ${name}`);
      }
    } catch (error) {
      console.error('[TRIAL] Error cron reminder:', error);
    }
  });
  console.log('[TRIAL] Cron reminder diinisialisasi (09:00)');
}

// Cron 2: Kunci dan soft-delete trial expired (setiap hari pukul 00:01)
function initTrialCleanupCron() {
  cron.schedule('1 0 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron cleanup trial expired...');
    try {
      const lockedAccounts = await cleanupExpiredTrials();
      for (const account of lockedAccounts) {
        if (!account.phone) continue;
        waQueue.enqueue({
          adminId: account.adminId,
          recipientPhone: account.phone,
          recipientName: account.name || '',
          message: `Halo Kak ${account.name},\n\nMasa TRIAL LaundryKu Anda telah BERAKHIR.\nAkun dikunci sementara. Data aman 24 jam ke depan.\n\nHubungi SuperAdmin:\nwa.me/${env.SUPERADMIN_WA_NUMBER}`,
        });
        console.log(`[TRIAL] Akun dikunci: ${account.storeName}`);
      }
    } catch (error) {
      console.error('[TRIAL] Error cron cleanup:', error);
    }
  });
  console.log('[TRIAL] Cron cleanup diinisialisasi (00:01)');
}

// Cron 3: Hard-delete setelah 24 jam (setiap hari pukul 00:30)
function initTrialHardDeleteCron() {
  cron.schedule('30 0 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron hard-delete trial...');
    try {
      const count = await hardDeleteExpiredTrials();
      console.log(`[TRIAL] Hard-delete selesai: ${count} akun dihapus permanen.`);
    } catch (error) {
      console.error('[TRIAL] Error cron hard-delete:', error);
    }
  });
  console.log('[TRIAL] Cron hard-delete diinisialisasi (00:30)');
}

// Fungsi utama — dipanggil dari app.ts
export function initTrialCronJobs() {
  initTrialReminderCron();
  initTrialCleanupCron();
  initTrialHardDeleteCron();
}
```

---

### TASK 5.2 — Daftarkan Cron di `app.ts`

**File**: `backend/src/app.ts`

**Langkah 1** — Tambah import SETELAH `import { startBackupCron }...` (baris 8):
```typescript
import { initTrialCronJobs } from './jobs/trialExpiry.job.js';
```

**Langkah 2** — Di dalam `startServer()`, tambahkan SETELAH `startBackupCron();`:
```typescript
initTrialCronJobs();
```

**Verifikasi**:
```
cd backend && npm run dev
```
Harus muncul 3 baris:
```
[TRIAL] Cron reminder diinisialisasi (09:00)
[TRIAL] Cron cleanup diinisialisasi (00:01)
[TRIAL] Cron hard-delete diinisialisasi (00:30)
```

---

## FASE 7 — FRONTEND KOMPONEN MODAL

### TASK 7.1 — Buat `CreateTrialModal.tsx`

**File**: `frontend/src/components/ui/CreateTrialModal.tsx` (FILE BARU)

Buat file baru dan isi dengan kode berikut:

```tsx
'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { X, Clock, Zap } from 'lucide-react';

interface CreateTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTrialModal({ isOpen, onClose, onSuccess }: CreateTrialModalProps) {
  const [storeName, setStoreName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [trialDays, setTrialDays] = useState<3 | 5 | 7>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setStoreName(''); setName(''); setEmail('');
    setPassword(''); setPhone('');
    setTrialDays(7); setErrorMsg(null);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await api.post('/superadmin/admins/trial', {
        storeName, name, email, password, phone,
        trialDays: Number(trialDays),
      });
      resetForm(); onSuccess(); onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Gagal membuat akun trial');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card-dark p-6 rounded-3xl border border-amber-500/30 max-w-md w-full space-y-5 shadow-2xl shadow-amber-500/10">

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 uppercase tracking-wider">
                TRIAL
              </span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">Buat Akun Trial Admin</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tidak memerlukan pembayaran dimuka</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Toko Laundry <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Bersih Jaya Laundry"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Pemilik / Admin <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bpk. Hendra"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Login <span className="text-rose-400">*</span>
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hendra@laundry.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              No. WhatsApp Pemilik <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500/60 transition-colors"
            />
            <p className="text-[10px] text-slate-500 mt-1">Digunakan untuk notifikasi WhatsApp otomatis</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Durasi Trial <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 5, 7] as const).map((days) => (
                <button key={days} type="button" onClick={() => setTrialDays(days)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    trialDays === days
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
            {trialDays === 7 && (
              <p className="text-[10px] text-amber-400/70 mt-1.5">Disarankan: 7 hari untuk pengalaman trial terbaik</p>
            )}
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-2">
              {isSubmitting ? (
                <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Membuat...</>
              ) : (
                <><Zap className="w-3.5 h-3.5" />Buat Akun Trial</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## FASE 8 — FRONTEND HALAMAN ADMINS

### TASK 8.1 — 6 Perubahan di `admins/page.tsx`

**File**: `frontend/src/app/superadmin/admins/page.tsx`

**Perubahan 1** — Tambah import `CreateTrialModal` (setelah baris import `ConfirmModal`):
```tsx
import CreateTrialModal from '@/components/ui/CreateTrialModal';
```

**Perubahan 2** — Tambah `Zap` ke import lucide-react (baris 8).
Cari: `... RefreshCw } from 'lucide-react';`
Ganti: `... RefreshCw, Zap } from 'lucide-react';`

**Perubahan 3** — Tambah state modal trial SETELAH baris `const [isSubmitting, setIsSubmitting] = useState(false);` (baris 33):
```tsx
const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
```

**Perubahan 4** — Ganti tombol header menjadi 2 tombol.

Cari (baris 131-137):
```tsx
<button onClick={handleOpenCreate} className="...">
  <Plus className="w-4 h-4" />
  Daftarkan Admin Toko Baru
</button>
```

Ganti dengan:
```tsx
<div className="flex items-center gap-3">
  <button
    onClick={() => setIsTrialModalOpen(true)}
    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
  >
    <Zap className="w-4 h-4" />
    Buat Akun Trial
  </button>
  <button
    onClick={handleOpenCreate}
    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
  >
    <Plus className="w-4 h-4" />
    Daftarkan Admin Toko Baru
  </button>
</div>
```

**Perubahan 5** — Tambah badge TRIAL di kolom nama toko.

Cari (baris 167-170):
```tsx
<td className="py-4 px-4">
  <div className="font-bold text-white text-sm">{admin.storeName}</div>
  <div className="text-[11px] text-slate-400">Pemilik: {admin.user?.name}</div>
</td>
```

Ganti dengan:
```tsx
<td className="py-4 px-4">
  <div className="font-bold text-white text-sm flex items-center gap-2">
    {admin.storeName}
    {admin.isTrial && (() => {
      const now = new Date();
      const end = new Date(admin.subscriptionEnd);
      const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = diffDays <= 0;
      return (
        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase ${
          isExpired
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        }`}>
          {isExpired ? 'TRIAL EXPIRED' : `TRIAL - ${diffDays}h`}
        </span>
      );
    })()}
  </div>
  <div className="text-[11px] text-slate-400">Pemilik: {admin.user?.name}</div>
</td>
```

**Perubahan 6** — Tambah komponen `CreateTrialModal` di akhir JSX.

Cari bagian `{/* Modal Hapus Admin Confirm */}` dan tambahkan SETELAH closing `/>` dari ConfirmModal:
```tsx
        {/* Modal Buat Akun Trial */}
        <CreateTrialModal
          isOpen={isTrialModalOpen}
          onClose={() => setIsTrialModalOpen(false)}
          onSuccess={() => {
            setIsTrialModalOpen(false);
            loadAdmins();
          }}
        />
```

---

## FASE 9 — VERIFIKASI AKHIR

### TASK 9.1 — Test Backend API

Restart server:
```
cd backend && npm run dev
```

Login SuperAdmin dan simpan token:
```
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"superadmin@laundryku.com","password":"SuperAdmin@2026"}'
```

Buat akun trial (ganti TOKEN_DISINI):
```
curl -X POST http://localhost:4000/api/superadmin/admins/trial -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN_DISINI" -d '{"storeName":"Laundry Sejahtera","name":"Pak Budi","email":"budi@sejahtera.com","password":"123456","phone":"08123456789","trialDays":7}'
```

Response sukses: `{"success": true, "message": "Akun trial 7 hari..."`

---

### TASK 9.2 — Test Frontend UI

Buka: `http://localhost:3000/superadmin/admins`

Checklist:
- [ ] Tombol amber "Buat Akun Trial" muncul di header
- [ ] Modal muncul dengan border amber dan badge TRIAL
- [ ] Form lengkap dengan pilihan Durasi 3/5/7 hari
- [ ] Submit berhasil -> akun muncul di tabel dengan badge TRIAL amber
- [ ] Badge berubah merah "TRIAL EXPIRED" jika sudah habis
