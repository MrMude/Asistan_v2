import React, { useState } from "react";
import { X, Trash2, ShieldCheck } from "lucide-react";
import { styles } from "../../styles/theme";
import { MODULE_META } from "../../constants/moduleMeta";
import { UserModal } from "./UserModal";
import { PermissionsModal } from "./PermissionsModal";
import { User, AppModule } from "../../types";

interface AdminPermissionsViewProps {
  usersList: User[];
  setUsersList: (v: User[] | ((p: User[]) => User[])) => void;
  modules: AppModule[];
  setModules: (v: AppModule[] | ((p: AppModule[]) => AppModule[])) => void;
  contacts: string[];
  setContacts: (v: string[] | ((p: string[]) => string[])) => void;
}

export function AdminPermissionsView({ usersList, setUsersList, modules, setModules, contacts, setContacts }: AdminPermissionsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingModules, setEditingModules] = useState<Record<string, string>>(() => Object.fromEntries(modules.map((m) => [m.id, m.label])));
  const [newModuleLabel, setNewModuleLabel] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [permModalFor, setPermModalFor] = useState<string | null>(null);

  const saveModuleLabel = (id: string) => {
    setModules(modules.map((m) => (m.id === id ? { ...m, label: (editingModules[id] || m.label).trim() || m.label } : m)));
  };

  const slugify = (s: string) => {
    const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
    let out = s.split("").map((ch) => map[ch] || ch).join("").toLowerCase();
    out = out.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    return out || "modul";
  };

  const addModule = () => {
    const label = newModuleLabel.trim();
    if (!label) return;
    let id = slugify(label);
    let n = 2;
    while (modules.some((m) => m.id === id)) { id = `${slugify(label)}_${n}`; n++; }
    setModules([...modules, { id, label }]);
    setNewModuleLabel("");
  };

  const removeModule = (id: string) => {
    if (modules.length <= 1) { window.alert("En az bir modül kalmalı."); return; }
    if (window.confirm("Bu modülü silmek istediğinize emin misiniz? Modüldeki mevcut görevler silinmez ama nav'dan erişilemez hale gelir.")) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  const addContact = () => {
    const n = newContactName.trim();
    if (!n) return;
    if (usersList.some((u) => u.name === n) || contacts.includes(n)) { window.alert("Bu isim zaten kayıtlı."); return; }
    setContacts([...contacts, n]);
    setNewContactName("");
  };

  const removeContact = (n: string) => {
    if (window.confirm(`"${n}" adını kişi listesinden silmek istediğinize emin misiniz? Bu kişiye daha önce atanmış görevler etkilenmez, sadece öneri listesinden kalkar.`)) {
      setContacts(contacts.filter((c) => c !== n));
    }
  };

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}><h1 style={styles.viewTitle}>Admin Paneli</h1><button style={styles.primaryActionBtn} onClick={() => setShowModal(true)}>Kullanıcı Ekle</button></div>

      <div style={styles.yearEndTableCard}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 4 }}>Kişiler (Üye Olmayan)</h3>
        <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 12 }}>Sisteme giriş yapamayan ama görev atayabileceğiniz iş arkadaşlarınız. Bir görev formunda yeni bir isim yazdığınızda buraya otomatik eklenir.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {contacts.length === 0 && <span style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Henüz kişi yok.</span>}
          {contacts.map((c) => (
            <span key={c} style={styles.chip}>{c} <X size={11} style={{ cursor: "pointer" }} onClick={() => removeContact(c)} /></span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...styles.mainInput, flex: 1 }} placeholder="Yeni kişi adı..." value={newContactName} onChange={(e) => setNewContactName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addContact()} />
          <button style={styles.addInlineBtn} onClick={addContact}>+ Ekle</button>
        </div>
      </div>

      <div style={styles.yearEndTableCard}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 12 }}>Modüller</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {modules.map((m) => {
            const Icon = MODULE_META[m.id]?.icon || ShieldCheck;
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={16} color={MODULE_META[m.id]?.color || "#94A3B8"} />
                <input
                  style={{ ...styles.mainInput, flex: 1 }}
                  value={editingModules[m.id] ?? m.label}
                  onChange={(e) => setEditingModules((prev) => ({ ...prev, [m.id]: e.target.value }))}
                  onBlur={() => saveModuleLabel(m.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") { saveModuleLabel(m.id); e.currentTarget.blur(); } }}
                />
                <Trash2 size={14} color="#EF4444" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => removeModule(m.id)} />
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input style={{ ...styles.mainInput, flex: 1 }} placeholder="Yeni modül adı..." value={newModuleLabel} onChange={(e) => setNewModuleLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addModule()} />
            <button style={styles.addInlineBtn} onClick={addModule}>+ Ekle</button>
          </div>
        </div>
      </div>

      <div style={styles.yearEndTableCard}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 12 }}>Üyelik Yönetimi</h3>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Adı</th><th style={styles.th}>ID</th><th style={styles.th}>Rol</th><th style={styles.th}>Sekme İzinleri</th><th style={styles.th}>İşlem</th></tr></thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.tdTitle}>{u.name}</td>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>
                  <select style={{ ...styles.selectInput, padding: "4px 8px", fontSize: 11 }} value={u.role} onChange={(e) => setUsersList(usersList.map((x) => (x.id === u.id ? { ...x, role: e.target.value as User["role"] } : x)))}>
                    <option value="user">Kullanıcı</option>
                    <option value="moderator">Moderatör</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={styles.td}>
                  {u.role === "admin" ? (
                    <span style={{ fontSize: 11, color: "#5FAE7B" }}>Admin — her şeyi görür</span>
                  ) : (
                    <button style={styles.editIconBtn} onClick={() => setPermModalFor(u.id)}>
                      İzinleri Düzenle {u.izinliSekmeler ? `(${u.izinliSekmeler.length})` : "(Tümü)"}
                    </button>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={styles.editIconBtn} title="Şifreyi 0000 olarak sıfırlar, kullanıcı sonraki girişte yeni şifre belirler" onClick={() => { if (window.confirm(`${u.name} kullanıcısının şifresini sıfırlamak istediğinize emin misiniz?`)) setUsersList(usersList.map((x) => (x.id === u.id ? { ...x, password: "0000" } : x))); }}>Şifre Sıfırla</button>
                    <button style={styles.deleteDangerBtn} onClick={() => { if (window.confirm(`${u.name} kullanıcısını silmek istediğinize emin misiniz?`)) setUsersList(usersList.filter((x) => x.id !== u.id)); }}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <UserModal onClose={() => setShowModal(false)} onSave={(u) => setUsersList([...usersList, u])} />}
      {permModalFor && (
        <PermissionsModal
          user={usersList.find((u) => u.id === permModalFor)!}
          modules={modules}
          onClose={() => setPermModalFor(null)}
          onSave={(izinliSekmeler) => setUsersList(usersList.map((x) => (x.id === permModalFor ? { ...x, izinliSekmeler } : x)))}
        />
      )}
    </div>
  );
}
