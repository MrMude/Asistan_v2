# Karea Asistan — Kalite Yönetim Sistemi

Bu depo, Karea Asistan'ın tek dosyalı (frontend'in doğrudan Firestore'a
bağlandığı) sürümünün **backend + frontend olarak ayrılmış, component'lere
bölünmüş, profesyonel klasör yapılı** halidir. Veriler şimdilik JSON
dosyalarında tutuluyor; `backend/src/services/jsonStore.ts` dosyası
değiştirilerek ileride gerçek bir veritabanına (Postgres, MongoDB vb.)
geçiş yapılabilir — üstündeki hiçbir katman (route/controller/frontend)
değişmeden kalır.

```
karea-fullstack/
├── backend/     Express + TypeScript API sunucusu
└── frontend/    React + TypeScript + Vite arayüzü
```

## Hızlı Başlangıç

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env      # gerekirse portu/CORS adresini düzenleyin
npm run dev                # http://localhost:4000
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

`vite.config.ts` içindeki proxy ayarı sayesinde frontend `/api/...`
isteklerini otomatik olarak `http://localhost:4000`'e yönlendirir — iki
sunucuyu da aynı anda, ayrı terminallerde çalıştırmanız yeterli.

İlk giriş: kullanıcı adı `admin`, şifre `0000` (ilk girişte 4 haneli yeni
şifre belirlemeniz istenecek).

## Mimari

### Backend (`backend/`)

```
src/
├── data/         JSON "veritabanı" dosyaları (13 koleksiyon, gerçek verinizle dolu)
├── types/        Paylaşılan TypeScript arayüzleri
├── constants/    Form maddeleri, aşama tanımları (KY.FR-13/17/18/19 vb.)
├── services/     Dosya okuma/yazma + jenerik CRUD mantığı
├── controllers/  İstek/yanıt işleyicileri (jenerik + auth'a özel)
├── routes/       Her kaynak için ince bir Express router dosyası
├── middleware/   Hata yakalama
├── app.ts        Express app kurulumu (cors, json body, route bağlama)
└── server.ts     Giriş noktası
```

13 koleksiyonun (users, tasks, todos, chats, notifications, modules,
reports, contacts, stationData, uygunsuzluklar, hataKodlari, fabrikaAkisi,
depoAkisi) hepsi aynı jenerik CRUD servis/controller/route fabrikasını
kullanır — kod tekrarı yoktur. `contacts`, `stationData`, `fabrikaAkisi`,
`depoAkisi` dizi değil tekil nesne olduğu için ayrı, daha basit bir
"oku/değiştir" servisi (`objectStore.ts`) kullanır.

`GET /api/constants` — form maddeleri ve aşama tanımları gibi
kullanıcı tarafından CRUD ile değiştirilmeyen statik referans verisini
tek seferde döner; frontend açılışta bunu çekip önbelleğe alır.

### Frontend (`frontend/`)

```
src/
├── api/          Backend'e istek atan ince istemci fonksiyonları (13 modül + auth + constants)
├── types/        Backend ile birebir aynı tutulan paylaşılan tipler
├── constants/    Sadece frontend'e ait navigasyon/izin/renk sabitleri
├── context/      AuthContext (oturum) + AppDataContext (tüm paylaşılan veri)
├── hooks/        usePersistedCollection (backend senkron state), usePermissions
├── styles/       theme.ts — tüm inline stil tanımları tek yerde
├── components/   36 component, alana göre klasörlenmiş:
│   ├── auth/          Giriş, kilit, şifre belirleme ekranları
│   ├── layout/        NavGroup, bildirim modalı
│   ├── dashboard/     Dashboard, günlük özet modalı
│   ├── todo/          To-Do listesi
│   ├── tasks/         Kanban pano, görev modalleri, ekip seçici
│   ├── vehicleFlow/   Araç Kontrol Takibi (raporlar, EE/Final Kontrol formları)
│   ├── fabrikaKontrol/ Fabrika Araç Akışı (8 istasyon)
│   ├── depoKontrol/   Depo Araç Akışı (4 istasyon)
│   ├── uygunsuzluk/   Uygunsuzluk Yönetimi (liste, hata kodları, istatistik)
│   ├── grafik/        Grafik Yönetimi
│   ├── admin/         Admin Panel (kullanıcı/izin/modül yönetimi)
│   └── common/        Birden fazla alanda kullanılan modaller (Rework, Not)
├── App.tsx        Sidebar + routing + üst düzey modaller
└── main.tsx       Giriş noktası (Provider'lar burada sarmalanır)
```

## Veri akışı nasıl çalışıyor?

Eski sistemde her state değişikliği doğrudan Firestore'a yazılıyor ve
`onSnapshot` ile tüm açık sekmelere gerçek zamanlı yansıyordu. Yeni
sistemde:

1. `AppDataProvider` açılışta her koleksiyonu `GET` ile bir kez çeker.
2. Bir component `setTasks(...)` gibi bir setter çağırdığında, hem yerel
   React state güncellenir hem de `usePersistedCollection` hook'u
   otomatik olarak `PUT /api/tasks` ile **tüm diziyi** backend'e geri
   yazar (eski Firestore davranışıyla birebir aynı "state değiştikçe
   tamamını yaz" mantığı).

**Bilinçli sınırlama:** Bu, `onSnapshot`'ın sağladığı gerçek zamanlı
çoklu-kullanıcı senkronizasyonunu (biri bir şey değiştirince herkesin
ekranının anında güncellenmesi) şimdilik sağlamaz — her kullanıcı
kendi sekmesinde çalışır, değişiklik backend'e yazılır ama başkasının
açık sekmesi sayfa yenilenene kadar güncellenmez. Gerçek zamanlı
senkronizasyon istenirse backend'e bir WebSocket veya Server-Sent Events
katmanı eklenmesi gerekir (`app.ts` içine kolayca eklenebilir bir
noktadır).

## Dağıtım (GitHub + Barındırma)

Kod GitHub'a atılabilir (`.gitignore` `node_modules`/`dist`/`.env`'i zaten
hariç tutuluyor). Ama artık **tek bir statik site değil, iki ayrı servis**
barındırmanız gerekiyor.

### Sadece arayüzü test etmek istiyorsanız (veri kalıcı olmasın, hızlıca bakayım)

İkisini de Vercel'de, aynı GitHub reposundan, **iki ayrı Vercel projesi**
olarak kurabilirsiniz — backend'i Railway/Render'a taşımanıza gerek yok:

1. **Backend projesi**: Vercel → Add New Project → aynı repo → **Root
   Directory: `backend`** → Deploy. (`backend/vercel.json` ve
   `backend/api/index.ts` sayesinde Vercel bunu otomatik bir sunucusuz
   fonksiyon olarak tanır, ekstra ayar gerekmez.) Deploy bitince size
   verdiği adresi not edin (ör. `https://karea-backend.vercel.app`).
2. **Frontend projesi**: Vercel → Add New Project → aynı repo → **Root
   Directory: `frontend`** → Environment Variables'a şunu ekleyin:
   `VITE_API_BASE_URL = https://karea-backend.vercel.app/api` → Deploy.

Bu kurulumda backend, verileri **/tmp** klasörüne yazar (kod bunu
otomatik algılar) — yani her "cold start"ta (bir süre kullanılmayıp
tekrar açıldığında) veriler bu repodaki gerçek başlangıç haline sıfırlanır.
Tam istediğiniz şey budur: veri kalıcı olmaz, ama arayüz sorunsuz açılır,
gezinebilir, formları doldurabilir, hiçbir "salt okunur dosya sistemi"
hatası almazsınız.

### Kalıcı/gerçek kullanım için

Yukarıdaki kurulum test amaçlıdır. Ekibiniz gerçekten kullanmaya
başladığında (veriler kaybolmasın istediğinizde), backend'i **Railway**
veya **Render** gibi kalıcı disk sunan bir platforma taşıyın — Root
Directory yine `backend`, Build: `npm install && npm run build`,
Start: `npm start`, ve `CORS_ORIGIN` ortam değişkenini frontend
adresinize ayarlayın. Frontend'i olduğu gibi Vercel'de bırakabilirsiniz,
sadece `VITE_API_BASE_URL`'i yeni backend adresine güncelleyip
redeploy edin.



- **Şifreler düz metin tutuluyor** (eski sistemle birebir aynı davranış).
  Gerçek bir üretim ortamına çıkmadan önce `bcrypt` ile hash'lenmeli ve
  backend'de bir oturum/JWT mekanizması eklenmelidir.
- **Gerçek zamanlı senkronizasyon yok** (yukarıya bakın) — WebSocket/SSE
  eklenmesi önerilir.
- **JSON dosya deposu tek process'e uygundur** — `jsonStore.ts` basit bir
  yazma kuyruğu kullanır ama birden fazla sunucu/process arkasında
  çalıştırılırsa (ör. yatay ölçekleme) gerçek bir veritabanına geçilmesi
  gerekir. Bu geçiş, yalnızca `jsonStore.ts`'in içini değiştirmeyi
  gerektirir — servis/controller/route katmanları aynı arayüzü
  kullanmaya devam eder.
- **Görsel yükleme (rework/uygunsuzluk fotoğrafları)** hâlâ base64 olarak
  JSON içinde saklanıyor (eski sistemle aynı, otomatik küçültülüp
  sıkıştırılıyor). Çok sayıda görsel birikirse bir dosya depolama
  servisine (S3, yerel disk + statik sunum vb.) taşınması önerilir.
- Bu ortamda `npm install` çalıştırılamadığı için (kayıt sunucusuna
  erişim engelliydi) bağımlılıklar gerçek şekilde kurulup
  derlenemedi; kod, taslak tip tanımlarıyla dikkatle statik olarak
  doğrulandı. İlk `npm install` + `npm run dev` sonrası küçük,
  beklenmedik bir uyarı çıkarsa bildirin, hemen düzeltelim.

## Menüden kaldırılan ölü kod

Orijinal tek dosyada artık kullanılmayan (daha önceki bir yeniden
yapılandırmada yerini başka bir view'a bırakmış) şu component'ler bu
yeni yapıya **taşınmadı**: `IstasyonKontrolView`, `IstasyonAracView`,
`FormPlaceholderView`, `DetailedReportView`. Bu bir kayıp değil, bilinçli
bir temizlik — hiçbiri artık hiçbir yerden çağrılmıyordu.
