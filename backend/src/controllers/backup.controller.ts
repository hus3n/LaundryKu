import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  connectTelegramBot,
  disconnectTelegramBot,
  getTelegramStatus,
  setChatId,
} from '../services/telegram.service.js';
import {
  createBackupArchive,
  performBackupAndSendToTelegram,
  restoreFromBackup,
  listLocalBackups,
} from '../services/backup.service.js';
import path from 'path';
import fs from 'fs';

const BACKUP_DIR = path.resolve(process.cwd(), 'backups');

// ─── Telegram Bot ───

export async function getTelegramBotStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = getTelegramStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
}

export async function connectTelegram(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ success: false, error: 'Token Bot Telegram wajib diisi.' });
      return;
    }

    const result = await connectTelegramBot(token.trim());

    if (result.success) {
      res.json({
        success: true,
        data: { botUsername: result.botUsername },
        message: result.message,
      });
    } else {
      res.status(400).json({ success: false, error: result.message });
    }
  } catch (error) {
    next(error);
  }
}

export async function setTelegramChatId(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      res.status(400).json({ success: false, error: 'Chat ID wajib diisi.' });
      return;
    }

    await setChatId(String(chatId));
    res.json({ success: true, message: 'Chat ID berhasil diset.' });
  } catch (error) {
    next(error);
  }
}

export async function disconnectTelegram(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await disconnectTelegramBot();
    res.json({ success: true, message: 'Telegram bot berhasil diputuskan.' });
  } catch (error) {
    next(error);
  }
}

// ─── Backup ───

export async function triggerManualBackup(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await performBackupAndSendToTelegram();
    res.json({
      success: result.success,
      data: { fileName: result.fileName, stats: result.stats },
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadBackup(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { filePath, fileName } = await createBackupArchive();
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download backup error:', err);
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBackupList(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const backups = listLocalBackups();
    res.json({ success: true, data: backups });
  } catch (error) {
    next(error);
  }
}

// ─── Restore ───

export async function restoreBackup(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'File backup (.zip) wajib diupload.' });
      return;
    }

    const uploadedPath = req.file.path;

    // Validate it's a zip file
    if (!req.file.originalname.endsWith('.zip')) {
      fs.unlinkSync(uploadedPath);
      res.status(400).json({ success: false, error: 'File harus berformat .zip dari backup LaundryKu.' });
      return;
    }

    const result = await restoreFromBackup(uploadedPath);

    // Clean up uploaded file
    if (fs.existsSync(uploadedPath)) {
      fs.unlinkSync(uploadedPath);
    }

    res.json({
      success: result.success,
      data: { stats: result.stats },
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `Restore gagal: ${error.message}`,
    });
  }
}
