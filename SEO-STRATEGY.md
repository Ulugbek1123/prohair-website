# ProHair va O‘zSTTA Veb-Sayti Uchun To‘liq SEO Strategiyasi va Yo‘l Xaritasi

Ushbu hujjat **prohair.uz** (va unga tegishli sahifalar) qidiruv tizimlarida (**Google**, **Yandex**) yuqori o‘rinlarni egallashi, organik tashrif buyuruvchilar sonini oshirishi hamda ijtimoiy tarmoqlarda (Telegram, Instagram, Facebook) professional ko‘rinishga ega bo‘lishi uchun ishlab chiqilgan amaliy qo‘llanmadir.

---

## 1. Joriy Holat Tahlili (SEO Audit)

| Yo‘nalish | Joriy Holat | Muammo / Kamchilik | Yechim |
| :--- | :--- | :--- | :--- |
| **Sitemap** | Mavjud emas | Google va Yandex yangi va mavjud sahifalarni to‘liq topolmaydi | Barcha yo‘llar kiritilgan `sitemap.xml` yaratish |
| **Robots.txt** | Standart ochiq | `/admin` va `/api` yo‘llari botlar uchun ochiq qolgan | `/admin` va `/api` ni `Disallow` qilish, sitemap havolasini qo‘shish |
| **OpenGraph Rasmi** | Yo‘q (`og:image`) | Telegram/WhatsApp/Facebookda havola tashlanganda rasm chiqmaydi | 1200x630 o‘lchamli professional poster (`og:image`) ulash |
| **Strukturalangan Ma’lumotlar** | Mavjud emas | Google Event Snippet va FAQ accordion chiqmaydi | Schema.org (JSON-LD) mikroformatlarini joriy qilish |
| **Canonical Teglari** | Yo‘q | Dublikat kontent xavfi bor | Har bir sahifaga `<link rel="canonical">` qo‘shish |
| **Search Console & Webmaster** | Ulanmagan | Qidiruv so‘rovlari va indekslanish holati ko‘rinmaydi | Google Search Console va Yandex Webmasterga ulash |

---

## 2. Texnik SEO (Technical SEO)

### 2.1. Mukammal `robots.txt`
`public/robots.txt` quyidagi ko‘rinishda bo‘lishi lozim:
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

# Foydali botlar
User-agent: Googlebot
Allow: /

User-agent: Yandex
Allow: /

# Sitemap joylashuvi
Sitemap: https://prohair.uz/sitemap.xml
```

### 2.2. `sitemap.xml` Strukturasi
Har bir ommaviy sahifaning ustuvorligi (`priority`) va yangilanish chastotasi (`changefreq`):
- `/` — Bosh sahifa (Priority: 1.0, daily)
- `/prohair-2027` — Bo‘lajak III Xalqaro Kongress (Priority: 0.95, weekly)
- `/prohair-2026` — II Xalqaro Kongress (Priority: 0.9, weekly)
- `/association` — O‘zSTTA Assotsiatsiyasi haqida (Priority: 0.8, monthly)
- `/events` — Tadbirlar va anjumanlar (Priority: 0.8, weekly)
- `/education` — Trixologiya ta’lim kurslari (Priority: 0.8, monthly)
- `/contacts` — Bog‘lanish va manzil (Priority: 0.7, monthly)

---

## 3. OpenGraph va Ijtimoiy Tarmoqlar (Social SEO)

Foydalanuvchilar veb-sayt havolasini **Telegram**, **Instagram**, **Facebook**, **LinkedIn** orqali ulashganda jozibador ko‘rinishini ta’minlash:
- `og:image`: Kamida 1200x630 piksel o‘lchamdagi yuqori sifatli banner (kongress logotipi va sarlavhasi bilan).
- `og:title`: Aniq va diqqatni tortuvchi sahifa sarlavhasi.
- `og:description`: 2 jumlali aniq va tushunarli tavsif.
- `twitter:card`: `summary_large_image` parametri.

---

## 4. Schema.org (JSON-LD) Strukturaviy Ma’lumotlar

Google va Yandex sahifaning nima haqida ekanligini yaxshiroq tushunishi uchun maxsus skriptlar:

### A. Assotsiatsiya uchun (`MedicalOrganization`):
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "O‘zSTTA — O‘zbekiston Trixologiya Assotsiatsiyasi",
  "alternateName": "Uzbekistan Trichology Association",
  "url": "https://prohair.uz",
  "logo": "https://prohair.uz/logo.png",
  "telephone": "+998 77 300 30 80",
  "email": "info@prohair.uz",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "UZ",
    "addressLocality": "Tashkent"
  }
}
```

### B. Kongress uchun (`Event`):
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "PROHAIR 2026 — II Международный Конгресс по Трихологии",
  "startDate": "2026-09-04T09:00",
  "endDate": "2026-09-05T19:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "Mövenpick Hotel Samarkand",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Самарканд",
      "addressCountry": "Узбекистан"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "O‘zSTTA",
    "url": "https://prohair.uz"
  }
}
```

### C. Tez-tez beriladigan savollar uchun (`FAQPage`):
Google qidiruv natijalarida sahifa tagida to‘g‘ridan-to‘g‘ri savol-javob akkordeoni paydo bo‘lishini ta’minlaydi.

---

## 5. On-Page SEO va Kalit So‘zlar (Semantika)

### Asosiy Qidiruv So‘rovlari (Keywords):
1. **O‘zbek tilida:**
   - *Trixologiya O‘zbekiston*, *Trixolog shifokor Toshkent*, *Soch to‘kilishini davolash*, *Soch ekish O‘zbekiston*, *PROHAIR kongress*, *O‘zSTTA a’zolik*.
2. **Rus tilida (Yuqori talabga ega):**
   - *Трихология Узбекистан*, *Трихолог Ташкент*, *Конгресс трихологов 2026*, *Пересадка волос Ташкент*, *Лечение алопеции Узбекистан*, *PROHAIR конгресс*, *Ассоциация трихологов O‘zSTTA*.
3. **Ingliz tilida:**
   - *Trichology Congress Uzbekistan*, *PROHAIR 2026 Tashkent Samarkand*, *Hair restoration conference Central Asia*.

### Sarlavhalar Qoidasi:
- Har bir sahifada faqat **bitta `<h1>`** bo‘lishi shart.
- `<h2>` va `<h3>` larda kalit so‘zlar tabiiy holda ishlatilishi zarur.
- Barcha rasmlarda ma’noli `alt` atributi bo‘lishi lozim (Google Images uchun).

---

## 6. Qidiruv Tizimlari Bilan Integratsiya

1. **Google Search Console (GSC):**
   - https://search.google.com/search-console orqali domenni qo‘shish.
   - `sitemap.xml` havolasini yuborish.
   - Indekslash holati, sahifalar tezligi va qidiruv so‘rovlarini kuzatib borish.
2. **Yandex Webmaster:**
   - https://webmaster.yandex.ru orqali saytni ulash.
   - O‘zbekiston mintaqasini belgilash (Geotargeting).
   - "Турбо-страницы" yoki IndexNow orqali tezkor indekslashni yoqish.
3. **Google Business Profile (Google Xaritalar):**
   - Tashkilotning rasmiy manzilini Google Maps ga kiritish.
   - Telefon, sayt manzili, ish vaqti va klinika fotosuratlarini joylash. Bu lokal (mahalliy) qidiruvda 1-o‘ringa chiqish garovidir.

---

## 7. Admin Panelda SEO Imkoniyatlari

Admin panelimizdagi mavjud analitika imkoniyatlarini quyidagicha kengaytirish tavsiya etiladi:
1. **Botlar Tashrifi Kuzatuvi (Bot Analytics):**
   - `analytics_pageviews` jadvaliga Googlebot, YandexBot, Bingbot tashriflarini qayd etish va qachon qaysi sahifani indekslaganini admin panelda ko‘rish.
2. **Meta Teglar Boshqaruvi:**
   - Admin orqali sahifalar sarlavhasi (Title) va tavsifini (Meta Description) kodga kirmasdan o‘zgartirish imkoniyati.
3. **Sitemap Yangilanishi:**
   - Saytga yangi tadbir yoki ma’ruza qo‘shilganda `sitemap.xml` avtomatik yangilanishi.
