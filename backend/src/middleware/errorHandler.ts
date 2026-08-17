import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('🔥 Server Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: 'Ukuran file melebihi batas maksimum 2MB.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: `Error upload file: ${err.message}`,
    });
    return;
  }

  if (err.message && (err.message.includes('Format file tidak didukung') || err.message.includes('tidak didukung'))) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.',
    ...(process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : {}),
  });
}

