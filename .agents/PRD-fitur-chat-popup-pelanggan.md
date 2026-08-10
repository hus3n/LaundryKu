# PRD: Fitur Chat Popup Karyawan ke Pelanggan (WA-Style)

**Versi**: 1.0  
**Tanggal**: 2026-08-08  
**Status**: Draft  
**Dibuat oleh**: Tim Product LaundryKu

---

## 1. Ringkasan Eksekutif

Fitur **Chat Popup Karyawan–Pelanggan** menyediakan antarmuka obrolan bergaya WhatsApp yang tertanam langsung di dalam dashboard karyawan. Karyawan dapat membuka jendela chat terikat pada nomor pelanggan tertentu berdasarkan data cucian/nota, mengirimkan pesan teks, dan melihat balasan dari pelanggan secara real-time (melalui integrasi WhatsApp Baileys yang sudah ada). Chat hanya dapat dibuka oleh karyawan — bukan dipicu dari sisi pelanggan.

---

## 2. Latar Belakang & Tujuan

### Masalah Saat Ini
- Karyawan harus keluar dari aplikasi dan membuka WhatsApp manual untuk menghubungi pelanggan.
- Tidak ada riwayat percakapan yang terdokumentasi di dalam sistem.
- Koordinasi antara pencatatan cucian dan komunikasi pelanggan terpisah-pisah.

### Tujuan Fitur
- Memudahkan karyawan menghubungi pelanggan langsung dari halaman detail cucian/nota.
- Menyimpan riwayat chat terkait setiap nomor nota cucian di dalam sistem.
- Memanfaatkan infrastruktur WhatsApp Baileys yang sudah ada tanpa biaya tambahan.

---

## 3. Batasan Fitur (Scope)

### ✅ Dalam Scope:
- Karyawan membuka chat popup dari tombol di halaman daftar/detail cucian.
- Karyawan mengirim pesan teks ke nomor WA pelanggan melalui WA toko (Baileys).
- Karyawan melihat balasan pelanggan di dalam chat popup.
- Riwayat chat tersimpan di MongoDB terikat dengan `orderId` + `customerPhone`.
- Popup bisa diminimalisir (tidak menutup) saat karyawan berpindah halaman.

### ❌ Tidak Dalam Scope (v1.0):
- Karyawan **tidak** menerima pesan masuk dari pelanggan yang baru (hanya membalas pelanggan yang sudah ada di nota).
- Tidak ada fitur kirim gambar/file dalam chat (teks only).
- Tidak ada notifikasi push browser untuk pesan masuk.
- Pelanggan tidak bisa memulai percakapan dari luar (ini bukan chatbot inbound).
- Admin toko tidak dapat menggunakan fitur ini (hanya karyawan).

---

## 4. User Stories

| ID | Aktor | User Story |
|---|---|---|
| US-1 | Karyawan | Saya ingin membuka chat dengan pelanggan dari halaman daftar cucian agar tidak perlu buka WA manual. |
| US-2 | Karyawan | Saya ingin melihat riwayat pesan sebelumnya dengan pelanggan yang sama. |
| US-3 | Karyawan | Saya ingin membalas pesan dari pelanggan yang masuk ke WA toko, terkait nomor nota tertentu. |
| US-4 | Karyawan | Saya ingin popup chat tetap terbuka meski saya berpindah ke halaman lain. |
| US-5 | Karyawan | Saya ingin tahu jika ada balasan baru dari pelanggan (badge/indikator notifikasi). |

---

## 5. Spesifikasi Kebutuhan Fungsional

### 5.1 Tombol Buka Chat di Halaman Cucian Karyawan

**Halaman**: `/karyawan/laundry` (daftar cucian)  
**Trigger**: Tombol ikon 💬 di setiap baris cucian di kolom Aksi.

**Kondisi tombol aktif**:
- WA toko harus dalam status **CONNECTED** (tersambung ke Baileys).
- Pelanggan harus memiliki nomor WhatsApp yang valid (tidak kosong).
- Jika WA toko DISCONNECTED: tombol disable + tooltip "WhatsApp toko belum terhubung".

**Aksi saat tombol diklik**:
1. Sistem mengambil data pelanggan (`customer.name`, `customer.phone`) dan data nota (`orderNumber`).
2. Sistem memuat riwayat chat MongoDB berdasarkan `customerPhone` + `adminId`.
3. Chat popup muncul di pojok kanan bawah layar.

---

### 5.2 Desain UI Chat Popup

**Posisi**: Fixed — pojok kanan bawah layar, di atas segala konten.  
**Dimensi Default**: Lebar 360px, Tinggi 520px.  
**Z-index**: 9999 (paling atas).

**Elemen UI Popup** (dari atas ke bawah):

#### Header Bar (Dark Glassmorphism)
```
[ 📞 Ibu Rina | +62812-3456-7890 ]     [ — ] [ ✕ ]
  Nota: #LK-2026-089 • Cuci Kiloan 5kg
  Terakhir aktif: 2 menit lalu / WA CONNECTED
```
- Tombol **—** (minimize): menciutkan popup menjadi floating bubble 💬.
- Tombol **✕** (close): menutup popup sepenuhnya (hapus dari state).

#### Area Pesan (Chat Bubble Area)
```
┌────────────────────────────────────────┐
│                                        │
│   [Bubble pesan karyawan → kanan]      │
│                    Anda: "Halo Kak..." │
│                    10:23 ✓✓            │
│                                        │
│   [Bubble balasan pelanggan ← kiri]    │
│   Pelanggan: "Oke, terima kasih!"      │
│   10:25                                │
│                                        │
└────────────────────────────────────────┘
```
- **Bubble karyawan**: warna hijau/brand di sebelah kanan.
- **Bubble pelanggan**: warna abu gelap di sebelah kiri.
- **Timestamp** di setiap bubble.
- **Label pengirim**: "(Anda)" untuk karyawan, nama pelanggan untuk balasan.
- Scroll otomatis ke pesan terbawah saat popup dibuka.
- Indikator loading saat pesan dikirim: spinner kecil pada bubble.

#### Input Area (Bawah Popup)
```
[ Ketik pesan untuk Kak Rina...     ] [Kirim ➤]
```
- `Textarea` auto-expand (max 4 baris).
- Tombol **Kirim** berwarna brand.
- `Enter` = kirim pesan; `Shift+Enter` = baris baru.
- Tombol kirim disabled saat WA DISCONNECTED atau saat pesan kosong.

#### Minimized State (Floating Bubble)
Ketika diminimalisir:
- Muncul floating bubble kecil di pojok kanan bawah dengan ikon 💬.
- Jika ada pesan baru dari pelanggan saat popup diminimalisir: tampilkan badge merah dengan angka jumlah pesan belum dibaca.
- Klik bubble → popup kembali muncul.

---

### 5.3 Pengiriman Pesan

**Alur Pengiriman**:
1. Karyawan mengetik pesan dan klik Kirim.
2. Frontend mengirim request `POST /chat/send` ke backend.
3. Backend meneruskan pesan ke Baileys (`sendTextMessage`) ke nomor WA pelanggan.
4. Pesan disimpan ke MongoDB (`WAChatMessage`) dengan status `SENT`.
5. Bubble pesan muncul di chat popup dengan timestamp dan checkmark ✓.
6. Jika pengiriman gagal: bubble berubah warna merah + ikon ⚠️ + opsi "Kirim Ulang".

---

### 5.4 Menerima Balasan Pelanggan

**Mekanisme**: **Polling** — frontend melakukan polling ke endpoint `GET /chat/messages/:customerPhone` setiap **5 detik** saat popup terbuka.

**Alur Penerimaan Balasan**:
1. Pelanggan membalas pesan WA toko (melalui nomor WA toko yang terhubung Baileys).
2. Baileys menerima pesan masuk dan menyimpannya ke MongoDB `WAChatMessage` dengan `direction: "INBOUND"`.
3. Saat polling 5 detik berikutnya, frontend mendeteksi pesan baru.
4. Bubble pesan pelanggan muncul di chat popup.
5. Jika popup sedang diminimalisir: badge merah bertambah.

> ⚠️ **Catatan Penting**: Semua pesan masuk ke WA toko (dari nomor manapun) akan disimpan di MongoDB. Tetapi di chat popup, hanya pesan dari nomor WA pelanggan yang terkait (`customerPhone`) yang ditampilkan — bukan seluruh inbox WA toko.

---

### 5.5 Multi-Chat (Beberapa Popup Sekaligus)

- Karyawan dapat membuka maksimal **3 chat popup** secara bersamaan.
- Setiap popup independen: data berbeda, pelanggan berbeda.
- Popup ke-4 akan menutup popup yang paling lama tidak aktif secara otomatis dengan toast notifikasi: "Chat dengan Kak [nama] ditutup otomatis."

---

## 6. Perubahan Database

### MongoDB — Model Baru: `WAChatMessage`

```typescript
// backend/src/models-nosql/waChatMessage.model.ts
const WAChatMessageSchema = new Schema({
  adminId:       { type: String, required: true, index: true },
  customerPhone: { type: String, required: true, index: true },
  orderId:       { type: String, index: true },       // referensi ke LaundryOrder.id
  orderNumber:   { type: String },                    // denormalisasi untuk query cepat
  direction:     { type: String, enum: ['OUTBOUND', 'INBOUND'], required: true },
  senderName:    { type: String },                    // nama karyawan atau nama pelanggan
  senderRole:    { type: String, enum: ['EMPLOYEE', 'CUSTOMER'] },
  message:       { type: String, required: true },
  status:        { type: String, enum: ['SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'], default: 'SENT' },
  waMessageId:   { type: String },                    // ID pesan dari Baileys (untuk tracking)
  createdAt:     { type: Date, default: Date.now, index: true },
});

// Compound index untuk query efisien
WAChatMessageSchema.index({ adminId: 1, customerPhone: 1, createdAt: 1 });
WAChatMessageSchema.index({ adminId: 1, orderId: 1 });
```

---

## 7. Perubahan API Backend

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/chat/send` | Kirim pesan teks ke pelanggan via WA toko | Employee |
| `GET` | `/chat/messages/:customerPhone` | Ambil riwayat chat dengan nomor tertentu | Employee |
| `GET` | `/chat/unread-count/:customerPhone` | Jumlah pesan belum dibaca dari nomor tertentu | Employee |
| `PATCH` | `/chat/mark-read/:customerPhone` | Tandai pesan sebagai sudah dibaca | Employee |

### Request Body `POST /chat/send`:
```json
{
  "customerPhone": "081234567890",
  "orderId": "uuid-order-id",
  "orderNumber": "LK-2026-089",
  "message": "Halo Kak Rina, cucian sudah siap!"
}
```

### Response `GET /chat/messages/:customerPhone`:
```json
{
  "messages": [
    {
      "id": "mongo-id",
      "direction": "OUTBOUND",
      "senderName": "Budi (Kasir)",
      "message": "Halo Kak Rina...",
      "status": "SENT",
      "createdAt": "2026-08-08T10:23:00Z"
    },
    {
      "id": "mongo-id-2",
      "direction": "INBOUND",
      "senderName": "Ibu Rina",
      "message": "Oke, terima kasih!",
      "status": "RECEIVED",
      "createdAt": "2026-08-08T10:25:00Z"
    }
  ],
  "customerPhone": "081234567890",
  "totalUnread": 1
}
```

### File Backend Baru:
```
backend/src/controllers/chat.controller.ts
backend/src/routes/chat.routes.ts
backend/src/services/chat.service.ts
backend/src/models-nosql/waChatMessage.model.ts
```

### Modifikasi Baileys (`backend/src/whatsapp/baileys.ts`):
- Tambahkan handler untuk pesan masuk (`messages.upsert`) yang menyimpan pesan INBOUND dari pelanggan ke `WAChatMessage`.

---

## 8. Perubahan Frontend

### File Baru:
| File | Deskripsi |
|---|---|
| `frontend/src/components/ui/ChatPopup.tsx` | Komponen utama popup chat (standalone) |
| `frontend/src/components/ui/ChatBubble.tsx` | Komponen bubble pesan individual |
| `frontend/src/components/ui/ChatMinimizedBubble.tsx` | Komponen floating bubble minimize |
| `frontend/src/hooks/useChat.ts` | Custom hook: state management + polling logic |
| `frontend/src/context/ChatContext.tsx` | Context provider untuk multi-chat state global |

### Modifikasi File:
| File | Perubahan |
|---|---|
| `frontend/src/app/karyawan/laundry/page.tsx` | Tambah tombol 💬 di kolom aksi tabel cucian + import ChatContext |
| `frontend/src/app/karyawan/layout.tsx` atau `layout.tsx` | Wrap dengan `ChatContextProvider` + render `ChatPopupContainer` |

### State Management Chat (Context):
```typescript
interface ChatState {
  openChats: ChatSession[];          // Max 3 chat terbuka
  minimizedChats: string[];          // customerPhone yang diminimalisir
  unreadCounts: Record<string, number>; // nomor phone → jumlah pesan belum baca
}

interface ChatSession {
  customerPhone: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  messages: ChatMessage[];
  isMinimized: boolean;
  lastPolledAt?: Date;
}
```

---

## 9. Arsitektur Teknis

```
[Karyawan klik 💬 di baris cucian]
        │
        ▼
[ChatContext.openChat({ customerPhone, orderId, ... })]
        │
        ▼
[GET /chat/messages/:phone → Load riwayat dari MongoDB]
        │
        ▼
[ChatPopup muncul di kanan bawah]
        │
        ├── [Polling GET /chat/messages setiap 5 detik]
        │         └── Deteksi pesan INBOUND baru → render bubble pelanggan
        │
        └── [Karyawan ketik + Kirim]
                  │
                  ▼
        [POST /chat/send → Backend → Baileys.sendText → WA Pelanggan]
                  │
                  ▼
        [Simpan ke MongoDB WAChatMessage (direction: OUTBOUND)]
                  │
                  ▼
        [Bubble muncul di popup dengan status ✓]
```

---

## 10. Pertimbangan Teknis & Keterbatasan

### A. Baileys & Pesan Masuk (INBOUND)
Baileys secara native menerima semua pesan masuk ke WA toko. Handler perlu diperbarui untuk:
- **Memfilter** hanya pesan dari nomor pelanggan yang ada di database (`Customer.phone`).
- **Menyimpan** pesan INBOUND ke `WAChatMessage` secara otomatis.
- **Tidak mengganggu** alur auto-reply status cucian yang sudah ada (cek nomor nota vs. chat bebas).

### B. Polling vs WebSocket
- Fase v1.0 menggunakan **polling 5 detik** karena infrastruktur WebSocket belum ada.
- Pada v2.0 dapat dimigrasi ke **Socket.io** atau **SSE (Server-Sent Events)** untuk real-time sejati.

### C. Nomor Telepon Normalisasi
- Semua nomor WA harus dalam format internasional tanpa `+`: `628xxxxxxx`.
- Sistem harus menormalkan input seperti `08xxx` → `628xxx` sebelum query.

---

## 11. Kriteria Penerimaan (Acceptance Criteria)

- [x] Karyawan melihat tombol 💬 di setiap baris cucian dengan pelanggan yang memiliki nomor WA.
- [x] Tombol 💬 disabled jika WA toko tidak terhubung, dengan tooltip penjelasan.
- [x] Chat popup terbuka dengan header informasi pelanggan dan nomor nota.
- [x] Riwayat pesan sebelumnya dimuat otomatis saat popup dibuka.
- [x] Karyawan dapat mengirim pesan teks dan melihat bubble pesan di popup.
- [x] Pelanggan menerima pesan WA dari nomor WA toko setelah karyawan kirim.
- [x] Balasan pelanggan muncul di popup dalam waktu ≤ 10 detik (2 siklus polling).
- [x] Popup dapat diminimalisir menjadi floating bubble tanpa kehilangan riwayat chat.
- [x] Badge merah pada floating bubble muncul saat ada pesan masuk baru.
- [x] Maksimal 3 popup chat dapat dibuka bersamaan.
- [x] Popup chat ke-4 menutup popup tertua dengan notifikasi toast.
- [x] Karyawan tidak dapat mengakses chat dengan nomor pelanggan di luar admin toko mereka.

---

## 12. Estimasi Pengerjaan

| Task | Estimasi |
|---|---|
| Backend: MongoDB model WAChatMessage | 0.5 hari |
| Backend: API Chat (send + history) | 1 hari |
| Backend: Baileys INBOUND message handler | 0.5 hari |
| Frontend: ChatContext + useChat hook | 1 hari |
| Frontend: ChatPopup + ChatBubble UI | 1.5 hari |
| Frontend: Minimized bubble + badge | 0.5 hari |
| Frontend: Integrasi ke halaman cucian karyawan | 0.5 hari |
| Testing & QA | 0.5 hari |
| **Total** | **6 hari** |

---

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| WA toko sering disconnect | Tampilkan status WA di header chat + retry otomatis koneksi |
| Baileys menerima terlalu banyak pesan masuk dari luar | Filter hanya nomor yang ada di database Customer |
| Polling 5 detik membebani server | Hentikan polling saat popup diminimalisir; gunakan backoff strategy |
| Nomor WA format tidak konsisten | Normalisasi semua nomor ke format `628xxx` sebelum kirim/query |
