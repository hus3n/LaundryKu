import { prisma } from '../config/database.js';

export async function getOutlets(adminId: string) {
  return prisma.outlet.findMany({
    where: { adminId, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createOutlet(
  adminId: string,
  data: { name: string; address?: string; phone?: string }
) {
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('Nama outlet minimal 2 karakter.');
  }
  return prisma.outlet.create({
    data: {
      adminId,
      name: data.name.trim(),
      address: data.address?.trim() || null,
      phone: data.phone?.trim() || null,
    },
  });
}

export async function updateOutlet(
  outletId: string,
  adminId: string,
  data: { name?: string; address?: string; phone?: string; isActive?: boolean }
) {
  const existing = await prisma.outlet.findFirst({ where: { id: outletId, adminId } });
  if (!existing) {
    throw new Error('Outlet tidak ditemukan.');
  }
  return prisma.outlet.update({
    where: { id: outletId },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.address !== undefined && { address: data.address.trim() || null }),
      ...(data.phone !== undefined && { phone: data.phone.trim() || null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deleteOutlet(outletId: string, adminId: string) {
  const existing = await prisma.outlet.findFirst({ where: { id: outletId, adminId } });
  if (!existing) {
    throw new Error('Outlet tidak ditemukan.');
  }
  // Soft delete agar pesanan lama tidak orphan
  return prisma.outlet.update({
    where: { id: outletId },
    data: { isActive: false },
  });
}
