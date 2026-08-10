import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getTelegramBotStatus,
  connectTelegram,
  setTelegramChatId,
  disconnectTelegram,
  triggerManualBackup,
  downloadBackup,
  getBackupList,
  restoreBackup,
} from '../controllers/backup.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

// Multer config for restore file upload
const uploadDir = path.resolve(process.cwd(), 'backups', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file .zip yang diizinkan.'));
    }
  },
});

// All routes require SuperAdmin authentication
router.use(authenticate);
router.use(authorize('SUPERADMIN'));

// Telegram Bot
router.get('/telegram/status', getTelegramBotStatus);
router.post('/telegram/connect', connectTelegram);
router.post('/telegram/chat-id', setTelegramChatId);
router.post('/telegram/disconnect', disconnectTelegram);

// Backup
router.post('/trigger', triggerManualBackup);
router.get('/download', downloadBackup);
router.get('/list', getBackupList);

// Restore
router.post('/restore', upload.single('backupFile'), restoreBackup);

export default router;
