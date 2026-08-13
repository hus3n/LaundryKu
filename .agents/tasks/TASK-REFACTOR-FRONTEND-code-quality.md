# TASK-REFACTOR-FRONTEND — Audit Kualitas Kode Frontend

**Status:** 🟩 Selesai  
**Prioritas:** 🟡 Sedang  
**Estimasi:** 5–7 jam  
**Kerjakan SETELAH:** `TASK-REFACTOR-code-quality.md` (backend) selesai

---

## 📋 Ringkasan Masalah yang Ditemukan

| Kategori | Jumlah File Terdampak | Tingkat Keparahan |
|----------|----------------------|-------------------|
| `useState<any>` / `useState<any[]>` tanpa type | 12+ file | 🔴 Tinggi |
| Props interface bertipe `any` di komponen | 2 file | 🔴 Tinggi |
| `(item: any, idx: number)` dalam JSX map | 5+ tempat | 🔴 Tinggi |
| Inline multi-statement handler di JSX (`{ e.stopPropagation(); fn() }`) | 4 tempat | 🟡 Sedang |
| Ternary 3-level dalam `className` JSX | 10+ tempat | 🟡 Sedang |
| `console.error` tanpa menampilkan error ke UI | 25+ tempat | 🟡 Sedang |
| Magic string status order berulang di JSX | 6+ file | 🟡 Sedang |
| Long string bersarang dalam satu baris JSX | 5+ tempat | 🟢 Rendah |
| `catch (err: any)` — untyped error di catch block | 3+ file | 🟡 Sedang |
| File `.next/` minified (build output, bukan source) | ⚠️ Hanya terjadi di output, bukan di `src/` | ℹ️ Info |

---

## ⚠️ ATURAN PENTING SEBELUM MULAI

1. **Kerjakan satu file pada satu waktu.**
2. **Jangan mengubah tampilan/UI.** Hanya struktur kode, typing, dan keterbacaan yang diubah.
3. **Setelah setiap file,** pastikan halaman masih berfungsi di browser (tidak ada runtime error baru).
4. **Jangan mengubah Tailwind className** — fokus hanya pada logika TypeScript dan handler.

---

## 🔧 FASE 1 — Buat File Tipe Bersama (Shared Types)

**File baru yang dibuat:** `frontend/src/types/index.ts`

Buat file tipe ini terlebih dahulu. Semua `useState<any>` akan menggunakan tipe dari file ini.

```typescript
// ============================================================
// Shared TypeScript types untuk LaundryKu Frontend
// ============================================================

// --- Enum-style constants (cerminkan nilai enum di backend) ---

export type OrderStatus = 'RECEIVED' | 'IN_PROGRESS' | 'DONE' | 'PICKED_UP';
export type PaymentStatus = 'PAID' | 'UNPAID';
export type PaymentMethod = 'CASH' | 'QRIS';
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';

// --- Data Models ---

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  createdAt: string;
}

export interface LaundryPackage {
  id: string;
  name: string;
  unit: string;
  price: number | string;
  estimatedDuration: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface LaundryItem {
  id: string;
  quantity: number | string;
  price: number | string;
  subtotal: number | string;
  package: LaundryPackage;
  category: Category;
}

export interface Outlet {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { ordersTaken: number };
}

export interface LaundryOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  totalPrice: number | string;
  notes?: string | null;
  fragrance?: string | null;
  dateIn: string;
  estimatedDone?: string | null;
  dateOut?: string | null;
  createdAt: string;
  customer: Customer;
  employee: { id: string; name: string };
  outlet?: Outlet | null;
  items: LaundryItem[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeLogo?: string | null;
  operatingHours?: Record<string, unknown> | null;
  subscriptionEnd: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  storeName: string;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeLogo?: string | null;
  subscriptionEnd: string;
  isActive: boolean;
  isTrial: boolean;
  trialDays?: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
  };
  _count?: {
    employees: number;
    orders: number;
    customers: number;
  };
  waStatus?: string;
  waPhone?: string | null;
}

export interface WATemplate {
  _id: string;
  adminId: string;
  type: string;
  content: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; role: UserRole };
}

// --- API Response wrapper ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

---

## 🔧 FASE 2 — Perbaiki `ReceiptModal.tsx`

**File:** `frontend/src/components/ui/ReceiptModal.tsx`

### Masalah 2.1 — Props interface bertipe `any` (baris 7–10)

```tsx
// ❌ SEBELUM
interface ReceiptModalProps {
  order: any;
  store: any;
  onClose: () => void;
}

// ✅ SESUDAH — import dan gunakan tipe yang sudah dibuat
import type { LaundryOrder, StoreSettings } from '@/types';

interface ReceiptModalProps {
  order: LaundryOrder;
  store: StoreSettings | null;
  onClose: () => void;
}
```

### Masalah 2.2 — `(item: any, idx: number)` baris 96

```tsx
// ❌ SEBELUM (baris 96)
{order?.items?.map((item: any, idx: number) => (

// ✅ SESUDAH — type sudah diketahui dari LaundryOrder.items
{order.items.map((item, idx) => (
```

### Masalah 2.3 — Baris panjang `className` dan string kompleks di baris 117

```tsx
// ❌ SEBELUM (baris 117) — ternary + string concat dalam 1 baris panjang
[{order?.paymentStatus === 'PAID' ? `LUNAS${order.paymentMethod ? ' - ' + order.paymentMethod : ''}` : 'BELUM BAYAR'}]

// ✅ SESUDAH — ekstrak ke variabel sebelum render
const paymentLabel = order.paymentStatus === 'PAID'
  ? `LUNAS${order.paymentMethod ? ` - ${order.paymentMethod}` : ''}`
  : 'BELUM BAYAR';

// Dalam JSX:
[{paymentLabel}]
```

---

## 🔧 FASE 3 — Buat Utility Functions Bersama

**File baru yang dibuat:** `frontend/src/lib/orderUtils.ts`

Di banyak file halaman, terdapat logika yang berulang untuk menampilkan label status order dan className badge. Pindahkan ke satu file utility:

```typescript
import type { OrderStatus, PaymentStatus } from '@/types';

// Label teks untuk status cucian
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    RECEIVED: 'Masuk',
    IN_PROGRESS: 'Diproses',
    DONE: 'Selesai',
    PICKED_UP: 'Diambil',
  };
  return labels[status] ?? status;
}

// Tailwind className untuk badge status cucian
export function getOrderStatusBadgeClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    RECEIVED: 'bg-slate-800 text-slate-300 border-slate-700',
    IN_PROGRESS: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    DONE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    PICKED_UP: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
  };
  return classes[status] ?? 'bg-slate-800 text-slate-300 border-slate-700';
}

// Label teks untuk status pembayaran
export function getPaymentStatusLabel(status: PaymentStatus): string {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar';
}

// Tailwind className untuk badge status pembayaran
export function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  return status === 'PAID'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
}

// Format currency ke Rupiah
export function formatRupiah(amount: number | string): string {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

// Format tanggal ke format Indonesia
export function formatDateID(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID');
}
```

---

## 🔧 FASE 4 — Perbaiki `dashboard/page.tsx`

**File:** `frontend/src/app/admin/dashboard/page.tsx`

### Masalah 4.1 — `useState<any[]>` baris 21

```tsx
// ❌ SEBELUM (baris 21)
const [orders, setOrders] = useState<any[]>([]);

// ✅ SESUDAH
import type { LaundryOrder } from '@/types';
const [orders, setOrders] = useState<LaundryOrder[]>([]);
```

### Masalah 4.2 — Ternary 4-level dalam `className` baris 193–201

```tsx
// ❌ SEBELUM (baris 193–201) — ternary bersarang dalam className string
className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
  order.status === 'RECEIVED'
    ? 'bg-slate-800 text-slate-300 border-slate-700'
    : order.status === 'IN_PROGRESS'
    ? 'bg-amber-500/20 ...'
    : order.status === 'DONE'
    ? 'bg-emerald-500/20 ...'
    : 'bg-brand-500/20 ...'
}`}

// ✅ SESUDAH — gunakan utility function dari orderUtils.ts
import { getOrderStatusBadgeClass, getOrderStatusLabel } from '@/lib/orderUtils';

className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getOrderStatusBadgeClass(order.status)}`}
```

Terapkan hal yang sama untuk label teks status di baris 203–209:
```tsx
// ❌ SEBELUM (baris 203–209) — ternary 4-level untuk teks
{order.status === 'RECEIVED' ? 'Masuk' : order.status === 'IN_PROGRESS' ? 'Diproses' : ...}

// ✅ SESUDAH
{getOrderStatusLabel(order.status)}
```

---

## 🔧 FASE 5 — Perbaiki `laundry/page.tsx`

**File:** `frontend/src/app/admin/laundry/page.tsx`

### Masalah 5.1 — Multiple `useState<any>` baris 24–33

```tsx
// ❌ SEBELUM (baris 24–25, 32–33)
const [orders, setOrders] = useState<any[]>([]);
const [store, setStore] = useState<any>(null);
const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any | null>(null);
const [selectedLogOrder, setSelectedLogOrder] = useState<any | null>(null);

// ✅ SESUDAH
import type { LaundryOrder, StoreSettings } from '@/types';

const [orders, setOrders] = useState<LaundryOrder[]>([]);
const [store, setStore] = useState<StoreSettings | null>(null);
const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<LaundryOrder | null>(null);
const [selectedLogOrder, setSelectedLogOrder] = useState<LaundryOrder | null>(null);
```

### Masalah 5.2 — `const params: any = {}` baris 39

```tsx
// ❌ SEBELUM (baris 39)
const params: any = {};

// ✅ SESUDAH
const params: Record<string, string> = {};
```

### Masalah 5.3 — Inline multi-statement handler baris 213

```tsx
// ❌ SEBELUM (baris 213) — 2 statement dalam 1 arrow function inline
onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}

// ✅ SESUDAH — ekstrak ke named handler di level komponen/row
// Di luar JSX, tambahkan handler:
const handleStatusChangeWithStop = (
  e: React.ChangeEvent<HTMLSelectElement>,
  orderId: string
) => {
  e.stopPropagation();
  handleUpdateStatus(orderId, e.target.value);
};

// Di JSX:
onChange={(e) => handleStatusChangeWithStop(e, order.id)}
```

### Masalah 5.4 — Inline multi-statement handler baris 235, 273

```tsx
// ❌ SEBELUM (baris 235)
onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order.id, order.paymentStatus); }}

// ✅ SESUDAH — ekstrak ke named handler
const handlePaymentClickWithStop = (
  e: React.MouseEvent,
  orderId: string,
  currentStatus: string
) => {
  e.stopPropagation();
  handleUpdatePayment(orderId, currentStatus);
};

// Di JSX:
onClick={(e) => handlePaymentClickWithStop(e, order.id, order.paymentStatus)}
```

### Masalah 5.5 — `(item: any, i: number)` dalam `.map()` baris 251

```tsx
// ❌ SEBELUM (baris 251)
{order.items?.map((item: any, i: number) => (

// ✅ SESUDAH — type sudah diketahui dari LaundryOrder
{order.items.map((item, i) => (
```

### Masalah 5.6 — Ternary 4-level className berulang

Terapkan `getOrderStatusBadgeClass()` dan `getOrderStatusLabel()` dari `orderUtils.ts` untuk semua kemunculan ternary status order di file ini (ada di bagian card mobile dan tabel desktop).

---

## 🔧 FASE 6 — Perbaiki Semua Page: Ganti `useState<any[]>` dengan Type Tepat

Untuk setiap file di bawah, tambahkan import yang sesuai dan ganti `useState<any>`:

| File | State yang Perlu Diubah | Tipe yang Tepat |
|------|-------------------------|-----------------|
| `admin/employees/page.tsx` | `employees` | `Employee[]` |
| `admin/customers/page.tsx` | `customers` | `Customer[]` |
| `admin/packages/page.tsx` | `packages` | `LaundryPackage[]` |
| `admin/categories/page.tsx` | `categories` | `Category[]` |
| `admin/outlets/page.tsx` | `outlets` | `Outlet[]` |
| `admin/activity-log/page.tsx` | `logs` | `ActivityLog[]` |
| `admin/whatsapp/page.tsx` | `templates` | `WATemplate[]` |
| `superadmin/dashboard/page.tsx` | `admins` | `AdminUser[]` |
| `superadmin/admins/page.tsx` | `admins`, `selectedAdminForExtend`, `adminToDelete` | `AdminUser[]`, `AdminUser \| null` |

**Cara mengubah (contoh untuk `employees/page.tsx`):**

```tsx
// Tambahkan import di baris atas
import type { Employee } from '@/types';

// Ubah state
const [employees, setEmployees] = useState<Employee[]>([]);
```

---

## 🔧 FASE 7 — Perbaiki `api.ts`

**File:** `frontend/src/lib/api.ts`

### Masalah 7.1 — URL kondisi terlalu panjang di response interceptor baris 40

```tsx
// ❌ SEBELUM (baris 40)
if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {

// ✅ SESUDAH — ekstrak ke konstanta
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
const isPublicPath = PUBLIC_PATHS.some((path) =>
  window.location.pathname.startsWith(path)
);

if (!isPublicPath) {
  window.location.href = '/login?expired=true';
}
```

---

## 🔧 FASE 8 — Standarisasi Penanganan Error di Catch Block Frontend

**Masalah:** Di semua page, catch block hanya `console.error(...)` tanpa memberitahu user. Akibatnya, jika API gagal, user hanya melihat halaman kosong tanpa penjelasan.

**Pola yang harus diterapkan secara konsisten:**

```tsx
// ❌ SEBELUM (berulang di banyak file)
} catch (err) {
  console.error('Failed to load orders', err);
}

// ✅ SESUDAH — set error state dan tampilkan pesan ke UI
const [error, setError] = useState<string | null>(null);

// Dalam catch:
} catch (err) {
  const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
  setError(message);
  console.error('[AdminDashboard] Failed to load orders:', err);
}

// Dalam JSX, tampilkan pesan error jika ada:
{error && (
  <div className="text-center py-8 text-xs text-rose-400">
    ⚠️ {error}
  </div>
)}
```

**File yang perlu ditambahkan error state:**
- `admin/dashboard/page.tsx`
- `admin/laundry/page.tsx`
- `admin/employees/page.tsx`
- `admin/customers/page.tsx`
- `admin/packages/page.tsx`
- `admin/categories/page.tsx`
- `admin/outlets/page.tsx`

---

## 🔧 FASE 9 — Perbaiki Penggunaan Error Message di Catch Handler Aksi

Di banyak file, error dari aksi (tambah, edit, hapus) ditampilkan sebagai `alert()`. Ini tidak konsisten dan kurang UX-friendly. Namun karena mengubah ke toast/notification membutuhkan komponen baru, cukup **standarisasi cara mengambil error message**:

```tsx
// ❌ SEBELUM — beberapa tempat menggunakan cara berbeda
alert(err.response?.data?.error || 'Gagal');        // cara A
alert('Gagal mengubah status akun');                // cara B (hard-coded, tidak ada detail error)

// ✅ SESUDAH — buat helper function kecil di lib/utils.ts
// Tambahkan di frontend/src/lib/utils.ts:
export function getApiErrorMessage(err: unknown, fallback = 'Terjadi kesalahan.'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const apiErr = err as { response?: { data?: { error?: string } } };
    return apiErr.response?.data?.error ?? fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

// Penggunaan di seluruh page:
} catch (err) {
  alert(getApiErrorMessage(err, 'Gagal mengubah status akun.'));
}
```

---

## ✅ Checklist Verifikasi Keseluruhan

Jalankan setelah semua fase selesai:

```bash
cd frontend
npx tsc --noEmit
```

Harus **0 error** setelah semua tipe diperbaiki.

Verifikasi manual:
- [ ] Tidak ada `useState<any>` atau `useState<any[]>` yang tersisa (kecuali state lokal sementara seperti form draft)
- [ ] Tidak ada `(item: any)` dalam `.map()` di JSX — semua items sudah bertipe dari parent type
- [ ] File `frontend/src/types/index.ts` dibuat dan semua tipe utama sudah ada
- [ ] File `frontend/src/lib/orderUtils.ts` dibuat dan digunakan di halaman laundry & dashboard
- [ ] `getApiErrorMessage` dari `utils.ts` digunakan di semua catch block aksi
- [ ] Tidak ada inline multi-statement handler (`{ fn1(); fn2(); }`) dalam prop JSX
- [ ] Setiap halaman menampilkan pesan error ke UI jika load data gagal (bukan hanya `console.error`)
- [ ] `ReceiptModal` tidak lagi menerima props bertipe `any`
- [ ] TypeScript compiler tidak mengeluarkan error baru

---

## 🚫 Larangan

- JANGAN mengubah tampilan UI, warna, layout, atau animasi
- JANGAN mengganti `alert()` dengan toast/notification (itu pekerjaan terpisah)
- JANGAN mengubah file di folder `backend/`
- JANGAN mengubah file `tailwind.config.ts` atau CSS global
- JANGAN menghapus `console.error` sepenuhnya — ganti menjadi lebih informatif dengan prefix nama komponen, contoh: `console.error('[AdminDashboard]', err)`
