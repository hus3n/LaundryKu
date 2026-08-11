import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaundryKu v1.0 — Aplikasi Pencatatan Laundry Modern',
  description: 'Solusi pencatatan laundry modern dengan notifikasi WhatsApp otomatis, analitik pendapatan, dan manajemen multi-toko.',
  keywords: ['laundry', 'pencatatan laundry', 'whatsapp laundry', 'manajemen laundry', 'laundryku'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={outfit.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
