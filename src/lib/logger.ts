export function logInfo(message: string, meta?: Record<string, unknown>) {
  if (meta) {
    console.info(`[romantic] ${message}`, meta);
    return;
  }
  console.info(`[romantic] ${message}`);
}

export function logError(message: string, error?: unknown) {
  if (error) {
    console.error(`[romantic] ${message}`, error);
    return;
  }
  console.error(`[romantic] ${message}`);
}
