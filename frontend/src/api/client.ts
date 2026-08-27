// ---------------------------------------------------------------------------
// api/client.ts — backend ile konuşan tek, düşük seviye katman. Diğer tüm
// api/*.api.ts dosyaları bu fonksiyonları kullanır; böylece kimlik bilgisi
// ekleme, hata formatı, temel URL gibi şeyler tek bir yerde değişir.
// ---------------------------------------------------------------------------

// Geliştirmede boş bırakılırsa Vite'nin proxy'si /api'yi backend'e yönlendirir
// (vite.config.ts). Üretimde (frontend ve backend farklı adreslerde
// barındırıldığında) build sırasında VITE_API_BASE_URL ortam değişkenini
// backend'in tam adresine ayarlayın, ör: VITE_API_BASE_URL=https://api.karea.app/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `İstek başarısız: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // gövde JSON değilse varsayılan mesaj kalır
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
