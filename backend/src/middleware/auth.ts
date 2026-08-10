import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
  adminId?: string | null;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Akses ditolak. Token autentikasi tidak ditemukan.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        adminId: true,
        adminRef: {
          select: { id: true, subscriptionEnd: true, isActive: true },
        },
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Akun tidak aktif atau tidak ditemukan.',
      });
      return;
    }

    // Check admin subscription status if ADMIN or EMPLOYEE
    if (user.role === 'ADMIN' && user.adminRef) {
      if (!user.adminRef.isActive || user.adminRef.subscriptionEnd < new Date()) {
        res.status(403).json({
          success: false,
          error: 'Masa aktif akun Admin telah berakhir. Silakan hubungi SuperAdmin.',
          isExpired: true,
        });
        return;
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      adminId: user.adminId || (user.adminRef ? user.adminRef.id : user.role === 'SUPERADMIN' ? 'SUPERADMIN' : null),
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token autentikasi tidak valid atau telah kadaluarsa.',
    });
  }
}
