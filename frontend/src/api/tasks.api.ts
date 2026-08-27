import { api } from "./client";
import { Task } from "../types";

export const tasksApi = {
  getAll: () => api.get<Task[]>("/tasks"),
  replaceAll: (tasks: Task[]) => api.put<Task[]>("/tasks", tasks),
  create: (task: Partial<Task>) => api.post<Task>("/tasks", task),
  update: (id: string, patch: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, patch),
  remove: (id: string) => api.delete<void>(`/tasks/${id}`),
};
