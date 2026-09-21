import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage, pageMeta } from '../lib/language';
import congressImage from '../assets/prohair-congress.jpg';
import { SpeakersSection } from '../components/speakers-section';
import { ScheduleSection } from '../components/schedule-section';
import { PartnersSection } from '../components/partners-section';
import { FAQSection } from '../components/faq-section';

export const Route = createFileRoute('/prohair-2026')({
  head: () =>
    pageMeta(
      'PROHAIR 2026 — II Международный конгресс, Самарканд',
      'II Международный конгресс PROHAIR 2026: 4–5 сентября 2026, Mövenpick Hotel, Самарканд. Полная научная программа, 35+ международных спикеров, материалы конгресса.',
    ),
  component: Page,
});

function Page() {
  const { t } = useLanguage();

  const stats = [
    ['35+', t('международных спикеров', 'xalqaro spiker', 'international speakers')],
    ['400+', t('врачей и специалистов', 'shifokor va mutaxassis', 'doctors and specialists')],
    ['2', t('дня научной программы', 'kun to‘liq ilmiy dastur', 'days of scientific program')],
    ['8', t('тематических сессий', 'mavzuli sessiya', 'thematic sessions')],
  ];

  const countries = ['Узбекистан', 'Россия', 'Испания', 'Израиль', 'Иран', 'Тунис', 'Южная Корея', 'Германия', 'Казахстан', 'Кыргызстан', 'Таджикистан', 'Азербайджан'];

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">{t('Главная', 'Bosh sahifa', 'Home')}</Link>
        <span>/</span>
        <Link to="/events" className="hover:underline">{t('Мероприятия', 'Tadbirlar', 'Events')}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">PROHAIR 2026</span>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="section-kicker">{t('Международный Конгресс', 'Xalqaro Kongress', 'International Congress')}</p>
          <h1 className="section-title mt-2">PROHAIR 2026</h1>
          <p className="mt-2 font-serif text-2xl text-accent">
            {t('II Международный конгресс по трихологии и трансплантации волос', 'Trixologiya va soch transplantatsiyasi bo‘yicha II Xalqaro kongress', 'II International Congress on Trichology & Hair Restoration')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="h-12 rounded-xl bg-accent px-6 text-accent-foreground font-bold shadow-lg hover:bg-accent/90"
          >
            <Link to="/prohair-2027">
              PROHAIR 2027
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 items-center">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl">
          <img
            src={congressImage}
            alt={t('Зал конгресса PROHAIR 2026', 'PROHAIR 2026 kongress zali', 'PROHAIR 2026 congress hall')}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/80 p-3 backdrop-blur-md border border-border/50 text-xs">
            <span className="font-bold text-accent">Mövenpick Hotel Samarkand</span> · {t('Главная площадка события', 'Asosiy tadbir maydoni', 'Main venue')}
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <CalendarDays className="size-5 text-accent shrink-0" />
              <span>{t('4–5 сентября 2026', '2026-yil 4–5-sentabr', '4–5 September 2026')}</span>
            </p>
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <MapPin className="size-5 text-accent shrink-0" />
              <span>Mövenpick Hotel · {t('Самарканд, Узбекистан', 'Samarqand, O‘zbekiston', 'Samarkand, Uzbekistan')}</span>
            </p>
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <Users className="size-5 text-accent shrink-0" />
              <span>{t('Трихологи, дерматологи, пластические хирурги, руководители клиник', 'Trixologlar, dermatologlar, plastik jarrohlar, klinika rahbarlari', 'Trichologists, dermatologists, plastic surgeons, clinic directors')}</span>
            </p>
          </div>

          <p className="mt-6 leading-8 text-muted-foreground text-sm sm:text-base">
            {t(
              'Международная научно-практическая платформа, объединяющая специалистов из более чем 10 стран. Конгресс посвящён современным протоколам диагностики, доказательной терапии алопеций, инновационным экзосомам, светотерапии и актуальным технологиям трансплантации волос. Участников ждут 2 дня интенсивной программы, клинические разборы и общение с мировыми экспертами.',
              '10 dan ortiq davlat mutaxassislarini birlashtirgan xalqaro ilmiy-amaliy platforma. Kongress zamonaviy diagnostika protokollari, alopetsiyaning isbotlangan terapiyasi, innovatsion ekzosomalar, fototerapiya va soch transplantatsiyasi texnologiyalariga bag‘ishlangan. Ishtirokchilarni 2 kunlik qizg‘in dastur, klinik tahlillar va jahon ekspertlari bilan muloqot kutmoqda.',
              'An international scientific platform uniting specialists from over 10 countries. Dedicated to diagnostic protocols, evidence-based alopecia therapies, exosomes, light therapy, and hair transplantation innovations. Two full days of clinical cases, discussions, and high-level networking.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="#schedule">{t('Смотреть программу', 'Dasturni ko‘rish', 'View Program')}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#speakers">{t('Список спикеров', 'Spikerlar ro‘yxati', 'Faculty List')}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#partners">{t('Партнеры', 'Hamkorlar', 'Partners')}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Numbers */}
      <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-card p-7 text-center sm:text-left">
            <p className="font-serif text-5xl font-bold text-accent">{value}</p>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      {/* Full Speakers Component */}
      <SpeakersSection />

      {/* Full Schedule Component */}
      <ScheduleSection />

      {/* Pre-congress and Geography */}
      <section className="grid gap-8 border-y border-border py-16 md:grid-cols-2 mt-12">
        <div className="rounded-2xl border border-border bg-card p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {t('Авторский курс', 'Mualliflik kursi', 'Pre-congress course')}
          </span>
          <h2 className="font-serif text-3xl font-bold mt-2">
            {t('Пре-конгресс по андрогенетической алопеции', 'Androgenetik alopetsiya bo‘yicha pre-kongress', 'Pre-congress on Androgenetic Alopecia')}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground text-sm">
            {t(
              '2–3 сентября в Самарканде в преддверии Конгресса прошёл углубленный практический курс. Преподаватель — Татьяна Силюк, руководитель клинического отдела Русского общества исследования волос (РОИВ).',
              '2–3-sentabrda Samarqandda Kongress arafasida amaliy chuqurlashtirilgan kurs bo‘lib o‘tdi. O‘qituvchi — Tatyana Silyuk, Rus soch tadqiqotlari jamiyati (ROIV) klinik bo‘limi rahbari.',
              'An in-depth hands-on course in Samarkand preceding the Congress, led by Tatiana Silyuk, clinical head of the Russian Hair Research Society.'
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {t('География участников', 'Ishtirokchilar geografiyasi', 'Speaker Geography')}
          </span>
          <h2 className="font-serif text-3xl font-bold mt-2">
            {t('Страны-участницы Конгресса', 'Kongressda qatnashuvchi davlatlar', 'Participating Countries')}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {countries.map((c) => (
              <span key={c} className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Bottom CTA Banner */}
      <div className="mt-16 rounded-3xl border border-accent/40 bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-12 text-primary-foreground shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            PROHAIR 2027
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
            {t('PROHAIR 2027 в Ташкенте', 'Toshkentda PROHAIR 2027', 'PROHAIR 2027 in Tashkent')}
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 leading-6">
            {t(
              'PROHAIR 2026 успешно завершён. Ознакомьтесь с информацией о следующем конгрессе PROHAIR 2027 в Ташкенте и оставьте предварительную заявку.',
              'PROHAIR 2026 muvaffaqiyatli yakunlandi. Toshkentda o‘tkaziladigan navbatdagi PROHAIR 2027 kongressi ma’lumotlari bilan tanishing va dastlabki ariza qoldiring.',
              'PROHAIR 2026 has concluded. Learn more about PROHAIR 2027 in Tashkent and pre-register.'
            )}
          </p>
        </div>
        <Button
          asChild
          className="h-14 rounded-xl bg-accent px-8 text-accent-foreground font-bold text-base shadow-xl hover:bg-accent/90 shrink-0"
        >
          <Link to="/prohair-2027">
            PROHAIR 2027
            <ArrowUpRight className="ml-2 size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
