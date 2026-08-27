import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// usePersistedCollection — orijinal uygulamadaki "state değiştikçe Firestore'a
// tüm diziyi geri yaz" davranışının REST API karşılığı. Açılışta backend'den
// bir kez okur; sonrasında state her değiştiğinde (kullanıcı kaynaklı) tüm
// koleksiyonu PUT ile backend'e yazar.
//
// NOT (bilinçli sınırlama): Orijinal sistem Firestore'un onSnapshot'ı ile
// GERÇEK ZAMANLI çoklu-kullanıcı senkronizasyonu sağlıyordu (biri bir şey
// değiştirince herkesin ekranı anında güncelleniyordu). Bu REST API + JSON
// dosya deposu yaklaşımı bunu şimdilik yapmaz — her kullanıcı kendi
// sekmesinde değişiklik yapar, backend'e yazılır, ama başkasının açık
// sekmesi otomatik güncellenmez (sayfa yenilenince görülür). Gerçek zamanlı
// senkronizasyon istenirse backend'e bir WebSocket/SSE katmanı eklenmesi
// gerekir — bkz. README "Bilinen Kısıtlar ve Sonraki Adımlar".
// ---------------------------------------------------------------------------

export function usePersistedCollection<T>(
  fetcher: () => Promise<T>,
  persister: (value: T) => Promise<T>
) {
  const [value, setValueState] = useState<T | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    fetcher().then((data) => {
      isFirstLoad.current = true;
      setValueState(data);
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded || value === null) return;
    if (isFirstLoad.current) {
      // Az önce backend'den okunan veriyi hemen geri yazmayı önle.
      isFirstLoad.current = false;
      return;
    }
    persister(value).catch((err) => console.error("Kaydedilemedi:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, loaded]);

  const setValue = useCallback((updater: T | ((prev: T) => T)) => {
    setValueState((prev) => {
      const base = prev as T;
      return typeof updater === "function" ? (updater as (p: T) => T)(base) : updater;
    });
  }, []);

  return { value: value as T, setValue, loaded };
}
