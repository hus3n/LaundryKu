import mongoose, { Schema, Document } from 'mongoose';

export interface IBotConfig extends Document {
  adminId: string;
  greetingMessage: string;
  isGreetingActive: boolean;
  aiApiKey?: string | null;
  aiProvider?: string | null;
  aiBaseUrl?: string | null;
  aiModel?: string | null;
  aiSystemPrompt?: string | null;
  isAiActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotConfigSchema = new Schema<IBotConfig>(
  {
    adminId: { type: String, required: true, unique: true, index: true },
    greetingMessage: {
      type: String,
      default: 'Halo! Selamat datang di layanan laundry kami. Ada yang bisa kami bantu? 😊',
    },
    isGreetingActive: { type: Boolean, default: false },
    aiApiKey: { type: String, default: null },
    aiProvider: { type: String, default: null },
    aiBaseUrl: { type: String, default: null },
    aiModel: { type: String, default: null },
    aiSystemPrompt: {
      type: String,
      default:
        'Anda adalah asisten AI ramah dan profesional untuk layanan LaundryKu. Jawab pertanyaan pelanggan dengan sopan, jelas, dan informatif mengenai layanan laundry, harga, estimasi waktu pengerjaan, dan operasional toko.',
    },
    isAiActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BotConfig = mongoose.model<IBotConfig>('BotConfig', BotConfigSchema);

