export async function downloadAllDataExcel(): Promise<void> {
  const token = localStorage.getItem('laundryku_token') || localStorage.getItem('token');
  const apiUrl = typeof window !== 'undefined' ? '/api' : (process.env.INTERNAL_BACKEND_URL ? `${process.env.INTERNAL_BACKEND_URL}/api` : 'http://backend:4001/api');
  
  const response = await fetch(`${apiUrl}/analytics/export-excel`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Gagal mengunduh file Excel.' }));
    throw new Error(errData.error || 'Gagal mengunduh file Excel.');
  }

  const blob = await response.blob();
  const todayStr = new Date().toISOString().slice(0, 10);
  const filename = `LaundryKu-Semua-Data-${todayStr}.xlsx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
            // Format to string, replace quotes
            cell = cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');
            // Quote the cell if it contains separator, quotes, or newlines
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
