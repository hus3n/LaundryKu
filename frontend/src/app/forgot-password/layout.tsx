import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Reset kata sandi akun LaundryKu.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
