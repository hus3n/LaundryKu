import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MessageSquare, Zap } from 'lucide-react';
import { SUPERADMIN_WA_NUMBER, FOOTER_PAGE_LINKS, FOOTER_LEGAL_LINKS } from './landingData';

export default function LandingFooter() {
  return (
    <footer className="py-12 sm:py-16 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-xs text-slate-500 dark:text-[#F5EACA]/60 transition-colors duration-200 bg-white/40 dark:bg-[#010E1C]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Col 1: Brand & Tagline (2 cols on large screen) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logo/laundryku.png"
                alt="LaundryKu Logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-xl object-contain shadow-md shadow-[#1DA9D0]/20"
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-[#F5EACA] tracking-tight">
                  Laundry<span className="text-[#1DA9D0] dark:text-[#43D5CC]">Ku</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/25 text-[#1DA9D0] dark:text-[#43D5CC] border border-[#1DA9D0]/30">
                  v1.0
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-[#F5EACA]/70 max-w-sm leading-relaxed">
              Software kasir POS dan sistem manajemen laundry digital otomatis nomor 1 di Indonesia. Solusi lengkap pencatatan nota desimal, notifikasi WhatsApp otomatis 0 Rupiah, cetak struk thermal, dan rekapitulasi laba-rugi toko real-time.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                100% Tanpa Potongan Komisi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-[#013D66]/40 text-sky-700 dark:text-[#43D5CC] border border-sky-200 dark:border-[#1DA9D0]/30 font-medium">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                Auto-Backup Telegram
              </span>
            </div>
          </div>

          {/* Col 2: Navigasi Produk */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA] uppercase tracking-wider mb-3">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kebijakan & Legal */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA] uppercase tracking-wider mb-3">
              Kebijakan &amp; Legal
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-slate-400 dark:text-[#F5EACA]/40 text-[11px] leading-tight pt-1">
                Kepatuhan UU PDP No. 27/2022
              </li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40 text-[11px] leading-tight">
                Enkripsi TLS 1.3 &amp; Keamanan Data
              </li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40 text-[11px] leading-tight">
                Kebijakan Anti-Spam WhatsApp
              </li>
            </ul>
          </div>

          {/* Col 4: Akses & Bantuan */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F5EACA] uppercase tracking-wider mb-3">
              Akses &amp; Bantuan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors font-semibold text-slate-700 dark:text-[#F5EACA]/90">
                  Masuk Kasir / Admin
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors font-semibold text-[#1DA9D0] dark:text-[#43D5CC]">
                  Daftar Akun Baru (Trial)
                </Link>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${SUPERADMIN_WA_NUMBER}?text=Halo%20Admin%20LaundryKu,%20saya%20ingin%20konsultasi%20aplikasi%20kasir`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CS WhatsApp Resmi</span>
                </a>
              </li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40">
                WhatsApp: +62 852-2992-5593
              </li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40">
                Dukungan: Seluruh Indonesia (24/7)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 border-t border-slate-200 dark:border-[#1DA9D0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#F5EACA]/50">
          <div>
            © 2026 LaundryKu POS v1.0. Hak Cipta Dilindungi Undang-Undang.
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <Link href="/terms" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">
              Syarat Layanan
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <span className="text-slate-400 dark:text-[#F5EACA]/40">
              SaaS Kasir Laundry Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
