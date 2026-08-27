// Her form maddesi kendi grubu içindeki sırasına göre bir hata kodu alır
// (EEF-001 = Fabrika EE Kontrol 1. madde, EED = Depo EE Kontrol, ST = Sürüş
// Testi, FK = Final Kontrol) — backend/src/constants/uygunsuzluk.ts ile
// birebir aynı mantık.
const FORM_KOD_PREFIX: Record<string, string> = {
  "ee-fabrika": "EEF",
  ee: "EED",
  "suruş": "ST",
  final: "FK",
};

export function itemHataKodu(tip: string, index: number): string | null {
  const prefix = FORM_KOD_PREFIX[tip];
  return prefix ? `${prefix}-${String(index + 1).padStart(3, "0")}` : null;
}
