import { NotaData } from './generateNotaImage.js';

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROGRESS: 'Diproses',
  DONE: 'Selesai',
  PICKED_UP: 'Diambil',
};

export function formatOrderForNota(order: any, adminStore: any): NotaData {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer?.name || 'Pelanggan',
    customerPhone: order.customer?.phone || '-',
    dateIn: new Date(order.dateIn).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }),
    estimatedDone: order.estimatedDone
      ? new Date(order.estimatedDone).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        })
      : '-',
    status: order.status,
    statusLabel: STATUS_LABELS[order.status] || order.status,
    paymentStatus: order.paymentStatus,
    paymentLabel: order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR',
    items: (order.items || []).map((i: any) => ({
      packageName: i.package?.name || 'Paket',
      categoryName: i.category?.name || 'Reguler',
      quantity: Number(i.quantity).toString(),
      unit: i.package?.unit || 'Kg',
      price: `Rp ${Number(i.price).toLocaleString('id-ID')}`,
      subtotal: `Rp ${Number(i.subtotal).toLocaleString('id-ID')}`,
    })),
    totalPrice: `Rp ${Number(order.totalPrice).toLocaleString('id-ID')}`,
    notes: order.notes || undefined,
    storeName: adminStore?.storeName || 'LaundryKu',
    storeAddress: adminStore?.storeAddress || '-',
    storePhone: adminStore?.storePhone || '-',
  };
}
