import { api } from "./client";

export const contactsApi = {
  get: () => api.get<string[]>("/contacts"),
  replace: (items: string[]) => api.put<string[]>("/contacts", items),
};
