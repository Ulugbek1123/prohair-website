import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, CalendarDays, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { TRICHOSCOPY_COURSE as COURSE } from '../lib/courses';
import silyukPhoto from '../assets/tatiana-silyuk.webp';

// Kurs anonsi kartochkasi — bosh sahifa va Ta'lim sahifasida ishlatiladi
export function TrichoscopyCourseCard({ kicker }: { kicker?: string }) {
  const { t } = useLanguage();
  // Faqat klientda hisoblanadi (SSR bilan farq bo'lmasligi uchun)
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    setDaysLeft(Math.ceil((new Date(COURSE.startsAt).getTime() - Date.now()) / 86_400_000));
  }, []);

  return (
    <Link
      to="/education/trichoscopy"
      className="group relative grid overflow-hidden rounded-3xl border border-violet-400/30 bg-[radial-gradient(ellipse_at_top_right,#7c3aed_0%,#3b0f8c_45%,#12062e_100%)] text-white shadow-2xl transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[1.3fr_0.7fr]"
    >
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-100">
            {kicker ?? t('Авторский курс · очно', 'Mualliflik kursi · oflayn', 'Author’s course · in person')}
          </span>
          {daysLeft !== null && daysLeft > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-400/20 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Clock className="size-3.5" />
              {t(`через ${daysLeft} дн.`, `${daysLeft} kundan so‘ng`, `in ${daysLeft} days`)}
            </span>
          )}
        </div>
        <h2 className="mt-5 text-3xl font-light leading-tight sm:text-5xl">
          {t('Авторский курс по', 'Mualliflik kursi:', 'Author’s course in')}{' '}
          <b className="font-extrabold">{t('трихоскопии', 'trixoskopiya', 'trichoscopy')}</b>
        </h2>
        <p className="mt-4 font-serif text-2xl font-bold">{t('Татьяна Силюк', 'Tatyana Silyuk', 'Tatiana Silyuk')}</p>
        <p className="mt-1 text-sm text-violet-100/80">
          {t(
            'Член правления ITS · руководитель клинического отдела РОИВ',
            'ITS boshqaruv a’zosi · ROIV klinik bo‘limi rahbari',
            'ITS board member · head of the RHRS clinical department',
          )}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-violet-200" />
            {t('27–28 ноября 2026', '2026-yil 27–28-noyabr', '27–28 November 2026')}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-violet-200" />
            {t('Ташкент', 'Toshkent', 'Tashkent')}, {COURSE.venue}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="rounded-2xl border border-violet-300/50 bg-white/10 px-5 py-1.5 text-3xl font-extrabold">${COURSE.priceUsd}</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3b0f8c] transition group-hover:bg-violet-50">
            {t('Подробнее и регистрация', 'Batafsil va ro‘yxatdan o‘tish', 'Details & registration')}
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
      <div className="relative hidden min-h-[320px] md:block">
        <img
          src={silyukPhoto}
          alt={t('Татьяна Силюк', 'Tatyana Silyuk', 'Tatiana Silyuk')}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 [mask-image:linear-gradient(to_left,black_70%,transparent)]"
        />
      </div>
    </Link>
  );
}
