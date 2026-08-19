import type { OrderStatus, PaymentStatus } from '@/types';

// Label teks untuk status cucian
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    RECEIVED: 'Masuk',
    IN_PROGRESS: 'Diproses',
    DONE: 'Selesai',
    PICKED_UP: 'Diambil',
  };
  return labels[status] ?? status;
}

// Tailwind className untuk badge status cucian
export function getOrderStatusBadgeClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    RECEIVED: 'bg-[#013D66] text-[#F5EACA]/80 border-[#1DA9D0]/25',
    IN_PROGRESS: 'bg-[#EA8803]/20 text-[#EA8803] border-[#EA8803]/30',
    DONE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    PICKED_UP: 'bg-[#1DA9D0]/20 text-[#43D5CC] border-[#1DA9D0]/30',
  };
  return classes[status] ?? 'bg-[#013D66] text-[#F5EACA]/80 border-[#1DA9D0]/25';
}

// Label teks untuk status pembayaran
export function getPaymentStatusLabel(status: PaymentStatus): string {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar';
}

// Tailwind className untuk badge status pembayaran
export function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  return status === 'PAID'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
}

// Format currency ke Rupiah
export function formatRupiah(amount: number | string): string {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

// Format tanggal ke format Indonesia
export function formatDateID(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID');
}
