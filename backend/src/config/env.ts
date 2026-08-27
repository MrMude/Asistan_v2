import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  // CORS_ORIGIN ayarlanmamışsa "*" (herkese açık) kullanılır — hızlı test
  // için pratiktir. Gerçek/kalıcı kullanımda CORS_ORIGIN'i frontend'inizin
  // tam adresine ayarlayarak kısıtlamanız önerilir.
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
};
