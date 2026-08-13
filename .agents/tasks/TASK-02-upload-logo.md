# TASK-02 — Upload Logo Toko Admin

**Status:** ✅ Selesai  
**Prioritas:** 🔴 Tinggi  
**Estimasi:** 3–4 jam  

---

## 🎯 Tujuan

Membuat fitur upload logo toko secara langsung (upload file dari komputer) untuk admin laundry. Logo yang diupload akan disimpan di server dan URL-nya akan disimpan ke field `storeLogo` pada model `Admin` di database.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Yang sudah ada
- Model `Admin` di `backend/prisma/schema.prisma` sudah memiliki field `storeLogo String?` — ini menyimpan URL/path logo.
- `backend/src/services/store.service.ts` sudah memiliki `updateStoreSettings()` yang menerima `storeLogo`.
- `backend/src/routes/store.routes.ts` sudah ada endpoint `PUT /api/store` yang menerima `storeLogo` sebagai string (URL).
- **Masalah saat ini:** Field `storeLogo` hanya bisa diisi dengan string URL secara manual. Belum ada mekanisme upload file sungguhan.
- Package `multer` sudah terinstall di backend (ada di `package.json`). `@types/multer` juga sudah ada.

### Keputusan Teknis (Ikuti Persis)
- **Penyimpanan file:** Simpan file di `backend/uploads/logos/` (buat folder ini jika belum ada).
- **Nama file:** Gunakan format `{adminId}-{timestamp}.{ext}` untuk menghindari tabrakan nama.
- **Format yang diizinkan:** JPG, JPEG, PNG, WebP saja. Tolak format lain dengan pesan error yang jelas.
- **Ukuran maksimum:** 2MB. Jika lebih besar, tolak dengan error.
- **URL yang disimpan:** Simpan path relatif `uploads/logos/{namafile}` ke field `storeLogo`. Frontend akan mengaksesnya via URL penuh.
- **Static file serving:** Backend harus serve folder `uploads/` sebagai static files.

---

## 🔧 FASE 1 — Backend: Setup Multer Middleware

**File baru yang dibuat:** `backend/src/middleware/upload.ts`

Buat file ini dengan isi persis sebagai berikut:

```typescript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan direktori uploads/logos ada
const uploadDir = path.join(process.cwd(), 'uploads', 'logos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    const adminId = req.user?.adminId || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${adminId}-${timestamp}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya JPG, PNG, dan WebP yang diizinkan.'));
  }
};

export const uploadLogo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
```

---

## 🔧 FASE 2 — Backend: Tambah Endpoint Upload

**File yang diubah:** `backend/src/controllers/store.controller.ts`

Tambahkan fungsi baru `uploadStoreLogo` di bawah fungsi `updateStore` yang sudah ada:

```typescript
import path from 'path';

export async function uploadStoreLogo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: 'File logo tidak ditemukan dalam request.' });
      return;
    }

    // Simpan path relatif agar bisa diakses via URL
    const logoPath = `uploads/logos/${req.file.filename}`;

    const updated = await updateStoreSettings(adminId, { storeLogo: logoPath });

    res.json({
      success: true,
      message: 'Logo toko berhasil diupload.',
      data: { storeLogo: logoPath, store: updated },
    });
  } catch (error: any) {
    next(error);
  }
}
```

**Penting:** Tambahkan import `path` di baris paling atas file jika belum ada:
```typescript
import path from 'path';
```

---

## 🔧 FASE 3 — Backend: Tambah Route Upload

**File yang diubah:** `backend/src/routes/store.routes.ts`

Tambahkan import dan route baru. Berikut adalah seluruh isi file setelah diubah:

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { getStore, updateStore, uploadStoreLogo } from '../controllers/store.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';
import { uploadLogo } from '../middleware/upload.js';

const router = Router();

const updateStoreSchema = z.object({
  body: z.object({
    storeName: z.string().min(2).optional(),
    storeAddress: z.string().optional(),
    storePhone: z.string().optional(),
    storeLogo: z.string().optional(),
    operatingHours: z.any().optional(),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getStore);
router.put('/', authorize('ADMIN'), validate(updateStoreSchema), updateStore);

// Endpoint baru untuk upload logo
router.post(
  '/upload-logo',
  authorize('ADMIN'),
  uploadLogo.single('logo'), // field name di form-data harus 'logo'
  uploadStoreLogo
);

export default router;
```

---

## 🔧 FASE 4 — Backend: Serve Static Files

**File yang diubah:** `backend/src/app.ts`

Tambahkan baris berikut **setelah** `app.use(express.urlencoded({ extended: true }));` dan **sebelum** route definitions:

```typescript
import path from 'path';

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
```

**Pastikan** import `path` ada di baris paling atas `app.ts`. Jika belum ada, tambahkan:
```typescript
import path from 'path';
```

---

## 🔧 FASE 5 — Frontend: Komponen Upload Logo

**File yang diubah:** Cari halaman pengaturan toko di `frontend/src/app/admin/settings/`.

Buka semua `.tsx` di dalam folder tersebut dan identifikasi form pengaturan toko yang memiliki field seperti `storeName`, `storeAddress`, dll.

### Tambahkan state dan handler upload:

```tsx
const [logoFile, setLogoFile] = useState<File | null>(null);
const [logoPreview, setLogoPreview] = useState<string | null>(null);
const [isUploadingLogo, setIsUploadingLogo] = useState(false);

const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Validasi di frontend juga (double check)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran file maksimum 2MB.');
    return;
  }
  
  setLogoFile(file);
  setLogoPreview(URL.createObjectURL(file));
};

const handleUploadLogo = async () => {
  if (!logoFile) return;
  
  setIsUploadingLogo(true);
  try {
    const formData = new FormData();
    formData.append('logo', logoFile); // field name 'logo' sesuai backend
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/upload-logo`, {
      method: 'POST',
      headers: {
        // Jangan set Content-Type — biarkan browser yang set untuk multipart/form-data
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Logo berhasil diupload!');
      // Refresh data store
      // Panggil fungsi fetch data yang sudah ada
    } else {
      alert(`Gagal upload logo: ${result.error}`);
    }
  } catch (err) {
    alert('Terjadi kesalahan saat upload logo.');
  } finally {
    setIsUploadingLogo(false);
  }
};
```

### Tambahkan UI Upload di dalam form:

```tsx
{/* Upload Logo */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Toko</label>
  
  {/* Preview Logo */}
  <div className="mb-3">
    {(logoPreview || storeData?.storeLogo) ? (
      <img
        src={logoPreview || `${process.env.NEXT_PUBLIC_API_URL}/${storeData?.storeLogo}`}
        alt="Logo Toko"
        className="w-24 h-24 object-contain border border-gray-200 rounded-lg"
      />
    ) : (
      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">
        Belum ada logo
      </div>
    )}
  </div>
  
  {/* Input File */}
  <input
    id="logoUpload"
    type="file"
    accept="image/jpeg,image/jpg,image/png,image/webp"
    onChange={handleLogoFileChange}
    className="hidden"
  />
  <div className="flex gap-2">
    <label
      htmlFor="logoUpload"
      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
    >
      Pilih File
    </label>
    {logoFile && (
      <button
        type="button"
        onClick={handleUploadLogo}
        disabled={isUploadingLogo}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {isUploadingLogo ? 'Mengupload...' : 'Upload Logo'}
      </button>
    )}
  </div>
  {logoFile && (
    <p className="text-xs text-gray-500 mt-1">File dipilih: {logoFile.name}</p>
  )}
  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, WebP. Maks 2MB.</p>
</div>
```

**Penting:** Sesuaikan nama variabel `storeData` dengan nama yang sudah digunakan di file tersebut. Jangan ganti nama state/variable yang sudah ada.

---

## ✅ Checklist Verifikasi

- [x] Folder `backend/uploads/logos/` terbuat otomatis saat backend start
- [x] Endpoint `POST /api/store/upload-logo` dapat diakses dengan Authorization header
- [x] Upload file JPG berhasil → file tersimpan di `backend/uploads/logos/`
- [x] Field `storeLogo` di database ter-update dengan path file
- [x] Upload file yang bukan gambar (misal .pdf) → ditolak dengan error message
- [x] Upload file > 2MB → ditolak dengan error message
- [x] URL `http://localhost:{PORT}/uploads/logos/{filename}` dapat diakses di browser → menampilkan gambar
- [x] Frontend menampilkan preview sebelum upload
- [x] Frontend menampilkan logo yang sudah tersimpan di halaman settings
- [x] Tombol "Upload Logo" muncul hanya setelah file dipilih

---

## 🚫 Larangan

- JANGAN menyimpan file ke MongoDB
- JANGAN mengubah schema Prisma (field `storeLogo` sudah ada)
- JANGAN menghapus endpoint `PUT /api/store` yang sudah ada
- JANGAN menggunakan cloud storage (S3, Cloudinary, dll) — simpan lokal saja
