export interface TermsSection {
  number: number;
  title: string;
  intro?: string;
  items?: string[];
  conclusion?: string;
}

export interface TermsMeta {
  lastUpdated: string;
  documentVersion: string;
  jurisdiction: string;
  title: string;
  subtitle: string;
}
