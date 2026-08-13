import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getEmployeesByAdmin,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employee.service.js';

export async function getEmployees(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const employees = await getEmployeesByAdmin(adminId);
    res.json({ success: true, data: employees });
  } catch (error: any) {
    next(error);
  }
}

export async function addEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const newEmployee = await createEmployee(adminId, req.body);
    res.status(201).json({
      success: true,
      message: 'Karyawan berhasil ditambahkan.',
      data: newEmployee,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function editEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updateEmployee(id as string, adminId as string, req.body);
    res.json({
      success: true,
      message: 'Data karyawan diperbarui.',
      data: updated,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function removeEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    await deleteEmployee(id as string, adminId as string);
    res.json({ success: true, message: 'Karyawan berhasil dinonaktifkan.' });
  } catch (error: any) {
    next(error);
  }
}
