import { Router } from "express";
import { makeGenericArrayController } from "../controllers/genericArrayController";
import { WithId } from "../services/collectionService";

/** Dizi tabanlı bir koleksiyon için standart REST rotalarını bağlar. */
export function makeArrayRouter<T extends WithId>(collection: string): Router {
  const router = Router();
  const c = makeGenericArrayController<T>(collection);

  router.get("/", c.getAll);
  router.get("/:id", c.getById);
  router.put("/", c.replaceAll);
  router.post("/", c.create);
  router.patch("/:id", c.update);
  router.delete("/:id", c.remove);

  return router;
}
