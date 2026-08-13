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
