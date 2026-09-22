import fs from 'fs';
import path from 'path';
import { sendFileToTelegram, sendMessageToTelegram, getTelegramStatus } from './telegram.service.js';
import { createBackupArchive as createBackupArchiveInternal } from './exportBackup.js';
import { restoreFromBackup as restoreFromBackupInternal } from './restoreBackup.js';

export const BACKUP_DIR = path.resolve(process.cwd(), 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createBackupArchive(): Promise<{
  filePath: string;
  fileName: string;
  stats: Record<string, number>;
}> {
  return createBackupArchiveInternal(BACKUP_DIR);
}

export async function restoreFromBackup(zipFilePath: string): Promise<{
  success: boolean;
  stats: Record<string, number>;
  message: string;
}> {
  return restoreFromBackupInternal(zipFilePath, BACKUP_DIR);
}

/**
 * Perform backup and send to Telegram bot
 */
export async function performBackupAndSendToTelegram(): Promise<{
  success: boolean;
  fileName?: string;
  stats?: Record<string, number>;
  message: string;
}> {
  const telegramStatus = getTelegramStatus();

  if (!telegramStatus.isConnected || !telegramStatus.chatId) {
    return {
      success: false,
      message: 'Telegram bot belum terhubung atau Chat ID belum diset. Kirim /start ke bot Telegram terlebih dahulu.',
    };
  }

  try {
    await sendMessageToTelegram(
      `⏳ *Memulai Backup Database LaundryKu...*\n📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`
    );

    const { filePath, fileName, stats } = await createBackupArchive();
    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

    const caption =
      `📦 *BACKUP LENGKAP LAUNDRYKU BERHASIL!*\n\n` +
      `📅 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
      `📊 Total Item/Data: ${totalRecords}\n\n` +
      `*Rincian Data:*\n` +
      Object.entries(stats)
        .map(([key, count]) => `• ${key}: ${count}`)
        .join('\n') +
      `\n\n🔒 *Data Sesi WhatsApp & Media:*\n` +
      `• Kredensial WhatsApp (wa-sessions) & file uploads toko tersimpan di dalam arsip.\n` +
      `💡 Upload file zip ini di menu _Restore Backup_ SuperAdmin untuk memulihkan seluruh sistem tanpa kehilangan sesi WhatsApp terhubung.`;

    const sent = await sendFileToTelegram(filePath, caption);

    if (sent) {
      cleanOldBackups(5);

      return {
        success: true,
        fileName,
        stats,
        message: `Backup berhasil dikirim ke Telegram! (${totalRecords} records)`,
      };
    } else {
      return {
        success: false,
        message: 'Gagal mengirim file backup ke Telegram.',
      };
    }
  } catch (error: any) {
    console.error('❌ Backup failed:', error.message);
    await sendMessageToTelegram(`❌ *Backup Gagal!*\nError: ${error.message}`);
    return {
      success: false,
      message: `Backup gagal: ${error.message}`,
    };
  }
}

/**
 * Keep only the N most recent backup files, delete older ones
 */
export function cleanOldBackups(keepCount: number) {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter((f) => f.endsWith('.zip'))
      .map((f) => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
        mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > keepCount) {
      for (const file of files.slice(keepCount)) {
        fs.unlinkSync(file.path);
        console.log(`🗑️ Deleted old backup: ${file.name}`);
      }
    }
  } catch (e) {}
}

/**
 * List available local backup files
 */
export function listLocalBackups(): Array<{
  fileName: string;
  size: number;
  createdAt: string;
}> {
  if (!fs.existsSync(BACKUP_DIR)) return [];

  return fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith('.zip'))
    .map((f) => {
      const stat = fs.statSync(path.join(BACKUP_DIR, f));
      return {
        fileName: f,
        size: stat.size,
        createdAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
