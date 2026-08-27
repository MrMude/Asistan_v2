/** Frontend'deki uid() üretecine eşdeğer, bağımlılıksız kısa benzersiz kimlik üretici. */
export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
