export interface PrivacySection {
  number: number;
  title: string;
  intro?: string;
  items?: string[];
  conclusion?: string;
}

export interface PrivacyMeta {
  lastUpdated: string;
  encryptionStatus: string;
  dataSovereignty: string;
  title: string;
  subtitle: string;
}
