// Uygunsuzluk Yönetimi sabit listeleri.
export interface DurumDef { id: string; label: string; color: string; }

export const UYGUNSUZLUK_DURUMLAR: DurumDef[] = [
  {
    "id": "acik",
    "label": "Açık",
    "color": "#EF4444"
  },
  {
    "id": "inceleniyor",
    "label": "İnceleniyor",
    "color": "#F59E0B"
  },
  {
    "id": "kapatildi",
    "label": "Kapatıldı",
    "color": "#10B981"
  }
];

export const UYGUNSUZLUK_ONCELIK: string[] = [
  "Düşük",
  "Orta",
  "Yüksek",
  "Kritik"
];

// Her form maddesi kendi grubu içindeki sırasına göre bir hata kodu alır
// (EEF-001 = Fabrika EE Kontrol 1. madde, EED = Depo EE Kontrol,
// ST = Sürüş Testi, FK = Final Kontrol).
export const FORM_KOD_PREFIX: Record<string, string> = {
  "ee-fabrika": "EEF",
  "ee": "EED",
  "suruş": "ST",
  "final": "FK",
};

export function itemHataKodu(tip: string, index: number): string | null {
  const prefix = FORM_KOD_PREFIX[tip];
  return prefix ? `${prefix}-${String(index + 1).padStart(3, "0")}` : null;
}
