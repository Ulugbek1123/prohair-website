// O'zSTTA ta'lim kurslari. Ma'lumotlar rasmiy afishadan olingan.
// Yangi kurs qo'shilganda shu ro'yxatga qo'shing va server.cjs dagi courseNames ga nomini yozing.

export const TRICHOSCOPY_COURSE = {
  id: 'trichoscopy-2026', // /api/course-application ga yuboriladigan identifikator
  path: '/education/trichoscopy',
  startDate: '2026-11-27',
  endDate: '2026-11-28',
  startsAt: '2026-11-27T09:00:00+05:00',
  priceUsd: 800,
  venue: 'Welness Hotel & Spa', // afishadagi yozilishi
  phone: '+998 77 300 30 80',
  instructor: {
    nameRu: 'Татьяна Силюк',
    nameEn: 'Tatiana Silyuk',
    nameUz: 'Tatyana Silyuk',
  },
} as const;

export const TRICHOSCOPY_CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent('Авторский курс по трихоскопии — Т. Силюк') +
  '&dates=20261127/20261129' +
  '&details=' + encodeURIComponent('O‘zSTTA · https://prohair.uz/education/trichoscopy') +
  '&location=' + encodeURIComponent(`${TRICHOSCOPY_COURSE.venue}, Tashkent`);
