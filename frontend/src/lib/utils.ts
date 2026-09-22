export function formatDuration(hours: number): string {
  if (hours >= 24 && hours % 24 === 0) {
    return `${hours / 24} hari`;
  }
  return `${hours} jam`;
}

export function getApiErrorMessage(err: unknown, defaultMessage: string = 'Terjadi kesalahan'): string {
  if (typeof err === 'object' && err !== null) {
    const apiError = err as any;
    if (apiError.response && apiError.response.data && apiError.response.data.error) {
      return apiError.response.data.error;
    }
    if (apiError.message) {
      return apiError.message;
    }
  }
  return defaultMessage;
}

/**
 * Sensor sebagian huruf agar terlihat asli dan natural (seperti e-commerce/Google reviews)
 * Contoh:
 * "Budi Santoso" -> "B**i Sa***so"
 * "Kinclong Laundry Express" -> "Ki****ng La***ry Ex***ss"
 */
export function maskText(str?: string | null): string {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => {
      const clean = word.trim();
      const len = clean.length;
      if (len <= 0) return '';
      if (len <= 2) {
        return clean[0] + (len > 1 ? '*' : '');
      }
      if (len <= 4) {
        return clean[0] + '*'.repeat(len - 2) + clean[len - 1];
      }
      const prefix = clean.slice(0, 2);
      const suffix = clean.slice(-2);
      const stars = '*'.repeat(Math.max(2, len - 4));
      return prefix + stars + suffix;
    })
    .join(' ');
}

