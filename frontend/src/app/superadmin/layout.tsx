import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SuperAdmin Panel',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
