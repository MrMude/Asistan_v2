import { Router } from "express";

import authRoutes from "./auth.routes";
import constantsRoutes from "./constants.routes";
import usersRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes";
import todosRoutes from "./todos.routes";
import chatsRoutes from "./chats.routes";
import notificationsRoutes from "./notifications.routes";
import modulesRoutes from "./modules.routes";
import reportsRoutes from "./reports.routes";
import contactsRoutes from "./contacts.routes";
import stationDataRoutes from "./stationData.routes";
import uygunsuzluklarRoutes from "./uygunsuzluklar.routes";
import hataKodlariRoutes from "./hataKodlari.routes";
import fabrikaAkisiRoutes from "./fabrikaAkisi.routes";
import depoAkisiRoutes from "./depoAkisi.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/constants", constantsRoutes);
router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);
router.use("/todos", todosRoutes);
router.use("/chats", chatsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/modules", modulesRoutes);
router.use("/reports", reportsRoutes);
router.use("/contacts", contactsRoutes);
router.use("/station-data", stationDataRoutes);
router.use("/uygunsuzluklar", uygunsuzluklarRoutes);
router.use("/hata-kodlari", hataKodlariRoutes);
router.use("/fabrika-akisi", fabrikaAkisiRoutes);
router.use("/depo-akisi", depoAkisiRoutes);

export default router;
