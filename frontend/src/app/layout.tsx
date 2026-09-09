import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.forapp.id'),
  title: {
    default: 'LaundryKu - Manajemen Laundry Digital cerdas & otomatis',
    template: '%s | LaundryKu',
  },
  description: 'Sistem manajemen laundry digital cerdas yang terintegrasi dengan WhatsApp interaktif. Kelola pesanan, pelanggan, kasir, dan laporan keuangan dengan cepat dan mudah.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/laundryku-icon.svg',
    shortcut: '/logo/laundryku-icon.svg',
    apple: '/logo/laundryku-icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LaundryKu',
  },
  keywords: ['Aplikasi Laundry', 'Software Laundry', 'Sistem Kasir Laundry', 'WhatsApp Laundry Otomatis', 'Manajemen Laundry Digital', 'LaundryKu'],
  authors: [{ name: 'LaundryKu' }],
  creator: 'LaundryKu',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LaundryKu - Aplikasi Kasir & Manajemen Laundry Otomatis',
    description: 'Tingkatkan omset laundry Anda dengan sistem pesanan otomatis, fitur cetak nota WhatsApp, dan pembukuan keuangan real-time.',
    url: '/',
    siteName: 'LaundryKu',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaundryKu - Sistem Manajemen Laundry Digital',
    description: 'Sistem pesanan otomatis dan pembukuan keuangan untuk pengusaha laundry cerdas.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LaundryKu',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://laundryku.forapp.id',
    description: 'Aplikasi sistem kasir POS dan manajemen bisnis laundry berbasis cloud yang dilengkapi dengan laporan keuangan otomatis dan struk via WhatsApp interaktif.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    }
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
