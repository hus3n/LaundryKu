import { Review } from '@/types';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (review: Review) => void;
}

export const RATING_LABELS = [
  '',
  'Sangat Buruk 😞',
  'Kurang Memuaskan 🙁',
  'Cukup Baik 🙂',
  'Bagus & Memuaskan 😊',
  'Luar Biasa / Sangat Puas! 🌟',
];
