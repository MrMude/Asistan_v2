import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Rota bulunamadı: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error("[hata]", err);
  const message = err instanceof Error ? err.message : "Sunucu hatası";
  res.status(500).json({ error: message });
}
