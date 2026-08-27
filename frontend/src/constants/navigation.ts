import { AppModule } from "../types";

// ---------------------------------------------------------------------------
// Bu dosya, uygulamanın SOL MENÜ / İZİN yapısını tanımlar. Form maddeleri
// veya iş verisi DEĞİLDİR (onlar backend'den /api/constants ile gelir) —
// bunlar saf frontend navigasyon/yetkilendirme kavramlarıdır, bu yüzden
// bilinçli olarak burada, kod içinde sabit tutulur.
// ---------------------------------------------------------------------------

export const TOPLANTI_MODULE_IDS = ["asakai", "iyilestirme", "kalite_kontrol", "tedarik_kalite"];

export interface SectionDef {
  id: string;
  label: string;
}

export const GENEL_SEKMELER: SectionDef[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "todo", label: "To-Do List" },
  { id: "raporlar", label: "Araç Kontrol Takibi" },
  { id: "grafik_yonetimi", label: "Grafik Yönetimi" },
  { id: "fabrika_kontrol_akis", label: "Fabrika Kontrol" },
  { id: "depo_kontrol_akis", label: "Depo Kontrol" },
];

export const UYGUNSUZLUK_YONETIMI_ITEMS: SectionDef[] = [
  { id: "uygunsuzluk_liste", label: "Uygunsuzluk Listesi" },
  { id: "uygunsuzluk_hata_kodlari", label: "Hata Kodları" },
  { id: "uygunsuzluk_istatistik", label: "Uygunsuzlukların İstatistiği" },
];

export function getAllSectionIds(modules: AppModule[]): string[] {
  return [
    ...GENEL_SEKMELER.map((s) => s.id),
    ...modules.map((m) => m.id),
    ...UYGUNSUZLUK_YONETIMI_ITEMS.map((i) => i.id),
  ];
}

export interface PermissionGroup {
  title: string;
  items: SectionDef[];
}

export function buildPermissionGroups(modules: AppModule[]): PermissionGroup[] {
  return [
    { title: "Genel", items: GENEL_SEKMELER },
    { title: "Modüller", items: modules.filter((m) => !TOPLANTI_MODULE_IDS.includes(m.id)) },
    { title: "Toplantı Yönetimi", items: modules.filter((m) => TOPLANTI_MODULE_IDS.includes(m.id)) },
    { title: "Uygunsuzluk Yönetimi", items: UYGUNSUZLUK_YONETIMI_ITEMS },
  ];
}
