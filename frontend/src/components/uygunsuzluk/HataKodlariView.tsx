import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { HataKodu } from "../../types";

interface HataKodlariViewProps {
  hataKodlari: HataKodu[];
  setHataKodlari: (v: HataKodu[] | ((p: HataKodu[]) => HataKodu[])) => void;
}

export function HataKodlariView({ hataKodlari, setHataKodlari }: HataKodlariViewProps) {
  const [kod, setKod] = useState("");
  const [aciklama, setAciklama] = useState("");

  const addKod = () => {
    if (!kod.trim() || !aciklama.trim()) return;
    if (hataKodlari.some((h) => h.kod.toLowerCase() === kod.trim().toLowerCase())) { window.alert("Bu kod zaten kayıtlı."); return; }
    setHataKodlari([...hataKodlari, { id: uid(), kod: kod.trim(), aciklama: aciklama.trim() }]);
    setKod("");
    setAciklama("");
  };
  const removeKod = (id: string) => { if (window.confirm("Bu hata kodunu silmek istediğinize emin misiniz?")) setHataKodlari(hataKodlari.filter((h) => h.id !== id)); };

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Hata Kodları</h1><p style={styles.viewSub}>Uygunsuzluk kayıtlarında seçilebilecek standart hata kodu kataloğu.</p></div>
      </div>
      <div style={styles.yearEndTableCard}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input style={{ ...styles.mainInput, maxWidth: 140 }} placeholder="Kod (örn: K-001)" value={kod} onChange={(e) => setKod(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKod()} />
          <input style={{ ...styles.mainInput, flex: 1, minWidth: 200 }} placeholder="Açıklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKod()} />
          <button style={styles.primaryActionBtn} onClick={addKod}><Plus size={14} /> Ekle</button>
        </div>
        {hataKodlari.length === 0 ? <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>Henüz hata kodu tanımlanmadı.</div> : (
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Kod</th><th style={styles.th}>Açıklama</th><th style={styles.th}></th></tr></thead>
            <tbody>
              {hataKodlari.map((h) => (
                <tr key={h.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontWeight: 700, color: "#F59E0B" }}>{h.kod}</td>
                  <td style={styles.td}>{h.aciklama}</td>
                  <td style={styles.td}><Trash2 size={13} color="#EF4444" style={{ cursor: "pointer" }} onClick={() => removeKod(h.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
