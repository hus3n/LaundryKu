import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan Seputar Aplikasi Kasir LaundryKu',
  description: 'Tanya jawab seputar sistem, fitur, harga, dan layanan aplikasi kasir serta manajemen LaundryKu.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: 'Apa itu LaundryKu?',
      answer: 'LaundryKu adalah platform manajemen dan kasir (POS) berbasis cloud khusus dirancang untuk mempermudah operasional usaha laundry, dengan fitur pencatatan otomatis, laporan omset, dan notifikasi WhatsApp ke pelanggan.'
    },
    {
      question: 'Apakah LaundryKu harus di-install di komputer?',
      answer: 'Tidak perlu. LaundryKu berbasi web, artinya Anda hanya perlu membuka browser dari laptop, tablet, maupun handphone dan sudah dapat langsung mengakses seluruh fitur.'
    },
    {
      question: 'Bagaimana sistem notifikasi WhatsApp otomatisnya bekerja?',
      answer: 'Setelah Anda mengubah status cucian pelanggan menjadi "Selesai", sistem server kami akan otomatis men-trigger bot WhatsApp untuk mengirimkan pesan ke nomor handphone pelanggan yang bersangkutan tanpa pulsa tambahan dari Anda.'
    },
    {
      question: 'Apakah data pelanggan saya aman dan tidak disalahgunakan?',
      answer: 'Pasti. Data yang tersimpan di dalam sistem terjamin keamanannya dan dienkripsi dengan standar tinggi. Kami tidak menjual ataupun menyebarkan data tersebut sesuai detail pada Kebijakan Privasi kami.'
    },
    {
      question: 'Berapa biaya langganannya?',
      answer: 'Silakan merujuk silakan merujuk ke tabel Harga di halaman utama untuk melihat paket berlangganan mulai dari langganan bulanan hingga tahunan dengan diskon khusus.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#010E1C] text-[#F5EACA] flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DA9D0]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#1DA9D0]/20 flex items-center justify-center text-[#43D5CC]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5EACA]">Pertanyaan Terkait LaundryKu (FAQ)</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative">
              <h3 className="font-bold text-lg text-[#F5EACA] mb-3">{faq.question}</h3>
              <p className="text-sm text-[#F5EACA]/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 glass-card-dark rounded-2xl border border-[#1DA9D0]/30 bg-gradient-to-br from-[#012040] to-transparent text-center">
          <p className="text-sm text-[#F5EACA]/80 mb-4">Masih punya pertanyaan lain yang belum terjawab?</p>
          <a href="/kontak" className="inline-flex px-6 py-2 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] font-semibold text-sm hover:bg-[#1DA9D0]/30 transition-colors border border-[#1DA9D0]/30">
            Hubungi Tim Kami
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
