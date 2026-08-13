import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../config/database.js';
import { isMongoConnected } from '../config/mongodb.js';
import { WASession } from '../models-nosql/waSession.model.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function getSuperAdminDashboardData() {
  // Run all counts in parallel for speed
  const [totalAdmins, activeAdmins, expiringSoon, totalOrdersCount] = await Promise.all([
    prisma.admin.count(),
    prisma.admin.count({
      where: { isActive: true, subscriptionEnd: { gte: new Date() } },
    }),
    prisma.admin.count({
      where: {
        isActive: true,
        subscriptionEnd: {
          gte: new Date(),
          lte: new Date(Date.now() + SEVEN_DAYS_MS),
        },
      },
    }),
    prisma.laundryOrder.count(),
  ]);

  return {
    totalAdmins,
    activeAdmins,
    expiredAdmins: totalAdmins - activeAdmins,
    expiringSoon,
    totalOrdersCount,
  };
}

export async function getAllAdmins() {
  const admins = await prisma.admin.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          employees: true,
          orders: true,
          customers: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Skip MongoDB entirely if not connected - instant response
  if (!isMongoConnected()) {
    return admins.map((admin) => ({
      ...admin,
      waStatus: 'DISCONNECTED',
      waPhone: null,
    }));
  }

  // Batch fetch all WA sessions in ONE query instead of N queries
  try {
    const adminIds = admins.map((a) => a.id);
    const waSessions = await WASession.find({ adminId: { $in: adminIds } }).lean().exec();
    const waMap = new Map(waSessions.map((s: any) => [s.adminId, s]));

    return admins.map((admin) => {
      const wa = waMap.get(admin.id);
      return {
        ...admin,
        waStatus: wa ? wa.status : 'DISCONNECTED',
        waPhone: wa ? wa.phoneConnected : null,
      };
    });
  } catch (err) {
    return admins.map((admin) => ({
      ...admin,
      waStatus: 'DISCONNECTED',
      waPhone: null,
    }));
  }
}

export async function createAdminWithStore(data: {
  storeName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  storeAddress?: string;
  durationMonths: number;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email pengelola sudah terdaftar.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const subscriptionEnd = new Date();
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + data.durationMonths);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    const admin = await tx.admin.create({
      data: {
        userId: user.id,
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storePhone: data.phone,
        subscriptionEnd,
        isActive: true,
      },
    });

    return { user, admin };
  });
}

export async function extendAdminSubscription(adminId: string, additionalMonths: number) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw new Error('Admin toko tidak ditemukan.');
  }

  const currentEnd = new Date(admin.subscriptionEnd);
  const startDate = currentEnd < new Date() ? new Date() : currentEnd;
  startDate.setMonth(startDate.getMonth() + additionalMonths);

  return prisma.admin.update({
    where: { id: adminId },
    data: { subscriptionEnd: startDate, isActive: true },
  });
}

export async function toggleAdminStatus(adminId: string, isActive: boolean) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw new Error('Admin toko tidak ditemukan.');
  }

  return prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: admin.userId }, data: { isActive } });
    return tx.admin.update({ where: { id: adminId }, data: { isActive } });
  });
}

export async function deleteAdmin(adminId: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw new Error('Admin toko tidak ditemukan.');
  }

  return prisma.$transaction(async (tx) => {
    await tx.admin.delete({ where: { id: adminId } });
    await tx.user.delete({ where: { id: admin.userId } });
  });
}

export async function createTrialAdmin(data: {
  storeName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  trialDays: 3 | 5 | 7;
  storeAddress?: string;
}) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error('Email pengelola sudah terdaftar.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const subscriptionEnd = new Date();
  subscriptionEnd.setDate(subscriptionEnd.getDate() + data.trialDays);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    const admin = await tx.admin.create({
      data: {
        userId: user.id,
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storePhone: data.phone,
        subscriptionEnd,
        isActive: true,
        isTrial: true,
        trialDays: data.trialDays,
      },
    });
    return { user, admin };
  });
}

export async function cleanupExpiredTrials() {
  const now = new Date();
  const expiredTrials = await prisma.admin.findMany({
    where: {
      isTrial: true,
      isDeleted: false,
      isActive: true,
      subscriptionEnd: { lte: now },
    },
    include: { user: true },
  });

  const results = [];
  for (const admin of expiredTrials) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: admin.userId }, data: { isActive: false } });
      await tx.admin.update({
        where: { id: admin.id },
        data: { isActive: false, isDeleted: true, deletedAt: now },
      });
    });
    results.push({
      adminId: admin.id,
      storeName: admin.storeName,
      phone: admin.user?.phone,
      name: admin.user?.name,
    });
  }
  return results;
}

export async function hardDeleteExpiredTrials() {
  const cutoffTime = new Date(Date.now() - ONE_DAY_MS);
  const toDelete = await prisma.admin.findMany({
    where: {
      isTrial: true,
      isDeleted: true,
      deletedAt: { lte: cutoffTime },
    },
    include: { user: true },
  });
  for (const admin of toDelete) {
    await prisma.$transaction(async (tx) => {
      await tx.admin.delete({ where: { id: admin.id } });
      await tx.user.delete({ where: { id: admin.userId } });
    });
  }
  return toDelete.length;
}
