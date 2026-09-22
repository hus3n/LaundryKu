import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Masuk Akun',
  description: 'Portal login akun kasir, admin toko, dan superadmin LaundryKu.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
