// Backend'in /api/constants uç noktasından döndürdüğü statik referans
// verilerin (form maddeleri, aşama tanımları) tipleri.

export interface KanbanStage {
  id: string;
  label: string;
  color: string;
}

export interface StageDef {
  id: string;
  label: string;
}

export interface FormSection {
  title: string;
  items: string[];
}

export interface DurumDef {
  id: string;
  label: string;
  color: string;
}
