import { prisma } from '../config/database.js';

export async function getCustomersByAdmin(adminId: string, search?: string) {
  const where: any = { adminId };

  if (search && search.trim() !== '') {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.customer.findMany({
    where,
    orderBy: { name: 'asc' },
  });
}

export async function createCustomer(adminId: string, data: { name: string; phone: string; address?: string }) {
  // Normalize phone number (replace leading 0 with 62)
  let normalizedPhone = data.phone.trim();
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '62' + normalizedPhone.slice(1);
  }

  // Check if existing
  const existing = await prisma.customer.findFirst({
    where: { adminId, phone: normalizedPhone },
  });

  if (existing) {
    return existing;
  }

  return prisma.customer.create({
    data: {
      adminId,
      name: data.name,
      phone: normalizedPhone,
      address: data.address,
    },
  });
}

export async function updateCustomer(customerId: string, adminId: string, data: { name?: string; phone?: string; address?: string }) {
  const existing = await prisma.customer.findFirst({
    where: { id: customerId, adminId },
  });

  if (!existing) {
    throw new Error('Pelanggan tidak ditemukan.');
  }

  let normalizedPhone = data.phone;
  if (normalizedPhone && normalizedPhone.startsWith('0')) {
    normalizedPhone = '62' + normalizedPhone.slice(1);
  }

  return prisma.customer.update({
    where: { id: customerId },
    data: {
      ...data,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
    },
  });
}

export async function deleteCustomer(customerId: string, adminId: string) {
  const existing = await prisma.customer.findFirst({
    where: { id: customerId, adminId },
  });

  if (!existing) {
    throw new Error('Pelanggan tidak ditemukan.');
  }

  return prisma.customer.delete({ where: { id: customerId } });
}
