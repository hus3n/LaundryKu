import { prisma } from '../config/database.js';

export async function logActivity(userId: string, action: string, entity: string, entityId?: string, details?: any) {
  try {
    return await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getActivityLogs(adminId: string) {
  return prisma.activityLog.findMany({
    where: {
      user: {
        OR: [
          { id: adminId },
          { adminId },
        ],
      },
    },
    include: {
      user: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}
