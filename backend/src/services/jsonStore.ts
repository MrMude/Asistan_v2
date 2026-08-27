import { promises as fs } from "fs";
import path from "path";
import { SEED_DATA } from "../data";

const SEED_DIR = path.join(__dirname, "..", "data");
const IS_SERVERLESS_READONLY = !!process.env.VERCEL;
const WRITABLE_DIR = IS_SERVERLESS_READONLY ? path.join("/tmp", "karea-data") : SEED_DIR;

let ensureWritableDirPromise: Promise<void> | null = null;

async function ensureWritableDir(): Promise<void> {
  if (!IS_SERVERLESS_READONLY) return;
  if (!ensureWritableDirPromise) {
    ensureWritableDirPromise = (async () => {
      await fs.mkdir(WRITABLE_DIR, { recursive: true });
      await Promise.all(
        Object.entries(SEED_DATA).map(async ([name, data]) => {
          const dest = path.join(WRITABLE_DIR, `${name}.json`);
          try {
            await fs.access(dest);
          } catch {
            await fs.writeFile(dest, JSON.stringify(data, null, 2), "utf-8");
          }
        })
      );
    })();
  }
  return ensureWritableDirPromise;
}

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
    await fs.rename(tmpPath, filePathFor(collection));
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
