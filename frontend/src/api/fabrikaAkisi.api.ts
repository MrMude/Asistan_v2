import { api } from "./client";
import { AkisData } from "../types";

export const fabrikaAkisiApi = {
  get: () => api.get<AkisData>("/fabrika-akisi"),
  replace: (data: AkisData) => api.put<AkisData>("/fabrika-akisi", data),
};
