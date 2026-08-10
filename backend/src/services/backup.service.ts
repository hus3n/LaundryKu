import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { createReadStream } from 'fs';
import { prisma } from '../config/database.js';
import { sendFileToTelegram, sendMessageToTelegram, getTelegramStatus } from './telegram.service.js';

const BACKUP_DIR = path.resolve(process.cwd(), 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Export all database tables to individual JSON files, then zip them into a single archive
 */
export async function createBackupArchive(): Promise<{
  filePath: string;
  fileName: string;
  stats: Record<string, number>;
}> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `laundryku-backup-${timestamp}`;
  const tempDir = path.join(BACKUP_DIR, backupName);
  const zipPath = path.join(BACKUP_DIR, `${backupName}.zip`);

  // Create temp directory for JSON exports
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const stats: Record<string, number> = {};

  try {
    // 1. Export Users
    const users = await prisma.user.findMany();
    fs.writeFileSync(path.join(tempDir, 'users.json'), JSON.stringify(users, null, 2));
    stats.users = users.length;

    // 2. Export Admins
    const admins = await prisma.admin.findMany();
    fs.writeFileSync(path.join(tempDir, 'admins.json'), JSON.stringify(admins, null, 2));
    stats.admins = admins.length;

    // 3. Export Packages
    const packages = await prisma.package.findMany();
    fs.writeFileSync(path.join(tempDir, 'packages.json'), JSON.stringify(packages, null, 2));
    stats.packages = packages.length;

    // 4. Export Categories
    const categories = await prisma.category.findMany();
    fs.writeFileSync(path.join(tempDir, 'categories.json'), JSON.stringify(categories, null, 2));
    stats.categories = categories.length;

    // 5. Export Customers
    const customers = await prisma.customer.findMany();
    fs.writeFileSync(path.join(tempDir, 'customers.json'), JSON.stringify(customers, null, 2));
    stats.customers = customers.length;

    // 6. Export LaundryOrders
    const orders = await prisma.laundryOrder.findMany({
      include: { items: true },
    });
    fs.writeFileSync(path.join(tempDir, 'laundry_orders.json'), JSON.stringify(orders, null, 2));
    stats.laundryOrders = orders.length;

    // 7. Export LaundryItems (standalone)
    const items = await prisma.laundryItem.findMany();
    fs.writeFileSync(path.join(tempDir, 'laundry_items.json'), JSON.stringify(items, null, 2));
    stats.laundryItems = items.length;

    // 8. Export ActivityLogs
    const logs = await prisma.activityLog.findMany();
    fs.writeFileSync(path.join(tempDir, 'activity_logs.json'), JSON.stringify(logs, null, 2));
    stats.activityLogs = logs.length;

    // 9. Export Notifications
    const notifications = await prisma.notification.findMany();
    fs.writeFileSync(path.join(tempDir, 'notifications.json'), JSON.stringify(notifications, null, 2));
    stats.notifications = notifications.length;

    // 10. Write metadata
    const metadata = {
      appName: 'LaundryKu v1.0',
      backupDate: new Date().toISOString(),
      backupName,
      stats,
      totalRecords: Object.values(stats).reduce((a, b) => a + b, 0),
    };
    fs.writeFileSync(path.join(tempDir, '_metadata.json'), JSON.stringify(metadata, null, 2));

    // Create ZIP archive
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
    });

    // Clean up temp dir
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`✅ Backup archive created: ${zipPath} (${Object.values(stats).reduce((a, b) => a + b, 0)} records)`);

    return { filePath: zipPath, fileName: `${backupName}.zip`, stats };
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw error;
  }
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
      `⏳ *Memulai Backup Database LaundryKu...*\n📅 ${new Date().toLocaleString('id-ID')}`
    );

    const { filePath, fileName, stats } = await createBackupArchive();
    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

    const caption =
      `📦 *Backup LaundryKu Berhasil!*\n\n` +
      `📅 Waktu: ${new Date().toLocaleString('id-ID')}\n` +
      `📊 Total Record: ${totalRecords}\n\n` +
      `Detail:\n` +
      Object.entries(stats)
        .map(([key, count]) => `• ${key}: ${count}`)
        .join('\n') +
      `\n\n💡 Upload file ini di menu _Restore Backup_ untuk mengembalikan data.`;

    const sent = await sendFileToTelegram(filePath, caption);

    if (sent) {
      // Keep last 5 backups, delete older ones
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
 * Restore database from uploaded backup ZIP file
 */
export async function restoreFromBackup(zipFilePath: string): Promise<{
  success: boolean;
  stats: Record<string, number>;
  message: string;
}> {
  const unzipper = (await import('unzipper')).default;
  const extractDir = path.join(BACKUP_DIR, `restore-${Date.now()}`);
  const stats: Record<string, number> = {};

  try {
    // Extract ZIP
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', () => resolve())
        .on('error', (err: Error) => reject(err));
    });

    // Verify metadata
    const metadataPath = path.join(extractDir, '_metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('File backup tidak valid: _metadata.json tidak ditemukan.');
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    if (!metadata.appName || !metadata.appName.includes('LaundryKu')) {
      throw new Error('File backup bukan berasal dari aplikasi LaundryKu.');
    }

    console.log(`🔄 Starting restore from backup: ${metadata.backupName} (${metadata.backupDate})`);

    // Restore order matters: delete in reverse dependency order, insert in dependency order
    // Delete existing data (careful order to respect foreign keys)
    await prisma.activityLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.laundryItem.deleteMany();
    await prisma.laundryOrder.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.package.deleteMany();
    await prisma.category.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️ Existing data cleared.');

    // 1. Restore Users
    const usersFile = path.join(extractDir, 'users.json');
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      for (const user of users) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            role: user.role as any,
            isActive: user.isActive,
            adminId: user.adminId,
            resetToken: user.resetToken,
            resetExpires: user.resetExpires ? new Date(user.resetExpires) : null,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
          },
        });
      }
      stats.users = users.length;
    }

    // 2. Restore Admins
    const adminsFile = path.join(extractDir, 'admins.json');
    if (fs.existsSync(adminsFile)) {
      const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf-8'));
      for (const admin of admins) {
        await prisma.admin.create({
          data: {
            id: admin.id,
            userId: admin.userId,
            storeName: admin.storeName,
            storeAddress: admin.storeAddress,
            storeLogo: admin.storeLogo,
            storePhone: admin.storePhone,
            operatingHours: admin.operatingHours,
            subscriptionEnd: new Date(admin.subscriptionEnd),
            isActive: admin.isActive,
            createdAt: new Date(admin.createdAt),
            updatedAt: new Date(admin.updatedAt),
          },
        });
      }
      stats.admins = admins.length;
    }

    // 3. Restore Packages
    const packagesFile = path.join(extractDir, 'packages.json');
    if (fs.existsSync(packagesFile)) {
      const packages = JSON.parse(fs.readFileSync(packagesFile, 'utf-8'));
      for (const pkg of packages) {
        await prisma.package.create({
          data: {
            id: pkg.id,
            adminId: pkg.adminId,
            name: pkg.name,
            unit: pkg.unit,
            price: pkg.price,
            estimatedDuration: pkg.estimatedDuration,
            isActive: pkg.isActive,
            createdAt: new Date(pkg.createdAt),
            updatedAt: new Date(pkg.updatedAt),
          },
        });
      }
      stats.packages = packages.length;
    }

    // 4. Restore Categories
    const categoriesFile = path.join(extractDir, 'categories.json');
    if (fs.existsSync(categoriesFile)) {
      const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'));
      for (const cat of categories) {
        await prisma.category.create({
          data: {
            id: cat.id,
            adminId: cat.adminId,
            name: cat.name,
            isActive: cat.isActive,
            createdAt: new Date(cat.createdAt),
            updatedAt: new Date(cat.updatedAt),
          },
        });
      }
      stats.categories = categories.length;
    }

    // 5. Restore Customers
    const customersFile = path.join(extractDir, 'customers.json');
    if (fs.existsSync(customersFile)) {
      const customers = JSON.parse(fs.readFileSync(customersFile, 'utf-8'));
      for (const cust of customers) {
        await prisma.customer.create({
          data: {
            id: cust.id,
            adminId: cust.adminId,
            name: cust.name,
            phone: cust.phone,
            address: cust.address,
            createdAt: new Date(cust.createdAt),
            updatedAt: new Date(cust.updatedAt),
          },
        });
      }
      stats.customers = customers.length;
    }

    // 6. Restore LaundryOrders (without items - restored separately)
    const ordersFile = path.join(extractDir, 'laundry_orders.json');
    if (fs.existsSync(ordersFile)) {
      const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
      for (const order of orders) {
        await prisma.laundryOrder.create({
          data: {
            id: order.id,
            orderNumber: order.orderNumber,
            customerId: order.customerId,
            employeeId: order.employeeId,
            adminId: order.adminId,
            status: order.status as any,
            paymentStatus: order.paymentStatus as any,
            totalPrice: order.totalPrice,
            notes: order.notes,
            dateIn: new Date(order.dateIn),
            estimatedDone: order.estimatedDone ? new Date(order.estimatedDone) : null,
            dateOut: order.dateOut ? new Date(order.dateOut) : null,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          },
        });
      }
      stats.laundryOrders = orders.length;
    }

    // 7. Restore LaundryItems
    const itemsFile = path.join(extractDir, 'laundry_items.json');
    if (fs.existsSync(itemsFile)) {
      const items = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'));
      for (const item of items) {
        await prisma.laundryItem.create({
          data: {
            id: item.id,
            orderId: item.orderId,
            packageId: item.packageId,
            categoryId: item.categoryId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          },
        });
      }
      stats.laundryItems = items.length;
    }

    // 8. Restore ActivityLogs
    const logsFile = path.join(extractDir, 'activity_logs.json');
    if (fs.existsSync(logsFile)) {
      const logs = JSON.parse(fs.readFileSync(logsFile, 'utf-8'));
      for (const log of logs) {
        await prisma.activityLog.create({
          data: {
            id: log.id,
            userId: log.userId,
            action: log.action,
            entity: log.entity,
            entityId: log.entityId,
            details: log.details,
            createdAt: new Date(log.createdAt),
          },
        });
      }
      stats.activityLogs = logs.length;
    }

    // 9. Restore Notifications
    const notifsFile = path.join(extractDir, 'notifications.json');
    if (fs.existsSync(notifsFile)) {
      const notifs = JSON.parse(fs.readFileSync(notifsFile, 'utf-8'));
      for (const n of notifs) {
        await prisma.notification.create({
          data: {
            id: n.id,
            userId: n.userId,
            title: n.title,
            message: n.message,
            isRead: n.isRead,
            type: n.type,
            createdAt: new Date(n.createdAt),
          },
        });
      }
      stats.notifications = notifs.length;
    }

    // Clean up extracted dir
    fs.rmSync(extractDir, { recursive: true, force: true });

    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);
    console.log(`✅ Restore completed: ${totalRecords} records restored.`);

    // Notify via Telegram
    await sendMessageToTelegram(
      `🔄 *Restore Database Berhasil!*\n\n` +
      `📅 Waktu: ${new Date().toLocaleString('id-ID')}\n` +
      `📊 Total Record: ${totalRecords}\n\n` +
      Object.entries(stats).map(([k, v]) => `• ${k}: ${v}`).join('\n')
    );

    return {
      success: true,
      stats,
      message: `Restore berhasil! ${totalRecords} records telah dikembalikan.`,
    };
  } catch (error: any) {
    // Clean up on error
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    console.error('❌ Restore failed:', error.message);
    throw error;
  }
}

/**
 * Keep only the N most recent backup files, delete older ones
 */
function cleanOldBackups(keepCount: number) {
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
