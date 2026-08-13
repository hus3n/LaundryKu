import puppeteer from 'puppeteer';

export interface NotaData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentLabel: string;
  items: Array<{
    packageName: string;
    categoryName: string;
    quantity: string;
    unit: string;
    price: string;
    subtotal: string;
  }>;
  totalPrice: string;
  notes?: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

export async function generateNotaImage(data: NotaData): Promise<Buffer> {
  const statusColors: Record<string, string> = {
    RECEIVED: '#f59e0b',
    IN_PROGRESS: '#3b82f6',
    DONE: '#10b981',
    PICKED_UP: '#6b7280',
  };
  const statusColor = statusColors[data.status] || '#6b7280';

  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;border-bottom:1px solid #f1f5f9;">
        ${item.packageName} <span style="color:#64748b;">(${item.categoryName})</span>
      </td>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;text-align:center;border-bottom:1px solid #f1f5f9;">
        ${item.quantity} ${item.unit}
      </td>
      <td style="padding:6px 8px;font-size:11px;color:#1e293b;text-align:right;border-bottom:1px solid #f1f5f9;">
        ${item.price}
      </td>
      <td style="padding:6px 8px;font-size:11px;font-weight:600;color:#0f172a;text-align:right;border-bottom:1px solid #f1f5f9;">
        ${item.subtotal}
      </td>
    </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; background:#fff; width:400px; }
    .nota { background:#fff; width:400px; border-radius:12px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1e3a5f,#0f2d52); padding:20px; text-align:center; color:white; }
    .store-name { font-size:18px; font-weight:700; }
    .store-info { font-size:10px; color:#94a3b8; margin-top:4px; }
    .nota-title { background:#f8fafc; border-bottom:2px solid #e2e8f0; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; }
    .nota-number { font-size:14px; font-weight:700; color:#0f172a; }
    .status-badge { font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; color:white; background:${statusColor}; }
    .info-grid { padding:14px 20px; display:grid; grid-template-columns:1fr 1fr; gap:10px; background:#f8fafc; }
    .info-item label { font-size:9px; color:#94a3b8; text-transform:uppercase; display:block; }
    .info-item span { font-size:12px; font-weight:600; color:#1e293b; display:block; margin-top:2px; }
    .items-section { padding:14px 20px; }
    .items-title { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:8px; }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#f1f5f9; }
    thead th { padding:6px 8px; font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase; }
    thead th:not(:first-child) { text-align:right; }
    thead th:nth-child(2) { text-align:center; }
    .total-row { background:#0f2d52; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; }
    .total-label { color:#94a3b8; font-size:12px; font-weight:600; }
    .total-amount { color:#fff; font-size:18px; font-weight:800; }
    .payment-row { padding:10px 20px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; }
    .payment-label { font-size:10px; color:#64748b; }
    .payment-paid { font-size:12px; font-weight:700; color:#10b981; }
    .payment-unpaid { font-size:12px; font-weight:700; color:#ef4444; }
    .notes-row { padding:8px 20px; background:#fffbeb; border-top:1px solid #fde68a; font-size:10px; color:#92400e; }
    .footer { padding:12px 20px; text-align:center; font-size:10px; color:#94a3b8; background:#f8fafc; border-top:1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="nota">
    <div class="header">
      <div class="store-name">${data.storeName}</div>
      <div class="store-info">${data.storeAddress}</div>
      <div class="store-info">${data.storePhone}</div>
    </div>
    <div class="nota-title">
      <span class="nota-number">📄 #${data.orderNumber}</span>
      <span class="status-badge">${data.statusLabel}</span>
    </div>
    <div class="info-grid">
      <div class="info-item"><label>Pelanggan</label><span>${data.customerName}</span></div>
      <div class="info-item"><label>No. HP</label><span>${data.customerPhone}</span></div>
      <div class="info-item"><label>Tanggal Masuk</label><span>${data.dateIn}</span></div>
      <div class="info-item"><label>Est. Selesai</label><span>${data.estimatedDone}</span></div>
    </div>
    <div class="items-section">
      <div class="items-title">Rincian Cucian</div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Item</th>
            <th>Qty</th>
            <th style="text-align:right;">Harga</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>
    <div class="total-row">
      <span class="total-label">TOTAL TAGIHAN</span>
      <span class="total-amount">${data.totalPrice}</span>
    </div>
    <div class="payment-row">
      <span class="payment-label">Status Pembayaran:</span>
      <span class="${data.paymentStatus === 'PAID' ? 'payment-paid' : 'payment-unpaid'}">${data.paymentLabel}</span>
    </div>
    ${data.notes ? `<div class="notes-row">📝 Catatan: ${data.notes}</div>` : ''}
    <div class="footer">Terima kasih telah mempercayakan cucian Anda kepada kami! 🙏</div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.setViewport({ width: 400, height: 800, deviceScaleFactor: 2 });
    const element = await page.$('.nota');
    if (!element) throw new Error('Nota element not found');
    const imageBuffer = await element.screenshot({ type: 'png' });
    return Buffer.from(imageBuffer);
  } finally {
    await browser.close();
  }
}
