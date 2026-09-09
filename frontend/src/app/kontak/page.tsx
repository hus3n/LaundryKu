import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami - Tim Support LaundryKu',
  description: 'Hubungi tim operasional dan dukungan aplikasi kasir LaundryKu untuk bantuan, keluhan pemasaran maupun instalasi sistem.',
};

export default function ContactPage() {
  const SUPERADMIN_WA_NUMBER = '+62 852-2992-5593';
  
  return (
    <div className="min-h-screen bg-[#010E1C] text-[#F5EACA] flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F5EACA]">
            Hubungi Tim LaundryKu
          </h1>
          <p className="max-w-2xl mx-auto text-[#F5EACA]/70 text-sm md:text-base leading-relaxed">
            Apakah Anda berkeinginan mengubah tata kelola administrasi cucian atau perbaikan di lapangan? Segera sampaikan kebutuhan sistem Anda kepada bagian pemasaran, dan kami siap bantu kapan saja.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15 flex flex-col items-center text-center space-y-4 hover:border-[#1DA9D0]/30 transition-colors group">
            <div className="w-14 h-14 rounded-full bg-[#1DA9D0]/20 flex items-center justify-center text-[#43D5CC] group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#F5EACA] mb-1">Live Chat WhatsApp</h3>
              <p className="text-xs text-[#F5EACA]/60 mb-3">Prioritas bantuan, setup & migrasi (Senin-Minggu, Jam Kerja Utama 08.00-21.00).</p>
              <a href={`https://wa.me/6285229925593`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#43D5CC] hover:underline">
                {SUPERADMIN_WA_NUMBER}
              </a>
            </div>
          </div>

          <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15 flex flex-col items-center text-center space-y-4 hover:border-[#1DA9D0]/30 transition-colors group">
            <div className="w-14 h-14 rounded-full bg-[#1DA9D0]/20 flex items-center justify-center text-[#43D5CC] group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#F5EACA] mb-1">Email Resmi</h3>
              <p className="text-xs text-[#F5EACA]/60 mb-3">Penawaran kerjasama B2B korporat atau saran kritik teknikal.</p>
              <a href="mailto:support@laundryku.forapp.id" className="text-sm font-semibold text-[#43D5CC] hover:underline">
                support@laundryku.forapp.id
              </a>
            </div>
          </div>

          <div className="glass-card-dark p-8 rounded-3xl border border-[#1DA9D0]/15 flex flex-col items-center text-center space-y-4 hover:border-[#1DA9D0]/30 transition-colors group">
            <div className="w-14 h-14 rounded-full bg-[#1DA9D0]/20 flex items-center justify-center text-[#43D5CC] group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#F5EACA] mb-1">Markas Pengembangan</h3>
              <p className="text-xs text-[#F5EACA]/60 mb-3">Dioperasikan sepenuh hati dari Indonesia secara Cloud Computing.</p>
              <span className="text-sm font-semibold text-[#43D5CC]">
                100% Remote Operation Team
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
