import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";

interface NoteQuickModalProps {
  vehicleNo?: string;
  onClose: () => void;
  onSave: (text: string) => void;
}

/** Fabrika/Depo Araç Akışı kartlarında kullanılan basit "not/sorun ekle" penceresi. */
export function NoteQuickModal({ vehicleNo, onClose, onSave }: NoteQuickModalProps) {
  const [text, setText] = useState("");
  const save = () => { if (text.trim()) onSave(text.trim()); };
  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 420 }}>
        <div style={styles.drawerHeader}><h2 style={styles.formTitle}>Not / Sorun Ekle — Araç #{vehicleNo}</h2><button style={styles.closeBtn} onClick={onClose}><X size={18} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          <input style={styles.mainInput} placeholder="Akışı aksatan sorunu yazın..." value={text} onChange={(e) => setText(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && save()} />
          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
            <button style={styles.primaryActionBtn} onClick={save}>Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}
