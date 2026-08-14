import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaundryKu - Manajemen Laundry Digital',
  description: 'Sistem manajemen laundry digital cerdas, kelola pesanan dan pelanggan dengan mudah.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/laundryku-icon.svg',
    shortcut: '/logo/laundryku-icon.svg',
    apple: '/logo/laundryku-icon.svg',
  },
  themeColor: '#020617',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LaundryKu',
  },
  keywords: ['laundry', 'pencatatan laundry', 'whatsapp laundry', 'manajemen laundry', 'laundryku'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
