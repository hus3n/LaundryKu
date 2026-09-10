export function withTimeout<T>(promise: Promise<T>, ms: number, fallbackErrorMsg = 'Operation timed out'): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(fallbackErrorMsg));
    }, ms);
  });

  return Promise.race([
    promise,
    timeoutPromise,
  ]).finally(() => {
    clearTimeout(timeoutHandle);
  });
}
