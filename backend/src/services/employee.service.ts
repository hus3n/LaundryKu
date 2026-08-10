import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';

export async function getEmployeesByAdmin(adminId: string) {
  return prisma.user.findMany({
    where: {
      adminId,
      role: 'EMPLOYEE' as any,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { ordersTaken: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createEmployee(adminId: string, data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error('Email karyawan sudah digunakan.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: 'EMPLOYEE' as any,
      adminId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateEmployee(employeeId: string, adminId: string, data: {
  name?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
}) {
  const existing = await prisma.user.findFirst({
    where: { id: employeeId, adminId, role: 'EMPLOYEE' as any },
  });

  if (!existing) {
    throw new Error('Karyawan tidak ditemukan.');
  }

  const updateData: any = {
    name: data.name,
    phone: data.phone,
    isActive: data.isActive,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id: employeeId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
    },
  });
}

export async function deleteEmployee(employeeId: string, adminId: string) {
  const existing = await prisma.user.findFirst({
    where: { id: employeeId, adminId, role: 'EMPLOYEE' as any },
  });

  if (!existing) {
    throw new Error('Karyawan tidak ditemukan.');
  }

  // Soft delete by setting isActive to false
  return prisma.user.update({
    where: { id: employeeId },
    data: { isActive: false },
  });
}
