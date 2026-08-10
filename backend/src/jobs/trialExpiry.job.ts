import cron from 'node-cron';
import { prisma } from '../config/database.js';
import { waQueue } from '../whatsapp/messageQueue.js';
import { env } from '../config/env.js';
import { cleanupExpiredTrials, hardDeleteExpiredTrials } from '../services/superadmin.service.js';

function getRemainingDays(subscriptionEnd: Date): number {
  const now = new Date();
  return Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Cron 1: Kirim WA reminder (setiap hari pukul 09:00)
function initTrialReminderCron() {
  cron.schedule('0 9 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron reminder trial...');
    try {
      const now = new Date();
      const trialAdmins = await prisma.admin.findMany({
        where: { isTrial: true, isActive: true, isDeleted: false, subscriptionEnd: { gt: now } },
        include: { user: true },
      });

      for (const admin of trialAdmins) {
        const remainingDays = getRemainingDays(new Date(admin.subscriptionEnd));
        const phone = admin.user?.phone;
        const name = admin.user?.name || admin.storeName;

        // Hanya kirim di hari ke-7, 3, dan 1 sisa
        if (!phone || ![7, 3, 1].includes(remainingDays)) continue;

        waQueue.enqueue({
          adminId: admin.id,
          recipientPhone: phone,
          recipientName: name,
          message: `Halo Kak ${name} (${admin.storeName}),\n\nMasa TRIAL LaundryKu Anda berakhir dalam *${remainingDays} hari* (${formatDate(new Date(admin.subscriptionEnd))}).\n\nHubungi SuperAdmin untuk berlangganan:\nwa.me/${env.SUPERADMIN_WA_NUMBER}`,
        });
        console.log(`[TRIAL] Reminder ${remainingDays} hari dikirim ke ${name}`);
      }
    } catch (error) {
      console.error('[TRIAL] Error cron reminder:', error);
    }
  });
  console.log('[TRIAL] Cron reminder diinisialisasi (09:00)');
}

// Cron 2: Kunci dan soft-delete trial expired (setiap hari pukul 00:01)
function initTrialCleanupCron() {
  cron.schedule('1 0 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron cleanup trial expired...');
    try {
      const lockedAccounts = await cleanupExpiredTrials();
      for (const account of lockedAccounts) {
        if (!account.phone) continue;
        waQueue.enqueue({
          adminId: account.adminId,
          recipientPhone: account.phone,
          recipientName: account.name || '',
          message: `Halo Kak ${account.name},\n\nMasa TRIAL LaundryKu Anda telah BERAKHIR.\nAkun dikunci sementara. Data aman 24 jam ke depan.\n\nHubungi SuperAdmin:\nwa.me/${env.SUPERADMIN_WA_NUMBER}`,
        });
        console.log(`[TRIAL] Akun dikunci: ${account.storeName}`);
      }
    } catch (error) {
      console.error('[TRIAL] Error cron cleanup:', error);
    }
  });
  console.log('[TRIAL] Cron cleanup diinisialisasi (00:01)');
}

// Cron 3: Hard-delete setelah 24 jam (setiap hari pukul 00:30)
function initTrialHardDeleteCron() {
  cron.schedule('30 0 * * *', async () => {
    console.log('[TRIAL] Menjalankan cron hard-delete trial...');
    try {
      const count = await hardDeleteExpiredTrials();
      console.log(`[TRIAL] Hard-delete selesai: ${count} akun dihapus permanen.`);
    } catch (error) {
      console.error('[TRIAL] Error cron hard-delete:', error);
    }
  });
  console.log('[TRIAL] Cron hard-delete diinisialisasi (00:30)');
}

// Fungsi utama — dipanggil dari app.ts
export function initTrialCronJobs() {
  initTrialReminderCron();
  initTrialCleanupCron();
  initTrialHardDeleteCron();
}
