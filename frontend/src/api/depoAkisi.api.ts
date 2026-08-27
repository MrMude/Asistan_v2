import { api } from "./client";
import { AkisData } from "../types";

export const depoAkisiApi = {
  get: () => api.get<AkisData>("/depo-akisi"),
  replace: (data: AkisData) => api.put<AkisData>("/depo-akisi", data),
};
