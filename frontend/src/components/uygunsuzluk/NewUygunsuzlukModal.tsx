import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { User, HataKodu } from "../../types";

export interface NewUygunsuzlukInput {
  tarih: string;
  saat: string;
  yer: string;
  aracVin: string;
  aciklama: string;
  tespitEden: string;
  oncelik: string;
  hataKodu: string;
}

interface NewUygunsuzlukModalProps {
  currentUser: Pick<User, "name">;
  hataKodlari: HataKodu[];
  onClose: () => void;
  onCreate: (form: NewUygunsuzlukInput) => void;
}

export function NewUygunsuzlukModal({ currentUser, hataKodlari, onClose, onCreate }: NewUygunsuzlukModalProps) {
  const { constants } = useAppData();
  const oncelikList = constants?.uygunsuzlukOncelik ?? [];
  const now = new Date();
  const [form, setForm] = useState<NewUygunsuzlukInput>({
    tarih: todayStr(),
    saat: now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    yer: "",
    aracVin: "",
    aciklama: "",
    tespitEden: currentUser?.name || "",
    oncelik: "Orta",
    hataKodu: "",
  });
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <div style={styles.drawerHeader}><h2 style={styles.formTitle}>Yeni Uygunsuzluk Bildir</h2><button style={styles.closeBtn} onClick={onClose}><X size={18} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={styles.inputLabel}>Tarih</label><input type="date" style={styles.selectInput} value={form.tarih} onChange={(e) => setForm((f) => ({ ...f, tarih: e.target.value }))} /></div>
            <div style={{ flex: 1 }}><label style={styles.inputLabel}>Saat</label><input type="time" style={styles.selectInput} value={form.saat} onChange={(e) => setForm((f) => ({ ...f, saat: e.target.value }))} /></div>
          </div>
          <div><label style={styles.inputLabel}>Tespit Edilen Yer</label><input style={styles.mainInput} placeholder="Örn: EE Kontrol istasyonu, Depo..." value={form.yer} onChange={(e) => setForm((f) => ({ ...f, yer: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Araç VIN No (varsa)</label><input style={styles.mainInput} value={form.aracVin} onChange={(e) => setForm((f) => ({ ...f, aracVin: e.target.value }))} /></div>
          <div><label style={styles.inputLabel}>Açıklama</label><input style={styles.mainInput} placeholder="Uygunsuzluğu açıklayın..." value={form.aciklama} onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))} /></div>
          {hataKodlari && hataKodlari.length > 0 && (
            <div>
              <label style={styles.inputLabel}>Hata Kodu (opsiyonel)</label>
              <select style={styles.selectInput} value={form.hataKodu} onChange={(e) => setForm((f) => ({ ...f, hataKodu: e.target.value }))}>
                <option value="">— Seçilmedi —</option>
                {hataKodlari.map((h) => <option key={h.id} value={h.kod}>{h.kod} — {h.aciklama}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={styles.inputLabel}>Tespit Eden</label><input style={styles.mainInput} value={form.tespitEden} onChange={(e) => setForm((f) => ({ ...f, tespitEden: e.target.value }))} /></div>
            <div style={{ flex: 1 }}>
              <label style={styles.inputLabel}>Öncelik</label>
              <select style={styles.selectInput} value={form.oncelik} onChange={(e) => setForm((f) => ({ ...f, oncelik: e.target.value }))}>
                {oncelikList.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
            <button style={styles.primaryActionBtn} onClick={() => { if (!form.aciklama.trim()) return; onCreate(form); }}>Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}
