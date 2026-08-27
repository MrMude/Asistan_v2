import React, { useState } from "react";
import { styles } from "../../styles/theme";
import { todayStr } from "../../utils/date";
import { User } from "../../types";

export interface NewReportInput {
  baslik: string;
  tarih: string;
  hazirlayan: string;
  bolum: string;
}

interface NewReportModalProps {
  currentUser: Pick<User, "name">;
  onClose: () => void;
  onCreate: (input: NewReportInput) => void;
}

export function NewReportModal({ currentUser, onClose, onCreate }: NewReportModalProps) {
  const [baslik, setBaslik] = useState("Gün Sonu Kalite Kontrol ve Araç Durum Raporu");
  const [tarih, setTarih] = useState(todayStr());
  const [hazirlayan, setHazirlayan] = useState(currentUser.name);
  const [bolum, setBolum] = useState("Fabrika 1 & Depo Takip");
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <h2 style={styles.formTitle}>Yeni Rapor</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          <div><label style={styles.inputLabel}>Rapor Adı</label><input style={styles.mainInput} value={baslik} onChange={(e) => setBaslik(e.target.value)} /></div>
          <div><label style={styles.inputLabel}>Tarih</label><input type="date" style={styles.selectInput} value={tarih} onChange={(e) => setTarih(e.target.value)} /></div>
          <div><label style={styles.inputLabel}>Hazırlayan</label><input style={styles.mainInput} value={hazirlayan} onChange={(e) => setHazirlayan(e.target.value)} /></div>
          <div><label style={styles.inputLabel}>Bölüm</label><input style={styles.mainInput} value={bolum} onChange={(e) => setBolum(e.target.value)} /></div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
            <button style={styles.primaryActionBtn} onClick={() => onCreate({ baslik, tarih, hazirlayan, bolum })}>Oluştur</button>
          </div>
        </div>
      </div>
    </div>
  );
}
