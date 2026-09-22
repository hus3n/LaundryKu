import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { crypto } from '../utils/crypto.js';

export async function loginService(email: string, pass: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      adminRef: true,
      adminOwner: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error('Email atau password salah, atau akun tidak aktif.');
  }

  const isPasswordValid = await bcrypt.compare(pass, user.password);
  if (!isPasswordValid) {
    throw new Error('Email atau password salah.');
  }

  // Check subscription if Admin
  if (user.role === 'ADMIN' && user.adminRef) {
    if (!user.adminRef.isActive || user.adminRef.subscriptionEnd < new Date()) {
      throw new Error('Masa aktif akun Admin telah berakhir. Silakan hubungi SuperAdmin.');
    }
  }

  // Check owner subscription if Employee
  if (user.role === 'EMPLOYEE' && user.adminOwner) {
    if (!user.adminOwner.isActive || user.adminOwner.subscriptionEnd < new Date()) {
      throw new Error('Masa aktif toko laundry ini telah berakhir. Silakan hubungi pemilik laundry.');
    }
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      adminId: user.adminId || user.adminRef?.id || null,
      storeName: user.adminRef?.storeName || user.adminOwner?.storeName || null,
    },
  };
}

export async function registerAdminRequestService(data: {
  storeName: string;
  name: string;
  phone: string;
  email: string;
}) {
  // Generate WhatsApp template message to SuperAdmin
  const message = [
    'Halo SuperAdmin LaundryKu,',
    '',
    'Saya ingin mendaftar sebagai Admin LaundryKu:',
    `- Nama Toko: ${data.storeName}`,
    `- Penanggung Jawab: ${data.name}`,
    `- No WA: ${data.phone}`,
    `- Email: ${data.email}`,
    '',
    'Mohon bantuannya untuk pembuatan akun. Terima kasih!',
  ].join('\n');
  
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/?text=${encodedMessage}`;

  return {
    waUrl,
    message,
  };
}

export async function forgotPasswordService(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success to avoid email enumeration
    return true;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetExpires,
    },
  });

  // TODO: Implementasi pengiriman email reset password via nodemailer atau service email
  // Sementara, link disimpan di log dengan level WARN agar bisa difilter
  console.warn('[AUTH] Password reset token generated for:', email);
  // JANGAN log token atau URL lengkap ke production log
  return true;
}

export async function resetPasswordService(token: string, newPass: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Token reset password tidak valid atau telah kadaluarsa.');
  }

  const hashedPassword = await bcrypt.hash(newPass, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetExpires: null,
    },
  });

  return true;
}

export interface RegisterAdminInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  storeName: string;
  storeAddress?: string;
  planType: 'TRIAL' | 'DIRECT_SUBSCRIPTION' | 'FREE';
  durationMonths?: number;
}

export async function registerAdminService(data: RegisterAdminInput) {
  const cleanEmail = data.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    throw new Error('Alamat email sudah terdaftar. Silakan login atau gunakan email lain.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  let isTrial = false;
  let trialDays: number | null = null;
  let subscriptionEnd: Date;

  if (data.planType === 'TRIAL') {
    isTrial = true;
    trialDays = 30;
    subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else if (data.planType === 'DIRECT_SUBSCRIPTION') {
    isTrial = false;
    trialDays = null;
    const months = data.durationMonths && data.durationMonths > 0 ? data.durationMonths : 1;
    subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + months);
  } else {
    // FREE Tier
    isTrial = false;
    trialDays = 0;
    subscriptionEnd = new Date('2099-12-31T23:59:59.999Z');
  }

  const createdData = await prisma.$transaction(async (tx) => {
    // 1. Create User (Role.ADMIN)
    const user = await tx.user.create({
      data: {
        name: data.name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: data.phone.trim(),
        role: Role.ADMIN,
        isActive: true,
      },
    });

    // 2. Create Admin Store
    const admin = await tx.admin.create({
      data: {
        userId: user.id,
        storeName: data.storeName.trim(),
        storeAddress: data.storeAddress?.trim() || null,
        storePhone: data.phone.trim(),
        subscriptionEnd,
        isActive: true,
        isTrial,
        trialDays,
      },
    });

    // 3. Create Default Outlet
    await tx.outlet.create({
      data: {
        adminId: admin.id,
        name: 'Outlet Pusat',
        address: data.storeAddress?.trim() || null,
        phone: data.phone.trim(),
        isActive: true,
      },
    });

    // 4. Create Default Categories
    await tx.category.createMany({
      data: [
        { adminId: admin.id, name: 'Kiloan', isActive: true },
        { adminId: admin.id, name: 'Satuan', isActive: true },
      ],
    });

    // 5. Create Default Packages
    await tx.package.createMany({
      data: [
        {
          adminId: admin.id,
          name: 'Cuci Komplit Reguler',
          price: 7000,
          unit: 'kg',
          estimatedDuration: 48,
          isActive: true,
        },
        {
          adminId: admin.id,
          name: 'Cuci Kering Lipat',
          price: 5000,
          unit: 'kg',
          estimatedDuration: 48,
          isActive: true,
        },
        {
          adminId: admin.id,
          name: 'Setrika Saja',
          price: 4000,
          unit: 'kg',
          estimatedDuration: 24,
          isActive: true,
        },
        {
          adminId: admin.id,
          name: 'Bed Cover Sedang',
          price: 25000,
          unit: 'pcs',
          estimatedDuration: 72,
          isActive: true,
        },
      ],
    });

    return { user, admin };
  });

  const token = jwt.sign(
    {
      id: createdData.user.id,
      email: createdData.user.email,
      role: createdData.user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  return {
    token,
    user: {
      id: createdData.user.id,
      name: createdData.user.name,
      email: createdData.user.email,
      role: createdData.user.role,
      phone: createdData.user.phone,
      adminId: createdData.admin.id,
      storeName: createdData.admin.storeName,
      storeAddress: createdData.admin.storeAddress,
      storePhone: createdData.admin.storePhone,
      subscriptionEnd: createdData.admin.subscriptionEnd,
      isTrial: createdData.admin.isTrial,
      trialDays: createdData.admin.trialDays,
    },
    planType: data.planType,
  };
}
