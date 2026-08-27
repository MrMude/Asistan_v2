// Dashboard'a girişte gösterilen günlük karşılama modalının (DailyBriefingModal)
// kullandığı statik alıntılar ve zaman bazlı selamlama/gün hesapları.

export const DAILY_QUOTES: string[] = [
  "Kalite, kimse bakmadığında da doğru işi yapmaktır.",
  "Küçük bir hatayı bugün bulmak, yarın büyük bir sorunu önler.",
  "İyi bir ekip, birbirinin açığını değil elini görür.",
  "Ölçmediğin şeyi yönetemezsin — bugün de not almayı unutma.",
  "Bir günü iyi planlamak, bir haftayı kurtarır.",
  "Sorunu gizlemek değil, kök nedenini bulmak çözer.",
  "En iyi kontrol, hatayı üretmeden önce yakalayandır.",
  "Bugün attığın küçük bir adım, yarının standardı olur.",
  "Sürdürülebilir kalite, sabırla kurulan bir alışkanlıktır.",
  "Doğru soru sormak, yarı çözümdür.",
  "Disiplin, motivasyon bittiğinde de işi bitirmektir.",
  "Bir ekip, en yavaş adımı kadar hızlı yürür — birlikte ilerleyin.",
  "Bugün iyi bir gün olacak, çünkü siz onu öyle yapacaksınız.",
  "Detaylara gösterdiğin özen, işinin imzasıdır.",
  "Zor günler, iyi alışkanlıkların sınandığı günlerdir.",
];

export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "İyi geceler";
  if (h < 11) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}
