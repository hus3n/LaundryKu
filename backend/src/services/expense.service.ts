import { prisma } from '../config/database.js';

export interface CreateExpenseData {
  category: string;
  amount: number;
  date: string; // ISO date string dari frontend, contoh: "2026-08-13"
  description?: string;
}

// Buat pengeluaran baru
export async function createExpense(adminId: string, data: CreateExpenseData) {
  return prisma.expense.create({
    data: {
      adminId,
      category: data.category.trim(),
      amount: data.amount,
      date: new Date(data.date),
      description: data.description?.trim() || null,
    },
  });
}

// Ambil semua pengeluaran dengan filter opsional
export async function getExpenses(
  adminId: string,
  filter?: { month?: number; year?: number }
) {
  const where: any = { adminId };

  if (filter?.year) {
    const year = filter.year;
    const month = filter.month;

    if (month) {
      // Filter bulan spesifik
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    } else {
      // Filter tahun saja
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    }
  }

  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

// Hapus pengeluaran (pastikan milik admin yang sama)
export async function deleteExpense(id: string, adminId: string) {
  const existing = await prisma.expense.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error('Data pengeluaran tidak ditemukan.');
  return prisma.expense.delete({ where: { id } });
}

// Rekap pengeluaran per hari dalam satu bulan
export async function getExpenseSummaryByDay(adminId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: { adminId, date: { gte: startDate, lte: endDate } },
    select: { amount: true, date: true },
  });

  const grouped: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.toISOString().slice(0, 10); // YYYY-MM-DD
    grouped[key] = (grouped[key] || 0) + Number(e.amount);
  });

  return grouped;
}

// Rekap pengeluaran per bulan dalam satu tahun
export async function getExpenseSummaryByMonth(adminId: string, year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: { adminId, date: { gte: startDate, lte: endDate } },
    select: { amount: true, date: true },
  });

  const grouped: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.toISOString().slice(0, 7); // YYYY-MM
    grouped[key] = (grouped[key] || 0) + Number(e.amount);
  });

  return grouped;
}

// Ambil pemasukan (LaundryOrder yang PAID) dengan filter
export async function getIncomeSummary(
  adminId: string,
  filter?: { month?: number; year?: number }
) {
  const where: any = { adminId, paymentStatus: 'PAID' };

  if (filter?.year) {
    const year = filter.year;
    const month = filter.month;

    if (month) {
      where.dateIn = {
        gte: new Date(year, month - 1, 1),
        lte: new Date(year, month, 0, 23, 59, 59, 999),
      };
    } else {
      where.dateIn = {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }
  }

  const orders = await prisma.laundryOrder.findMany({
    where,
    select: {
      orderNumber: true,
      totalPrice: true,
      dateIn: true,
      paymentMethod: true,
      customer: { select: { name: true, phone: true } },
    },
    orderBy: { dateIn: 'desc' },
  });

  return orders.map((o) => ({
    orderNumber: o.orderNumber,
    customerName: o.customer?.name || '-',
    customerPhone: o.customer?.phone || '-',
    amount: Number(o.totalPrice),
    paymentMethod: o.paymentMethod || 'CASH',
    date: o.dateIn.toISOString().slice(0, 10),
  }));
}

// Data untuk grafik: pengeluaran vs pemasukan per bulan dalam 1 tahun
export async function getFinancialChartData(adminId: string, year: number) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [expensesByMonth, incomeRaw] = await Promise.all([
    getExpenseSummaryByMonth(adminId, year),
    getIncomeSummary(adminId, { year }),
  ]);

  // Group income by month
  const incomeByMonth: Record<string, number> = {};
  incomeRaw.forEach((item) => {
    const key = item.date.slice(0, 7); // YYYY-MM
    incomeByMonth[key] = (incomeByMonth[key] || 0) + item.amount;
  });

  const labels = months.map((m) => {
    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return monthNames[m - 1];
  });

  const expenseData = months.map((m) => {
    const key = `${year}-${String(m).padStart(2, '0')}`;
    return expensesByMonth[key] || 0;
  });

  const incomeData = months.map((m) => {
    const key = `${year}-${String(m).padStart(2, '0')}`;
    return incomeByMonth[key] || 0;
  });

  return { labels, expenseData, incomeData, year };
}
