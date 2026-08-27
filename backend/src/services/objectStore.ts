import { readCollection, writeCollection } from "./jsonStore";

// stationData ({ [istasyonId]: {...} }), fabrikaAkisi ve depoAkisi ({ araclar: [...] })
// dizi değil tekil nesne olarak saklanır — bu yüzden ayrı, daha basit bir servis.
export function makeObjectStoreService<T>(collection: string) {
  return {
    async get(): Promise<T> {
      return readCollection<T>(collection);
    },
    async replace(next: T): Promise<T> {
      return writeCollection(collection, next);
    },
  };
}
