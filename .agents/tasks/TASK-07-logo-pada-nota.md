# TASK-07 — Logo Toko pada Nota Cetak

**Status:** ✅ Selesai  
**Prioritas:** 🟡 Sedang  
**Estimasi:** 2–3 jam  
**Prasyarat:** TASK-02 harus selesai terlebih dahulu (agar field `storeLogo` sudah terisi)

---

## 🎯 Tujuan

Menampilkan logo toko di nota cetak pesanan. Jika admin sudah mengupload logo (field `storeLogo` pada model `Admin` tidak null), gunakan logo tersebut. Jika belum ada logo, gunakan logo default LaundryKu.

---

## 📌 Konteks Penting (Baca Sebelum Coding)

### Cara Kerja Nota Saat Ini

Cari komponen atau halaman yang menampilkan nota cetak. Cari dengan keyword di `frontend/src/`:
- `nota` atau `receipt` atau `print` atau `invoice`
- Cari file `.tsx` yang berisi elemen `<table>` atau layout seperti nota, atau yang dipanggil saat klik tombol "Cetak Nota"

Buka file tersebut dan pahami:
1. Dari mana data order diambil (props, state, atau API?)
2. Apakah data store/admin sudah tersedia di komponen tersebut?

### Data yang Diperlukan di Nota

Nota perlu menampilkan:
- **Logo toko** (dari `storeLogo` admin, atau fallback ke logo LaundryKu)
- **Nama toko** (dari `storeName` admin)
- **Alamat toko** (dari `storeAddress` admin)
- **Nomor telepon toko** (dari `storePhone` admin)

### Logo Default LaundryKu

Jika tidak ada logo toko, tampilkan teks logo terstyle dengan CSS:

```tsx
{/* Logo default LaundryKu - teks bergaya */}
<div style={{ fontWeight: 'bold', fontSize: '20px', color: '#1e40af', letterSpacing: '1px' }}>
  🧺 LaundryKu
</div>
```

---

## 🔧 FASE 1 — Pastikan Data Store Tersedia di Nota

**Langkah:** Cari komponen nota cetak di frontend.

Buka file komponen nota. Identifikasi apakah data store (storeLogo, storeName, dll) sudah tersedia:

**Jika data store BELUM tersedia di komponen nota:**

Tambahkan pemanggilan API untuk mendapatkan data store. Tambahkan state dan useEffect:

```typescript
const [storeData, setStoreData] = useState<{
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeLogo?: string;
} | null>(null);

useEffect(() => {
  const fetchStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setStoreData(result.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data toko:', err);
    }
  };
  fetchStore();
}, []);
```

**Jika data store SUDAH tersedia:** Lanjut ke Fase 2 langsung.

---

## 🔧 FASE 2 — Tambahkan Logo di Komponen Nota

**File yang diubah:** File komponen nota cetak (hasil temuan dari langkah di atas).

Tambahkan bagian logo di **bagian paling atas** dari layout nota, tepat sebelum nama toko:

```tsx
{/* Header Nota dengan Logo */}
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '12px',
}}>
  {/* Logo Toko atau Logo Default */}
  {storeData?.storeLogo ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}/${storeData.storeLogo}`}
      alt={`Logo ${storeData.storeName}`}
      style={{
        width: '64px',
        height: '64px',
        objectFit: 'contain',
        marginBottom: '8px',
      }}
      onError={(e) => {
        // Jika gambar gagal dimuat, sembunyikan dan tampilkan teks fallback
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : (
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '4px',
    }}>
      🧺 LaundryKu
    </div>
  )}

  {/* Nama Toko */}
  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
    {storeData?.storeName || 'Laundry'}
  </div>

  {/* Alamat Toko (jika ada) */}
  {storeData?.storeAddress && (
    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
      {storeData.storeAddress}
    </div>
  )}

  {/* Telepon Toko (jika ada) */}
  {storeData?.storePhone && (
    <div style={{ fontSize: '11px', color: '#6b7280' }}>
      Telp: {storeData.storePhone}
    </div>
  )}
</div>
```

**Penting tentang styling:**
- Gunakan inline style (bukan className Tailwind) untuk elemen yang akan dicetak dengan `window.print()`, karena Tailwind mungkin tidak ter-render di mode print.
- Semua elemen dalam nota yang dicetak **harus** menggunakan inline style atau CSS class yang pasti ter-render saat print.

---

## 🔧 FASE 3 — Verifikasi Print CSS

**File yang diubah:** File CSS global atau file nota yang berisi `@media print`.

Pastikan ada CSS berikut untuk memastikan logo tercetak dengan benar:

```css
@media print {
  /* Pastikan gambar logo tercetak */
  img {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* Sembunyikan tombol-tombol saat cetak */
  .no-print {
    display: none !important;
  }
}
```

Jika sudah ada `@media print` di file CSS, cukup tambahkan rule `img` di dalamnya. Jangan duplikat `@media print`.

---

## 🔧 FASE 4 — Pengecekan Kondisi Edge Case

Pastikan komponen nota menangani kondisi berikut dengan benar:

| Kondisi | Perilaku yang Diharapkan |
|---------|--------------------------|
| `storeLogo` ada dan URL valid | Tampilkan gambar logo toko |
| `storeLogo` ada tapi URL broken | `onError` handler menyembunyikan `<img>`, tidak tampilkan logo apapun (tidak error) |
| `storeLogo` null/undefined | Tampilkan teks "🧺 LaundryKu" |
| `storeData` masih loading (null) | Tampilkan placeholder atau teks toko sementara |
| `storeName` null | Tampilkan "Laundry" sebagai fallback |

---

## ✅ Checklist Verifikasi

**Persiapan test:**
1. Pastikan ada admin dengan `storeLogo` yang sudah diisi (gunakan hasil TASK-02)
2. Buat satu order test

**Checklist:**
- [x] Nota cetak menampilkan logo toko ketika `storeLogo` sudah diisi
- [x] Gambar logo proporsional, tidak terlalu besar/kecil (max 64×64 px)
- [x] Jika logo tidak ada, nota menampilkan teks "🧺 LaundryKu" sebagai pengganti
- [x] Nama toko muncul di bawah logo
- [x] Alamat toko muncul jika `storeAddress` tidak kosong
- [x] Nomor telepon toko muncul jika `storePhone` tidak kosong
- [x] Saat `window.print()` dipanggil, logo tercetak (tidak kosong/blank)
- [x] Tidak ada error di console saat nota dibuka

---

## 🚫 Larangan

- JANGAN mengubah layout nota yang sudah ada secara besar-besaran — hanya tambahkan bagian logo di header
- JANGAN menggunakan URL logo yang hardcoded — selalu ambil dari `storeData.storeLogo`
- JANGAN menghapus informasi yang sudah ada di nota (nomor order, item, harga, dll)
- JANGAN mengubah logika kalkulasi nota
