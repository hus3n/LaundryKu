import { BotConfig } from '../models-nosql/botConfig.model.js';
import { AutoReply } from '../models-nosql/autoReply.model.js';
import { isMongoConnected } from '../config/mongodb.js';

function requireMongo() {
  if (!isMongoConnected()) {
    throw new Error('Layanan konfigurasi bot sedang tidak tersedia (MongoDB offline).');
  }
}

// ===== BOT CONFIG =====

export async function getBotConfig(adminId: string) {
  requireMongo();
  const config = await BotConfig.findOne({ adminId });
  if (!config) {
    // Buat default config jika belum ada
    return BotConfig.create({ adminId });
  }
  return config;
}

export async function updateBotConfig(
  adminId: string,
  data: {
    greetingMessage?: string;
    isGreetingActive?: boolean;
    aiApiKey?: string;
    aiProvider?: 'openai' | 'gemini' | null;
    isAiActive?: boolean;
  }
) {
  requireMongo();
  return BotConfig.findOneAndUpdate(
    { adminId },
    { $set: data },
    { new: true, upsert: true }
  );
}

// ===== AUTO REPLY =====

export async function getAutoReplies(adminId: string) {
  requireMongo();
  return AutoReply.find({ adminId }).sort({ createdAt: -1 });
}

export async function createAutoReply(adminId: string, data: { keyword: string; reply: string }) {
  requireMongo();
  const keyword = data.keyword.trim().toLowerCase();

  // Cek duplikat keyword
  const existing = await AutoReply.findOne({ adminId, keyword });
  if (existing) {
    throw new Error(`Kata kunci "${keyword}" sudah ada. Gunakan kata kunci yang berbeda.`);
  }

  return AutoReply.create({ adminId, keyword, reply: data.reply.trim(), isActive: true });
}

export async function toggleAutoReply(adminId: string, replyId: string, isActive: boolean) {
  requireMongo();
  const updated = await AutoReply.findOneAndUpdate(
    { _id: replyId, adminId },
    { $set: { isActive } },
    { new: true }
  );
  if (!updated) throw new Error('Pesan otomatis tidak ditemukan.');
  return updated;
}

export async function deleteAutoReply(adminId: string, replyId: string) {
  requireMongo();
  const result = await AutoReply.findOneAndDelete({ _id: replyId, adminId });
  if (!result) throw new Error('Pesan otomatis tidak ditemukan.');
  return result;
}
