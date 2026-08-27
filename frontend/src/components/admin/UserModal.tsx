import React, { useState } from "react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { User } from "../../types";

interface UserModalProps {
  onClose: () => void;
  onSave: (u: User) => void;
}

export function UserModal({ onClose, onSave }: UserModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("0000");
  const [role, setRole] = useState<User["role"]>("user");
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <h2>Kullanıcı Ekle</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ id: uid(), name, username, password, role, status: "approved" }); onClose(); }} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          <input style={styles.mainInput} placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} required />
          <input style={styles.mainInput} placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input style={styles.mainInput} type="password" maxLength={4} placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select style={styles.selectInput} value={role} onChange={(e) => setRole(e.target.value as User["role"])}><option value="user">Kullanıcı</option><option value="admin">Admin</option></select>
          <button type="submit" style={styles.primaryActionBtn}>Kaydet</button>
        </form>
      </div>
    </div>
  );
}
