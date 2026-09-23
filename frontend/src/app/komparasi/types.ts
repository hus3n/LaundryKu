export type ComparisonRating = 'yes' | 'no' | 'partial' | string;

export interface ComparisonFeature {
  name: string;
  laundryku: ComparisonRating;
  retailPos: ComparisonRating;
  manualBook: ComparisonRating;
  description?: string;
  isHighlight?: boolean;
}

export interface ComparisonCategory {
  categoryName: string;
  features: ComparisonFeature[];
}

export interface BuyerCriterion {
  number: string;
  title: string;
  description: string;
  whyItMatters: string;
  iconName: 'scale' | 'message' | 'printer' | 'shield' | 'wallet';
}

export interface BuyerFaqItem {
  question: string;
  answer: string;
  category: 'feature' | 'pricing' | 'hardware' | 'security';
}
