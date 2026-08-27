import { api } from "./client";
import { User } from "../types";

export const usersApi = {
  getAll: () => api.get<User[]>("/users"),
  replaceAll: (users: User[]) => api.put<User[]>("/users", users),
  create: (user: Partial<User>) => api.post<User>("/users", user),
  update: (id: string, patch: Partial<User>) => api.patch<User>(`/users/${id}`, patch),
  remove: (id: string) => api.delete<void>(`/users/${id}`),
};
