import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { styles } from "../../styles/theme";
import { fmtDate } from "../../utils/date";
import { DAILY_QUOTES, timeGreeting, dayOfYear } from "../../utils/dailyBriefing";
import { Task, User } from "../../types";

interface DailyBriefingModalProps {
  currentUser: Pick<User, "name">;
  overdue: Task[];
  upcoming: Task[];
  onClose: () => void;
}

/** Her gün ilk girişte gösterilen karşılama + geciken/yaklaşan iş özeti. */
export function DailyBriefingModal({ currentUser, overdue, upcoming, onClose }: DailyBriefingModalProps) {
  const quote = DAILY_QUOTES[dayOfYear() % DAILY_QUOTES.length];
  const greeting = timeGreeting();
  const todayLabel = new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 28 }}>☀️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B", marginTop: 6 }}>{greeting}, {currentUser.name.split(" ")[0]}!</h2>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{todayLabel}</div>
        </div>

        <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 14, margin: "16px 0", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontStyle: "italic", color: "#E2E8F0", lineHeight: 1.5 }}>&ldquo;{quote}&rdquo;</div>
        </div>

        {overdue.length > 0 && (
          <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid #EF4444", borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#EF4444", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
              <AlertTriangle size={14} /> {overdue.length} işiniz gecikti
            </div>
            {overdue.slice(0, 4).map((t) => (
              <div key={t.id} style={{ fontSize: 12, color: "#FCA5A5", padding: "2px 0" }}>• {t.baslik} <span style={{ color: "#94A3B8" }}>({fmtDate(t.vade)})</span></div>
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F59E0B", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
              <Clock size={14} /> Önümüzdeki 3 günde vadesi gelecek {upcoming.length} iş
            </div>
            {upcoming.slice(0, 4).map((t) => (
              <div key={t.id} style={{ fontSize: 12, color: "#CBD5E1", padding: "2px 0" }}>• {t.baslik} <span style={{ color: "#94A3B8" }}>({fmtDate(t.vade)})</span></div>
            ))}
          </div>
        )}

        {overdue.length === 0 && upcoming.length === 0 && (
          <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 12, marginBottom: 12 }}>Yaklaşan ya da geciken bir işiniz yok — pano temiz! 🎉</div>
        )}

        <button style={{ ...styles.primaryActionBtn, width: "100%" }} onClick={onClose}>Güne Başla</button>
      </div>
    </div>
  );
}
