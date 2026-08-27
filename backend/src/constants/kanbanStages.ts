// Görev kanban panosundaki 5 sabit aşama (Açık/Yeni, Devam Ediyor, ...).
export interface KanbanStage { id: string; label: string; color: string; }

export const KANBAN_STAGES: KanbanStage[] = [
  {
    "id": "acik",
    "label": "Açık / Yeni",
    "color": "#EF4444"
  },
  {
    "id": "devam",
    "label": "Devam Ediyor",
    "color": "#F59E0B"
  },
  {
    "id": "beklemede",
    "label": "Beklemede",
    "color": "#3B82F6"
  },
  {
    "id": "tamam",
    "label": "Tamamlandı",
    "color": "#10B981"
  },
  {
    "id": "iptal",
    "label": "İptal Edildi",
    "color": "#6B7280"
  }
];
