import React from 'react';
import Link from 'next/link';
import { SUPERADMIN_WA_NUMBER } from './landingData';

export default function LandingFooter() {
  return (
    <footer className="py-12 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-xs text-slate-500 dark:text-[#F5EACA]/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logo/laundryku.png"
                alt="LaundryKu Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-lg font-extrabold text-slate-900 dark:text-[#F5EACA]">LaundryKu</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#F5EACA]/60 max-w-sm leading-relaxed">
              Aplikasi kasir laundry (POS) dan sistem manajemen laundry digital otomatis untuk membantu pengusaha laundry di Indonesia mencatat order, mengirim notifikasi WhatsApp otomatis, dan memonitor omset laba-rugi secara real-time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-[#F5EACA] mb-3">Navigasi Halaman</h4>
            <ul className="space-y-2">
              <li><a href="#fitur" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Fitur Utama</a></li>
              <li><a href="#cara-kerja" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Cara Kerja</a></li>
              <li><a href="#keunggulan" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Keunggulan</a></li>
              <li><a href="#harga" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Paket Harga</a></li>
              <li><a href="#faq" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-[#F5EACA] mb-3">Akses & Bantuan</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors">Login Kasir / Admin</Link></li>
              <li>
                <a 
                  href={`https://wa.me/${SUPERADMIN_WA_NUMBER}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-sky-600 dark:hover:text-[#43D5CC] transition-colors"
                >
                  Hubungi CS WhatsApp
                </a>
              </li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40">WhatsApp: +62 852-2992-5593</li>
              <li className="text-slate-400 dark:text-[#F5EACA]/40">Dukungan: Indonesia (24/7)</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-[#1DA9D0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-[#F5EACA]/50">
          <div>© 2026 LaundryKu v1.0. Hak Cipta Dilindungi Undang-Undang.</div>
          <div>Aplikasi Kasir Laundry & Manajemen Usaha Laundry Digital Terpadu</div>
        </div>
      </div>
    </footer>
  );
}
