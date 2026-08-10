import { prisma } from '../config/database.js';

export async function getStoreSettings(adminId: string) {
  return prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      storeName: true,
      storeAddress: true,
      storeLogo: true,
      storePhone: true,
      operatingHours: true,
      subscriptionEnd: true,
    },
  });
}

export async function updateStoreSettings(adminId: string, data: {
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeLogo?: string;
  operatingHours?: any;
}) {
  return prisma.admin.update({
    where: { id: adminId },
    data,
  });
}
