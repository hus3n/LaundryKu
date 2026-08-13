// ============================================================
// Shared TypeScript types untuk LaundryKu Frontend
// ============================================================

// --- Enum-style constants (cerminkan nilai enum di backend) ---

export type OrderStatus = 'RECEIVED' | 'IN_PROGRESS' | 'DONE' | 'PICKED_UP';
export type PaymentStatus = 'PAID' | 'UNPAID';
export type PaymentMethod = 'CASH' | 'QRIS';
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';

// --- Data Models ---

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  createdAt: string;
}

export interface LaundryPackage {
  id: string;
  name: string;
  unit: string;
  price: number | string;
  estimatedDuration: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface LaundryItem {
  id: string;
  quantity: number | string;
  price: number | string;
  subtotal: number | string;
  package: LaundryPackage;
  category: Category;
}

export interface Outlet {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { ordersTaken: number };
}

export interface LaundryOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  totalPrice: number | string;
  notes?: string | null;
  fragrance?: string | null;
  clothesCount?: number | null;
  dateIn: string;
  estimatedDone?: string | null;
  dateOut?: string | null;
  createdAt: string;
  customer: Customer;
  employee: { id: string; name: string };
  outlet?: Outlet | null;
  items: LaundryItem[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeLogo?: string | null;
  operatingHours?: Record<string, unknown> | null;
  subscriptionEnd: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  storeName: string;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeLogo?: string | null;
  subscriptionEnd: string;
  isActive: boolean;
  isTrial: boolean;
  trialDays?: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
  };
  _count?: {
    employees: number;
    orders: number;
    customers: number;
  };
  waStatus?: string;
  waPhone?: string | null;
}

export interface WATemplate {
  _id: string;
  adminId: string;
  type: string;
  content: string;
  name?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; role: UserRole };
}

// --- API Response wrapper ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
