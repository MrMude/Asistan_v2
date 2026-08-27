import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { getAllSectionIds, buildPermissionGroups } from "../../constants/navigation";
import { User, AppModule } from "../../types";

interface PermissionsModalProps {
  user: User;
  modules: AppModule[];
  onClose: () => void;
  onSave: (izinliSekmeler: string[]) => void;
}

export function PermissionsModal({ user, modules, onClose, onSave }: PermissionsModalProps) {
  const groups = buildPermissionGroups(modules);
  const allIds = getAllSectionIds(modules);
  const [selected, setSelected] = useState<string[]>(user.izinliSekmeler || allIds);

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const selectAll = () => setSelected(allIds);
  const selectNone = () => setSelected([]);

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.formTitle}>{user.name} — Sekme İzinleri</h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
          <button style={styles.ghostBtn} onClick={selectAll}>Tümünü Seç</button>
          <button style={styles.ghostBtn} onClick={selectNone}>Tümünü Kaldır</button>
        </div>
        {groups.map((g) => g.items.length > 0 && (
          <div key={g.title} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", marginBottom: 8 }}>{g.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {g.items.map((item) => (
                <label key={item.id} style={{ ...styles.chip, cursor: "pointer", background: selected.includes(item.id) ? "rgba(245,158,11,0.15)" : "#0F172A", borderColor: selected.includes(item.id) ? "#F59E0B" : "#334155" }}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
          <button style={styles.primaryActionBtn} onClick={() => { onSave(selected); onClose(); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}
