# Rencana Pengembangan SEO (SEO Development Plan)
**Proyek:** LaundryKu (Sistem Manajemen Laundry Digital)
**Tujuan:** Meningkatkan visibilitas organik di mesin pencari, menguasai *keyword* bisnis laundry SaaS (Software as a Service), dan memperkuat elemen E-E-A-T (*Experience, Expertise, Authoritativeness, Trustworthiness*) di mata Google.

---

## ✅ Fase 1: Kredibilitas Dasar & E-E-A-T (Telah Diselesaikan)
Fase ini berfokus pada melengkapi informasi dasar eksistensi layanan yang dicari oleh bot pencari dan pengguna untuk membangun kepercayaan.

- [x] **Footer Multi-Kolom:** Mengubah navigasi agar semua *crawling links* tersedia di seluruh halaman.
- [x] **Halaman Informasi Perusahaan:** Pembuatan `/tentang-kami` dan `/kontak`.
- [x] **Halaman Edukasi:** Pembuatan `/faq` untuk menjawab keraguan konsumen di awal pencarian.
- [x] **Halaman Legalitas:** Pembuatan dokumen `/kebijakan-privasi` dan `/syarat-ketentuan`.

## ✅ Fase 2: Optimasi On-Page, Meta Data & Indexing (Selesai)
Fase ini berfokus pada aspek teknikal SEO di Next.js App Router agar halaman publik mudah diindeks.

- [x] **Optimasi Metadata (Title & Deskripsi Lanjutan):** Menargetkan varian *keywords* yang spesifik di halaman baru. (Misal: Title FAQ diubah menjadi "FAQ - Pertanyaan Seputar Aplikasi Kasir LaundryKu").
- [x] **robots.txt & Sitemaps:** 
  - Memastikan *bot* mesin pencari memiliki arahan indeksasi pada URL `sitemap.xml`.
  - Secara ketat mencegah *bot* merayapi folder rute internal seperti `/admin`, `/superadmin`, `/karyawan` untuk menjaga keamanan dan menghindari indeksasi URL yang harusnya di balik otentikasi (hindari isu "*Soft 404*").
- [x] **Audit Semantic HTML & Aksesibilitas (A11y):**
  - Penerapan alt-text deskriptif pada semua `<img />`.
  - Pemanfaatan heading tag yang berurutan (`H1`, `H2`, `H3`) di *landing page*.

## 🚀 Fase 3: Struktur *Use-Case* & Keyword Spesifik (Long-Tail Keywords)
Halaman depan difokuskan untuk hal yang umum. Untuk mendominasi kata kunci *niche*, layanan perlu dipecah ke halaman terpisah.

- [ ] **Pembuatan Folder Rute `/solusi`:**
  - `/solusi/aplikasi-laundry-kiloan` (Menargetkan market laundry kiloan).
  - `/solusi/sistem-laundry-sepatu` (Menargetkan pencarian premium cuci sepatu/tas).
  - `/solusi/kasir-laundry-satuan` (Menargetkan dry cleaning / satuan jas).
- [ ] **Pembuatan Folder Rute `/fitur` (Deep-dive internal links):**
  - `/fitur/notifikasi-whatsapp-otomatis`
  - `/fitur/laporan-keuangan-laundry`
  - Halaman terdedikasi membantu SEO menangkap pengguna yang secara spesifik mencari satu fitur tertentu di Google.

## 📝 Fase 4: Content Marketing & Traffic Magnet (Blog)
Tahap berinvestasi untuk mendatangkan* traffic* *top-of-funnel* (pengguna yang masih mencari ilmu dan belum tahu *brand* LaundryKu).

- [ ] **Membangun Layout `/blog` atau `/artikel`:** Terintegrasi dengan Headless CMS lokal atau API (seperti Contentful atau sekadar Markdown blog *under-the-hood*).
- [ ] **Klasterisasi Topik (Topical Authority):**
  - Menulis artikel edukatif: *"7 Cara Mencegah Karyawan Kasir Laundry Curang"*.
  - Artikel bisnis: *"Peralatan yang Dibutuhkan untuk Buka Loundry Kiloan Pemula"*.
  - Di akhir setiap artikel ditanamkan fitur CTA (Call to Action) ke pendaftaran aplikasi LaundryKu.
