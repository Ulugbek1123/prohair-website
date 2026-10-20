import { useEffect, useState } from "react";
import { BadgeCheck, CreditCard, Gift, Globe2, Ticket, UtensilsCrossed } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../lib/language";
import {
  BASE_CATEGORIES,
  PRICING,
  formatDayMonth,
  galaDeadline,
  getPeriodIndex,
  todayInTashkent,
  type PeriodId,
  type Residency,
} from "../lib/prohair-2027";
import { categoryLabel, periodLabel, type Registration2027Selection } from "./congress-2027-registration-modal";

const CATEGORY_ICONS = { member: "🔹", non_member: "🔸", one_day: "⏱", student: "🎓" } as const;

interface Props {
  onRegister: (selection: Registration2027Selection) => void;
  onJoinAssociation: () => void;
}

export function Pricing2027Section({ onRegister, onJoinAssociation }: Props) {
  const { t } = useLanguage();
  const [residency, setResidency] = useState<Residency>("resident");
  // Joriy davr faqat klientda aniqlanadi (SSR bilan farq bo'lmasligi uchun)
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayInTashkent()), []);

  const currentIndex = today ? getPeriodIndex(today) : -1;
  const prices = PRICING.prices[residency];
  const membershipBonusOpen = !today || today <= PRICING.membership.earlyDeadline;

  const periodCaption = (i: number) => {
    const p = PRICING.periods[i];
    if (!p) return "";
    if ("displayUntil" in p && p.displayUntil) return t(`до ${formatDayMonth(p.displayUntil)}`, `${formatDayMonth(p.displayUntil)} gacha`, `until ${formatDayMonth(p.displayUntil)}`);
    if ("from" in p && p.from) return t(`с ${formatDayMonth(p.from)}`, `${formatDayMonth(p.from)} dan`, `from ${formatDayMonth(p.from)}`);
    return "";
  };

  const nowBadge = (
    <span className="ml-1.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
      {t("сейчас", "hozir", "now")}
    </span>
  );

  return (
    <section id="pricing" className="border-t border-border py-20">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="section-kicker">{t("Стоимость участия", "Ishtirok narxi", "Registration fees")}</p>
        <h2 className="section-title mt-2">{t("Регистрация открыта", "Ro‘yxatdan o‘tish ochiq", "Registration is open")}</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {t(
            "Чем раньше регистрация — тем ниже стоимость. Цены указаны в долларах США; возможна оплата на месте.",
            "Qancha erta ro‘yxatdan o‘tsangiz, narx shuncha arzon. Narxlar AQSh dollarida; joyida to‘lash ham mumkin.",
            "The earlier you register, the lower the fee. Prices are in USD; on-site payment is possible.",
          )}
        </p>

        <div className="mt-8 inline-grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-sm" role="tablist">
          {(["resident", "non_resident"] as const).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={residency === r}
              onClick={() => setResidency(r)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:px-6 ${
                residency === r ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "resident" ? t("Резиденты", "Rezidentlar", "Residents") : t("Нерезиденты", "Norezidentlar", "Non-residents")}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {residency === "resident"
            ? t("Специалисты из Узбекистана", "O‘zbekistonlik mutaxassislar", "Specialists from Uzbekistan")
            : t("Иностранные специалисты", "Xorijiy mutaxassislar", "Foreign specialists")}
        </p>
      </div>

      {/* Desktop: jadval */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4 font-semibold">{t("Категория билета", "Chipta toifasi", "Ticket category")}</th>
              {PRICING.periods.map((p, i) => (
                <th key={p.id} className={`px-4 py-4 text-center font-semibold ${i === currentIndex ? "bg-accent/15 text-foreground" : ""}`}>
                  {periodLabel(t, p.id as PeriodId)}
                  {i === currentIndex && nowBadge}
                  <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal">{periodCaption(i)}</span>
                </th>
              ))}
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {BASE_CATEGORIES.map((c) => (
              <tr key={c} className="border-b border-border/60 last:border-0">
                <td className="px-6 py-5 font-semibold">
                  <span className="mr-2" aria-hidden>{CATEGORY_ICONS[c]}</span>
                  {categoryLabel(t, c)}
                </td>
                {prices[c].map((price, i) => (
                  <td
                    key={i}
                    className={`px-4 py-5 text-center font-serif text-2xl font-bold ${
                      i === currentIndex ? "bg-accent/10 text-accent" : i < currentIndex ? "text-muted-foreground/50 line-through" : "text-foreground"
                    }`}
                  >
                    ${price}
                  </td>
                ))}
                <td className="px-6 py-5 text-right">
                  <Button size="sm" onClick={() => onRegister({ residency, category: c })} className="rounded-lg">
                    {t("Выбрать", "Tanlash", "Select")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil: kartalar */}
      <div className="grid gap-4 md:hidden">
        {BASE_CATEGORIES.map((c) => (
          <article key={c} className="event-card p-5">
            <h3 className="font-semibold">
              <span className="mr-2" aria-hidden>{CATEGORY_ICONS[c]}</span>
              {categoryLabel(t, c)}
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {prices[c].map((price, i) => {
                const p = PRICING.periods[i];
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-2.5 text-center ${
                      i === currentIndex ? "border-accent bg-accent/10" : "border-border"
                    } ${i < currentIndex ? "opacity-50" : ""}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {p ? periodLabel(t, p.id as PeriodId) : ""}
                    </p>
                    <p className={`mt-1 font-serif text-xl font-bold ${i === currentIndex ? "text-accent" : ""} ${i < currentIndex ? "line-through" : ""}`}>
                      ${price}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{periodCaption(i)}</p>
                  </div>
                );
              })}
            </div>
            <Button onClick={() => onRegister({ residency, category: c })} className="mt-4 h-11 w-full rounded-xl">
              <Ticket className="size-4" />
              {t("Зарегистрироваться", "Ro‘yxatdan o‘tish", "Register")}
            </Button>
          </article>
        ))}
      </div>

      {/* Qo'shimcha shartlar */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="event-card flex flex-col p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Globe2 className="size-5" /></span>
            <h3 className="font-serif text-xl font-bold">{t("Члены РОИВ", "ROIV a’zolari", "ROIV members")}</h3>
          </div>
          <p className="mt-4 font-serif text-4xl font-bold text-accent">${PRICING.roiv.price}</p>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
            {t(
              "Специальная фиксированная цена — действует на протяжении всего периода регистрации (до 20.08.2027).",
              "Maxsus qat’iy narx — butun ro‘yxatdan o‘tish davomida amal qiladi (20.08.2027 gacha).",
              "Special fixed price — valid throughout the registration period (until 20.08.2027).",
            )}
          </p>
          <Button variant="outline" onClick={() => onRegister({ residency: "non_resident", category: "roiv" })} className="mt-5 h-11 rounded-xl">
            {t("Регистрация РОИВ", "ROIV ro‘yxati", "Register as ROIV")}
          </Button>
        </article>

        <article className="event-card flex flex-col p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><UtensilsCrossed className="size-5" /></span>
            <h3 className="font-serif text-xl font-bold">{t("Гала-ужин конгресса", "Kongress gala-kechasi", "Congress gala dinner")}</h3>
          </div>
          <p className="mt-4 font-serif text-4xl font-bold text-accent">${PRICING.galaDinner.price}</p>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
            {t(
              `Важно: бронирование и оплата билетов на гала-ужин закрываются строго за 5 дней до начала мероприятия (${formatDayMonth(galaDeadline())}.2027). Добавляется при регистрации.`,
              `Muhim: gala-kecha chiptalarini bron qilish va to‘lash tadbir boshlanishidan qat’iy 5 kun oldin yopiladi (${formatDayMonth(galaDeadline())}.2027). Ro‘yxatdan o‘tishda qo‘shiladi.`,
              `Important: gala dinner booking and payment close strictly 5 days before the event (${formatDayMonth(galaDeadline())}.2027). Added during registration.`,
            )}
          </p>
        </article>

        <article className="event-card flex flex-col border-accent/40 p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><BadgeCheck className="size-5" /></span>
            <h3 className="font-serif text-xl font-bold">{t("Членство O‘zSTTA 2027", "O‘zSTTA a’zoligi 2027", "O‘zSTTA membership 2027")}</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="font-serif text-3xl font-bold text-accent">${PRICING.membership.resident}</p>
              <p className="text-xs text-muted-foreground">{t("резиденты Узбекистана", "O‘zbekiston rezidentlari", "residents of Uzbekistan")}</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-accent">${PRICING.membership.non_resident}</p>
              <p className="text-xs text-muted-foreground">{t("нерезиденты", "norezidentlar", "non-residents")}</p>
            </div>
          </div>
          {membershipBonusOpen && (
            <div className="mt-4 flex-1 rounded-xl bg-accent/10 p-3 text-sm leading-6">
              <p className="flex items-center gap-1.5 font-semibold">
                <Gift className="size-4 text-accent" />
                {t("Оформите до 31.12.2026 и получите:", "31.12.2026 gacha rasmiylashtiring va oling:", "Join before 31.12.2026 and get:")}
              </p>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                <li>{t("скидку 10% на участие в Конгрессе 2027", "Kongress 2027 ishtirokiga 10% chegirma", "10% off the 2027 Congress")}</li>
                <li>{t("скидку 10% на все образовательные курсы 2027", "2027-yildagi barcha ta’lim kurslariga 10% chegirma", "10% off all 2027 educational courses")}</li>
              </ul>
            </div>
          )}
          <Button onClick={onJoinAssociation} className="mt-5 h-11 rounded-xl">
            {t("Вступить в O‘zSTTA", "O‘zSTTA ga a’zo bo‘lish", "Join O‘zSTTA")}
          </Button>
        </article>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <CreditCard className="size-4 text-accent" />
        {t(
          "Оплата производится после подтверждения заявки оргкомитетом. Возможна оплата на месте.",
          "To‘lov ariza tashkiliy qo‘mita tomonidan tasdiqlangach amalga oshiriladi. Joyida to‘lash ham mumkin.",
          "Payment is made after the committee confirms your application. On-site payment is possible.",
        )}
      </p>
    </section>
  );
}
