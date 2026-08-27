import React from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { styles } from "../../styles/theme";

interface NavGroupProps {
  label: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function NavGroup({ label, icon: Icon, isOpen, onToggle, children }: NavGroupProps) {
  return (
    <div>
      <button style={styles.navGroupHeader} onClick={onToggle}>
        <Icon size={15} color="#94A3B8" />
        <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
        <ChevronDown size={13} color="#64748B" style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s" }} />
      </button>
      {isOpen && <div style={styles.navGroupBody}>{children}</div>}
    </div>
  );
}
