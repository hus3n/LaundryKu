import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getCustomersByAdmin,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getDeduplicatedCustomers,
} from '../services/customer.service.js';

export async function getCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const search = req.query.q as string | undefined;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const customers = await getCustomersByAdmin(adminId, search);
    res.json({ success: true, data: customers });
  } catch (error: any) {
    next(error);
  }
}

export async function addCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const newCustomer = await createCustomer(adminId, req.body);
    res.status(201).json({
      success: true,
      message: 'Data pelanggan tersimpan.',
      data: newCustomer,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function editCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updateCustomer(id as string, adminId as string, req.body);
    res.json({
      success: true,
      message: 'Data pelanggan diperbarui.',
      data: updated,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function removeCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    await deleteCustomer(id as string, adminId as string);
    res.json({ success: true, message: 'Data pelanggan dihapus.' });
  } catch (error: any) {
    next(error);
  }
}

export async function exportCustomersCSV(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const customers = await getDeduplicatedCustomers(adminId);

    if (customers.length === 0) {
      res.status(404).json({ success: false, error: 'Belum ada data pelanggan.' });
      return;
    }

    // Buat konten CSV
    const headers = ['Nama Pelanggan', 'Nomor Telepon'];
    const rows = customers.map((c) => [c.name, c.phone]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`) // escape tanda kutip
          .join(',')
      )
      .join('\n');

    // Tambahkan BOM (\uFEFF) agar Excel membuka UTF-8 dengan benar
    const csvWithBOM = '\uFEFF' + csvContent;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="data-pelanggan-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvWithBOM);
  } catch (error: any) {
    next(error);
  }
}
