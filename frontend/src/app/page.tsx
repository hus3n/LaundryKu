'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shirt, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Check,
  Star,
  Layers
} from 'lucide-react';

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Paket Starter 1 Bulan',
    price: 'Rp 99.000',
    period: '/ bulan',
    description: 'Solusi hemat untuk mencoba operasional digital usaha laundry Anda.',
    isPopular: false,
    badgeText: 'Coba Dulu',
    features: [
      'Akses Full Dashboard Admin & Kasir',
      'Notifikasi WhatsApp Otomatis ke Pelanggan',
      'Pencatatan Transaksi & Cetak Struk Nota',
      'Laporan Omset & Analitik Grafik Harian',
      'Support Teknis & Update Sistem',
    ],
  },
  {
    id: 'pro',
    name: 'Paket Pro 6 Bulan',
    price: 'Rp 499.000',
    period: '/ 6 bulan',
    description: 'Pilihan terfavorit pemilik laundry! Lebih hemat 15% dibanding bulanan.',
    isPopular: true,
    badgeText: 'Terpopuler (Hemat 15%)',
    features: [
      'Semua fitur Paket Starter',
      'Prioritas Integrasi WhatsApp Bot Toko',
      'Manajemen Karyawan & Kasir Tanpa Batas',
      'Auto-Backup Data berkala ke Telegram',
      'Dukungan Pendampingan Setup Awal Toko',
    ],
  },
  {
    id: 'enterprise',
    name: 'Paket Enterprise 1 Tahun',
    price: 'Rp 899.000',
    period: '/ 1 tahun',
    description: 'Hemat maksimal 25%! Performa penuh untuk usaha laundry berkembang.',
    isPopular: false,
    badgeText: 'Hemat 25%',
    features: [
      'Semua fitur Paket Pro (Full 12 Bulan)',
      'Konsultasi Operasional & Custom Nota Struk',
      'Jaminan Uptime Platform & Server Terisolasi',
      'Backup Otomatis Harian Database',
      'Bantuan Migrasi Data dari Aplikasi Lama',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  const SUPERADMIN_WA_NUMBER = '6285229925593';

  const handleRegisterClick = (packageName?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const targetPackage = packageName ? ` (Tertarik: ${packageName})` : '';
    const waText = encodeURIComponent(
      `Halo SuperAdmin LaundryKu,\n\nSaya tertarik untuk mendaftar dan berlangganan aplikasi LaundryKu v1.0${targetPackage}. Mohon informasi dan bantuan pendaftarannya. Terima kasih!`
    );
    window.open(`https://wa.me/${SUPERADMIN_WA_NUMBER}?text=${waText}`, '_blank');
  };

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-brand-500 selection:text-white overflow-hidden relative">
      {/* Background Glow Spheres (Parallax) */}
      <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none" />
      <motion.div style={{ y: y3 }} className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-accent-teal/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo/laundryku-icon.svg"
              alt="LaundryKu"
              className="w-10 h-10 rounded-xl shadow-lg shadow-brand-500/30"
            />
            <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
              Laundry<span className="bg-gradient-to-r from-brand-400 to-sky-300 bg-clip-text text-transparent">Ku</span>{' '}
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 ml-1 font-semibold">
                v1.0
              </span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#fitur" className="hover:text-brand-400 transition-colors">Fitur Utama</a>
            <a href="#cara-kerja" className="hover:text-brand-400 transition-colors">Cara Kerja</a>
            <a href="#keunggulan" className="hover:text-brand-400 transition-colors">Keunggulan</a>
            <a href="#harga" className="hover:text-brand-400 transition-colors">Harga</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-slate-200 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <motion.button
              whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRegisterClick()}
              className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white shadow-lg shadow-brand-500/25 flex items-center gap-2 group"
            >
              Daftar Sekarang
              <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-brand-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
              Platform Pencatatan Laundry Masa Depan
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Kelola Usaha Laundry Lebih <span className="bg-gradient-to-r from-brand-400 via-accent-teal to-accent-purple bg-clip-text text-transparent">Cepat, Rapi & Otomatis</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Tinggalkan pencatatan manual di buku. LaundryKu v1.0 menghadirkan notifikasi WhatsApp otomatis ke pelanggan, grafik analitik pendapatan, dan manajemen staf dalam satu aplikasi terpadu.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRegisterClick()}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 via-brand-600 to-accent-purple hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 group"
              >
                Coba Gratis via WhatsApp
                <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-5 h-5" /></motion.span>
              </motion.button>
              <Link href="/login" className="flex-1 sm:flex-none">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 font-semibold text-base text-center"
                >
                  Login Aplikasi
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1">Otomatisasi WA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">3 Role</div>
                <div className="text-xs text-slate-400 mt-1">SuperAdmin, Admin, Staf</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-slate-400 mt-1">Akses Real-time</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Hero Card Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="glass-card-dark p-6 rounded-3xl border border-slate-700/60 shadow-2xl relative z-20 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                      <Shirt className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Cucian #LK-2026-089</h4>
                      <p className="text-xs text-slate-400">Pelanggan: Ibu Rina (0812-3456-7890)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent-teal/20 border border-accent-teal/30 text-accent-teal">
                    Selesai & Siap Diambil
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300 mb-6">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Paket Cucian</span>
                    <span className="font-semibold text-white">Cuci Komplit Kiloan (5 kg)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Harga</span>
                    <span className="font-bold text-brand-400 text-sm">Rp 35.000 (Lunas)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Notifikasi WA</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim Otomatis
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-emerald-300">Pesan WA Terkirim:</p>
                    <p className="text-emerald-200/80 leading-relaxed">
                      "Halo Kak Rina, cucian Anda #LK-2026-089 sudah SELESAI dan siap diambil..."
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -top-6 -left-6 w-full h-full glass-card-dark p-6 rounded-3xl border border-slate-800/80 opacity-60 transform -rotate-3 z-10 hidden sm:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-full h-full glass-card-dark p-6 rounded-3xl border border-slate-800/80 opacity-40 transform rotate-3 z-0 hidden sm:block pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        id="fitur" 
        className="py-24 bg-slate-950/60 border-t border-slate-800/80 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-white">Fitur Lengkap untuk Skala Usaha Laundry</h2>
            <p className="text-slate-400 text-sm">Dirancang khusus menjawab kebutuhan operasional harian pemilik laundry dan staf kasir.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">WhatsApp Auto-Notification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pelanggan menerima notifikasi otomatis saat cucian diterima, sedang diproses, hingga siap diambil tanpa perlu kirim manual.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-teal/20 border border-accent-teal/30 flex items-center justify-center text-accent-teal mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analitik & Grafik Pendapatan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Grafik visual harian, bulanan, dan tahunan serta laporan paket terlaris untuk memantau perkembangan finansial toko.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Manajemen 3 Multi-Role</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hak akses terpisah antara SuperAdmin (pengelola platform), Admin (pemilik toko), dan Staf/Karyawan (pencatatan harian).
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-pink/20 border border-accent-pink/30 flex items-center justify-center text-accent-pink mb-6">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kelola Paket & Kategori</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bebas atur paket kiloan, satuan, bed cover, karpet lengkap dengan harga dan estimasi jam pengerjaan.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Monitoring Masa Aktif Toko</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                SuperAdmin menerima reminder otomatis via WhatsApp sebelum masa aktif langganan toko berakhir.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Aman & Terisolasi</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Menggunakan database PostgreSQL terstruktur, MongoDB untuk storage WhatsApp, dan Redis caching super cepat.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Cara Kerja Section */}
      <motion.section 
        id="cara-kerja" 
        className="py-24 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400">
              ⚡ Sederhana & Efisien
            </div>
            <h2 className="text-3xl font-bold text-white">4 Langkah Mudah Cara Kerja LaundryKu</h2>
            <p className="text-slate-400 text-sm">Alur operasional yang dirancang agar kasir dan karyawan dapat memproses orderan dalam hitungan detik.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-base border border-brand-500/30">
                1
              </div>
              <h3 className="font-bold text-white text-base">Terima & Input Order</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Staf memasukkan nama pelanggan, memilih paket kiloan/satuan, dan menimbang berat pakaian.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-teal/20 text-accent-teal font-bold flex items-center justify-center text-base border border-accent-teal/30">
                2
              </div>
              <h3 className="font-bold text-white text-base">Proses Pencucian</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pakaian diproses (Cuci, Kering, Setrika). Status order diperbarui dari *PENDING* ke *DIPROSES*.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-base border border-emerald-500/30">
                3
              </div>
              <h3 className="font-bold text-white text-base">Notifikasi WA Otomatis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Saat status diubah ke *SELESAI*, sistem langsung mengirimkan pesan WhatsApp otomatis ke pelanggan.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-purple/20 text-accent-purple font-bold flex items-center justify-center text-base border border-accent-purple/30">
                4
              </div>
              <h3 className="font-bold text-white text-base">Ambil & Cetak Nota</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pelanggan mengambil cucian, melakukan pembayaran, dan staf dapat mencetak struk kasir thermal/PDF.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Keunggulan Section */}
      <motion.section 
        id="keunggulan" 
        className="py-24 bg-slate-950/60 border-t border-slate-800/80 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                🏆 Mengapa Memilih LaundryKu?
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Solusi Terbaik Dibanding Pencatatan Manual / Buku Nota
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed">
                Dengan LaundryKu, Anda tidak perlu lagi khawatir nota hilang, lupa menagih pembayaran, atau lelah mengirim pesan manual satu per satu ke ratusan pelanggan.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Hemat Waktu 80% Operasional Kasir</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Input orderan cukup 3 klik, notifikasi terkirim sendiri secara otomatis.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Bebas Biaya Per Pesan WA</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Menggunakan gateway WhatsApp toko sendiri tanpa biaya kredit per pesan SMS/WA.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Data Tersimpan Aman & Auto-Backup</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Terintegrasi dengan Telegram Backup untuk mencegah kehilangan data omset.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Feature Card */}
            <motion.div 
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-dark p-8 rounded-3xl border border-slate-800 space-y-6"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-400" /> Perbandingan Sistem
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Buku Nota Manual</span>
                  <span className="text-rose-400 font-semibold">Mudah Hilang & Kertas Rusak</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Kirim WA Manual</span>
                  <span className="text-amber-400 font-semibold">Menyita Waktu & Sering Lupa</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center text-emerald-300 font-bold">
                  <span>Aplikasi LaundryKu v1.0</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Serba Otomatis & Terpusat
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section (Harga) */}
      <section id="harga" className="py-24 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400">
              💎 Paket Harga Terjangkau
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Investasi Usaha Laundry yang Sangat Ekonomis</h2>
            <p className="text-slate-400 text-sm">Pilih paket langganan yang paling sesuai dengan kebutuhan skala usaha Anda.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
            className="grid md:grid-cols-3 gap-8"
          >
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`glass-card-dark p-8 rounded-3xl border relative flex flex-col justify-between ${
                  plan.isPopular
                    ? 'border-brand-500/80 shadow-2xl shadow-brand-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/40'
                    : 'border-slate-800'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[11px] font-bold shadow-lg shadow-brand-500/30 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    {plan.badgeText}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-slate-800">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Fasilitas Termasuk:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <motion.button
                    whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleRegisterClick(plan.name)}
                    className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 group ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-brand-500/25'
                        : 'bg-slate-800 text-white border border-slate-700'
                    }`}
                  >
                    Pilih {plan.name}
                    <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card-dark p-12 rounded-3xl border border-brand-500/30 text-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Siap Modernisasi Toko Laundry Anda?
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
              Hubungi SuperAdmin via WhatsApp di <strong className="text-brand-300">+62 852-2992-5593</strong> untuk mendaftarkan toko Anda dan langsung mulai gunakan LaundryKu v1.0 hari ini.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRegisterClick()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-base shadow-xl shadow-brand-500/30 inline-flex items-center gap-3 group"
            >
              Hubungi SuperAdmin di WhatsApp (085229925593)
              <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-5 h-5" /></motion.span>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 LaundryKu v1.0. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Login Portal</Link>
            <a href="#fitur" className="hover:text-slate-300 transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-slate-300 transition-colors">Cara Kerja</a>
            <a href="#keunggulan" className="hover:text-slate-300 transition-colors">Keunggulan</a>
            <a href="#harga" className="hover:text-slate-300 transition-colors">Harga</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
