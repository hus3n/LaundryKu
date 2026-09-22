import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';
import { prisma } from '../config/database.js';
import { isMongoConnected } from '../config/mongodb.js';
import { WASession } from '../models-nosql/waSession.model.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { BotConfig } from '../models-nosql/botConfig.model.js';
import { AutoReply } from '../models-nosql/autoReply.model.js';
import { WAMessageLog } from '../models-nosql/waMessageLog.model.js';

const SESSIONS_DIR = path.resolve(process.cwd(), 'wa-sessions');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

/**
 * Count files recursively in a directory
 */
function countFilesRecursively(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFilesRecursively(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Export all database tables, NoSQL collections, and session/upload files into a single ZIP archive
 */
export async function createBackupArchive(backupDir: string): Promise<{
  filePath: string;
  fileName: string;
  stats: Record<string, number>;
}> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `laundryku-backup-${timestamp}`;
  const tempDir = path.join(backupDir, backupName);
  const zipPath = path.join(backupDir, `${backupName}.zip`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const stats: Record<string, number> = {};

  try {
    // ─── 1. PostgreSQL Models (Prisma) ───

    // Users
    const users = await prisma.user.findMany();
    fs.writeFileSync(path.join(tempDir, 'users.json'), JSON.stringify(users, null, 2));
    stats.users = users.length;

    // Admins
    const admins = await prisma.admin.findMany();
    fs.writeFileSync(path.join(tempDir, 'admins.json'), JSON.stringify(admins, null, 2));
    stats.admins = admins.length;

    // Outlets
    const outlets = await prisma.outlet.findMany();
    fs.writeFileSync(path.join(tempDir, 'outlets.json'), JSON.stringify(outlets, null, 2));
    stats.outlets = outlets.length;

    // Packages
    const packages = await prisma.package.findMany();
    fs.writeFileSync(path.join(tempDir, 'packages.json'), JSON.stringify(packages, null, 2));
    stats.packages = packages.length;

    // Categories
    const categories = await prisma.category.findMany();
    fs.writeFileSync(path.join(tempDir, 'categories.json'), JSON.stringify(categories, null, 2));
    stats.categories = categories.length;

    // Customers
    const customers = await prisma.customer.findMany();
    fs.writeFileSync(path.join(tempDir, 'customers.json'), JSON.stringify(customers, null, 2));
    stats.customers = customers.length;

    // LaundryOrders
    const orders = await prisma.laundryOrder.findMany();
    fs.writeFileSync(path.join(tempDir, 'laundry_orders.json'), JSON.stringify(orders, null, 2));
    stats.laundryOrders = orders.length;

    // LaundryItems
    const items = await prisma.laundryItem.findMany();
    fs.writeFileSync(path.join(tempDir, 'laundry_items.json'), JSON.stringify(items, null, 2));
    stats.laundryItems = items.length;

    // Expenses
    const expenses = await prisma.expense.findMany();
    fs.writeFileSync(path.join(tempDir, 'expenses.json'), JSON.stringify(expenses, null, 2));
    stats.expenses = expenses.length;

    // ActivityLogs
    const logs = await prisma.activityLog.findMany();
    fs.writeFileSync(path.join(tempDir, 'activity_logs.json'), JSON.stringify(logs, null, 2));
    stats.activityLogs = logs.length;

    // Notifications
    const notifications = await prisma.notification.findMany();
    fs.writeFileSync(path.join(tempDir, 'notifications.json'), JSON.stringify(notifications, null, 2));
    stats.notifications = notifications.length;

    // ─── 2. MongoDB NoSQL Collections ───
    let hasMongoData = false;
    if (isMongoConnected()) {
      try {
        const waSessions = await WASession.find().lean();
        fs.writeFileSync(path.join(tempDir, 'wa_sessions_db.json'), JSON.stringify(waSessions, null, 2));
        stats.waSessionsDb = waSessions.length;

        const waTemplates = await WATemplate.find().lean();
        fs.writeFileSync(path.join(tempDir, 'wa_templates.json'), JSON.stringify(waTemplates, null, 2));
        stats.waTemplates = waTemplates.length;

        const botConfigs = await BotConfig.find().lean();
        fs.writeFileSync(path.join(tempDir, 'bot_configs.json'), JSON.stringify(botConfigs, null, 2));
        stats.botConfigs = botConfigs.length;

        const autoReplies = await AutoReply.find().lean();
        fs.writeFileSync(path.join(tempDir, 'auto_replies.json'), JSON.stringify(autoReplies, null, 2));
        stats.autoReplies = autoReplies.length;

        const waLogs = await WAMessageLog.find().lean();
        fs.writeFileSync(path.join(tempDir, 'wa_message_logs.json'), JSON.stringify(waLogs, null, 2));
        stats.waMessageLogs = waLogs.length;

        hasMongoData = true;
      } catch (mongoErr: any) {
        console.warn('⚠️ Warning: Error exporting MongoDB collections:', mongoErr.message);
      }
    }

    // ─── 3. WhatsApp Session Files (Disk Credentials) ───
    let hasWaSessionFiles = false;
    if (fs.existsSync(SESSIONS_DIR)) {
      const destSessionsDir = path.join(tempDir, 'wa_sessions_files');
      try {
        fs.cpSync(SESSIONS_DIR, destSessionsDir, { recursive: true });
        const waFilesCount = countFilesRecursively(destSessionsDir);
        stats.waSessionFiles = waFilesCount;
        hasWaSessionFiles = waFilesCount > 0;
      } catch (sessionErr: any) {
        console.warn('⚠️ Warning: Error copying wa-sessions folder:', sessionErr.message);
      }
    }

    // ─── 4. Uploaded Store Logos and Media ───
    let hasUploadFiles = false;
    if (fs.existsSync(UPLOADS_DIR)) {
      const destUploadsDir = path.join(tempDir, 'uploads_files');
      try {
        fs.cpSync(UPLOADS_DIR, destUploadsDir, { recursive: true });
        const uploadFilesCount = countFilesRecursively(destUploadsDir);
        stats.uploadFiles = uploadFilesCount;
        hasUploadFiles = uploadFilesCount > 0;
      } catch (uploadErr: any) {
        console.warn('⚠️ Warning: Error copying uploads folder:', uploadErr.message);
      }
    }

    // ─── 5. Write Complete Metadata ───
    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);
    const metadata = {
      appName: 'LaundryKu v1.0',
      backupDate: new Date().toISOString(),
      backupName,
      hasMongoData,
      hasWaSessionFiles,
      hasUploadFiles,
      stats,
      totalRecords,
    };
    fs.writeFileSync(path.join(tempDir, '_metadata.json'), JSON.stringify(metadata, null, 2));

    // ─── 6. Create ZIP archive ───
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = new ZipArchive({ zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', (err: any) => reject(err));

      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
    });

    // Clean up temp dir
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`✅ Backup archive created: ${zipPath} (${totalRecords} records & files)`);

    return { filePath: zipPath, fileName: `${backupName}.zip`, stats };
  } catch (error) {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw error;
  }
}
