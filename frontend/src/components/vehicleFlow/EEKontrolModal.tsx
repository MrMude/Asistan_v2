import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { FormableVehicle, FormMadde, VehicleFormResult } from "../../types";

interface EEKontrolModalProps {
  vehicle: FormableVehicle;
  onClose: () => void;
  onSave: (data: VehicleFormResult) => void;
}

/** Depo — KY.FR-17 E/E Kontrol Formu Balçık (28 madde, düz liste). */
export function EEKontrolModal({ vehicle, onClose, onSave }: EEKontrolModalProps) {
  const { constants } = useAppData();
  const items = constants?.formTemplates.eeKontrolItems ?? [];
  const existing = vehicle.formVerisi?.eeKontrol;

  const [header, setHeader] = useState({
    kontrolEden: existing?.kontrolEden || "",
    tarih: existing?.tarih || todayStr(),
    urunTanimi: (existing?.urunTanimi as string) || "",
    uretilecekRenk: (existing?.uretilecekRenk as string) || "",
    uretimIsEmriNo: (existing?.uretimIsEmriNo as string) || "",
    vinNo: (existing?.vinNo as string) || vehicle.no,
    motorNo: (existing?.motorNo as string) || "",
  });
  const [maddeler, setMaddeler] = useState<FormMadde[]>(existing?.maddeler || items.map((item) => ({ item, sonuc: "", aciklama: "" })));

  const setSonuc = (idx: number, sonuc: FormMadde["sonuc"]) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, sonuc } : m)));
  const setAciklama = (idx: number, aciklama: string) => setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, aciklama } : m)));

  const nokSayisi = maddeler.filter((m) => m.sonuc === "NOK").length;
  const genelSonuc = maddeler.some((m) => m.sonuc === "") ? "Devam Ediyor" : nokSayisi > 0 ? "Kaldı" : "Geçti";

  const save = () => { onSave({ ...header, maddeler, nokSayisi, genelSonuc, doldu: true } as unknown as VehicleFormResult); onClose(); };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 640, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.formTitle}>E/E Kontrol Formu — Araç #{vehicle.no}</h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 14 }}>Form no: KY.FR-17 — E/E Kontrol Formu Balçık</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div><label style={styles.inputLabel}>Kontrol Eden</label><input style={styles.mainInput} value={header.kontrolEden} onChange={(e) => setHeader((h) => ({ ...h, kontrolEden: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Tarih</label><input type="date" style={styles.selectInput} value={header.tarih} onChange={(e) => setHeader((h) => ({ ...h, tarih: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Ürün Tanımlaması</label><input style={styles.mainInput} value={header.urunTanimi} onChange={(e) => setHeader((h) => ({ ...h, urunTanimi: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Üretilecek Renk</label><input style={styles.mainInput} value={header.uretilecekRenk} onChange={(e) => setHeader((h) => ({ ...h, uretilecekRenk: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Üretim İş Emri No</label><input style={styles.mainInput} value={header.uretimIsEmriNo} onChange={(e) => setHeader((h) => ({ ...h, uretimIsEmriNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>VIN No</label><input style={styles.mainInput} value={header.vinNo} onChange={(e) => setHeader((h) => ({ ...h, vinNo: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Motor Numarası</label><input style={styles.mainInput} value={header.motorNo} onChange={(e) => setHeader((h) => ({ ...h, motorNo: e.target.value }))} /></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {maddeler.map((m, idx) => (
            <div key={idx} style={{ background: "#0F172A", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, flex: 1 }}>{idx + 1}. {m.item}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "OK" ? styles.resultPillOk : {}) }} onClick={() => setSonuc(idx, "OK")}>OK</button>
                  <button type="button" style={{ ...styles.resultPill, ...(m.sonuc === "NOK" ? styles.resultPillNok : {}) }} onClick={() => setSonuc(idx, "NOK")}>NOK</button>
                </div>
              </div>
              {m.sonuc === "NOK" && (
                <input style={{ ...styles.mainInput, fontSize: 11, marginTop: 6 }} placeholder="Açıklama..." value={m.aciklama} onChange={(e) => setAciklama(idx, e.target.value)} />
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 12, background: "#0F172A", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>NOK: <b style={{ color: "#EF4444" }}>{nokSayisi}</b> / {maddeler.length}</span>
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
