import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ulasan & Testimoni Pelanggan | LaundryKu',
  description:
    'Baca ulasan jujur, rating kepuasan, dan testimoni pengalaman pengusaha laundry dalam menggunakan software kasir POS LaundryKu di seluruh Indonesia.',
  alternates: {
    canonical: '/reviews',
  },
  openGraph: {
    title: 'Ulasan & Testimoni Pengguna LaundryKu',
    description:
      'Lihat bukti nyata bagaimana software POS kasir LaundryKu membantu ratusan pemilik laundry mendigitalkan operasional kasir, nota thermal, dan WhatsApp otomatis.',
    url: '/reviews',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ulasan & Testimoni Pelanggan LaundryKu',
    description:
      'Kepuasan pengusaha laundry Indonesia menggunakan aplikasi POS kasir digital LaundryKu.',
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
