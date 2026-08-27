import { api } from "./client";
import { AppModule } from "../types";

export const modulesApi = {
  getAll: () => api.get<AppModule[]>("/modules"),
  replaceAll: (items: AppModule[]) => api.put<AppModule[]>("/modules", items),
};
