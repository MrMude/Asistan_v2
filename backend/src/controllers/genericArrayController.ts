import { Request, Response, NextFunction } from "express";
import { makeArrayCollectionService, WithId } from "../services/collectionService";

/**
 * Dizi tabanlı bir koleksiyon için standart REST uç noktalarını üretir:
 *   GET    /api/:collection        -> tüm liste
 *   GET    /api/:collection/:id    -> tek kayıt
 *   PUT    /api/:collection        -> tüm listeyi değiştir (frontend'in
 *                                      "her state değişiminde bütün diziyi
 *                                      gönder" davranışıyla uyumlu)
 *   POST   /api/:collection        -> yeni kayıt ekle
 *   PATCH  /api/:collection/:id    -> tek kaydı kısmen güncelle
 *   DELETE /api/:collection/:id    -> tek kaydı sil
 */
export function makeGenericArrayController<T extends WithId>(collection: string) {
  const service = makeArrayCollectionService<T>(collection);

  return {
    getAll: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(await service.getAll());
      } catch (err) {
        next(err);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await service.getById(req.params.id);
        if (!item) return res.status(404).json({ error: "Kayıt bulunamadı" });
        res.json(item);
      } catch (err) {
        next(err);
      }
    },

    replaceAll: async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!Array.isArray(req.body)) {
          return res.status(400).json({ error: "Gövde bir dizi olmalıdır" });
        }
        res.json(await service.replaceAll(req.body));
      } catch (err) {
        next(err);
      }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(201).json(await service.create(req.body));
      } catch (err) {
        next(err);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const updated = await service.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: "Kayıt bulunamadı" });
        res.json(updated);
      } catch (err) {
        next(err);
      }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const removed = await service.remove(req.params.id);
        if (!removed) return res.status(404).json({ error: "Kayıt bulunamadı" });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
