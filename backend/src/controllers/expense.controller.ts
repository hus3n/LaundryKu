import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createExpense,
  getExpenses,
  deleteExpense,
  getIncomeSummary,
  getFinancialChartData,
} from '../services/expense.service.js';

export async function addExpense(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const expense = await createExpense(adminId, req.body);
    res.status(201).json({ success: true, message: 'Pengeluaran berhasil dicatat.', data: expense });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const expenses = await getExpenses(adminId, { month, year });
    res.json({ success: true, data: expenses });
  } catch (error: any) {
    next(error);
  }
}

export async function removeExpense(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    await deleteExpense(id as string, adminId);
    res.json({ success: true, message: 'Data pengeluaran dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getIncome(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const income = await getIncomeSummary(adminId, { month, year });
    res.json({ success: true, data: income });
  } catch (error: any) {
    next(error);
  }
}

export async function getChartData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

    const data = await getFinancialChartData(adminId, year);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

// Export CSV: Pengeluaran
export async function exportExpensesCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const { getExpenses } = await import('../services/expense.service.js');
    const expenses = await getExpenses(adminId, { month, year });

    const headers = ['Tanggal', 'Kategori', 'Jumlah (Rp)', 'Keterangan'];
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleDateString('id-ID'),
      e.category,
      Number(e.amount).toFixed(0),
      e.description || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pengeluaran-${year || 'semua'}-${month || 'semua'}.csv"`);
    res.send('\uFEFF' + csvContent); // BOM untuk Excel agar tidak salah encoding
  } catch (error: any) {
    next(error);
  }
}

// Export CSV: Pemasukan
export async function exportIncomeCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const income = await getIncomeSummary(adminId, { month, year });

    const headers = ['Tanggal', 'Jumlah (Rp)'];
    const rows = income.map((i) => [
      new Date(i.date).toLocaleDateString('id-ID'),
      i.amount.toFixed(0),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pemasukan-${year || 'semua'}-${month || 'semua'}.csv"`);
    res.send('\uFEFF' + csvContent);
  } catch (error: any) {
    next(error);
  }
}
