import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifikasi WhatsApp Otomatis Laundry Rp 0 Tanpa Token - LaundryKu',
  description:
    'Kirim pesan WhatsApp otomatis saat cucian siap diambil dan bagikan struk nota digital tanpa biaya kuota token. Fitur gateway WhatsApp mandiri LaundryKu.',
  alternates: {
    canonical: '/fitur/notifikasi-whatsapp-otomatis',
  },
  openGraph: {
    title: 'Notifikasi WhatsApp Otomatis Laundry Rp 0 Bebas Pulsa - LaundryKu',
    description:
      'Solusi kirim nota dan notifikasi pengambilan cucian otomatis via WhatsApp untuk usaha laundry kiloan & satuan di seluruh Indonesia.',
    url: '/fitur/notifikasi-whatsapp-otomatis',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitur Notifikasi WhatsApp Otomatis Laundry - LaundryKu',
    description:
      'Hemat ratusan ribu per bulan untuk biaya komunikasi pelanggan dengan fitur auto WhatsApp LaundryKu.',
  },
};

export default function WhatsAppFiturLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
