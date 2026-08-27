export interface AdvanceInfo {
  label: string;
  next: { konum: "fabrika1" | "depo"; asama: string };
}

/**
 * Bir aracın Araç Kontrol Takibi akışında bir SONRAKİ aşamasını hesaplar.
 * Fabrika 1'in son aşamasından sonra Depo'nun ilk aşamasına, Depo'nun
 * sondan bir önceki aşamasından "Serbestliğe Sevk Et" gösterir.
 */
export function getAdvanceInfo(
  v: { konum: "fabrika1" | "depo"; asama: string },
  fabrika1Stages: string[],
  depoStages: string[]
): AdvanceInfo | null {
  if (v.konum === "fabrika1") {
    const idx = fabrika1Stages.indexOf(v.asama);
    if (idx === -1) return null;
    if (idx < fabrika1Stages.length - 1) return { label: "Sonraki Aşama", next: { konum: "fabrika1", asama: fabrika1Stages[idx + 1] } };
    return { label: "Depoya Sevk Et", next: { konum: "depo", asama: depoStages[0] } };
  }
  const idx = depoStages.indexOf(v.asama);
  if (idx === -1 || idx >= depoStages.length - 1) return null;
  const nextStage = depoStages[idx + 1];
  return { label: nextStage === "Serbestlik" ? "Serbestliğe Sevk Et" : "Sonraki Aşama", next: { konum: "depo", asama: nextStage } };
}
