import { Request, Response, NextFunction } from 'express';
import {
  loginService,
  registerAdminRequestService,
  forgotPasswordService,
  resetPasswordService,
} from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.json({
      success: true,
      message: 'Login berhasil.',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Login gagal.',
    });
  }
}

export async function registerRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerAdminRequestService(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.json({
      success: true,
      message: 'Instruksi reset password telah dikirim ke email Anda (jika terdaftar).',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);
    res.json({
      success: true,
      message: 'Password berhasil diubah. Silakan login dengan password baru.',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error: any) {
    next(error);
  }
}
