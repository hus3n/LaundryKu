# TASK-REFACTOR — Audit Kualitas Kode & Standar Penulisan Senior Engineer

**Status:** ✅ Selesai  
**Prioritas:** 🟡 Sedang  
**Estimasi:** 4–6 jam  
**Tujuan:** Memperbaiki keterbacaan kode, konsistensi penulisan, dan type safety untuk memudahkan debugging dan pengembangan fitur baru di masa depan.

---

## 📋 Ringkasan Masalah yang Ditemukan

| Kategori | Jumlah | Tingkat Keparahan |
|----------|--------|-------------------|
| One-liner `if` dengan badan multi-statement | 3 | 🔴 Tinggi |
| One-liner `catch` block | 1 | 🟡 Sedang |
| One-liner `throw` dalam service | 7 | 🟡 Sedang |
| `as any` type cast yang tidak aman | 20+ | 🔴 Tinggi |
| Variabel lokal bertipe `any` | 4 | 🔴 Tinggi |
| String pesan WA sangat panjang (>200 karakter) dalam 1 baris | 1 | 🔴 Tinggi |
| Magic number tanpa konstanta | 5 | 🟡 Sedang |
| `console.log` tanpa sistem logging terstruktur | 40+ | 🟢 Rendah |
| Inkonsistensi penanganan error (`next(error)` vs `res.status(400)`) | 6+ | 🟡 Sedang |

---

## ⚠️ ATURAN PENTING SEBELUM MULAI

1. **Kerjakan satu file pada satu waktu.** Jangan ubah dua file secara bersamaan.
2. **Jangan mengubah logika bisnis.** Hanya format dan struktur penulisan yang diubah.
3. **Setelah setiap file selesai,** pastikan TypeScript compiler tidak mengeluarkan error baru dengan menjalankan `npx tsc --noEmit`.
4. **Jangan menghapus `console.log`** di file `messageQueue.ts`, `baileys.ts`, dan `jobs/` — log di sana adalah sistem monitoring, bukan debug log.

---

## 🔧 FASE 1 — Perbaiki `laundry.controller.ts`

**File:** `backend/src/controllers/laundry.controller.ts`

### Masalah 1.1 — One-liner `if` baris 106 (Sangat Buruk)

```typescript
// ❌ SEBELUM (baris 106) — 3 statement dalam 1 baris, tidak bisa di-debug
if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }

// ✅ SESUDAH — setiap statement di baris terpisah
if (!adminId) {
  res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
  return;
}
```

### Masalah 1.2 — One-liner `if` baris 110 (Sangat Buruk)

```typescript
// ❌ SEBELUM (baris 110)
if (!order) { res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' }); return; }

// ✅ SESUDAH
if (!order) {
  res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
  return;
}
```

### Masalah 1.3 — One-liner `catch` baris 120

```typescript
// ❌ SEBELUM (baris 120)
  } catch (e: any) { next(e); }

// ✅ SESUDAH
  } catch (error: any) {
    next(error);
  }
```

**Catatan tambahan baris 120:** Ganti nama variabel `e` menjadi `error` agar konsisten dengan seluruh file lainnya.

### Masalah 1.4 — `req.query as any` baris 40

```typescript
// ❌ SEBELUM (baris 40) — membuang type safety
const orders = await getLaundryOrders(adminId, req.query as any);

// ✅ SESUDAH — cast ke type yang tepat
const orders = await getLaundryOrders(adminId, req.query as {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
});
```

---

## 🔧 FASE 2 — Perbaiki `outlet.service.ts`

**File:** `backend/src/services/outlet.service.ts`

### Masalah 2.1 — One-liner `throw` baris 33

```typescript
// ❌ SEBELUM (baris 33)
if (!existing) throw new Error('Outlet tidak ditemukan.');

// ✅ SESUDAH
if (!existing) {
  throw new Error('Outlet tidak ditemukan.');
}
```

### Masalah 2.2 — One-liner `throw` baris 47

```typescript
// ❌ SEBELUM (baris 47)
if (!existing) throw new Error('Outlet tidak ditemukan.');

// ✅ SESUDAH
if (!existing) {
  throw new Error('Outlet tidak ditemukan.');
}
```

---

## 🔧 FASE 3 — Perbaiki `superadmin.service.ts`

**File:** `backend/src/services/superadmin.service.ts`

### Masalah 3.1 — One-liner `throw` baris 140, 154, 164

```typescript
// ❌ SEBELUM (baris 140)
if (!admin) throw new Error('Admin toko tidak ditemukan.');

// ✅ SESUDAH
if (!admin) {
  throw new Error('Admin toko tidak ditemukan.');
}
```
Terapkan format yang sama untuk baris 154 dan 164.

### Masalah 3.2 — One-liner `throw` baris 182

```typescript
// ❌ SEBELUM (baris 182)
if (existingUser) throw new Error('Email pengelola sudah terdaftar.');

// ✅ SESUDAH
if (existingUser) {
  throw new Error('Email pengelola sudah terdaftar.');
}
```

### Masalah 3.3 — `role: 'ADMIN' as any` baris 118 & 195

Ini menandakan enum `Role` Prisma tidak diimport. Perbaiki dengan mengimport enum yang benar:

```typescript
// ❌ SEBELUM (baris 118 dan 195)
role: 'ADMIN' as any,

// ✅ SESUDAH — import enum dari Prisma client
import { Role } from '@prisma/client'; // Tambahkan di baris import paling atas

// Lalu gunakan:
role: Role.ADMIN,
```

### Masalah 3.4 — Magic number baris 18 & 247

```typescript
// ❌ SEBELUM (baris 18) — 7 * 24 * 60 * 60 * 1000 tanpa penjelasan
lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

// ✅ SESUDAH — gunakan konstanta bernama
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
lte: new Date(Date.now() + SEVEN_DAYS_MS),

// ❌ SEBELUM (baris 247)
const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

// ✅ SESUDAH
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const cutoffTime = new Date(Date.now() - ONE_DAY_MS);
```

**Catatan:** Deklarasikan konstanta di bagian atas file (di luar fungsi), bukan di dalam fungsi.

---

## 🔧 FASE 4 — Perbaiki `laundry.service.ts`

**File:** `backend/src/services/laundry.service.ts`

### Masalah 4.1 — `const where: any` baris 168

```typescript
// ❌ SEBELUM (baris 168) — mematikan type checking untuk query
const where: any = { adminId };

// ✅ SESUDAH — gunakan type dari Prisma
import { Prisma } from '@prisma/client'; // Tambahkan di import

const where: Prisma.LaundryOrderWhereInput = { adminId };
```

### Masalah 4.2 — `const updateData: any` baris 224

```typescript
// ❌ SEBELUM (baris 224)
const updateData: any = { status };

// ✅ SESUDAH
import { Prisma } from '@prisma/client'; // Pastikan sudah diimport

const updateData: Prisma.LaundryOrderUpdateInput = {
  status: status as any, // enum cast tetap diperlukan jika belum ada enum import
};
```

### Masalah 4.3 — Ternary bertingkat di baris 112–113

```typescript
// ❌ SEBELUM (baris 112–113) — ternary bertingkat dalam properti, sulit dibaca
paymentStatus: (data.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID') as any,
paymentMethod: data.paymentStatus === 'PAID' ? (data.paymentMethod as any || 'CASH') : null,

// ✅ SESUDAH — ekstrak ke variabel terlebih dahulu sebelum digunakan
const isPaid = data.paymentStatus === 'PAID';
const resolvedPaymentStatus = isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID;
const resolvedPaymentMethod = isPaid
  ? ((data.paymentMethod as PaymentMethod) ?? PaymentMethod.CASH)
  : null;

// Kemudian gunakan dalam create:
paymentStatus: resolvedPaymentStatus,
paymentMethod: resolvedPaymentMethod,
```

**Catatan:** Tambahkan import enum di awal file:
```typescript
import { PaymentStatus, PaymentMethod, OrderStatus } from '@prisma/client';
```

### Masalah 4.4 — `'RECEIVED' as any` baris 111

```typescript
// ❌ SEBELUM (baris 111)
status: 'RECEIVED' as any,

// ✅ SESUDAH (setelah import enum di atas)
status: OrderStatus.RECEIVED,
```

### Masalah 4.5 — Ternary bertingkat baris 286–287 (fungsi `updatePaymentStatus`)

```typescript
// ❌ SEBELUM (baris 286–287)
paymentStatus: paymentStatus as any,
paymentMethod: paymentStatus === 'PAID' ? (paymentMethod as any || 'CASH') : null,

// ✅ SESUDAH
const isPaid = paymentStatus === 'PAID';
const resolvedMethod = isPaid
  ? ((paymentMethod as PaymentMethod) ?? PaymentMethod.CASH)
  : null;

// Dalam update:
paymentStatus: paymentStatus as PaymentStatus,
paymentMethod: resolvedMethod,
```

---

## 🔧 FASE 5 — Perbaiki `employee.service.ts`

**File:** `backend/src/services/employee.service.ts`

### Masalah 5.1 — `role: 'EMPLOYEE' as any` baris 8, 47, 69, 101

```typescript
// ❌ SEBELUM (berulang di 4 tempat)
role: 'EMPLOYEE' as any,

// ✅ SESUDAH — import enum dari Prisma
import { Role } from '@prisma/client'; // Tambahkan di baris import

// Lalu gunakan:
role: Role.EMPLOYEE,
```

### Masalah 5.2 — `const updateData: any` baris 76

```typescript
// ❌ SEBELUM (baris 76)
const updateData: any = {
  name: data.name,
  phone: data.phone,
  isActive: data.isActive,
};

// ✅ SESUDAH — gunakan type yang tepat
import { Prisma } from '@prisma/client'; // Pastikan diimport

const updateData: Prisma.UserUpdateInput = {
  ...(data.name !== undefined && { name: data.name }),
  ...(data.phone !== undefined && { phone: data.phone }),
  ...(data.isActive !== undefined && { isActive: data.isActive }),
};
```

---

## 🔧 FASE 6 — Perbaiki `auth.ts` (middleware)

**File:** `backend/src/middleware/auth.ts`

### Masalah 6.1 — Ternary 3-tingkat baris 82 (sulit dibaca)

```typescript
// ❌ SEBELUM (baris 82) — ternary bersarang, sulit dilacak saat bug
adminId: user.adminId || (user.adminRef ? user.adminRef.id : user.role === 'SUPERADMIN' ? 'SUPERADMIN' : null),

// ✅ SESUDAH — pisahkan ke fungsi helper
function resolveAdminId(user: {
  adminId: string | null;
  adminRef: { id: string } | null;
  role: string;
}): string | null {
  if (user.adminId) return user.adminId;
  if (user.adminRef) return user.adminRef.id;
  if (user.role === 'SUPERADMIN') return 'SUPERADMIN';
  return null;
}

// Dalam fungsi authenticate:
req.user = {
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role as 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE',
  adminId: resolveAdminId(user),
};
```

---

## 🔧 FASE 7 — Perbaiki `superadmin.controller.ts`

**File:** `backend/src/controllers/superadmin.controller.ts`

### Masalah 7.1 — String pesan WA sangat panjang baris 107

Baris 107 memiliki string template literal yang lebih dari 300 karakter dalam satu baris. Ini sangat menyulitkan pembacaan dan debugging.

```typescript
// ❌ SEBELUM (baris 107) — 1 baris >300 karakter
message: `Selamat Datang di LaundryKu! 🎉🧺\n\nHalo Kak ${user.name}...`,

// ✅ SESUDAH — pisahkan ke fungsi helper yang mereturn string pesan
function buildTrialWelcomeMessage(params: {
  userName: string;
  storeName: string;
  email: string;
  trialDays: number;
  expiredDate: string;
  appUrl: string;
  superadminWaNumber: string;
}): string {
  const { userName, storeName, email, trialDays, expiredDate, appUrl, superadminWaNumber } = params;

  return [
    `Selamat Datang di LaundryKu! 🎉🧺`,
    ``,
    `Halo Kak ${userName}, akun trial LaundryKu untuk toko *${storeName}* berhasil dibuat!`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🔑 *Email Login*: ${email}`,
    `⏳ *Masa Trial*: ${trialDays} hari (hingga ${expiredDate})`,
    `🌐 *Link Aplikasi*: ${appUrl}`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `Silakan login dan mulai eksplorasi semua fitur LaundryKu.`,
    ``,
    `Jika ada pertanyaan:`,
    `📞 wa.me/${superadminWaNumber}`,
    ``,
    `Selamat mencoba! 🙏`,
  ].join('\n');
}
```

Letakkan fungsi `buildTrialWelcomeMessage` di **atas** fungsi `createTrial` dalam file yang sama.

Kemudian ganti penggunaan di dalam `createTrial`:

```typescript
// Ganti baris 103–108 dengan:
if (user.phone) {
  const welcomeMessage = buildTrialWelcomeMessage({
    userName: user.name,
    storeName: admin.storeName,
    email: user.email,
    trialDays,
    expiredDate,
    appUrl: env.APP_URL,
    superadminWaNumber: env.SUPERADMIN_WA_NUMBER,
  });

  waQueue.enqueue({
    adminId: admin.id,
    recipientPhone: user.phone,
    recipientName: user.name,
    message: welcomeMessage,
  });
}
```

---

## 🔧 FASE 8 — Perbaiki `auth.service.ts`

**File:** `backend/src/services/auth.service.ts`

### Masalah 8.1 — `console.log` untuk reset password link (baris 100)

Baris 100 menggunakan `console.log` untuk menampilkan link reset password. Ini berbahaya di production karena link sensitif akan muncul di server log yang mungkin bisa diakses orang lain.

```typescript
// ❌ SEBELUM (baris 100) — link sensitif di log
console.log(`🔑 Password Reset Link for ${email}: ${env.FRONTEND_URL}/reset-password/${resetToken}`);

// ✅ SESUDAH — tandai sebagai TODO untuk implementasi email yang sesungguhnya
// TODO: Implementasi pengiriman email reset password via nodemailer atau service email
// Sementara, link disimpan di log dengan level WARN agar bisa difilter
console.warn('[AUTH] Password reset token generated for:', email);
// JANGAN log token atau URL lengkap ke production log
```

### Masalah 8.2 — String pesan WA sangat panjang baris 70

```typescript
// ❌ SEBELUM (baris 70) — string >200 karakter inline
const message = `Halo SuperAdmin LaundryKu,\n\nSaya ingin mendaftar...`;

// ✅ SESUDAH — gunakan array join untuk multi-line string
const message = [
  'Halo SuperAdmin LaundryKu,',
  '',
  'Saya ingin mendaftar sebagai Admin LaundryKu:',
  `- Nama Toko: ${data.storeName}`,
  `- Penanggung Jawab: ${data.name}`,
  `- No WA: ${data.phone}`,
  `- Email: ${data.email}`,
  '',
  'Mohon bantuannya untuk pembuatan akun. Terima kasih!',
].join('\n');
```

---

## 🔧 FASE 9 — Perbaiki `customer.service.ts`

**File:** `backend/src/services/customer.service.ts`

### Masalah 9.1 — `const where: any` baris 4

```typescript
// ❌ SEBELUM (baris 4)
const where: any = { adminId };

// ✅ SESUDAH
import { Prisma } from '@prisma/client'; // Tambahkan di import

const where: Prisma.CustomerWhereInput = { adminId };
```

### Masalah 9.2 — Fungsi `updateCustomer` tanda tangan terlalu panjang dalam 1 baris (baris 45)

```typescript
// ❌ SEBELUM (baris 45) — parameter type inline panjang
export async function updateCustomer(customerId: string, adminId: string, data: { name?: string; phone?: string; address?: string }) {

// ✅ SESUDAH — pisahkan type parameter ke interface
interface UpdateCustomerData {
  name?: string;
  phone?: string;
  address?: string;
}

export async function updateCustomer(
  customerId: string,
  adminId: string,
  data: UpdateCustomerData,
) {
```

---

## 🔧 FASE 10 — Perbaiki `employee.controller.ts`

**File:** `backend/src/controllers/employee.controller.ts`

### Masalah 10.1 — Response inline terlalu panjang baris 33

```typescript
// ❌ SEBELUM (baris 33) — 3 properti objek dalam 1 baris
res.status(201).json({ success: true, message: 'Karyawan berhasil ditambahkan.', data: newEmployee });

// ✅ SESUDAH
res.status(201).json({
  success: true,
  message: 'Karyawan berhasil ditambahkan.',
  data: newEmployee,
});
```

### Masalah 10.2 — Response inline terlalu panjang baris 50

```typescript
// ❌ SEBELUM (baris 50)
res.json({ success: true, message: 'Data karyawan diperbarui.', data: updated });

// ✅ SESUDAH
res.json({
  success: true,
  message: 'Data karyawan diperbarui.',
  data: updated,
});
```

---

## 🔧 FASE 11 — Perbaiki `customer.controller.ts`

**File:** `backend/src/controllers/customer.controller.ts`

### Masalah 11.1 — Response inline terlalu panjang baris 36

```typescript
// ❌ SEBELUM (baris 36)
res.status(201).json({ success: true, message: 'Data pelanggan tersimpan.', data: newCustomer });

// ✅ SESUDAH
res.status(201).json({
  success: true,
  message: 'Data pelanggan tersimpan.',
  data: newCustomer,
});
```

### Masalah 11.2 — Response inline baris 53

```typescript
// ❌ SEBELUM (baris 53)
res.json({ success: true, message: 'Data pelanggan diperbarui.', data: updated });

// ✅ SESUDAH
res.json({
  success: true,
  message: 'Data pelanggan diperbarui.',
  data: updated,
});
```

---

## 🔧 FASE 12 — Inkonsistensi Penanganan Error

**Masalah:** Di seluruh controller, terdapat 2 pola yang berbeda untuk menangani error:
- Pola A: `res.status(400).json({ success: false, error: error.message })` (langsung)
- Pola B: `next(error)` (diteruskan ke global error handler)

**Aturan konsistensi yang harus diterapkan:**
- **Error validasi bisnis** (data tidak ditemukan, duplikat, dll) → gunakan `next(error)` dan biarkan global error handler yang mereturn response
- **Error yang sudah divalidasi di awal fungsi** (adminId tidak ada, dll) → tetap gunakan `res.status(400).json(...)` langsung

**File yang perlu diperiksa dan diseragamkan:**

Di `backend/src/controllers/laundry.controller.ts`:
```typescript
// ❌ SEBELUM (baris 27–28 di createOrder)
} catch (error: any) {
  res.status(400).json({ success: false, error: error.message }); // ← langsung
}

// Dibandingkan di baris 42–44 (getOrders):
} catch (error: any) {
  next(error); // ← diteruskan
}
```

**Keputusan:** Seragamkan **semua** catch block di controller menggunakan `next(error)` — kecuali yang sudah divalidasi sebelumnya. Biarkan global error handler (`backend/src/middleware/errorHandler.ts`) yang mereturn response 400/500.

Periksa file `backend/src/middleware/errorHandler.ts` terlebih dahulu untuk memahami format response error yang sudah ada, lalu seragamkan semua `catch` di controller.

---

## ✅ Checklist Verifikasi Keseluruhan

Setelah semua fase selesai, jalankan:

```bash
cd backend
npx tsc --noEmit
```

Harus **0 error** setelah perbaikan.

Kemudian verifikasi manual:
- [x] Tidak ada baris yang melebihi 120 karakter (gunakan ruler di editor)
- [x] Semua `if` block menggunakan kurung kurawal `{}`
- [x] Semua `catch` block multi-baris
- [x] Tidak ada `as any` kecuali di `baileys.ts` dan `backup.service.ts` (allowance untuk library eksternal)
- [x] Semua Prisma enum menggunakan import `Role`, `PaymentStatus`, `PaymentMethod`, `OrderStatus` dari `@prisma/client`
- [x] Tidak ada variabel lokal bertipe `any` kecuali `where` pada Prisma query yang benar-benar dinamis
- [x] Semua string template literal panjang dipecah ke array `.join('\n')` atau fungsi helper
- [x] TypeScript compiler tidak mengeluarkan error baru

---

## 🚫 Larangan

- JANGAN mengubah logika bisnis — hanya format dan struktur penulisan
- JANGAN menghapus `console.log` di file `messageQueue.ts`, `baileys.ts`, `jobs/`, `app.ts`, `config/` — itu adalah log operasional
- JANGAN mengubah file `backup.service.ts` — terlalu kompleks dan `as any` di sana ada alasannya (library archiver)
- JANGAN mengubah file di folder `frontend/` pada task ini — hanya backend yang menjadi scope
- JANGAN menjalankan `prisma migrate` — tidak ada perubahan schema di task ini
