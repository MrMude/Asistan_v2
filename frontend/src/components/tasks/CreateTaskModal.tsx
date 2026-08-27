import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr } from "../../utils/date";
import { TeamPicker } from "./TeamPicker";
import { User, Task } from "../../types";

export interface NewTaskInput {
  baslik: string;
  sorumlu: string;
  vade: string;
  module: string;
  ekipUyeleri: string[];
}

interface CreateTaskModalProps {
  activeModule: string;
  usersList: User[];
  contacts: string[];
  personOptions: string[];
  currentUser: Pick<User, "name">;
  onClose: () => void;
  onCreate: (input: NewTaskInput) => void;
}

export function CreateTaskModal({ activeModule, usersList, contacts, personOptions, currentUser, onClose, onCreate }: CreateTaskModalProps) {
  const [baslik, setBaslik] = useState("");
  const [sorumlu, setSorumlu] = useState(currentUser?.name || "");
  const [vade, setVade] = useState(todayStr());
  const [ekip, setEkip] = useState<string[]>([]);
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <div style={styles.drawerHeader}><h2 style={styles.formTitle}>Yeni Görev</h2><button style={styles.closeBtn} onClick={onClose}><X size={18} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
          <div><label style={styles.inputLabel}>Başlık</label><input style={styles.mainInput} value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Görev yazın..." required /></div>
          <div>
            <label style={styles.inputLabel}>Sorumlu (üye olmayan biri de yazılabilir)</label>
            <input style={styles.mainInput} list="kisi-listesi-yeni" value={sorumlu} onChange={(e) => setSorumlu(e.target.value)} placeholder="İsim yazın..." />
            <datalist id="kisi-listesi-yeni">{(personOptions || []).map((p) => <option key={p} value={p} />)}</datalist>
          </div>
          <div>
            <label style={styles.inputLabel}>Ek Kişiler (opsiyonel)</label>
            <TeamPicker usersList={usersList} contacts={contacts} selected={ekip} onChange={setEkip} excludeName={sorumlu} />
          </div>
          <div><label style={styles.inputLabel}>Vade</label><input type="date" style={styles.selectInput} value={vade} onChange={(e) => setVade(e.target.value)} /></div>
          <button style={styles.primaryActionBtn} onClick={() => { if (!baslik) return; onCreate({ baslik, sorumlu, vade, module: activeModule, ekipUyeleri: ekip }); onClose(); }}>Oluştur</button>
        </div>
      </div>
    </div>
  );
}
