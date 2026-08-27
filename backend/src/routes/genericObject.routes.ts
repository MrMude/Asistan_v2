import { Router } from "express";
import { makeGenericObjectController } from "../controllers/genericObjectController";

/** Nesne tabanlı bir koleksiyon için standart rotaları bağlar. */
export function makeObjectRouter<T>(collection: string): Router {
  const router = Router();
  const c = makeGenericObjectController<T>(collection);

  router.get("/", c.get);
  router.put("/", c.replace);

  return router;
}
