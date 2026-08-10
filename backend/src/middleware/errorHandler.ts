import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('🔥 Server Error:', err);

  res.status(500).json({
    success: false,
    error: 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.',
    ...(process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : {}),
  });
}
