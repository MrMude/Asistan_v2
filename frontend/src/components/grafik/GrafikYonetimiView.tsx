import React, { useState } from "react";
import { styles } from "../../styles/theme";
import { useAppData } from "../../context/AppDataContext";
import { Task } from "../../types";
import { KanbanStage } from "../../types/constants";

interface GrafikYonetimiViewProps {
  tasks: Task[];
}

export function GrafikYonetimiView({ tasks }: GrafikYonetimiViewProps) {
  const { constants } = useAppData();
  const kanbanStages = constants?.kanbanStages ?? [];

  const people = Array.from(new Set(tasks.flatMap((t) => [t.sorumlu, ...(t.ekipUyeleri || [])]).filter(Boolean))).sort();
  const [person, setPerson] = useState(people[0] || "");

  const bireysel = tasks.filter((t) => t.sorumlu === person && (t.ekipUyeleri || []).length === 0);
  const grup = tasks.filter(
    (t) => (t.sorumlu === person && (t.ekipUyeleri || []).length > 0) || (t.ekipUyeleri || []).includes(person) || (t.sorumlu !== person && (t.sorumlu || "").includes(person))
  );

  const chartData = (list: Task[]) => kanbanStages.map((s) => ({ ...s, count: list.filter((t) => t.durum === s.id).length }));
  const bireyselData = chartData(bireysel);
  const grupData = chartData(grup);
  const maxCount = Math.max(1, ...bireyselData.map((d) => d.count), ...grupData.map((d) => d.count));

  const renderChart = (data: (KanbanStage & { count: number })[], total: number) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d) => (
        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, width: 110, flexShrink: 0, color: d.color }}>{d.label}</span>
          <div style={{ flex: 1, background: "#0F172A", borderRadius: 6, height: 16, overflow: "hidden" }}>
            <div style={{ width: `${(d.count / maxCount) * 100}%`, height: "100%", background: d.color, transition: "width 0.2s" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, width: 24, textAlign: "right" }}>{d.count}</span>
        </div>
      ))}
      <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>Toplam: {total} kayıt</div>
    </div>
  );

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Grafik Yönetimi</h1><p style={styles.viewSub}>Bir kişi seçin — bireysel ve grup çalışmaları ayrı grafiklerde görünsün.</p></div>
      </div>

      <select style={{ ...styles.selectInput, maxWidth: 280 }} value={person} onChange={(e) => setPerson(e.target.value)}>
        {people.length === 0 && <option value="">Kayıtlı kişi yok</option>}
        {people.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      {person && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 4 }}>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B", marginBottom: 16 }}>Bireysel Çalışmaları</h3>
            {renderChart(bireyselData, bireysel.length)}
          </div>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#38BDF8", marginBottom: 16 }}>Grup Çalışmaları</h3>
            {renderChart(grupData, grup.length)}
          </div>
        </div>
      )}
    </div>
  );
}
