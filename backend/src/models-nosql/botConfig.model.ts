import mongoose, { Schema, Document } from 'mongoose';

export interface IBotConfig extends Document {
  adminId: string;
  greetingMessage: string;
  isGreetingActive: boolean;
  aiApiKey?: string;
  aiProvider?: 'openai' | 'gemini' | null;
  isAiActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotConfigSchema = new Schema<IBotConfig>(
  {
    adminId: { type: String, required: true, unique: true, index: true },
    greetingMessage: { type: String, default: 'Halo! Selamat datang di layanan laundry kami. Ada yang bisa kami bantu? 😊' },
    isGreetingActive: { type: Boolean, default: false },
    aiApiKey: { type: String, default: null },
    aiProvider: { type: String, enum: ['openai', 'gemini', null], default: null },
    isAiActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BotConfig = mongoose.model<IBotConfig>('BotConfig', BotConfigSchema);
