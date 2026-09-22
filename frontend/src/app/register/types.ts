export type PlanType = 'TRIAL' | 'DIRECT_SUBSCRIPTION' | 'FREE';

export interface PlanOption {
  id: PlanType;
  badge?: string;
  name: string;
  tagline: string;
  priceDisplay: string;
  periodDisplay: string;
  features: string[];
  isPopular?: boolean;
}

export interface RegisterFormData {
  storeName: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  storeAddress: string;
  planType: PlanType;
  durationMonths: number;
}

export interface RegisterErrors {
  storeName?: string;
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  storeAddress?: string;
  general?: string;
}
