/** Bugünün tarihini YYYY-MM-DD biçiminde döndürür (input[type=date] ile uyumlu). */
export const todayStr = (): string => new Date().toISOString().slice(0, 10);

/** ISO tarih string'ini "25 Ağu 2026" biçiminde okunabilir hale getirir. */
export const fmtDate = (d?: string | null): string =>
  d ? new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : "";
