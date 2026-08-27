import { api } from "./client";
import { KanbanStage, StageDef, FormSection, DurumDef } from "../types/constants";

export interface RemoteConstants {
  kanbanStages: KanbanStage[];
  fabrika1Stages: string[];
  depoStages: string[];
  fabrikaKontrolItems: StageDef[];
  depoKontrolItems: StageDef[];
  formTemplates: {
    eeKontrolItems: string[];
    eeKontrolSubeSections: FormSection[];
    finalKontrolSections: FormSection[];
    suruşTestSections: FormSection[];
  };
  uygunsuzlukDurumlar: DurumDef[];
  uygunsuzlukOncelik: string[];
}

export const constantsApi = {
  getAll: () => api.get<RemoteConstants>("/constants"),
};
