import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';

export async function getCustomersByAdmin(adminId: string, search?: string) {
  const where: Prisma.CustomerWhereInput = { adminId };

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

interface UpdateCustomerData {
  name?: string;
  phone?: string;
  address?: string;
}

export async function updateCustomer(
  customerId: string,
  adminId: string,
  data: UpdateCustomerData,
) {
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

// Ambil data pelanggan yang sudah dideduplikasi berdasarkan nomor telepon
// Rule: jika nomor sama, gunakan nama yang pertama kali terdaftar (createdAt paling lama)
export async function getDeduplicatedCustomers(adminId: string): Promise<{ name: string; phone: string }[]> {
  // Ambil semua customer, urutkan dari yang paling lama dibuat (ASC)
  const customers = await prisma.customer.findMany({
    where: { adminId },
    select: { name: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'asc' }, // PENTING: terlama dulu
  });

  // Proses deduplikasi menggunakan Map
  const phoneMap = new Map<string, string>(); // phone -> name

  for (const customer of customers) {
    const normalizedPhone = customer.phone.trim();
    if (!phoneMap.has(normalizedPhone)) {
      // Pertama kali nomor ini muncul → simpan
      phoneMap.set(normalizedPhone, customer.name.trim());
    }
    // Jika sudah ada → skip (buang)
  }

  // Konversi Map kembali ke array
  const result: { name: string; phone: string }[] = [];
  phoneMap.forEach((name, phone) => {
    result.push({ name, phone });
  });

  // Urutkan hasil berdasarkan nama (A-Z) untuk kemudahan pembacaan
  result.sort((a, b) => a.name.localeCompare(b.name, 'id'));

  return result;
}
