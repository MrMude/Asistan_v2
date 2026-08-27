// ---------------------------------------------------------------------------
// Karea Asistan — paylaşılan veri tipleri (backend tarafı).
// Bu dosyadaki şekiller frontend/src/types/index.ts ile birebir aynı
// tutulmalıdır; ileride bir monorepo'ya geçilirse tek bir "shared" pakete
// taşınabilir.
// ---------------------------------------------------------------------------

export type Role = "admin" | "moderator" | "user";

export interface User {
  id: string;
  username: string;
  // Opsiyonel: backend, frontend'e KESİNLİKLE password alanını göndermez
  // (bkz. auth.controller.ts — { ...user, password: undefined }). Bu alan
  // sadece backend'in kendi iç işlemlerinde ve INITIAL_USERS seed verisinde
  // doludur. NOT: düz metin — gerçek üretimde hash'lenmeli (bkz. README
  // "Bilinen Kısıtlar").
  password?: string;
  name: string;
  role: Role;
  status: "approved" | "pending";
  izinliSekmeler?: string[]; // olmayan/undefined ise "tüm sekmeler açık" anlamına gelir
}

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  module: string;
  kod: string;
  baslik: string;
  sorumlu: string;
  gorevTipi: string;
  ekipUyeleri: string[];
  etiketler?: string[];
  acilisTarihi: string;
  vade: string;
  bitisTarihi: string;
  durum: "acik" | "devam" | "beklemede" | "tamam" | "iptal";
  oncelik: "Düşük" | "Orta" | "Yüksek" | "Kritik" | string;
  subtasks: Subtask[];
}

export interface TodoDevelopment {
  id: string;
  text: string;
  date: string;
}

export interface Todo {
  id: string;
  user: string;
  text: string;
  done: boolean;
  dueDate?: string;
  priority: "Normal" | "Yüksek" | "Kritik";
  subtasks?: Subtask[];
  developments?: TodoDevelopment[];
}

export interface ChatBubble {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export interface ChatThread {
  id: string;
  type: "general" | "direct";
  title: string;
  participants?: string[];
  messages: ChatBubble[];
}

export interface AppNotification {
  id: string;
  user: string;
  text: string;
  read: boolean;
  date: string;
}

export interface AppModule {
  id: string;
  label: string;
}

export interface ReworkEntry {
  id: string;
  text: string;
  tarih: string;
  done: boolean;
  gorsel?: string | null;
}

export interface FormMadde {
  item: string;
  section?: string;
  sonuc: "" | "OK" | "NOK" | "Uygun" | "Uygun Değil" | "NA";
  aciklama: string;
}

export interface VehicleFormResult {
  doldu: boolean;
  tarih: string;
  kontrolEden?: string;
  genelSonuc: "Devam Ediyor" | "Geçti" | "Kaldı";
  nokSayisi: number;
  maddeler: FormMadde[];
  [key: string]: unknown; // form'a özgü ek başlık alanları (vinNo, socBaslangic, vb.)
}

// Kontrol formu modallerinin (EEKontrolModal, FinalKontrolModal,
// VehicleChecklistModal) gerçekte ihtiyaç duyduğu minimal şekil — hem Araç
// Kontrol Takibi'nin Vehicle'ı hem de bağımsız Fabrika/Depo Akışı'nın
// AkisVehicle'ı bu arayüzü doğal olarak karşılar, böylece aynı form
// modalleri her iki alanda da tip hatasız kullanılabilir.
export interface FormableVehicle {
  no: string;
  formVerisi?: Record<string, VehicleFormResult>;
}

export interface Vehicle {
  id: string;
  no: string;
  konum: "fabrika1" | "depo";
  asama: string;
  detay: string;
  tarih: string;
  reworklar: ReworkEntry[];
  formVerisi?: Record<string, VehicleFormResult>;
}

export interface Report {
  id: string;
  seq: number;
  baslik: string;
  tarih: string;
  hazirlayan: string;
  bolum: string;
  sonDurumOzeti?: string;
  araclar: Vehicle[];
}

export interface StationKayit {
  id: string;
  tarih: string;
  kontrolEden: string;
  degerler?: Record<string, { checked?: boolean; torkDeger?: string; markalama?: boolean; metin?: string }>;
  checkedIds?: string[]; // eski kayıtlar (geriye dönük uyum)
  not: string;
  onayDurumu: "bekliyor" | "onaylandi" | "reddedildi";
  onaylayan: string | null;
  onayTarihi: string | null;
  aktarildi?: boolean;
  aktarilmaTarihi?: string | null;
}

export interface StationHata {
  id: string;
  tarih: string;
  saat: string;
  aciklama: string;
  bildiren: string;
  cozuldu: boolean;
}

export interface StationChecklistItem {
  id: string;
  text: string;
  tip?: "check" | "tork" | "metin";
  torkNm?: number | null;
}

export interface StationEntry {
  checklistTemplate: StationChecklistItem[];
  kayitlar: StationKayit[];
  hatalar?: StationHata[];
}

export type StationDataMap = Record<string, StationEntry>;

export type UygunsuzlukDurum = "acik" | "inceleniyor" | "kapatildi";

export interface Uygunsuzluk {
  id: string;
  tarih: string;
  saat: string;
  yer: string;
  aracVin: string;
  aciklama: string;
  tespitEden: string;
  oncelik: "Düşük" | "Orta" | "Yüksek" | "Kritik";
  hataKodu?: string;
  durum: UygunsuzlukDurum;
  aksiyon: string;
  kapatan: string | null;
  kapanmaTarihi: string | null;
  gorsel?: string | null;
  kaynakForm?: string;
  kaynakReworkId?: string;
}

export interface HataKodu {
  id: string;
  kod: string;
  aciklama: string;
}

export interface AkisVehicle {
  id: string;
  no: string;
  istasyonId: string;
  detay: string;
  tarih: string;
  notlar: { id: string; text: string; tarih: string; done: boolean }[];
  formVerisi?: Record<string, VehicleFormResult>;
}

export interface AkisData {
  araclar: AkisVehicle[];
}

// Tüm koleksiyonların adları — JSON dosya deposu ve REST rotaları bu
// isimler üzerinden eşleşir (bkz. services/collections.ts).
export type CollectionName =
  | "users"
  | "tasks"
  | "todos"
  | "chats"
  | "notifications"
  | "modules"
  | "reports"
  | "contacts"
  | "stationData"
  | "uygunsuzluklar"
  | "hataKodlari"
  | "fabrikaAkisi"
  | "depoAkisi";
