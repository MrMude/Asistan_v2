import React from "react";
import { Printer } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr, fmtDate } from "../../utils/date";
import { useAppData } from "../../context/AppDataContext";
import { Uygunsuzluk } from "../../types";

interface UygunsuzlukIstatistikViewProps {
  uygunsuzluklar: Uygunsuzluk[];
}

export function UygunsuzlukIstatistikView({ uygunsuzluklar }: UygunsuzlukIstatistikViewProps) {
  const { constants } = useAppData();
  const durumlar = constants?.uygunsuzlukDurumlar ?? [];
  const oncelikList = constants?.uygunsuzlukOncelik ?? [];

  const total = uygunsuzluklar.length;
  const durumData = durumlar.map((s) => ({ ...s, count: uygunsuzluklar.filter((u) => u.durum === s.id).length }));
  const oncelikColors: Record<string, string> = { Kritik: "#EF4444", Yüksek: "#F59E0B", Orta: "#38BDF8", Düşük: "#94A3B8" };
  const oncelikData = oncelikList.map((o) => ({ label: o, color: oncelikColors[o] ?? "#94A3B8", count: uygunsuzluklar.filter((u) => u.oncelik === o).length }));

  const countBy = (key: keyof Uygunsuzluk): [string, number][] => {
    const map: Record<string, number> = {};
    uygunsuzluklar.forEach((u) => {
      const v = (u[key] as string) || "Belirtilmemiş";
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };
  const yerData = countBy("yer").slice(0, 8);
  const vinData = countBy("aracVin").slice(0, 8);
  const kodData = countBy("hataKodu").filter(([k]) => k !== "Belirtilmemiş").slice(0, 8);

  const kapatilanlar = uygunsuzluklar.filter((u) => u.durum === "kapatildi" && u.kapanmaTarihi);
  const ortalamaGun = kapatilanlar.length > 0
    ? Math.round(kapatilanlar.reduce((sum, u) => sum + Math.max(0, (new Date(u.kapanmaTarihi as string).getTime() - new Date(u.tarih).getTime()) / 86400000), 0) / kapatilanlar.length)
    : null;

  const maxDurum = Math.max(1, ...durumData.map((d) => d.count));
  const maxOncelik = Math.max(1, ...oncelikData.map((d) => d.count));
  const maxYer = Math.max(1, ...yerData.map(([, c]) => c));
  const maxVin = Math.max(1, ...vinData.map(([, c]) => c));
  const maxKod = Math.max(1, ...kodData.map(([, c]) => c));

  const bar = (label: string, count: number, max: number, color: string) => (
    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, width: 130, flexShrink: 0, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={label}>{label}</span>
      <div style={{ flex: 1, background: "#0F172A", borderRadius: 6, height: 14, overflow: "hidden" }}>
        <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, width: 20, textAlign: "right" }}>{count}</span>
    </div>
  );

  const exportPdf = () => {
    const prevTitle = document.title;
    document.title = `${todayStr()}_Uygunsuzluk_Istatistik_Raporu`;
    window.print();
    setTimeout(() => { document.title = prevTitle; }, 800);
  };

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Uygunsuzlukların İstatistiği</h1><p style={styles.viewSub}>Yönetim için özet istatistik ve grafikler.</p></div>
        <button style={styles.printBtn} className="no-print" onClick={exportPdf}><Printer size={15} /> PDF Olarak İndir</button>
      </div>

      <div id="print-area">
        <div className="print-only" style={{ fontSize: 16, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>UYGUNSUZLUKLARIN İSTATİSTİK RAPORU</div>
        <div className="print-only" style={{ fontSize: 11, textAlign: "center", marginBottom: 16 }}>Rapor Tarihi: {fmtDate(todayStr())}</div>

        <div style={styles.dashboardCardGrid}>
          <div style={{ ...styles.dashCard, borderLeftColor: "#94A3B8" }}><div style={styles.dashCardTitle}>Toplam Kayıt</div><div style={styles.dashCardValue}>{total}</div></div>
          <div style={{ ...styles.dashCard, borderLeftColor: "#EF4444" }}><div style={styles.dashCardTitle}>Açık</div><div style={styles.dashCardValue}>{durumData.find((d) => d.id === "acik")?.count || 0}</div></div>
          <div style={{ ...styles.dashCard, borderLeftColor: "#10B981" }}><div style={styles.dashCardTitle}>Kapatıldı</div><div style={styles.dashCardValue}>{durumData.find((d) => d.id === "kapatildi")?.count || 0}</div></div>
          <div style={{ ...styles.dashCard, borderLeftColor: "#38BDF8" }}><div style={styles.dashCardTitle}>Ort. Kapanma Süresi</div><div style={styles.dashCardValue}>{ortalamaGun !== null ? `${ortalamaGun} gün` : "—"}</div></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B", marginBottom: 14 }}>Duruma Göre Dağılım</h3>
            {total === 0 ? <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>Henüz veri yok.</div> : durumData.map((d) => bar(d.label, d.count, maxDurum, d.color))}
          </div>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B", marginBottom: 14 }}>Önceliğe Göre Dağılım</h3>
            {total === 0 ? <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>Henüz veri yok.</div> : oncelikData.map((d) => bar(d.label, d.count, maxOncelik, d.color))}
          </div>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#38BDF8", marginBottom: 14 }}>Yere Göre Dağılım (İlk 8)</h3>
            {yerData.length === 0 ? <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>Henüz veri yok.</div> : yerData.map(([label, count]) => bar(label, count, maxYer, "#38BDF8"))}
          </div>
          <div style={styles.yearEndTableCard}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#B07FE0", marginBottom: 14 }}>Araç VIN'e Göre Dağılım (İlk 8)</h3>
            {vinData.length === 0 ? <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>Henüz veri yok.</div> : vinData.map(([label, count]) => bar(`#${label}`, count, maxVin, "#B07FE0"))}
          </div>
          {kodData.length > 0 && (
            <div style={{ ...styles.yearEndTableCard, gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: "#F87171", marginBottom: 14 }}>Hata Koduna Göre Dağılım (İlk 8)</h3>
              {kodData.map(([label, count]) => bar(label, count, maxKod, "#F87171"))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
