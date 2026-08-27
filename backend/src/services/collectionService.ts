import { readCollection, writeCollection } from "./jsonStore";
import { uid } from "../utils/id";

// ---------------------------------------------------------------------------
// collectionService — dizi tipindeki (array) koleksiyonlar için (users,
// tasks, todos, chats, notifications, modules, reports, contacts,
// uygunsuzluklar, hataKodlari) jenerik CRUD işlemleri. Nesne tipindeki
// koleksiyonlar (stationData, fabrikaAkisi, depoAkisi) için ayrı, daha basit
// bir "geneli oku / geneli değiştir" yaklaşımı objectStore.ts'de.
// ---------------------------------------------------------------------------

export interface WithId {
  id: string;
}

export function makeArrayCollectionService<T extends WithId>(collection: string) {
  return {
    async getAll(): Promise<T[]> {
      return readCollection<T[]>(collection);
    },

    async getById(id: string): Promise<T | undefined> {
      const all = await readCollection<T[]>(collection);
      return all.find((item) => item.id === id);
    },

    /** Bütün koleksiyonu, frontend'in gönderdiği son haliyle değiştirir. */
    async replaceAll(next: T[]): Promise<T[]> {
      return writeCollection(collection, next);
    },

    async create(input: Partial<T>): Promise<T> {
      const all = await readCollection<T[]>(collection);
      const item = { id: uid(), ...input } as T;
      all.push(item);
      await writeCollection(collection, all);
      return item;
    },

    async update(id: string, patch: Partial<T>): Promise<T | undefined> {
      const all = await readCollection<T[]>(collection);
      const idx = all.findIndex((item) => item.id === id);
      if (idx === -1) return undefined;
      all[idx] = { ...all[idx], ...patch, id } as T;
      await writeCollection(collection, all);
      return all[idx];
    },

    async remove(id: string): Promise<boolean> {
      const all = await readCollection<T[]>(collection);
      const next = all.filter((item) => item.id !== id);
      const removed = next.length !== all.length;
      if (removed) await writeCollection(collection, next);
      return removed;
    },
  };
}
