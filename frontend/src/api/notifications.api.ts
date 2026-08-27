import { api } from "./client";
import { AppNotification } from "../types";

export const notificationsApi = {
  getAll: () => api.get<AppNotification[]>("/notifications"),
  replaceAll: (items: AppNotification[]) => api.put<AppNotification[]>("/notifications", items),
};
