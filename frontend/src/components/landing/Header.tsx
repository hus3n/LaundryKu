import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#010E1C]/80 border-b border-[#1DA9D0]/15">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo/laundryku-icon.svg"
            alt="LaundryKu"
            className="w-10 h-10 rounded-xl shadow-lg shadow-[#1DA9D0]/30"
          />
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#F5EACA] via-[#F5EACA]/90 to-[#43D5CC] bg-clip-text text-transparent">
            Laundry<span className="bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] bg-clip-text text-transparent">Ku</span>{' '}
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[#F5EACA]/80 font-medium">
          <Link href="/#fitur" className="hover:text-[#43D5CC] transition-colors">Fitur Utama</Link>
          <Link href="/#cara-kerja" className="hover:text-[#43D5CC] transition-colors">Cara Kerja</Link>
          <Link href="/#harga" className="hover:text-[#43D5CC] transition-colors">Harga</Link>
          <Link href="/faq" className="hover:text-[#43D5CC] transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-[#F5EACA] hover:text-[#43D5CC] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/#harga"
            className="px-4 sm:px-6 py-2 rounded-lg bg-[#1DA9D0]/10 border border-[#1DA9D0]/30 text-[#43D5CC] font-semibold text-sm hover:bg-[#1DA9D0]/20 transition-all shadow-[0_0_15px_rgba(29,169,208,0.2)]"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
