import React, { useState } from "react";
import { Key, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";

interface PasswordSetupScreenProps {
  error: string | null;
  onSave: (newPassword: string) => void;
}

/** İlk girişte (varsayılan 0000 şifresiyle) yeni 4 haneli şifre belirleme ekranı. */
export function PasswordSetupScreen({ error, onSave }: PasswordSetupScreenProps) {
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.length !== 4 || Number.isNaN(Number(newPasswordInput))) return;
    onSave(newPasswordInput.trim());
  };

  return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <Key size={36} color="#F59E0B" />
          <h1 style={{ fontSize: 20, fontWeight: 800, marginTop: 10, color: "#F59E0B" }}>4 Haneli Şifre Belirleyin</h1>
        </div>
        {error && <div style={styles.errorBar}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          <div><label style={styles.inputLabel}>Yeni Şifreniz</label><input type="password" maxLength={4} style={styles.mainInput} value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} required autoFocus /></div>
          <button type="submit" style={styles.loginSubmitBtn}>Kaydet ve Başla <ArrowRight size={16} /></button>
        </form>
      </div>
    </div>
  );
}
