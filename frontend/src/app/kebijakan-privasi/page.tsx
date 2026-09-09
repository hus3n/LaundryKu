import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Keamanan Data Aplikasi LaundryKu',
  description: 'Informasi lengkap terkait kebijakan privasi dan standar keamanan data pada sistem manajemen LaundryKu.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Kebijakan Privasi</h1>
        </div>

        <div className="glass-card-dark p-8 md:p-10 rounded-3xl border border-[#1DA9D0]/15 relative prose prose-invert max-w-none text-sm text-foreground/70 leading-relaxed">
          <p className="mb-6">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2 className="text-xl font-bold text-foreground mb-4 mt-8">1. Pengumpulan Data</h2>
          <p className="mb-4">
            Kami mengumpulkan informasi yang secara langsung Anda berikan saat berinteraksi dengan layanan kami, antara lain:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Informasi pendaftaran akun (Nama toko, nama pemilik, nomor telepon, alamat).</li>
              <li>Data operasional laundry (Nama pelanggan laundry Anda, riwayat transaksi, pengaturan harga sistem).</li>
            </ul>
          </p>

          <h2 className="text-xl font-bold text-foreground mb-4 mt-8">2. Penggunaan Informasi</h2>
          <p className="mb-4">
            Informasi yang dikumpulkan dari pengguna hanya digunakan untuk:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Memproses dan memfasilitasi kebutuhan aplikasi kasir Anda.</li>
              <li>Mengirimkan notifikasi WhatsApp otomatis ke pelanggan Anda dan mengingatkan status masa aktif akun.</li>
              <li>Menganalisa performa internal untuk perbaikan sistem dan stabilitas server.</li>
            </ul>
          </p>

          <h2 className="text-xl font-bold text-foreground mb-4 mt-8">3. Keamanan Data Pelanggan</h2>
          <p className="mb-4">
            LaundryKu berkomitmen keras melindungi keamanan data dengan menggunakan teknologi enkripsi, autentikasi sesi berlapis, dan backup server rutin guna mencegah kebocoran informasi kepada pihak ketiga yang tidak bertanggung jawab.
          </p>

          <h2 className="text-xl font-bold text-foreground mb-4 mt-8">4. Perubahan Kebijakan Data</h2>
          <p className="mb-4">
            Sesekali kami akan meninjau ulang kebijakan privasi ini menyesuaikan dengan regulasi undang-undang yang berlaku. Pemberitahuan akan disampaikan via dashboard atau WhatsApp ketika kebijakan ini berubah.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
