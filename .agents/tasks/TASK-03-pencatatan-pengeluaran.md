# TASK-03 — Fitur Pencatatan Pengeluaran + Rekap + Grafik + Export CSV

**Status:** ✅ Selesai  
**Prioritas:** 🔴 Tinggi  
**Estimasi:** 6–8 jam  

---

## 🎯 Tujuan

Membuat sistem pencatatan pengeluaran toko laundry dari nol, mencakup:
1. CRUD pengeluaran (tambah, lihat, hapus)
2. Rekap pengeluaran & pemasukan per hari, bulan, tahun
3. Grafik pengeluaran dan pemasukan di dashboard admin (filter per bulan/tahun)
4. Export data pengeluaran & pemasukan ke CSV

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Definisi "Pemasukan"
**Pemasukan = total `totalPrice` dari `LaundryOrder` yang berstatus `paymentStatus = 'PAID'` milik admin tersebut.** Data ini sudah ada, hanya perlu di-query.

### Definisi "Pengeluaran"
**Pengeluaran = data baru** yang akan dicatat oleh admin. Model baru perlu dibuat.

### Field Pengeluaran yang Diperlukan
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String UUID | Primary key |
| `adminId` | String | Foreign key ke Admin |
| `category` | String | Kategori pengeluaran (contoh: "Listrik", "Sabun", "Gaji") |
| `amount` | Decimal(12,2) | Jumlah pengeluaran dalam Rupiah |
| `date` | DateTime | Tanggal pengeluaran |
| `description` | String? | Keterangan opsional |
| `createdAt` | DateTime | Dibuat otomatis |
| `updatedAt` | DateTime | Diupdate otomatis |

### Yang TIDAK boleh diubah
- Model `LaundryOrder`, `LaundryItem`, atau model lain yang sudah ada
- Endpoint analytics yang sudah ada di `analytics.routes.ts`

---

## 🔧 FASE 1 — Database Schema

**File yang diubah:** `backend/prisma/schema.prisma`

Tambahkan model baru di bagian paling bawah file (setelah model `Notification`):

```prisma
model Expense {
  id          String   @id @default(uuid())
  adminId     String
  admin       Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)
  category    String
  amount      Decimal  @db.Decimal(12, 2)
  date        DateTime
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Tambahkan relasi di model `Admin`. Di dalam model `Admin`, setelah baris `outlets Outlet[]`, tambahkan:
```prisma
expenses    Expense[]
```

Jalankan migrasi:
```bash
cd backend
npx prisma migrate dev --name add_expense_model
npx prisma generate
```

---

## 🔧 FASE 2 — Backend Service

**File baru yang dibuat:** `backend/src/services/expense.service.ts`

```typescript
import { prisma } from '../config/database.js';

export interface CreateExpenseData {
  category: string;
  amount: number;
  date: string; // ISO date string dari frontend, contoh: "2026-08-13"
  description?: string;
}

// Buat pengeluaran baru
export async function createExpense(adminId: string, data: CreateExpenseData) {
  return prisma.expense.create({
    data: {
      adminId,
      category: data.category.trim(),
      amount: data.amount,
      date: new Date(data.date),
      description: data.description?.trim() || null,
    },
  });
}

// Ambil semua pengeluaran dengan filter opsional
export async function getExpenses(
  adminId: string,
  filter?: { month?: number; year?: number }
) {
  const where: any = { adminId };

  if (filter?.year) {
    const year = filter.year;
    const month = filter.month;

    if (month) {
      // Filter bulan spesifik
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    } else {
      // Filter tahun saja
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    }
  }

  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

// Hapus pengeluaran (pastikan milik admin yang sama)
export async function deleteExpense(id: string, adminId: string) {
  const existing = await prisma.expense.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error('Data pengeluaran tidak ditemukan.');
  return prisma.expense.delete({ where: { id } });
}

// Rekap pengeluaran per hari dalam satu bulan
export async function getExpenseSummaryByDay(adminId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: { adminId, date: { gte: startDate, lte: endDate } },
    select: { amount: true, date: true },
  });

  const grouped: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.toISOString().slice(0, 10); // YYYY-MM-DD
    grouped[key] = (grouped[key] || 0) + Number(e.amount);
  });

  return grouped;
}

// Rekap pengeluaran per bulan dalam satu tahun
export async function getExpenseSummaryByMonth(adminId: string, year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: { adminId, date: { gte: startDate, lte: endDate } },
    select: { amount: true, date: true },
  });

  const grouped: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.toISOString().slice(0, 7); // YYYY-MM
    grouped[key] = (grouped[key] || 0) + Number(e.amount);
  });

  return grouped;
}

// Ambil pemasukan (LaundryOrder yang PAID) dengan filter
export async function getIncomeSummary(
  adminId: string,
  filter?: { month?: number; year?: number }
) {
  const where: any = { adminId, paymentStatus: 'PAID' };

  if (filter?.year) {
    const year = filter.year;
    const month = filter.month;

    if (month) {
      where.dateIn = {
        gte: new Date(year, month - 1, 1),
        lte: new Date(year, month, 0, 23, 59, 59, 999),
      };
    } else {
      where.dateIn = {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }
  }

  const orders = await prisma.laundryOrder.findMany({
    where,
    select: { totalPrice: true, dateIn: true },
    orderBy: { dateIn: 'desc' },
  });

  return orders.map((o) => ({
    amount: Number(o.totalPrice),
    date: o.dateIn.toISOString().slice(0, 10),
  }));
}

// Data untuk grafik: pengeluaran vs pemasukan per bulan dalam 1 tahun
export async function getFinancialChartData(adminId: string, year: number) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [expensesByMonth, incomeRaw] = await Promise.all([
    getExpenseSummaryByMonth(adminId, year),
    getIncomeSummary(adminId, { year }),
  ]);

  // Group income by month
  const incomeByMonth: Record<string, number> = {};
  incomeRaw.forEach((item) => {
    const key = item.date.slice(0, 7); // YYYY-MM
    incomeByMonth[key] = (incomeByMonth[key] || 0) + item.amount;
  });

  const labels = months.map((m) => {
    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return monthNames[m - 1];
  });

  const expenseData = months.map((m) => {
    const key = `${year}-${String(m).padStart(2, '0')}`;
    return expensesByMonth[key] || 0;
  });

  const incomeData = months.map((m) => {
    const key = `${year}-${String(m).padStart(2, '0')}`;
    return incomeByMonth[key] || 0;
  });

  return { labels, expenseData, incomeData, year };
}
```

---

## 🔧 FASE 3 — Backend Controller

**File baru yang dibuat:** `backend/src/controllers/expense.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createExpense,
  getExpenses,
  deleteExpense,
  getIncomeSummary,
  getFinancialChartData,
} from '../services/expense.service.js';

export async function addExpense(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const expense = await createExpense(adminId, req.body);
    res.status(201).json({ success: true, message: 'Pengeluaran berhasil dicatat.', data: expense });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const expenses = await getExpenses(adminId, { month, year });
    res.json({ success: true, data: expenses });
  } catch (error: any) {
    next(error);
  }
}

export async function removeExpense(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    await deleteExpense(id as string, adminId);
    res.json({ success: true, message: 'Data pengeluaran dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getIncome(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const income = await getIncomeSummary(adminId, { month, year });
    res.json({ success: true, data: income });
  } catch (error: any) {
    next(error);
  }
}

export async function getChartData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

    const data = await getFinancialChartData(adminId, year);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

// Export CSV: Pengeluaran
export async function exportExpensesCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const { getExpenses } = await import('../services/expense.service.js');
    const expenses = await getExpenses(adminId, { month, year });

    const headers = ['Tanggal', 'Kategori', 'Jumlah (Rp)', 'Keterangan'];
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleDateString('id-ID'),
      e.category,
      Number(e.amount).toFixed(0),
      e.description || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pengeluaran-${year || 'semua'}-${month || 'semua'}.csv"`);
    res.send('\uFEFF' + csvContent); // BOM untuk Excel agar tidak salah encoding
  } catch (error: any) {
    next(error);
  }
}

// Export CSV: Pemasukan
export async function exportIncomeCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const income = await getIncomeSummary(adminId, { month, year });

    const headers = ['Tanggal', 'Jumlah (Rp)'];
    const rows = income.map((i) => [
      new Date(i.date).toLocaleDateString('id-ID'),
      i.amount.toFixed(0),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pemasukan-${year || 'semua'}-${month || 'semua'}.csv"`);
    res.send('\uFEFF' + csvContent);
  } catch (error: any) {
    next(error);
  }
}
```

---

## 🔧 FASE 4 — Backend Route

**File baru yang dibuat:** `backend/src/routes/expense.routes.ts`

```typescript
import { Router } from 'express';
import { z } from 'zod';
import {
  addExpense,
  listExpenses,
  removeExpense,
  getIncome,
  getChartData,
  exportExpensesCSV,
  exportIncomeCSV,
} from '../controllers/expense.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createExpenseSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Kategori wajib diisi'),
    amount: z.number().positive('Jumlah harus lebih dari 0'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    description: z.string().optional(),
  }),
});

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', listExpenses);
router.post('/', validate(createExpenseSchema), addExpense);
router.delete('/:id', removeExpense);

// Rekap pemasukan
router.get('/income', getIncome);

// Data grafik
router.get('/chart', getChartData);

// Export CSV
router.get('/export/expenses', exportExpensesCSV);
router.get('/export/income', exportIncomeCSV);

export default router;
```

**File yang diubah:** `backend/src/app.ts`

Tambahkan import dan route baru. Tambahkan tepat di bawah baris `import outletRoutes from './routes/outlet.routes.js';`:

```typescript
import expenseRoutes from './routes/expense.routes.js';
```

Tambahkan tepat di bawah baris `app.use('/api/outlets', outletRoutes);`:

```typescript
app.use('/api/expenses', expenseRoutes);
```

---

## 🔧 FASE 5 — Frontend: Halaman Pengeluaran

**File baru yang dibuat:** `frontend/src/app/admin/expenses/page.tsx`

Buat halaman baru dengan fitur:
1. Tabel daftar pengeluaran dengan filter bulan & tahun
2. Form tambah pengeluaran (modal atau inline)
3. Tombol hapus pengeluaran
4. Tombol Export CSV pengeluaran
5. Tombol Export CSV pemasukan

Gunakan pola dan komponen yang sudah ada di halaman lain (lihat `frontend/src/app/admin/customers/page.tsx` sebagai referensi struktur).

**State yang diperlukan:**
```typescript
const [expenses, setExpenses] = useState([]);
const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });
const [isLoading, setIsLoading] = useState(false);
```

**Endpoint API yang digunakan:**
- `GET /api/expenses?month={m}&year={y}` → daftar pengeluaran
- `POST /api/expenses` → tambah pengeluaran (body: JSON)
- `DELETE /api/expenses/{id}` → hapus pengeluaran
- `GET /api/expenses/export/expenses?month={m}&year={y}` → download CSV pengeluaran
- `GET /api/expenses/export/income?month={m}&year={y}` → download CSV pemasukan

**Cara download CSV di frontend:**
```typescript
const downloadCSV = async (type: 'expenses' | 'income') => {
  const token = localStorage.getItem('token');
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/export/${type}?month=${filterMonth}&year=${filterYear}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}-${filterYear}-${filterMonth}.csv`;
  link.click();
};
```

---

## 🔧 FASE 6 — Frontend: Grafik di Dashboard Admin

**File yang diubah:** Temukan file dashboard admin di `frontend/src/app/admin/dashboard/` atau `frontend/src/app/admin/page.tsx`.

Tambahkan grafik pengeluaran vs pemasukan. Gunakan library `recharts` jika sudah terinstall (cek `frontend/package.json`). Jika belum ada, gunakan library chart yang sudah terinstall.

**Endpoint:** `GET /api/expenses/chart?year={year}` mengembalikan:
```json
{
  "labels": ["Jan","Feb",...,"Des"],
  "expenseData": [0, 150000, ...],
  "incomeData": [500000, 300000, ...],
  "year": 2026
}
```

**Komponen grafik (tambahkan di halaman dashboard):**
```tsx
{/* Filter Tahun */}
<select value={chartYear} onChange={(e) => setChartYear(parseInt(e.target.value))}>
  {[2024, 2025, 2026, 2027].map((y) => (
    <option key={y} value={y}>{y}</option>
  ))}
</select>

{/* Gunakan BarChart atau LineChart dari recharts */}
```

---

## ✅ Checklist Verifikasi

- [x] Migrasi database berhasil, tabel `Expense` terbuat
- [x] `POST /api/expenses` berhasil membuat data pengeluaran
- [x] `GET /api/expenses` mengembalikan daftar pengeluaran terfilter
- [x] `DELETE /api/expenses/:id` menghapus pengeluaran milik admin yang benar
- [x] `GET /api/expenses/income` mengembalikan data pemasukan dari LaundryOrder
- [x] `GET /api/expenses/chart?year=2026` mengembalikan data 12 bulan
- [x] `GET /api/expenses/export/expenses` mengunduh file CSV yang bisa dibuka di Excel
- [x] `GET /api/expenses/export/income` mengunduh file CSV
- [x] Halaman `/admin/expenses` dapat diakses dan menampilkan daftar pengeluaran
- [x] Form tambah pengeluaran berfungsi
- [x] Tombol hapus berfungsi dengan konfirmasi
- [x] Grafik di dashboard menampilkan data dan bisa difilter per tahun

---

## 🚫 Larangan

- JANGAN mengubah model `LaundryOrder` atau `LaundryItem`
- JANGAN mengubah endpoint analytics yang sudah ada
- JANGAN menggunakan library chart baru jika sudah ada yang terinstall
