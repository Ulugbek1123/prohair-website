import { useEffect, useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Users,
  Ticket,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  CalendarPlus,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage, pageMeta } from '../lib/language';
import { PreRegistrationModal } from '../components/pre-registration-modal';
import { ProhairHairArt } from '../components/prohair-hair-art';
import {
  Congress2027RegistrationModal,
  type Registration2027Selection,
} from '../components/congress-2027-registration-modal';
import { Pricing2027Section } from '../components/pricing-2027-section';
import { AssociationRegistrationModal } from '../components/association-registration-modal';

export const Route = createFileRoute('/prohair-2027')({
  head: () =>
    pageMeta(
      'PROHAIR 2027 — III Международный конгресс · 11–12 сентября 2027, Ташкент',
      'III Международный конгресс PROHAIR 2027: «Современная диагностика и терапия заболеваний волос». 11–12 сентября 2027 года, Ташкент, Узбекистан. Предварительная регистрация, научная программа и условия партнёрства.',
    ),
  component: Page,
});

// Ma'lumotlar rasmiy afishadan olingan (III Xalqaro kongress PROHAIR 2027)
const CONGRESS_START = new Date('2027-09-11T09:00:00+05:00');
const CONTACT_PHONE = '+998 90 175 74 07';
const CONTACT_EMAIL = 'ilxom.raximov.1975@mail.ru';
const GOOGLE_CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent('PROHAIR 2027 — III International Congress') +
  '&dates=20270911/20270913' +
  '&details=' + encodeURIComponent('«Modern Diagnostics and Therapy of Hair Diseases» · https://prohair.uz/prohair-2027') +
  '&location=' + encodeURIComponent('Tashkent, Uzbekistan');

function useCountdown(target: Date) {
  // Faqat klientda hisoblanadi — SSR bilan hydration farqi bo'lmasligi uchun
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);
  if (left === null) return null;
  const minutes = Math.floor(left / 60_000);
  return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 };
}

export function Page() {
  const { t } = useLanguage();
  const countdown = useCountdown(CONGRESS_START);
  const dateLabel = t('11–12 сентября 2027', '2027-yil 11–12-sentabr', '11–12 September 2027');
  const cityLabel = t('Ташкент, Узбекистан', 'Toshkent, O‘zbekiston', 'Tashkent, Uzbekistan');
  const congressTheme = t(
    'Современная диагностика и терапия заболеваний волос',
    'Soch kasalliklarining zamonaviy diagnostikasi va terapiyasi',
    'Modern Diagnostics and Therapy of Hair Diseases',
  );
  const organizer = t(
    'Ассоциация трансплантологов волос и трихологов Узбекистана',
    'O‘zbekiston soch transplantologlari va trixologlari assotsiatsiyasi',
    'Association of Hair Transplantologists and Trichologists of Uzbekistan',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('doctor');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [registration, setRegistration] = useState<Registration2027Selection | null>(null);
  const [isAssociationOpen, setIsAssociationOpen] = useState(false);

  // Dastlabki ariza — spikerlar va hamkorlar uchun
  const handleOpenRegister = (role: string = 'doctor') => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };
  const openRegistration = (selection: Registration2027Selection = { residency: 'resident', category: 'non_member' }) =>
    setRegistration(selection);

  const stats = [
    ['11–12', t('сентября 2027 года', '2027-yil sentabr', 'September 2027')],
    [t('Ташкент', 'Toshkent', 'Tashkent'), t('столица Узбекистана', 'O‘zbekiston poytaxti', 'capital of Uzbekistan')],
    ['2', t('дня научной программы', 'kunlik ilmiy dastur', 'days of scientific program')],
    ['III', t('международный конгресс PROHAIR', 'xalqaro PROHAIR kongressi', 'international PROHAIR congress')],
  ];

  const plannedTracks = [
    {
      title: t('Трихоскопия и доказательная диагностика', 'Trixoskopiya va isbotlangan diagnostika', 'Trichoscopy & Diagnostics'),
      desc: t('Современные дифференциальные протоколы, цифровая трихоскопия и раннее выявление рубцовых и нерубцовых алопеций.', 'Zamonaviy differensial protokollar, raqamli trixoskopiya va chandiqli hamda chandiqsiz alopetsiyalarni erta aniqlash.', 'Differential diagnostic protocols, digital trichoscopy and early detection of alopecias.'),
    },
    {
      title: t('Клеточные технологии, экзосомы и PRP', 'Hujayraviy texnologiyalar, ekzosomalar va PRP', 'Exosomes & Regenerative Therapy'),
      desc: t('Доказательная база экзосомальной терапии, протоколы PRP, пептидная стимуляция волосяных фолликулов.', 'Ekzosomal terapiyaning ilmiy asoslari, PRP protokollari, soch follikulalarini peptidlar bilan rag‘batlantirish.', 'Evidence-based exosome therapy, PRP protocols, and peptide follicle stimulation.'),
    },
    {
      title: t('FUE и трансплантация волос', 'FUE va soch transplantatsiyasi', 'FUE & Hair Restoration'),
      desc: t('Передовые методики забора графтов, трансплантация длинных волос, коррекция рубцов и сочетанные протоколы.', 'Graft olishning ilg‘or metodlari, uzun sochlarni transplantatsiya qilish, chandiqlarni to‘g‘rilash va kompleks protokollar.', 'Advanced graft extraction, long hair restoration, scar revision, and combined protocols.'),
    },
    {
      title: t('Клинические разборы сложных кейсов', 'Murakkab holatlar klinik tahlillari', 'Complex Clinical Case Studies'),
      desc: t('Интерактивные дискуссии и междисциплинарный подход: трихология, дерматология, эндокринология и трихохирургия.', 'Interaktiv muhokamalar va fanlararo yondashuv: trixologiya, dermatologiya, endokrinologiya va trixojarrohlik.', 'Interactive case panel discussions bridging trichology, endocrinology, and dermatologic surgery.'),
    },
    {
      title: t('Практические мастер-классы', 'Amaliy mahorat darslari', 'Hands-on Masterclasses'),
      desc: t('Отработка навыков на трихологическом оборудовании, инъекционные техники и постановка руки от ведущих экспертов.', 'Trixologik uskunalarda amaliy ko‘nikmalar, inyeksion texnikalar va yetakchi mutaxassislardan mahorat darslari.', 'Hands-on skills with diagnostic devices, injection techniques, and clinical mentoring.'),
    },
    {
      title: t('Менеджмент и маркетинг клиники', 'Klinika menejmenti va marketingi', 'Clinic Growth & Leadership'),
      desc: t('Построение трихологического приёма в клинике, юридические стандарты, этика и продвижение медицинских услуг.', 'Klinikada trixologiya qabulini tashkil qilish, huquqiy standartlar, etika va tibbiy xizmatlarni ilgari surish.', 'Setting up trichology services, regulatory standards, medical ethics, and practice growth.'),
    },
  ];

  const faqs = [
    {
      q: t('Когда и где пройдёт PROHAIR 2027?', 'PROHAIR 2027 qachon va qayerda bo‘lib o‘tadi?', 'When and where will PROHAIR 2027 take place?'),
      a: t(
        'III Международный конгресс PROHAIR 2027 состоится 11–12 сентября 2027 года в Ташкенте, Узбекистан. Конкретная площадка проведения будет объявлена оргкомитетом дополнительно.',
        'III Xalqaro PROHAIR 2027 kongressi 2027-yil 11–12-sentabr kunlari Toshkent shahrida (O‘zbekiston) bo‘lib o‘tadi. Aniq o‘tkazilish joyi tashkiliy qo‘mita tomonidan qo‘shimcha e’lon qilinadi.',
        'The III International PROHAIR 2027 Congress will take place on 11–12 September 2027 in Tashkent, Uzbekistan. The exact venue will be announced by the organizing committee.'
      ),
    },
    {
      q: t('Какова главная тема конгресса?', 'Kongressning asosiy mavzusi qanday?', 'What is the main theme of the congress?'),
      a: t(
        'Главная тема PROHAIR 2027 — «Современная диагностика и терапия заболеваний волос». В программе: трихоскопия и дифференциальная диагностика, медикаментозная и регенеративная терапия, трансплантация волос и разборы клинических случаев.',
        'PROHAIR 2027 ning asosiy mavzusi — «Soch kasalliklarining zamonaviy diagnostikasi va terapiyasi». Dasturda: trixoskopiya va differensial diagnostika, dori va regenerativ terapiya, soch transplantatsiyasi hamda klinik holatlar tahlili.',
        'The main theme of PROHAIR 2027 is «Modern Diagnostics and Therapy of Hair Diseases», covering trichoscopy and differential diagnosis, medical and regenerative therapy, hair transplantation and clinical case reviews.'
      ),
    },
    {
      q: t('Кто организатор и как связаться с оргкомитетом?', 'Tashkilotchi kim va tashkiliy qo‘mita bilan qanday bog‘lanish mumkin?', 'Who is the organizer and how do I contact the committee?'),
      a: t(
        `Организатор — Ассоциация трансплантологов волос и трихологов Узбекистана (O‘zSTTA). Телефон: ${CONTACT_PHONE}, e-mail: ${CONTACT_EMAIL}.`,
        `Tashkilotchi — O‘zbekiston soch transplantologlari va trixologlari assotsiatsiyasi (O‘zSTTA). Telefon: ${CONTACT_PHONE}, e-mail: ${CONTACT_EMAIL}.`,
        `The congress is organized by the Association of Hair Transplantologists and Trichologists of Uzbekistan (O‘zSTTA). Phone: ${CONTACT_PHONE}, e-mail: ${CONTACT_EMAIL}.`
      ),
    },
    {
      q: t('Сколько стоит участие и как оплатить?', 'Ishtirok narxi qancha va qanday to‘lanadi?', 'How much does it cost and how do I pay?'),
      a: t(
        'Стоимость зависит от категории (член O‘zSTTA, не член, билет на 1 день, студент/ординатор), резидентства и даты регистрации: ранняя цена — до 30.04, стандартная — до 30.06, поздняя — с 20.08. Резиденты: от $75 до $200, нерезиденты: от $150 до $400. После регистрации оргкомитет свяжется с вами для оплаты; возможна оплата на месте.',
        'Narx toifaga (O‘zSTTA a’zosi, a’zo emas, 1 kunlik chipta, talaba/ordinator), rezidentlikka va ro‘yxatdan o‘tish sanasiga bog‘liq: erta narx — 30.04 gacha, standart — 30.06 gacha, kech — 20.08 dan. Rezidentlar: $75 dan $200 gacha, norezidentlar: $150 dan $400 gacha. Ro‘yxatdan o‘tgach tashkiliy qo‘mita to‘lov uchun bog‘lanadi; joyida to‘lash ham mumkin.',
        'The fee depends on category (O‘zSTTA member, non-member, one-day ticket, student/resident), residency and registration date: early price until 30.04, standard until 30.06, late from 20.08. Residents: $75–$200, non-residents: $150–$400. After registering, the committee will contact you about payment; on-site payment is possible.'
      ),
    },
    {
      q: t('Как получить скидку члена O‘zSTTA?', 'O‘zSTTA a’zosi chegirmasini qanday olish mumkin?', 'How do I get the O‘zSTTA member price?'),
      a: t(
        'Членство O‘zSTTA на 2027 год стоит $40 для резидентов и $60 для нерезидентов. Члены регистрируются по льготному тарифу, а при оформлении членства до 31 декабря 2026 года — дополнительно получают скидку 10% на участие в Конгрессе и на все образовательные курсы 2027 года.',
        'O‘zSTTA 2027 a’zoligi rezidentlar uchun $40, norezidentlar uchun $60. A’zolar imtiyozli tarif bo‘yicha ro‘yxatdan o‘tadi, a’zolikni 2026-yil 31-dekabrgacha rasmiylashtirganlar esa Kongress ishtiroki va 2027-yilgi barcha ta’lim kurslariga qo‘shimcha 10% chegirma oladi.',
        'O‘zSTTA membership for 2027 costs $40 for residents and $60 for non-residents. Members register at the member rate, and those who join before 31 December 2026 also get 10% off the Congress and all 2027 educational courses.'
      ),
    },
    {
      q: t('Как подать заявку на выступление со спикерским докладом?', 'Spiker sifatida chiqish qilish uchun qanday ariza berish mumkin?', 'How can I apply as a speaker?'),
      a: t(
        'Если вы хотите выступить с клиническим случаем или научным докладом, выберите роль "Потенциальный спикер" в форме предварительной заявки или свяжитесь с оргкомитетом через страницу контактов.',
        'Agar ilmiy ma’ruza yoki klinik holat tahlili bilan chiqish qilmoqchi bo‘lsangiz, arizada "Bo‘lg‘usi spiker" rolini tanlang yoki Aloqa sahifasi orqali tashkiliy qo‘mitaga yozing.',
        'If you wish to present a case or scientific paper, choose "Potential Speaker" in the form or contact our scientific committee directly.'
      ),
    },
    {
      q: t('Как стать спонсором или экспонентом выставки?', 'Homiy yoki ko‘rgazma ishtirokchisi bo‘lish tartibi qanday?', 'How can my company become an exhibitor or sponsor?'),
      a: t(
        'Мы предлагаем несколько уровней партнёрских пакетов: Генеральный спонсор, Официальный партнёр, стенд на выставке и сателлитный мастер-класс. Оставьте заявку в форме выше, и менеджер отправит вам партнёрский буклет.',
        'Biz Bosh homiy, Rasmiy hamkor, ko‘rgazma stendi va satellit mahorat darslari kabi bir nechta darajadagi paketlarni taklif qilamiz. Shaklda ariza qoldiring va menejerimiz sizga homiylik bukletini yuboradi.',
        'We offer several partnership tiers including General Sponsor, Official Partner, Expo Booth, and Satellite Symposium. Submit a request to receive our prospectus.'
      ),
    },
  ];

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
      {/* Pre-registration Modal */}
      <PreRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultRole={selectedRole}
      />
      <Congress2027RegistrationModal
        isOpen={registration !== null}
        onClose={() => setRegistration(null)}
        initial={registration}
      />
      <AssociationRegistrationModal isOpen={isAssociationOpen} onClose={() => setIsAssociationOpen(false)} />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">{t('Главная', 'Bosh sahifa', 'Home')}</Link>
        <span>/</span>
        <Link to="/events" className="hover:underline">{t('Мероприятия', 'Tadbirlar', 'Events')}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">PROHAIR 2027</span>
      </div>

      {/* Hero — rasmiy afisha uslubida (binafsha + oltin) */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-[#e9c46a]/30 bg-[radial-gradient(ellipse_at_top_right,#8b5cf6_0%,#5b21b6_38%,#2e1065_100%)] text-white shadow-2xl">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#e9c46a]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e9c46a]/50 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#f3d27a] backdrop-blur">
              <Sparkles className="size-3.5" />
              {t('III Международный конгресс', 'III Xalqaro kongress', 'III International Congress')}
            </div>

            <h1 className="mt-5 font-serif text-6xl font-bold leading-none sm:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-[#f7dc8c] via-[#e9b949] to-[#f7dc8c] bg-clip-text text-transparent">
                PROHair 2027
              </span>
            </h1>

            <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-white/95 sm:text-3xl">
              «{congressTheme}»
            </p>

            <div className="mt-8 inline-flex flex-col gap-1 rounded-2xl border border-white/15 bg-[#1e0b4b]/60 px-6 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-2.5 text-lg font-semibold sm:text-xl">
                <CalendarDays className="size-5 text-[#f3d27a]" />
                {dateLabel}
              </span>
              <span className="hidden h-6 w-px bg-white/20 sm:block" />
              <span className="flex items-center gap-2.5 text-lg font-semibold sm:text-xl">
                <MapPin className="size-5 text-[#f3d27a]" />
                {cityLabel}
              </span>
            </div>

            {/* Orqaga sanoq */}
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3" aria-live="polite">
              {[
                [countdown?.days, t('дней', 'kun', 'days')],
                [countdown?.hours, t('часов', 'soat', 'hours')],
                [countdown?.minutes, t('минут', 'daqiqa', 'minutes')],
              ].map(([value, label]) => (
                <div key={String(label)} className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur">
                  <p className="font-serif text-3xl font-bold tabular-nums text-[#f3d27a] sm:text-4xl">
                    {value ?? '—'}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={() => openRegistration()}
                className="h-12 rounded-xl bg-[#e9b949] px-6 font-bold text-[#2e1065] shadow-lg hover:bg-[#f3d27a]"
              >
                <Ticket className="mr-1 size-4" />
                {t('Зарегистрироваться', 'Ro‘yxatdan o‘tish', 'Register now')}
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/30 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white"
              >
                <a href="#pricing">{t('Цены', 'Narxlar', 'Fees')}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/30 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white"
              >
                <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  <CalendarPlus className="mr-1 size-4" />
                  {t('Добавить в календарь', 'Kalendarga qo‘shish', 'Add to calendar')}
                </a>
              </Button>
            </div>
          </div>

          {/* Afisha uslubidagi bezak: oltin lenta o'ralgan soch tolasi */}
          <ProhairHairArt className="mx-auto w-full max-w-[260px] drop-shadow-[0_30px_40px_rgba(20,0,50,0.45)] sm:max-w-[320px] lg:max-w-[420px]" />
        </div>
      </section>

      {/* Quick nav */}
      <nav className="mt-8 flex flex-wrap gap-3" aria-label={t('Разделы страницы', 'Sahifa bo‘limlari', 'Page sections')}>
        {[
          ['#about', t('О конгрессе', 'Kongress haqida', 'About')],
          ['#speakers', t('Спикеры', 'Spikerlar', 'Speakers')],
          ['#schedule', t('Программа', 'Dastur', 'Program')],
          ['#pricing', t('Тарифы', 'Tariflar', 'Passes')],
          ['#partners', t('Партнерам', 'Hamkorlarga', 'Partners')],
          ['#contacts', t('Оргкомитет', 'Tashkiliy qo‘mita', 'Committee')],
        ].map(([href, label]) => (
          <Button key={href} asChild variant="outline" size="sm" className="rounded-full">
            <a href={href}>{label}</a>
          </Button>
        ))}
      </nav>

      {/* About */}
      <section id="about" className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="section-kicker">{t('О конгрессе', 'Kongress haqida', 'About the congress')}</p>
          <h2 className="section-title mt-2">
            {t('Главное событие трихологии в Центральной Азии', 'Markaziy Osiyoda trixologiyaning bosh tadbiri', 'Central Asia’s leading trichology event')}
          </h2>
          <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
            {t(
              'III Международный конгресс PROHAIR 2027 пройдёт 11–12 сентября 2027 года в Ташкенте. Главная тема — «Современная диагностика и терапия заболеваний волос». Конгресс соберёт ведущих международных экспертов, практикующих трихологов, дерматологов и хирургов-трансплантологов. Регистрация уже открыта — чем раньше, тем ниже стоимость участия. Состав спикеров и площадка будут объявлены дополнительно.',
              'III Xalqaro PROHAIR 2027 kongressi 2027-yil 11–12-sentabr kunlari Toshkentda bo‘lib o‘tadi. Bosh mavzu — «Soch kasalliklarining zamonaviy diagnostikasi va terapiyasi». Kongress yetakchi xalqaro ekspertlar, amaliyotchi trixologlar, dermatologlar va transplantolog-jarrohlarni birlashtiradi. Ro‘yxatdan o‘tish allaqachon ochiq — qancha erta bo‘lsa, narx shuncha arzon. Spikerlar tarkibi va o‘tkazilish joyi qo‘shimcha e’lon qilinadi.',
              'The III International PROHAIR 2027 Congress takes place on 11–12 September 2027 in Tashkent. The main theme is «Modern Diagnostics and Therapy of Hair Diseases». The congress brings together leading international experts, practising trichologists, dermatologists and hair transplant surgeons. Registration is already open — the earlier you register, the lower the fee. Faculty and venue will be announced later.'
            )}
          </p>
        </div>

        <div className="event-card space-y-5 p-7">
          <p className="flex items-start gap-3 font-semibold text-foreground">
            <CalendarDays className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>{dateLabel}</span>
          </p>
          <p className="flex items-start gap-3 font-semibold text-foreground">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>
              {cityLabel}
              <span className="block text-xs font-normal text-muted-foreground">
                {t('Площадка будет объявлена дополнительно', 'O‘tkazilish joyi qo‘shimcha e’lon qilinadi', 'Venue to be announced')}
              </span>
            </span>
          </p>
          <p className="flex items-start gap-3 font-semibold text-foreground">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>«{congressTheme}»</span>
          </p>
          <p className="flex items-start gap-3 font-semibold text-foreground">
            <Users className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>{t('Трихологи, дерматологи, хирурги-трансплантологи, руководители клиник', 'Trixologlar, dermatologlar, transplantolog-jarrohlar, klinika rahbarlari', 'Trichologists, dermatologists, hair transplant surgeons, clinic directors')}</span>
          </p>
          <p className="flex items-start gap-3 font-semibold text-foreground">
            <Building2 className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>
              {t('Организатор', 'Tashkilotchi', 'Organizer')}: {organizer}
            </span>
          </p>
        </div>
      </section>

      {/* Stats Numbers */}
      <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border grid-cols-2 sm:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-card p-7 text-center sm:text-left">
            <p className="font-serif text-4xl sm:text-5xl font-bold text-accent">{value}</p>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      {/* Speakers Section (Pending announcement) */}
      <section id="speakers" className="py-20 border-t border-border mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-kicker">{t('Спикеры конгресса', 'Kongress spikerlari', 'Congress Faculty')}</p>
            <h2 className="section-title mt-2">
              {t('Формирование пула международных экспертов', 'Xalqaro ekspertlar tarkibi shakllantirilmoqda', 'Faculty Curation in Progress')}
            </h2>
            <p className="mt-4 max-w-3xl text-muted-foreground leading-7 text-sm sm:text-base">
              {t(
                'Оргкомитет O‘zSTTA ведёт отбор и согласование докладов с мировыми лидерами в области трихологии, дерматологии и трансплантации волос. Полный список докладчиков и темы выступлений будут опубликованы после утверждения научной программы.',
                'O‘zSTTA tashkiliy qo‘mitasi trixologiya, dermatologiya va soch transplantatsiyasi bo‘yicha jahon yetakchilari bilan ma’ruzalarni saralash va tasdiqlash ishlarini olib bormoqda. To‘liq spikerlar ro‘yxati ilmiy dastur tasdiqlangach e’lon qilinadi.',
                'The O‘zSTTA organizing committee is curating keynote lectures and panels with world leaders in trichology, dermatology, and hair restoration. The full faculty lineup will be released shortly.'
              )}
            </p>
          </div>
          <Button onClick={() => handleOpenRegister('speaker')} variant="outline" className="shrink-0 h-11">
            {t('Подать заявку спикера', 'Spiker sifatida ariza berish', 'Apply as Speaker')}
          </Button>
        </div>

        {/* 4 Teaser silhouette cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t('Международный спикер', 'Xalqaro spiker', 'Keynote Faculty'), t('Европа / США', 'Yevropa / AQSh', 'Europe / USA'), t('Доказательная трихоскопия', 'Isbotlangan trixoskopiya', 'Evidence-based Trichoscopy')],
            [t('Эксперт по трансплантации', 'Transplantatsiya bo‘yicha ekspert', 'Restoration Surgeon'), t('Турция / Южная Корея', 'Turkiya / Janubiy Koreya', 'Turkey / South Korea'), t('FUE и реконструктивные техники', 'FUE va rekonstruktiv texnikalar', 'FUE & Revision Techniques')],
            [t('Ведущий дерматовенеролог', 'Yetakchi dermatovenerolog', 'Clinical Dermatologist'), t('Центральная Азия', 'Markaziy Osiyo', 'Central Asia'), t('Тяжёлые формы алопеций', 'Alopetsiyaning og‘ir shakllari', 'Complex Alopecia Pathology')],
            [t('Специалист клеточной терапии', 'Hujayra terapiyasi mutaxassisi', 'Cellular Biologist'), t('Инновационные лаборатории', 'Innovatsion laboratoriyalar', 'Innovative Biotech'), t('Экзосомы и пептидные протоколы', 'Ekzosomalar va peptid protokollari', 'Exosome Protocols')],
          ].map(([role, region, topic], idx) => (
            <article key={idx} className="event-card p-6 flex flex-col justify-between border-dashed">
              <div>
                <div className="size-16 rounded-2xl bg-secondary/80 flex items-center justify-center text-accent mb-5">
                  <Users className="size-8 opacity-60" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">{region}</span>
                <h3 className="font-serif text-xl font-bold mt-2">{role}</h3>
                <p className="text-xs text-muted-foreground mt-3 leading-5">{topic}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Clock className="size-3.5 text-accent" />
                <span>{t('Уточняется', 'Aniqlanmoqda', 'To be announced')}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Schedule / Topics Section */}
      <section id="schedule" className="py-20 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-kicker">{t('Научная программа', 'Ilmiy dastur', 'Scientific Program')}</p>
            <h2 className="section-title mt-2">
              {t('Ключевые направления и темы конгресса', 'Kongressning asosiy yo‘nalishlari va mavzulari', 'Key Tracks & Scientific Themes')}
            </h2>
            <p className="mt-4 max-w-3xl text-muted-foreground leading-7 text-sm sm:text-base">
              {t(
                'Два дня программы под главной темой «Современная диагностика и терапия заболеваний волос» объединят академические лекции, клинические дискуссии и практические демонстрации. Почасовое расписание сессий будет опубликовано ближе к дате конгресса.',
                '«Soch kasalliklarining zamonaviy diagnostikasi va terapiyasi» bosh mavzusi ostidagi ikki kunlik dastur akademik ma’ruzalar, klinik muhokamalar va amaliy namoyishlarni birlashtiradi. Sessiyalarning soatbay jadvali kongress arafasida e’lon qilinadi.',
                'Two days built around the main theme «Modern Diagnostics and Therapy of Hair Diseases», combining academic lectures, clinical discussions and live demonstrations. A detailed timetable will be published closer to the congress.'
              )}
            </p>
          </div>
          <Button onClick={() => handleOpenRegister('doctor')} className="shrink-0 h-11">
            <Mail className="size-4 mr-2" />
            {t('Получить программу на email', 'Dasturni emailga olish', 'Get Agenda by Email')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plannedTracks.map((track, i) => (
            <article key={i} className="event-card p-7">
              <span className="font-serif text-3xl font-bold text-accent">0{i + 1}</span>
              <h3 className="font-serif text-xl font-bold mt-4">{track.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-6">{track.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <Pricing2027Section onRegister={openRegistration} onJoinAssociation={() => setIsAssociationOpen(true)} />

      {/* Partners / Sponsors Callout */}
      <section id="partners" className="py-20 border-t border-border">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-3">
                <Building2 className="size-4" />
                {t('Для компаний и брендов', 'Kompaniyalar va brendlar uchun', 'For Brands & Exhibitors')}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                {t('Партнёрство и выставка PROHAIR 2027', 'PROHAIR 2027 ko‘rgazmasi va hamkorlik', 'Partnership & Technology Expo')}
              </h2>
              <p className="mt-4 text-muted-foreground leading-7 text-sm sm:text-base">
                {t(
                  'Приглашаем фармацевтические компании, производителей оборудования, лаборатории и клиники представить свои инновации профессиональной аудитории трихологов и дерматологов со всей Центральной Азии. Доступны форматы Генерального спонсора, выставочного стенда и сателлитных симпозиумов.',
                  'Farmatsevtika kompaniyalari, uskunalar ishlab chiqaruvchilari, laboratoriyalar va klinikalarni Markaziy Osiyoning trixolog va dermatologlari auditoriyasiga o‘z innovatsiyalarini taqdim etishga taklif qilamiz. Bosh homiylik, ko‘rgazma stendi va satellit simpozium formatlari mavjud.',
                  'We invite pharmaceutical companies, device manufacturers, labs, and clinics to showcase their products to trichologists and dermatologists across Central Asia. Sponsorship packages and expo booths available.'
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button onClick={() => handleOpenRegister('partner')} className="h-11">
                  {t('Запросить спонсорский пакет', 'Homiylik paketini so‘rash', 'Request Sponsor Package')}
                </Button>
                <Button asChild variant="outline" className="h-11">
                  <Link to="/contacts">{t('Связаться с оргкомитетом', 'Tashkilotchilar bilan aloqa', 'Contact Organizers')}</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-bold">
                {t('Преимущества для экспонентов:', 'Eksponentlar uchun afzalliklar:', 'Benefits for Exhibitors:')}
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>{t('Целевой контакт с 400+ практикующими врачами и руководителями клиник', '400+ amaliyotchi shifokorlar va klinika rahbarlari bilan to‘g‘ridan-to‘g‘ri muloqot', 'Direct engagement with 400+ clinicians and clinic owners')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>{t('Презентация оборудования и мастер-классы в рамках научной сетки', 'Ilmiy dastur doirasida uskunalar taqdimoti va mahorat darslari', 'Showcase devices and hold workshops in the scientific program')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>{t('Освещение бренда в медиаресурсах и каталогах ассоциации O‘zSTTA', 'O‘zSTTA assotsiatsiyasining media-resurslarida brend yoritilishi', 'Brand coverage across all O‘zSTTA media and delegate materials')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing committee */}
      <section id="contacts" className="py-20 border-t border-border">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="section-kicker">{t('Организационный комитет', 'Tashkiliy qo‘mita', 'Organizing Committee')}</p>
            <h2 className="section-title mt-2">{organizer}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t(
                'По вопросам участия, выступления с докладом и партнёрства обращайтесь напрямую в оргкомитет конгресса.',
                'Ishtirok etish, ma’ruza bilan chiqish va hamkorlik masalalari bo‘yicha to‘g‘ridan-to‘g‘ri kongress tashkiliy qo‘mitasiga murojaat qiling.',
                'For participation, speaking and partnership enquiries, contact the congress organizing committee directly.'
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Phone, label: t('Телефон', 'Telefon', 'Phone'), value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s/g, '')}` },
              { icon: Mail, label: t('Почта', 'Pochta', 'E-mail'), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
              { icon: Globe, label: t('Сайт', 'Sayt', 'Website'), value: 'prohair.uz', href: 'https://prohair.uz' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="event-card flex items-center gap-4 p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-accent">{label}</span>
                  <span className="block break-all font-semibold text-foreground">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Bridge (PROHAIR 2026) */}
      <section className="py-12 border-t border-border">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              PROHAIR 2026
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1">
              {t('Хотите узнать, как прошёл PROHAIR 2026?', 'PROHAIR 2026 qanday o‘tganini bilmoqchimisiz?', 'Want to see how PROHAIR 2026 went?')}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-6">
              {t(
                'Познакомьтесь с материалами, спикерами и темами II Международного конгресса, прошедшего в Самарканде в Mövenpick Hotel.',
                'Samarqanddagi Mövenpick Hotelda bo‘lib o‘tgan II Xalqaro kongress materiallari, spikerlari va mavzulari bilan tanishing.',
                'Explore the speakers, topics, and program from our II International Congress in Samarkand.'
              )}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 shrink-0">
            <Link to="/prohair-2026">
              PROHAIR 2026
              <ArrowUpRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-kicker">{t('Вопросы и ответы', 'Savol-javoblar', 'FAQ')}</p>
            <h2 className="section-title mt-2">
              {t('Частые вопросы о PROHAIR 2027', 'PROHAIR 2027 haqida ko‘p beriladigan savollar', 'Frequently Asked Questions')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen ? 'border-accent bg-card shadow-md' : 'border-border bg-card/60 hover:border-accent/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-lg sm:text-xl font-bold pr-4">{faq.q}</span>
                    <ChevronDown className={`size-5 text-accent shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-7 border-t border-border/40 pt-4 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="mt-12 rounded-3xl border border-accent/40 bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-12 text-primary-foreground shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">PROHAIR 2027 · {dateLabel} · {cityLabel}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
            {t('Зарегистрируйтесь по ранней цене', 'Erta narxda ro‘yxatdan o‘ting', 'Register at the early-bird price')}
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 leading-6">
            {t(
              'Ранняя цена действует до 30 апреля 2027 года. Зарегистрируйтесь сейчас — оплатить можно после подтверждения или на месте.',
              'Erta narx 2027-yil 30-apreligacha amal qiladi. Hoziroq ro‘yxatdan o‘ting — tasdiqlangandan so‘ng yoki joyida to‘lash mumkin.',
              'The early price is valid until 30 April 2027. Register now — pay after confirmation or on site.'
            )}
          </p>
        </div>
        <Button
          onClick={() => openRegistration()}
          className="h-14 rounded-xl bg-accent px-8 text-accent-foreground font-bold text-base shadow-xl hover:bg-accent/90 shrink-0"
        >
          {t('Зарегистрироваться', 'Ro‘yxatdan o‘tish', 'Register now')}
          <ArrowUpRight className="ml-2 size-5" />
        </Button>
      </div>
    </main>
  );
}
