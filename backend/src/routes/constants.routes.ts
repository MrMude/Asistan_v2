import { Router, Request, Response } from "express";
import { KANBAN_STAGES } from "../constants/kanbanStages";
import { FABRIKA1_STAGES, DEPO_STAGES } from "../constants/vehicleFlowStages";
import { FABRIKA_KONTROL_ITEMS } from "../constants/fabrikaKontrolStages";
import { DEPO_KONTROL_ITEMS } from "../constants/depoKontrolStages";
import { EE_KONTROL_ITEMS, EE_KONTROL_SUBE_SECTIONS, FINAL_KONTROL_SECTIONS, SURUS_TEST_SECTIONS } from "../constants/formTemplates";
import { UYGUNSUZLUK_DURUMLAR, UYGUNSUZLUK_ONCELIK } from "../constants/uygunsuzluk";

const router = Router();

// Bunlar kullanıcı tarafından CRUD ile değiştirilmeyen, uygulamanın iş
// kurallarına gömülü sabit referans verileridir (form maddeleri, aşama
// tanımları). Frontend uygulama açılışında tek seferde çeker.
router.get("/", (_req: Request, res: Response) => {
  res.json({
    kanbanStages: KANBAN_STAGES,
    fabrika1Stages: FABRIKA1_STAGES,
    depoStages: DEPO_STAGES,
    fabrikaKontrolItems: FABRIKA_KONTROL_ITEMS,
    depoKontrolItems: DEPO_KONTROL_ITEMS,
    formTemplates: {
      eeKontrolItems: EE_KONTROL_ITEMS,
      eeKontrolSubeSections: EE_KONTROL_SUBE_SECTIONS,
      finalKontrolSections: FINAL_KONTROL_SECTIONS,
      suruşTestSections: SURUS_TEST_SECTIONS,
    },
    uygunsuzlukDurumlar: UYGUNSUZLUK_DURUMLAR,
    uygunsuzlukOncelik: UYGUNSUZLUK_ONCELIK,
  });
});

export default router;
