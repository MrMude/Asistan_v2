import { Request, Response, NextFunction } from "express";
import { makeArrayCollectionService } from "../services/collectionService";
import { User } from "../types";

// NOT: Bu, mevcut frontend'deki basit kullanıcı adı/4 haneli şifre akışının
// birebir backend karşılığıdır (bkz. README "Bilinen Kısıtlar" — gerçek bir
// üretim ortamında şifreler asla düz metin tutulmamalı/karşılaştırılmamalı,
// burada mevcut sistemin davranışını değiştirmeden taşımak önceliklendirildi).
const usersService = makeArrayCollectionService<User>("users");

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as { username?: string; password?: string };
      if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre gerekli" });
      }
      const users = await usersService.getAll();
      const found = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      if (!found) {
        return res.status(401).json({ error: "Hatalı Kullanıcı Adı veya Şifre! (İlk giriş şifresi: 0000)" });
      }
      if (found.password === "0000") {
        return res.json({ requiresPasswordSetup: true, user: { ...found, password: undefined } });
      }
      return res.json({ requiresPasswordSetup: false, user: { ...found, password: undefined } });
    } catch (err) {
      next(err);
    }
  },

  /** İlk girişte 4 haneli yeni şifre belirleme. */
  setInitialPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, newPassword } = req.body as { userId?: string; newPassword?: string };
      if (!userId || !newPassword || newPassword.length !== 4 || Number.isNaN(Number(newPassword))) {
        return res.status(400).json({ error: "Lütfen 4 haneli rakam giriniz." });
      }
      const updated = await usersService.update(userId, { password: newPassword } as Partial<User>);
      if (!updated) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      return res.json({ user: { ...updated, password: undefined } });
    } catch (err) {
      next(err);
    }
  },
};
