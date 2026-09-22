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
    RECEIVED: 'dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/90 text-slate-700 dark:border-[#1DA9D0]/25 border-slate-300',
    IN_PROGRESS: 'dark:bg-[#EA8803]/20 bg-amber-50 dark:text-[#EA8803] text-amber-700 dark:border-[#EA8803]/30 border-amber-200',
    DONE: 'dark:bg-emerald-500/20 bg-emerald-50 dark:text-emerald-300 text-emerald-700 dark:border-emerald-500/30 border-emerald-200',
    PICKED_UP: 'dark:bg-[#1DA9D0]/20 bg-sky-50 dark:text-[#43D5CC] text-sky-700 dark:border-[#1DA9D0]/30 border-sky-200',
  };
  return classes[status] ?? 'dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/90 text-slate-700 dark:border-[#1DA9D0]/25 border-slate-300';
}

// Label teks untuk status pembayaran
export function getPaymentStatusLabel(status: PaymentStatus): string {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar';
}

// Tailwind className untuk badge status pembayaran
export function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  return status === 'PAID'
    ? 'dark:bg-emerald-500/20 bg-emerald-50 dark:text-emerald-300 text-emerald-700 dark:border-emerald-500/30 border-emerald-200'
    : 'dark:bg-rose-500/20 bg-rose-50 dark:text-rose-300 text-rose-700 dark:border-rose-500/30 border-rose-200';
}

// Format currency ke Rupiah
export function formatRupiah(amount: number | string): string {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

// Format tanggal ke format Indonesia
export function formatDateID(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID');
}
