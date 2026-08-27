import React, { createContext, useContext, useEffect, useState } from "react";
import { usePersistedCollection } from "../hooks/usePersistedCollection";
import { usersApi } from "../api/users.api";
import { tasksApi } from "../api/tasks.api";
import { todosApi } from "../api/todos.api";
import { chatsApi } from "../api/chats.api";
import { notificationsApi } from "../api/notifications.api";
import { modulesApi } from "../api/modules.api";
import { reportsApi } from "../api/reports.api";
import { contactsApi } from "../api/contacts.api";
import { stationDataApi } from "../api/stationData.api";
import { uygunsuzluklarApi } from "../api/uygunsuzluklar.api";
import { hataKodlariApi } from "../api/hataKodlari.api";
import { fabrikaAkisiApi } from "../api/fabrikaAkisi.api";
import { depoAkisiApi } from "../api/depoAkisi.api";
import { constantsApi, RemoteConstants } from "../api/constants.api";
import {
  User, Task, Todo, ChatThread, AppNotification, AppModule, Report,
  StationDataMap, Uygunsuzluk, HataKodu, AkisData,
} from "../types";

interface AppDataContextValue {
  loaded: boolean;
  constants: RemoteConstants | null;

  usersList: User[]; setUsersList: (v: User[] | ((p: User[]) => User[])) => void;
  tasks: Task[]; setTasks: (v: Task[] | ((p: Task[]) => Task[])) => void;
  todos: Todo[]; setTodos: (v: Todo[] | ((p: Todo[]) => Todo[])) => void;
  chats: ChatThread[]; setChats: (v: ChatThread[] | ((p: ChatThread[]) => ChatThread[])) => void;
  notifications: AppNotification[]; setNotifications: (v: AppNotification[] | ((p: AppNotification[]) => AppNotification[])) => void;
  modules: AppModule[]; setModules: (v: AppModule[] | ((p: AppModule[]) => AppModule[])) => void;
  reports: Report[]; setReports: (v: Report[] | ((p: Report[]) => Report[])) => void;
  contacts: string[]; setContacts: (v: string[] | ((p: string[]) => string[])) => void;
  stationData: StationDataMap; setStationData: (v: StationDataMap | ((p: StationDataMap) => StationDataMap)) => void;
  uygunsuzluklar: Uygunsuzluk[]; setUygunsuzluklar: (v: Uygunsuzluk[] | ((p: Uygunsuzluk[]) => Uygunsuzluk[])) => void;
  hataKodlari: HataKodu[]; setHataKodlari: (v: HataKodu[] | ((p: HataKodu[]) => HataKodu[])) => void;
  fabrikaAkisi: AkisData; setFabrikaAkisi: (v: AkisData | ((p: AkisData) => AkisData)) => void;
  depoAkisi: AkisData; setDepoAkisi: (v: AkisData | ((p: AkisData) => AkisData)) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const users = usePersistedCollection<User[]>(usersApi.getAll, usersApi.replaceAll);
  const tasks = usePersistedCollection<Task[]>(tasksApi.getAll, tasksApi.replaceAll);
  const todos = usePersistedCollection<Todo[]>(todosApi.getAll, todosApi.replaceAll);
  const chats = usePersistedCollection<ChatThread[]>(chatsApi.getAll, chatsApi.replaceAll);
  const notifications = usePersistedCollection<AppNotification[]>(notificationsApi.getAll, notificationsApi.replaceAll);
  const modules = usePersistedCollection<AppModule[]>(modulesApi.getAll, modulesApi.replaceAll);
  const reports = usePersistedCollection<Report[]>(reportsApi.getAll, reportsApi.replaceAll);
  const contacts = usePersistedCollection<string[]>(contactsApi.get, contactsApi.replace);
  const stationData = usePersistedCollection<StationDataMap>(stationDataApi.get, stationDataApi.replace);
  const uygunsuzluklar = usePersistedCollection<Uygunsuzluk[]>(uygunsuzluklarApi.getAll, uygunsuzluklarApi.replaceAll);
  const hataKodlari = usePersistedCollection<HataKodu[]>(hataKodlariApi.getAll, hataKodlariApi.replaceAll);
  const fabrikaAkisi = usePersistedCollection<AkisData>(fabrikaAkisiApi.get, fabrikaAkisiApi.replace);
  const depoAkisi = usePersistedCollection<AkisData>(depoAkisiApi.get, depoAkisiApi.replace);

  const [constants, setConstants] = useState<RemoteConstants | null>(null);
  useEffect(() => {
    constantsApi.getAll().then(setConstants);
  }, []);

  const loaded =
    users.loaded && tasks.loaded && todos.loaded && chats.loaded && notifications.loaded &&
    modules.loaded && reports.loaded && contacts.loaded && stationData.loaded &&
    uygunsuzluklar.loaded && hataKodlari.loaded && fabrikaAkisi.loaded && depoAkisi.loaded &&
    constants !== null;

  const value: AppDataContextValue = {
    loaded,
    constants,
    usersList: users.value, setUsersList: users.setValue,
    tasks: tasks.value, setTasks: tasks.setValue,
    todos: todos.value, setTodos: todos.setValue,
    chats: chats.value, setChats: chats.setValue,
    notifications: notifications.value, setNotifications: notifications.setValue,
    modules: modules.value, setModules: modules.setValue,
    reports: reports.value, setReports: reports.setValue,
    contacts: contacts.value, setContacts: contacts.setValue,
    stationData: stationData.value, setStationData: stationData.setValue,
    uygunsuzluklar: uygunsuzluklar.value, setUygunsuzluklar: uygunsuzluklar.setValue,
    hataKodlari: hataKodlari.value, setHataKodlari: hataKodlari.setValue,
    fabrikaAkisi: fabrikaAkisi.value, setFabrikaAkisi: fabrikaAkisi.setValue,
    depoAkisi: depoAkisi.value, setDepoAkisi: depoAkisi.setValue,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData, AppDataProvider içinde kullanılmalı");
  return ctx;
}
