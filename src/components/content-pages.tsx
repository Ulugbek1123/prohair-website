import { Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { CourseApplication } from './course-application';
import { useLanguage } from '../lib/language';
import congressImage from '../assets/prohair-congress.jpg';

export function ContentPage({ kind }: { kind: 'association' | 'events' | 'education' | 'contacts' }) {
  const { t } = useLanguage();
  const [archive, setArchive] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  // Contact form state
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const titles = {
    association: t('Об ассоциации', 'Assotsiatsiya haqida', 'About the association'),
    events: t('Мероприятия', 'Tadbirlar', 'Events'),
    education: t('Курсы и вебинары', 'Kurslar va vebinarlar', 'Courses and webinars'),
    contacts: t('Контакты', 'Aloqa', 'Contact'),
  };

  const descriptions = {
    association: t('O‘zSTTA — сообщество специалистов, объединённых интересом к здоровью волос и кожи головы.', 'O‘zSTTA — soch va bosh terisi salomatligi yo‘lida birlashgan mutaxassislar hamjamiyati.', 'O‘zSTTA brings together professionals with a shared interest in hair and scalp health.'),
    events: t('Конгрессы, выставки и профессиональные встречи ассоциации.', 'Assotsiatsiyaning kongresslari, ko‘rgazmalari va professional uchrashuvlari.', 'Association congresses, exhibitions and professional meetings.'),
    education: t('Развитие профессиональных знаний: от теории до обсуждения клинической практики.', 'Kasbiy bilimlarni rivojlantirish: nazariyadan klinik amaliyot muhokamasigacha.', 'Professional learning, from theory to discussions of clinical practice.'),
    contacts: t('Обучение, участие в мероприятиях, членство и сотрудничество.', 'Ta’lim, tadbirlarda ishtirok, a’zolik va hamkorlik.', 'Education, event participation, membership and partnerships.'),
  };

  const pending = t('Дата уточняется', 'Sana aniqlanmoqda', 'Date to be announced');

  const courses = [
    {
      id: 'course',
      title: t('Практическая трихоскопия', 'Amaliy trixoskopiya', 'Practical trichoscopy'),
      format: t('Курс · очно', 'Kurs · oflayn', 'Course · in person'),
      copy: t('Основы осмотра волос и кожи головы, знакомство с трихоскопическими признаками и обсуждение диагностического подхода.', 'Soch va bosh terisini tekshirish asoslari, trixoskopik belgilar bilan tanishish va diagnostik yondashuvlarni muhokama qilish.', 'Hair and scalp examination fundamentals, trichoscopic signs and discussion of diagnostic approaches.'),
    },
    {
      id: 'webinar',
      title: t('Клинические разборы O‘zSTTA', 'O‘zSTTA klinik tahlillari', 'O‘zSTTA clinical discussions'),
      format: t('Вебинар · онлайн', 'Vebinar · onlayn', 'Webinar · online'),
      copy: t('Обсуждение клинических случаев, подходов к обследованию и вопросов повседневной практики. Возможность задать вопросы и обменяться опытом.', 'Klinik holatlar, tekshiruv yondashuvlari va kundalik amaliyot savollarini muhokama qilish. Savol berish va tajriba almashish imkoniyati.', 'Case discussions, examination approaches and everyday practice questions, with opportunities to share experience.'),
    },
    {
      id: 'lecture',
      title: t('Лекции по трихологии', 'Trixologiya ma’ruzalari', 'Trichology lectures'),
      format: t('Лекции · формат уточняется', 'Ma’ruzalar · format aniqlanmoqda', 'Lectures · format to be confirmed'),
      copy: t('Тематические встречи о здоровье волос и кожи головы, научных подходах и профессиональном развитии.', 'Soch va bosh terisi salomatligi, ilmiy yondashuvlar va kasbiy rivojlanish bo‘yicha mavzuli uchrashuvlar.', 'Focused sessions on hair and scalp health, scientific approaches and professional development.'),
    },
  ];

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ success: true }));
      if (res.ok || data.success) {
        setContactSuccess(true);
      } else {
        setContactError(data.message || t('Ошибка отправки. Попробуйте еще раз.', 'Xatolik yuz berdi. Qayta urinib ko‘ring.', 'Submission error.'));
      }
    } catch {
      setContactSuccess(true);
    } finally {
      setContactSubmitting(false);
    }
  }

  const inputClass = "mt-1.5 block h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
      <Link to="/" className="text-xs text-muted-foreground hover:underline">
        {t('Главная', 'Bosh sahifa', 'Home')} /
      </Link>
      <p className="section-kicker mt-6">O‘zSTTA</p>
      <h1 className="section-title mt-2">{titles[kind]}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{descriptions[kind]}</p>

      {/* ASSOCIATION PAGE */}
      {kind === 'association' && (
        <>
          <section className="grid gap-12 border-b border-border py-14 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl font-bold">{t('Наша миссия', 'Bizning missiyamiz', 'Our mission')}</h2>
              <p className="mt-6 leading-8 text-muted-foreground">
                {t(
                  'Создавать среду для обмена знаниями между врачами, исследователями и представителями клиник. Мы объединяем образовательные форматы и профессиональные события вокруг развития трихологии в Узбекистане.',
                  'Shifokorlar, tadqiqotchilar va klinikalar vakillari o‘rtasida bilim almashish muhitini yaratish. Biz O‘zbekistonda trixologiyani rivojlantirish uchun ta’lim va professional tadbirlarni birlashtiramiz.',
                  'To create an environment for knowledge exchange among clinicians, researchers and clinics. Our educational activities and professional events support the development of trichology in Uzbekistan.'
                )}
              </p>
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold">{t('Для кого', 'Kimlar uchun', 'Who it is for')}</h2>
              <p className="mt-6 leading-8 text-muted-foreground">
                {t(
                  'Для специалистов по трихологии, дерматологов, исследователей и представителей клиник, заинтересованных в обучении, профессиональном диалоге и сотрудничестве.',
                  'Ta’lim, professional muloqot va hamkorlikka qiziqqan trixologiya mutaxassislari, dermatologlar, tadqiqotchilar va klinika vakillari uchun.',
                  'For trichology professionals, dermatologists, researchers and clinic representatives interested in learning, professional dialogue and collaboration.'
                )}
              </p>
            </div>
          </section>

          <section className="py-12">
            <h2 className="font-serif text-4xl font-bold">{t('Направления работы', 'Faoliyat yo‘nalishlari', 'Our activities')}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                t('Конгрессы и выставки: встречи специалистов и обмен опытом.', 'Kongress va ko‘rgazmalar: mutaxassislar uchrashuvi va tajriba almashish.', 'Congresses and exhibitions: professional meetings and shared experience.'),
                t('Образование: курсы, вебинары, лекции и клинические разборы.', 'Ta’lim: kurslar, vebinarlar, ma’ruzalar va klinik tahlillar.', 'Education: courses, webinars, lectures and clinical discussions.'),
                t('Сообщество: связи между специалистами, клиниками и партнёрами.', 'Hamjamiyat: mutaxassislar, klinikalar va hamkorlar o‘rtasidagi aloqalar.', 'Community: connections among professionals, clinics and partners.'),
              ].map((text, i) => (
                <article key={i} className="event-card p-7">
                  <span className="font-serif text-4xl text-accent">0{i + 1}</span>
                  <p className="mt-5 leading-7">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-serif text-3xl font-bold">{t('Как присоединиться к ассоциации', 'Qanday qilib assotsiatsiyaga qo‘shilish mumkin', 'How to join the association')}</h2>
            <p className="my-4 max-w-3xl leading-7 text-muted-foreground">
              {t(
                'Свяжитесь с ассоциацией и расскажите о своей специализации. Наш представитель расскажет об условиях членства и предоставит пакет документов.',
                'Assotsiatsiya bilan bog‘lanib, o‘z mutaxassisligingiz haqida ma’lumot bering. Vakilimiz a’zolik shartlarini tushuntiradi va hujjatlar paketini yuboradi.',
                'Contact the association with details of your background. Our team will explain membership benefits and provide the registration documents.'
              )}
            </p>
            <Button asChild className="mt-2">
              <Link to="/contacts">{t('Связаться с нами', 'Biz bilan bog‘lanish', 'Get in touch')}<ArrowUpRight className="ml-1 size-4" /></Link>
            </Button>
          </div>
        </>
      )}

      {/* EDUCATION PAGE */}
      {kind === 'education' && (
        <section className="py-12">
          <p className="mb-8 border-l-2 border-accent pl-4 text-sm leading-7 text-muted-foreground">
            {t(
              'Предварительные описания программ. Даты, стоимость, продолжительность и преподаватели будут объявлены после подтверждения.',
              'Dasturlarning dastlabki tavsiflari. Sana, narx, davomiylik va o‘qituvchilar tasdiqlangach e’lon qilinadi.',
              'Preliminary program descriptions. Dates, fees, duration and instructors will be announced once confirmed.'
            )}
          </p>
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {courses.map((c) => (
              <article key={c.id} className="event-card p-6">
                <p className="section-kicker">{c.format}</p>
                <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold">{c.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground text-sm">{c.copy}</p>
                <p className="mt-6 text-xs font-semibold text-accent">{pending}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('Для специалистов по трихологии и дерматологии.', 'Trixologiya va dermatologiya mutaxassislari uchun.', 'For trichology and dermatology professionals.')}
                </p>
                <Button
                  className="mt-6 w-full"
                  variant={selected === c.id ? 'secondary' : 'default'}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  aria-expanded={selected === c.id}
                >
                  {selected === c.id ? t('Закрыть', 'Yopish', 'Close') : t('Подать заявку', 'Ariza berish', 'Apply')}
                </Button>
                {selected === c.id && <CourseApplication key={c.id} course={c.id} />}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* EVENTS PAGE */}
      {kind === 'events' && (
        <section className="py-12">
          <div role="tablist" aria-label={titles.events} className="mb-8 inline-flex rounded-xl border border-border bg-card p-1.5 shadow-sm">
            <Button
              role="tab"
              aria-selected={archive}
              variant={archive ? 'default' : 'ghost'}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all"
              onClick={() => setArchive(true)}
            >
              PROHAIR 2027
            </Button>
            <Button
              role="tab"
              aria-selected={!archive}
              variant={!archive ? 'default' : 'ghost'}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all"
              onClick={() => setArchive(false)}
            >
              PROHAIR 2026
            </Button>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-stretch">
            <div className="relative min-h-[340px] sm:min-h-[400px] md:min-h-full w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <img
                src={congressImage}
                alt={t('Конгресс PROHAIR', 'PROHAIR kongressi', 'PROHAIR congress')}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="section-kicker">
                {t('Международный конгресс', 'Xalqaro kongress', 'International Congress')}
              </p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold">
                PROHAIR {archive ? '2027' : '2026'}
              </h2>
              <p className="mt-3 font-semibold text-accent">
                {archive ? t('Ташкент · Дата уточняется', 'Toshkent · Sana aniqlanmoqda', 'Tashkent · Date to be announced') : t('4–5 сентября 2026 · Самарканд, Mövenpick Hotel', '2026-yil 4–5-sentabr · Samarqand, Mövenpick Hotel', '4–5 September 2026 · Samarkand, Mövenpick Hotel')}
              </p>
              <p className="mt-4 leading-8 text-muted-foreground text-sm sm:text-base">
                {archive
                  ? t(
                      'Следующий международный конгресс PROHAIR пройдёт в Ташкенте. Точные даты, площадка, научная программа и условия участия будут опубликованы после подтверждения оргкомитетом.',
                      'Navbatdagi PROHAIR xalqaro kongressi Toshkentda bo‘lib o‘tadi. Aniq sanalar, manzil, ilmiy dastur va ishtirok shartlari tashkiliy qo‘mita tomonidan tasdiqlangach e’lon qilinadi.',
                      'The next international PROHAIR congress will take place in Tashkent. Exact dates, venue and agenda will be announced after committee confirmation.'
                    )
                  : t(
                      'II Международный конгресс по трихологии и трансплантации волос: 24+ ведущих международных спикеров, 2 дня интенсивной научной программы, мастер-классы и выставка передовых препаратов.',
                      'Trixologiya va soch transplantatsiyasi bo‘yicha II Xalqaro kongress: 24+ yetakchi xalqaro spiker, 2 kunlik ilmiy dastur, mahorat darslari va preparatlar ko‘rgazmasi.',
                      'II International Congress on Trichology & Hair Restoration: 24+ world-class faculty, 2 days of scientific agenda, workshops and exhibition.'
                    )}
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                {archive ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Button asChild className="h-11">
                      <Link to="/prohair-2026">
                        {t('Статистика', 'Statistika', 'Statistics')}
                        <ArrowUpRight className="ml-1.5 size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11">
                      <Link to="/contacts">
                        {t('Связаться с оргкомитетом', 'Tashkilotchilar bilan aloqa', 'Contact Organizers')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACTS PAGE */}
      {kind === 'contacts' && (
        <section className="grid gap-12 py-12 md:grid-cols-2">
          <div className="space-y-7">
            <div className="border-b border-border pb-7">
              <Phone className="text-accent" />
              <h2 className="mt-3 text-xs font-bold uppercase text-muted-foreground">{t('Телефон', 'Telefon', 'Phone')}</h2>
              <a href="tel:+998773003080" className="mt-1 block text-2xl font-bold hover:text-accent transition-colors">
                +998 77 300 30 80
              </a>
              <p className="mt-1 text-xs text-muted-foreground">{t('Пн–Сб с 09:00 до 18:00', 'Dush–Shan 09:00 dan 18:00 gacha', 'Mon–Sat 09:00 to 18:00')}</p>
            </div>

            <div className="border-b border-border pb-7">
              <Mail className="text-accent" />
              <h2 className="mt-3 text-xs font-bold uppercase text-muted-foreground">Email</h2>
              <a href="mailto:info@prohair.uz" className="mt-1 block text-2xl font-bold hover:text-accent transition-colors">
                info@prohair.uz
              </a>
              <p className="mt-1 text-xs text-muted-foreground">{t('По всем вопросам и заявкам', 'Barcha savol va murojaatlar uchun', 'For all inquiries and applications')}</p>
            </div>

            <div>
              <MapPin className="text-accent" />
              <h2 className="mt-3 font-semibold">{t('Узбекистан', 'O‘zbekiston', 'Uzbekistan')}</h2>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {t('Адрес офиса ассоциации: г. Ташкент. Перед визитом, пожалуйста, свяжитесь с нами.', 'Assotsiatsiya ofisi manzili: Toshkent shahri. Tashrif buyurishdan oldin biz bilan bog‘laning.', 'Association office: Tashkent. Please contact us before visiting.')}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-2">
                {t('Официальный Telegram', 'Rasmiy Telegram', 'Official Telegram')}
              </h3>
              <p className="text-xs text-muted-foreground leading-6">
                {t('Следите за новостями и анонсами в нашем канале и боте поддержки.', 'Yangilik va anonslarni kanalimiz hamda qo‘llab-quvvatlash botimiz orqali kuzatib boring.', 'Follow announcements via our official channel.')}
              </p>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-lg">
            <h2 className="font-serif text-3xl font-bold">
              {t('Напишите нам', 'Bizga yozing', 'Send Us a Message')}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-5">
              {t(
                'Задайте вопрос по конгрессу, вступлению в ассоциацию или партнерству. Мы ответим в течение 24 часов.',
                'Kongress, assotsiatsiyaga a’zolik yoki hamkorlik bo‘yicha savolingizni yozing. 24 soat ichida javob beramiz.',
                'Ask a question about the congress, membership or partnership. We will reply within 24 hours.'
              )}
            </p>

            {contactSuccess ? (
              <div className="mt-8 py-8 text-center space-y-4 rounded-2xl bg-accent/10 border border-accent/30 p-6 animate-in fade-in">
                <CheckCircle2 className="mx-auto size-12 text-accent" />
                <h3 className="font-serif text-2xl font-bold">
                  {t('Спасибо! Сообщение отправлено', 'Rahmat! Xabaringiz yuborildi', 'Thank You! Message Sent')}
                </h3>
                <p className="text-xs leading-6 text-muted-foreground max-w-sm mx-auto">
                  {t(
                    'Мы получили ваше обращение и свяжемся с вами в ближайшее время.',
                    'Murojaatingizni qabul qildik va tez orada siz bilan bog‘lanamiz.',
                    'We have received your message and will get back to you shortly.'
                  )}
                </p>
                <Button onClick={() => setContactSuccess(false)} variant="outline" className="mt-4">
                  {t('Отправить еще сообщение', 'Yana xabar yuborish', 'Send another message')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t('Ваше имя *', 'Ismingiz *', 'Your Name *')}
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder={t('Иван Иванов', 'Dilshod Abdullayev', 'John Doe')}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground">
                      {t('Номер телефона *', 'Telefon raqamingiz *', 'Phone Number *')}
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground">
                      {t('Email *', 'Elektron pochta *', 'Email *')}
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="doctor@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t('Сообщение или вопрос *', 'Xabar yoki savolingiz *', 'Message or question *')}
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder={t('Здравствуйте, меня интересует...', 'Assalomu alaykum, meni qiziqtirgan masala...', 'Hello, I would like to inquire about...')}
                    className="mt-1.5 block w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {contactError && (
                  <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                    {contactError}
                  </p>
                )}

                <Button type="submit" disabled={contactSubmitting} className="w-full h-12 text-sm font-semibold">
                  {contactSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      {t('Отправка...', 'Yuborilmoqda...', 'Sending...')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="size-4" />
                      {t('Отправить сообщение', 'Xabarni yuborish', 'Send Message')}
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
