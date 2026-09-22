import { Smartphone, Monitor, Maximize, LucideIcon } from 'lucide-react';

export interface InstallGuideMethod {
  step: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme: 'cyan' | 'amber';
  instructions: {
    device: string;
    text: string;
  }[];
  actionButton?: {
    label: string;
    actionType: 'fullscreen';
  };
}

export const INSTALL_METHODS: InstallGuideMethod[] = [
  {
    step: 1,
    title: 'Pasang di HP (Android & iPhone)',
    subtitle: 'Aplikasi akan otomatis terpasang di layar utama HP seperti aplikasi mandiri Play Store / App Store:',
    icon: Smartphone,
    colorScheme: 'cyan',
    instructions: [
      {
        device: '📱 HP Android (Chrome)',
        text: 'Tekan tombol menu titik tiga (⋮) di pojok kanan atas browser ➔ pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama".',
      },
      {
        device: '🍏 iPhone (Safari)',
        text: 'Tekan ikon Share / Bagikan (kotak tanda panah atas) di menu bilah bawah ➔ geser ke bawah dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen).',
      },
    ],
  },
  {
    step: 2,
    title: 'Pasang di Komputer / Laptop (Desktop App)',
    subtitle: 'Buka kasir seketika dari Shortcut Desktop & Taskbar tanpa membuka tab peramban web:',
    icon: Monitor,
    colorScheme: 'cyan',
    instructions: [
      {
        device: '💻 Google Chrome & Microsoft Edge',
        text: 'Klik ikon "Instal LaundryKu" (ikon komputer dengan panah ke bawah) yang muncul di ujung kanan bilah alamat (URL bar).',
      },
      {
        device: '🌐 Menu Cadangan',
        text: 'Atau klik menu titik tiga (⋮) di pojok kanan atas browser ➔ pilih Simpan dan Bagikan ➔ klik "Instal LaundryKu...".',
      },
    ],
  },
  {
    step: 3,
    title: 'Mode Layar Penuh Seketika',
    subtitle: 'Sembunyikan tab dan bilah alamat seketika dengan menekan tombol F11 pada keyboard atau tekan tombol di bawah ini:',
    icon: Maximize,
    badge: 'F11',
    colorScheme: 'amber',
    instructions: [],
    actionButton: {
      label: 'Aktifkan Layar Penuh Sekarang',
      actionType: 'fullscreen',
    },
  },
];
