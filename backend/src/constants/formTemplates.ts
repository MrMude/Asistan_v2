// Kalite kontrol formlarının gerçek madde listeleri — bu dosya
// KY.FR-17 (EE Kontrol Depo), KY.FR-18 (EE Kontrol Fabrika/Şube),
// KY.FR-19 (Final Kalite Kontrol) ve KY.FR-13 (EOL Sürüş Test Kartı)
// formlarından üretilmiştir.

export interface FormSection { title: string; items: string[]; }

export const EE_KONTROL_ITEMS: string[] = [
  "Sağ Sol Dönüş Sinyali",
  "Gündüz Farı Kontrol",
  "Licance Plate Kontrol",
  "Low Beam",
  "High Beam",
  "FOG Light",
  "Reverse Gear Light",
  "Reverse Radar",
  "Reverse Park Sensor",
  "Hand Brake",
  "Sağ Sol Cam Açma Kapama",
  "Sağ Sol Kapı Kilit Sistemi Kontrol",
  "Arka Bagaj Kilit Sistemi Kontrol",
  "Dashboard Dörtlü Sinyal Kontrol",
  "Dashboard Kilit Butonu Kontrol",
  "Wiper System Kontrol Speed 1 / Speed 2",
  "Washer system control",
  "HVAC Blower Kotnrol",
  "HVAC PTC Isıtıcı",
  "HVAC A/C Kontrol",
  "HVAC Kanal Değişimi Kontrol",
  "Vites Geçiş Kontrolleri (P/R/N/D)",
  "Vakum Pompası Vakum Booster Kontrol",
  "Speaker Kontrol",
  "Araç Şarj Testi",
  "Araç Sürüş Testi",
  "Regenerative Brake Testi On Off",
  "ECO SPORT Mode Geçiş Kontrol"
];

export const EE_KONTROL_SUBE_SECTIONS: FormSection[] = [
  {
    "title": "Kontrol Ünitesi",
    "items": [
      "EPS (CAL) Güncellendi mi?",
      "VCU Domain SW Güncellendi mi?",
      "VCU GW SW Güncellendi mi?",
      "BMS SW Güncellendi mi?",
      "MCU SW Güncellendi mi?",
      "MHU SW Güncellendi mi?",
      "BCM SW Güncellendi mi?",
      "VCU VIN Güncellemesi Güncellendi mi?"
    ]
  },
  {
    "title": "Kontrol Edilecek",
    "items": [
      "Sağ Sol Dönüş Sinyali",
      "Gündüz Farı Kontrol",
      "Licance Plate Kontrol",
      "Low Beam",
      "High Beam",
      "FOG Light",
      "Reverse Gear Light",
      "Reverse Radar",
      "Reverse Park Sensor",
      "Hand Brake",
      "Sağ Sol Cam Açma Kapama",
      "Sağ Sol Kapı Kilit Sistemi Kontrol",
      "Arka Bagaj Kilit Sistemi Kontrol",
      "Dashboard Dörtlü Sinyal Kontrol",
      "Dashboard Kilit Butonu Kontrol",
      "Wiper System Kontrol Speed 1 / Speed 2",
      "Washer system control",
      "HVAC Blower Kotnrol",
      "HVAC PTC Isıtıcı",
      "HVAC A/C Kontrol",
      "HVAC Kanal Değişimi Kontrol",
      "Vites Geçiş Kontrolleri (P/R/N/D)",
      "Vakum Pompası Vakum Booster Kontrol",
      "Speaker Kontrol",
      "Araç Şarj Testi",
      "Araç Sürüş Testi",
      "Regenerative Brake Testi On Off",
      "ECO SPORT Mode Geçiş Kontrol"
    ]
  },
  {
    "title": "Ground Resistance Ölçümü",
    "items": [
      "MCU Ground Resistance (< 0.1 Ω @ ≥0.2A)",
      "e-Motor Ground Resistance (< 0.1 Ω @ ≥0.2A)",
      "3in1 Ground Resistance (< 0.1 Ω @ ≥0.2A)",
      "AC Ground Resistance (< 0.1 Ω @ ≥0.2A)",
      "HV Battery Ground Resistance (< 0.1 Ω @ ≥0.2A)"
    ]
  },
  {
    "title": "Connector Resistance Ölçümü",
    "items": [
      "Battery Connector (+) (>500 Ω/V, Karea Fit: >50.000 Ω)",
      "Battery Connector (-) (>500 Ω/V, Karea Fit: >50.000 Ω)",
      "3 in 1 PTC Connector (+) (>500 Ω/V, Karea Fit: >50.000 Ω)",
      "3 in 1 PTC Connector (-) (>500 Ω/V, Karea Fit: >50.000 Ω)",
      "3 in 1 AC Connector (+) (>500 Ω/V, Karea Fit: >50.000 Ω)",
      "3 in 1 AC Connector (-) (>500 Ω/V, Karea Fit: >50.000 Ω)"
    ]
  }
];

export const FINAL_KONTROL_SECTIONS: FormSection[] = [
  {
    "title": "KIMLIK & EVRAK",
    "items": [
      "Şasi ve seri numarası okunaklı ve doğru",
      "Model ve versiyon etiketi doğru",
      "Sevkiyat evrakları, irsaliye ve teslim formu hazır",
      "Kullanım kılavuzu ve garanti dokümanı mevcut",
      "Anahtar, uzaktan kumanda ve aksesuar seti tam"
    ]
  },
  {
    "title": "DIŞ GÖRÜNÜŞ",
    "items": [
      "Boya yüzeyi homojen, portakal kabuğu, akma ve kabarcık yok",
      "Çizik, göçük ve deformasyon yok",
      "Keskin kenar ve çapak yok",
      "Panel boşlukları dengeli ve simetrik",
      "Logolar ve etiketler düzgün yapışmış ve hizalı",
      "Cam ve pleksi yüzeylerde çatlak veya kırık yok",
      "Silecekler ve cam suyu sistemi tam fonksiyonlu çalışıyor",
      "Aynalar sorunsuz ayarlanabiliyor",
      "Far konumlandırması"
    ]
  },
  {
    "title": "KAPILAR",
    "items": [
      "Kapılar düzgün kapanıyor ve açılıyor",
      "Cam açma ve kapama mekanizmaları sorunsuz çalışıyor",
      "Kapı menteşe bağlantıları sağlam ve gevşeklik yok",
      "Kapı kilit mekanizması çalışıyor",
      "Kapı fitilleri düzgün ve kopuk değil",
      "Kapı boşluk ve hiza uyumu standartlar dahilinde"
    ]
  },
  {
    "title": "İÇ DONANIM",
    "items": [
      "Koltuklar sabit ve sağlam",
      "Emniyet kemerleri mevcut ve mekanizması çalışır durumda",
      "Trim parçalarında kırık ve çatlak yok",
      "Keskin kenar ve dışarı çıkan vida yok",
      "Klima ve havalandırma sistemi fonksiyonel çalışıyor",
      "Multimedya ve bilgi ekranları sorunsuz çalışıyor",
      "Pedallar, kollar ve mandallar serbest hareket ediyor"
    ]
  },
  {
    "title": "MEKANIK",
    "items": [
      "Tekerlek bijonları sabit ve gevşeklik yok",
      "Lastiklerde hasar yok ve basınç seviyeleri uygun",
      "Süspansiyon bağlantılarında gevşeklik yok",
      "Direksiyon boşluğu standart limitler dahilinde",
      "Fren sistemi statik olarak çalışıyor",
      "Fren hortum ve hatlarında sıvı kaçağı yok",
      "Alt takımda sürtme ve temas izi yok"
    ]
  },
  {
    "title": "ELEKTRIK",
    "items": [
      "Kontak ve ana güç sistemi çalışıyor",
      "Kısa ve uzun farlar çalışıyor",
      "Sağ ve sol sinyaller çalışıyor",
      "Stop lambaları çalışıyor",
      "Geri vites ikaz sistemi çalışıyor",
      "Korna ve dış uyarı sesi çalışıyor",
      "Gösterge paneli uyarı ışıkları eksiksiz çalışıyor",
      "Şarj soketi ve koruyucu kapağı sağlam"
    ]
  },
  {
    "title": "FONKSIYON",
    "items": [
      "İleri ve geri hareket komutu doğru",
      "Hızlanma tepkisi standartlara uygun",
      "Rejeneratif ve elektronik frenleme normal",
      "Park freni sistemi çalışıyor"
    ]
  },
  {
    "title": "YOL TESTI",
    "items": [
      "Düz yolda doğrusal ilerleme sağlanıyor",
      "Frenleme sırasında araca sapma etkisi yok",
      "Dönüşlerde anormal mekanik ses yok",
      "Titreşim ve rezonans değerleri standartlar dahilinde",
      "Sürüş sırasında panelde uyarı veya arıza ışığı yanmıyor"
    ]
  },
  {
    "title": "SEVKIYAT",
    "items": [
      "Araç iç ve dış temizliği sevk standartlarına uygun",
      "Koruyucu ambalaj ve kaplama doğru uygulanmış",
      "Sevkiyat etiketi ve yönlendirme işaretleri uygun",
      "Şarj seviyesi son kullanıcı teslimatı için yeterli seviyede",
      "Odo Kontrol"
    ]
  }
];

export const SURUS_TEST_SECTIONS: FormSection[] = [
  {
    "title": "Soğuk Sıkma Testi",
    "items": [
      "N'de aracı ittir — Anormal direnç var mı?",
      "D'de gaz ver — Araç normal hızlanıyor mu? Sıkma hissi veya anormal ses var mı?",
      "R'de gaz ver — Geri viteste normal hızlanıyor mu? Sıkma hissi veya anormal ses var mı?"
    ]
  },
  {
    "title": "BCM / EE Fonksiyon Kontrolü",
    "items": [
      "Dış aydınlatma — Kısa, uzun, selektör, park, sis, sol/sağ sinyal, dörtlü, stop, geri vites lambası.",
      "Korna — Ses seviyesi ve çalışması normal mi?",
      "Camlar — Tüm camlar açılıp kapanıyor mu? Takılma, yavaşlık veya ses var mı?",
      "Merkezi kilit & kapılar — İçeriden ve anahtarla dışarıdan kilitle-aç. Her kapıda doğru çalışıyor mu?",
      "Aynalar & iç donanım — Aynalar, IP kapakları, emniyet kemeri kapakları, düğmeler ve trim parçaları normal mi?",
      "Emniyet kemerleri — Tokalar çalışıyor mu? Kemer düzgün sarıyor mu? Uyarı sesi/ikonu doğru mu?",
      "El freni (KRİTİK) — El frenini çek → hafif gaz ver → araç ilerlemeye çalışıyor mu? Kayma varsa video + SOC% + saat.",
      "Vites seçimi — P/R/N/D geçişlerinde gecikme, yanlış gösterim veya kararsızlık var mı?",
      "Ana ekran / menüler — Tüm menülerde düğmelere tek tek bas. Donma, sıfırlanma veya gecikme var mı?",
      "Geri görüş kamerası — R'ye alınca görüntü geliyor mu? Görüntü temiz mi?",
      "Klima & havalandırma — Fan 1-2-3, yüze/cama üfleme, iç hava dolaşımı, A/C, ısıtma/soğutma.",
      "Odometre — Sürüş öncesi değeri not et. Sürüş sonrası doğru sayıyor mu? Aracı kapatıp açınca kaldığı yerden devam ediyor mu?"
    ]
  },
  {
    "title": "Sürüş Testi (~3.500m Sabit Güzergah)",
    "items": [
      "Düşük hız — 500m, 0→30 km/s. Titreme, silkelenme, anormal ses, çekişte kararsızlık var mı? Trim/tavan/torpido/kapı/cam sesi var mı?",
      "Fren — 30→0 x5 (~300m). Her frenlemede sağa/sola ekstrem çekme var mı? Anormal pedal, ses veya titreşim var mı?",
      "Sürekli frenleme — Dur-kalk min. 20x (~600m). Pedal sertleşmesi/boşalması, performans düşüşü veya koku var mı?",
      "Fren — 50→0 x5 (~400m). Her frenlemede sağa/sola ekstrem çekme var mı? Anormal pedal, ses, titreşim veya koku var mı?",
      "Fren — 90→0 / 80→0 / 70→0 (~500m). Her frenlemede sağa/sola ekstrem çekme var mı? Performans düşüşü veya koku var mı?",
      "Son hıza ulaşma (~600m) — ECO modda 90 km/s'ye ulaşıyor mu? SPORT modda 90 km/s'ye ulaşıyor mu?",
      "Yokuş çıkış + iniş (~400m) — Çıkışta geri kaçırma, çekiş düşmesi var mı? İnişte rejen açık/kapalı davranışı normal mi?",
      "Yokuş el freni (KRİTİK) — Yokuşta en az 6 kez kaydır-tut. El freni çek → hafif gaz → kayıyor mu? Kayma varsa video + SOC% + saat.",
      "N'de yokuş fren testi (~100m) — Yokuş aşağı N'de fren yap, bırak. Araç kendi kendine hareket ediyor mu?"
    ]
  },
  {
    "title": "Fren Onay",
    "items": [
      "Düşük hız fren genel — 30→0 testlerinde tutarlı performans sağlandı mı?",
      "Orta hız fren genel — 50→0 testlerinde tutarlı performans sağlandı mı?",
      "Yüksek hız fren genel — 90/80/70→0 testlerinde tutarlı performans sağlandı mı?",
      "FRENLERDE SIKMA VAR MI? (KRİTİK) — Anormal direnç, tek taraflı ısınma, koku veya sürtünme hissi var mı? Varsa video + foto + saat.",
      "Nihai Fren Onayı — Tüm fren testleri tamamlandı, anormal bulgu yok mu?"
    ]
  },
  {
    "title": "Rot Onay",
    "items": [
      "Rot ayarı — Düz/eğimsiz yolda direksiyonu bırak. Araç sola veya sağa çekiyor mu?",
      "Direksiyon merkezi — Düz gidişte direksiyon tam ortada mı? Belirgin sapma varsa foto + not al.",
      "Yüksek hızda kararlılık — 70-90 km/s'de araç düz gidiyor mu? Çekme veya titreşim var mı?"
    ]
  },
  {
    "title": "Sıcak Sıkma Testi (Sürüş Sonrası)",
    "items": [
      "Sol ön disk — Elini yaklaştır (dokunma). Diğer disklere kıyasla belirgin sıcak mı? Sıcaksa sıkma şüphesi; foto + not al.",
      "Sağ ön disk — Aynı kontrol. Belirgin şekilde sıcak mı?",
      "Sol arka disk — Aynı kontrol. Belirgin şekilde sıcak mı?",
      "Sağ arka disk — Aynı kontrol. Belirgin şekilde sıcak mı?",
      "N'de aracı ittir — Soğuk teste kıyasla artan direnç var mı? Isınma ile kötüleşiyorsa sıkma kesindir."
    ]
  },
  {
    "title": "Mühendis & Kalite Kontrolü",
    "items": [
      "Kapı / Kaput ayarı — Görsel kontrol. Fotoğraf ilet.",
      "Boya kalitesi — Görsel kontrol. Fotoğraf ilet.",
      "Trim & Bagaj — İç trim, dış trim düzgün mü? Bagaj yüksekliği doğru mu?",
      "Tam dönüş kontrolü — Düşük hızda tam sağ/sol manevra. Sürtme, vuruntu veya aks sesi var mı?",
      "DTC / Diyagnostik tarama — Aktif veya geçmiş hata varsa kayıt altına al. Tarama bitiş saatini not et.",
      "Mühendis Nihai Onayı"
    ]
  }
];
