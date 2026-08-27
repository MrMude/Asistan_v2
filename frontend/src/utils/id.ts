/** Yeni kayıtlar için kısa, bağımlılıksız benzersiz kimlik üretir. */
export const uid = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
