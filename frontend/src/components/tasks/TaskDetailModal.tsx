import React, { useState } from "react";
import { X, CheckSquare, Square } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { useAppData } from "../../context/AppDataContext";
import { TeamPicker } from "./TeamPicker";
import { User, Task } from "../../types";

interface TaskDetailModalProps {
  task: Task;
  currentUser: User;
  usersList: User[];
  contacts: string[];
  personOptions: string[];
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskDetailModal({ task, usersList, contacts, personOptions, onClose, onSaveTask, onDeleteTask }: TaskDetailModalProps) {
  const { constants } = useAppData();
  const kanbanStages = constants?.kanbanStages ?? [];
  const [subText, setSubText] = useState("");
  const [editTitle, setEditTitle] = useState(task.baslik);
  const [editSorumlu, setEditSorumlu] = useState(task.sorumlu);
  const [keywordText, setKeywordText] = useState("");
  const ekip = task.ekipUyeleri || [];
  const etiketler = task.etiketler || [];

  const addKeyword = () => {
    const k = keywordText.trim().replace(/^#/, "");
    if (!k || etiketler.some((e) => e.toLowerCase() === k.toLowerCase())) { setKeywordText(""); return; }
    onSaveTask({ ...task, etiketler: [...etiketler, k] });
    setKeywordText("");
  };
  const removeKeyword = (k: string) => onSaveTask({ ...task, etiketler: etiketler.filter((e) => e !== k) });

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.drawerContainer}>
        <div style={styles.drawerHeader}><span style={styles.taskCodeBadge}>{task.kod}</span><button style={styles.closeBtn} onClick={onClose}><X size={18} /></button></div>
        <div style={styles.drawerBody}>
          <input style={styles.mainInput} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => onSaveTask({ ...task, baslik: editTitle })} />
          <div>
            <label style={styles.inputLabel}>Sorumlu (üye olmayan biri de yazılabilir)</label>
            <input style={styles.mainInput} list="kisi-listesi-detay" value={editSorumlu} onChange={(e) => setEditSorumlu(e.target.value)} onBlur={() => onSaveTask({ ...task, sorumlu: editSorumlu })} />
            <datalist id="kisi-listesi-detay">{(personOptions || []).map((p) => <option key={p} value={p} />)}</datalist>
          </div>
          <div>
            <label style={styles.inputLabel}>Ek Kişiler</label>
            <TeamPicker usersList={usersList} contacts={contacts} selected={ekip} onChange={(next) => onSaveTask({ ...task, ekipUyeleri: next })} excludeName={editSorumlu} />
          </div>
          <div>
            <label style={styles.inputLabel}>Anahtar Kelimeler</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: etiketler.length > 0 ? 8 : 0 }}>
              {etiketler.map((k) => (
                <span key={k} style={styles.chip}>#{k} <X size={11} style={{ cursor: "pointer" }} onClick={() => removeKeyword(k)} /></span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input style={styles.mainInput} placeholder="Anahtar kelime yazıp Enter'a basın..." value={keywordText} onChange={(e) => setKeywordText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()} />
              <button style={styles.addInlineBtn} onClick={addKeyword}>Ekle</button>
            </div>
          </div>
          <select style={styles.selectInput} value={task.durum} onChange={(e) => onSaveTask({ ...task, durum: e.target.value as Task["durum"] })}>
            {kanbanStages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div style={styles.subtaskSection}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#F59E0B" }}>Alt Adımlar</div>
            {(task.subtasks || []).map((st) => (
              <div key={st.id} style={styles.subtaskRowInteractive} onClick={() => onSaveTask({ ...task, subtasks: task.subtasks.map((s) => (s.id === st.id ? { ...s, done: !s.done } : s)) })}>
                {st.done ? <CheckSquare size={16} color="#10B981" /> : <Square size={16} color="#6B7280" />}
                <span style={{ textDecoration: st.done ? "line-through" : "none", flex: 1 }}>{st.text}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <input style={styles.mainInput} placeholder="Alt adım..." value={subText} onChange={(e) => setSubText(e.target.value)} />
              <button style={styles.addInlineBtn} onClick={() => { if (!subText.trim()) return; onSaveTask({ ...task, subtasks: [...(task.subtasks || []), { id: uid(), text: subText.trim(), done: false }] }); setSubText(""); }}>Ekle</button>
            </div>
          </div>
        </div>
        <div style={styles.drawerFooter}><button style={styles.deleteDangerBtn} onClick={() => onDeleteTask(task.id)}>Sil</button><button style={styles.primaryActionBtn} onClick={onClose}>Kapat</button></div>
      </div>
    </div>
  );
}
