import { useEffect, useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
  Award,
  CalendarDays,
  CalendarPlus,
  Clock,
  FileText,
  MapPin,
  Microscope,
  Phone,
  Sparkles,
  Stethoscope,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { CourseApplication } from '../components/course-application';
import { useLanguage, pageMeta } from '../lib/language';
import { TRICHOSCOPY_CALENDAR_URL, TRICHOSCOPY_COURSE as COURSE } from '../lib/courses';
import silyukPhoto from '../assets/tatiana-silyuk.webp';

export const Route = createFileRoute('/education_/trichoscopy')({
  head: () =>
    pageMeta(
      'Авторский курс по трихоскопии — Татьяна Силюк · 27–28 ноября 2026, Ташкент',
      'Авторский курс по трихоскопии Татьяны Силюк (ITS, РОИВ). 27–28 ноября 2026, Ташкент, Welness Hotel & Spa. Стоимость участия $800. Регистрация открыта.',
    ),
  component: Page,
});

function useDaysLeft(iso: string) {
  // Faqat klientda — SSR bilan farq bo'lmasligi uchun
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)));
  }, [iso]);
  return days;
}

function Page() {
  const { t } = useLanguage();
  const daysLeft = useDaysLeft(COURSE.startsAt);
  const instructorName = t(COURSE.instructor.nameRu, COURSE.instructor.nameUz, COURSE.instructor.nameEn);
  const dateLabel = t('27–28 ноября 2026', '2026-yil 27–28-noyabr', '27–28 November 2026');
  const cityLabel = t('Ташкент', 'Toshkent', 'Tashkent');

  const credentials = [
    {
      icon: Users,
      text: t(
        'Член правления Международного общества трихоскопии (ITS)',
        'Xalqaro trixoskopiya jamiyati (ITS) boshqaruv a’zosi',
        'Board member of the International Trichoscopy Society (ITS)',
      ),
    },
    {
      icon: FileText,
      text: t(
        'Руководитель клинического отдела Русского общества исследования волос (РОИВ / RHRS)',
        'Rus soch tadqiqotlari jamiyati (ROIV / RHRS) klinik bo‘limi rahbari',
        'Head of the clinical department of the Russian Hair Research Society (RHRS)',
      ),
    },
  ];

  const details = [
    { icon: CalendarDays, label: t('Даты', 'Sanalar', 'Dates'), value: dateLabel, note: t('2 дня', '2 kun', '2 days') },
    { icon: MapPin, label: t('Место', 'Joy', 'Venue'), value: COURSE.venue, note: t('Ташкент, Узбекистан', 'Toshkent, O‘zbekiston', 'Tashkent, Uzbekistan') },
    { icon: Wallet, label: t('Стоимость', 'Narx', 'Fee'), value: `$${COURSE.priceUsd}`, note: t('за участие в курсе', 'kursda ishtirok uchun', 'course participation') },
    { icon: Microscope, label: t('Формат', 'Format', 'Format'), value: t('Очно', 'Oflayn', 'In person'), note: t('авторская программа', 'mualliflik dasturi', 'author’s program') },
  ];

  const audience = [
    t('Трихологи', 'Trixologlar', 'Trichologists'),
    t('Дерматологи', 'Dermatologlar', 'Dermatologists'),
    t('Дерматокосметологи', 'Dermatokosmetologlar', 'Dermatocosmetologists'),
    t('Хирурги-трансплантологи волос', 'Soch transplantolog-jarrohlari', 'Hair transplant surgeons'),
    t('Ординаторы', 'Ordinatorlar', 'Residents'),
  ];

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">{t('Главная', 'Bosh sahifa', 'Home')}</Link>
        <span>/</span>
        <Link to="/education" className="hover:underline">{t('Обучение', 'Ta’lim', 'Education')}</Link>
        <span>/</span>
        <span className="font-medium text-foreground">{t('Трихоскопия', 'Trixoskopiya', 'Trichoscopy')}</span>
      </div>

      {/* Hero — afisha uslubida */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-violet-400/30 bg-[radial-gradient(ellipse_at_top_right,#7c3aed_0%,#3b0f8c_42%,#12062e_100%)] text-white shadow-2xl">
        <div aria-hidden className="pointer-events-none absolute -right-16 top-10 size-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 size-80 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:p-14 lg:pb-0">
          <div className="lg:pb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-100 backdrop-blur">
              <Sparkles className="size-3.5" />
              {t('Авторский курс', 'Mualliflik kursi', 'Author’s course')} · O‘zSTTA
            </div>

            <h1 className="mt-5 text-4xl font-light leading-[1.05] sm:text-6xl">
              {t('Авторский курс по', 'Mualliflik kursi:', 'Author’s course in')}
              <span className="mt-1 block bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text font-extrabold text-transparent">
                {t('трихоскопии', 'trixoskopiya', 'trichoscopy')}
              </span>
            </h1>

            <p className="mt-6 font-serif text-3xl font-bold sm:text-4xl">{instructorName}</p>

            <div className="mt-6 space-y-3">
              <p className="flex items-center gap-3 text-lg">
                <span className="flex size-10 items-center justify-center rounded-full border border-violet-300/40 bg-white/10"><CalendarDays className="size-5" /></span>
                {dateLabel}
              </p>
              <p className="flex items-center gap-3 text-lg">
                <span className="flex size-10 items-center justify-center rounded-full border border-violet-300/40 bg-white/10"><MapPin className="size-5" /></span>
                {cityLabel}, {COURSE.venue}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-sm text-violet-100/80">{t('Стоимость участия', 'Ishtirok narxi', 'Participation fee')}</p>
                <p className="mt-1 inline-block rounded-2xl border border-violet-300/50 bg-white/10 px-6 py-2 text-5xl font-extrabold shadow-[0_0_40px_-10px_rgba(167,139,250,0.8)]">
                  ${COURSE.priceUsd}
                </p>
              </div>
              {daysLeft !== null && daysLeft > 0 && (
                <p className="flex items-center gap-2 pb-3 text-sm text-violet-100/90">
                  <Clock className="size-4" />
                  {t(`До начала: ${daysLeft} дн.`, `Boshlanishiga: ${daysLeft} kun`, `Starts in ${daysLeft} days`)}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full bg-white px-6 font-bold text-[#3b0f8c] shadow-lg hover:bg-violet-50">
                <a href="#register">{t('Успейте зарегистрироваться', 'Ro‘yxatdan o‘tishga ulguring', 'Register now')} →</a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full border-white/30 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white">
                <a href={TRICHOSCOPY_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  <CalendarPlus className="size-4" />
                  {t('В календарь', 'Kalendarga', 'Add to calendar')}
                </a>
              </Button>
            </div>
          </div>

          {/* O'qituvchi surati va unvonlari */}
          <div className="relative mx-auto w-full max-w-sm self-end lg:max-w-none">
            <img
              src={silyukPhoto}
              alt={instructorName}
              width={436}
              height={860}
              fetchPriority="high"
              className="relative mx-auto h-[420px] w-auto rounded-t-full border border-b-0 border-violet-300/40 object-cover object-top shadow-[0_0_80px_-10px_rgba(167,139,250,0.8)] sm:h-[520px] [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
            />
            <div className="absolute bottom-6 left-0 right-0 mx-2 space-y-0 divide-y divide-white/15 rounded-2xl border border-violet-300/30 bg-[#1e0b4b]/75 p-4 text-sm backdrop-blur-md sm:left-auto sm:max-w-xs">
              {credentials.map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <Icon className="mt-0.5 size-5 shrink-0 text-violet-200" />
                  <span className="leading-snug text-violet-50">{text}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kurs tafsilotlari */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {details.map(({ icon: Icon, label, value, note }) => (
          <div key={label} className="event-card p-6">
            <Icon className="size-6 text-accent" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 font-serif text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>

      {/* O'qituvchi haqida */}
      <section className="mt-16 grid gap-10 border-t border-border pt-16 lg:grid-cols-2">
        <div>
          <p className="section-kicker">{t('Преподаватель', 'O‘qituvchi', 'Instructor')}</p>
          <h2 className="section-title mt-2">{instructorName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('Санкт-Петербург, Россия', 'Sankt-Peterburg, Rossiya', 'Saint Petersburg, Russia')}</p>
          <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
            {t(
              'Татьяна Силюк — один из ведущих экспертов в области трихоскопии. Член правления Международного общества трихоскопии (ITS) и руководитель клинического отдела Русского общества исследования волос (РОИВ). Со-президент II Международного конгресса PROHAIR 2026, где также провела пре-конгресс курс для специалистов.',
              'Tatyana Silyuk — trixoskopiya bo‘yicha yetakchi ekspertlardan biri. Xalqaro trixoskopiya jamiyati (ITS) boshqaruv a’zosi va Rus soch tadqiqotlari jamiyati (ROIV) klinik bo‘limi rahbari. II Xalqaro PROHAIR 2026 kongressining hamraisi bo‘lgan va unda mutaxassislar uchun pre-kongress kursini o‘tkazgan.',
              'Tatiana Silyuk is one of the leading experts in trichoscopy: a board member of the International Trichoscopy Society (ITS) and head of the clinical department of the Russian Hair Research Society (RHRS). She was co-president of the II International PROHAIR 2026 Congress, where she also taught a pre-congress course.',
            )}
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: Award, text: t('Член правления ITS — Международного общества трихоскопии', 'ITS — Xalqaro trixoskopiya jamiyati boshqaruv a’zosi', 'Board member of ITS — International Trichoscopy Society') },
            { icon: FileText, text: t('Руководитель клинического отдела РОИВ / RHRS', 'ROIV / RHRS klinik bo‘limi rahbari', 'Head of the clinical department, RHRS') },
            { icon: Sparkles, text: t('Со-президент II Международного конгресса PROHAIR 2026', 'II Xalqaro PROHAIR 2026 kongressi hamraisi', 'Co-president of the II International PROHAIR 2026 Congress') },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="event-card flex items-center gap-4 p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon className="size-5" /></span>
              <p className="font-semibold">{text}</p>
            </div>
          ))}

          <div className="event-card p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Stethoscope className="size-4 text-accent" />
              {t('Для кого курс', 'Kurs kimlar uchun', 'Who it is for')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {audience.map((a) => (
                <span key={a} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ro'yxatdan o'tish */}
      <section id="register" className="mt-16 scroll-mt-24 border-t border-border pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-[#3b0f8c] to-[#12062e] p-8 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-200">{t('Регистрация', 'Ro‘yxatdan o‘tish', 'Registration')}</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">{t('Успейте зарегистрироваться', 'Ro‘yxatdan o‘tishga ulguring', 'Secure your place')}</h2>
            <p className="mt-4 text-sm leading-7 text-violet-100/85">
              {t(
                'Оставьте заявку — координатор O‘zSTTA свяжется с вами для подтверждения участия и оплаты. Количество мест на авторском курсе ограничено.',
                'Ariza qoldiring — O‘zSTTA koordinatori ishtirok va to‘lovni tasdiqlash uchun siz bilan bog‘lanadi. Mualliflik kursida joylar soni cheklangan.',
                'Leave a request and the O‘zSTTA coordinator will contact you to confirm participation and payment. Seats on the author’s course are limited.',
              )}
            </p>
            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3"><dt className="text-violet-200">{t('Курс', 'Kurs', 'Course')}</dt><dd className="text-right font-semibold">{t('Авторский курс по трихоскопии', 'Trixoskopiya mualliflik kursi', 'Trichoscopy course')}</dd></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><dt className="text-violet-200">{t('Даты', 'Sanalar', 'Dates')}</dt><dd className="font-semibold">{dateLabel}</dd></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><dt className="text-violet-200">{t('Место', 'Joy', 'Venue')}</dt><dd className="text-right font-semibold">{cityLabel}, {COURSE.venue}</dd></div>
              <div className="flex items-baseline justify-between"><dt className="text-violet-200">{t('Стоимость', 'Narx', 'Fee')}</dt><dd className="text-3xl font-extrabold">${COURSE.priceUsd}</dd></div>
            </dl>
            <a href={`tel:${COURSE.phone.replace(/\s/g, '')}`} className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-lg font-semibold transition hover:bg-white/20">
              <Phone className="size-5" />
              {COURSE.phone}
            </a>
          </div>

          <div className="event-card p-6 sm:p-8">
            <CourseApplication
              bare
              course={COURSE.id}
              intro={t(
                'Заполните форму, и мы свяжемся с вами в ближайшее время.',
                'Shaklni to‘ldiring, tez orada siz bilan bog‘lanamiz.',
                'Fill out the form and we will contact you shortly.',
              )}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
