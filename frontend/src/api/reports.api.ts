import { api } from "./client";
import { Report } from "../types";

export const reportsApi = {
  getAll: () => api.get<Report[]>("/reports"),
  replaceAll: (items: Report[]) => api.put<Report[]>("/reports", items),
};
