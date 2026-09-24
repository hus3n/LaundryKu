import type { Metadata } from 'next';
import SyncHandler from './SyncHandler';

export const metadata: Metadata = {
  title: 'Kasir & Karyawan Portal',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncHandler />
      {children}
    </>
  );
}
