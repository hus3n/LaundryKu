# TASK-04 — Export Data Pelanggan ke CSV (Deduplikasi)

**Status:** ✅ Selesai  
**Prioritas:** 🟡 Sedang  
**Estimasi:** 2–3 jam  

---

## 🎯 Tujuan

Membuat fitur download data pelanggan dalam format CSV. Data yang diexport hanya berisi **nama dan nomor telepon** pelanggan. Terdapat aturan deduplikasi yang ketat:

1. **Jika satu nomor telepon muncul berkali-kali dengan nama yang sama** → tampilkan hanya 1 baris (hapus duplikat).
2. **Jika satu nomor telepon muncul dengan nama yang berbeda** → gunakan **nama yang pertama kali tersimpan** (berdasarkan `createdAt` paling lama), buang nama-nama lain.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Model Customer yang Ada
```prisma
model Customer {
  id        String   @id @default(uuid())
  adminId   String
  name      String
  phone     String   // Nomor WhatsApp
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Aturan Deduplikasi (Sangat Penting)
Deduplikasi dilakukan **di backend**, bukan di frontend. Logikanya:

1. Ambil semua customer milik admin, diurutkan dari `createdAt ASC` (yang paling lama duluan).
2. Gunakan `Map<phone, name>` untuk melacak nomor yang sudah ditemukan.
3. Untuk setiap customer (dari yang terlama):
   - Jika `phone` belum ada di Map → masukkan (`phone → name`)
   - Jika `phone` sudah ada di Map → **skip** (buang data ini, apapun namanya)
4. Hasil akhir: setiap nomor telepon hanya muncul 1 kali dengan nama pertama yang terdaftar.

### Endpoint yang akan dibuat
- `GET /api/customers/export` → download CSV

### Yang sudah ada
- `backend/src/routes/customer.routes.ts` sudah ada beberapa endpoint customer
- `backend/src/controllers/customer.controller.ts` sudah ada beberapa handler
- `backend/src/services/customer.service.ts` sudah ada beberapa fungsi

---

## 🔧 FASE 1 — Backend Service

**File yang diubah:** `backend/src/services/customer.service.ts`

Tambahkan fungsi baru di bagian **paling bawah** file (setelah semua fungsi yang sudah ada):

```typescript
// Ambil data pelanggan yang sudah dideduplikasi berdasarkan nomor telepon
// Rule: jika nomor sama, gunakan nama yang pertama kali terdaftar (createdAt paling lama)
export async function getDeduplicatedCustomers(adminId: string): Promise<{ name: string; phone: string }[]> {
  // Ambil semua customer, urutkan dari yang paling lama dibuat (ASC)
  const customers = await prisma.customer.findMany({
    where: { adminId },
    select: { name: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'asc' }, // PENTING: terlama dulu
  });

  // Proses deduplikasi menggunakan Map
  const phoneMap = new Map<string, string>(); // phone -> name

  for (const customer of customers) {
    const normalizedPhone = customer.phone.trim();
    if (!phoneMap.has(normalizedPhone)) {
      // Pertama kali nomor ini muncul → simpan
      phoneMap.set(normalizedPhone, customer.name.trim());
    }
    // Jika sudah ada → skip (buang)
  }

  // Konversi Map kembali ke array
  const result: { name: string; phone: string }[] = [];
  phoneMap.forEach((name, phone) => {
    result.push({ name, phone });
  });

  // Urutkan hasil berdasarkan nama (A-Z) untuk kemudahan pembacaan
  result.sort((a, b) => a.name.localeCompare(b.name, 'id'));

  return result;
}
```

---

## 🔧 FASE 2 — Backend Controller

**File yang diubah:** `backend/src/controllers/customer.controller.ts`

**2a.** Tambahkan import fungsi baru di bagian atas file. Modifikasi baris import yang sudah ada:

```typescript
import {
  getCustomersByAdmin,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getDeduplicatedCustomers, // TAMBAHKAN INI
} from '../services/customer.service.js';
```

**2b.** Tambahkan fungsi baru di bagian **paling bawah** file:

```typescript
export async function exportCustomersCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const customers = await getDeduplicatedCustomers(adminId);

    if (customers.length === 0) {
      res.status(404).json({ success: false, error: 'Belum ada data pelanggan.' });
      return;
    }

    // Buat konten CSV
    const headers = ['Nama Pelanggan', 'Nomor Telepon'];
    const rows = customers.map((c) => [c.name, c.phone]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`) // escape tanda kutip
          .join(',')
      )
      .join('\n');

    // Tambahkan BOM (\uFEFF) agar Excel membuka UTF-8 dengan benar
    const csvWithBOM = '\uFEFF' + csvContent;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="data-pelanggan-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvWithBOM);
  } catch (error: any) {
    next(error);
  }
}
```

---

## 🔧 FASE 3 — Backend Route

**File yang diubah:** `backend/src/routes/customer.routes.ts`

Buka file ini dan lihat isinya terlebih dahulu. Tambahkan:

**3a.** Tambahkan import fungsi baru di bagian atas:

```typescript
import { exportCustomersCSV } from '../controllers/customer.controller.js';
// Pastikan import ini ditambahkan ke import yang sudah ada, bukan mengganti
```

**3b.** Tambahkan route baru. **PENTING:** Letakkan route `/export` **SEBELUM** route `/:id` jika ada, karena Express akan mencocokkan pattern dari atas ke bawah. Jika `/export` diletakkan setelah `/:id`, maka string "export" akan diinterpretasikan sebagai ID.

```typescript
// Tambahkan SEBELUM route /:id manapun
router.get('/export', authorize('ADMIN'), exportCustomersCSV);
```

---

## 🔧 FASE 4 — Frontend: Tombol Download

**File yang diubah:** Cari halaman daftar pelanggan di `frontend/src/app/admin/customers/`.

Buka file `page.tsx` di dalam folder tersebut.

Tambahkan tombol "Download CSV Pelanggan" di area header/toolbar halaman tersebut (biasanya di sebelah tombol "Tambah Pelanggan").

```tsx
const handleDownloadCustomers = async () => {
  try {
    const token = localStorage.getItem('token'); // Sesuaikan dengan cara penyimpanan token yang sudah ada
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const response = await fetch(`${apiUrl}/api/customers/export`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Gagal download: ${error.error}`);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-pelanggan-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Terjadi kesalahan saat mengunduh data pelanggan.');
    console.error(err);
  }
};
```

Tambahkan tombol di JSX (sesuaikan style dengan komponen yang sudah ada di halaman tersebut):

```tsx
<button
  onClick={handleDownloadCustomers}
  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
>
  {/* Icon download, gunakan icon yang sudah dipakai di proyek ini */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
  Download CSV Pelanggan
</button>
```

---

## ✅ Checklist Verifikasi

Untuk memverifikasi, siapkan skenario test ini di database:

**Skenario test deduplikasi:**
1. Buat 3 customer: `("Budi", "08111")`, `("Budi", "08111")`, `("Siti", "08111")`
   - Customer pertama dibuat paling awal
   - Customer ketiga ("Siti") dibuat paling terakhir
2. Panggil endpoint `GET /api/customers/export`
3. Hasil CSV yang benar: hanya 1 baris untuk nomor `08111` dengan nama **"Budi"** (nama pertama yang terdaftar)

**Checklist:**
- [x] Endpoint `GET /api/customers/export` mengembalikan response dengan header `Content-Type: text/csv`
- [x] File CSV yang didownload bisa dibuka di Microsoft Excel tanpa error encoding
- [x] Nama kolom CSV: "Nama Pelanggan", "Nomor Telepon"
- [x] Nomor telepon yang sama hanya muncul 1 kali di CSV
- [x] Yang digunakan adalah nama yang **pertama** terdaftar (bukan yang terbaru)
- [x] Hasil diurutkan A-Z berdasarkan nama
- [x] Tombol download di frontend berfungsi dan memicu unduhan file
- [x] Tidak ada perubahan pada endpoint customer lain yang sudah ada

---

## 🚫 Larangan

- JANGAN melakukan deduplikasi di frontend — harus di backend
- JANGAN mengubah atau menghapus endpoint customer yang sudah ada
- JANGAN mengubah model `Customer` di Prisma schema
- JANGAN mengembalikan field selain `name` dan `phone` di CSV
