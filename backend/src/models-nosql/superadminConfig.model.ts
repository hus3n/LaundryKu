import mongoose, { Schema, Document } from 'mongoose';

export interface ISuperadminConfig extends Document {
  apiKeys: string[];
  currentKeyIndex: number;
  provider: string; // 'gemini' or 'openai' or others
  createdAt: Date;
  updatedAt: Date;
}

const SuperadminConfigSchema = new Schema<ISuperadminConfig>(
  {
    apiKeys: { type: [String], default: [] },
    currentKeyIndex: { type: Number, default: 0 },
    provider: { type: String, default: 'gemini' },
  },
  { timestamps: true }
);

export const SuperadminConfig = mongoose.model<ISuperadminConfig>('SuperadminConfig', SuperadminConfigSchema);
