import { api } from "./client";
import { Uygunsuzluk } from "../types";

export const uygunsuzluklarApi = {
  getAll: () => api.get<Uygunsuzluk[]>("/uygunsuzluklar"),
  replaceAll: (items: Uygunsuzluk[]) => api.put<Uygunsuzluk[]>("/uygunsuzluklar", items),
};
