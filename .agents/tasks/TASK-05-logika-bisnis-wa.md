# TASK-05 — Logika Bisnis: Akun Gratis vs Berbayar untuk Pairing WhatsApp

**Status:** ✅ Selesai  
**Prioritas:** 🔴 Tinggi  
**Estimasi:** 2–3 jam  

---

## 🎯 Tujuan

Menambahkan logika bisnis: **admin dengan akun gratis (tidak berbayar) tidak bisa menggunakan fitur pairing WhatsApp.** Hanya admin dengan akun berbayar yang bisa terhubung ke layanan WhatsApp.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Definisi Akun "Gratis" vs "Berbayar"

Lihat model `Admin` di `backend/prisma/schema.prisma`:
```prisma
model Admin {
  ...
  subscriptionEnd DateTime  // Tanggal berakhirnya langganan
  isActive        Boolean   @default(true)
  isTrial         Boolean   @default(false)  // true = akun trial
  trialDays       Int?
  ...
}
```

**Aturan bisnis yang diterapkan:**
- **Akun GRATIS** = admin yang `isTrial = true` **DAN** masa trial sudah habis (`subscriptionEnd < sekarang`), ATAU admin yang `isActive = false`.
- **Akun BERBAYAR** = admin yang `isTrial = false` **DAN** `subscriptionEnd >= sekarang` **DAN** `isActive = true`.
- **Akun TRIAL AKTIF** = admin yang `isTrial = true` **DAN** `subscriptionEnd >= sekarang` → **TIDAK BISA** pairing WA (trial tidak termasuk akses WA).

> **Ringkasan rule:** Hanya admin dengan `isTrial = false` AND `subscriptionEnd >= now` AND `isActive = true` yang boleh pairing WA.

### Endpoint yang Terdampak

File `backend/src/routes/whatsapp.routes.ts` — endpoint yang perlu diproteksi:
- `POST /api/whatsapp/connect` → memulai pairing WA
- `POST /api/whatsapp/confirm-simulated` → konfirmasi pairing simulasi

Endpoint status dan disconnect BOLEH tetap diakses (agar admin bisa melihat status dan disconnect jika perlu).

### Cara Kerja Pengecekan

Pengecekan dilakukan dengan membuat **middleware baru** yang mengecek status langganan admin sebelum memproses request connect WA.

---

## 🔧 FASE 1 — Backend: Buat Middleware Pengecekan Langganan

**File baru yang dibuat:** `backend/src/middleware/subscriptionGuard.ts`

```typescript
import { Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AuthenticatedRequest } from './auth.js';

/**
 * Middleware: Memastikan admin memiliki langganan berbayar yang aktif.
 * Blokir akses jika:
 * - Admin adalah akun trial (isTrial = true), terlepas dari status masa trial
 * - subscriptionEnd sudah lewat
 * - isActive = false
 *
 * Middleware ini HANYA berlaku untuk role ADMIN.
 * SUPERADMIN selalu diizinkan (untuk keperluan testing).
 */
export async function requirePaidSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // SuperAdmin selalu diizinkan
    if (req.user?.role === 'SUPERADMIN') {
      next();
      return;
    }

    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    // Ambil data admin dari database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        isActive: true,
        isTrial: true,
        subscriptionEnd: true,
        storeName: true,
      },
    });

    if (!admin) {
      res.status(404).json({ success: false, error: 'Data toko tidak ditemukan.' });
      return;
    }

    // Cek apakah akun aktif
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        error: 'Akun Anda tidak aktif. Hubungi administrator untuk mengaktifkan akun.',
        code: 'ACCOUNT_INACTIVE',
      });
      return;
    }

    // Cek apakah akun adalah trial (trial tidak mendapat akses WA)
    if (admin.isTrial) {
      res.status(403).json({
        success: false,
        error: 'Fitur WhatsApp tidak tersedia untuk akun trial. Upgrade ke akun berbayar untuk menggunakan fitur ini.',
        code: 'TRIAL_ACCOUNT',
      });
      return;
    }

    // Cek apakah masa langganan masih aktif
    const now = new Date();
    if (admin.subscriptionEnd < now) {
      res.status(403).json({
        success: false,
        error: `Masa langganan Anda telah berakhir pada ${admin.subscriptionEnd.toLocaleDateString('id-ID')}. Perpanjang langganan untuk menggunakan fitur WhatsApp.`,
        code: 'SUBSCRIPTION_EXPIRED',
      });
      return;
    }

    // Semua cek lolos → izinkan akses
    next();
  } catch (error: any) {
    next(error);
  }
}
```

---

## 🔧 FASE 2 — Backend: Terapkan Middleware ke Route WhatsApp

**File yang diubah:** `backend/src/routes/whatsapp.routes.ts`

Berikut adalah isi file **setelah diubah** secara lengkap:

```typescript
import { Router } from 'express';
import { z } from 'zod';
import {
  getStatus,
  connect,
  confirmSimulated,
  disconnect,
  getTemplates,
  updateTemplate,
  sendCustomMessage,
  getMessageLogs,
} from '../controllers/whatsapp.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';
import { requirePaidSubscription } from '../middleware/subscriptionGuard.js'; // TAMBAHKAN

const router = Router();

const updateTemplateSchema = z.object({
  body: z.object({
    content: z.string().min(5, 'Isi template minimal 5 karakter'),
  }),
});

const sendCustomMessageSchema = z.object({
  body: z.object({
    recipientPhone: z.string().min(8, 'Nomor WA penerima tidak valid'),
    recipientName: z.string().min(2, 'Nama penerima wajib diisi'),
    message: z.string().min(2, 'Isi pesan wajib diisi'),
  }),
});

router.use(authenticate);

// Status dan disconnect TIDAK memerlukan pengecekan langganan
router.get('/status', authorize('ADMIN', 'SUPERADMIN'), getStatus);
router.post('/disconnect', authorize('ADMIN', 'SUPERADMIN'), disconnect);

// Connect dan confirm-simulated MEMERLUKAN pengecekan langganan berbayar
router.post(
  '/connect',
  authorize('ADMIN', 'SUPERADMIN'),
  requirePaidSubscription,   // ← Middleware baru
  connect
);
router.post(
  '/confirm-simulated',
  authorize('ADMIN', 'SUPERADMIN'),
  requirePaidSubscription,   // ← Middleware baru
  confirmSimulated
);

router.get('/templates', authorize('ADMIN', 'SUPERADMIN'), getTemplates);
router.put('/templates/:id', authorize('ADMIN', 'SUPERADMIN'), validate(updateTemplateSchema), updateTemplate);

router.post('/send-custom', authorize('ADMIN'), validate(sendCustomMessageSchema), sendCustomMessage);
router.get('/logs', authorize('ADMIN', 'SUPERADMIN'), getMessageLogs);

export default router;
```

---

## 🔧 FASE 3 — Frontend: Tampilkan Pesan Larangan di Halaman WhatsApp

**File yang diubah:** Temukan halaman WhatsApp pairing di `frontend/src/app/admin/whatsapp/`.

Buka file `page.tsx` di dalam folder tersebut.

### Instruksi:

**3a.** Tambahkan state untuk menyimpan status error langganan:

```typescript
const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
const [subscriptionCode, setSubscriptionCode] = useState<string | null>(null);
```

**3b.** Pada handler yang memanggil endpoint `POST /api/whatsapp/connect`, tangkap error dengan kode `TRIAL_ACCOUNT`, `SUBSCRIPTION_EXPIRED`, atau `ACCOUNT_INACTIVE`:

```typescript
const handleConnect = async () => {
  try {
    setSubscriptionError(null);
    // ... kode existing untuk connect ...
    
    const response = await fetch(`${apiUrl}/api/whatsapp/connect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      // Cek apakah ini error langganan
      if (['TRIAL_ACCOUNT', 'SUBSCRIPTION_EXPIRED', 'ACCOUNT_INACTIVE'].includes(result.code)) {
        setSubscriptionError(result.error);
        setSubscriptionCode(result.code);
      } else {
        // Error lain — tangani seperti biasa
        alert(result.error);
      }
      return;
    }
    
    // Proses sukses...
  } catch (err) {
    console.error(err);
  }
};
```

**3c.** Tambahkan UI banner peringatan di bagian atas halaman (tampilkan hanya jika `subscriptionError` tidak null):

```tsx
{subscriptionError && (
  <div className="mb-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h3 className="font-medium text-amber-800">
          {subscriptionCode === 'TRIAL_ACCOUNT'
            ? 'Fitur Tidak Tersedia untuk Akun Trial'
            : subscriptionCode === 'SUBSCRIPTION_EXPIRED'
            ? 'Masa Langganan Telah Berakhir'
            : 'Akun Tidak Aktif'}
        </h3>
        <p className="text-sm text-amber-700 mt-1">{subscriptionError}</p>
        {subscriptionCode !== 'ACCOUNT_INACTIVE' && (
          <p className="text-sm text-amber-600 mt-2">
            Hubungi administrator LaundryKu untuk upgrade atau memperpanjang langganan.
          </p>
        )}
      </div>
    </div>
  </div>
)}
```

**3d.** Nonaktifkan tombol "Hubungkan WhatsApp" jika ada subscription error:

```tsx
<button
  onClick={handleConnect}
  disabled={!!subscriptionError || isConnecting}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  Hubungkan WhatsApp
</button>
```

---

## ✅ Checklist Verifikasi

Untuk test, buat akun admin dengan kondisi berbeda di database:

**Skenario 1:** Admin trial aktif (`isTrial=true`, `subscriptionEnd` masa depan)
- `POST /api/whatsapp/connect` → harus return 403 dengan `code: "TRIAL_ACCOUNT"`

**Skenario 2:** Admin dengan langganan expired (`isTrial=false`, `subscriptionEnd` masa lalu)
- `POST /api/whatsapp/connect` → harus return 403 dengan `code: "SUBSCRIPTION_EXPIRED"`

**Skenario 3:** Admin berbayar aktif (`isTrial=false`, `subscriptionEnd` masa depan, `isActive=true`)
- `POST /api/whatsapp/connect` → harus return 200 (atau error WA lain, bukan error langganan)

**Skenario 4:** SuperAdmin
- `POST /api/whatsapp/connect` → middleware dilewati, tidak ada 403 langganan

**Checklist:**
- [x] Endpoint `GET /api/whatsapp/status` tetap bisa diakses oleh admin trial tanpa error 403
- [x] Endpoint `POST /api/whatsapp/disconnect` tetap bisa diakses tanpa cek langganan
- [x] Admin trial mendapat error `TRIAL_ACCOUNT` saat mencoba connect
- [x] Admin dengan langganan expired mendapat error `SUBSCRIPTION_EXPIRED`
- [x] Admin berbayar aktif bisa melanjutkan proses connect WA
- [x] SuperAdmin bisa melanjutkan proses connect WA tanpa blokir
- [x] Frontend menampilkan banner error yang sesuai dengan kode error
- [x] Tombol connect di frontend dinonaktifkan saat ada error langganan

---

## 🚫 Larangan

- JANGAN mengubah logika di dalam `baileys.ts`
- JANGAN mengubah endpoint WA lain selain `connect` dan `confirm-simulated`
- JANGAN mengubah model database
- JANGAN hardcode ID admin atau kondisi apapun — selalu query dari database
