import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-[#1DA9D0]/15 text-sm text-[#F5EACA]/70 bg-[#010E1C] relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo/laundryku-icon.svg" alt="LaundryKu" className="w-8 h-8 rounded-lg shadow-lg shadow-[#1DA9D0]/30" />
            <span className="text-lg font-extrabold bg-gradient-to-r from-[#F5EACA] to-[#43D5CC] bg-clip-text text-transparent">LaundryKu</span>
          </div>
          <p className="text-xs text-[#F5EACA]/50 leading-relaxed">
            Sistem manajemen POS dan kasir laundry digital terintegrasi WhatsApp yang dirancang khusus untuk mempercepat pertumbuhan UMKM Laundry di Indonesia.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-[#F5EACA] mb-4">Layanan & Fitur</h3>
          <div className="flex flex-col gap-3 text-xs">
            <Link href="/#fitur" className="hover:text-[#43D5CC] transition-colors">Fitur Utama</Link>
            <Link href="/#cara-kerja" className="hover:text-[#43D5CC] transition-colors">Cara Kerja Sistem</Link>
            <Link href="/#keunggulan" className="hover:text-[#43D5CC] transition-colors">Keunggulan Kami</Link>
            <Link href="/#harga" className="hover:text-[#43D5CC] transition-colors">Harga Berlangganan</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#F5EACA] mb-4">Perusahaan</h3>
          <div className="flex flex-col gap-3 text-xs">
            <Link href="/tentang-kami" className="hover:text-[#43D5CC] transition-colors">Tentang Kami</Link>
            <Link href="/kontak" className="hover:text-[#43D5CC] transition-colors">Hubungi Kami</Link>
            <Link href="/login" className="hover:text-[#43D5CC] transition-colors">Portal Kasir / Admin</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#F5EACA] mb-4">Bantuan & Legal</h3>
          <div className="flex flex-col gap-3 text-xs">
            <Link href="/faq" className="hover:text-[#43D5CC] transition-colors">FAQ (Tanya Jawab)</Link>
            <Link href="/kebijakan-privasi" className="hover:text-[#43D5CC] transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="hover:text-[#43D5CC] transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#1DA9D0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5EACA]/40">
        <div>© {new Date().getFullYear()} LaundryKu v1.0. All rights reserved.</div>
        <div className="flex gap-4">
          <span>Sistem Manajemen Laundry Cerdas & Terpercaya di Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
