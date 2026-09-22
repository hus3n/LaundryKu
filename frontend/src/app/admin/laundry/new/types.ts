export interface OrderItem {
  packageId: string;
  categoryId: string;
  quantity: number;
}

export interface DraftData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  fragrance: string;
  clothesCount?: number;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod: 'CASH' | 'QRIS';
  selectedOutletId: string;
  items: OrderItem[];
}

export interface PackageItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface OutletItem {
  id: string;
  name: string;
  address?: string;
}
