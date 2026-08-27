import React from "react";
import { styles } from "../../styles/theme";
import { AppNotification } from "../../types";

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export function NotificationsModal({ notifications, onClose, onMarkAllRead }: NotificationsModalProps) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.createModalContent}>
        <h2>Bildirimler</h2>
        {notifications.map((n) => (
          <div key={n.id} style={{ background: "#0F172A", padding: 8, marginTop: 6, borderRadius: 6, fontSize: 12 }}>{n.text}</div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button style={styles.ghostBtn} onClick={onMarkAllRead}>Okundu İşaretle</button>
          <button style={styles.primaryActionBtn} onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  );
}
