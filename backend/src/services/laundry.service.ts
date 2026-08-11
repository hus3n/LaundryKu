import { prisma } from '../config/database.js';
import { createCustomer } from './customer.service.js';
import { sendOrderWANotification } from '../whatsapp/baileys.js';

export async function createLaundryOrder(
  adminId: string,
  employeeId: string,
  data: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    items: Array<{
      packageId: string;
      categoryId: string;
      quantity: number;
    }>;
    notes?: string;
    paymentStatus?: 'UNPAID' | 'PAID';
    outletId?: string;
    fragrance?: string;
    paymentMethod?: 'CASH' | 'QRIS';
  }
) {
  // 1. Ensure/create customer
  const customer = await createCustomer(adminId, {
    name: data.customerName,
    phone: data.customerPhone,
    address: data.customerAddress,
  });

  // 2. Fetch packages & categories to calculate total price & duration
  let totalPrice = 0;
  let maxDurationHours = 24;

  const itemData = [];

  for (const item of data.items) {
    const pkg = await prisma.package.findFirst({
      where: { id: item.packageId, adminId },
    });
    if (!pkg) {
      throw new Error(`Paket tidak ditemukan.`);
    }

    const cat = await prisma.category.findFirst({
      where: { id: item.categoryId, adminId },
    });
    if (!cat) {
      throw new Error(`Kategori tidak ditemukan.`);
    }

    const subtotal = Number(pkg.price) * item.quantity;
    totalPrice += subtotal;

    if (pkg.estimatedDuration > maxDurationHours) {
      maxDurationHours = pkg.estimatedDuration;
    }

    itemData.push({
      packageId: pkg.id,
      categoryId: cat.id,
      quantity: item.quantity,
      price: pkg.price,
      subtotal,
    });
  }

  // 3. Generate unique order number #LK-YYYYMMDD-XXX
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `LK-${todayStr}-`;
  
  const latestOrder = await prisma.laundryOrder.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
  });

  let seqNum = 1;
  if (latestOrder) {
    const parts = latestOrder.orderNumber.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      seqNum = lastSeq + 1;
    }
  }

  let orderNumber = `${prefix}${String(seqNum).padStart(3, '0')}`;
  let exists = await prisma.laundryOrder.findUnique({ where: { orderNumber } });
  while (exists) {
    seqNum++;
    orderNumber = `${prefix}${String(seqNum).padStart(3, '0')}`;
    exists = await prisma.laundryOrder.findUnique({ where: { orderNumber } });
  }

  // 4. Calculate estimated done date
  const estimatedDone = new Date(Date.now() + maxDurationHours * 60 * 60 * 1000);

  // 5. Create order transaction
  const order = await prisma.laundryOrder.create({
    data: {
      orderNumber,
      adminId,
      employeeId,
      customerId: customer.id,
      outletId: data.outletId || null,
      status: 'RECEIVED' as any,
      paymentStatus: (data.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID') as any,
      paymentMethod: data.paymentStatus === 'PAID' ? (data.paymentMethod as any || 'CASH') : null,
      totalPrice,
      notes: data.notes,
      fragrance: data.fragrance?.trim() || null,
      dateIn: new Date(),
      estimatedDone,
      items: {
        create: itemData,
      },
    },
    include: {
      customer: true,
      employee: { select: { id: true, name: true } },
      items: {
        include: {
          package: true,
          category: true,
        },
      },
    },
  });

  // 6. Trigger automated WA notification
  sendOrderWANotification(adminId, order, 'ORDER_RECEIVED').catch((e) =>
    console.error('WA Notify Error:', e)
  );

  await prisma.activityLog.create({
    data: {
      userId: employeeId,
      action: 'CREATE_ORDER',
      entity: 'LaundryOrder',
      entityId: order.id,
      details: JSON.stringify({
        orderNumber: order.orderNumber,
        customerName: data.customerName,
        totalPrice: String(order.totalPrice),
        itemCount: itemData.length,
      }),
    },
  });

  return order;
}

export async function getLaundryOrders(
  adminId: string,
  query: {
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }
) {
  const where: any = { adminId };

  if (query.status) {
    where.status = query.status;
  }

  if (query.paymentStatus) {
    where.paymentStatus = query.paymentStatus;
  }

  if (query.startDate && query.endDate) {
    where.dateIn = {
      gte: new Date(query.startDate),
      lte: new Date(new Date(query.endDate).setHours(23, 59, 59, 999)),
    };
  }

  if (query.search && query.search.trim() !== '') {
    where.OR = [
      { orderNumber: { contains: query.search, mode: 'insensitive' } },
      { customer: { name: { contains: query.search, mode: 'insensitive' } } },
      { customer: { phone: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  return prisma.laundryOrder.findMany({
    where,
    include: {
      customer: true,
      outlet: { select: { id: true, name: true } },
      employee: { select: { id: true, name: true } },
      items: {
        include: {
          package: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(
  orderId: string, 
  adminId: string, 
  status: string,
  changedByUserId: string
) {
  const existing = await prisma.laundryOrder.findFirst({
    where: { id: orderId, adminId },
  });

  if (!existing) {
    throw new Error('Cucian tidak ditemukan.');
  }

  const updateData: any = { status };
  if (status === 'PICKED_UP') {
    updateData.dateOut = new Date();
  }

  const updatedOrder = await prisma.laundryOrder.update({
    where: { id: orderId },
    data: updateData,
    include: {
      customer: true,
      items: {
        include: { package: true, category: true },
      },
    },
  });

  // Trigger automated WA notification on status change
  let waType: 'ORDER_IN_PROGRESS' | 'ORDER_DONE' | 'ORDER_PICKED_UP' | null = null;
  if (status === 'IN_PROGRESS') waType = 'ORDER_IN_PROGRESS';
  if (status === 'DONE') waType = 'ORDER_DONE';
  if (status === 'PICKED_UP') waType = 'ORDER_PICKED_UP';

  if (waType) {
    sendOrderWANotification(adminId, updatedOrder, waType).catch((e) =>
      console.error('WA Notify Status Update Error:', e)
    );
  }

  await prisma.activityLog.create({
    data: {
      userId: changedByUserId,
      action: 'UPDATE_STATUS',
      entity: 'LaundryOrder',
      entityId: orderId,
      details: JSON.stringify({
        newStatus: status,
        orderNumber: updatedOrder.orderNumber,
      }),
    },
  });

  return updatedOrder;
}

export async function updatePaymentStatus(
  orderId: string, 
  adminId: string, 
  paymentStatus: string,
  changedByUserId: string,
  paymentMethod?: 'CASH' | 'QRIS'
) {
  const existing = await prisma.laundryOrder.findFirst({
    where: { id: orderId, adminId },
  });

  if (!existing) {
    throw new Error('Cucian tidak ditemukan.');
  }

  const updatedOrder = await prisma.laundryOrder.update({
    where: { id: orderId },
    data: { 
      paymentStatus: paymentStatus as any,
      paymentMethod: paymentStatus === 'PAID' ? (paymentMethod as any || 'CASH') : null,
    },
    include: { customer: true },
  });

  await prisma.activityLog.create({
    data: {
      userId: changedByUserId,
      action: 'UPDATE_PAYMENT',
      entity: 'LaundryOrder',
      entityId: orderId,
      details: JSON.stringify({
        newPaymentStatus: paymentStatus,
        paymentMethod: paymentMethod || null,
      }),
    },
  });

  return updatedOrder;
}
