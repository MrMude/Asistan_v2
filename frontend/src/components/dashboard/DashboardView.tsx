import React, { useState } from "react";
import { Printer, ListTodo, FileSpreadsheet, FileText, ChevronDown, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr, fmtDate } from "../../utils/date";
import { getAllSectionIds } from "../../constants/navigation";
import { MODULE_META } from "../../constants/moduleMeta";
import { useAppData } from "../../context/AppDataContext";
import { Task, AppModule, Report, User } from "../../types";

interface DashboardViewProps {
  tasks: Task[];
  modules: AppModule[];
  reports: Report[];
  currentUser: User;
  onOpenDetail: (task: Task) => void;
  onNavigateModule: (moduleId: string) => void;
}

export function DashboardView({ tasks, modules, reports, currentUser, onOpenDetail, onNavigateModule }: DashboardViewProps) {
  const { constants } = useAppData();
  const kanbanStages = constants?.kanbanStages ?? [];

  const myTasks = tasks.filter((t) => t.sorumlu === currentUser.name || (t.ekipUyeleri || []).includes(currentUser.name));
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const today = todayStr();
  const overdueCount = myTasks.filter((t) => t.durum !== "tamam" && t.vade && t.vade < today).length;
  const teamActive = tasks.filter((t) => t.durum !== "tamam").length;
  const teamDone = tasks.filter((t) => t.durum === "tamam").length;
  const canSeeReports = currentUser.role === "admin" || (currentUser.izinliSekmeler || getAllSectionIds(modules)).includes("raporlar");
  const latestReport = canSeeReports && reports && reports.length > 0 ? [...reports].sort((a, b) => (a.tarih < b.tarih ? 1 : -1))[0] : null;

  return (
    <div style={styles.viewContainer} id="print-area">
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Dashboard</h1><p style={styles.viewSub}>Hoş geldiniz, {currentUser.name}. — {fmtDate(today)}</p></div>
        <button style={styles.printBtn} className="no-print" onClick={() => window.print()}><Printer size={15} /> Yazdır</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="no-print">
        <button style={styles.quickActionBtn} onClick={() => onNavigateModule("todo")}><ListTodo size={13} /> To-Do Ekle</button>
        {canSeeReports && <button style={styles.quickActionBtn} onClick={() => onNavigateModule("raporlar")}><FileSpreadsheet size={13} /> Araç Kontrol Takibi</button>}
        <button style={styles.quickActionBtn} onClick={() => onNavigateModule("grafik_yonetimi")}><FileText size={13} /> Grafik Yönetimi</button>
      </div>

      <div style={styles.dashboardCardGrid}>
        <div style={{ ...styles.dashCard, borderLeftColor: "#38BDF8" }}><div style={styles.dashCardTitle}>Toplam İşim</div><div style={styles.dashCardValue}>{myTasks.length}</div></div>
        <div style={{ ...styles.dashCard, borderLeftColor: "#F59E0B" }}><div style={styles.dashCardTitle}>Aktif İşlerim</div><div style={styles.dashCardValue}>{myTasks.filter((t) => t.durum !== "tamam").length}</div></div>
        <div style={{ ...styles.dashCard, borderLeftColor: "#10B981" }}><div style={styles.dashCardTitle}>Tamamladığım</div><div style={styles.dashCardValue}>{myTasks.filter((t) => t.durum === "tamam").length}</div></div>
        <div style={{ ...styles.dashCard, borderLeftColor: "#EF4444" }}><div style={styles.dashCardTitle}>Geciken İşlerim</div><div style={styles.dashCardValue}>{overdueCount}</div></div>
      </div>

      {latestReport && (
        <div style={styles.yearEndTableCard} onClick={() => onNavigateModule("raporlar")} className="hover-lift">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>Son Araç Akışı Raporu — {fmtDate(latestReport.tarih)}</h3>
            <ArrowRight size={16} color="#94A3B8" />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 10, fontSize: 12 }}>
            <span style={{ color: "#38BDF8" }}>{(latestReport.araclar || []).filter((a) => a.konum === "fabrika1").length} Fabrika 1</span>
            <span style={{ color: "#F59E0B" }}>{(latestReport.araclar || []).filter((a) => a.konum === "depo" && a.asama !== "Serbestlik").length} Depo</span>
            <span style={{ color: "#10B981" }}>{(latestReport.araclar || []).filter((a) => a.asama === "Serbestlik").length} Serbest</span>
          </div>
        </div>
      )}

      <div style={styles.yearEndTableCard}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 12 }}>Ekip Geneli Durum</h3>
        <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Toplam İş</div><div style={{ fontSize: 20, fontWeight: 800 }}>{tasks.length}</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Aktif</div><div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{teamActive}</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Tamamlanan</div><div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{teamDone}</div></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {modules.map((m) => {
            const modTasks = tasks.filter((t) => t.module === m.id);
            const modDone = modTasks.filter((t) => t.durum === "tamam").length;
            const pct = modTasks.length ? Math.round((modDone / modTasks.length) * 100) : 0;
            const isExpanded = expandedModule === m.id;
            return (
              <div key={m.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "4px 0" }} onClick={() => setExpandedModule(isExpanded ? null : m.id)}>
                  <ChevronDown size={12} color="#64748B" style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, width: 160, flexShrink: 0 }}>{m.label}</span>
                  <div style={{ flex: 1, background: "#0F172A", borderRadius: 6, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: MODULE_META[m.id]?.color || "#F59E0B" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#94A3B8", width: 90, textAlign: "right" }}>{modDone}/{modTasks.length} tamam</span>
                </div>
                {isExpanded && (
                  <div style={{ marginLeft: 22, marginTop: 6, marginBottom: 10, padding: 12, background: "#0F172A", borderRadius: 8, border: "1px solid #334155" }}>
                    <div style={{ fontSize: 10, color: "#64748B", marginBottom: 8 }}>{m.label} — aşamaya göre tüm ekip dağılımı</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {kanbanStages.map((stage) => {
                        const count = modTasks.filter((t) => t.durum === stage.id).length;
                        return (
                          <div key={stage.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                            <span style={{ color: stage.color, fontWeight: 600 }}>{stage.label}</span>
                            <span style={{ color: "#E2E8F0", fontWeight: 700 }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button style={{ ...styles.quickActionBtn, marginTop: 10, fontSize: 11, width: "100%", justifyContent: "center" }} onClick={() => onNavigateModule(m.id)}>Modüle Git <ArrowRight size={11} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 12 }}>İşlerim (Aşamaya Göre)</h3>
        <div style={{ ...styles.dashKanbanScroll, width: "100%" }}>
          {kanbanStages.map((stage) => {
            const stageTasks = myTasks.filter((t) => t.durum === stage.id);
            return (
              <div key={stage.id} style={styles.dashKanbanCol}>
                <div style={{ ...styles.aracKanbanColHeader, borderTopColor: stage.color }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: stage.color }}>{stage.label}</span>
                    <span style={styles.kanbanBadge}>{stageTasks.length}</span>
                  </div>
                </div>
                <div style={styles.aracKanbanColBody}>
                  {stageTasks.length === 0 && <div style={{ fontSize: 10, color: "#475569", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>Boş</div>}
                  {stageTasks.map((t) => (
                    <div key={t.id} style={{ ...styles.aracVehCard, cursor: "pointer" }} className="hover-lift" onClick={() => onOpenDetail(t)}>
                      <span style={styles.taskCodeBadge}>{t.kod}</span>
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 5 }}>{t.baslik}</div>
                      {t.vade && <div style={{ fontSize: 10, color: t.durum !== "tamam" && t.vade < today ? "#EF4444" : "#64748B", marginTop: 4 }}>{t.durum !== "tamam" && t.vade < today ? "⚠ " : ""}{fmtDate(t.vade)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
