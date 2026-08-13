import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
