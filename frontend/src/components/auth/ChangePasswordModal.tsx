import React, { useState } from "react";
import { styles } from "../../styles/theme";

interface ChangePasswordModalProps {
  onClose: () => void;
  /** Yeni (4 haneli) şifreyi kaydeder — çağıran taraf hangi kullanıcıya ait olduğunu bilir. */
  onSave: (newPassword: string) => void;
}

export function ChangePasswordModal({ onClose, onSave }: ChangePasswordModalProps) {
  const [p, setP] = useState("");
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <h2>Şifre Değiştir</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (p.length === 4) { onSave(p); onClose(); }
          }}
          style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}
        >
          <input type="password" maxLength={4} style={styles.mainInput} placeholder="Yeni 4 Haneli Şifre" value={p} onChange={(e) => setP(e.target.value)} required />
          <button type="submit" style={styles.primaryActionBtn}>Değiştir</button>
        </form>
      </div>
    </div>
  );
}
