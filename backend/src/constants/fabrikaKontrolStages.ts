// Fabrika Kontrol — Fabrika Araç Akışı'nın 8 istasyonu (sıralı).
export interface StageDef { id: string; label: string; }

export const FABRIKA_KONTROL_ITEMS: StageDef[] = [
  {
    "id": "fk-istasyon-1",
    "label": "İstasyon 1 — Şasi ve Komponent İzlenebilirliği"
  },
  {
    "id": "fk-istasyon-2",
    "label": "İstasyon 2 — İç Trim ve Yönlendirme"
  },
  {
    "id": "fk-istasyon-3",
    "label": "İstasyon 3 — Gövde İzolasyon ve Kilit"
  },
  {
    "id": "fk-istasyon-4",
    "label": "İstasyon 4 — Cam Montajı ve Sızdırmazlık"
  },
  {
    "id": "fk-ee",
    "label": "İstasyon 5 — EE Kontrolleri"
  },
  {
    "id": "fk-istasyon-5",
    "label": "İstasyon 6 — Görsel Kalite (Gap & Flush)"
  },
  {
    "id": "fk-istasyon-6",
    "label": "İstasyon 7 — Ön Montaj ve Hazırlık"
  },
  {
    "id": "fk-suruş",
    "label": "İstasyon 8 — EOL (Hat Sonu) ve Dinamik Testler"
  }
];
