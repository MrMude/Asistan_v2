import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { FormableVehicle, FormMadde, VehicleFormResult } from "../../types";

interface FinalKontrolModalProps {
  vehicle: FormableVehicle;
  onClose: () => void;
  onSave: (data: VehicleFormResult) => void;
}

/** Depo — KY.FR-19 Final Kalite Kontrol Formu (9 bölüm, 56 madde). */
export function FinalKontrolModal({ vehicle, onClose, onSave }: FinalKontrolModalProps) {
  const { constants } = useAppData();
  const sections = constants?.formTemplates.finalKontrolSections ?? [];
  const existing = vehicle.formVerisi?.finalKontrol;

  const [header, setHeader] = useState({
    vinNo: (existing?.vinNo as string) || vehicle.no,
    aracModeli: (existing?.aracModeli as string) || "",
    kontrolTarihi: (existing?.kontrolTarihi as string) || todayStr(),
    motorNo: (existing?.motorNo as string) || "",
    siparisNo: (existing?.siparisNo as string) || "",
    kontrolLokasyonu: (existing?.kontrolLokasyonu as string) || "",
    musteri: (existing?.musteri as string) || "",
    renkKodu: (existing?.renkKodu as string) || "",
    vardiya: (existing?.vardiya as string) || "",
    uretimIsEmriNo: (existing?.uretimIsEmriNo as string) || "",
    aracSeriNo: (existing?.aracSeriNo as string) || "",
    kontrolEden: existing?.kontrolEden || "",
  });
  const flatItems = sections.flatMap((s) => s.items.map((item) => ({ section: s.title, item })));
  const [maddeler, setMaddeler] = useState<FormMadde[]>(existing?.maddeler || flatItems.map((x) => ({ ...x, sonuc: "", aciklama: "" })));
  const [duzeltmeYapildi, setDuzeltmeYapildi] = useState((existing?.duzeltmeYapildi as boolean) || false);
  const [finalOnayImza, setFinalOnayImza] = useState((existing?.finalOnayImza as string) || "");

  const setSonuc = (idx: number, sonuc: FormMadde["sonuc"]) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, sonuc } : m)));
  const setAciklama = (idx: number, aciklama: string) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, aciklama } : m)));

  const nokSayisi = maddeler.filter((m) => m.sonuc === "NOK").length;
  const genelSonuc = maddeler.some((m) => m.sonuc === "") ? "Devam Ediyor" : nokSayisi > 0 ? "Kaldı" : "Geçti";

  const save = () => { onSave({ ...header, maddeler, nokSayisi, genelSonuc, duzeltmeYapildi, finalOnayImza, doldu: true } as unknown as VehicleFormResult); onClose(); };

  let runningIdx = -1;

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 700, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.formTitle}>Final Kalite Kontrol Formu — Araç #{vehicle.no}</h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 14 }}>Form no: KY.FR-19</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          <div><label style={styles.inputLabel}>VIN No</label><input style={styles.mainInput} value={header.vinNo} onChange={(e) => setHeader((h) => ({ ...h, vinNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Araç Modeli</label><input style={styles.mainInput} value={header.aracModeli} onChange={(e) => setHeader((h) => ({ ...h, aracModeli: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Kontrol Tarihi</label><input type="date" style={styles.selectInput} value={header.kontrolTarihi} onChange={(e) => setHeader((h) => ({ ...h, kontrolTarihi: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Motor No</label><input style={styles.mainInput} value={header.motorNo} onChange={(e) => setHeader((h) => ({ ...h, motorNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Sipariş No</label><input style={styles.mainInput} value={header.siparisNo} onChange={(e) => setHeader((h) => ({ ...h, siparisNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Kontrol Lokasyonu</label><input style={styles.mainInput} value={header.kontrolLokasyonu} onChange={(e) => setHeader((h) => ({ ...h, kontrolLokasyonu: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Müşteri</label><input style={styles.mainInput} value={header.musteri} onChange={(e) => setHeader((h) => ({ ...h, musteri: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Renk Kodu</label><input style={styles.mainInput} value={header.renkKodu} onChange={(e) => setHeader((h) => ({ ...h, renkKodu: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Vardiya</label><input style={styles.mainInput} value={header.vardiya} onChange={(e) => setHeader((h) => ({ ...h, vardiya: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Üretim İş Emri No</label><input style={styles.mainInput} value={header.uretimIsEmriNo} onChange={(e) => setHeader((h) => ({ ...h, uretimIsEmriNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Araç Seri No</label><input style={styles.mainInput} value={header.aracSeriNo} onChange={(e) => setHeader((h) => ({ ...h, aracSeriNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Kontrol Eden (QA)</label><input style={styles.mainInput} value={header.kontrolEden} onChange={(e) => setHeader((h) => ({ ...h, kontrolEden: e.target.value }))} /></div>
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
                      <div style={{ display: "flex", gap: 4 }}>
                        <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "OK" ? styles.resultPillOk : {}) }} onClick={() => setSonuc(idx, "OK")}>OK</button>
                        <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "NOK" ? styles.resultPillNok : {}) }} onClick={() => setSonuc(idx, "NOK")}>NOK</button>
                        <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "NA" ? styles.resultPillNa : {}) }} onClick={() => setSonuc(idx, "NA")}>N/A</button>
                      </div>
                    </div>
                    {m.sonuc === "NOK" && (
                      <input style={{ ...styles.mainInput, fontSize: 11, marginTop: 6 }} placeholder="Kusur / kusur yeri / aksiyon açıklaması..." value={m.aciklama} onChange={(e) => setAciklama(idx, e.target.value)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, padding: 12, background: "#0F172A", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12 }}>NOK: <b style={{ color: "#EF4444" }}>{nokSayisi}</b> / {maddeler.length}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: genelSonuc === "Geçti" ? "#10B981" : genelSonuc === "Kaldı" ? "#EF4444" : "#F59E0B" }}>{genelSonuc}</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={duzeltmeYapildi} onChange={(e) => setDuzeltmeYapildi(e.target.checked)} /> Düzeltme İşlemi Yapıldı mı?
          </label>
          <label style={styles.inputLabel}>Final Onay - Sevke Uygundur (İmza)</label>
          <input style={styles.mainInput} value={finalOnayImza} onChange={(e) => setFinalOnayImza(e.target.value)} placeholder="Ad Soyad" />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
          <button style={styles.primaryActionBtn} onClick={save}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}
