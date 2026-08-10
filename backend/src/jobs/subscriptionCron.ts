import cron from 'node-cron';
import { prisma } from '../config/database.js';
import { waQueue } from '../whatsapp/messageQueue.js';

export function initSubscriptionCronJob() {
  // Run every day at 00:05 AM
  cron.schedule('5 0 * * *', async () => {
    console.log('⏰ Running daily subscription status check cron job...');
    try {
      const now = new Date();

      const admins = await prisma.admin.findMany({
        include: {
          user: true,
        },
      });

      for (const admin of admins) {
        const subEnd = new Date(admin.subscriptionEnd);
        const diffTime = subEnd.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0 && admin.isActive) {
          // Deactivate expired store
          await prisma.admin.update({
            where: { id: admin.id },
            data: { isActive: false },
          });
          await prisma.user.update({
            where: { id: admin.userId },
            data: { isActive: false },
          });

          if (admin.user?.phone) {
            waQueue.enqueue({
              adminId: admin.id,
              recipientPhone: admin.user.phone,
              recipientName: admin.user.name,
              message: `Halo Bpk/Ibu ${admin.user.name},\n\nMasa aktif langganan toko ${admin.storeName} di LaundryKu v1.0 TELAH BERAKHIR.\nAkun toko dinonaktifkan sementara. Silakan perpanjang masa aktif dengan menghubungi SuperAdmin. Terima kasih.`,
            });
          }
        } else if ([7, 3, 1].includes(diffDays) && admin.isActive && admin.user?.phone) {
          // Send reminder WA
          waQueue.enqueue({
            adminId: admin.id,
            recipientPhone: admin.user.phone,
            recipientName: admin.user.name,
            message: `Pemberitahuan LaundryKu v1.0:\n\nHalo ${admin.user.name},\n\nMasa aktif langganan toko ${admin.storeName} tinggal ${diffDays} HARI LAGI (Berakhir: ${subEnd.toLocaleDateString('id-ID')}).\n\nMohon segera lakukan perpanjangan agar layanan pencatatan toko tidak terganggu. Terima kasih!`,
          });
        }
      }
    } catch (error) {
      console.error('❌ Error executing subscription cron job:', error);
    }
  });

  console.log('✅ Daily subscription cron job initialized');
}
