// Bu dosya, 13 veri dosyasını KOD İÇİNE statik olarak import eder (dinamik
// dosya yolu değil). Neden: Vercel'in serverless fonksiyon paketleyicisi,
// hangi dosyaların pakete dahil edileceğine koddaki statik referanslara
// bakarak karar verir; dinamik bir yoldan ("değişken" + ".json") okunan
// dosyaları göremez ve pakete dahil etmez — bu da "dosya bulunamadı"
// çökmesine yol açar. Statik import kullanmak bu sorunu kökten çözer,
// çünkü artık normal bir JavaScript modül bağımlılığı haline gelir.
import users from "./users.json";
import tasks from "./tasks.json";
import todos from "./todos.json";
import chats from "./chats.json";
import notifications from "./notifications.json";
import modules from "./modules.json";
import reports from "./reports.json";
import contacts from "./contacts.json";
import stationData from "./stationData.json";
import uygunsuzluklar from "./uygunsuzluklar.json";
import hataKodlari from "./hataKodlari.json";
import fabrikaAkisi from "./fabrikaAkisi.json";
import depoAkisi from "./depoAkisi.json";

export const SEED_DATA: Record<string, unknown> = {
  users,
  tasks,
  todos,
  chats,
  notifications,
  modules,
  reports,
  contacts,
  stationData,
  uygunsuzluklar,
  hataKodlari,
  fabrikaAkisi,
  depoAkisi,
};
