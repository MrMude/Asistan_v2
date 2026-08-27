// Vercel'in "/api" klasöründeki dosyaları otomatik olarak sunucusuz
// fonksiyon olarak algılama kuralına göre giriş noktası. Express app'i
// olduğu gibi dışa aktarıyoruz — Vercel'in Node runtime'ı bir Express
// instance'ını doğrudan istek işleyici olarak kabul eder.
import { createApp } from "../src/app";

export default createApp();
