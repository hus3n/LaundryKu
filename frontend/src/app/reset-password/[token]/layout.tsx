import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Kata Sandi Akun | LaundryKu POS',
  description: 'Halaman reset kata sandi akun toko LaundryKu.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
