import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "../lib/language";
import congressImage from "../assets/prohair-congress.jpg";
import { Button } from "../components/ui/button";
import { AssociationBenefitsSection } from "../components/association-benefits-section";
import { PartnersSection } from "../components/partners-section";
import { FAQSection } from "../components/faq-section";
import { AssociationRegistrationModal } from "../components/association-registration-modal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O‘zSTTA — O‘zbekiston Trixologiya Assotsiatsiyasi | Rasmiy Veb-Sayt" },
      {
        name: "description",
        content:
          "O‘zSTTA trixologiya va dermatologiya sohasidagi shifokorlar va mutaxassislarni birlashtiradi: ta’lim kurslari, vebinarlar, klinik tahlillar va a’zolik imtiyozlari.",
      },
      { property: "og:title", content: "O‘zSTTA — O‘zbekiston Trixologiya Assotsiatsiyasi" },
      {
        property: "og:description",
        content: "O‘zbekistonda trixologiyani rivojlantirish bo‘yicha professional assotsiatsiya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLanguage();
  const [isAssociationModalOpen, setIsAssociationModalOpen] = useState(false);
  const [congressTab, setCongressTab] = useState<'upcoming' | 'archive'>('upcoming');

  const slides = [
    {
      eyebrow: t('Профессиональная ассоциация', 'Professional assotsiatsiya', 'Professional Association'),
      title: t('Объединяем тех, кто развивает трихологию', 'Trixologiya rivoji uchun birlashamiz', 'Together for the future of trichology'),
      copy: t('O‘zSTTA создаёт профессиональную среду для врачей, исследователей, клиник и экспертов индустрии.', 'O‘zSTTA shifokorlar, tadqiqotchilar, klinikalar va soha ekspertlari uchun professional muhit yaratadi.', 'O‘zSTTA connects clinicians, researchers, clinics and industry experts.'),
      action: t('Вступить в Ассоциацию', 'Assotsiatsiyaga a’zo bo‘lish', 'Join Association'),
      isModalTrigger: true,
      kind: 'association',
    },
    {
      eyebrow: t('Международный конгресс', 'Xalqaro kongress', 'International Congress'),
      title: t('PROHAIR 2027 в Ташкенте', 'PROHAIR 2027 Toshkentda', 'PROHAIR 2027 in Tashkent'),
      copy: t(
        'Главное событие года: III Международный конгресс по трихологии и трансплантации волос. Открыта предварительная регистрация.',
        'Yilning bosh tadbiri: Trixologiya va soch transplantatsiyasi bo‘yicha III Xalqaro kongress. Dastlabki ro‘yxatdan o‘tish ochildi.',
        'The premier event of the year: III International Congress on Trichology & Hair Restoration. Pre-registration now open.'
      ),
      action: t('О конгрессе 2027', '2027 kongressi haqida', 'Explore PROHAIR 2027'),
      href: '/prohair-2027',
      kind: 'congress',
    },
    {
      eyebrow: t('Непрерывное образование', 'Uzluksiz ta’lim', 'Continuing Education'),
      title: t('Курсы и вебинары для специалистов', 'Mutaxassislar uchun kurs va vebinarlar', 'Courses and webinars for professionals'),
      copy: t('Клинические разборы, лекции и практические занятия — онлайн и очно.', 'Klinik tahlillar, ma’ruzalar va amaliy mashg‘ulotlar — onlayn va oflayn.', 'Clinical discussions, lectures and practical sessions — online and in person.'),
      action: t('Смотреть обучение', 'Ta’limni ko‘rish', 'Explore Education'),
      href: '/education',
      kind: 'education',
    },
  ] as const;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[activeSlide] ?? slides[0];

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  const getTitleClass = (text: string) => {
    const len = text.length;
    if (len <= 26) {
      // Qisqa sarlavha (masalan, PROHAIR 2027) -> katta, e'tibor tortuvchi shrift
      return 'text-4xl sm:text-6xl lg:text-[4.75rem] xl:text-[5.4rem] leading-[0.98]';
    } else if (len <= 35) {
      // O'rtacha sarlavha
      return 'text-3xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] leading-[1.02]';
    } else {
      // Uzun sarlavha -> ixcham, 2 qatorda sig'adigan shrift
      return 'text-2xl sm:text-4xl lg:text-[3.15rem] xl:text-[3.65rem] leading-[1.06]';
    }
  };

  return (
    <main>
      {/* Association Registration Modal */}
      <AssociationRegistrationModal
        isOpen={isAssociationModalOpen}
        onClose={() => setIsAssociationModalOpen(false)}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-8 sm:pt-8">
        <div className="hero-shell relative h-[590px] overflow-hidden sm:h-[620px] lg:h-[630px]">
          <img
            src={congressImage}
            alt={t('O‘zSTTA Ассоциация', 'O‘zSTTA Assotsiatsiya', 'O‘zSTTA Association')}
            width={1408}
            height={1008}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${slide.kind === "congress" ? "opacity-100 scale-100" : "opacity-35 scale-105"}`}
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-12">
            <div className="max-w-3xl pt-2 sm:pt-6">
              <p key={`${activeSlide}-eyebrow`} className="hero-enter text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {slide.eyebrow}
              </p>
              <h1
                key={`${activeSlide}-title`}
                className={`hero-enter mt-4 max-w-2xl lg:max-w-3xl font-serif font-bold text-primary-foreground ${getTitleClass(slide.title)}`}
              >
                {slide.title}
              </h1>
              <p key={`${activeSlide}-copy`} className="hero-enter mt-5 max-w-xl text-sm leading-6 text-primary-foreground/85 sm:text-base sm:leading-7 lg:text-lg">
                {slide.copy}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                {'isModalTrigger' in slide && slide.isModalTrigger ? (
                  <Button
                    onClick={() => setIsAssociationModalOpen(true)}
                    className="h-12 rounded-lg bg-accent px-6 text-accent-foreground font-bold shadow-lg hover:bg-accent/90"
                  >
                    <Shield className="mr-2 size-4" />
                    {slide.action}
                  </Button>
                ) : (
                  <Button asChild className="h-12 rounded-lg bg-accent px-6 text-accent-foreground font-bold shadow-lg hover:bg-accent/90">
                    <Link to={'href' in slide ? slide.href : '/'}>
                      {slide.action}
                      <ArrowUpRight className="ml-1.5 size-4" />
                    </Link>
                  </Button>
                )}

                {slide.kind === 'association' ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-lg border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold"
                  >
                    <Link to="/association">
                      <BookOpen className="mr-2 size-4" />
                      {t('Об Ассоциации', 'Assotsiatsiya haqida', 'About Association')}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsAssociationModalOpen(true)}
                    variant="outline"
                    className="h-12 rounded-lg border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold"
                  >
                    <Users className="mr-2 size-4" />
                    {t('Вступить в Ассоциацию', 'Assotsiatsiyaga a’zo bo‘lish', 'Join Association')}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-primary-foreground/20 pt-4 sm:pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" onClick={() => moveSlide(-1)} aria-label={t('Предыдущий слайд', 'Oldingi slayd', 'Previous slide')}>
                  <ArrowLeft />
                </Button>
                <Button variant="outline" size="icon" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" onClick={() => moveSlide(1)} aria-label={t('Следующий слайд', 'Keyingi slayd', 'Next slide')}>
                  <ArrowRight />
                </Button>
                <span className="ml-2 font-serif text-xl text-primary-foreground">0{activeSlide + 1}</span>
                <span className="text-xs text-primary-foreground/50">/ 03</span>
              </div>
              <div className="flex gap-2" role="tablist" aria-label={t('Промо-слайды', 'Promo slaydlar', 'Promo slides')}>
                {slides.map((item, index) => (
                  <button
                    key={item.kind}
                    type="button"
                    className={`h-1.5 rounded-full transition-all ${index === activeSlide ? "w-10 bg-accent" : "w-4 bg-primary-foreground/35"}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`${t('Слайд', 'Slayd', 'Slide')} ${index + 1}`}
                    aria-selected={index === activeSlide}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Pillars Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <p className="section-kicker">{t('Мир O‘zSTTA', 'O‘zSTTA olami', 'Discover O‘zSTTA')}</p>
        <h2 className="section-title mt-4">{t('Сообщество. Знания. События.', 'Hamjamiyat. Bilim. Tadbirlar.', 'Community. Knowledge. Events.')}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {([
            ["/association", t('Об ассоциации', 'Assotsiatsiya', 'Association'), t('Миссия, профессиональные стандарты и сообщество трихологов.', 'Missiya, kasbiy standartlar va trixologlar hamjamiyati.', 'Our mission, clinical standards and community.')],
            ["/prohair-2027", t('Конгресс PROHAIR 2027', 'PROHAIR 2027 Kongressi', 'PROHAIR 2027 Congress'), t('III Международный конгресс в Ташкенте: программа, темы и предварительная бронь.', 'Toshkentdagi III Xalqaro kongress: dastur, mavzular va dastlabki bron.', 'III International Congress in Tashkent: program, topics and waitlist.')],
            ["/education", t('Курсы и вебинары', 'Kurslar va vebinarlar', 'Courses and Webinars'), t('Клинические разборы, практическая трихоскопия и лекции.', 'Klinik tahlillar, amaliy trixoskopiya va ma’ruzalar.', 'Clinical discussions, trichoscopy practicums and lectures.')],
          ] as const).map(([to, title, copy]) => (
            <article key={to} className="event-card p-7 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-3xl font-bold">{title}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{copy}</p>
              </div>
              <Button asChild variant="link" className="mt-5 px-0 self-start text-accent">
                <Link to={to}>{t('Подробнее', 'Batafsil', 'Learn more')}<ArrowUpRight className="ml-1 size-4" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Association Benefits & Join Section (Replaces Tickets on Homepage) */}
      <AssociationBenefitsSection onJoinClick={() => setIsAssociationModalOpen(true)} />

      {/* Congress Highlight Box (PROHAIR 2027 vs PROHAIR 2026) */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 border-t border-border">
        {/* Tab switcher at the top */}
        <div className="mb-8">
          <div
            role="tablist"
            aria-label={t('Выбор конгресса', 'Kongressni tanlash', 'Select congress')}
            className="inline-flex rounded-xl border border-border bg-card p-1.5 shadow-sm"
          >
            <Button
              role="tab"
              aria-selected={congressTab === 'upcoming'}
              variant={congressTab === 'upcoming' ? 'default' : 'ghost'}
              className="rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold transition-all"
              onClick={() => setCongressTab('upcoming')}
            >
              PROHAIR 2027
            </Button>
            <Button
              role="tab"
              aria-selected={congressTab === 'archive'}
              variant={congressTab === 'archive' ? 'default' : 'ghost'}
              className="rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold transition-all"
              onClick={() => setCongressTab('archive')}
            >
              PROHAIR 2026
            </Button>
          </div>
        </div>

        {/* Section title & kicker */}
        <div className="mb-10">
          <p className="section-kicker">
            {t('Международный конгресс O‘zSTTA', 'O‘zSTTA xalqaro kongressi', 'O‘zSTTA International Congress')}
          </p>
          <h2 className="section-title mt-2">
            {congressTab === 'upcoming'
              ? 'PROHAIR 2027'
              : 'PROHAIR 2026'}
          </h2>
        </div>

        {congressTab === 'upcoming' ? (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch animate-in fade-in duration-300">
            <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <img
                src={congressImage}
                alt={t('Конгресс PROHAIR 2027', 'PROHAIR 2027 kongressi', 'PROHAIR 2027 congress')}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10 rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow">
                {t('Ташкент · Дата уточняется', 'Toshkent · Sana aniqlanmoqda', 'Tashkent · Date to be announced')}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="section-kicker">PROHAIR 2027 · TASHKENT</p>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
                {t('III Международный конгресс по трихологии', 'Trixologiya bo‘yicha III Xalqaro kongress', 'III International Congress on Trichology')}
              </h3>
              <p className="mt-4 leading-8 text-muted-foreground">
                {t(
                  'Следующий международный конгресс PROHAIR пройдёт в Ташкенте. Точные даты, площадка проведения, научная программа и условия участия будут опубликованы после утверждения оргкомитетом. Следите за обновлениями ассоциации O‘zSTTA.',
                  'Navbatdagi PROHAIR xalqaro kongressi Toshkentda bo‘lib o‘tadi. Aniq sanalar, o‘tkazilish manzili, ilmiy dastur va ishtirok shartlari tashkiliy qo‘mita tomonidan tasdiqlangach e’lon qilinadi. O‘zSTTA assotsiatsiyasi yangiliklarini kuzatib boring.',
                  'The next international PROHAIR congress will take place in Tashkent. Exact dates, venue, scientific agenda, and participation conditions will be announced once confirmed by the organizing committee. Stay tuned with O‘zSTTA.'
                )}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-accent">
                    {t('Ташкент', 'Toshkent', 'Tashkent')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{t('локация', 'manzil', 'location')}</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-accent">
                    {t('Очно', 'Oflayn', 'In-person')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{t('формат + выставка', 'format + ko‘rgazma', 'format + expo')}</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-accent">
                    2027
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{t('дата готовится', 'sana kutilmoqda', 'date TBA')}</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="h-11">
                  <Link to="/prohair-2027">
                    PROHAIR 2027
                    <ArrowUpRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11">
                  <Link to="/contacts">
                    {t('Связаться с оргкомитетом', 'Tashkilotchilar bilan aloqa', 'Contact Organizers')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch animate-in fade-in duration-300">
            <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <img
                src={congressImage}
                alt={t('Конгресс PROHAIR 2026', 'PROHAIR 2026 kongressi', 'PROHAIR 2026 congress')}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10 rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow">
                {t('4–5 сентября 2026', '2026-yil 4–5-sentabr', '4–5 September 2026')}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="section-kicker">PROHAIR 2026 · SAMARKAND</p>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
                {t('II Международный конгресс по трихологии', 'Trixologiya bo‘yicha II Xalqaro kongress', 'II International Congress on Trichology')}
              </h3>
              <p className="mt-4 leading-8 text-muted-foreground">
                {t(
                  'Крупнейшее научно-практическое событие региона, организованное ассоциацией O‘zSTTA в Самарканде. 24+ международных спикеров, разборы тяжелых форм алопеций, мастер-классы и выставка передовых технологий.',
                  'O‘zSTTA assotsiatsiyasi tomonidan Samarqandda tashkil etilgan mintaqaning eng yirik ilmiy-amaliy tadbiri. 24+ xalqaro spiker, alopetsiyaning og‘ir shakllari tahlili, mahorat darslari va ilg‘or texnologiyalar ko‘rgazmasi.',
                  'The landmark trichology congress hosted by O‘zSTTA in Samarkand: 24+ international faculty, masterclasses, complex alopecia case studies, and advanced industry exhibition.'
                )}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
                {([['24+', t('спикеров', 'spiker', 'faculty')], ['400+', t('участников', 'ishtirokchi', 'delegates')], ['2', t('дня программы', 'kunlik dastur', 'days program')]] as const).map(([v, l]) => (
                  <div key={l}>
                    <p className="font-serif text-4xl font-bold text-accent">{v}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="h-11">
                  <Link to="/prohair-2026">
                    {t('Статистика', 'Statistika', 'Statistics')}
                    <ArrowUpRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11">
                  <Link to="/events">{t('Все мероприятия', 'Barcha tadbirlar', 'All Events')}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Association Pillars */}
      <section className="section-band relative z-10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-kicker">{t('Об ассоциации', 'Assotsiatsiya haqida', 'About the association')}</p>
              <h2 className="section-title mt-4">{t('Профессиональная опора отрасли', 'Soha uchun professional tayanch', 'A professional backbone for the field')}</h2>
            </div>
            <div>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {t(
                  'O‘zSTTA объединяет врачей, исследователей и клиники, которым важны доказательная практика, профессиональная этика и постоянное развитие трихологии в Узбекистане.',
                  'O‘zSTTA isbotlangan amaliyot, kasbiy etika va O‘zbekistonda trixologiya rivojini muhim deb biladigan shifokorlar, tadqiqotchilar va klinikalarni birlashtiradi.',
                  'O‘zSTTA unites clinicians, researchers and clinics committed to evidence-based practice, professional ethics and the growth of trichology in Uzbekistan.'
                )}
              </p>
              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                {([
                  [GraduationCap, t('Обучение', 'Ta’lim', 'Education'), t('Курсы, лекции и вебинары от практикующих экспертов.', 'Amaliyotchi ekspertlardan kurslar, ma’ruzalar va vebinarlar.', 'Courses, lectures and webinars led by practising experts.')],
                  [BookOpen, t('Стандарты', 'Standartlar', 'Standards'), t('Методические материалы и актуальные клинические подходы.', 'Uslubiy materiallar va dolzarb klinik yondashuvlar.', 'Guidance materials and current clinical approaches.')],
                  [Users, t('Сообщество', 'Hamjamiyat', 'Community'), t('Связи между врачами, клиниками и партнёрами страны.', 'Shifokorlar, klinikalar va hamkorlar o‘rtasidagi aloqalar.', 'Connections among doctors, clinics and partners.')],
                ] as const).map(([Icon, title, copy]) => (
                  <article key={title} className="bg-card p-6">
                    <Icon className="size-6 text-accent" />
                    <h3 className="mt-6 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Membership CTA Banner */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-8">
        <div className="membership-panel grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center rounded-3xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              {t('Членство в O‘zSTTA', 'O‘zSTTA a’zoligi', 'O‘zSTTA Membership')}
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('Станьте частью профессионального сообщества', 'Professional hamjamiyat a’zosi bo‘ling', 'Join the Professional Community')}
            </h2>
            <p className="mt-4 max-w-2xl text-primary-foreground/80 leading-7">
              {t(
                'Получайте льготы на участие в конгрессах, доступ к закрытым клиническим разборам и образовательным материалам ассоциации.',
                'Kongresslarda imtiyozli ishtirok, yopiq klinik tahlillar va assotsiatsiyaning ta’lim materiallariga kirish imkoniyatini oling.',
                'Get preferred congress registration rates, access to clinical case discussions, and educational materials.'
              )}
            </p>
          </div>
          <Button
            onClick={() => setIsAssociationModalOpen(true)}
            className="h-14 rounded-xl bg-accent px-8 text-accent-foreground font-bold hover:bg-accent/90 shadow-xl"
          >
            {t('Подать заявку на членство', 'A’zolik arizasini topshirish', 'Apply for Membership')}
            <ArrowUpRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>
    </main>
  );
}
