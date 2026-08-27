import { Request, Response, NextFunction } from "express";
import { makeObjectStoreService } from "../services/objectStore";

/**
 * Nesne tabanlı bir koleksiyon (stationData, fabrikaAkisi, depoAkisi) için:
 *   GET /api/:collection  -> tüm nesne
 *   PUT /api/:collection  -> nesneyi değiştir
 */
export function makeGenericObjectController<T>(collection: string) {
  const service = makeObjectStoreService<T>(collection);

  return {
    get: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(await service.get());
      } catch (err) {
        next(err);
      }
    },
    replace: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(await service.replace(req.body));
      } catch (err) {
        next(err);
      }
    },
  };
}
