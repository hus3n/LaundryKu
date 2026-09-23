import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aplikasi Kasir Laundry Digital & Software POS Laundry #1 Indonesia',
  description:
    'Software kasir laundry modern berbasis cloud di Indonesia: notifikasi WhatsApp otomatis 0 Rupiah, penimbangan kiloan desimal presisi, cetak nota thermal Bluetooth, dan auto-backup database Telegram.',
  alternates: {
    canonical: '/aplikasi-kasir-laundry',
  },
  openGraph: {
    title: 'Aplikasi Kasir Laundry & Software Manajemen Laundry Digital - LaundryKu',
    description:
      'Solusi kasir laundry lengkap dan praktis untuk laundry kiloan & satuan. Hemat pulsa WhatsApp, pantau omset real-time, dan cegah kehilangan nota.',
    url: '/aplikasi-kasir-laundry',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aplikasi Kasir Laundry Digital & Software POS Laundry - LaundryKu',
    description:
      'Sistem kasir laundry nomor 1 dengan fitur WhatsApp otomatis gratis dan cetak nota thermal Bluetooth.',
  },
};

export default function PillarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
