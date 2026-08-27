import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { todayStr, fmtDate } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { NewUygunsuzlukModal, NewUygunsuzlukInput } from "./NewUygunsuzlukModal";
import { UygunsuzlukDetailModal } from "./UygunsuzlukDetailModal";
import { Uygunsuzluk, User, HataKodu, UygunsuzlukDurum } from "../../types";

interface UygunsuzlukTakipViewProps {
  uygunsuzluklar: Uygunsuzluk[];
  setUygunsuzluklar: (v: Uygunsuzluk[] | ((p: Uygunsuzluk[]) => Uygunsuzluk[])) => void;
  currentUser: User;
  hataKodlari: HataKodu[];
}

export function UygunsuzlukTakipView({ uygunsuzluklar, setUygunsuzluklar, currentUser, hataKodlari }: UygunsuzlukTakipViewProps) {
  const { constants } = useAppData();
  const durumlar = constants?.uygunsuzlukDurumlar ?? [];
  const [showNew, setShowNew] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vinFilter, setVinFilter] = useState("");
  const selected = uygunsuzluklar.find((u) => u.id === selectedId);
  const filtered = vinFilter.trim() === "" ? uygunsuzluklar : uygunsuzluklar.filter((u) => (u.aracVin || "").toLowerCase().includes(vinFilter.trim().toLowerCase()));

  const createRecord = (form: NewUygunsuzlukInput) => {
    const kayit: Uygunsuzluk = { id: uid(), tarih: form.tarih, saat: form.saat, yer: form.yer, aracVin: form.aracVin, aciklama: form.aciklama, tespitEden: form.tespitEden, oncelik: form.oncelik as Uygunsuzluk["oncelik"], hataKodu: form.hataKodu || "", durum: "acik", aksiyon: "", kapatan: null, kapanmaTarihi: null };
    setUygunsuzluklar([kayit, ...uygunsuzluklar]);
    setShowNew(false);
  };

  const moveTo = (id: string, durum: UygunsuzlukDurum) => setUygunsuzluklar(uygunsuzluklar.map((u) => (u.id === id ? { ...u, durum, ...(durum === "kapatildi" ? { kapatan: currentUser.name, kapanmaTarihi: todayStr() } : {}) } : u)));
  const updateRecord = (id: string, patch: Partial<Uygunsuzluk>) => setUygunsuzluklar(uygunsuzluklar.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  const deleteRecord = (id: string) => { setUygunsuzluklar(uygunsuzluklar.filter((u) => u.id !== id)); setSelectedId(null); };

  const oncelikColor = (o: string) => (o === "Kritik" ? "#EF4444" : o === "Yüksek" ? "#F59E0B" : o === "Orta" ? "#38BDF8" : "#94A3B8");

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Uygunsuzluk Listesi</h1><p style={styles.viewSub}>Tespit edilen yer, saat ve araç VIN numarasıyla izlenebilir uygunsuzluk kaydı.</p></div>
        <button style={styles.primaryActionBtn} onClick={() => setShowNew(true)}><Plus size={16} /> Yeni Uygunsuzluk</button>
      </div>

      <div style={{ position: "relative", maxWidth: 280 }} className="no-print">
        <Search size={13} color="#64748B" style={{ position: "absolute", left: 9, top: 9 }} />
        <input style={{ ...styles.mainInput, paddingLeft: 28, fontSize: 12 }} placeholder="Araç VIN No ile filtrele..." value={vinFilter} onChange={(e) => setVinFilter(e.target.value)} />
      </div>

      <div style={styles.kanbanGrid}>
        {durumlar.map((stage) => {
          const list = filtered.filter((u) => u.durum === stage.id);
          return (
            <div key={stage.id} style={styles.kanbanColumn} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text"); if (id) moveTo(id, stage.id as UygunsuzlukDurum); }}>
              <div style={{ ...styles.kanbanColumnHeader, borderTopColor: stage.color }}><span style={{ fontWeight: 800, fontSize: 13, color: stage.color }}>{stage.label}</span><span style={styles.kanbanBadge}>{list.length}</span></div>
              <div style={styles.kanbanCardsList}>
                {list.map((u) => (
                  <div key={u.id} className="hover-lift" style={styles.kanbanCard} draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text", u.id); }} onClick={() => setSelectedId(u.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: oncelikColor(u.oncelik) }}>{u.oncelik}</span>
                      <span style={{ fontSize: 10, color: "#64748B" }}>{fmtDate(u.tarih)} {u.saat}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 4 }}>
                      {u.gorsel && <img src={u.gorsel} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6, border: "1px solid #334155", flexShrink: 0 }} />}
                      <div style={{ ...styles.kanbanCardTitle, marginTop: 0 }}>{u.hataKodu && <span style={{ color: "#F59E0B", fontFamily: "monospace" }}>[{u.hataKodu}] </span>}{u.aciklama}</div>
                    </div>
                    <div style={styles.kanbanCardFooter}>
                      <span>📍 {u.yer || "—"}</span>
                      {u.aracVin && <span>🚗 {u.aracVin}</span>}
                    </div>
                  </div>
                ))}
                {list.length === 0 && <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>Boş</div>}
              </div>
            </div>
          );
        })}
      </div>

      {showNew && <NewUygunsuzlukModal currentUser={currentUser} hataKodlari={hataKodlari} onClose={() => setShowNew(false)} onCreate={createRecord} />}
      {selected && <UygunsuzlukDetailModal record={selected} hataKodlari={hataKodlari} onClose={() => setSelectedId(null)} onUpdate={(patch) => updateRecord(selected.id, patch)} onDelete={() => deleteRecord(selected.id)} onMove={(durum) => moveTo(selected.id, durum)} />}
    </div>
  );
}
