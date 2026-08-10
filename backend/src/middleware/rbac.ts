import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export function authorize(...allowedRoles: Array<'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Pengguna belum terautentikasi.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.',
      });
      return;
    }

    next();
  };
}
