export function parseDateInput(value: string): Date | null {
  const parts = value.split("-").map(Number);
  if (parts.length >= 3 && parts.every((part) => Number.isFinite(part))) {
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function getDaysUntil(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const target = parseDateInput(value);
  if (!target) {
    return null;
  }
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffMs = startTarget.getTime() - startToday.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
