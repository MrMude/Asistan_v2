import { api } from "./client";
import { Todo } from "../types";

export const todosApi = {
  getAll: () => api.get<Todo[]>("/todos"),
  replaceAll: (todos: Todo[]) => api.put<Todo[]>("/todos", todos),
};
