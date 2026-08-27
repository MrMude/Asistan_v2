import { Zap, RefreshCw, ShieldCheck, CheckSquare, Truck, LucideIcon } from "lucide-react";

// Bilinen modül id'lerine ikon + renk ataması (Admin Panel'de eklenen
// özel modüller burada tanımlı değilse varsayılan ShieldCheck/gri kullanılır).
export const MODULE_META: Record<string, { icon: LucideIcon; color: string }> = {
  asakai: { icon: Zap, color: "#F59E0B" },
  iyilestirme: { icon: RefreshCw, color: "#38BDF8" },
  kalite_guvence: { icon: ShieldCheck, color: "#10B981" },
  kalite_kontrol: { icon: CheckSquare, color: "#A855F7" },
  tedarik_kalite: { icon: Truck, color: "#EC4899" },
};
