import mongoose, { Schema, Document } from 'mongoose';

export interface ISuperadminConfig extends Document {
  apiKeys: string[];
  currentKeyIndex: number;
  provider: string; // 'gemini' or 'openai' or 'custom' etc
  baseUrl: string;
  models: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SuperadminConfigSchema = new Schema<ISuperadminConfig>(
  {
    apiKeys: { type: [String], default: [] },
    currentKeyIndex: { type: Number, default: 0 },
    provider: { type: String, default: 'custom' },
    baseUrl: { type: String, default: '' },
    models: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const SuperadminConfig = mongoose.model<ISuperadminConfig>('SuperadminConfig', SuperadminConfigSchema);
