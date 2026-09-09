import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami - Startup Aplikasi Manajemen Laundry Digital',
  description: 'Mengenal visi LaundryKu sebagai platform aplikasi kasir dan digitalisasi UMKM laundry di Indonesia.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#1DA9D0]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA9D0]/10 border border-[#1DA9D0]/20 text-xs font-semibold text-[#43D5CC] mx-auto">
            <Sparkles className="w-4 h-4" /> Visi Besar Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Mendigitalisasi <span className="bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] bg-clip-text text-transparent">UMKM Laundry</span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/70 text-sm md:text-base leading-relaxed">
            Membangun sistem ekosistem pembukuan dan otomasi komunikasi paling efisien di Indonesia agar pengusaha laundry bisa fokus pada pertumbuhan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15">
            <h3 className="text-xl font-bold text-foreground mb-4">Latar Belakang</h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Ribuan pelaku bisnis cuci keluhan menghadapi kerumitan catatan administrasi di kertas nota, hilangnya data transaksi, kerugian di kasir akibat karyawan yang curang, serta keluhan pelanggan karena pengingat ambil baju diewatkan begitu saja.
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              LaundryKu lahir dari keresahan nyata di lapangan; untuk menjembatani sistem pembukuan terisolasi kuat berformat digital yang super mudah (User-Friendly) untuk pengguna awam.
            </p>
          </div>
          <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/30 shadow-2xl shadow-[#1DA9D0]/10 bg-gradient-to-tr from-[#012040] to-transparent">
            <h3 className="text-xl font-bold text-foreground mb-4">Misi LaundryKu</h3>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] shrink-0">1</span>
                Mengotomasi pengiriman nota / notifikasi WhatsApp setiap pelanggan (Paperless).
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] shrink-0">2</span>
                Mengeliminasi antrian panjang di kasir dengan antarmuka yang cepat hanya bermodalkan 3 kali input nomor pelanggan.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] shrink-0">3</span>
                Memberi analitik cerdas (*dashboard owner*) supaya pendapatan setiap harinya transparan dalam pantauan.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
