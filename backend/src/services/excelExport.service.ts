import ExcelJS from 'exceljs';
import { prisma } from '../config/database.js';

interface FormatOptions {
  headerBg?: string;
  headerColor?: string;
}

const PRIMARY_COLOR = 'FF015383'; // Orient Blue
const ACCENT_COLOR = 'FF1DA9D0';  // Curious Blue
const LIGHT_BG = 'FFF8FAFC';      // Slate 50
const BORDER_COLOR = 'FFCBD5E1';  // Slate 300

function applyHeaderStyles(row: ExcelJS.Row, bg = PRIMARY_COLOR, color = 'FFFFFFFF') {
  row.height = 28;
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bg },
    };
    cell.font = {
      name: 'Segoe UI',
      color: { argb: color },
      bold: true,
      size: 11,
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'medium', color: { argb: bg } },
      bottom: { style: 'medium', color: { argb: bg } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  });
}

function autoFitColumns(worksheet: ExcelJS.Worksheet, minWidth = 12, maxWidth = 55) {
  worksheet.columns.forEach((column) => {
    let maxLen = 0;
    if (column && column.eachCell) {
      column.eachCell({ includeEmpty: false }, (cell) => {
        const val = cell.value;
        let str = '';
        if (val !== null && val !== undefined) {
          if (typeof val === 'object' && 'result' in val) {
            str = String(val.result || '');
          } else if (val instanceof Date) {
            str = val.toLocaleDateString('id-ID');
          } else {
            str = String(val);
          }
        }
        if (str.length > maxLen) {
          maxLen = str.length;
        }
      });
    }
    column.width = Math.min(maxWidth, Math.max(minWidth, maxLen + 4));
  });
}

function generateVisualBar(val: number, maxVal: number, maxChars = 14): string {
  if (maxVal <= 0 || val <= 0) return '░░░░░░░░░░░░░░';
  const ratio = Math.min(1, Math.max(0, val / maxVal));
  const filledChars = Math.round(ratio * maxChars);
  const emptyChars = maxChars - filledChars;
  return '█'.repeat(filledChars) + '░'.repeat(emptyChars);
}

export async function generateAllAdminDataExcel(adminId: string): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'LaundryKu System';
  workbook.lastModifiedBy = 'Admin LaundryKu';
  workbook.created = new Date();
  workbook.modified = new Date();

  // 1. Fetch all store data
  const [admin, customers, orders, expenses] = await Promise.all([
    prisma.admin.findUnique({
      where: { id: adminId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
    }),
    prisma.customer.findMany({
      where: { adminId },
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.laundryOrder.findMany({
      where: { adminId },
      include: {
        customer: true,
        outlet: true,
        employee: { select: { id: true, name: true } },
        items: {
          include: {
            package: true,
            category: true,
          },
        },
      },
      orderBy: { dateIn: 'desc' },
    }),
    prisma.expense.findMany({
      where: { adminId },
      orderBy: { date: 'desc' },
    }),
  ]);

  const storeName = admin?.storeName || 'LaundryKu Store';
  const ownerName = admin?.user?.name || '-';
  const storePhone = admin?.storePhone || admin?.user?.phone || '-';
  const storeAddress = admin?.storeAddress || '-';
  const orderIds = orders.map((o) => o.id);

  // 2. Fetch Activity Logs for orders
  const logs = orderIds.length > 0
    ? await prisma.activityLog.findMany({
        where: {
          entity: 'LaundryOrder',
          entityId: { in: orderIds },
        },
        include: {
          user: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  const orderMap = new Map(orders.map((o) => [o.id, o.orderNumber]));

  // Calculate high-level financial KPIs
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
  const totalOmset = paidOrders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const totalPengeluaran = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = totalOmset - totalPengeluaran;

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Monthly breakdown for financial chart table
  const monthlyData = months.map((m) => {
    const monthOrders = paidOrders.filter((o) => {
      const d = new Date(o.dateIn);
      return d.getFullYear() === currentYear && d.getMonth() + 1 === m;
    });
    const monthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() + 1 === m;
    });

    const income = monthOrders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const expense = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const profit = income - expense;
    return {
      monthNumber: m,
      monthName: monthNames[m - 1],
      income,
      expense,
      profit,
      orderCount: monthOrders.length,
    };
  });

  const maxMonthVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expense)),
    1
  );

  // ==========================================
  // SHEET 1: RINGKASAN & GRAFIK KEUANGAN
  // ==========================================
  const wsSummary = workbook.addWorksheet('Ringkasan & Grafik', {
    views: [{ showGridLines: true }],
  });

  // Store Header
  wsSummary.mergeCells('A1:G1');
  const titleCell = wsSummary.getCell('A1');
  titleCell.value = `LAPORAN RINGKASAN & ANALITIK KEUANGAN - ${storeName.toUpperCase()}`;
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsSummary.getRow(1).height = 36;

  wsSummary.mergeCells('A2:G2');
  const subTitleCell = wsSummary.getCell('A2');
  subTitleCell.value = `Alamat: ${storeAddress} | No. Telp: ${storePhone} | Pemilik: ${ownerName} | Tanggal Unduh: ${new Date().toLocaleString('id-ID')}`;
  subTitleCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsSummary.getRow(2).height = 22;

  // Space
  wsSummary.addRow([]);

  // KPI Section
  wsSummary.mergeCells('A4:G4');
  const kpiHeader = wsSummary.getCell('A4');
  kpiHeader.value = 'RINGKASAN METRIK KUNCI BISNIS';
  kpiHeader.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: PRIMARY_COLOR } };
  kpiHeader.alignment = { vertical: 'middle' };
  wsSummary.getRow(4).height = 24;

  const kpiRow1 = wsSummary.addRow(['Total Pemasukan (Omset Lunas)', totalOmset, '', 'Total Pengeluaran Operasional', totalPengeluaran]);
  wsSummary.getCell('A5').font = { bold: true };
  wsSummary.getCell('B5').font = { bold: true, color: { argb: 'FF059669' } };
  wsSummary.getCell('B5').numFmt = '"Rp "#,##0';
  wsSummary.getCell('D5').font = { bold: true };
  wsSummary.getCell('E5').font = { bold: true, color: { argb: 'FFE11D48' } };
  wsSummary.getCell('E5').numFmt = '"Rp "#,##0';

  const kpiRow2 = wsSummary.addRow(['Laba Bersih (Net Profit)', netProfit, '', 'Total Transaksi Cucian', orders.length]);
  wsSummary.getCell('A6').font = { bold: true };
  wsSummary.getCell('B6').font = { bold: true, color: { argb: netProfit >= 0 ? 'FF059669' : 'FFE11D48' } };
  wsSummary.getCell('B6').numFmt = '"Rp "#,##0';
  wsSummary.getCell('D6').font = { bold: true };
  wsSummary.getCell('E6').font = { bold: true };

  const kpiRow3 = wsSummary.addRow(['Total Pelanggan Terdaftar', customers.length, '', 'Tahun Analitik', currentYear]);
  wsSummary.getCell('A7').font = { bold: true };
  wsSummary.getCell('B7').font = { bold: true };
  wsSummary.getCell('D7').font = { bold: true };
  wsSummary.getCell('E7').font = { bold: true };

  wsSummary.addRow([]);

  // Monthly Table (Grafik / Tren Keuangan Bulanan)
  wsSummary.mergeCells('A9:G9');
  const chartTitle = wsSummary.getCell('A9');
  chartTitle.value = `TABEL ANALITIK & GRAFIK TREN KEUANGAN TAHUN ${currentYear}`;
  chartTitle.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: PRIMARY_COLOR } };
  chartTitle.alignment = { vertical: 'middle' };
  wsSummary.getRow(9).height = 24;

  const chartHeaders = [
    'Bulan',
    'Pemasukan (Rp)',
    'Grafik Pemasukan',
    'Pengeluaran (Rp)',
    'Grafik Pengeluaran',
    'Laba / Rugi (Rp)',
    'Jumlah Order',
  ];
  const chartHeaderRow = wsSummary.addRow(chartHeaders);
  applyHeaderStyles(chartHeaderRow, PRIMARY_COLOR);

  monthlyData.forEach((row, idx) => {
    const r = wsSummary.addRow([
      row.monthName,
      row.income,
      generateVisualBar(row.income, maxMonthVal),
      row.expense,
      generateVisualBar(row.expense, maxMonthVal),
      row.profit,
      row.orderCount,
    ]);

    r.height = 20;
    r.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    r.getCell(2).numFmt = '"Rp "#,##0';
    r.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(3).font = { name: 'Courier New', size: 10, color: { argb: 'FF0284C7' } };
    r.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(4).numFmt = '"Rp "#,##0';
    r.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(5).font = { name: 'Courier New', size: 10, color: { argb: 'FFE11D48' } };
    r.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(6).numFmt = '"Rp "#,##0';
    r.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(6).font = { bold: true, color: { argb: row.profit >= 0 ? 'FF059669' : 'FFE11D48' } };
    r.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };

    // Zebra striping
    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  // Total summary row for the table
  const totalChartRow = wsSummary.addRow([
    'TOTAL TAHUNAN',
    { formula: 'SUM(B11:B22)' },
    '',
    { formula: 'SUM(D11:D22)' },
    '',
    { formula: 'SUM(F11:F22)' },
    { formula: 'SUM(G11:G22)' },
  ]);
  totalChartRow.height = 24;
  totalChartRow.eachCell((cell) => {
    cell.font = { bold: true, name: 'Segoe UI' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  });
  totalChartRow.getCell(2).numFmt = '"Rp "#,##0';
  totalChartRow.getCell(4).numFmt = '"Rp "#,##0';
  totalChartRow.getCell(6).numFmt = '"Rp "#,##0';
  totalChartRow.getCell(7).alignment = { horizontal: 'center' };

  wsSummary.addRow([]);

  // Status Cucian Breakdown
  const statusCounts = {
    RECEIVED: orders.filter((o) => o.status === 'RECEIVED').length,
    IN_PROGRESS: orders.filter((o) => o.status === 'IN_PROGRESS').length,
    DONE: orders.filter((o) => o.status === 'DONE').length,
    PICKED_UP: orders.filter((o) => o.status === 'PICKED_UP').length,
  };

  wsSummary.mergeCells('A25:C25');
  wsSummary.getCell('A25').value = 'DISTRIBUSI STATUS PROSES CUCIAN';
  wsSummary.getCell('A25').font = { bold: true, color: { argb: PRIMARY_COLOR } };

  const statusHeaderRow = wsSummary.addRow(['Status Pengerjaan', 'Jumlah Cucian', 'Persentase']);
  applyHeaderStyles(statusHeaderRow, ACCENT_COLOR);

  const statusList = [
    { label: 'Diterima (RECEIVED)', count: statusCounts.RECEIVED },
    { label: 'Sedang Dicuci (IN_PROGRESS)', count: statusCounts.IN_PROGRESS },
    { label: 'Selesai (DONE)', count: statusCounts.DONE },
    { label: 'Sudah Diambil (PICKED_UP)', count: statusCounts.PICKED_UP },
  ];

  statusList.forEach((st) => {
    const pct = orders.length > 0 ? (st.count / orders.length) * 100 : 0;
    const r = wsSummary.addRow([st.label, st.count, `${pct.toFixed(1)}%`]);
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).alignment = { horizontal: 'center' };
  });

  autoFitColumns(wsSummary);

  // ==========================================
  // SHEET 2: DATA PELANGGAN
  // ==========================================
  const wsCustomer = workbook.addWorksheet('Data Pelanggan', {
    views: [{ state: 'frozen', ySplit: 3, showGridLines: true }],
  });

  wsCustomer.mergeCells('A1:H1');
  const custTitle = wsCustomer.getCell('A1');
  custTitle.value = `DATABASE SELURUH PELANGGAN - ${storeName.toUpperCase()}`;
  custTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  custTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  custTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsCustomer.getRow(1).height = 32;

  wsCustomer.mergeCells('A2:H2');
  const custSub = wsCustomer.getCell('A2');
  custSub.value = `Total ${customers.length} pelanggan terdaftar per ${new Date().toLocaleDateString('id-ID')}`;
  custSub.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  custSub.alignment = { vertical: 'middle', horizontal: 'center' };
  custSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsCustomer.getRow(2).height = 20;

  const custHeaders = [
    'No',
    'ID Pelanggan',
    'Nama Lengkap',
    'Nomor WhatsApp',
    'Alamat',
    'Jumlah Order',
    'Total Belanja (Rp)',
    'Tanggal Bergabung',
  ];
  const custHeaderRow = wsCustomer.addRow(custHeaders);
  applyHeaderStyles(custHeaderRow, PRIMARY_COLOR);

  customers.forEach((cust, idx) => {
    const totalSpent = cust.orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    const r = wsCustomer.addRow([
      idx + 1,
      cust.id,
      cust.name,
      cust.phone,
      cust.address || '-',
      cust.orders.length,
      totalSpent,
      cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('id-ID') : '-',
    ]);

    r.height = 20;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(4).alignment = { horizontal: 'center' };
    r.getCell(6).alignment = { horizontal: 'center' };
    r.getCell(7).numFmt = '"Rp "#,##0';
    r.getCell(7).alignment = { horizontal: 'right' };
    r.getCell(8).alignment = { horizontal: 'center' };

    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  autoFitColumns(wsCustomer);

  // ==========================================
  // SHEET 3: DATA TRANSAKSI CUCIAN
  // ==========================================
  const wsLaundry = workbook.addWorksheet('Data Cucian', {
    views: [{ state: 'frozen', ySplit: 3, showGridLines: true }],
  });

  wsLaundry.mergeCells('A1:O1');
  const laundryTitle = wsLaundry.getCell('A1');
  laundryTitle.value = `DATA TRANSAKSI CUCIAN LENGKAP - ${storeName.toUpperCase()}`;
  laundryTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  laundryTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  laundryTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsLaundry.getRow(1).height = 32;

  wsLaundry.mergeCells('A2:O2');
  const laundrySub = wsLaundry.getCell('A2');
  laundrySub.value = `Total ${orders.length} order cucian tercatat | Status pengerjaan, pembayaran & rincian pakaian`;
  laundrySub.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  laundrySub.alignment = { vertical: 'middle', horizontal: 'center' };
  laundrySub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsLaundry.getRow(2).height = 20;

  const laundryHeaders = [
    'No',
    'No. Nota',
    'Tgl Masuk',
    'Estimasi Selesai',
    'Tgl Selesai / Keluar',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Outlet',
    'Rincian Layanan',
    'Jumlah Pakaian (pcs)',
    'Catatan / Parfum',
    'Total Biaya (Rp)',
    'Status Cucian',
    'Status Bayar',
    'Metode Bayar',
  ];
  const laundryHeaderRow = wsLaundry.addRow(laundryHeaders);
  applyHeaderStyles(laundryHeaderRow, PRIMARY_COLOR);

  const statusLabelMap: Record<string, string> = {
    RECEIVED: 'Diterima',
    IN_PROGRESS: 'Sedang Dicuci',
    DONE: 'Selesai',
    PICKED_UP: 'Sudah Diambil',
  };

  orders.forEach((o, idx) => {
    const itemDetails = (o.items || [])
      .map(
        (it) =>
          `${it.category?.name || ''} ${it.package?.name || ''} (${Number(it.quantity)} ${it.package?.unit || ''})`
      )
      .join('; ');

    const r = wsLaundry.addRow([
      idx + 1,
      o.orderNumber,
      o.dateIn ? new Date(o.dateIn).toLocaleDateString('id-ID') : '-',
      o.estimatedDone ? new Date(o.estimatedDone).toLocaleDateString('id-ID') : '-',
      o.dateOut ? new Date(o.dateOut).toLocaleDateString('id-ID') : '-',
      o.customer?.name || '-',
      o.customer?.phone || '-',
      o.outlet?.name || 'Pusat',
      itemDetails || '-',
      o.clothesCount ?? '-',
      `${o.fragrance ? `Parfum: ${o.fragrance}` : ''}${o.notes ? ` (${o.notes})` : ''}`.trim() || '-',
      Number(o.totalPrice || 0),
      statusLabelMap[o.status] || o.status,
      o.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR',
      o.paymentMethod || '-',
    ]);

    r.height = 20;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).alignment = { horizontal: 'center' };
    r.getCell(4).alignment = { horizontal: 'center' };
    r.getCell(5).alignment = { horizontal: 'center' };
    r.getCell(7).alignment = { horizontal: 'center' };
    r.getCell(10).alignment = { horizontal: 'center' };
    r.getCell(12).numFmt = '"Rp "#,##0';
    r.getCell(12).alignment = { horizontal: 'right' };
    r.getCell(13).alignment = { horizontal: 'center' };
    r.getCell(14).alignment = { horizontal: 'center' };
    r.getCell(15).alignment = { horizontal: 'center' };

    // Format badge text colors
    if (o.paymentStatus === 'PAID') {
      r.getCell(14).font = { bold: true, color: { argb: 'FF059669' } };
    } else {
      r.getCell(14).font = { bold: true, color: { argb: 'FFE11D48' } };
    }

    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  autoFitColumns(wsLaundry);

  // ==========================================
  // SHEET 4: RIWAYAT STATUS & LOG CUCIAN
  // ==========================================
  const wsLogs = workbook.addWorksheet('Riwayat Log Status', {
    views: [{ state: 'frozen', ySplit: 3, showGridLines: true }],
  });

  wsLogs.mergeCells('A1:G1');
  const logsTitle = wsLogs.getCell('A1');
  logsTitle.value = `AUDIT TRAIL & RIWAYAT PERUBAHAN STATUS CUCIAN - ${storeName.toUpperCase()}`;
  logsTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  logsTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  logsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsLogs.getRow(1).height = 32;

  wsLogs.mergeCells('A2:G2');
  const logsSub = wsLogs.getCell('A2');
  logsSub.value = `Catatan audit setiap kali status pengerjaan atau status pembayaran pesanan diperbarui`;
  logsSub.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  logsSub.alignment = { vertical: 'middle', horizontal: 'center' };
  logsSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsLogs.getRow(2).height = 20;

  const logsHeaders = [
    'No',
    'No. Nota',
    'Waktu Kejadian',
    'Aksi / Status',
    'Detail Keterangan',
    'Nama Petugas',
    'Role Petugas',
  ];
  const logsHeaderRow = wsLogs.addRow(logsHeaders);
  applyHeaderStyles(logsHeaderRow, PRIMARY_COLOR);

  logs.forEach((log, idx) => {
    const orderNumber = log.entityId ? orderMap.get(log.entityId) || log.entityId : '-';
    let detailStr = '-';

    if (log.details) {
      if (typeof log.details === 'object') {
        const d = log.details as Record<string, any>;
        if (d.previousStatus && d.newStatus) {
          detailStr = `Status berubah: ${statusLabelMap[d.previousStatus] || d.previousStatus} ➜ ${statusLabelMap[d.newStatus] || d.newStatus}`;
        } else if (d.previousPayment && d.newPayment) {
          detailStr = `Pembayaran: ${d.previousPayment} ➜ ${d.newPayment} ${d.method ? `(${d.method})` : ''}`;
        } else {
          detailStr = JSON.stringify(log.details);
        }
      } else {
        detailStr = String(log.details);
      }
    }

    const r = wsLogs.addRow([
      idx + 1,
      orderNumber,
      log.createdAt ? new Date(log.createdAt).toLocaleString('id-ID') : '-',
      log.action,
      detailStr,
      log.user?.name || 'Sistem',
      log.user?.role || 'SYSTEM',
    ]);

    r.height = 20;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).alignment = { horizontal: 'center' };
    r.getCell(4).alignment = { horizontal: 'center' };
    r.getCell(7).alignment = { horizontal: 'center' };

    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  autoFitColumns(wsLogs);

  // ==========================================
  // SHEET 5: LAPORAN PEMASUKAN
  // ==========================================
  const wsIncome = workbook.addWorksheet('Laporan Pemasukan', {
    views: [{ state: 'frozen', ySplit: 3, showGridLines: true }],
  });

  wsIncome.mergeCells('A1:H1');
  const incomeTitle = wsIncome.getCell('A1');
  incomeTitle.value = `LAPORAN DETAIL PEMASUKAN TOKO - ${storeName.toUpperCase()}`;
  incomeTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  incomeTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  incomeTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsIncome.getRow(1).height = 32;

  wsIncome.mergeCells('A2:H2');
  const incomeSub = wsIncome.getCell('A2');
  incomeSub.value = `Daftar transaksi cucian yang berstatus LUNAS (PAID)`;
  incomeSub.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  incomeSub.alignment = { vertical: 'middle', horizontal: 'center' };
  incomeSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsIncome.getRow(2).height = 20;

  const incomeHeaders = [
    'No',
    'No. Nota',
    'Tanggal Masuk',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Outlet',
    'Metode Bayar',
    'Jumlah Pemasukan (Rp)',
  ];
  const incomeHeaderRow = wsIncome.addRow(incomeHeaders);
  applyHeaderStyles(incomeHeaderRow, PRIMARY_COLOR);

  paidOrders.forEach((o, idx) => {
    const r = wsIncome.addRow([
      idx + 1,
      o.orderNumber,
      o.dateIn ? new Date(o.dateIn).toLocaleDateString('id-ID') : '-',
      o.customer?.name || '-',
      o.customer?.phone || '-',
      o.outlet?.name || 'Pusat',
      o.paymentMethod || 'CASH',
      Number(o.totalPrice || 0),
    ]);

    r.height = 20;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).alignment = { horizontal: 'center' };
    r.getCell(5).alignment = { horizontal: 'center' };
    r.getCell(7).alignment = { horizontal: 'center' };
    r.getCell(8).numFmt = '"Rp "#,##0';
    r.getCell(8).alignment = { horizontal: 'right' };

    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  // Total Row
  if (paidOrders.length > 0) {
    const totalRowIndex = paidOrders.length + 4;
    const incomeTotalRow = wsIncome.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      'TOTAL PEMASUKAN',
      { formula: `SUM(H4:H${totalRowIndex - 1})` },
    ]);
    incomeTotalRow.height = 24;
    incomeTotalRow.getCell(7).font = { bold: true, name: 'Segoe UI' };
    incomeTotalRow.getCell(8).font = { bold: true, color: { argb: 'FF059669' }, name: 'Segoe UI' };
    incomeTotalRow.getCell(8).numFmt = '"Rp "#,##0';
    incomeTotalRow.getCell(8).alignment = { horizontal: 'right' };
    incomeTotalRow.eachCell((c) => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    });
  }

  autoFitColumns(wsIncome);

  // ==========================================
  // SHEET 6: LAPORAN PENGELUARAN
  // ==========================================
  const wsExpense = workbook.addWorksheet('Laporan Pengeluaran', {
    views: [{ state: 'frozen', ySplit: 3, showGridLines: true }],
  });

  wsExpense.mergeCells('A1:E1');
  const expTitle = wsExpense.getCell('A1');
  expTitle.value = `LAPORAN DETAIL PENGELUARAN OPERASIONAL - ${storeName.toUpperCase()}`;
  expTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  expTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  expTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_COLOR } };
  wsExpense.getRow(1).height = 32;

  wsExpense.mergeCells('A2:E2');
  const expSub = wsExpense.getCell('A2');
  expSub.value = `Total ${expenses.length} pos pengeluaran tercatat`;
  expSub.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  expSub.alignment = { vertical: 'middle', horizontal: 'center' };
  expSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  wsExpense.getRow(2).height = 20;

  const expHeaders = [
    'No',
    'Tanggal',
    'Kategori Pengeluaran',
    'Keterangan / Deskripsi',
    'Jumlah Pengeluaran (Rp)',
  ];
  const expHeaderRow = wsExpense.addRow(expHeaders);
  applyHeaderStyles(expHeaderRow, PRIMARY_COLOR);

  expenses.forEach((e, idx) => {
    const r = wsExpense.addRow([
      idx + 1,
      e.date ? new Date(e.date).toLocaleDateString('id-ID') : '-',
      e.category,
      e.description || '-',
      Number(e.amount || 0),
    ]);

    r.height = 20;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(5).numFmt = '"Rp "#,##0';
    r.getCell(5).alignment = { horizontal: 'right' };

    if (idx % 2 === 1) {
      r.eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BG } };
      });
    }
  });

  // Total Row
  if (expenses.length > 0) {
    const totalRowIndex = expenses.length + 4;
    const expTotalRow = wsExpense.addRow([
      '',
      '',
      '',
      'TOTAL PENGELUARAN',
      { formula: `SUM(E4:E${totalRowIndex - 1})` },
    ]);
    expTotalRow.height = 24;
    expTotalRow.getCell(4).font = { bold: true, name: 'Segoe UI' };
    expTotalRow.getCell(5).font = { bold: true, color: { argb: 'FFE11D48' }, name: 'Segoe UI' };
    expTotalRow.getCell(5).numFmt = '"Rp "#,##0';
    expTotalRow.getCell(5).alignment = { horizontal: 'right' };
    expTotalRow.eachCell((c) => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    });
  }

  autoFitColumns(wsExpense);

  return workbook;
}
