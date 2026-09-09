import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan layanan sistem aplikasi LaundryKu.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#010E1C] text-[#F5EACA] flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#1DA9D0]/20 flex items-center justify-center text-[#43D5CC]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5EACA]">Syarat dan Ketentuan (Terms of Service)</h1>
        </div>

        <div className="glass-card-dark p-8 md:p-10 rounded-3xl border border-[#1DA9D0]/15 relative prose prose-invert max-w-none text-sm text-[#F5EACA]/70 leading-relaxed">
          <h2 className="text-xl font-bold text-[#F5EACA] mb-4 mt-8">1. Penggunaan Layanan Secara Umum</h2>
          <p className="mb-4">
            Anda diperbolehkan memanfaatkan platform LaundryKu secara wajar dalam batasan berlangganan paket yang telah dipilih. Jangan menyalahgunakan, merusak (hijacking/scraping), atau melakukan bypass integrasi WhatsApp di luar kebiasaan standar pemakaian kasir laundry.
          </p>

          <h2 className="text-xl font-bold text-[#F5EACA] mb-4 mt-8">2. Kebijakan SLA (Service Level Agreement)</h2>
          <p className="mb-4">
            LaundryKu akan terus berupaya membuat layanan Anda aktif (uptime) sebesar 99% setiap bulannya. Walaupun begitu, penghentian server karena pemeliharaan dadakan, bencana, atau pembaruan software mungkin memengaruhi operasional secara parsial dan kami bebas dari kerugian pihak ketiga terkait.
          </p>

          <h2 className="text-xl font-bold text-[#F5EACA] mb-4 mt-8">3. Akun dan Tanggung Jawab Pengguna</h2>
          <p className="mb-4">
            Anda bertanggung jawab sepenuhnya dalam menjaga kerahasiaan kata sandi/password dan hak akses antar admin & karyawan. Kami tidak menanggung segala risiko berupa manipulasi data (penghapusan order) yang disebabkan kelalaian dalam manajemen internal atau pertukaran device yang dipakai pendaftaran toko.
          </p>

          <h2 className="text-xl font-bold text-[#F5EACA] mb-4 mt-8">4. Pembayaran, Upgrade & Refund</h2>
          <p className="mb-4">
            Bila berlangganan secara per-bulan maupun di-upgrade pertahun, aktivasi paket baru langsung dilakukan sesaat sistem menerima bukti tanda bayar rekening/payment gateway sah. Jika ingin pengembalian dana (refund), keputusan sepenuhnya berada di pihak SuperAdmin bergantung kesepakatan trial periode.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
