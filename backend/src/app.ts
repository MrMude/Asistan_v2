import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "10mb" })); // rework/uygunsuzluk görselleri base64 olarak gövdede taşınıyor

  app.get("/health", (_req: express.Request, res: express.Response) => res.json({ status: "ok" }));

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
