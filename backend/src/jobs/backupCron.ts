import cron from 'node-cron';
import { performBackupAndSendToTelegram } from '../services/backup.service.js';
import { getTelegramStatus } from '../services/telegram.service.js';

let backupCronJob: cron.ScheduledTask | null = null;

/**
 * Initialize automatic backup cron job - runs every 1 hour
 */
export function startBackupCron() {
  if (backupCronJob) {
    backupCronJob.stop();
  }

  // Run every hour at minute 0
  backupCronJob = cron.schedule('0 * * * *', async () => {
    const telegramStatus = getTelegramStatus();

    if (!telegramStatus.isConnected || !telegramStatus.chatId) {
      console.log('⏰ [Backup Cron] Skipped - Telegram bot not connected or Chat ID not set.');
      return;
    }

    console.log('⏰ [Backup Cron] Starting automatic hourly backup...');

    try {
      const result = await performBackupAndSendToTelegram();
      if (result.success) {
        console.log(`✅ [Backup Cron] Automatic backup completed: ${result.fileName}`);
      } else {
        console.log(`⚠️ [Backup Cron] Backup skipped: ${result.message}`);
      }
    } catch (error: any) {
      console.error(`❌ [Backup Cron] Automatic backup failed:`, error.message);
    }
  });

  console.log('⏰ Automatic backup cron job initialized (every 1 hour)');
}

export function stopBackupCron() {
  if (backupCronJob) {
    backupCronJob.stop();
    backupCronJob = null;
    console.log('⏰ Automatic backup cron job stopped.');
  }
}
