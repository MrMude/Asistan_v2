import { promises as fs } from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// jsonStore — en alt seviye "veritabanı" katmanı.
//
// Şimdilik her koleksiyon <SEED_DIR>/<isim>.json dosyasında tutuluyor.
// İleride gerçek bir veritabanına (Postgres/Mongo vb.) geçilmek istendiğinde,
// sadece BU dosyanın içi değişir — services/collectionService.ts ve üstündeki
// hiçbir katman (controller/route) değişmeden kalır.
//
// Vercel notu: Vercel'in serverless fonksiyonlarında proje dosyaları
// SALT OKUNURDUR — sadece /tmp yazılabilir, ve /tmp her "cold start"ta
// sıfırlanır (kalıcı değildir). Bu, "sadece arayüzü test ediyorum, veri
// kalıcı olmasın" senaryosu için tam uygundur: process.env.VERCEL
// tanımlıysa yazılabilir bir kopya /tmp'ye bir kerelik kopyalanır, oradan
// okunup yazılır; her yeni cold start'ta veriler seed haline (bu repodaki
// gerçek verilerinize) sıfırlanır, ama uygulama asla "salt okunur dosya
// sistemi" hatasıyla çökmez. Gerçek/kalıcı kullanım için backend'i
// Railway/Render gibi kalıcı disk sunan bir platforma taşıyın (bkz. README).
// ---------------------------------------------------------------------------

const SEED_DIR = path.join(__dirname, "..", "data");
const IS_SERVERLESS_READONLY = !!process.env.VERCEL;
const WRITABLE_DIR = IS_SERVERLESS_READONLY ? path.join("/tmp", "karea-data") : SEED_DIR;

let ensureWritableDirPromise: Promise<void> | null = null;

/** Vercel'de: /tmp/karea-data klasörünü, henüz yoksa seed JSON'larından bir kerelik oluşturur. */
async function ensureWritableDir(): Promise<void> {
  if (!IS_SERVERLESS_READONLY) return;
  if (!ensureWritableDirPromise) {
    ensureWritableDirPromise = (async () => {
      await fs.mkdir(WRITABLE_DIR, { recursive: true });
      const seedFiles = await fs.readdir(SEED_DIR);
      await Promise.all(
        seedFiles.map(async (file: string) => {
          const dest = path.join(WRITABLE_DIR, file);
          try {
            await fs.access(dest);
          } catch {
            await fs.copyFile(path.join(SEED_DIR, file), dest);
          }
        })
      );
    })();
  }
  return ensureWritableDirPromise;
}

// Aynı dosyaya eşzamanlı yazmaları sıraya koymak için koleksiyon başına
// basit bir "kuyruk" (mutex yerine promise zinciri). Tek process'lik bir
// Node sunucusu için yeterlidir; çoklu process'e çıkılırsa gerçek bir
// veritabanının satır/doküman kilitleme mekanizmasına geçilmelidir.
const writeQueues = new Map<string, Promise<unknown>>();

function filePathFor(collection: string): string {
  return path.join(WRITABLE_DIR, `${collection}.json`);
}

export async function readCollection<T>(collection: string): Promise<T> {
  await ensureWritableDir();
  const raw = await fs.readFile(filePathFor(collection), "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeCollection<T>(collection: string, data: T): Promise<T> {
  const run = async () => {
    await ensureWritableDir();
    const tmpPath = filePathFor(collection) + ".tmp";
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpPath, filePathFor(collection)); // atomik değiştirme
    return data;
  };

  const previous = writeQueues.get(collection) ?? Promise.resolve();
  const next = previous.then(run, run);
  writeQueues.set(collection, next);
  return next as Promise<T>;
}

export async function collectionExists(collection: string): Promise<boolean> {
  try {
    await ensureWritableDir();
    await fs.access(filePathFor(collection));
    return true;
  } catch {
    return false;
  }
}
