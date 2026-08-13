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

    const headers = ['No. Nota', 'Tanggal', 'Nama Pelanggan', 'No. HP Pelanggan', 'Metode Bayar', 'Jumlah (Rp)'];
    const rows = income.map((i) => [
      i.orderNumber,
      new Date(i.date).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }),
      i.customerName,
      i.customerPhone,
      i.paymentMethod,
      i.amount.toFixed(0),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const label = month ? `${month}-${year || 'semua'}` : `${year || 'semua'}`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pemasukan-${label}.csv"`);
    res.send('\uFEFF' + csvContent);
  } catch (error: any) {
    next(error);
  }
}

// Export CSV Gabungan: Pemasukan + Pengeluaran dalam 1 file
export async function exportCombinedCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' }); return; }

    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const [income, expenses] = await Promise.all([
      getIncomeSummary(adminId, { month, year }),
      getExpenses(adminId, { month, year }),
    ]);

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const selisih = totalIncome - totalExpense;

    const escapeCell = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
    const row = (cells: string[]) => cells.map(escapeCell).join(',');

    const lines: string[] = [];

    // === SECTION 1: PEMASUKAN ===
    lines.push(row(['=== LAPORAN PEMASUKAN ===', '', '', '', '', '']));
    lines.push(row(['No. Nota', 'Tanggal', 'Nama Pelanggan', 'No. HP', 'Metode Bayar', 'Jumlah (Rp)']));
    if (income.length === 0) {
      lines.push(row(['(Tidak ada data)', '', '', '', '', '']));
    } else {
      income.forEach((i) => {
        lines.push(row([
          i.orderNumber,
          new Date(i.date).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }),
          i.customerName,
          i.customerPhone,
          i.paymentMethod,
          i.amount.toFixed(0),
        ]));
      });
    }
    lines.push(row(['', '', '', '', 'TOTAL PEMASUKAN', totalIncome.toFixed(0)]));
    lines.push(row(['', '', '', '', '', ''])); // baris kosong pemisah

    // === SECTION 2: PENGELUARAN ===
    lines.push(row(['=== LAPORAN PENGELUARAN ===', '', '', '', '', '']));
    lines.push(row(['Tanggal', 'Kategori', 'Keterangan', 'Jumlah (Rp)', '', '']));
    if (expenses.length === 0) {
      lines.push(row(['(Tidak ada data)', '', '', '', '', '']));
    } else {
      expenses.forEach((e) => {
        lines.push(row([
          new Date(e.date).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }),
          e.category,
          e.description || '-',
          Number(e.amount).toFixed(0),
          '',
          '',
        ]));
      });
    }
    lines.push(row(['', '', 'TOTAL PENGELUARAN', totalExpense.toFixed(0), '', '']));
    lines.push(row(['', '', '', '', '', ''])); // baris kosong pemisah

    // === SECTION 3: RINGKASAN ===
    lines.push(row(['=== RINGKASAN KEUANGAN ===', '', '', '', '', '']));
    lines.push(row(['Total Pemasukan', `Rp ${totalIncome.toLocaleString('id-ID')}`, '', '', '', '']));
    lines.push(row(['Total Pengeluaran', `Rp ${totalExpense.toLocaleString('id-ID')}`, '', '', '', '']));
    lines.push(row([selisih >= 0 ? 'Keuntungan Bersih' : 'Defisit', `Rp ${Math.abs(selisih).toLocaleString('id-ID')}`, '', '', '', '']));

    const csvContent = '\uFEFF' + lines.join('\n'); // BOM untuk Excel encoding

    const bulanNama = month
      ? new Date(year || new Date().getFullYear(), month - 1, 1).toLocaleString('id-ID', { month: 'long', timeZone: 'Asia/Jakarta' })
      : 'semua-bulan';
    const labelTahun = year || new Date().getFullYear();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${bulanNama}-${labelTahun}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    next(error);
  }
}
