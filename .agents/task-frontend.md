# Task Frontend: Implementasi Animasi Framer Motion

Daftar tugas ini spesifik per file berdasarkan kodebase LaundryKu yang sebenarnya.
`framer-motion@11` sudah terinstal di `package.json`. Semua file sudah `"use client"`.

> **Prinsip Utama (dari motion-framer skill):**
> - Selalu animasikan `x, y, scale, rotate, opacity` — BUKAN `top, left, width, height`
> - Transisi per-gesture: taruh `transition` di dalam `whileHover/whileTap`, bukan di luar
> - `<AnimatePresence>` wajib ada jika komponen pakai `exit={}` dan key unik wajib ada di children-nya
> - Jangan gunakan `layout` pada setiap item list — hanya di tempat yang benar-benar perlu

---

## File 1 — `src/app/page.tsx` (Landing Page)

- [ ] **Hero Section — Staggered Variants**
  Ganti `div` wrapper Hero menjadi `motion.div` dengan pattern variant propagation:
  ```tsx
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }
  // Wrapper:
  <motion.div variants={containerVariants} initial="hidden" animate="visible">
    <motion.h1 variants={itemVariants}>...</motion.h1>
    <motion.p variants={itemVariants}>...</motion.p>
    <motion.div variants={itemVariants}>{/* CTA buttons */}</motion.div>
  </motion.div>
  ```

- [ ] **Background Parallax — `useScroll` + `useTransform`**
  Glow spheres (`div` dekoratif) dianimasikan menggunakan scroll:
  ```tsx
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  // Terapkan:
  <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[500px]..." />
  <motion.div style={{ y: y2 }} className="absolute top-1/3 right-10 w-[400px]..." />
  ```

- [ ] **Section Scroll Reveal — `whileInView` + `viewport`**
  Setiap section (Fitur, Cara Kerja, Harga) dibungkus:
  ```tsx
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
  ```

- [ ] **Kartu Fitur — `whileHover` dengan spring di dalam gesture**
  > ⚠️ **Error umum:** `transition` di luar `whileHover` berlaku untuk animasi *kembali*, bukan saat hover. Taruh transition ke dalam `whileHover`:
  ```tsx
  <motion.div
    whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }} // untuk saat hover berakhir
  >
  ```

- [ ] **Tombol CTA — `whileHover` + `whileTap` + ikon bergerak**
  ```tsx
  <motion.button
    whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    whileTap={{ scale: 0.96 }}
  >
    Daftar <motion.span whileHover={{ x: 4 }}><ArrowRight /></motion.span>
  </motion.button>
  ```

- [ ] **Pricing Cards — Staggered reveal saat scroll**
  ```tsx
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
  >
    {PRICING_PLANS.map(plan => (
      <motion.div
        key={plan.id}
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
      />
    ))}
  </motion.div>
  ```

---

## File 2 — `src/app/login/page.tsx`

- [ ] **Form Card — Fade-in scale saat mount**
  ```tsx
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className="glass-card-dark p-8 rounded-3xl..."
  >
  ```

- [ ] **Pesan Error — `AnimatePresence` + exit animation**
  > ⚠️ Wajib ada `<AnimatePresence>` dan `key` unik agar `exit` bekerja:
  ```tsx
  import { AnimatePresence, motion } from 'framer-motion'

  <AnimatePresence>
    {error && (
      <motion.div
        key="login-error"
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30..."
      >
        {error}
      </motion.div>
    )}
  </AnimatePresence>
  ```

- [ ] **Notifikasi "sesi berakhir" (`expiredMsg`) — sama, bungkus `AnimatePresence`**

- [ ] **Tombol Submit — `whileTap` feedback + animasi loading**
  ```tsx
  <motion.button
    whileTap={{ scale: 0.97 }}
    whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    disabled={isSubmitting}
  >
    {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} /> : 'Masuk'}
  </motion.button>
  ```

- [ ] **`whileFocus` pada input email & password untuk border highlight**
  ```tsx
  <motion.input
    whileFocus={{ scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className="glass-input w-full..."
  />
  ```

---

## File 3 — `src/components/ui/ConfirmModal.tsx`

- [ ] **Overlay & Modal — `AnimatePresence` + `layoutId`-free exit**
  > ⚠️ Saat ini pakai `if (!isOpen) return null` — ini membuat `exit` animasi tidak pernah berjalan karena komponen langsung di-unmount. Solusi: pindahkan guard ke luar, bungkus dengan `AnimatePresence`:

  **Perubahan pada file pemanggil modal** (misal `admins/page.tsx`):
  ```tsx
  <AnimatePresence>
    {isConfirmOpen && <ConfirmModal isOpen={isConfirmOpen} ... />}
  </AnimatePresence>
  ```

  **Perubahan di dalam `ConfirmModal.tsx`** — hapus `if (!isOpen) return null`, ganti JSX root:
  ```tsx
  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="glass-card-dark ... pointer-events-auto">...</div>
      </motion.div>
    </>
  )
  ```

- [ ] **Tombol Konfirmasi & Batal — `whileTap`**
  ```tsx
  <motion.button whileTap={{ scale: 0.95 }} onClick={onConfirm}>...</motion.button>
  <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}>...</motion.button>
  ```

---

## File 4 — `src/components/ui/ReceiptModal.tsx`, `CreateTrialModal.tsx`, `ExtendSubscriptionModal.tsx`

- [x] **Pola sama dengan `ConfirmModal`:** hapus `if (!isOpen) return null`, tambahkan `AnimatePresence` di file pemanggil, dan animasikan overlay + panel seperti di atas.

---

## File 5 — `src/components/layouts/DashboardLayout.tsx`

- [x] **Active Nav Indicator — `layoutId` (Shared Element)**
  Ini pola paling elegan untuk sidebar. Saat tab aktif berpindah, indikator latar bergerak mulus:
  ```tsx
  {navItems.map((item) => {
    const isActive = pathname === item.href
    return (
      <Link key={item.href} href={item.href} className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold">
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25"
          />
        )}
        <span className="relative z-10 flex items-center gap-3">
          <Icon className="w-4 h-4 shrink-0" />
          {item.label}
        </span>
      </Link>
    )
  })}
  ```

- [x] **Mobile Sidebar — `AnimatePresence` + slide-in dari kiri**
  > ⚠️ Saat ini mobile sidebar langsung muncul/hilang. Bungkus dengan `AnimatePresence`:
  ```tsx
  <AnimatePresence>
    {mobileOpen && (
      <>
        <motion.div
          key="mobile-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-slate-950/60"
          onClick={() => setMobileOpen(false)}
        />
        <motion.aside
          key="mobile-sidebar"
          initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-64 z-50 bg-slate-900 ..."
        >
          {/* Konten sidebar */}
        </motion.aside>
      </>
    )}
  </AnimatePresence>
  ```

- [x] **Tombol hamburger (Menu/X) — `AnimatePresence` untuk swap ikon**
  ```tsx
  <AnimatePresence mode="wait">
    {mobileOpen ? (
      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
        <X className="w-5 h-5" />
      </motion.div>
    ) : (
      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
        <Menu className="w-5 h-5" />
      </motion.div>
    )}
  </AnimatePresence>
  ```

---

## File 6 — Halaman Dashboard (`admin/dashboard`, `superadmin/dashboard`)

- [x] **Stat Cards — Staggered reveal saat pertama kali data load**
  Bungkus wrapper kartu-kartu statistik:
  ```tsx
  <motion.div
    variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
    initial="hidden" animate="visible"
    className="grid grid-cols-2 md:grid-cols-4 gap-4"
  >
    {statCards.map(card => (
      <motion.div
        key={card.label}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      />
    ))}
  </motion.div>
  ```

---

## File 7 — Halaman List (`admin/laundry`, `admin/customers`, dll.)

- [x] **List Item — `AnimatePresence` + `layout` saat hapus item**
  > ⚠️ `layout` mahal jika diterapkan di semua item. Gunakan hanya jika daftar bisa dihapus/ditambah secara dinamis. Gunakan opacity-only exit untuk performa lebih baik:
  ```tsx
  <AnimatePresence>
    {items.map(item => (
      <motion.tr
        key={item.id}          // WAJIB: key unik agar AnimatePresence bisa track
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ duration: 0.2 }}
        layout                  // boleh di sini karena satu element per row
      >
    ))}
  </AnimatePresence>
  ```

---

## Catatan Penting & Pencegahan Error

| ❌ Anti-Pattern | ✅ Solusi yang Benar |
|---|---|
| `exit={}` tanpa `<AnimatePresence>` | Selalu bungkus dengan `<AnimatePresence>` |
| `<AnimatePresence>` tanpa `key` unik di children | Tambahkan `key` unik di tiap child langsung |
| `transition={{ duration: 1 }}` di luar untuk `whileHover` | Taruh `transition` di dalam objek `whileHover` |
| `animate={{ top: 100, left: 50 }}` | Ganti ke `animate={{ y: 100, x: 50 }}` |
| `layout` pada setiap item list besar | Gunakan hanya exit opacity, atau `layout="position"` |
| `if (!isOpen) return null` pada modal beranimasi | Pindahkan logika ke `<AnimatePresence>` di parent |
