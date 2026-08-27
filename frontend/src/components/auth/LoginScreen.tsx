import React, { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (name: string, username: string, password: string) => void;
  error: string | null;
}

export function LoginScreen({ onLogin, onRegister, error }: LoginScreenProps) {
  const [isReg, setIsReg] = useState(false);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <div style={styles.loginLogo}><ShieldCheck size={36} color="#F59E0B" /></div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 12, color: "#F59E0B" }}>Karea Asistan</h1>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>🔑 İlk giriş şifresi: <b>0000</b></p>
        </div>
        {error && <div style={styles.errorBar}>{error}</div>}
        {!isReg ? (
          <form onSubmit={(e) => { e.preventDefault(); onLogin(u, p); }} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
            <div><label style={styles.inputLabel}>Kullanıcı Adı</label><input style={styles.mainInput} value={u} onChange={(e) => setU(e.target.value)} required autoFocus /></div>
            <div><label style={styles.inputLabel}>Şifre</label><input type="password" maxLength={4} style={styles.mainInput} value={p} onChange={(e) => setP(e.target.value)} required /></div>
            <button type="submit" style={styles.loginSubmitBtn}>Giriş Yap <ArrowRight size={16} /></button>
            <button type="button" style={{ background: "transparent", border: "none", color: "#38BDF8", fontSize: 12, cursor: "pointer" }} onClick={() => setIsReg(true)}>Kayıt Ol</button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); onRegister(name, u, p); setIsReg(false); }} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
            <div><label style={styles.inputLabel}>Adı Soyadı</label><input style={styles.mainInput} value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label style={styles.inputLabel}>Kullanıcı ID</label><input style={styles.mainInput} value={u} onChange={(e) => setU(e.target.value)} required /></div>
            <div><label style={styles.inputLabel}>Şifre (0000)</label><input type="password" maxLength={4} style={styles.mainInput} value={p} onChange={(e) => setP(e.target.value)} required /></div>
            <button type="submit" style={styles.loginSubmitBtn}>Kayıt Oluştur</button>
            <button type="button" style={{ background: "transparent", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer" }} onClick={() => setIsReg(false)}>← Girişe Dön</button>
          </form>
        )}
      </div>
    </div>
  );
}
