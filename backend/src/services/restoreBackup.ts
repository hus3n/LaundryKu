import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database.js';
import { sendMessageToTelegram } from './telegram.service.js';
import { isMongoConnected } from '../config/mongodb.js';
import { WASession } from '../models-nosql/waSession.model.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { BotConfig } from '../models-nosql/botConfig.model.js';
import { AutoReply } from '../models-nosql/autoReply.model.js';
import { WAMessageLog } from '../models-nosql/waMessageLog.model.js';
import { disconnectAllWASessionsForRestore, initAllSavedWASessions } from '../whatsapp/baileys.js';

const SESSIONS_DIR = path.resolve(process.cwd(), 'wa-sessions');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

/**
 * Restore database, NoSQL collections, and file assets from uploaded backup ZIP file
 */
export async function restoreFromBackup(
  zipFilePath: string,
  backupDir: string
): Promise<{
  success: boolean;
  stats: Record<string, number>;
  message: string;
}> {
  // @ts-ignore
  const unzipper = (await import('unzipper')).default;
  const extractDir = path.join(backupDir, `restore-${Date.now()}`);
  const stats: Record<string, number> = {};

  try {
    // ─── 0. Disconnect active WhatsApp sockets safely before file/db overwrite ───
    await disconnectAllWASessionsForRestore();

    // ─── 1. Extract ZIP ───
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', () => resolve())
        .on('error', (err: Error) => reject(err));
    });

    // ─── 2. Verify Metadata ───
    const metadataPath = path.join(extractDir, '_metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('File backup tidak valid: _metadata.json tidak ditemukan.');
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    if (!metadata.appName || !metadata.appName.includes('LaundryKu')) {
      throw new Error('File backup bukan berasal dari aplikasi LaundryKu.');
    }

    console.log(`🔄 Starting full restore from backup: ${metadata.backupName} (${metadata.backupDate})`);

    // ─── 3. Clear PostgreSQL in safe reverse foreign key dependency order ───
    await prisma.activityLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.laundryItem.deleteMany();
    await prisma.laundryOrder.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.package.deleteMany();
    await prisma.category.deleteMany();
    await prisma.outlet.deleteMany();

    // Break circular relation between User and Admin before deleting
    await prisma.user.updateMany({
      where: { adminId: { not: null } },
      data: { adminId: null },
    });

    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️ Existing PostgreSQL data cleared.');

    // ─── 4. Restore PostgreSQL Models ───

    // Step 4.1: Restore Users (first pass with adminId: null to avoid FK error)
    const usersFile = path.join(extractDir, 'users.json');
    let parsedUsers: any[] = [];
    if (fs.existsSync(usersFile)) {
      parsedUsers = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      for (const user of parsedUsers) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            role: user.role as any,
            isActive: user.isActive,
            adminId: null, // set in step 4.3
            resetToken: user.resetToken,
            resetExpires: user.resetExpires ? new Date(user.resetExpires) : null,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
          },
        });
      }
      stats.users = parsedUsers.length;
    }

    // Step 4.2: Restore Admins (references User.id)
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
            isTrial: admin.isTrial ?? false,
            trialDays: admin.trialDays ?? null,
            isDeleted: admin.isDeleted ?? false,
            deletedAt: admin.deletedAt ? new Date(admin.deletedAt) : null,
            createdAt: new Date(admin.createdAt),
            updatedAt: new Date(admin.updatedAt),
          },
        });
      }
      stats.admins = admins.length;
    }

    // Step 4.3: Update employee Users with their original adminId
    for (const user of parsedUsers) {
      if (user.adminId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { adminId: user.adminId },
        });
      }
    }

    // Step 4.4: Restore Outlets
    const outletsFile = path.join(extractDir, 'outlets.json');
    if (fs.existsSync(outletsFile)) {
      const outlets = JSON.parse(fs.readFileSync(outletsFile, 'utf-8'));
      for (const outlet of outlets) {
        await prisma.outlet.create({
          data: {
            id: outlet.id,
            adminId: outlet.adminId,
            name: outlet.name,
            address: outlet.address,
            phone: outlet.phone,
            isActive: outlet.isActive,
            createdAt: new Date(outlet.createdAt),
            updatedAt: new Date(outlet.updatedAt),
          },
        });
      }
      stats.outlets = outlets.length;
    }

    // Step 4.5: Restore Packages
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

    // Step 4.6: Restore Categories
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

    // Step 4.7: Restore Customers
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

    // Step 4.8: Restore LaundryOrders
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
            outletId: order.outletId || null,
            status: order.status as any,
            paymentStatus: order.paymentStatus as any,
            paymentMethod: order.paymentMethod as any,
            totalPrice: order.totalPrice,
            notes: order.notes,
            fragrance: order.fragrance || null,
            clothesCount: order.clothesCount || null,
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

    // Step 4.9: Restore LaundryItems
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

    // Step 4.10: Restore Expenses
    const expensesFile = path.join(extractDir, 'expenses.json');
    if (fs.existsSync(expensesFile)) {
      const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf-8'));
      for (const exp of expenses) {
        await prisma.expense.create({
          data: {
            id: exp.id,
            adminId: exp.adminId,
            category: exp.category,
            amount: exp.amount,
            date: new Date(exp.date),
            description: exp.description,
            createdAt: new Date(exp.createdAt),
            updatedAt: new Date(exp.updatedAt),
          },
        });
      }
      stats.expenses = expenses.length;
    }

    // Step 4.11: Restore ActivityLogs
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

    // Step 4.12: Restore Notifications
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

    // ─── 5. Restore MongoDB NoSQL Collections ───
    if (isMongoConnected()) {
      try {
        // Clear existing NoSQL collections
        await WAMessageLog.deleteMany({});
        await AutoReply.deleteMany({});
        await BotConfig.deleteMany({});
        await WATemplate.deleteMany({});
        await WASession.deleteMany({});

        // Restore WASession
        const waSessionsFile = path.join(extractDir, 'wa_sessions_db.json');
        if (fs.existsSync(waSessionsFile)) {
          const sessions = JSON.parse(fs.readFileSync(waSessionsFile, 'utf-8'));
          if (sessions.length > 0) {
            await WASession.insertMany(sessions);
          }
          stats.waSessionsDb = sessions.length;
        }

        // Restore WATemplate
        const waTemplatesFile = path.join(extractDir, 'wa_templates.json');
        if (fs.existsSync(waTemplatesFile)) {
          const templates = JSON.parse(fs.readFileSync(waTemplatesFile, 'utf-8'));
          if (templates.length > 0) {
            await WATemplate.insertMany(templates);
          }
          stats.waTemplates = templates.length;
        }

        // Restore BotConfig
        const botConfigFile = path.join(extractDir, 'bot_configs.json');
        if (fs.existsSync(botConfigFile)) {
          const botConfigs = JSON.parse(fs.readFileSync(botConfigFile, 'utf-8'));
          if (botConfigs.length > 0) {
            await BotConfig.insertMany(botConfigs);
          }
          stats.botConfigs = botConfigs.length;
        }

        // Restore AutoReply
        const autoReplyFile = path.join(extractDir, 'auto_replies.json');
        if (fs.existsSync(autoReplyFile)) {
          const replies = JSON.parse(fs.readFileSync(autoReplyFile, 'utf-8'));
          if (replies.length > 0) {
            await AutoReply.insertMany(replies);
          }
          stats.autoReplies = replies.length;
        }

        // Restore WAMessageLog
        const waLogFile = path.join(extractDir, 'wa_message_logs.json');
        if (fs.existsSync(waLogFile)) {
          const logs = JSON.parse(fs.readFileSync(waLogFile, 'utf-8'));
          if (logs.length > 0) {
            await WAMessageLog.insertMany(logs);
          }
          stats.waMessageLogs = logs.length;
        }
      } catch (mongoErr: any) {
        console.warn('⚠️ Warning: MongoDB restore partial error:', mongoErr.message);
      }
    }

    // ─── 6. Restore WhatsApp Session Disk Files & Credentials ───
    const extractedWaDir = path.join(extractDir, 'wa_sessions_files');
    if (fs.existsSync(extractedWaDir)) {
      try {
        if (!fs.existsSync(SESSIONS_DIR)) {
          fs.mkdirSync(SESSIONS_DIR, { recursive: true });
        }
        fs.cpSync(extractedWaDir, SESSIONS_DIR, { recursive: true, force: true });
        console.log('✅ WhatsApp session auth files restored to disk.');
      } catch (waErr: any) {
        console.error('❌ Error restoring WA session disk files:', waErr.message);
      }
    }

    // ─── 7. Restore Uploaded Store Logos and Media ───
    const extractedUploadsDir = path.join(extractDir, 'uploads_files');
    if (fs.existsSync(extractedUploadsDir)) {
      try {
        if (!fs.existsSync(UPLOADS_DIR)) {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        fs.cpSync(extractedUploadsDir, UPLOADS_DIR, { recursive: true, force: true });
        console.log('✅ Uploaded store logos and media restored to disk.');
      } catch (uploadErr: any) {
        console.error('❌ Error restoring upload files:', uploadErr.message);
      }
    }

    // ─── 8. Trigger Automatic WhatsApp Session Reconnection ───
    try {
      console.log('🔄 Reconnecting WhatsApp sessions from restored credentials...');
      await initAllSavedWASessions();
    } catch (reconnectErr: any) {
      console.warn('⚠️ Reconnect warning:', reconnectErr.message);
    }

    // ─── 9. Clean up extracted directory ───
    fs.rmSync(extractDir, { recursive: true, force: true });

    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);
    console.log(`✅ Restore completed: ${totalRecords} records restored.`);

    // ─── 10. Notify Telegram Bot ───
    await sendMessageToTelegram(
      `🔄 *RESTORE DATABASE & SESI BERHASIL!*\n\n` +
      `📅 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
      `📊 Total Data: ${totalRecords} record\n\n` +
      `Rincian Pemulihan:\n` +
      Object.entries(stats).map(([k, v]) => `• ${k}: ${v}`).join('\n') +
      `\n\n✅ Seluruh data PostgreSQL, NoSQL/AI bot, sesi WhatsApp, dan file media telah dipulihkan seperti sebelum error.`
    );

    return {
      success: true,
      stats,
      message: `Restore berhasil! ${totalRecords} data dan sesi WhatsApp telah dikembalikan ke kondisi semula.`,
    };
  } catch (error: any) {
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    console.error('❌ Restore failed:', error.message);
    throw error;
  }
}
