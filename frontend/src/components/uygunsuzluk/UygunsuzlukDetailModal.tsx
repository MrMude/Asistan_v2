import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { fmtDate } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { Uygunsuzluk, HataKodu, UygunsuzlukDurum } from "../../types";

interface UygunsuzlukDetailModalProps {
  record: Uygunsuzluk;
  hataKodlari: HataKodu[];
  onClose: () => void;
  onUpdate: (patch: Partial<Uygunsuzluk>) => void;
  onDelete: () => void;
  onMove: (durum: UygunsuzlukDurum) => void;
}

export function UygunsuzlukDetailModal({ record, hataKodlari, onClose, onUpdate, onDelete, onMove }: UygunsuzlukDetailModalProps) {
  const { constants } = useAppData();
  const durumlar = constants?.uygunsuzlukDurumlar ?? [];
  const [aksiyon, setAksiyon] = useState(record.aksiyon || "");
  const [hataKodu, setHataKodu] = useState(record.hataKodu || "");
  const stage = durumlar.find((s) => s.id === record.durum);
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.drawerContainer}>
        <div style={styles.drawerHeader}>
          <span style={{ fontSize: 11, fontWeight: 800, color: stage?.color }}>{stage?.label}</span>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={styles.drawerBody}>
          {record.gorsel && <img src={record.gorsel} alt="Uygunsuzluk görseli" style={{ maxWidth: "100%", maxHeight: 260, borderRadius: 8, border: "1px solid #334155" }} />}
          <div style={{ fontSize: 14, fontWeight: 700 }}>{record.aciklama}</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#94A3B8" }}>
            <span>📅 {fmtDate(record.tarih)} {record.saat}</span>
            <span>📍 {record.yer || "—"}</span>
            {record.aracVin && <span>🚗 VIN: {record.aracVin}</span>}
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>Tespit Eden: <b style={{ color: "#F8FAFC" }}>{record.tespitEden}</b> · Öncelik: <b style={{ color: "#F8FAFC" }}>{record.oncelik}</b></div>

          {hataKodlari && hataKodlari.length > 0 && (
            <div>
              <label style={styles.inputLabel}>Hata Kodu</label>
              <select style={styles.selectInput} value={hataKodu} onChange={(e) => { setHataKodu(e.target.value); onUpdate({ hataKodu: e.target.value }); }}>
                <option value="">— Seçilmedi —</option>
                {hataKodlari.map((h) => <option key={h.id} value={h.kod}>{h.kod} — {h.aciklama}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={styles.inputLabel}>Aksiyon / Düzeltme</label>
            <input style={styles.mainInput} value={aksiyon} onChange={(e) => setAksiyon(e.target.value)} onBlur={() => onUpdate({ aksiyon })} placeholder="Yapılan/planlanan düzeltme..." />
          </div>

          {record.durum === "kapatildi" && (
            <div style={{ fontSize: 11, color: "#10B981" }}>✓ {record.kapatan} tarafından {fmtDate(record.kapanmaTarihi)} tarihinde kapatıldı.</div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {durumlar.filter((s) => s.id !== record.durum).map((s) => (
              <button key={s.id} style={{ ...styles.periodBtn, borderColor: s.color, color: s.color }} onClick={() => onMove(s.id as UygunsuzlukDurum)}>{s.label}'a Taşı</button>
            ))}
          </div>
        </div>
        <div style={styles.drawerFooter}><button style={styles.deleteDangerBtn} onClick={onDelete}>Sil</button><button style={styles.primaryActionBtn} onClick={onClose}>Kapat</button></div>
      </div>
    </div>
  );
}
