import { api } from "./client";
import { HataKodu } from "../types";

export const hataKodlariApi = {
  getAll: () => api.get<HataKodu[]>("/hata-kodlari"),
  replaceAll: (items: HataKodu[]) => api.put<HataKodu[]>("/hata-kodlari", items),
};
