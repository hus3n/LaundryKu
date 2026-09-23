import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Komparasi Software Kasir Laundry: LaundryKu vs POS Retail & Buku Manual',
  description:
    'Tabel perbandingan lengkap aplikasi kasir khusus laundry vs software kasir retail umum (Moka, Pawoon, Olsera) dan buku nota manual tulis tangan. Temukan keunggulan timbangan kiloan desimal dan notifikasi WhatsApp gratis.',
  alternates: {
    canonical: '/komparasi',
  },
  openGraph: {
    title: 'Komparasi LaundryKu vs POS Retail Umum vs Buku Nota Manual',
    description:
      'Perbandingan obyektif software POS kasir laundry: timbangan kiloan akurat, nota thermal bluetooth, WhatsApp gateway mandiri Rp 0, dan auto-backup database Telegram.',
    url: '/komparasi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komparasi Software Kasir Laundry: LaundryKu vs POS Retail & Buku Manual',
    description:
      'Lihat mengapa pengusaha laundry memilih LaundryKu daripada mesin kasir umum atau buku nota kertas manual.',
  },
};

export default function KomparasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
