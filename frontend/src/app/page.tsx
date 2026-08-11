'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shirt, MessageSquare, TrendingUp, ShieldCheck, 
  Users, CheckCircle2, ArrowRight, Sparkles, 
  Star, Check 
} from 'lucide-react';

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Rp 99k',
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
    name: 'Pro',
    price: 'Rp 499k',
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
    name: 'Enterprise',
    price: 'Rp 899k',
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

// Variants for Staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
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
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, 400]);

  return (
    <div className="min-h-screen bg-brand-900 text-brand-50 selection:bg-accent selection:text-white overflow-hidden relative font-sans">
      {/* Background Glows */}
      <motion.div 
        style={{ y: yParallaxFast }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: yParallax }}
        className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-brand-900/60 border-b border-brand-800/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LaundryKu <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent ml-1 font-medium">v1.0</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-300">
            <Link href="#fitur" className="hover:text-white transition-colors">Fitur</Link>
            <Link href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link>
            <Link href="#harga" className="hover:text-white transition-colors">Harga</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-brand-300 hover:text-white transition-colors">
              Masuk
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegisterClick()}
              className="px-5 py-2.5 text-sm font-medium rounded-xl bg-white text-brand-900 shadow-xl shadow-white/10 flex items-center gap-2 cursor-pointer"
            >
              Daftar
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 relative z-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-800 bg-brand-900/50 backdrop-blur-md text-xs font-medium text-brand-300">
              <Sparkles className="w-4 h-4 text-accent" />
              Sistem Manajemen Laundry Otomatis
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-semibold tracking-tighter text-white leading-[1.1]">
              Lebih Cepat, Rapi & <span className="text-accent">Otomatis.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-brand-300 leading-relaxed max-w-xl">
              Tinggalkan buku nota manual. LaundryKu menghadirkan notifikasi WhatsApp terintegrasi, analitik akurat, dan manajemen karyawan dalam satu platform premium.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegisterClick()}
                className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent-dark text-white font-medium text-base shadow-lg shadow-accent/20 flex items-center justify-center gap-3 transition-colors group cursor-pointer"
              >
                Coba via WhatsApp
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <Link href="/login" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 w-full rounded-2xl glass-card-dark text-white font-medium text-base text-center hover:bg-brand-800 transition-colors cursor-pointer"
                >
                  Masuk Aplikasi
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, type: 'spring' }}
            className="relative h-[500px] w-full hidden lg:block"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 left-10 w-80 glass-card p-6 rounded-3xl z-20"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Order #LK-890</h4>
                    <p className="text-xs text-brand-300">Ibu Rina (0812-xxx)</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-300">Status</span>
                  <span className="text-white font-medium">Selesai</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-300">Pesan WA</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Terkirim</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 w-72 glass-card-dark p-6 rounded-3xl z-10"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Notifikasi Terkirim</h4>
                  <p className="text-xs text-brand-300">Baru saja</p>
                </div>
              </div>
              <p className="text-xs text-brand-200 leading-relaxed italic">"Halo Kak Rina, cucian Anda sudah selesai dan siap diambil..."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="fitur" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Fitur Lengkap Skala Industri.</h2>
            <p className="text-brand-300 text-lg">Dirancang khusus untuk efisiensi operasional dan kenyamanan kasir laundry.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card-dark p-8 rounded-3xl md:col-span-2 group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">WhatsApp Auto-Notification</h3>
              <p className="text-brand-300 leading-relaxed max-w-md">
                Kirim pesan otomatis ke pelanggan saat cucian diterima, diproses, hingga selesai. Mengurangi komplain dan pertanyaan status cucian.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card-dark p-8 rounded-3xl group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Analitik Finansial</h3>
              <p className="text-brand-300 leading-relaxed">
                Visualisasi omset harian dan paket terlaris langsung dari dashboard.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card-dark p-8 rounded-3xl group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Manajemen Multi-Role</h3>
              <p className="text-brand-300 leading-relaxed">
                Bagi akses untuk SuperAdmin, Owner, dan Kasir dengan batasan hak otorisasi yang aman.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card-dark p-8 rounded-3xl md:col-span-2 group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Sistem Terisolasi & Auto-Backup</h3>
              <p className="text-brand-300 leading-relaxed max-w-md">
                Database PostgreSQL dengan auto-backup harian ke Telegram. Memastikan data omset miliaran Anda tidak akan pernah hilang.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cara Kerja (Horizontal Scroll or Offset Grid) */}
      <section id="cara-kerja" className="py-32 bg-brand-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">4 Langkah Mudah.</h2>
            <p className="text-brand-300 text-lg">Alur kerja tanpa gesekan untuk efisiensi toko.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Input Order', desc: 'Staf memasukkan pelanggan & paket cucian.', icon: 1 },
              { title: 'Proses', desc: 'Status diperbarui saat pakaian dicuci dan disetrika.', icon: 2 },
              { title: 'Auto WA', desc: 'Sistem mengirimkan notifikasi pengambilan secara instan.', icon: 3 },
              { title: 'Cetak Nota', desc: 'Pelanggan membayar dan struk otomatis dicetak.', icon: 4 },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pt-8"
              >
                <div className="absolute top-0 left-0 text-7xl font-bold text-brand-800/50 select-none z-0">
                  {step.icon}
                </div>
                <div className="relative z-10 space-y-3 mt-4">
                  <h3 className="text-lg font-medium text-white">{step.title}</h3>
                  <p className="text-sm text-brand-300 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="harga" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Harga Terjangkau.</h2>
            <p className="text-brand-300 text-lg">Investasi super ringan untuk transformasi digital toko Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            {PRICING_PLANS.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-3xl flex flex-col h-full border transition-colors ${
                  plan.isPopular
                    ? 'bg-brand-800 border-accent/50 shadow-2xl shadow-accent/10 relative'
                    : 'glass-card-dark border-brand-800 hover:border-brand-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-semibold tracking-wide">
                    {plan.badgeText}
                  </div>
                )}
                
                <div className="flex-grow space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-white">{plan.name}</h3>
                    <p className="text-sm text-brand-300 mt-2">{plan.description}</p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-semibold text-white tracking-tight">{plan.price}</span>
                    <span className="text-sm text-brand-300 mb-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 pt-4 border-t border-brand-800/50">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-brand-300">
                        <Check className="w-5 h-5 text-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegisterClick(plan.name)}
                  className={`w-full mt-8 py-4 rounded-2xl font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    plan.isPopular
                      ? 'bg-accent hover:bg-accent-dark text-white'
                      : 'bg-white text-brand-900 hover:bg-brand-100'
                  }`}
                >
                  Pilih {plan.name}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card-dark p-12 md:p-20 rounded-[40px] text-center relative overflow-hidden border border-brand-800">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">Siap Beralih ke Digital?</h2>
            <p className="text-brand-300 text-lg max-w-2xl mx-auto mb-10">
              Hubungi SuperAdmin via WhatsApp sekarang dan dapatkan panduan setup sistem LaundryKu untuk toko pertama Anda.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegisterClick()}
              className="px-8 py-4 rounded-2xl bg-white text-brand-900 font-medium shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              Hubungi SuperAdmin (+62 852-2992-5593)
              <MessageSquare className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-brand-800 text-brand-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 LaundryKu v1.0. Hak cipta dilindungi.</p>
          <div className="flex gap-6 font-medium">
            <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
            <Link href="#fitur" className="hover:text-white transition-colors">Fitur</Link>
            <Link href="#harga" className="hover:text-white transition-colors">Harga</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
