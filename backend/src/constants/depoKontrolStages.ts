// Depo Kontrol — Depo Araç Akışı'nın 4 istasyonu (sıralı).
import type { StageDef } from './fabrikaKontrolStages';

export const DEPO_KONTROL_ITEMS: StageDef[] = [
  {
    "id": "dk-suruş",
    "label": "Sürüş Testi"
  },
  {
    "id": "dk-sizdirmazlik",
    "label": "Sızdırmazlık Testi"
  },
  {
    "id": "dk-ee",
    "label": "EE Kontrol"
  },
  {
    "id": "dk-final",
    "label": "Final Kontrol"
  }
];
