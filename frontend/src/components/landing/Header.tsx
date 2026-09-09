import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-[#1DA9D0]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 mr-2">
          <img
            src="/logo/laundryku-icon.svg"
            alt="Logo Aplikasi Kasir LaundryKu"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg shadow-[#1DA9D0]/30 shrink-0"
          />
          <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-[#43D5CC] bg-clip-text text-transparent truncate flex-shrink">
            Laundry<span className="bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] bg-clip-text text-transparent">Ku</span>{' '}
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 text-[#43D5CC] ml-1 font-semibold">
              v1.0
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/80 font-medium">
          <Link href="/#fitur" className="hover:text-[#43D5CC] transition-colors">Fitur Utama</Link>
          <Link href="/#cara-kerja" className="hover:text-[#43D5CC] transition-colors">Cara Kerja</Link>
          <Link href="/#harga" className="hover:text-[#43D5CC] transition-colors">Harga</Link>
          <Link href="/faq" className="hover:text-[#43D5CC] transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:text-[#43D5CC] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/#harga"
            className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-[#1DA9D0]/10 border border-[#1DA9D0]/30 text-[#43D5CC] font-semibold text-xs sm:text-sm hover:bg-[#1DA9D0]/20 transition-all shadow-[0_0_15px_rgba(29,169,208,0.2)]"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
