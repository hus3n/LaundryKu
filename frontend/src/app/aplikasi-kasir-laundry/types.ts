export interface PillarFeature {
  title: string;
  badge: string;
  description: string;
  benefits: string[];
  icon: 'scale' | 'whatsapp' | 'printer' | 'chart' | 'shield' | 'users';
}

export interface WorkflowStep {
  step: number;
  title: string;
  desc: string;
  detail: string;
  durationTag: string;
}

export interface RoiMetric {
  metric: string;
  manualValue: string;
  laundrykuValue: string;
  savings: string;
}

export interface PillarFaqItem {
  question: string;
  answer: string;
}
