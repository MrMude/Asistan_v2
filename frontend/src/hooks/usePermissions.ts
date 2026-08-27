import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { getAllSectionIds } from "../constants/navigation";

/**
 * hasAccess(sectionId) — admin her zaman true; diğer kullanıcılar için
 * izinliSekmeler tanımlı değilse (undefined) varsayılan "tüm sekmeler açık"
 * davranışı korunur, tanımlıysa sadece listedeki id'lere erişim verilir.
 */
export function usePermissions() {
  const { currentUser } = useAuth();
  const { modules } = useAppData();

  const hasAccess = (sectionId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    const allowed = currentUser.izinliSekmeler ?? getAllSectionIds(modules);
    return allowed.includes(sectionId);
  };

  return { hasAccess };
}
