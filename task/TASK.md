# 🛠️ LaundryKu — Engineering Task Prompt (v2)

> **Stack:** Node.js + Express + TypeScript (backend) · Next.js 14 App Router + Tailwind CSS (frontend) · Prisma + PostgreSQL · Baileys (WhatsApp) · node-telegram-bot-api
> **Root:** `c:\Users\M S I\Documents\webapp\LaundryKu\`
> **Backend port:** `4001` · **Frontend port:** `3001`

---

## FITUR 1 — Fix Bug: Backup Telegram Tidak Mengirim File

### Deskripsi Bug

Notifikasi Telegram muncul (pesan teks terkirim) tetapi **file ZIP backup tidak pernah terkirim**. Akar masalahnya:

Di `backend/src/services/telegram.service.ts`, `botConfig` adalah object in-memory. `chatId` hanya tersimpan di RAM. Saat server restart, `chatId` hilang sehingga `sendFileToTelegram()` return `false` karena kondisi `!botConfig.chatId` terpenuhi. Notifikasi teks terkirim hanya karena `sendMessageToTelegram()` dipanggil sebelum pengecekan chatId di konteks lain.

### File yang Diubah: `backend/src/services/telegram.service.ts`

**Tambahkan import `fs` dan `path` di baris paling atas** (jika belum ada):

```typescript
import fs from 'fs';
import path from 'path';
```

**Tambahkan konstanta CONFIG_FILE** tepat setelah blok deklarasi `botConfig`:

```typescript
const CONFIG_FILE = path.resolve(process.cwd(), 'backups', 'telegram-config.json');
```

**Tambahkan fungsi `savePersistedConfig()`** setelah deklarasi `botConfig`:

```typescript
function savePersistedConfig() {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      token: botConfig.token,
      chatId: botConfig.chatId,
      botUsername: botConfig.botUsername,
    }, null, 2));
  } catch (e) {
    console.error('Failed to save telegram config:', e);
  }
}
```

**Tambahkan fungsi `loadPersistedConfig()`** setelah `savePersistedConfig()`:

```typescript
function loadPersistedConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return;
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const saved = JSON.parse(raw);
    if (saved.token) {
      botConfig.token = saved.token;
      botConfig.chatId = saved.chatId || null;
      botConfig.botUsername = saved.botUsername || null;
      console.log('📂 Telegram config loaded from disk. Auto-reconnecting...');
      // Fire and forget — tidak di-await agar tidak block module load
      connectTelegramBot(saved.token).catch((e) =>
        console.error('Auto-reconnect Telegram failed:', e.message)
      );
    }
  } catch (e) {
    console.error('Failed to load telegram config:', e);
  }
}
```

**Di fungsi `connectTelegramBot()`**: Setelah baris `botConfig.isConnected = true;`, tambahkan:

```typescript
savePersistedConfig();
```

**Di dalam handler `/start` bot** (di dalam `connectTelegramBot()`): Setelah baris `botConfig.chatId = chatId;`, tambahkan:

```typescript
savePersistedConfig();
```

**Di fungsi `setChatId()`**: Setelah baris `connectedChatId = chatId;`, tambahkan:

```typescript
savePersistedConfig();
```

**Di fungsi `disconnectTelegramBot()`**: Di akhir fungsi sebelum return, tambahkan:

```typescript
try {
  if (fs.existsSync(CONFIG_FILE)) fs.unlinkSync(CONFIG_FILE);
} catch {}
```

**Di fungsi `sendFileToTelegram()`**: Ganti seluruh isi try-block dengan versi yang ada validasi file path:

```typescript
try {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Backup file not found at path: ${filePath}`);
    return false;
  }
  const stats = fs.statSync(filePath);
  console.log(`📦 Sending file to Telegram: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  await botInstance.sendDocument(botConfig.chatId, filePath, {
    caption,
    parse_mode: 'Markdown',
  });
  console.log(`✅ Backup file sent to Telegram chat ${botConfig.chatId}`);
  return true;
} catch (error: any) {
  console.error('❌ Failed to send file to Telegram:', error.message);
  return false;
}
```

**Di baris PALING BAWAH file** (setelah semua export function dideklarasikan), tambahkan satu baris:

```typescript
// Auto-restore telegram config on server startup
loadPersistedConfig();
```

---

## FITUR 2 — Download Laporan Gabungan (Pemasukan + Pengeluaran dalam 1 File CSV)

### Konsep

Download pemasukan dan pengeluaran dijadikan **1 file CSV gabungan** dengan struktur dua section:
- Section 1: Data Pemasukan (dengan kolom lengkap)
- Section 2: Data Pengeluaran
- Section 3: Ringkasan (total pemasukan, total pengeluaran, selisih)

Format nama file: `laporan-keuangan-{bulan}-{tahun}.csv`

Endpoint baru yang akan dibuat: `GET /api/expenses/export/combined?month=X&year=Y`

### File yang Diubah: `backend/src/services/expense.service.ts`

**Ganti seluruh fungsi `getIncomeSummary()`** (baris 99–132) dengan versi yang include data customer:

```typescript
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
    select: {
      orderNumber: true,
      totalPrice: true,
      dateIn: true,
      paymentMethod: true,
      customer: { select: { name: true, phone: true } },
    },
    orderBy: { dateIn: 'desc' },
  });

  return orders.map((o) => ({
    orderNumber: o.orderNumber,
    customerName: o.customer?.name || '-',
    customerPhone: o.customer?.phone || '-',
    amount: Number(o.totalPrice),
    paymentMethod: o.paymentMethod || 'CASH',
    date: o.dateIn.toISOString().slice(0, 10),
  }));
}
```

### File yang Diubah: `backend/src/controllers/expense.controller.ts`

**Ganti seluruh fungsi `exportIncomeCSV()`** dengan versi kolom lengkap:

```typescript
export async function exportIncomeCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const income = await getIncomeSummary(adminId, { month, year });

    const headers = ['No. Nota', 'Tanggal', 'Nama Pelanggan', 'No. HP Pelanggan', 'Metode Bayar', 'Jumlah (Rp)'];
    const rows = income.map((i) => [
      i.orderNumber,
      new Date(i.date).toLocaleDateString('id-ID'),
      i.customerName,
      i.customerPhone,
      i.paymentMethod,
      i.amount.toFixed(0),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const label = month ? `${month}-${year || 'semua'}` : `${year || 'semua'}`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pemasukan-${label}.csv"`);
    res.send('\uFEFF' + csvContent);
  } catch (error: any) {
    next(error);
  }
}
```

**Tambahkan fungsi baru `exportCombinedCSV()`** di akhir file (setelah `exportIncomeCSV()`):

```typescript
// Export CSV Gabungan: Pemasukan + Pengeluaran dalam 1 file
export async function exportCombinedCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const [income, expenses] = await Promise.all([
      getIncomeSummary(adminId, { month, year }),
      getExpenses(adminId, { month, year }),
    ]);

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const selisih = totalIncome - totalExpense;

    const escapeCell = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
    const row = (cells: string[]) => cells.map(escapeCell).join(',');

    const lines: string[] = [];

    // === SECTION 1: PEMASUKAN ===
    lines.push(row(['=== LAPORAN PEMASUKAN ===', '', '', '', '', '']));
    lines.push(row(['No. Nota', 'Tanggal', 'Nama Pelanggan', 'No. HP', 'Metode Bayar', 'Jumlah (Rp)']));
    if (income.length === 0) {
      lines.push(row(['(Tidak ada data)', '', '', '', '', '']));
    } else {
      income.forEach((i) => {
        lines.push(row([
          i.orderNumber,
          new Date(i.date).toLocaleDateString('id-ID'),
          i.customerName,
          i.customerPhone,
          i.paymentMethod,
          i.amount.toFixed(0),
        ]));
      });
    }
    lines.push(row(['', '', '', '', 'TOTAL PEMASUKAN', totalIncome.toFixed(0)]));
    lines.push(row(['', '', '', '', '', ''])); // baris kosong pemisah

    // === SECTION 2: PENGELUARAN ===
    lines.push(row(['=== LAPORAN PENGELUARAN ===', '', '', '', '', '']));
    lines.push(row(['Tanggal', 'Kategori', 'Keterangan', 'Jumlah (Rp)', '', '']));
    if (expenses.length === 0) {
      lines.push(row(['(Tidak ada data)', '', '', '', '', '']));
    } else {
      expenses.forEach((e) => {
        lines.push(row([
          new Date(e.date).toLocaleDateString('id-ID'),
          e.category,
          e.description || '-',
          Number(e.amount).toFixed(0),
          '',
          '',
        ]));
      });
    }
    lines.push(row(['', '', 'TOTAL PENGELUARAN', totalExpense.toFixed(0), '', '']));
    lines.push(row(['', '', '', '', '', ''])); // baris kosong pemisah

    // === SECTION 3: RINGKASAN ===
    lines.push(row(['=== RINGKASAN KEUANGAN ===', '', '', '', '', '']));
    lines.push(row(['Total Pemasukan', `Rp ${totalIncome.toLocaleString('id-ID')}`, '', '', '', '']));
    lines.push(row(['Total Pengeluaran', `Rp ${totalExpense.toLocaleString('id-ID')}`, '', '', '', '']));
    lines.push(row([selisih >= 0 ? 'Keuntungan Bersih' : 'Defisit', `Rp ${Math.abs(selisih).toLocaleString('id-ID')}`, '', '', '', '']));

    const csvContent = '\uFEFF' + lines.join('\n'); // BOM untuk Excel encoding

    const bulanNama = month
      ? new Date(year || new Date().getFullYear(), month - 1, 1).toLocaleString('id-ID', { month: 'long' })
      : 'semua-bulan';
    const labelTahun = year || new Date().getFullYear();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${bulanNama}-${labelTahun}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    next(error);
  }
}
```

### File yang Diubah: `backend/src/routes/expense.routes.ts`

**Tambahkan import fungsi `exportCombinedCSV`** ke destructuring import dari controller (baris 4–10):

```typescript
import {
  addExpense,
  listExpenses,
  removeExpense,
  getIncome,
  getChartData,
  exportExpensesCSV,
  exportIncomeCSV,
  exportCombinedCSV,   // ← tambahkan ini
} from '../controllers/expense.controller.js';
```

**Tambahkan route baru** di bawah route export yang sudah ada:

```typescript
// Export CSV Gabungan (Pemasukan + Pengeluaran dalam 1 file)
router.get('/export/combined', exportCombinedCSV);
```

### File yang Diubah: `frontend/src/app/admin/reports/page.tsx`

Baca isi file ini terlebih dahulu — saat ini sudah ada struktur grafik analitik dan tombol "Ekspor Laporan (CSV)". **Jangan hapus komponen yang sudah ada.** Hanya tambahkan section baru.

**Tambahkan 2 state baru** di dalam komponen, setelah state-state yang sudah ada:

```typescript
const [reportMonth, setReportMonth] = useState<number>(new Date().getMonth() + 1);
const [reportYear, setReportYear] = useState<number>(new Date().getFullYear());
const [isDownloading, setIsDownloading] = useState(false);
```

**Tambahkan fungsi `downloadLaporanGabungan()`** di dalam komponen, setelah fungsi `handleExportCSV` yang sudah ada:

```typescript
const downloadLaporanGabungan = async () => {
  try {
    setIsDownloading(true);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const url = `${apiUrl}/api/expenses/export/combined?month=${reportMonth}&year=${reportYear}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error('Gagal mendownload laporan');
    const blob = await response.blob();
    const bulanNama = new Date(reportYear, reportMonth - 1, 1).toLocaleString('id-ID', { month: 'long' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-keuangan-${bulanNama}-${reportYear}.csv`;
    link.click();
  } catch {
    alert('Gagal mendownload laporan. Coba lagi.');
  } finally {
    setIsDownloading(false);
  }
};
```

**Tambahkan section JSX berikut** di dalam return, setelah div penutup `</div>` section grid 2-kolom (package & employee stats), sebelum penutup `</div>` utama `space-y-8`:

```tsx
{/* Section Download Laporan Keuangan */}
<div className="glass-card-dark p-6 rounded-3xl border border-slate-800">
  <div className="flex items-center gap-2 mb-1">
    <Download className="w-5 h-5 text-emerald-400" />
    <h2 className="text-base font-bold text-white">Download Laporan Keuangan</h2>
  </div>
  <p className="text-xs text-slate-400 mb-5">
    Download rekap pemasukan dan pengeluaran dalam <strong className="text-slate-300">1 file CSV gabungan</strong> berdasarkan bulan & tahun. File dapat dibuka langsung di Microsoft Excel atau Google Sheets.
  </p>

  <div className="flex flex-col sm:flex-row gap-4 items-end">
    <div>
      <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Bulan</label>
      <select
        value={reportMonth}
        onChange={(e) => setReportMonth(parseInt(e.target.value))}
        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[140px]"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Tahun</label>
      <select
        value={reportYear}
        onChange={(e) => setReportYear(parseInt(e.target.value))}
        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[100px]"
      >
        {[2024, 2025, 2026, 2027].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>

    <button
      onClick={downloadLaporanGabungan}
      disabled={isDownloading}
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
    >
      {isDownloading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Memproses...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Laporan Gabungan (CSV)
        </>
      )}
    </button>
  </div>

  <p className="text-[10px] text-slate-500 mt-3">
    💡 File berisi 3 section: Pemasukan · Pengeluaran · Ringkasan Keuangan
  </p>
</div>
```

> **Catatan:** Endpoint individual `GET /api/expenses/export/income` dan `GET /api/expenses/export/expenses` tetap dipertahankan — tidak dihapus. Tombol di `admin/expenses/page.tsx` tetap berfungsi seperti semula.

---

## FITUR 3 — Pesan WhatsApp ke Pelanggan Berupa Gambar Nota

### Konsep

Tambahkan kemampuan mengirim **gambar PNG nota digital** ke WhatsApp pelanggan menggunakan Puppeteer (render HTML → screenshot PNG) + Baileys (`sendMessage` dengan payload `{ image: ... }`). Fungsi `sendOrderWANotification()` yang sudah ada **tidak diubah** — hanya ditambahkan fungsi baru.

### Step 1: Install Dependency

Jalankan di direktori `backend/`:

```bash
npm install puppeteer
```

> Puppeteer akan mendownload Chromium ~170MB. Tunggu hingga selesai.

### Step 2: File Baru `backend/src/utils/generateNotaImage.ts`

Buat file baru dengan isi berikut:

```typescript
import puppeteer from 'puppeteer';

export interface NotaData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentLabel: string;
  items: Array<{
    packageName: string;
    categoryName: string;
    quantity: string;
    unit: string;
    price: string;
    subtotal: string;
  }>;
  totalPrice: string;
  notes?: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

export async function generateNotaImage(data: NotaData): Promise<Buffer> {
  const statusColors: Record<string, string> = {
    RECEIVED: '#f59e0b',
    IN_PROGRESS: '#3b82f6',
    DONE: '#10b981',
    PICKED_UP: '#6b7280',
  };
  const statusColor = statusColors[data.status] || '#6b7280';

  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;border-bottom:1px solid #f1f5f9;">
        ${item.packageName} <span style="color:#64748b;">(${item.categoryName})</span>
      </td>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;text-align:center;border-bottom:1px solid #f1f5f9;">
        ${item.quantity} ${item.unit}
      </td>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;text-align:right;border-bottom:1px solid #f1f5f9;">
        ${item.price}
      </td>
      <td style="padding:6px 8px;font-size:11px;font-weight:600;color:#0f172a;text-align:right;border-bottom:1px solid #f1f5f9;">
        ${item.subtotal}
      </td>
    </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; background:#fff; width:400px; }
    .nota { background:#fff; width:400px; border-radius:12px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1e3a5f,#0f2d52); padding:20px; text-align:center; color:white; }
    .store-name { font-size:18px; font-weight:700; }
    .store-info { font-size:10px; color:#94a3b8; margin-top:4px; }
    .nota-title { background:#f8fafc; border-bottom:2px solid #e2e8f0; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; }
    .nota-number { font-size:14px; font-weight:700; color:#0f172a; }
    .status-badge { font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; color:white; background:${statusColor}; }
    .info-grid { padding:14px 20px; display:grid; grid-template-columns:1fr 1fr; gap:10px; background:#f8fafc; }
    .info-item label { font-size:9px; color:#94a3b8; text-transform:uppercase; display:block; }
    .info-item span { font-size:12px; font-weight:600; color:#1e293b; display:block; margin-top:2px; }
    .items-section { padding:14px 20px; }
    .items-title { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:8px; }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#f1f5f9; }
    thead th { padding:6px 8px; font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase; }
    thead th:not(:first-child) { text-align:right; }
    thead th:nth-child(2) { text-align:center; }
    .total-row { background:#0f2d52; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; }
    .total-label { color:#94a3b8; font-size:12px; font-weight:600; }
    .total-amount { color:#fff; font-size:18px; font-weight:800; }
    .payment-row { padding:10px 20px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; }
    .payment-label { font-size:10px; color:#64748b; }
    .payment-paid { font-size:12px; font-weight:700; color:#10b981; }
    .payment-unpaid { font-size:12px; font-weight:700; color:#ef4444; }
    .notes-row { padding:8px 20px; background:#fffbeb; border-top:1px solid #fde68a; font-size:10px; color:#92400e; }
    .footer { padding:12px 20px; text-align:center; font-size:10px; color:#94a3b8; background:#f8fafc; border-top:1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="nota">
    <div class="header">
      <div class="store-name">${data.storeName}</div>
      <div class="store-info">${data.storeAddress}</div>
      <div class="store-info">${data.storePhone}</div>
    </div>
    <div class="nota-title">
      <span class="nota-number">📄 #${data.orderNumber}</span>
      <span class="status-badge">${data.statusLabel}</span>
    </div>
    <div class="info-grid">
      <div class="info-item"><label>Pelanggan</label><span>${data.customerName}</span></div>
      <div class="info-item"><label>No. HP</label><span>${data.customerPhone}</span></div>
      <div class="info-item"><label>Tanggal Masuk</label><span>${data.dateIn}</span></div>
      <div class="info-item"><label>Est. Selesai</label><span>${data.estimatedDone}</span></div>
    </div>
    <div class="items-section">
      <div class="items-title">Rincian Cucian</div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Item</th>
            <th>Qty</th>
            <th style="text-align:right;">Harga</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>
    <div class="total-row">
      <span class="total-label">TOTAL TAGIHAN</span>
      <span class="total-amount">${data.totalPrice}</span>
    </div>
    <div class="payment-row">
      <span class="payment-label">Status Pembayaran:</span>
      <span class="${data.paymentStatus === 'PAID' ? 'payment-paid' : 'payment-unpaid'}">${data.paymentLabel}</span>
    </div>
    ${data.notes ? `<div class="notes-row">📝 Catatan: ${data.notes}</div>` : ''}
    <div class="footer">Terima kasih telah mempercayakan cucian Anda kepada kami! 🙏</div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 400, height: 800, deviceScaleFactor: 2 });
    const element = await page.$('.nota');
    if (!element) throw new Error('Nota element not found');
    const imageBuffer = await element.screenshot({ type: 'png' });
    return Buffer.from(imageBuffer);
  } finally {
    await browser.close();
  }
}
```

### Step 3: File Baru `backend/src/utils/formatOrderForNota.ts`

Buat file baru dengan isi berikut:

```typescript
import { NotaData } from './generateNotaImage.js';

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROGRESS: 'Diproses',
  DONE: 'Selesai',
  PICKED_UP: 'Diambil',
};

export function formatOrderForNota(order: any, adminStore: any): NotaData {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer?.name || 'Pelanggan',
    customerPhone: order.customer?.phone || '-',
    dateIn: new Date(order.dateIn).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    estimatedDone: order.estimatedDone
      ? new Date(order.estimatedDone).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : '-',
    status: order.status,
    statusLabel: STATUS_LABELS[order.status] || order.status,
    paymentStatus: order.paymentStatus,
    paymentLabel: order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR',
    items: (order.items || []).map((i: any) => ({
      packageName: i.package?.name || 'Paket',
      categoryName: i.category?.name || 'Reguler',
      quantity: Number(i.quantity).toString(),
      unit: i.package?.unit || 'Kg',
      price: `Rp ${Number(i.price).toLocaleString('id-ID')}`,
      subtotal: `Rp ${Number(i.subtotal).toLocaleString('id-ID')}`,
    })),
    totalPrice: `Rp ${Number(order.totalPrice).toLocaleString('id-ID')}`,
    notes: order.notes || undefined,
    storeName: adminStore?.storeName || 'LaundryKu',
    storeAddress: adminStore?.storeAddress || '-',
    storePhone: adminStore?.storePhone || '-',
  };
}
```

### Step 4: File yang Diubah `backend/src/whatsapp/baileys.ts`

**Tambahkan import berikut** di bagian atas file (setelah import-import yang sudah ada):

```typescript
import { generateNotaImage } from '../utils/generateNotaImage.js';
import { formatOrderForNota } from '../utils/formatOrderForNota.js';
import os from 'os';
```

**Tambahkan fungsi baru berikut** di AKHIR file (setelah fungsi `confirmWAPairingSimulated()`):

```typescript
export async function sendOrderWANotificationWithImage(
  adminId: string,
  order: any,
  type: 'ORDER_RECEIVED' | 'ORDER_IN_PROGRESS' | 'ORDER_DONE' | 'ORDER_PICKED_UP'
): Promise<boolean> {
  try {
    const active = activeSessions[adminId];
    if (!active?.socket || active.status !== 'CONNECTED') {
      console.log(`ℹ️ WA socket not connected for ${adminId}, cannot send nota image.`);
      return false;
    }

    const adminStore = await prisma.admin.findUnique({ where: { id: adminId } });
    const notaData = formatOrderForNota(order, adminStore);
    const imageBuffer = await generateNotaImage(notaData);

    const tempPath = path.join(os.tmpdir(), `nota-${order.orderNumber}-${Date.now()}.png`);
    fs.writeFileSync(tempPath, imageBuffer);

    let formattedPhone = (order.customer?.phone || '').replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }
    if (!formattedPhone) {
      console.warn(`⚠️ No phone number for order ${order.orderNumber}, skipping WA image send.`);
      return false;
    }

    const jid = `${formattedPhone}@s.whatsapp.net`;

    const captions: Record<string, string> = {
      ORDER_RECEIVED: `🧺 Cucian Anda telah diterima!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_IN_PROGRESS: `🧼 Cucian Anda sedang diproses!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_DONE: `🎉 Cucian Anda SELESAI dan siap diambil!\nNota #${order.orderNumber} — lihat detail di gambar.`,
      ORDER_PICKED_UP: `✅ Terima kasih telah mengambil cucian!\nNota #${order.orderNumber}`,
    };

    await active.socket.sendMessage(jid, {
      image: { url: tempPath },
      caption: captions[type] || `Nota #${order.orderNumber}`,
      mimetype: 'image/png',
    });

    console.log(`🖼️ Nota image sent via WA to ${formattedPhone} for order #${order.orderNumber}`);

    try { fs.unlinkSync(tempPath); } catch {}

    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send nota image for ${order.orderNumber}:`, error.message);
    return false;
  }
}
```

### Step 5: File yang Diubah `backend/src/controllers/whatsapp.controller.ts`

**Tambahkan import di bagian atas file** (setelah import yang sudah ada):

```typescript
import { sendOrderWANotificationWithImage } from '../whatsapp/baileys.js';
import { prisma } from '../config/database.js';
```

**Tambahkan fungsi baru berikut** di akhir file:

```typescript
export async function sendNotaImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { orderId } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    if (!orderId) {
      res.status(400).json({ success: false, error: 'orderId wajib diisi.' });
      return;
    }

    const order = await prisma.laundryOrder.findFirst({
      where: { id: orderId, adminId },
      include: {
        customer: true,
        items: {
          include: { package: true, category: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: 'Order tidak ditemukan.' });
      return;
    }

    const typeMap: Record<string, any> = {
      RECEIVED: 'ORDER_RECEIVED',
      IN_PROGRESS: 'ORDER_IN_PROGRESS',
      DONE: 'ORDER_DONE',
      PICKED_UP: 'ORDER_PICKED_UP',
    };

    const sent = await sendOrderWANotificationWithImage(
      adminId,
      order,
      typeMap[order.status] || 'ORDER_RECEIVED'
    );

    if (sent) {
      res.json({ success: true, message: 'Gambar nota berhasil dikirim ke WhatsApp pelanggan.' });
    } else {
      res.status(500).json({
        success: false,
        error: 'Gagal mengirim gambar nota. Pastikan WhatsApp sudah terhubung dan pelanggan memiliki nomor HP.',
      });
    }
  } catch (error: any) {
    next(error);
  }
}
```

### Step 6: File yang Diubah `backend/src/routes/whatsapp.routes.ts`

Baca isi file ini terlebih dahulu. Kemudian:

**Tambahkan `sendNotaImage`** ke destructuring import dari controller (cari baris `import { ... } from '../controllers/whatsapp.controller.js'` lalu tambahkan `sendNotaImage` di dalamnya).

**Tambahkan route baru** setelah route-route yang sudah ada (di dalam blok yang sudah dilindungi middleware `authenticate` + `authorize`):

```typescript
router.post('/send-nota-image', sendNotaImage);
```

### Step 7: File yang Diubah `frontend/src/app/admin/laundry/page.tsx`

Baca isi file ini terlebih dahulu. Kemudian:

**Tambahkan state baru:**

```typescript
const [isSendingNota, setIsSendingNota] = useState<string | null>(null);
```

**Tambahkan fungsi:**

```typescript
const handleSendNotaImage = async (orderId: string, customerName: string, customerPhone: string) => {
  if (!customerPhone) {
    alert('Pelanggan tidak memiliki nomor HP. Tidak bisa mengirim WA.');
    return;
  }
  if (!confirm(`Kirim gambar nota ke WhatsApp ${customerName} (${customerPhone})?`)) return;

  try {
    setIsSendingNota(orderId);
    const res = await api.post('/whatsapp/send-nota-image', { orderId });
    alert(res.data.message || 'Gambar nota berhasil dikirim!');
  } catch (err: any) {
    alert(err.response?.data?.error || 'Gagal mengirim gambar nota.');
  } finally {
    setIsSendingNota(null);
  }
};
```

**Tambahkan tombol** di kolom Aksi setiap baris order (hanya tampil jika pelanggan punya nomor HP):

```tsx
{order.customer?.phone && (
  <button
    id={`btn-send-nota-image-${order.id}`}
    onClick={() => handleSendNotaImage(order.id, order.customer?.name || '', order.customer?.phone || '')}
    disabled={isSendingNota === order.id}
    className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
    title="Kirim Nota sebagai Gambar WA"
  >
    {isSendingNota === order.id ? (
      <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
    ) : (
      <span className="text-xs">📷</span>
    )}
  </button>
)}
```

---

## FITUR 4 — Sinkronisasi Timezone Jakarta (WIB, UTC+7)

### Konteks

Saat ini tidak ada pengaturan timezone eksplisit di backend maupun frontend. Jika server berjalan di VPS dengan timezone UTC (default sebagian besar server Linux/Docker), maka semua timestamp akan salah 7 jam. Ini mempengaruhi:
- Timestamp di notifikasi Telegram
- Waktu di log cron backup
- Format tanggal di CSV export
- Format tanggal di pesan WhatsApp
- Waktu di grafik analytics

### Layer yang Harus Diupdate

#### Layer 1: Backend Environment Variable

**File: `backend/.env`**

Tambahkan satu baris di bawah baris `NODE_ENV=development`:

```env
TZ=Asia/Jakarta
```

Setelah menambahkan ini, restart backend dengan `npm run dev`. Node.js akan menggunakan TZ environment variable untuk semua operasi `new Date()` dan `.toLocaleString()`.

#### Layer 2: Backend `app.ts` (Runtime Set Timezone)

**File: `backend/src/app.ts`**

Tambahkan satu baris di baris **paling atas** file (sebelum semua import), untuk memastikan timezone di-set bahkan jika env var tidak terbaca:

```typescript
process.env.TZ = 'Asia/Jakarta';
```

Baris ini harus menjadi **baris pertama** di file `app.ts`, sebelum `import express from 'express'` dan import lainnya. Ini penting karena Node.js membaca TZ saat proses dimulai — setting TZ setelah import bisa tidak efektif untuk beberapa fungsi date internal.

#### Layer 3: Docker Compose (Development)

**File: `docker-compose.yml`**

Tambahkan environment variable `TZ` ke setiap service yang menjalankan kode aplikasi. Perlu dimodifikasi jika backend dijalankan via Docker. Saat ini file ini hanya berisi PostgreSQL, MongoDB, Redis — service ini tidak perlu TZ karena hanya database.

> **Catatan:** Jika backend di-run dengan `npm run dev` langsung (bukan via Docker), maka hanya Layer 1 dan Layer 2 yang perlu diubah.

#### Layer 4: Docker Compose Production

**File: `docker-compose.prod.yml`**

Di service `backend`, tambahkan satu baris environment variable di dalam blok `environment`:

```yaml
- TZ=Asia/Jakarta
```

Tambahkan tepat setelah baris `- NODE_ENV=production`, sehingga menjadi:

```yaml
environment:
  - NODE_ENV=production
  - TZ=Asia/Jakarta         # ← tambahkan baris ini
  - PORT=4001
  # ... (sisanya tidak berubah)
```

Di service `frontend`, tambahkan juga:

```yaml
environment:
  - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:4001/api}
  - TZ=Asia/Jakarta         # ← tambahkan baris ini
```

#### Layer 5: Frontend Next.js

Next.js (Node.js runtime di server-side) juga perlu timezone. Next.js **tidak otomatis** membaca `.env.local` untuk TZ — harus di-set via file konfigurasi.

**File: `frontend/next.config.mjs`**

Buka file ini, lalu tambahkan baris berikut di baris **paling atas** (sebelum baris `/** @type... */`):

```javascript
process.env.TZ = 'Asia/Jakarta';
```

Contoh hasil akhir `next.config.mjs`:

```javascript
process.env.TZ = 'Asia/Jakarta'; // ← tambahkan ini

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... isi yang sudah ada, jangan diubah
};

export default nextConfig;
```

#### Layer 6: Verifikasi Format Tanggal di Semua `toLocaleString()`

Setelah setting TZ, semua panggilan `new Date().toLocaleString('id-ID')` di codebase akan otomatis menggunakan timezone Jakarta. Tidak perlu mengubah kode yang sudah ada.

Namun, **tambahkan opsi `timeZone` secara eksplisit** di tempat-tempat kritis sebagai safeguard. Cari semua penggunaan `.toLocaleString('id-ID')` dan `.toLocaleDateString('id-ID')` di backend, lalu pastikan format yang digunakan adalah:

```typescript
// SEBELUM (tidak aman jika TZ belum di-set):
new Date().toLocaleString('id-ID')

// SESUDAH (selalu aman):
new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
```

File-file yang perlu diperiksa dan diupdate jika perlu:
- `backend/src/services/telegram.service.ts` — baris yang memanggil `.toLocaleString('id-ID')` di message template
- `backend/src/services/backup.service.ts` — baris timestamp di caption backup Telegram
- `backend/src/whatsapp/baileys.ts` — baris format tanggal di auto-reply message

Untuk setiap file tersebut, lakukan replace:
- `new Date().toLocaleString('id-ID')` → `new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })`
- `new Date(x).toLocaleDateString('id-ID', {...})` → tambahkan `timeZone: 'Asia/Jakarta'` ke dalam objek opsi yang sudah ada

---

## Urutan Pengerjaan

1. **Fitur 4 (Timezone Jakarta)** — Kerjakan pertama karena mempengaruhi semua fitur lain. Hanya ubah file config, tidak ada logic baru.
2. **Fitur 1 (Telegram Bug Fix)** — Modifikasi 1 file backend.
3. **Fitur 2 (Download CSV Gabungan)** — Modifikasi 2 file backend + 1 file frontend.
4. **Fitur 3 (Nota Gambar WA)** — Install puppeteer + buat 2 file utils + modifikasi 3 file backend + 1 file frontend.

---

## Checklist Verifikasi

### Fitur 4 (Timezone)
- [ ] `backend/.env` memiliki baris `TZ=Asia/Jakarta`
- [ ] Baris `process.env.TZ = 'Asia/Jakarta'` ada di baris pertama `backend/src/app.ts`
- [ ] `docker-compose.prod.yml` service `backend` memiliki `- TZ=Asia/Jakarta`
- [ ] `frontend/next.config.mjs` memiliki `process.env.TZ = 'Asia/Jakarta'` di baris pertama
- [ ] Jalankan `node -e "console.log(new Date().toLocaleString('id-ID'))"` di direktori backend — waktu harus menunjukkan WIB (UTC+7)

### Fitur 1 (Telegram)
- [ ] File `backend/backups/telegram-config.json` terbuat setelah bot connect + `/start` dikirim
- [ ] Setelah server restart, log menampilkan `"📂 Telegram config loaded from disk. Auto-reconnecting..."`
- [ ] Log `"📦 Sending file to Telegram: ... (X.XX MB)"` muncul saat backup berjalan
- [ ] File ZIP backup benar-benar terkirim ke Telegram

### Fitur 2 (CSV Gabungan)
- [ ] Endpoint `GET /api/expenses/export/combined?month=8&year=2026` merespons file CSV
- [ ] File CSV berisi 3 section: LAPORAN PEMASUKAN, LAPORAN PENGELUARAN, RINGKASAN KEUANGAN
- [ ] Kolom pemasukan: No. Nota, Tanggal, Nama Pelanggan, No. HP, Metode Bayar, Jumlah
- [ ] Halaman `admin/reports` menampilkan section "Download Laporan Keuangan" dengan 1 tombol download
- [ ] Nama file download: `laporan-keuangan-{nama-bulan}-{tahun}.csv`

### Fitur 3 (Nota Gambar WA)
- [ ] `npm install puppeteer` selesai tanpa error di folder `backend/`
- [ ] `POST /api/whatsapp/send-nota-image` dengan body `{ "orderId": "valid-uuid" }` merespons `{ "success": true }`
- [ ] Gambar PNG nota ter-generate dengan semua data order (nama toko, pelanggan, item, total)
- [ ] Gambar terkirim ke WhatsApp pelanggan dengan caption yang sesuai status order
- [ ] Tombol 📷 muncul di halaman laundry hanya untuk order yang pelanggannya punya nomor HP

---

## Yang TIDAK Boleh Diubah

- Fungsi `sendOrderWANotification()` yang ada di `baileys.ts` — jangan ubah, hanya tambahkan fungsi baru
- Path dan method semua endpoint yang sudah ada di `expense.routes.ts` — hanya tambah route baru `/export/combined`
- Schema Prisma `prisma/schema.prisma` — tidak perlu migrasi database apapun
- Tombol "Export Pemasukan" dan "Export Pengeluaran" di halaman `admin/expenses/page.tsx` — tetap dipertahankan
