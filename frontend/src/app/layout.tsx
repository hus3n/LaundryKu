import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import JsonLd from '@/components/seo/JsonLd';
import FloatingReviewButton from '@/components/ui/FloatingReviewButton';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#010E1C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
};

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.forapp.id').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'LaundryKu - Aplikasi Kasir Laundry & Software Manajemen Laundry Digital',
    template: '%s | LaundryKu',
  },
  description:
    'Aplikasi kasir laundry & sistem manajemen laundry digital otomatis nomor 1 di Indonesia. Dilengkapi notifikasi WhatsApp otomatis ke pelanggan, cetak nota struk thermal, dan laporan analitik omset.',
  applicationName: 'LaundryKu',
  authors: [{ name: 'LaundryKu Team', url: appUrl }],
  creator: 'LaundryKu',
  publisher: 'LaundryKu',
  category: 'Business Application',
  classification: 'Software, Point of Sale, Business Management, Laundry POS',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo/laundryku-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo/laundryku.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/logo/laundryku.png',
    apple: [
      { url: '/logo/laundryku.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'LaundryKu - Aplikasi Kasir Laundry & Software Manajemen Laundry Digital',
    description:
      'Solusi kasir laundry modern & terintegrasi: WhatsApp notifikasi otomatis, cetak nota thermal Bluetooth, manajemen staf, dan grafik omset real-time.',
    url: '/',
    siteName: 'LaundryKu',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'LaundryKu - Software POS & Manajemen Laundry Digital',
        type: 'image/png',
      },
      {
        url: '/laundryku.png',
        width: 1254,
        height: 1254,
        alt: 'LaundryKu Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaundryKu - Aplikasi Kasir Laundry & Software Manajemen Laundry Digital',
    description:
      'Kelola usaha laundry lebih cepat, rapi & otomatis dengan notifikasi WhatsApp otomatis ke pelanggan dan laporan keuangan real-time.',
    images: ['/twitter-image.png'],
    creator: '@laundryku',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LaundryKu',
  },
  keywords: [
    'aplikasi laundry',
    'software kasir laundry',
    'aplikasi kasir laundry',
    'pos laundry',
    'manajemen laundry digital',
    'sistem kasir laundry',
    'whatsapp notifikasi laundry',
    'aplikasi laundry kiloan',
    'cetak nota laundry',
    'pembukuan laundry',
    'laporan keuangan laundry',
    'laundryku',
    'program kasir laundry indonesia',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('laundryku_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'light' || (!saved && !prefersDark)) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}

                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {});
                  });
                }
              })();
            `,
          }}
        />
        <JsonLd baseUrl={appUrl} />
      </head>
      <body className={inter.className}>
        {/* Fixed Watermark Background across all pages */}
        <div
          className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center overflow-hidden select-none"
          aria-hidden="true"
        >
          <div
            className="w-[750px] h-[750px] max-w-[90vw] max-h-[90vh] bg-contain bg-center bg-no-repeat opacity-[0.08] dark:opacity-[0.25] dark:brightness-125 dark:contrast-110 transition-all duration-300"
            style={{ backgroundImage: "url('/logo/laundryku-transparent.png')" }}
          />
        </div>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <FloatingReviewButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
