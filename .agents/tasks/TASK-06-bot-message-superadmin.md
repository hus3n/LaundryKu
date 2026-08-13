# TASK-06 — Halaman Pengaturan Bot Pesan WhatsApp (Superadmin)

**Status:** ✅ Selesai  
**Prioritas:** 🟡 Sedang  
**Estimasi:** 5–7 jam  

---

## 🎯 Tujuan

Membuat halaman baru untuk **Superadmin** yang berfungsi mengatur perilaku bot WhatsApp. Fitur yang diperlukan:

1. **Pesan Sapaan (Greeting):** Pesan yang dikirim saat pelanggan pertama kali chat dengan nomor admin.
2. **Pesan Otomatis (Auto-Reply):** Form untuk membuat pasangan "kata kunci → balasan". Bisa diaktifkan/nonaktifkan per pesan.
3. **Integrasi API AI (AI Fallback):** Tautkan API key AI (OpenAI/Gemini) agar bot bisa menjawab pesan yang tidak ada di daftar auto-reply.

> ⚠️ **Catatan Penting:** Halaman ini hanya untuk **SUPERADMIN** pada fase testing. Pastikan route frontend dan backend menggunakan role guard SUPERADMIN.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Penyimpanan Data Bot Config

Data konfigurasi bot disimpan di **MongoDB** (bukan PostgreSQL), karena data ini bersifat dinamis dan sudah ada infrastruktur MongoDB untuk WhatsApp di proyek ini.

Lihat file yang sudah ada:
- `backend/src/models-nosql/waTemplate.model.ts` → contoh Mongoose model yang sudah ada
- `backend/src/config/mongodb.ts` → koneksi MongoDB

### Model Data yang Akan Dibuat

**BotConfig** (1 dokumen per adminId — menyimpan config global bot):
```typescript
{
  adminId: string,       // ID admin yang memiliki bot ini
  greetingMessage: string, // Pesan sapaan
  isGreetingActive: boolean,
  aiApiKey: string?,     // API key AI (optional, tersimpan terenkripsi simple)
  aiProvider: 'openai' | 'gemini' | null, // provider AI yang digunakan
  isAiActive: boolean,   // apakah fallback AI aktif
  createdAt: Date,
  updatedAt: Date,
}
```

**AutoReply** (banyak dokumen per adminId):
```typescript
{
  adminId: string,
  keyword: string,        // Kata kunci yang dideteksi dari pesan masuk (case-insensitive)
  reply: string,          // Balasan yang dikirim
  isActive: boolean,      // Apakah rule ini aktif
  createdAt: Date,
  updatedAt: Date,
}
```

### Infrastruktur WA yang sudah ada di `backend/src/whatsapp/baileys.ts`

File ini sudah menangani koneksi WA. Pada task ini, kita **TIDAK MENGUBAH** logika koneksi di `baileys.ts`. Kita hanya membuat API untuk menyimpan/mengambil konfigurasi bot. Integrasi bot config ke dalam logika pengiriman pesan akan menjadi task terpisah.

---

## 🔧 FASE 1 — MongoDB Models

**File baru yang dibuat:** `backend/src/models-nosql/botConfig.model.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IBotConfig extends Document {
  adminId: string;
  greetingMessage: string;
  isGreetingActive: boolean;
  aiApiKey?: string;
  aiProvider?: 'openai' | 'gemini' | null;
  isAiActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotConfigSchema = new Schema<IBotConfig>(
  {
    adminId: { type: String, required: true, unique: true, index: true },
    greetingMessage: { type: String, default: 'Halo! Selamat datang di layanan laundry kami. Ada yang bisa kami bantu? 😊' },
    isGreetingActive: { type: Boolean, default: false },
    aiApiKey: { type: String, default: null },
    aiProvider: { type: String, enum: ['openai', 'gemini', null], default: null },
    isAiActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BotConfig = mongoose.model<IBotConfig>('BotConfig', BotConfigSchema);
```

**File baru yang dibuat:** `backend/src/models-nosql/autoReply.model.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoReply extends Document {
  adminId: string;
  keyword: string;
  reply: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutoReplySchema = new Schema<IAutoReply>(
  {
    adminId: { type: String, required: true, index: true },
    keyword: { type: String, required: true, trim: true },
    reply: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index compound untuk mencegah keyword duplikat per admin
AutoReplySchema.index({ adminId: 1, keyword: 1 }, { unique: true });

export const AutoReply = mongoose.model<IAutoReply>('AutoReply', AutoReplySchema);
```

---

## 🔧 FASE 2 — Backend Service

**File baru yang dibuat:** `backend/src/services/botConfig.service.ts`

```typescript
import { BotConfig } from '../models-nosql/botConfig.model.js';
import { AutoReply } from '../models-nosql/autoReply.model.js';
import { isMongoConnected } from '../config/mongodb.js';

function requireMongo() {
  if (!isMongoConnected()) {
    throw new Error('Layanan konfigurasi bot sedang tidak tersedia (MongoDB offline).');
  }
}

// ===== BOT CONFIG =====

export async function getBotConfig(adminId: string) {
  requireMongo();
  const config = await BotConfig.findOne({ adminId });
  if (!config) {
    // Buat default config jika belum ada
    return BotConfig.create({ adminId });
  }
  return config;
}

export async function updateBotConfig(
  adminId: string,
  data: {
    greetingMessage?: string;
    isGreetingActive?: boolean;
    aiApiKey?: string;
    aiProvider?: 'openai' | 'gemini' | null;
    isAiActive?: boolean;
  }
) {
  requireMongo();
  return BotConfig.findOneAndUpdate(
    { adminId },
    { $set: data },
    { new: true, upsert: true }
  );
}

// ===== AUTO REPLY =====

export async function getAutoReplies(adminId: string) {
  requireMongo();
  return AutoReply.find({ adminId }).sort({ createdAt: -1 });
}

export async function createAutoReply(adminId: string, data: { keyword: string; reply: string }) {
  requireMongo();
  const keyword = data.keyword.trim().toLowerCase();

  // Cek duplikat keyword
  const existing = await AutoReply.findOne({ adminId, keyword });
  if (existing) {
    throw new Error(`Kata kunci "${keyword}" sudah ada. Gunakan kata kunci yang berbeda.`);
  }

  return AutoReply.create({ adminId, keyword, reply: data.reply.trim(), isActive: true });
}

export async function toggleAutoReply(adminId: string, replyId: string, isActive: boolean) {
  requireMongo();
  const updated = await AutoReply.findOneAndUpdate(
    { _id: replyId, adminId },
    { $set: { isActive } },
    { new: true }
  );
  if (!updated) throw new Error('Pesan otomatis tidak ditemukan.');
  return updated;
}

export async function deleteAutoReply(adminId: string, replyId: string) {
  requireMongo();
  const result = await AutoReply.findOneAndDelete({ _id: replyId, adminId });
  if (!result) throw new Error('Pesan otomatis tidak ditemukan.');
  return result;
}
```

---

## 🔧 FASE 3 — Backend Controller

**File baru yang dibuat:** `backend/src/controllers/botConfig.controller.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getBotConfig,
  updateBotConfig,
  getAutoReplies,
  createAutoReply,
  toggleAutoReply,
  deleteAutoReply,
} from '../services/botConfig.service.js';

// Helper: ambil adminId (superadmin menggunakan ID khusus 'SUPERADMIN')
function getAdminId(req: AuthenticatedRequest): string | null {
  return req.user?.adminId || (req.user?.role === 'SUPERADMIN' ? 'SUPERADMIN' : null);
}

export async function getConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const config = await getBotConfig(adminId);
    // Jangan kirim aiApiKey ke frontend (keamanan) — sensor sebagian
    const safeConfig = {
      ...config.toObject(),
      aiApiKey: config.aiApiKey ? '••••••••' + config.aiApiKey.slice(-4) : null,
    };
    res.json({ success: true, data: safeConfig });
  } catch (error: any) {
    res.status(503).json({ success: false, error: error.message });
  }
}

export async function saveConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const { greetingMessage, isGreetingActive, aiApiKey, aiProvider, isAiActive } = req.body;
    const updated = await updateBotConfig(adminId, {
      greetingMessage,
      isGreetingActive,
      aiApiKey,
      aiProvider,
      isAiActive,
    });
    res.json({ success: true, message: 'Konfigurasi bot disimpan.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listAutoReplies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const replies = await getAutoReplies(adminId);
    res.json({ success: true, data: replies });
  } catch (error: any) {
    res.status(503).json({ success: false, error: error.message });
  }
}

export async function addAutoReply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const reply = await createAutoReply(adminId, req.body);
    res.status(201).json({ success: true, message: 'Pesan otomatis ditambahkan.', data: reply });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function updateAutoReplyStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const { isActive } = req.body;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const updated = await toggleAutoReply(adminId, id, isActive);
    res.json({ success: true, message: `Pesan otomatis ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function removeAutoReply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    await deleteAutoReply(adminId, id);
    res.json({ success: true, message: 'Pesan otomatis dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
```

---

## 🔧 FASE 4 — Backend Route

**File baru yang dibuat:** `backend/src/routes/botConfig.routes.ts`

```typescript
import { Router } from 'express';
import { z } from 'zod';
import {
  getConfig,
  saveConfig,
  listAutoReplies,
  addAutoReply,
  updateAutoReplyStatus,
  removeAutoReply,
} from '../controllers/botConfig.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const saveConfigSchema = z.object({
  body: z.object({
    greetingMessage: z.string().min(5, 'Pesan sapaan minimal 5 karakter').optional(),
    isGreetingActive: z.boolean().optional(),
    aiApiKey: z.string().optional(),
    aiProvider: z.enum(['openai', 'gemini']).nullable().optional(),
    isAiActive: z.boolean().optional(),
  }),
});

const createAutoReplySchema = z.object({
  body: z.object({
    keyword: z.string().min(1, 'Kata kunci wajib diisi').max(100),
    reply: z.string().min(1, 'Balasan wajib diisi').max(1000),
  }),
});

router.use(authenticate);
// Semua endpoint hanya untuk SUPERADMIN (fase testing)
router.use(authorize('SUPERADMIN'));

router.get('/config', getConfig);
router.put('/config', validate(saveConfigSchema), saveConfig);

router.get('/auto-replies', listAutoReplies);
router.post('/auto-replies', validate(createAutoReplySchema), addAutoReply);
router.patch('/auto-replies/:id/toggle', updateAutoReplyStatus);
router.delete('/auto-replies/:id', removeAutoReply);

export default router;
```

**File yang diubah:** `backend/src/app.ts`

Tambahkan import:
```typescript
import botConfigRoutes from './routes/botConfig.routes.js';
```

Tambahkan route (di bawah route terakhir yang ada):
```typescript
app.use('/api/bot', botConfigRoutes);
```

---

## 🔧 FASE 5 — Frontend: Halaman Bot Message

**File baru yang dibuat:** `frontend/src/app/superadmin/bot-settings/page.tsx`

Halaman ini terdiri dari **3 section utama** dalam satu halaman:

### Section 1: Pesan Sapaan
- Textarea untuk isi pesan sapaan
- Toggle switch untuk aktifkan/nonaktifkan

### Section 2: Pesan Otomatis
- Tabel daftar auto-reply dengan kolom: Kata Kunci | Balasan | Status | Aksi
- Form tambah auto-reply (2 input: keyword dan reply)
- Toggle per baris untuk aktifkan/nonaktifkan
- Tombol hapus per baris

### Section 3: Integrasi AI
- Dropdown pilih provider: OpenAI atau Google Gemini
- Input field untuk API key (tipe `password`, jangan tampilkan nilainya)
- Toggle untuk aktifkan/nonaktifkan AI fallback
- Info text: "AI akan menjawab jika tidak ada kata kunci yang cocok"

**Endpoint API yang digunakan:**
```
GET  /api/bot/config              → ambil konfigurasi bot
PUT  /api/bot/config              → simpan konfigurasi bot
GET  /api/bot/auto-replies        → daftar auto-reply
POST /api/bot/auto-replies        → tambah auto-reply (body: {keyword, reply})
PATCH /api/bot/auto-replies/:id/toggle → toggle aktif (body: {isActive: boolean})
DELETE /api/bot/auto-replies/:id  → hapus auto-reply
```

**Struktur UI (implementasikan menggunakan Tailwind CSS sesuai design yang sudah ada):**

```tsx
// Struktur halaman - implementasikan detail sesuai design yang sudah ada
export default function BotSettingsPage() {
  // ... state management ...
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Pengaturan Bot WhatsApp</h1>
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          ⚠️ Fitur ini dalam mode testing. Hanya tersedia untuk SuperAdmin.
        </p>
        
        {/* Section 1: Greeting */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Pesan Sapaan Otomatis</h2>
          {/* ... form greeting ... */}
        </section>
        
        {/* Section 2: Auto Reply */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Pesan Otomatis (Auto-Reply)</h2>
          {/* ... tabel + form auto-reply ... */}
        </section>
        
        {/* Section 3: AI Integration */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Integrasi AI (Fallback)</h2>
          {/* ... form AI config ... */}
        </section>
      </div>
    </DashboardLayout>
  );
}
```

**Penting:** Gunakan `DashboardLayout` yang sudah ada (lihat halaman superadmin lain sebagai referensi cara mengimportnya).

---

## ✅ Checklist Verifikasi

- [x] Endpoint `GET /api/bot/config` mengembalikan config default jika belum ada data
- [x] `PUT /api/bot/config` menyimpan perubahan greeting message
- [x] API key tidak dikembalikan secara penuh ke frontend (hanya 4 karakter terakhir)
- [x] `POST /api/bot/auto-replies` berhasil membuat auto-reply baru
- [x] Duplikat keyword untuk admin yang sama ditolak dengan error
- [x] `PATCH /api/bot/auto-replies/:id/toggle` mengubah status isActive
- [x] `DELETE /api/bot/auto-replies/:id` menghapus auto-reply
- [x] Seluruh endpoint hanya bisa diakses oleh SUPERADMIN (test dengan token ADMIN → harus 403)
- [x] Halaman `/superadmin/bot-settings` dapat diakses dan menampilkan 3 section
- [x] Toggle greeting message berfungsi
- [x] Form tambah auto-reply berfungsi
- [x] Toggle per-baris auto-reply berfungsi
- [x] Hapus auto-reply meminta konfirmasi sebelum dihapus
- [x] Form AI key menggunakan input type="password"

---

## 🚫 Larangan

- JANGAN mengubah file `baileys.ts` pada task ini
- JANGAN menyimpan data bot config ke PostgreSQL/Prisma — hanya MongoDB
- JANGAN membuat halaman ini bisa diakses oleh role ADMIN atau EMPLOYEE
- JANGAN mengirim API key secara penuh ke frontend
