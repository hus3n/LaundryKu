import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

let botInstance: TelegramBot | null = null;
let connectedChatId: string | null = null;

// In-memory config (persisted via env or stored in DB later)
let botConfig: {
  token: string | null;
  chatId: string | null;
  botUsername: string | null;
  isConnected: boolean;
} = {
  token: null,
  chatId: null,
  botUsername: null,
  isConnected: false,
};

const CONFIG_FILE = path.resolve(process.cwd(), 'backups', 'telegram-config.json');

function savePersistedConfig() {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify(
        {
          token: botConfig.token,
          chatId: botConfig.chatId,
          botUsername: botConfig.botUsername,
        },
        null,
        2
      )
    );
  } catch (e) {
    console.error('Failed to save telegram config:', e);
  }
}

function loadPersistedConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return;
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const saved = JSON.parse(raw);
    if (saved.token) {
      botConfig.token = saved.token;
      botConfig.chatId = saved.chatId || null;
      botConfig.botUsername = saved.botUsername || null;
      console.log('📂 Telegram config loaded from disk. Auto-reconnecting...');
      // Fire and forget — tidak di-await agar tidak block module load
      connectTelegramBot(saved.token).catch((e) =>
        console.error('Auto-reconnect Telegram failed:', e.message)
      );
    }
  } catch (e) {
    console.error('Failed to load telegram config:', e);
  }
}

export function getTelegramStatus() {
  return {
    isConnected: botConfig.isConnected,
    botUsername: botConfig.botUsername,
    chatId: botConfig.chatId,
  };
}

export async function connectTelegramBot(token: string): Promise<{
  success: boolean;
  botUsername?: string;
  message: string;
}> {
  try {
    // Stop existing bot if any
    if (botInstance) {
      botInstance.stopPolling();
      botInstance = null;
    }

    const bot = new TelegramBot(token, { polling: true });

    // Validate token by fetching bot info
    const me = await bot.getMe();

    botInstance = bot;
    botConfig.token = token;
    botConfig.botUsername = me.username || me.first_name;
    botConfig.isConnected = true;
    savePersistedConfig();

    console.log(`🤖 Telegram Bot connected: @${botConfig.botUsername}`);

    // Listen for /start command to capture chat ID
    bot.onText(/\/start/, (msg) => {
      const chatId = String(msg.chat.id);
      botConfig.chatId = chatId;
      connectedChatId = chatId;
      savePersistedConfig();

      bot.sendMessage(
        chatId,
        `✅ *LaundryKu Backup Bot Terhubung!*\n\n` +
          `Chat ID: \`${chatId}\`\n` +
          `Bot: @${botConfig.botUsername}\n\n` +
          `Bot ini akan secara otomatis mengirimkan file backup database LaundryKu setiap 1 jam ke chat ini.\n\n` +
          `Perintah yang tersedia:\n` +
          `/status - Cek status bot\n` +
          `/backup - Minta backup manual sekarang`,
        { parse_mode: 'Markdown' }
      );

      console.log(`📩 Telegram Chat ID captured: ${chatId}`);
    });

    // Listen for /status command
    bot.onText(/\/status/, (msg) => {
      const chatId = String(msg.chat.id);
      bot.sendMessage(
        chatId,
        `📊 *Status LaundryKu Backup Bot*\n\n` +
          `🤖 Bot: @${botConfig.botUsername}\n` +
          `🔗 Connected: ✅\n` +
          `💬 Chat ID: \`${chatId}\`\n` +
          `⏰ Auto Backup: Setiap 1 jam\n` +
          `📅 Waktu Server: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
        { parse_mode: 'Markdown' }
      );
    });

    // Listen for /backup command (manual trigger)
    bot.onText(/\/backup/, async (msg) => {
      const chatId = String(msg.chat.id);
      bot.sendMessage(chatId, '⏳ Memulai proses backup manual...');

      // Import dynamically to avoid circular dependency
      const { performBackupAndSendToTelegram } = await import('../services/backup.service.js');
      try {
        await performBackupAndSendToTelegram();
        // Message sent by the backup service itself
      } catch (err: any) {
        bot.sendMessage(chatId, `❌ Backup gagal: ${err.message}`);
      }
    });

    return {
      success: true,
      botUsername: botConfig.botUsername || undefined,
      message: `Bot @${botConfig.botUsername} berhasil terhubung! Kirim /start ke bot di Telegram untuk menautkan Chat ID.`,
    };
  } catch (error: any) {
    console.error('❌ Failed to connect Telegram bot:', error.message);
    return {
      success: false,
      message: `Gagal menghubungkan bot: ${error.message}`,
    };
  }
}

export async function setChatId(chatId: string) {
  botConfig.chatId = chatId;
  connectedChatId = chatId;
  savePersistedConfig();
}

export async function disconnectTelegramBot() {
  if (botInstance) {
    botInstance.stopPolling();
    botInstance = null;
  }
  botConfig = {
    token: null,
    chatId: null,
    botUsername: null,
    isConnected: false,
  };
  connectedChatId = null;

  try {
    if (fs.existsSync(CONFIG_FILE)) fs.unlinkSync(CONFIG_FILE);
  } catch {}
}

export async function sendFileToTelegram(filePath: string, caption: string): Promise<boolean> {
  if (!botInstance || !botConfig.chatId) {
    console.warn('⚠️ Telegram bot not connected or chat ID not set. Cannot send backup file.');
    return false;
  }

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Backup file not found at path: ${filePath}`);
      return false;
    }
    const stats = fs.statSync(filePath);
    console.log(`📦 Sending file to Telegram: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    await botInstance.sendDocument(botConfig.chatId, filePath, {
      caption,
      parse_mode: 'Markdown',
    });
    console.log(`✅ Backup file sent to Telegram chat ${botConfig.chatId}`);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send file to Telegram:', error.message);
    return false;
  }
}

export async function sendMessageToTelegram(message: string): Promise<boolean> {
  if (!botInstance || !botConfig.chatId) {
    return false;
  }

  try {
    await botInstance.sendMessage(botConfig.chatId, message, { parse_mode: 'Markdown' });
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send message to Telegram:', error.message);
    return false;
  }
}

// Auto-restore telegram config on server startup
loadPersistedConfig();
