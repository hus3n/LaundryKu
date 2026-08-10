import { prisma } from '../config/database.js';

export async function getRevenueAnalytics(adminId: string, period: 'daily' | 'monthly' | 'yearly' = 'daily') {
  const orders = await prisma.laundryOrder.findMany({
    where: { adminId },
    select: {
      totalPrice: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const chartMap: Record<string, number> = {};

  orders.forEach((order) => {
    let key = '';
    const date = new Date(order.createdAt);

    if (period === 'daily') {
      key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    } else if (period === 'monthly') {
      key = date.toISOString().slice(0, 7); // YYYY-MM
    } else {
      key = String(date.getFullYear()); // YYYY
    }

    chartMap[key] = (chartMap[key] || 0) + Number(order.totalPrice);
  });

  const labels = Object.keys(chartMap);
  const data = Object.values(chartMap);

  return { labels, data, period };
}

export async function getPackageAnalytics(adminId: string) {
  const items = await prisma.laundryItem.findMany({
    where: {
      order: { adminId },
    },
    include: {
      package: { select: { name: true } },
    },
  });

  const packageMap: Record<string, { count: number; revenue: number }> = {};

  items.forEach((item) => {
    const pkgName = item.package?.name || 'Lainnya';
    if (!packageMap[pkgName]) {
      packageMap[pkgName] = { count: 0, revenue: 0 };
    }
    packageMap[pkgName].count += Number(item.quantity);
    packageMap[pkgName].revenue += Number(item.subtotal);
  });

  const result = Object.entries(packageMap).map(([name, val]) => ({
    name,
    count: val.count,
    revenue: val.revenue,
  }));

  return result;
}

export async function getEmployeePerformanceStats(adminId: string) {
  const employees = await prisma.user.findMany({
    where: { adminId, role: 'EMPLOYEE' },
    select: {
      id: true,
      name: true,
      ordersTaken: {
        where: { adminId },
        select: {
          id: true,
          status: true,
          totalPrice: true,
        },
      },
    },
  });

  return employees.map((emp) => {
    const completed = emp.ordersTaken.filter((o) => o.status === 'DONE' || o.status === 'PICKED_UP').length;
    const totalRevenueHandled = emp.ordersTaken.reduce((sum, o) => sum + Number(o.totalPrice), 0);

    return {
      id: emp.id,
      name: emp.name,
      totalOrders: emp.ordersTaken.length,
      completedOrders: completed,
      totalRevenueHandled,
    };
  });
}
