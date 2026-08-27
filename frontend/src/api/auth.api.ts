import { api } from "./client";
import { User } from "../types";

interface LoginResponse {
  requiresPasswordSetup: boolean;
  user: Omit<User, "password">;
}

export const authApi = {
  login: (username: string, password: string) => api.post<LoginResponse>("/auth/login", { username, password }),
  setInitialPassword: (userId: string, newPassword: string) =>
    api.post<{ user: Omit<User, "password"> }>("/auth/set-initial-password", { userId, newPassword }),
};
