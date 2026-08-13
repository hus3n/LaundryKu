# TASK-01 — Kolom Pencatatan Jumlah Baju yang Dicuci

**Status:** ✅ Selesai  
**Prioritas:** 🔴 Tinggi  
**Estimasi:** 2–3 jam  

---

## 🎯 Tujuan

Menambahkan field `clothesCount` (jumlah baju/item fisik yang dicuci) pada model `LaundryOrder`. Field ini **bersifat opsional** (nullable), bukan bagian dari kalkulasi harga. Tujuannya adalah memudahkan admin mencatat berapa buah/helai pakaian yang masuk dalam satu order.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Apa yang sudah ada
- Model `LaundryOrder` di `backend/prisma/schema.prisma` sudah memiliki field `items` (tipe `LaundryItem[]`) yang mencatat `quantity` dalam satuan kg/pcs/meter sesuai paket.
- Field `clothesCount` yang akan ditambahkan adalah **kolom terpisah** dari `quantity` pada `LaundryItem`. Ini bukan pengganti — ini catatan tambahan bebas.
- Form pencatatan cucian ada di frontend: `frontend/src/app/admin/laundry/` (cari file `page.tsx` atau komponen form di dalam folder tersebut).

### Yang TIDAK boleh diubah
- Logika kalkulasi harga (tetap berdasarkan `quantity` di `LaundryItem`)
- Logika `orderNumber` generation
- Field `quantity` pada `LaundryItem` — jangan disentuh

---

## 🔧 FASE 1 — Database Schema

**File yang diubah:** `backend/prisma/schema.prisma`

### Instruksi Persis:
Tambahkan field berikut di dalam model `LaundryOrder`, letakkan setelah field `fragrance`:

```prisma
clothesCount  Int?     // jumlah helai/buah baju fisik yang dicuci (opsional)
```

**Catatan:**
- Tipe `Int?` → integer, nullable (boleh kosong).
- Nama field: `clothesCount` (camelCase, sesuai konvensi Prisma yang sudah ada).

### Jalankan migrasi setelah edit:
```bash
cd backend
npx prisma migrate dev --name add_clothes_count_to_laundry_order
```

Jika env development tidak mendukung migrate, gunakan:
```bash
npx prisma db push
```

---

## 🔧 FASE 2 — Backend Service

**File yang diubah:** `backend/src/services/laundry.service.ts`

### Instruksi Persis:

**2a.** Pada fungsi `createLaundryOrder`, tambahkan parameter `clothesCount` ke dalam parameter `data`:

```typescript
// Tambahkan di dalam type parameter data:
clothesCount?: number;
```

**2b.** Pada saat membuat order (bagian `prisma.laundryOrder.create`), tambahkan field `clothesCount`:

```typescript
// Tambahkan di dalam blok data: { ... }
clothesCount: data.clothesCount ?? null,
```

**Aturan:** Letakkan tepat setelah `fragrance: data.fragrance?.trim() || null,`

---

## 🔧 FASE 3 — Backend Controller

**File yang diubah:** `backend/src/controllers/laundry.controller.ts`

### Instruksi Persis:
Tidak perlu mengubah logika controller secara signifikan karena `req.body` sudah diforward ke service. Pastikan field `clothesCount` tidak diblock oleh validasi Zod di route.

**File yang diubah:** `backend/src/routes/laundry.routes.ts`

Cek file ini dan cari schema validasi Zod untuk `createOrder`. Tambahkan field opsional berikut ke dalam schema body:

```typescript
clothesCount: z.number().int().min(0).optional(),
```

---

## 🔧 FASE 4 — Frontend Form (Tambah Input)

**File yang diubah:** Cari file form pencatatan cucian di `frontend/src/app/admin/laundry/`.

Buka semua file `.tsx` di dalam direktori tersebut dan identifikasi komponen form yang memiliki field seperti `customerName`, `customerPhone`, `items`, dll.

### Instruksi Persis:

Tambahkan satu input field baru di dalam form tersebut **setelah field `notes` atau `fragrance`** (mana yang ada):

```tsx
<div>
  <label htmlFor="clothesCount" className="block text-sm font-medium text-gray-700 mb-1">
    Jumlah Baju (helai) <span className="text-gray-400 text-xs">(opsional)</span>
  </label>
  <input
    id="clothesCount"
    type="number"
    min={0}
    step={1}
    placeholder="Contoh: 10"
    value={formData.clothesCount ?? ''}
    onChange={(e) =>
      setFormData({ ...formData, clothesCount: e.target.value ? parseInt(e.target.value) : undefined })
    }
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
```

**Penting:** Sesuaikan nama state dan handler dengan yang sudah ada di file. Jangan ubah struktur state yang sudah ada, hanya tambahkan key `clothesCount` di state yang sama.

---

## 🔧 FASE 5 — Frontend Tampilan Detail Order

**File yang diubah:** Cari komponen atau halaman detail/modal order di `frontend/src/app/admin/laundry/`.

Tambahkan tampilan `clothesCount` di bagian detail order:

```tsx
{order.clothesCount !== null && order.clothesCount !== undefined && (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">Jumlah Baju:</span>
    <span className="font-medium">{order.clothesCount} helai</span>
  </div>
)}
```

---

## ✅ Checklist Verifikasi

Sebelum dianggap selesai, pastikan semua item berikut terpenuhi:

- [x] Migrasi database berhasil dijalankan tanpa error
- [x] `npx prisma generate` berhasil dijalankan setelah migrasi
- [x] Endpoint `POST /api/laundry` menerima field `clothesCount` (tes dengan curl atau Postman)
- [x] Data `clothesCount` tersimpan ke database (cek via `prisma studio` atau query langsung)
- [x] Endpoint `GET /api/laundry` mengembalikan field `clothesCount` di setiap order
- [x] Form frontend memiliki input field "Jumlah Baju"
- [x] Input hanya menerima angka integer ≥ 0
- [x] Halaman detail order menampilkan jumlah baju jika terisi
- [x] Jika `clothesCount` tidak diisi, tidak ada error (field nullable)
- [x] Tidak ada perubahan pada logika kalkulasi harga

---

## 🚫 Larangan

- JANGAN mengubah field `quantity` pada `LaundryItem`
- JANGAN membuat tabel/model baru
- JANGAN mengubah logika `orderNumber` generation
- JANGAN mengubah file selain yang disebutkan di atas
