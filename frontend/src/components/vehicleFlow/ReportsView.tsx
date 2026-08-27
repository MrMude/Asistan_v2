import React, { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { fmtDate } from "../../utils/date";
import { NewReportModal, NewReportInput } from "./NewReportModal";
import { ReportDetail } from "./ReportDetail";
import { Report, User, Uygunsuzluk } from "../../types";

interface ReportsViewProps {
  reports: Report[];
  setReports: (v: Report[] | ((p: Report[]) => Report[])) => void;
  currentUser: User;
  onAddUygunsuzluk?: (u: Uygunsuzluk) => void;
}

export function ReportsView({ reports, setReports, currentUser, onAddUygunsuzluk }: ReportsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filterText, setFilterText] = useState("");
  const sorted = [...reports]
    .filter((r) => filterText.trim() === "" || `${r.baslik} ${r.hazirlayan} ${r.tarih}`.toLowerCase().includes(filterText.trim().toLowerCase()))
    .sort((a, b) => (a.tarih < b.tarih ? 1 : -1));
  const selected = reports.find((r) => r.id === selectedId);

  const nextSeq = () => (reports.length ? Math.max(...reports.map((r) => r.seq || 0)) + 1 : 1);

  const createReport = (form: NewReportInput) => {
    const newReport: Report = { id: uid(), seq: nextSeq(), baslik: form.baslik, tarih: form.tarih, hazirlayan: form.hazirlayan, bolum: form.bolum, araclar: [] };
    setReports([newReport, ...reports]);
    setSelectedId(newReport.id);
    setShowNew(false);
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const canDelete = (r: Report) => currentUser.role === "admin" || r.hazirlayan === currentUser.name;

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Araç Kontrol Takibi</h1><p style={styles.viewSub}>Fabrika 1 ve Depo akışındaki araçlar — herkes yeni rapor ekleyebilir.</p></div>
        <button style={styles.primaryActionBtn} onClick={() => setShowNew(true)}><Plus size={16} /> Yeni Rapor</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "200px 1fr" : "260px 1fr", gap: 16 }}>
        <div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Search size={13} color="#64748B" style={{ position: "absolute", left: 9, top: 9 }} />
            <input style={{ ...styles.mainInput, paddingLeft: 28, fontSize: 12 }} placeholder="Rapor ara..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "78vh", overflowY: "auto" }}>
            {sorted.length === 0 && <div style={{ color: "#64748B", fontSize: 12, textAlign: "center", padding: 20 }}>{filterText ? "Sonuç yok." : "Henüz rapor eklenmedi."}</div>}
            {sorted.map((r) => {
              const isSel = selectedId === r.id;
              const sCount = (r.araclar || []).filter((a) => a.asama === "Serbestlik").length;
              const openCount = (r.araclar || []).length - sCount;
              return (
                <div key={r.id} style={{ background: isSel ? "#334155" : "#1E293B", border: isSel ? "1px solid #F59E0B" : "1px solid #334155", borderRadius: 8, padding: "9px 10px", cursor: "pointer" }} className="hover-lift" onClick={() => setSelectedId(r.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{fmtDate(r.tarih)}</span>
                    {canDelete(r) && <Trash2 size={11} color="#EF4444" style={{ cursor: "pointer", flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); deleteReport(r.id); }} />}
                  </div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>v{r.seq} · {openCount} açık, {sCount} serbest</div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && <ReportDetail report={selected} onUpdate={(upd) => setReports(reports.map((r) => (r.id === upd.id ? upd : r)))} onClose={() => setSelectedId(null)} currentUser={currentUser} onAddUygunsuzluk={onAddUygunsuzluk} />}
      </div>

      {showNew && <NewReportModal currentUser={currentUser} onClose={() => setShowNew(false)} onCreate={createReport} />}
    </div>
  );
}
