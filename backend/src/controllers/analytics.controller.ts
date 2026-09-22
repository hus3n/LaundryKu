import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getRevenueAnalytics,
  getPackageAnalytics,
  getEmployeePerformanceStats,
} from '../services/analytics.service.js';
import { getActivityLogs } from '../services/activityLog.service.js';

export async function getRevenueChart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const period = (req.query.period as 'daily' | 'monthly' | 'yearly') || 'daily';

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const data = await getRevenueAnalytics(adminId, period);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getPackageStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const data = await getPackageAnalytics(adminId);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getEmployeeStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const data = await getEmployeePerformanceStats(adminId);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const logs = await getActivityLogs(adminId);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    next(error);
  }
}

export async function exportAllDataExcel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const { generateAllAdminDataExcel } = await import('../services/excelExport.service.js');
    const workbook = await generateAllAdminDataExcel(adminId);

    const todayStr = new Date().toISOString().slice(0, 10);
    const filename = `LaundryKu-Semua-Data-${todayStr}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error: any) {
    next(error);
  }
}
