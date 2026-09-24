import cron from 'node-cron';
import { prisma } from '../config/database.js';

export function initKeepAliveCronJob() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      // 1. Keep the Postgres connection pool hot
      await prisma.$queryRaw`SELECT 1`;

      // 2. Keep the Traefik/Next.js cache hot via HTTP GET
      // Using native fetch (available in Node 18+)
      const response = await fetch('https://laundryku.forapp.id');
      
      console.log(`[Keep-Alive] Pinged DB and frontend (Status: ${response.status}) at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('[Keep-Alive] Failed to execute keep-alive task:', error);
    }
  });

  console.log('✅ Keep-Alive cron job initialized (runs every 5 mins).');
}
