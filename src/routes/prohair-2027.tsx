import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage, pageMeta } from '../lib/language';
import congressImage from '../assets/prohair-congress.jpg';
import { PreRegistrationModal } from '../components/pre-registration-modal';

export const Route = createFileRoute('/prohair-2027')({
  head: () =>
    pageMeta(
      'PROHAIR 2027 — III Международный конгресс, Ташкент',
      'III Международный конгресс по трихологии и трансплантации волос PROHAIR 2027 в Ташкенте. Дата и площадка уточняются. Предварительная регистрация, научная программа и условия партнерства.',
    ),
  component: Page,
});

export function Page() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('doctor');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenRegister = (role: string = 'doctor') => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const stats = [
    ['2027', t('год проведения', 'o‘tkazilish yili', 'event year')],
    [t('Ташкент', 'Toshkent', 'Tashkent'), t('город проведения', 'o‘tkazilish shahri', 'host city')],
    ['2', t('дня программы (план)', 'kunlik dastur (reja)', 'days program (planned)')],
    [t('Открыто', 'Ochiq', 'Open'), t('предварительная бронь', 'dastlabki ro‘yxatdan o‘tish', 'pre-registration')],
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

  const planPreviews = [
    {
      id: 'early_bird',
      name: t('Early Bird Pass', 'Early Bird chiptasi', 'Early Bird Pass'),
      badge: t('Лист ожидания', 'Kutish ro‘yxati', 'Priority Waitlist'),
      desc: t('Специальная минимальная цена для участников, оформивших предварительную заявку до старта общих продаж.', 'Umumiy savdolar boshlanguncha dastlabki ariza qoldirgan ishtirokchilar uchun maxsus eng arzon narx.', 'Guaranteed best price for attendees who pre-register before public launch.'),
      features: [
        t('Доступ ко всем пленарным сессиям (2 дня)', 'Barcha plenar sessiyalarga 2 kunlik kirish', '2 days full access to plenary sessions'),
        t('Пакет участника и именной бейдж', 'Ishtirokchi paketi va nomli beydj', 'Delegate kit and personalized badge'),
        t('Кофе-брейки и нетворкинг', 'Kofe-breyklar va netvorking', 'Coffee breaks and networking'),
        t('Именной международный сертификат', 'Xalqaro sertifikat', 'Personalized international certificate'),
      ],
      action: t('Записаться в лист ожидания', 'Kutish ro‘yxatiga yozilish', 'Join Early Bird Waitlist'),
    },
    {
      id: 'member',
      name: t('Тариф O‘zSTTA Member', 'O‘zSTTA a’zolari uchun', 'O‘zSTTA Member Pass'),
      badge: t('Для членов ассоциации', 'Assotsiatsiya a’zolariga', 'Association Exclusive'),
      desc: t('Эксклюзивная субсидированная стоимость для действующих членов Ассоциации трихологов Узбекистана.', 'O‘zbekiston Trixologiya Assotsiatsiyasining amaldagi a’zolari uchun alohida imtiyozli tarif.', 'Exclusive discounted pricing for active O‘zSTTA association members.'),
      features: [
        t('Все привилегии делегата конгресса', 'Kongress delegatining barcha imtiyozlari', 'All standard delegate benefits'),
        t('Приоритетные места в главном зале', 'Bosh zalda birinchi qatorlardagi joylar', 'Priority seating in main auditorium'),
        t('Закрытый доступ к записям докладов', 'Ma’ruzalar yozuvlariga yopiq kirish', 'Access to recorded lectures'),
        t('Специальная скидка до 30%', '30% gacha maxsus chegirma', 'Up to 30% special discount'),
      ],
      action: t('Записаться как член O‘zSTTA', 'A’zo sifatida yozilish', 'Register as Member'),
    },
    {
      id: 'partner',
      name: t('Экспонент / Партнёр', 'Ko‘rgazma / Hamkor', 'Partner / Exhibitor'),
      badge: t('B2B и Спонсорство', 'B2B va homiylik', 'B2B & Sponsor'),
      desc: t('Презентация бренда, выставочный стенд, интеграция в научную программу и прямое общение с врачами.', 'Brend taqdimoti, ko‘rgazma stendi, ilmiy dasturga integratsiya va shifokorlar bilan to‘g‘ridan-to‘g‘ri muloqot.', 'Exhibition booth, brand presence, workshop integration, and direct doctor interaction.'),
      features: [
        t('Стенд на профильной выставке', 'Profil ko‘rgazmasida stend', 'Dedicated booth at industry expo'),
        t('Интеграция логотипа во все материалы', 'Barcha materiallarda logotip ko‘rsatilishi', 'Logo placement in all media'),
        t('Возможность доклада / сателлита', 'Ma’ruza / satellit simpozium imkoniyati', 'Scientific workshop opportunity'),
        t('Билеты для делегатов компании', 'Kompaniya vakillari uchun chiptalar', 'Company representative passes'),
      ],
      action: t('Запросить партнерский пакет', 'Hamkorlik paketini so‘rash', 'Request Partner Prospectus'),
    },
  ];

  const faqs = [
    {
      q: t('Когда и где пройдёт PROHAIR 2027?', 'PROHAIR 2027 qachon va qayerda bo‘lib o‘tadi?', 'When and where will PROHAIR 2027 take place?'),
      a: t(
        'III Международный конгресс PROHAIR 2027 состоится в Ташкенте в 2027 году. Точные даты и площадка проведения будут объявлены после согласования оргкомитетом O‘zSTTA.',
        'III Xalqaro PROHAIR 2027 kongressi 2027-yilda Toshkent shahrida bo‘lib o‘tadi. Aniq sanalar va o‘tkazilish manzili O‘zSTTA tashkiliy qo‘mitasi tomonidan tasdiqlangach e’lon qilinadi.',
        'The III International PROHAIR 2027 Congress will take place in Tashkent in 2027. Exact dates and venue will be announced once finalized by the O‘zSTTA organizing committee.'
      ),
    },
    {
      q: t('Что даёт предварительная регистрация?', 'Dastlabki ro‘yxatdan o‘tish nima beradi?', 'What are the benefits of pre-registering?'),
      a: t(
        'Предварительная регистрация вносит вас в приоритетный лист ожидания. Вы первыми получите уведомление об утверждении дат и научной программы, а также доступ к минимальным ценам раннего бронирования (Early Bird).',
        'Dastlabki ro‘yxatdan o‘tish sizni ustuvor kutish ro‘yxatiga kiritadi. Sanalar va ilmiy dastur tasdiqlanganda birinchilardan bo‘lib xabar olasiz hamda eng arzon Early Bird narxlaridan foydalanish imkoniyatiga ega bo‘lasiz.',
        'Pre-registration places you on the priority waitlist. You will be notified first when dates and program are finalized, and receive guaranteed early bird pricing.'
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

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">{t('Главная', 'Bosh sahifa', 'Home')}</Link>
        <span>/</span>
        <Link to="/events" className="hover:underline">{t('Мероприятия', 'Tadbirlar', 'Events')}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">PROHAIR 2027</span>
      </div>

      {/* Hero Header */}
      <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent mb-3">
            <Sparkles className="size-3.5" />
            {t('Международный конгресс', 'Xalqaro kongress', 'International Congress')}
          </div>
          <h1 className="section-title">PROHAIR 2027</h1>
          <p className="mt-2 font-serif text-2xl text-accent">
            {t('III Международный конгресс по трихологии и трансплантации волос', 'Trixologiya va soch transplantatsiyasi bo‘yicha III Xalqaro kongress', 'III International Congress on Trichology & Hair Restoration')}
          </p>
        </div>

        <Button
          onClick={() => handleOpenRegister('doctor')}
          className="h-12 rounded-xl bg-accent px-6 text-accent-foreground font-bold shadow-lg hover:bg-accent/90"
        >
          <Ticket className="size-4 mr-2" />
          {t('Подать предварительную заявку', 'Dastlabki ariza qoldirish', 'Pre-register for Congress')}
        </Button>
      </div>

      {/* Main 2-column info block */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-stretch">
        <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full overflow-hidden rounded-2xl border border-border shadow-xl">
          <img
            src={congressImage}
            alt={t('Конгресс PROHAIR 2027', 'PROHAIR 2027 kongressi', 'PROHAIR 2027 congress')}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4 z-10 rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow">
            {t('Ташкент · Дата уточняется', 'Toshkent · Sana aniqlanmoqda', 'Tashkent · Date to be announced')}
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/85 p-3.5 backdrop-blur-md border border-border/60 text-xs">
            <span className="font-bold text-accent">Tashkent, Uzbekistan</span> · {t('Главная сцена конгресса 2027', '2027-yilgi kongress bosh sahnasi', '2027 Congress Host City')}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-4">
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <CalendarDays className="size-5 text-accent shrink-0" />
              <span>{t('2027 год · Дата уточняется оргкомитетом', '2027-yil · Sana tashkiliy qo‘mita tomonidan tasdiqlanmoqda', '2027 · Date to be confirmed')}</span>
            </p>
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <MapPin className="size-5 text-accent shrink-0" />
              <span>{t('г. Ташкент, Узбекистан (площадка уточняется)', 'Toshkent shahri, O‘zbekiston (manzil aniqlanmoqda)', 'Tashkent, Uzbekistan (venue TBA)')}</span>
            </p>
            <p className="flex items-center gap-3 font-semibold text-foreground">
              <Users className="size-5 text-accent shrink-0" />
              <span>{t('Трихологи, дерматологи, пластические хирурги, руководители клиник', 'Trixologlar, dermatologlar, plastik jarrohlar, klinika rahbarlari', 'Trichologists, dermatologists, plastic surgeons, clinic directors')}</span>
            </p>
          </div>

          <p className="mt-6 leading-8 text-muted-foreground text-sm sm:text-base">
            {t(
              'Главное научно-практическое событие года в области трихологии в Центральной Азии возвращается в Ташкент. PROHAIR 2027 соберёт ведущих мировых учёных, врачей-практиков и лидеров индустрии. Программа, состав спикеров, стоимость билетов и партнёрские пакеты находятся в активной разработке. Оставьте предварительную заявку, чтобы первыми получить доступ к специальным ценам Early Bird и эксклюзивным новостям.',
              'Markaziy Osiyoda trixologiya sohasidagi yilning bosh ilmiy-amaliy voqeasi Toshkentga qaytmoqda. PROHAIR 2027 jahonning yetakchi olimlari, amaliyotchi shifokorlari va soha yetakchilarini birlashtiradi. Dastur, spikerlar tarkibi, chipta narxlari va homiylik paketlari faol tayyorlanmoqda. Early Bird maxsus narxlari va yangiliklardan birinchi bo‘lib xabardor bo‘lish uchun dastlabki arizangizni qoldiring.',
              'The premier trichology and hair restoration congress in Central Asia returns to Tashkent. PROHAIR 2027 will bring together leading international scientists, clinicians and industry pioneers. The scientific program, faculty lineup, ticket tiers, and partner packages are actively being prepared. Pre-register now to gain early access to Early Bird passes.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="#speakers">{t('Спикеры', 'Spikerlar', 'Speakers')}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#schedule">{t('Программа', 'Dastur', 'Program')}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#pricing">{t('Тарифы', 'Tariflar', 'Passes')}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#partners">{t('Партнерам', 'Hamkorlarga', 'Partners')}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Numbers */}
      <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
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
                'Программа PROHAIR 2027 объединит академическую теорию, клинические дискуссии и практические демонстрации. Почасовое расписание сессий будет опубликовано ближе к дате мероприятия.',
                'PROHAIR 2027 dasturi akademik nazariya, klinik muhokamalar va amaliy namoyishlarni birlashtiradi. Sessiyalarning soatbay jadvali tadbir arafasida e’lon qilinadi.',
                'The PROHAIR 2027 program will combine academic lectures, clinical discussions, and live masterclasses. A detailed timetable will be published prior to the event.'
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

      {/* Pricing / Passes Section */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="section-kicker">{t('Тарифы и билеты', 'Tariflar va chiptalar', 'Passes & Registration')}</p>
          <h2 className="section-title mt-2">
            {t('Условия участия и предварительная бронь', 'Ishtirok shartlari va dastlabki bron', 'Registration Passes & Early Bird')}
          </h2>
          <p className="mt-4 text-muted-foreground leading-7 text-sm sm:text-base">
            {t(
              'Официальные продажи билетов откроются после утверждения площадки и дат. Запишитесь в лист ожидания сейчас, чтобы зафиксировать специальную стоимость Early Bird.',
              'Rasmiy chiptalar savdosi manzil va sanalar tasdiqlangach ochiladi. Eng arzon Early Bird narxini o‘zingiz uchun kafolatlash uchun kutish ro‘yxatiga yoziling.',
              'Official ticket sales will commence once venue and dates are finalized. Join the waitlist today to secure special Early Bird pricing.'
            )}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {planPreviews.map((plan) => (
            <div key={plan.id} className="event-card p-8 flex flex-col justify-between relative">
              <div>
                <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent mb-4">
                  {plan.badge}
                </span>
                <h3 className="font-serif text-2xl font-bold">{plan.name}</h3>
                <p className="mt-3 text-xs text-muted-foreground leading-5">{plan.desc}</p>
                <div className="my-6 border-t border-border pt-6 space-y-3">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
                      <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleOpenRegister(plan.id === 'partner' ? 'partner' : 'doctor')}
                className="w-full h-12 mt-6 rounded-xl font-semibold"
                variant={plan.id === 'early_bird' ? 'default' : 'outline'}
              >
                {plan.action}
              </Button>
            </div>
          ))}
        </div>
      </section>

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
          <span className="text-xs font-bold uppercase tracking-widest text-accent">PROHAIR 2027 · TASHKENT</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
            {t('Будьте первыми в листе ожидания', 'Kutish ro‘yxatida birinchilardan bo‘ling', 'Join the Priority Waitlist')}
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 leading-6">
            {t(
              'Оставьте предварительную заявку прямо сейчас и зафиксируйте за собой право на специальные скидки Early Bird при открытии продаж.',
              'Hoziroq dastlabki ariza qoldiring va savdo boshlanganda maxsus Early Bird chegirmasidan foydalanish imkoniyatini saqlab qoling.',
              'Pre-register now to secure your access to exclusive Early Bird tickets once official registration opens.'
            )}
          </p>
        </div>
        <Button
          onClick={() => handleOpenRegister('doctor')}
          className="h-14 rounded-xl bg-accent px-8 text-accent-foreground font-bold text-base shadow-xl hover:bg-accent/90 shrink-0"
        >
          {t('Подать предварительную заявку', 'Dastlabki ariza qoldirish', 'Pre-register Now')}
          <ArrowUpRight className="ml-2 size-5" />
        </Button>
      </div>
    </main>
  );
}
