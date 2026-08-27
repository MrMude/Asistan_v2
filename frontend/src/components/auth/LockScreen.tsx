import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";

interface LockScreenProps {
  error: string | null;
  onUnlock: (password: string) => void;
  onSwitchAccount: () => void;
}

/** Oturum açıkken sayfa yenilendiğinde/sekmeye dönüldüğünde gösterilen kilit ekranı. */
export function LockScreen({ error, onUnlock, onSwitchAccount }: LockScreenProps) {
  return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <Lock size={36} color="#F59E0B" />
          <h1 style={{ fontSize: 20, fontWeight: 800, marginTop: 10, color: "#F59E0B" }}>Oturum Kilitli</h1>
        </div>
        {error && <div style={styles.errorBar}>{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const password = (form.elements.namedItem("password") as HTMLInputElement).value;
            onUnlock(password);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div><label style={styles.inputLabel}>Şifreniz</label><input name="password" type="password" maxLength={4} style={styles.mainInput} required autoFocus /></div>
          <button type="submit" style={styles.loginSubmitBtn}>Kilidi Aç <ArrowRight size={16} /></button>
          <button type="button" style={styles.ghostBtn} onClick={onSwitchAccount}>Farklı Hesap</button>
        </form>
      </div>
    </div>
  );
}
