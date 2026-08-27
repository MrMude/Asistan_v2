import React, { useState } from "react";
import { styles } from "../../styles/theme";
import { User } from "../../types";

interface TeamPickerProps {
  usersList: User[];
  contacts: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  excludeName: string;
}

export function TeamPicker({ usersList, contacts, selected, onChange, excludeName }: TeamPickerProps) {
  const [tab, setTab] = useState<"uyeler" | "diger">("uyeler");
  const members = usersList.map((u) => u.name).filter((n) => n !== excludeName);
  const others = (contacts || []).filter((n) => n !== excludeName);
  const list = tab === "uyeler" ? members : others;
  const toggle = (name: string) => {
    if (selected.includes(name)) onChange(selected.filter((n) => n !== name));
    else onChange([...selected, name]);
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <button type="button" style={{ ...styles.periodBtn, ...(tab === "uyeler" ? styles.periodBtnActive : {}) }} onClick={() => setTab("uyeler")}>Kayıtlı Üyeler</button>
        <button type="button" style={{ ...styles.periodBtn, ...(tab === "diger" ? styles.periodBtnActive : {}) }} onClick={() => setTab("diger")}>Kayıtlı Olmayanlar</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 110, overflowY: "auto" }}>
        {list.length === 0 && <span style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>{tab === "uyeler" ? "Başka kayıtlı üye yok." : "Henüz kayıtlı olmayan kişi yok."}</span>}
        {list.map((name) => (
          <label key={name} style={{ ...styles.chip, cursor: "pointer", background: selected.includes(name) ? "rgba(245,158,11,0.15)" : "#0F172A", borderColor: selected.includes(name) ? "#F59E0B" : "#334155" }}>
            <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} />
            {name}
          </label>
        ))}
      </div>
      {selected.length > 0 && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 6 }}>Seçili: {selected.join(", ")}</div>}
    </div>
  );
}
