# Rencana Strategis Pengembangan SEO & AEO/GEO: LaundryKu

> Dokumen Arsitektur & Strategi Visibilitas Pencarian Organik (Google SERP) dan Rekomendasi Mesin AI (ChatGPT, Claude, Gemini, Perplexity) untuk Platform **LaundryKu**.

---

## 1. Ringkasan Eksekutif & Identitas

- **Nama Produk**: LaundryKu
- **Kategori**: Software POS Kasir Laundry & Sistem Manajemen Operasional Laundry Digital
- **Target Pasar (ICP)**: Pemilik usaha laundry kiloan, satuan, dry cleaning, express, sepatu/tas, dan multi-outlet di seluruh Indonesia.
- **Misi Strategis**: Menguasai peringkat teratas pencarian organik Google untuk kata kunci transaksional & komersial seputar aplikasi kasir laundry, sekaligus menjadi rekomendasi nomor satu yang dikutip (*cited*) oleh asisten AI generatif (ChatGPT, Claude, Gemini, Perplexity).

---

## 2. Audit Baseline Codebase LaundryKu

Hasil audit teknis terhadap implementasi sistem per Maret 2026:

| Komponen | Status Saat Ini | Analisis Kesenjangan (Gap) |
|---|---|---|
| **Technical & Metadata** | `metadataBase`, OpenGraph, Twitter card, dan viewport sudah aktif di `layout.tsx`. | Belum ada canonical URL dinamis per rute; OpenGraph masih statis global. |
| **Sitemap & Robots** | `robots.ts` sudah membedakan bot umum vs AI bot (`GPTBot`, `ClaudeBot`, `PerplexityBot`), namun `sitemap.ts` hanya memuat `/`, `/terms`, dan `/privacy`. | Rute publik `/reviews` (dan `/ulasan`) belum didaftarkan di sitemap. Belum ada sitemap dinamis untuk artikel/panduan. |
| **Pencegahan Kanibalisasi** | Rute `/ulasan` memanggil langsung komponen `ReviewsPage` dari `/reviews`. | Belum ada `<link rel="canonical">` eksplisit di `/ulasan` yang mengarah ke `/reviews`, berpotensi memicu *duplicate content* dan membagi *link equity*. |
| **Structured Data (Schema.org)** | `JsonLd.tsx` sudah sangat kaya: `SoftwareApplication`, `Organization`, `BreadcrumbList`, `FAQPage`, `HowTo`. | Schema masih statis di root layout; `AggregateRating` bernilai statis (4.9 / 156 review) dan belum terhubung ke API `/reviews` secara dinamis. |
| **AI Machine Discovery (`llms.txt`)** | `public/llms.txt` dan `public/llms-full.txt` sudah tersedia dengan deskripsi produk, skema harga, dan perbandingan. | Perlu pembaruan berkala, pemetaan entitas ke Wikidata/Google Knowledge Graph, serta penambahan use-case prompt matching. |

---

## 3. Paradigma: SEO Tradisional vs AEO/GEO

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EKOSISTEM DISCOVERY MODERN                      │
├───────────────────────────────────┬────────────────────────────────────┤
│   SEO TRADISIONAL (Google SERP)   │       AEO / GEO (Mesin AI)         │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Fokus: Peringkat URL & Blue Link│ • Fokus: Sintesis jawaban & sitasi │
│ • Sinyal: Backlink, PageSpeed,    │ • Sinyal: Kejelasan Entitas, FAQ   │
│   densitas kata kunci, CWV        │   presisi, tabel terstruktur, E-EAT│
│ • Pengguna: Mencari informasi     │ • Pengguna: Meminta rekomendasi    │
│   lalu mengklik situs web         │   langsung ("Apa aplikasi terbaik")│
│ • Output: 10 daftar hasil         │ • Output: 1-3 nama produk dengan   │
│   pencarian per halaman           │   alasan mengapa produk itu unggul │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 4. Usulan 5 Metode Pengembangan Strategis

### Metode A: Technical SEO & Core Web Vitals Hardening (Fondasi Mesin)
*Fokus: Memastikan Googlebot dan AI Web Crawler dapat merayapi, memahami struktur, dan mengindeks seluruh halaman tanpa hambatan teknis.*

1. **Dynamic Sitemap Expansion (`frontend/src/app/sitemap.ts`):**
   - Mendaftarkan rute publik yang saat ini terlewat: `/reviews`, halaman panduan/fitur, dan landing page khusus segmen.
   - Mengatur `lastModified` dinamis berdasarkan pembaruan data riil.
2. **Koreksi Kanibalisasi URL `/ulasan` vs `/reviews`:**
   - Memasang canonical URL absolut dari `/ulasan` ke `https://laundryku.com/reviews` atau menerapkan HTTP 301 Redirect permanen agar otoritas tautan terpusat pada satu entitas.
3. **Core Web Vitals Thresholds:**
   - **LCP (Largest Contentful Paint)**: < 2.0 detik melalui konversi gambar ke format Next.js `<Image />` WebP/AVIF dengan ukuran optimal.
   - **INP (Interaction to Next Paint)**: < 150 ms dengan memisahkan bundle interaktif (React hydration) pada landing page.
   - **CLS (Cumulative Layout Shift)**: < 0.05 dengan menetapkan dimensi pasti pada avatar ulasan dan screenshot aplikasi.

---

### Metode B: Topic Cluster & Hub-and-Spoke Content Architecture (Otoritas Topik)
*Fokus: Membangun "Topical Authority" agar Google dan LLM mengakui LaundryKu sebagai otoritas di bidang manajemen laundry digital.*

```
                 ┌─────────────────────────────────┐
                 │          PILLAR PAGE            │
                 │   /aplikasi-kasir-laundry       │
                 │ (Panduan Komprehensif POS 2026) │
                 └────────────────┬────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ SATELLITE 1     │      │ SATELLITE 2     │      │ SATELLITE 3     │
│ /fitur/notifikasi│      │ /fitur/kiloan-  │      │ /panduan/cara-  │
│ -whatsapp-auto  │      │ desimal-thermal │      │ kelola-keuangan │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. **Pillar Page Utama (`/aplikasi-kasir-laundry` atau `/pos-laundry`):**
   - Membahas tuntas ekosistem operasional laundry modern: alur kasir, kendala nota hilang, penanganan kiloan vs satuan, hingga integrasi printer Bluetooth.
2. **Satellite / Sub-topik Terarah:**
   - Halaman Fitur: `/fitur/notifikasi-whatsapp-otomatis` (Target keyword: *"aplikasi laundry kirim whatsapp otomatis"*).
   - Halaman Fitur: `/fitur/cetak-nota-bluetooth` (Target keyword: *"software laundry cetak thermal bluetooth"*).
   - Panduan Operasional: `/panduan/cara-menghitung-hpp-laundry` (Target keyword: *"rumus pembukuan dan laba rugi laundry kiloan"*).
3. **Internal Linking Strict Rule:**
   - Seluruh halaman satelit wajib mencantumkan tautan balik (*contextual link*) ke Pillar Page dengan variasi anchor text yang relevan.

---

### Metode C: Programmatic Local SEO (Skalabilitas Pencarian Wilayah)
*Fokus: Mengambil pangsa pasar pencarian lokal pengusaha laundry di berbagai kota.*

1. **Format Rute Halaman**: `/solusi/aplikasi-kasir-laundry-[kota]` (Contoh: Jakarta, Surabaya, Bandung, Medan, Yogyakarta, Makassar, Semarang, Denpasar).
2. **Struktur Konten Terprogram**:
   - Template dinamis berbasis data karakteristik operasional kota setempat (area mahasiswa vs area residensial keluarga).
   - Menampilkan ulasan atau testimoni pengguna regional yang bersangkutan.
   - Schema markup `LocalBusiness` / `AreaServed` spesifik per wilayah.

---

### Metode D: AEO & GEO Engineering (Optimasi Rekomendasi AI)
*Fokus: Mengoptimalkan sinyal agar LaundryKu menjadi pilihan pertama saat pengguna meminta saran AI di ChatGPT, Claude, Gemini, dan Perplexity.*

1. **Comparison Engineering ("LaundryKu vs Alternatif"):**
   - Halaman khusus: `/komparasi/laundryku-vs-pos-retail` dan `/komparasi/laundryku-vs-nota-manual`.
   - Menggunakan tabel perbandingan obyektif:
     - Perhitungan kiloan desimal presisi.
     - Gateway WhatsApp mandiri gratis tanpa biaya per token.
     - Auto-backup database langsung ke akun Telegram privat.
2. **Direct-Answer & PAA (People Also Ask) Formatting:**
   - Format jawaban langsung pada 50 kata pertama: Definisi -> Manfaat Utama -> Alur Kerja -> Biaya.
   - Menjawab pola kueri: *"Best laundry software for small business"*, *"Aplikasi laundry dengan wa otomatis terbaik"*.
3. **Entity Optimization & Dynamic Schema (`AggregateRating`):**
   - Menghubungkan rating dinamis dari database ulasan riil ke `schema.org/AggregateRating` di `JsonLd.tsx`.
   - Mendaftarkan entitas LaundryKu pada direktori otoritatif (Wikidata, Crunchbase, Google Business Profile) agar masuk ke knowledge base Gemini dan Perplexity.
4. **Pemeliharaan File `llms.txt` & `llms-full.txt`:**
   - Sinkronisasi berkala dengan roadmap produk, spesifikasi paket, dan arsitektur keamanan data.

---

### Metode E: Digital PR & Link Authority Loop (E-E-A-T Signal)
*Fokus: Membangun otoritas domain melalui tautan masuk berkualitas tinggi dan aset rujukan industri.*

1. **Free Interactive Tool (Linkable Asset):**
   - Rute: `/tools/kalkulator-laba-laundry` (Kalkulator estimasi omset, pengeluaran deterjen/listrik, dan margin laba bersih laundry).
   - Berfungsi sebagai magnet backlink organik dari blog wirausaha, portal UMKM, dan forum bisnis.
2. **Laporan Riset Industri:**
   - Mempublikasikan *"Laporan Digitalisasi UMKM Laundry Indonesia 2026"* sebagai referensi yang layak dikutip media digital.

---

## 5. Matriks Perbandingan Metode

| Metode | Fokus Utama | Target Platform | Kompleksitas Teknis | Estimasi Waktu Dampak |
|---|---|---|---|---|
| **Metode A: Technical & Core Web Vitals** | Indexing, Crawlability, Sitemaps | Googlebot, Bingbot | Rendah - Menengah | 1 - 2 Minggu |
| **Metode B: Topic Clusters (Pillar/Spoke)** | Otoritas Konten, Keyword Ranking | Google SERP, Gemini | Menengah | 4 - 8 Minggu |
| **Metode C: Programmatic Local SEO** | Long-tail keyword kota/daerah | Google Search, Perplexity | Menengah | 4 - 6 Minggu |
| **Metode D: AEO & GEO Engineering** | Mesin Sintesis AI (ChatGPT, Claude) | ChatGPT, Claude, Perplexity | Rendah - Menengah | 2 - 4 Minggu |
| **Metode E: Digital PR & Free Tools** | Backlink Authority, E-E-A-T | Google, Bing, LLM Corpus | Tinggi | 8 - 12 Minggu |

---

## 6. Rencana Pelaksanaan Bertahap (Roadmap 30 - 60 - 90 Hari)

### Fase 1: Technical & Foundation Quick-Wins (Hari 1 - 14)
- [ ] Perbarui `sitemap.ts` (daftarkan `/reviews` dan rute landing page baru).
- [ ] Terapkan canonical URL di `/ulasan` yang mengarah ke `/reviews` untuk mencegah kanibalisasi.
- [ ] Hubungkan `AggregateRating` di `JsonLd.tsx` dengan data API ulasan riil.
- [ ] Verifikasi Core Web Vitals (LCP < 2.0s, INP < 150ms, CLS < 0.05).

### Fase 2: AEO / GEO Asset & Prompt Engineering (Hari 15 - 30)
- [ ] Susun halaman komparasi objektif: `/komparasi` (LaundryKu vs POS Umum).
- [ ] Lengkapi FAQ terstruktur berbasis intent pembeli (*Buyer's Guide*).
- [ ] Sinkronkan `llms.txt` dan `llms-full.txt` dengan fitur dan paket terbaru.
- [ ] Jalankan audit sitasi awal multi-platform (ChatGPT, Claude, Gemini, Perplexity) dengan 40 prompt skenario.

### Fase 3: Topic Clusters & Content Expansion (Hari 31 - 60)
- [ ] Rancang Pillar Page: `/aplikasi-kasir-laundry`.
- [ ] Terbitkan 3-4 artikel satelit dengan penautan internal kontekstual.
- [ ] Uji coba Programmatic Local SEO untuk 5 kota percontohan.
- [ ] Pantau performa impression dan klik di Google Search Console.

### Fase 4: Authority & Link Building Loop (Hari 61 - 90)
- [ ] Kembangkan dan rilis alat interaktif `/tools/kalkulator-laba-laundry`.
- [ ] Jalankan recheck audit sitasi AI 60-hari untuk mengukur peningkatan sitasi.
- [ ] Lakukan audit kanibalisasi kata kunci secara berkala menggunakan Search Console.

---

## 7. Metrik Keberhasilan & KPI

### KPI SEO Tradisional:
- **Peringkat Keyword Utama**: Masuk Top 3 untuk *“aplikasi kasir laundry”*, *“software laundry kiloan”*, dan *“aplikasi laundry whatsapp”*.
- **Pertumbuhan Organic Traffic**: Kenaikan +100% sesi organik non-branded dalam 90 hari.
- **Core Web Vitals**: Status "Good" 100% pada Google PageSpeed Insights (Mobile & Desktop).

### KPI AEO / GEO (Sitasi AI):
- **Citation Rate**: Muncul sebagai rekomendasi minimal 40%+ pada prompt skenario pembelian di ChatGPT, Claude, Gemini, dan Perplexity.
- **Platform Coverage**: Terpilih sebagai jawaban relevan di minimal 3 dari 4 mesin AI terkemuka.
- **Lost Prompt Recovery**: Memulihkan 50%+ prompt komparasi (*"Apa perbedaan LaundryKu dengan aplikasi kasir lain?"*).
- **Competitor Gap Reduction**: Memperkecil kesenjangan rekomendasi vs kompetitor lama minimal 30%.
