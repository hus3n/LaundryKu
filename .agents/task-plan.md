# LaundryKu — Task Plan: Penambahan Fitur (dari promt.md)

> **Dibuat oleh**: Senior Engineer  
> **Tanggal**: 2026-08-11  
> **Stack**: Next.js 14 (App Router, TypeScript) + Express.js (TypeScript) + Prisma (PostgreSQL) + MongoDB  
> **Aturan Utama**: Jangan buat asumsi. Ikuti instruksi di setiap task secara berurutan. Jika ada dependensi antar task, selesaikan task sebelumnya terlebih dahulu.

---

## Daftar Task

| No | Fitur | Prioritas | Dependensi |
|----|-------|-----------|------------|
| T1 | Tambah Outlet (multi-outlet per admin) | Tinggi | — |
| T2 | Pilihan Parfum pada Pencatatan Cucian | Sedang | — |
| T3 | Log Aktivitas Karyawan per Pesanan | Tinggi | — |
| T4 | Pilihan Metode Pembayaran (Cash / QRIS) | Sedang | — |
| T5 | Responsif Mobile — Layout Compact | Sedang | — |
| T6 | Estimasi Selesai: Pilihan Jam atau Hari | Sedang | — |
| T7 | Tombol +/- Kuantitas (Integer Only) | Rendah | — |
| T8 | Export Data ke Excel / CSV | Sedang | — |

---

## T1 — Tambah Outlet (Multi-Outlet per Admin)

### Konteks
Saat ini satu akun `Admin` hanya memiliki satu toko (`storeName`, `storeAddress`). Fitur ini menambahkan konsep **Outlet** sebagai entitas terpisah di bawah `Admin`. Karyawan yang mencatat pesanan wajib memilih outlet asal pesanan tersebut.

### 1.1 — Backend: Tambah Model `Outlet` di Prisma

**File**: `backend/prisma/schema.prisma`

Tambahkan model baru **setelah model `Admin`** (setelah baris 72, tepat di bawah penutup `}`):

```prisma
model Outlet {
  id          String   @id @default(uuid())
  adminId     String
  admin       Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)
  name        String
  address     String?
  phone       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orders      LaundryOrder[]
}
```

Di model `Admin` (baris 49-72), tambahkan relasi outlet di dalam blok model, setelah baris `employees User[] @relation("AdminEmployees")`:
```prisma
  outlets       Outlet[]
```

Di model `LaundryOrder` (baris 74-94), tambahkan dua field berikut setelah baris `admin Admin @relation(...)`:
```prisma
  outletId    String?
  outlet      Outlet?  @relation(fields: [outletId], references: [id], onDelete: SetNull)
```

**Setelah edit schema**, jalankan di terminal dari folder `backend/`:
```bash
npx prisma migrate dev --name add_outlet_model
npx prisma generate
```

---

### 1.2 — Backend: Service Outlet

**File baru**: `backend/src/services/outlet.service.ts`

Buat file baru dengan konten lengkap berikut:

```typescript
import { prisma } from '../config/database.js';

export async function getOutlets(adminId: string) {
  return prisma.outlet.findMany({
    where: { adminId, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createOutlet(adminId: string, data: {
  name: string;
  address?: string;
  phone?: string;
}) {
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('Nama outlet minimal 2 karakter.');
  }
  return prisma.outlet.create({
    data: {
      adminId,
      name: data.name.trim(),
      address: data.address?.trim(),
      phone: data.phone?.trim(),
    },
  });
}

export async function updateOutlet(outletId: string, adminId: string, data: {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}) {
  const existing = await prisma.outlet.findFirst({ where: { id: outletId, adminId } });
  if (!existing) throw new Error('Outlet tidak ditemukan.');
  return prisma.outlet.update({
    where: { id: outletId },
    data: {
      name: data.name?.trim(),
      address: data.address?.trim(),
      phone: data.phone?.trim(),
      isActive: data.isActive,
    },
  });
}

export async function deleteOutlet(outletId: string, adminId: string) {
  const existing = await prisma.outlet.findFirst({ where: { id: outletId, adminId } });
  if (!existing) throw new Error('Outlet tidak ditemukan.');
  // Soft delete: set isActive = false agar pesanan lama tidak orphan
  return prisma.outlet.update({
    where: { id: outletId },
    data: { isActive: false },
  });
}
```

---

### 1.3 — Backend: Controller Outlet

**File baru**: `backend/src/controllers/outlet.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getOutlets, createOutlet, updateOutlet, deleteOutlet } from '../services/outlet.service.js';

export async function listOutlets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }
    const outlets = await getOutlets(adminId);
    res.json({ success: true, data: outlets });
  } catch (e: any) { next(e); }
}

export async function addOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }
    const outlet = await createOutlet(adminId, req.body);
    res.status(201).json({ success: true, message: 'Outlet berhasil ditambahkan.', data: outlet });
  } catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
}

export async function editOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }
    const outlet = await updateOutlet(id, adminId, req.body);
    res.json({ success: true, message: 'Outlet berhasil diperbarui.', data: outlet });
  } catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
}

export async function removeOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }
    await deleteOutlet(id, adminId);
    res.json({ success: true, message: 'Outlet berhasil dinonaktifkan.' });
  } catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
}
```

---

### 1.4 — Backend: Routes Outlet

**File baru**: `backend/src/routes/outlet.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { listOutlets, addOutlet, editOutlet, removeOutlet } from '../controllers/outlet.controller.js';

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', listOutlets);
router.post('/', addOutlet);
router.patch('/:id', editOutlet);
router.delete('/:id', removeOutlet);

export default router;
```

---

### 1.5 — Backend: Daftarkan Route di `app.ts`

**File**: `backend/src/app.ts`

Tambahkan import setelah baris terakhir blok import routes:
```typescript
import outletRoutes from './routes/outlet.routes.js';
```

Tambahkan mount route setelah baris `app.use('/api/backup', backupRoutes);`:
```typescript
app.use('/api/outlets', outletRoutes);
```

---

### 1.6 — Backend: Update `laundry.service.ts` — Tambah Field `outletId`

**File**: `backend/src/services/laundry.service.ts`

Di fungsi `createLaundryOrder`, ubah tipe parameter `data` — tambahkan field `outletId?` setelah `paymentStatus?`:
```typescript
outletId?: string;
```

Di `prisma.laundryOrder.create({ data: { ... } })`, tambahkan field `outletId` setelah field `adminId`:
```typescript
outletId: data.outletId || null,
```

Di fungsi `getLaundryOrders`, di dalam objek `include`, tambahkan:
```typescript
outlet: { select: { id: true, name: true } },
```

---

### 1.7 — Frontend: Halaman Kelola Outlet

**File baru**: `frontend/src/app/admin/outlets/page.tsx`

Buat halaman CRUD outlet. Gunakan pola yang identik dengan `frontend/src/app/admin/packages/page.tsx`:
- Gunakan `DashboardLayout` sebagai wrapper
- Fetch `GET /api/outlets` saat mount untuk tampilkan daftar outlet
- Tabel dengan class `glass-card-dark rounded-2xl border border-slate-800`
- Kolom tabel: **Nama Outlet** | **Alamat** | **Nomor Telepon** | **Aksi**
- Baris Aksi: tombol "Edit" (buka modal pre-fill) dan "Nonaktifkan" (konfirmasi dulu)
- Tombol "Tambah Outlet" di header membuka modal inline
- Modal form field: Nama Outlet (required, min 2 char) | Alamat (opsional) | Nomor Telepon (opsional)
- `POST /api/outlets` untuk tambah baru
- `PATCH /api/outlets/:id` untuk edit
- `DELETE /api/outlets/:id` untuk nonaktifkan

---

### 1.8 — Frontend: Pilihan Outlet di Form Pencatatan Cucian

**File**: `frontend/src/app/admin/laundry/new/page.tsx`

**Langkah 1**: Tambahkan state baru di bagian atas komponen (setelah deklarasi state `notes`):
```tsx
const [outlets, setOutlets] = useState<Array<{id: string; name: string; address?: string}>>([]);
const [selectedOutletId, setSelectedOutletId] = useState<string>('');
```

**Langkah 2**: Di dalam fungsi `loadConfig` di `useEffect`, ubah dari:
```tsx
const [pkgRes, catRes] = await Promise.all([api.get('/packages'), api.get('/categories')]);
```
Menjadi:
```tsx
const [pkgRes, catRes, outletRes] = await Promise.all([
  api.get('/packages'),
  api.get('/categories'),
  api.get('/outlets'),
]);
setOutlets(outletRes.data.data || []);
if (outletRes.data.data?.length > 0) {
  setSelectedOutletId(outletRes.data.data[0].id);
}
```

**Langkah 3**: Di dalam Card "Informasi Pelanggan", tambahkan field baru setelah field Alamat (`<div>` yang berisi input alamat):
```tsx
{outlets.length > 0 && (
  <div>
    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
      Outlet / Cabang *
    </label>
    <select
      value={selectedOutletId}
      onChange={(e) => setSelectedOutletId(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
    >
      <option value="">-- Pilih Outlet --</option>
      {outlets.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}{o.address ? ` — ${o.address}` : ''}
        </option>
      ))}
    </select>
  </div>
)}
```

**Langkah 4**: Di `handleSubmit`, tambahkan `outletId` ke body request:
```tsx
outletId: selectedOutletId || undefined,
```

---

### 1.9 — Frontend: Tampilkan Outlet di Halaman List Cucian

**File**: `frontend/src/app/admin/laundry/page.tsx`

Di `<thead>`, tambahkan kolom setelah `<th>Pelanggan & WA</th>`:
```tsx
<th className="py-3.5 px-4">Outlet</th>
```

Di `<tbody>`, tambahkan cell setelah cell pelanggan:
```tsx
<td className="py-4 px-4 text-xs text-slate-300">{order.outlet?.name || '—'}</td>
```

---

### 1.10 — Frontend: Tambah Link Outlet di Sidebar

Cari file navigasi/sidebar admin (kemungkinan `frontend/src/components/layouts/DashboardLayout.tsx`). Tambahkan item menu:
- Label: `Kelola Outlet`
- Href: `/admin/outlets`
- Icon: import `Building2` dari `lucide-react`

---

## T2 — Pilihan Parfum pada Pencatatan Cucian

### Konteks
Field parfum adalah **input teks bebas** (bukan dropdown list) karena jenis parfum berubah sesuai stok.

### 2.1 — Backend: Tambah Field `fragrance` di Schema

**File**: `backend/prisma/schema.prisma`

Di model `LaundryOrder`, tambahkan field setelah `notes String?`:
```prisma
  fragrance   String?
```

Jalankan:
```bash
npx prisma migrate dev --name add_fragrance_to_laundry_order
npx prisma generate
```

---

### 2.2 — Backend: Update Service

**File**: `backend/src/services/laundry.service.ts`

Di fungsi `createLaundryOrder`, tambahkan `fragrance?: string;` ke tipe parameter `data`.

Di `prisma.laundryOrder.create({ data: { ... } })`, tambahkan setelah `notes`:
```typescript
fragrance: data.fragrance?.trim() || null,
```

---

### 2.3 — Frontend: Tambah Field Parfum di Form

**File**: `frontend/src/app/admin/laundry/new/page.tsx`

**Langkah 1** — Tambah state setelah `const [notes, setNotes]`:
```tsx
const [fragrance, setFragrance] = useState('');
```

**Langkah 2** — Tambah input di Card Summary, setelah `<textarea>` Catatan Penting:
```tsx
<div>
  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
    Parfum yang Digunakan (Opsional)
  </label>
  <input
    type="text"
    value={fragrance}
    onChange={(e) => setFragrance(e.target.value)}
    placeholder="Contoh: Molto Lavender, Downy Sunrise Fresh"
    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
  />
  <p className="text-[10px] text-slate-500 mt-1">
    Tulis nama parfum secara manual sesuai stok yang tersedia
  </p>
</div>
```

**Langkah 3** — Di `handleSubmit`, tambahkan ke body request:
```tsx
fragrance: fragrance.trim() || undefined,
```

**Langkah 4** — Di halaman list cucian (`frontend/src/app/admin/laundry/page.tsx`), tampilkan parfum di kolom No. Nota, di bawah tampilan `order.notes`:
```tsx
{order.fragrance && (
  <div className="text-[10px] text-purple-400/90 mt-0.5">
    🌸 Parfum: {order.fragrance}
  </div>
)}
```

---

## T3 — Log Aktivitas Karyawan per Pesanan

### Konteks
Model `ActivityLog` sudah ada di `schema.prisma` dengan field: `userId`, `action`, `entity`, `entityId`, `details`, `createdAt`. Yang perlu dilakukan:
1. Pastikan setiap operasi pada `LaundryOrder` membuat entry `ActivityLog`
2. Buat endpoint API untuk mengambil log berdasarkan `orderId`
3. Buat UI: klik baris pesanan → modal timeline log aktivitas

### 3.1 — Backend: Catat Log di Setiap Aksi Pesanan

**File**: `backend/src/services/laundry.service.ts`

**A. Di `createLaundryOrder`** — setelah `prisma.laundryOrder.create(...)` berhasil dan variabel `order` sudah ada, tambahkan sebelum `return order`:
```typescript
await prisma.activityLog.create({
  data: {
    userId: employeeId,
    action: 'CREATE_ORDER',
    entity: 'LaundryOrder',
    entityId: order.id,
    details: {
      orderNumber: order.orderNumber,
      customerName: data.customerName,
      totalPrice: String(order.totalPrice),
      itemCount: itemData.length,
    },
  },
});
```

**B. Di `updateOrderStatus`** — ubah signature fungsi, tambahkan parameter ke-4:
```typescript
export async function updateOrderStatus(
  orderId: string,
  adminId: string,
  status: string,
  changedByUserId: string
)
```
Setelah `prisma.laundryOrder.update(...)` berhasil dan sebelum `return updatedOrder`, tambahkan:
```typescript
await prisma.activityLog.create({
  data: {
    userId: changedByUserId,
    action: 'UPDATE_STATUS',
    entity: 'LaundryOrder',
    entityId: orderId,
    details: {
      newStatus: status,
      orderNumber: updatedOrder.orderNumber,
    },
  },
});
```

**C. Di `updatePaymentStatus`** — ubah signature fungsi, tambahkan parameter ke-4 dan ke-5:
```typescript
export async function updatePaymentStatus(
  orderId: string,
  adminId: string,
  paymentStatus: string,
  changedByUserId: string,
  paymentMethod?: 'CASH' | 'QRIS'  // digunakan oleh T4 juga
)
```
Setelah `prisma.laundryOrder.update(...)`, tambahkan sebelum return:
```typescript
await prisma.activityLog.create({
  data: {
    userId: changedByUserId,
    action: 'UPDATE_PAYMENT',
    entity: 'LaundryOrder',
    entityId: orderId,
    details: {
      newPaymentStatus: paymentStatus,
      paymentMethod: paymentMethod || null,
    },
  },
});
```

---

### 3.2 — Backend: Update Controller Laundry

**File**: `backend/src/controllers/laundry.controller.ts`

Di fungsi `changeOrderStatus`, pass `req.user!.id` ke service:
```typescript
const updated = await updateOrderStatus(
  id as string,
  adminId as string,
  status,
  req.user!.id
);
```

Di fungsi `changePaymentStatus`, destructure `paymentMethod` dari body, lalu pass ke service:
```typescript
const { paymentStatus, paymentMethod } = req.body;
// ...
const updated = await updatePaymentStatus(
  id as string,
  adminId as string,
  paymentStatus,
  req.user!.id,
  paymentMethod
);
```

---

### 3.3 — Backend: Endpoint Ambil Log per Order

**File**: `backend/src/controllers/laundry.controller.ts`

Tambahkan import di baris awal file:
```typescript
import { prisma } from '../config/database.js';
```

Tambahkan fungsi baru di akhir file:
```typescript
export async function getOrderLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }

    // Verifikasi pesanan milik admin ini
    const order = await prisma.laundryOrder.findFirst({ where: { id, adminId } });
    if (!order) { res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' }); return; }

    const logs = await prisma.activityLog.findMany({
      where: { entity: 'LaundryOrder', entityId: id },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: logs });
  } catch (e: any) { next(e); }
}
```

**File**: `backend/src/routes/laundry.routes.ts`

Buka file ini, periksa import yang sudah ada. Tambahkan `getOrderLogs` ke import dari controller:
```typescript
import { ..., getOrderLogs } from '../controllers/laundry.controller.js';
```

Tambahkan route baru setelah route yang sudah ada (SEBELUM `export default router`):
```typescript
router.get('/:id/logs', getOrderLogs);
```

---

### 3.4 — Frontend: Komponen Modal Log Aktivitas

**File baru**: `frontend/src/components/ui/OrderLogModal.tsx`

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, User } from 'lucide-react';
import { api } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_LABELS: Record<string, string> = {
  CREATE_ORDER: 'Pesanan Dibuat',
  UPDATE_STATUS: 'Status Cucian Diubah',
  UPDATE_PAYMENT: 'Status Pembayaran Diubah',
};

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Masuk',
  IN_PROGRESS: 'Sedang Dikerjakan',
  DONE: 'Selesai',
  PICKED_UP: 'Diambil Pelanggan',
  PAID: 'Lunas',
  UNPAID: 'Belum Bayar',
};

export default function OrderLogModal({ order, isOpen, onClose }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !order?.id) return;
    setLoading(true);
    api.get(`/laundry/${order.id}/logs`)
      .then((res) => setLogs(res.data.data || []))
      .catch((err) => console.error('Gagal memuat log:', err))
      .finally(() => setLoading(false));
  }, [isOpen, order?.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Log Aktivitas Pesanan</h3>
              <p className="text-[10px] text-slate-400">#{order?.orderNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Log Timeline */}
          <div className="overflow-y-auto flex-1 pr-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-slate-400">Memuat log...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">Belum ada log aktivitas untuk pesanan ini.</div>
            ) : (
              <div className="relative pl-5">
                {/* Garis vertikal timeline */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-700" />
                <div className="space-y-5">
                  {logs.map((log, idx) => (
                    <div key={log.id} className="relative">
                      {/* Dot di timeline */}
                      <div className="absolute -left-3 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-slate-900" />

                      <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                        {/* Aksi */}
                        <p className="text-xs font-semibold text-white mb-1">
                          {ACTION_LABELS[log.action] || log.action}
                        </p>

                        {/* Detail dari log.details */}
                        {log.details && (
                          <div className="text-[10px] text-slate-400 space-y-0.5 mb-2">
                            {log.details.newStatus && (
                              <p>Status baru: <span className="text-slate-300">{STATUS_LABELS[log.details.newStatus] || log.details.newStatus}</span></p>
                            )}
                            {log.details.newPaymentStatus && (
                              <p>Pembayaran: <span className="text-slate-300">{STATUS_LABELS[log.details.newPaymentStatus] || log.details.newPaymentStatus}</span></p>
                            )}
                            {log.details.paymentMethod && (
                              <p>Metode: <span className="text-slate-300">{log.details.paymentMethod}</span></p>
                            )}
                            {log.details.customerName && (
                              <p>Pelanggan: <span className="text-slate-300">{log.details.customerName}</span></p>
                            )}
                          </div>
                        )}

                        {/* Footer: user + waktu */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3" />
                            <span>{log.user?.name}</span>
                            <span className="text-slate-600">({log.user?.role})</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(log.createdAt).toLocaleString('id-ID', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
```

---

### 3.5 — Frontend: Integrasikan Modal Log di Halaman List Cucian

**File**: `frontend/src/app/admin/laundry/page.tsx`

**Langkah 1** — Import modal di bagian atas:
```tsx
import OrderLogModal from '@/components/ui/OrderLogModal';
```

**Langkah 2** — Tambah state baru:
```tsx
const [selectedLogOrder, setSelectedLogOrder] = useState<any | null>(null);
```

**Langkah 3** — Di `<motion.tr>`, tambahkan `onClick` dan cursor:
```tsx
onClick={() => setSelectedLogOrder(order)}
className="hover:bg-slate-900/50 transition-colors cursor-pointer"
```

**Langkah 4** — Tambahkan `e.stopPropagation()` pada semua elemen interaktif di dalam baris agar klik pada elemen tersebut tidak membuka modal log:
- Di `<select>` status: `onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}`
- Di `<button>` payment: `onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order.id, order.paymentStatus); }}`
- Di `<button>` Struk: `onClick={(e) => { e.stopPropagation(); setSelectedReceiptOrder(order); }}`

**Langkah 5** — Tambahkan modal di akhir JSX, setelah `<AnimatePresence>` ReceiptModal:
```tsx
<OrderLogModal
  order={selectedLogOrder}
  isOpen={!!selectedLogOrder}
  onClose={() => setSelectedLogOrder(null)}
/>
```

---

## T4 — Pilihan Metode Pembayaran (Cash / QRIS)

### Konteks
Menambahkan field `paymentMethod` (enum: CASH | QRIS) yang dicatat ketika pesanan dibayar.

### 4.1 — Backend: Tambah Enum dan Field di Schema

**File**: `backend/prisma/schema.prisma`

Tambahkan enum baru setelah enum `PaymentStatus` (setelah baris 26):
```prisma
enum PaymentMethod {
  CASH
  QRIS
}
```

Di model `LaundryOrder`, tambahkan field setelah `paymentStatus PaymentMethod @default(UNPAID)`:
```prisma
  paymentMethod PaymentMethod?
```
Perhatian: nilai `null` berarti belum dibayar / belum ditentukan.

Jalankan:
```bash
npx prisma migrate dev --name add_payment_method
npx prisma generate
```

---

### 4.2 — Backend: Update Service Laundry

**File**: `backend/src/services/laundry.service.ts`

Di fungsi `createLaundryOrder`, tambahkan `paymentMethod?: 'CASH' | 'QRIS';` ke tipe parameter `data`.

Di `prisma.laundryOrder.create({ data: { ... } })`, tambahkan setelah `paymentStatus`:
```typescript
paymentMethod: data.paymentStatus === 'PAID' ? (data.paymentMethod as any || 'CASH') : null,
```

Di fungsi `updatePaymentStatus` (yang sudah dimodifikasi di T3), update `prisma.laundryOrder.update` agar menyimpan `paymentMethod`:
```typescript
return prisma.laundryOrder.update({
  where: { id: orderId },
  data: {
    paymentStatus: paymentStatus as any,
    paymentMethod: paymentStatus === 'PAID' ? (paymentMethod as any || 'CASH') : null,
  },
  include: { customer: true },
});
```

---

### 4.3 — Frontend: UI Pilihan Metode di Form Baru

**File**: `frontend/src/app/admin/laundry/new/page.tsx`

**Langkah 1** — Tambah state:
```tsx
const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
```

**Langkah 2** — Di section Status Pembayaran, setelah grid tombol Belum Bayar/Lunas, tambahkan blok berikut:
```tsx
{paymentStatus === 'PAID' && (
  <div className="mt-3">
    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
      Metode Pembayaran
    </label>
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setPaymentMethod('CASH')}
        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
          paymentMethod === 'CASH'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-slate-900 text-slate-400 border-slate-800'
        }`}
      >
        💵 Cash
      </button>
      <button
        type="button"
        onClick={() => setPaymentMethod('QRIS')}
        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
          paymentMethod === 'QRIS'
            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
            : 'bg-slate-900 text-slate-400 border-slate-800'
        }`}
      >
        📱 QRIS
      </button>
    </div>
  </div>
)}
```

**Langkah 3** — Di `handleSubmit`, tambahkan ke body request:
```tsx
paymentMethod: paymentStatus === 'PAID' ? paymentMethod : undefined,
```

---

### 4.4 — Frontend: Tampilkan Metode Pembayaran di List Cucian

**File**: `frontend/src/app/admin/laundry/page.tsx`

Di cell pembayaran, tambahkan badge metode di bawah tombol status bayar:
```tsx
{order.paymentStatus === 'PAID' && order.paymentMethod && (
  <div className="text-[9px] text-slate-400 mt-0.5 text-center">
    {order.paymentMethod === 'CASH' ? '💵 Cash' : '📱 QRIS'}
  </div>
)}
```

---

## T5 — Responsif Mobile: Layout Compact

### Konteks
Halaman list cucian saat ini menggunakan tabel horizontal yang tidak cocok untuk layar HP. Implementasikan **dual view**: card untuk mobile, tabel untuk desktop.

### 5.1 — Halaman List Cucian: Card Mobile View

**File**: `frontend/src/app/admin/laundry/page.tsx`

Kondisi saat ini di dalam blok `orders.length > 0`:
```tsx
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

Ubah menjadi:
```tsx
{/* === CARD VIEW — MOBILE ONLY (< md) === */}
<div className="md:hidden divide-y divide-slate-800/60">
  {orders.map((order) => (
    <div
      key={order.id}
      className="p-4 space-y-2.5 hover:bg-slate-900/50 transition-colors cursor-pointer"
      onClick={() => setSelectedLogOrder(order)}
    >
      {/* Baris 1: No Nota + Status Cucian */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-brand-300 text-xs">#{order.orderNumber}</span>
          {order.outlet && (
            <span className="ml-2 text-[9px] text-slate-500">{order.outlet.name}</span>
          )}
        </div>
        <select
          value={order.status}
          onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 rounded-lg text-[10px] font-semibold border bg-slate-800 text-slate-300 border-slate-700 focus:outline-none"
        >
          <option value="RECEIVED">Masuk</option>
          <option value="IN_PROGRESS">Dikerjakan</option>
          <option value="DONE">Selesai</option>
          <option value="PICKED_UP">Diambil</option>
        </select>
      </div>

      {/* Baris 2: Pelanggan + Total + Bayar */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-white text-xs font-semibold">{order.customer?.name}</div>
          <div className="text-[10px] text-slate-400">{order.customer?.phone}</div>
        </div>
        <div className="text-right">
          <div className="text-white text-xs font-bold">
            Rp {Number(order.totalPrice).toLocaleString('id-ID')}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order.id, order.paymentStatus); }}
            className={`text-[9px] px-2 py-0.5 rounded-full border mt-0.5 ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {order.paymentStatus === 'PAID'
              ? `Lunas${order.paymentMethod ? ` · ${order.paymentMethod}` : ''}`
              : 'Belum Bayar'}
          </button>
        </div>
      </div>

      {/* Baris 3: Item paket */}
      <div className="text-[10px] text-slate-400">
        {order.items?.map((item: any, i: number) => (
          <span key={i}>
            {item.package?.name} ({item.quantity} {item.package?.unit})
            {i < order.items.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>

      {/* Baris 4: Catatan + Parfum (jika ada) */}
      {(order.notes || order.fragrance) && (
        <div className="text-[10px] space-y-0.5">
          {order.notes && <div className="text-amber-400 italic">📝 {order.notes}</div>}
          {order.fragrance && <div className="text-purple-400">🌸 Parfum: {order.fragrance}</div>}
        </div>
      )}

      {/* Baris 5: Struk + Tgl Masuk */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-slate-500">
          Masuk: {new Date(order.dateIn).toLocaleDateString('id-ID')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedReceiptOrder(order); }}
          className="px-2.5 py-1 rounded-lg bg-slate-800 text-brand-300 text-[10px] font-semibold border border-slate-700 inline-flex items-center gap-1"
        >
          🖨️ Struk
        </button>
      </div>
    </div>
  ))}
</div>

{/* === TABLE VIEW — DESKTOP ONLY (>= md) === */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full text-left text-xs">
    {/* ... tabel yang sudah ada, tidak ada perubahan ... */}
  </table>
</div>
```

---

### 5.2 — Form Pencatatan Cucian: Compact Mobile

**File**: `frontend/src/app/admin/laundry/new/page.tsx`

Ubah padding card dari `p-6` menjadi `p-4 md:p-6` pada setiap `<div className="glass-card-dark p-6 ...">`.

Di bagian action button di bawah form, tambahkan `flex-col sm:flex-row` agar tombol stack di mobile:
```tsx
<div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
  <button type="button" className="w-full sm:w-auto px-5 py-2.5 ...">Batal</button>
  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 ...">Simpan Transaksi</button>
</div>
```

---

## T6 — Estimasi Selesai: Pilihan Jam atau Hari

### Konteks
Field `Package.estimatedDuration` di database tetap dalam **jam** (integer). Hanya UI yang berubah: admin bisa input dalam "jam" atau "hari", dan tampilan di list juga cerdas (tampilkan "2 hari" bukan "48 jam").

### 6.1 — Frontend: Utility `formatDuration`

**File**: `frontend/src/lib/utils.ts` (buat jika belum ada)

```typescript
export function formatDuration(hours: number): string {
  if (hours >= 24 && hours % 24 === 0) {
    return `${hours / 24} hari`;
  }
  return `${hours} jam`;
}
```

---

### 6.2 — Frontend: Update Form Paket

**File**: `frontend/src/app/admin/packages/page.tsx`

Baca file ini seluruhnya terlebih dahulu untuk memahami struktur state yang ada.

Di form buat/edit paket, **ganti field `estimatedDuration`** (yang saat ini berupa single input number) dengan dua kontrol berjejer:

```tsx
// State baru — tambahkan di komponen:
const [durationValue, setDurationValue] = useState(24);
const [durationUnit, setDurationUnit] = useState<'jam' | 'hari'>('jam');

// Saat load data edit, set keduanya:
// Jika estimatedDuration dari API adalah 48 (jam), tampilkan sebagai 2 hari
// Logika:
const hoursFromApi = existingPackage.estimatedDuration; // contoh: 48
if (hoursFromApi >= 24 && hoursFromApi % 24 === 0) {
  setDurationValue(hoursFromApi / 24);
  setDurationUnit('hari');
} else {
  setDurationValue(hoursFromApi);
  setDurationUnit('jam');
}

// Di JSX form:
<div>
  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
    Estimasi Durasi Pengerjaan
  </label>
  <div className="flex gap-2 items-center">
    <input
      type="number"
      min="1"
      step="1"
      value={durationValue}
      onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
      className="w-24 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
    />
    <select
      value={durationUnit}
      onChange={(e) => setDurationUnit(e.target.value as 'jam' | 'hari')}
      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
    >
      <option value="jam">Jam</option>
      <option value="hari">Hari</option>
    </select>
  </div>
</div>

// Saat submit — konversi ke jam sebelum kirim ke API:
const estimatedDuration = durationUnit === 'hari' ? durationValue * 24 : durationValue;
// Kirim estimatedDuration (dalam jam) ke API
```

---

### 6.3 — Frontend: Tampilkan Estimasi dengan Format Cerdas

Di halaman list cucian (`frontend/src/app/admin/laundry/page.tsx`) dan halaman list paket, import dan gunakan `formatDuration`:
```tsx
import { formatDuration } from '@/lib/utils';
// ...
// Ganti tampilan estimasi yang sekarang raw hours:
{order.estimatedDone && (
  <div className="text-[10px] text-slate-400">
    Est: {new Date(order.estimatedDone).toLocaleDateString('id-ID')}
  </div>
)}
```
Catatan: tampilan estimasi selesai di list cucian sudah menggunakan `toLocaleDateString` (tanggal), bukan format jam. Tidak perlu ubah ini karena sudah cukup. Yang perlu diubah adalah tampilan durasi di **halaman kelola paket**.

---

## T7 — Tombol +/- Kuantitas (Integer Only)

### Konteks
Ganti input kuantitas desimal di form pencatatan cucian dengan komponen stepper yang hanya menerima bilangan bulat positif.

### 7.1 — Frontend: Komponen QuantityInput

**File baru**: `frontend/src/components/ui/QuantityInput.tsx`

```tsx
'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
}

export default function QuantityInput({ value, onChange, min = 1 }: QuantityInputProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    onChange(value + 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    }
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-700 overflow-hidden bg-slate-800 w-fit">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="px-3 py-2 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Kurangi kuantitas"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        step={1}
        className="w-12 text-center py-2 bg-transparent text-xs text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        className="px-3 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
        aria-label="Tambah kuantitas"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
```

---

### 7.2 — Frontend: Integrasikan di Form Cucian Baru

**File**: `frontend/src/app/admin/laundry/new/page.tsx`

**Langkah 1** — Import:
```tsx
import QuantityInput from '@/components/ui/QuantityInput';
```

**Langkah 2** — Ubah tipe state `items` agar `quantity` selalu `number`:
```tsx
const [items, setItems] = useState<Array<{ packageId: string; categoryId: string; quantity: number }>>([
  { packageId: '', categoryId: '', quantity: 1 },
]);
```

**Langkah 3** — Tambahkan fungsi handler khusus quantity:
```tsx
const handleQuantityChange = (index: number, newValue: number) => {
  const newItems = [...items];
  newItems[index].quantity = Math.max(1, Math.floor(newValue));
  setItems(newItems);
};
```

**Langkah 4** — Di setiap item row, temukan blok `<div className="sm:col-span-3">` (kolom kuantitas). Ganti `<input type="number" ...>` yang ada dengan:
```tsx
<div className="sm:col-span-3">
  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
    Kuantitas ({currentPkg?.unit || 'unit'})
  </label>
  <QuantityInput
    value={item.quantity}
    onChange={(v) => handleQuantityChange(idx, v)}
    min={1}
  />
</div>
```

**Langkah 5** — Di `handleSubmit`, ubah `formattedItems` (hapus `parseFloat` karena sudah integer):
```tsx
const formattedItems = items.map((i) => ({ ...i, quantity: i.quantity }));
```

**Langkah 6** — Di perhitungan `totalPrice`, ubah dari `parseFloat(String(item.quantity))` menjadi langsung `item.quantity`:
```tsx
const totalPrice = items.reduce((sum, item) => {
  const pkg = packages.find((p) => p.id === item.packageId);
  if (pkg) return sum + Number(pkg.price) * item.quantity;
  return sum;
}, 0);
```

---

## T8 — Export Data ke Excel / CSV

### Konteks
Admin dapat mengekspor data pelanggan, data pesanan, dan laporan pendapatan ke format `.xlsx` atau `.csv` langsung dari browser (client-side), menggunakan library SheetJS.

### 8.1 — Frontend: Install Library

Di terminal, dari folder `frontend/`:
```bash
npm install xlsx
npm install --save-dev @types/xlsx
```

---

### 8.2 — Frontend: Utility Export

**File baru**: `frontend/src/lib/export.ts`

```typescript
import * as XLSX from 'xlsx';

export function exportToExcel(
  data: Record<string, any>[],
  filename: string,
  sheetName = 'Data'
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(
  data: Record<string, any>[],
  filename: string
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  // Tambahkan BOM agar Excel membaca UTF-8 dengan benar
  const csv = '\uFEFF' + XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
```

---

### 8.3 — Frontend: Export di Halaman Pelanggan

**File**: `frontend/src/app/admin/customers/page.tsx`

Baca seluruh file ini terlebih dahulu. Kemudian:

**Langkah 1** — Import:
```tsx
import { exportToExcel, exportToCSV } from '@/lib/export';
import { Download } from 'lucide-react';
```

**Langkah 2** — Tambah state untuk dropdown export:
```tsx
const [showExportMenu, setShowExportMenu] = useState(false);
```

**Langkah 3** — Tambah fungsi export. Gunakan data `customers` yang sudah ada di state:
```tsx
const handleExportCustomers = (format: 'excel' | 'csv') => {
  const exportData = customers.map((c: any) => ({
    'Nama Pelanggan': c.name,
    'Nomor WA': c.phone,
    'Alamat': c.address || '',
    'Total Pesanan': c._count?.orders || 0,
    'Tgl Daftar': new Date(c.createdAt).toLocaleDateString('id-ID'),
  }));
  const filename = `data-pelanggan-${new Date().toISOString().slice(0, 10)}`;
  if (format === 'excel') exportToExcel(exportData, filename, 'Pelanggan');
  else exportToCSV(exportData, filename);
  setShowExportMenu(false);
};
```

**Langkah 4** — Tambah tombol Export di header halaman (di sebelah tombol "Tambah Pelanggan"):
```tsx
<div className="relative">
  <button
    onClick={() => setShowExportMenu(!showExportMenu)}
    className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 flex items-center gap-2"
  >
    <Download className="w-4 h-4" />
    Export
  </button>
  {showExportMenu && (
    <div className="absolute right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
      <button
        onClick={() => handleExportCustomers('excel')}
        className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-700 transition-colors"
      >
        📊 Excel (.xlsx)
      </button>
      <button
        onClick={() => handleExportCustomers('csv')}
        className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-700 transition-colors"
      >
        📄 CSV
      </button>
    </div>
  )}
</div>
```

**Langkah 5** — Tambahkan `useEffect` untuk menutup dropdown saat klik di luar:
```tsx
useEffect(() => {
  const handleClickOutside = () => setShowExportMenu(false);
  if (showExportMenu) document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [showExportMenu]);
```

---

### 8.4 — Frontend: Export di Halaman List Cucian

**File**: `frontend/src/app/admin/laundry/page.tsx`

Tambahkan state, fungsi, dan tombol yang identik dengan T8.3, tetapi untuk data `orders`:

```tsx
const handleExportOrders = (format: 'excel' | 'csv') => {
  const exportData = orders.map((o: any) => ({
    'No. Nota': o.orderNumber,
    'Pelanggan': o.customer?.name || '',
    'No. WA': o.customer?.phone || '',
    'Outlet': o.outlet?.name || '',
    'Paket': o.items?.map((i: any) =>
      `${i.package?.name} (${i.quantity} ${i.package?.unit})`
    ).join('; ') || '',
    'Total (Rp)': Number(o.totalPrice),
    'Status Cucian': o.status,
    'Status Bayar': o.paymentStatus,
    'Metode Bayar': o.paymentMethod || '',
    'Parfum': o.fragrance || '',
    'Catatan': o.notes || '',
    'Tgl Masuk': new Date(o.dateIn).toLocaleDateString('id-ID'),
    'Estimasi Selesai': o.estimatedDone
      ? new Date(o.estimatedDone).toLocaleDateString('id-ID')
      : '',
  }));
  const filename = `data-pesanan-${new Date().toISOString().slice(0, 10)}`;
  if (format === 'excel') exportToExcel(exportData, filename, 'Pesanan');
  else exportToCSV(exportData, filename);
  setShowExportMenu(false);
};
```

Letakkan tombol Export di sebelah tombol "Catat Cucian Baru" di header halaman.

---

### 8.5 — Frontend: Export di Halaman Laporan

**File**: `frontend/src/app/admin/reports/page.tsx`

**Langkah 1** — Baca seluruh file ini dulu untuk memahami struktur data yang ditampilkan (state, format data, dll).

**Langkah 2** — Import utility export dan ikon Download.

**Langkah 3** — Identifikasi data laporan yang sudah di-fetch di halaman ini (biasanya array per-tanggal atau per-bulan dengan kolom: tanggal, jumlah pesanan, total pendapatan).

**Langkah 4** — Buat fungsi export yang memetakan data tersebut ke format flat object. Kolom minimal:
```
'Periode' | 'Jumlah Pesanan' | 'Total Pendapatan (Rp)' | 'Sudah Dibayar (Rp)' | 'Belum Dibayar (Rp)'
```

**Langkah 5** — Tambahkan tombol Export di header halaman dengan pola yang sama (dropdown Excel/CSV).

---

## Catatan Penting untuk AI Pelaksana

1. **Jangan skip migration Prisma**. Setiap perubahan schema harus diikuti `npx prisma migrate dev --name <nama-migration>` DAN `npx prisma generate`. Jalankan dari folder `backend/`.

2. **Urutan task yang direkomendasikan**:
   - **Fase 1** (Backend schema): T1.1 → T2.1 → T4.1 (semua perubahan schema sekaligus, lalu satu migration)
   - **Fase 2** (Backend logic): T1.2–1.5 → T3.1–3.3 → selesaikan controller/routes
   - **Fase 3** (Frontend komponen baru): T3.4, T7.1
   - **Fase 4** (Frontend halaman): T1.7–1.9, T2.3, T3.5, T4.3–4.4, T5, T6, T8

3. **Jangan ubah file yang tidak disebutkan**. Modifikasi hanya file yang disebutkan secara eksplisit di setiap task.

4. **Konsistensi styling**: semua komponen baru harus menggunakan class yang sudah ada di proyek: `glass-card-dark`, `border-slate-800`, `text-xs`, `rounded-xl`, `rounded-2xl`, `px-4 py-2.5`, dll. Jangan tambahkan CSS custom atau Tailwind class baru yang belum dipakai.

5. **TypeScript strict**: jangan gunakan `any` kecuali di tempat yang sudah ada `any`. Buat interface/type yang proper untuk komponen baru.

6. **Test setelah setiap fase**: jalankan `npm run dev` di folder `frontend/` dan pastikan tidak ada TypeScript error. Jalankan backend dengan `npm run dev` di folder `backend/` dan pastikan tidak ada compile error.

7. **File `laundry.routes.ts`**: selalu baca file ini sebelum menambah route agar tidak terjadi duplikasi. Pastikan middleware `authenticate` dan `authorize` sudah ada di route yang membutuhkannya.

8. **Field `quantity` di database**: tetap `Decimal` di Prisma (dari schema `quantity Decimal @db.Decimal(8, 2)`). Kita mengirim integer dari frontend, dan Prisma/PostgreSQL akan menyimpannya sebagai `1.00`, `2.00`, dll — ini tidak masalah dan tidak perlu ubah schema.

9. **Untuk T5 (Mobile)**: Prioritaskan halaman yang paling sering dibuka oleh karyawan di HP, yaitu: list cucian dan form input cucian baru. Halaman lain bisa dikerjakan jika ada waktu.

10. **Untuk T8 (Export)**: library `xlsx` adalah dependency client-side. Jangan import di Server Component Next.js. Pastikan komponen yang menggunakan `xlsx` memiliki `'use client'` di baris pertama.
