import { prisma } from '../config/database.js';

export async function getPackagesByAdmin(adminId: string) {
  return prisma.package.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPackage(adminId: string, data: {
  name: string;
  unit: string;
  price: number;
  estimatedDuration?: number;
}) {
  return prisma.package.create({
    data: {
      adminId,
      name: data.name,
      unit: data.unit,
      price: data.price,
      estimatedDuration: data.estimatedDuration ?? 24,
    },
  });
}

export async function updatePackage(packageId: string, adminId: string, data: {
  name?: string;
  unit?: string;
  price?: number;
  estimatedDuration?: number;
  isActive?: boolean;
}) {
  const existing = await prisma.package.findFirst({
    where: { id: packageId, adminId },
  });

  if (!existing) {
    throw new Error('Paket tidak ditemukan.');
  }

  return prisma.package.update({
    where: { id: packageId },
    data,
  });
}

export async function deletePackage(packageId: string, adminId: string) {
  const existing = await prisma.package.findFirst({
    where: { id: packageId, adminId },
  });

  if (!existing) {
    throw new Error('Paket tidak ditemukan.');
  }

  // Soft delete by deactivating or hard delete if not referenced
  const itemCount = await prisma.laundryItem.count({ where: { packageId } });
  if (itemCount > 0) {
    return prisma.package.update({
      where: { id: packageId },
      data: { isActive: false },
    });
  }

  return prisma.package.delete({ where: { id: packageId } });
}
