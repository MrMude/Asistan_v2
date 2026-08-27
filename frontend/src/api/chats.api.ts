import { api } from "./client";
import { ChatThread } from "../types";

export const chatsApi = {
  getAll: () => api.get<ChatThread[]>("/chats"),
  replaceAll: (chats: ChatThread[]) => api.put<ChatThread[]>("/chats", chats),
};
