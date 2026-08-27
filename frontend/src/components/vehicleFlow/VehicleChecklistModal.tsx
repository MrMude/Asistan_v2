import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { FormSection } from "../../types/constants";
import { FormMadde, FormableVehicle, VehicleFormResult } from "../../types";

export interface HeaderFieldDef {
  key: string;
  label: string;
  type?: "text" | "date" | "time";
  default?: string;
}

interface VehicleChecklistModalProps {
  vehicle: FormableVehicle;
  title: string;
  formNo: string;
  sections: FormSection[];
  headerFields: HeaderFieldDef[];
  existing?: VehicleFormResult;
  onClose: () => void;
  onSave: (data: VehicleFormResult) => void;
}

/**
 * Bölümlere ayrılmış, Uygun/Uygun Değil değerlendirmeli genel amaçlı form
 * modalı — Fabrika 1 EE Kontrol (KY.FR-18) ve Sürüş Testi (KY.FR-13) için
 * kullanılır. Depo'nun EE/Final formları (farklı başlık alanları, OK/NOK
 * terminolojisi) EEKontrolModal/FinalKontrolModal'da ayrı tutulur.
 */
export function VehicleChecklistModal({ vehicle, title, formNo, sections, headerFields, existing, onClose, onSave }: VehicleChecklistModalProps) {
  const flatItems = sections.flatMap((s) => s.items.map((item) => ({ section: s.title, item })));
  const [header, setHeader] = useState<Record<string, string>>(() => {
    const h: Record<string, string> = {};
    headerFields.forEach((f) => {
      const existingVal = existing?.[f.key] as string | undefined;
      h[f.key] = existingVal || (f.key === "vinNo" ? vehicle.no : f.default || "");
    });
    return h;
  });
  const [maddeler, setMaddeler] = useState<FormMadde[]>(existing?.maddeler || flatItems.map((x) => ({ ...x, sonuc: "", aciklama: "" })));

  const setSonuc = (idx: number, sonuc: FormMadde["sonuc"]) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, sonuc } : m)));
  const setAciklama = (idx: number, aciklama: string) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, aciklama } : m)));

  const nokSayisi = maddeler.filter((m) => m.sonuc === "Uygun Değil").length;
  const genelSonuc = maddeler.some((m) => m.sonuc === "") ? "Devam Ediyor" : nokSayisi > 0 ? "Kaldı" : "Geçti";

  const save = () => { onSave({ ...header, maddeler, nokSayisi, genelSonuc, doldu: true } as unknown as VehicleFormResult); onClose(); };

  let runningIdx = -1;

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 680, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.formTitle}>{title} — Araç #{vehicle.no}</h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 14 }}>Form no: {formNo}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {headerFields.map((f) => (
            <div key={f.key}>
              <label style={styles.inputLabel}>{f.label}</label>
              <input type={f.type || "text"} style={f.type === "date" || f.type === "time" ? styles.selectInput : styles.mainInput} value={header[f.key]} onChange={(e) => setHeader((h) => ({ ...h, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>

        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", marginBottom: 6 }}>▶ {section.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {section.items.map((itemText) => {
                runningIdx++;
                const idx = runningIdx;
                const m = maddeler[idx];
                return (
                  <div key={idx} style={{ background: "#0F172A", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, flex: 1 }}>{itemText}</span>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "Uygun" ? styles.resultPillOk : {}) }} onClick={() => setSonuc(idx, "Uygun")}>Uygun</button>
                        <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "Uygun Değil" ? styles.resultPillNok : {}) }} onClick={() => setSonuc(idx, "Uygun Değil")}>Uygun Değil</button>
                      </div>
                    </div>
                    {m.sonuc === "Uygun Değil" && (
                      <input style={{ ...styles.mainInput, fontSize: 11, marginTop: 6 }} placeholder="Neden? Açıklama yazın..." value={m.aciklama} onChange={(e) => setAciklama(idx, e.target.value)} autoFocus />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, padding: 12, background: "#0F172A", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>Uygun Değil: <b style={{ color: "#EF4444" }}>{nokSayisi}</b> / {maddeler.length}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: genelSonuc === "Geçti" ? "#10B981" : genelSonuc === "Kaldı" ? "#EF4444" : "#F59E0B" }}>{genelSonuc}</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
          <button style={styles.primaryActionBtn} onClick={save}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}
