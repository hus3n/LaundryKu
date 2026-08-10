import { prisma } from '../config/database.js';

export async function getCategoriesByAdmin(adminId: string) {
  return prisma.category.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCategory(adminId: string, name: string) {
  return prisma.category.create({
    data: {
      adminId,
      name,
    },
  });
}

export async function updateCategory(categoryId: string, adminId: string, data: { name?: string; isActive?: boolean }) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId, adminId },
  });

  if (!existing) {
    throw new Error('Kategori tidak ditemukan.');
  }

  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
}

export async function deleteCategory(categoryId: string, adminId: string) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId, adminId },
  });

  if (!existing) {
    throw new Error('Kategori tidak ditemukan.');
  }

  const itemCount = await prisma.laundryItem.count({ where: { categoryId } });
  if (itemCount > 0) {
    return prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false },
    });
  }

  return prisma.category.delete({ where: { id: categoryId } });
}
