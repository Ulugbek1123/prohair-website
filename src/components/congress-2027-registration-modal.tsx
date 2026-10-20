import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Ticket, UtensilsCrossed, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../lib/language";
import { apiUrl } from "../lib/api-client";
import {
  BASE_CATEGORIES,
  CONGRESS_DAYS,
  PRICING,
  formatDayMonth,
  galaDeadline,
  getPeriodId,
  isGalaAvailable,
  isRoivAvailable,
  ticketPrice,
  todayInTashkent,
  type PeriodId,
  type Residency,
  type TicketCategory,
} from "../lib/prohair-2027";

type T = (ru: string, uz: string, en: string) => string;

export function categoryLabel(t: T, category: TicketCategory): string {
  switch (category) {
    case "member":
      return t("Члены O‘zSTTA", "O‘zSTTA a’zolari", "O‘zSTTA members");
    case "non_member":
      return t("Не члены O‘zSTTA", "O‘zSTTA a’zosi emaslar", "Non-members of O‘zSTTA");
    case "one_day":
      return t("Билет на 1 день", "1 kunlik chipta", "One-day ticket");
    case "student":
      return t("Студенты / Ординаторы", "Talabalar / Ordinatorlar", "Students / Residents");
    case "roiv":
      return t("Члены РОИВ", "ROIV a’zolari", "ROIV members");
  }
}

export function residencyLabel(t: T, residency: Residency): string {
  return residency === "resident"
    ? t("Резидент Узбекистана", "O‘zbekiston rezidenti", "Resident of Uzbekistan")
    : t("Нерезидент (иностранный специалист)", "Norezident (xorijiy mutaxassis)", "Non-resident (foreign specialist)");
}

export function periodLabel(t: T, period: PeriodId): string {
  switch (period) {
    case "early":
      return t("Ранняя", "Erta", "Early");
    case "standard":
      return t("Стандарт", "Standart", "Standard");
    case "late":
      return t("Поздняя", "Kech", "Late");
  }
}

const COUNTRIES = [
  "Узбекистан",
  "Казахстан",
  "Кыргызстан",
  "Таджикистан",
  "Туркменистан",
  "Россия",
  "Азербайджан",
  "Армения",
  "Беларусь",
  "Грузия",
  "Турция",
  "ОАЭ",
  "Другое / Other",
];

const FALLBACK_RATE = 12100;

export interface Registration2027Selection {
  residency: Residency;
  category: TicketCategory;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initial?: Registration2027Selection | null;
}

export function Congress2027RegistrationModal({ isOpen, onClose, initial }: Props) {
  const { t } = useLanguage();
  const [residency, setResidency] = useState<Residency>(initial?.residency ?? "resident");
  const [category, setCategory] = useState<TicketCategory>(initial?.category ?? "non_member");
  const [day, setDay] = useState<string>(CONGRESS_DAYS[0]);
  const [gala, setGala] = useState(false);
  const [rate, setRate] = useState(FALLBACK_RATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Har safar ochilganda tanlangan tarifni qayta o'rnatamiz
  useEffect(() => {
    if (!isOpen) return;
    setResidency(initial?.residency ?? "resident");
    setCategory(initial?.category ?? "non_member");
    setResult(null);
    setErrorMessage("");
  }, [isOpen, initial]);

  useEffect(() => {
    if (!isOpen) return;
    fetch(apiUrl("/api/get-rate"))
      .then((r) => r.json())
      .then((d) => typeof d?.rate === "number" && setRate(d.rate))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const today = todayInTashkent();
  const period = getPeriodId(today);
  const roivOpen = isRoivAvailable(today);
  const galaOpen = isGalaAvailable(today);
  const categories: TicketCategory[] = [
    ...BASE_CATEGORIES,
    ...(residency === "non_resident" && roivOpen ? (["roiv"] as const) : []),
  ];
  const activeCategory = categories.includes(category) ? category : "non_member";
  const ticket = ticketPrice(residency, activeCategory, today) ?? 0;
  const galaPrice = gala && galaOpen ? PRICING.galaDinner.price : 0;
  const total = ticket + galaPrice;
  const fmtUzs = (usd: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(usd * rate));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      city: (formData.get("city") as string) || "",
      specialty: (formData.get("specialty") as string) || "",
      comment: (formData.get("comment") as string) || "",
      residency,
      category: activeCategory,
      day: activeCategory === "one_day" ? day : null,
      gala: gala && galaOpen,
      clientTotalUsd: total,
    };

    try {
      const res = await fetch(apiUrl("/api/register-2027"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setResult({ id: data.id, total: data.totalUsd });
      } else {
        setErrorMessage(
          data?.message ||
            t(
              "Ошибка при отправке заявки. Попробуйте ещё раз.",
              "Ariza yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.",
              "Error submitting the application. Please try again.",
            ),
        );
      }
    } catch {
      setErrorMessage(
        t(
          "Нет связи с сервером. Проверьте интернет или позвоните в оргкомитет: +998 90 175 74 07.",
          "Server bilan aloqa yo‘q. Internetni tekshiring yoki tashkiliy qo‘mitaga qo‘ng‘iroq qiling: +998 90 175 74 07.",
          "Cannot reach the server. Check your connection or call the committee: +998 90 175 74 07.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 block h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-xs font-semibold uppercase text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg2027-title"
        className="relative my-8 w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("Закрыть", "Yopish", "Close")}
        >
          <X className="size-5" />
        </button>

        {result ? (
          <div className="space-y-4 py-6 text-center animate-in fade-in">
            <CheckCircle2 className="mx-auto size-14 text-accent" />
            <h3 className="font-serif text-3xl font-bold">
              {t("Заявка принята!", "Arizangiz qabul qilindi!", "Registration received!")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("Номер заявки", "Ariza raqami", "Application number")}: <b className="text-foreground">#{result.id}</b> ·{" "}
              {t("Сумма", "Summa", "Total")}: <b className="text-accent">${result.total}</b>
            </p>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
              {t(
                "Оргкомитет свяжется с вами для подтверждения участия и оплаты. Возможна оплата на месте. Если вы оформили членство O‘zSTTA до 31.12.2026, скидка 10% будет учтена при подтверждении.",
                "Tashkiliy qo‘mita ishtirokni tasdiqlash va to‘lov bo‘yicha siz bilan bog‘lanadi. Joyida to‘lash ham mumkin. Agar O‘zSTTA a’zoligini 31.12.2026 gacha rasmiylashtirgan bo‘lsangiz, 10% chegirma tasdiqlashda hisobga olinadi.",
                "The organizing committee will contact you to confirm participation and payment. On-site payment is possible. If you joined O‘zSTTA before 31.12.2026, the 10% discount will be applied on confirmation.",
              )}
            </p>
            <Button onClick={onClose} className="h-11 rounded-xl px-8">
              {t("Понятно", "Tushunarli", "Got it")}
            </Button>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              PROHAIR 2027 · {t("11–12 сентября · Ташкент", "11–12-sentabr · Toshkent", "11–12 September · Tashkent")}
            </span>
            <h2 id="reg2027-title" className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
              {t("Регистрация на конгресс", "Kongressga ro‘yxatdan o‘tish", "Congress registration")}
            </h2>

            {/* Tarif tanlash */}
            <div className="mt-6 space-y-4 rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-background p-1" role="radiogroup">
                {(["resident", "non_resident"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={residency === r}
                    onClick={() => setResidency(r)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      residency === r ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "resident" ? t("Резидент", "Rezident", "Resident") : t("Нерезидент", "Norezident", "Non-resident")}
                  </button>
                ))}
              </div>

              <div>
                <label className={labelClass} htmlFor="reg2027-category">
                  {t("Категория билета", "Chipta toifasi", "Ticket category")}
                </label>
                <select
                  id="reg2027-category"
                  value={activeCategory}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className={`${inputClass} font-semibold`}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(t, c)} — ${ticketPrice(residency, c, today)}
                    </option>
                  ))}
                </select>
                {activeCategory === "student" && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {t("При регистрации на месте потребуется студенческий билет / справка ординатора.", "Ro‘yxatdan o‘tishda talabalik guvohnomasi / ordinatura ma’lumotnomasi talab qilinadi.", "A student ID / residency certificate is required at check-in.")}
                  </p>
                )}
                {activeCategory === "roiv" && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {t("Фиксированная цена до 20.08.2027. Потребуется подтверждение членства РОИВ.", "20.08.2027 gacha qat’iy narx. ROIV a’zoligi tasdig‘i talab qilinadi.", "Fixed price until 20.08.2027. Proof of ROIV membership required.")}
                  </p>
                )}
              </div>

              {activeCategory === "one_day" && (
                <div>
                  <span className={labelClass}>{t("День участия", "Ishtirok kuni", "Day of attendance")}</span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {CONGRESS_DAYS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDay(d)}
                        aria-pressed={day === d}
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                          day === d ? "border-accent bg-accent/15 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"
                        }`}
                      >
                        {t(`День ${i + 1}`, `${i + 1}-kun`, `Day ${i + 1}`)} · {formatDayMonth(d)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label
                className={`flex items-start gap-3 rounded-xl border border-border bg-background p-3 ${galaOpen ? "cursor-pointer" : "opacity-60"}`}
              >
                <input
                  type="checkbox"
                  checked={gala && galaOpen}
                  disabled={!galaOpen}
                  onChange={(e) => setGala(e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--color-accent)]"
                />
                <span className="text-sm">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <UtensilsCrossed className="size-4 text-accent" />
                    {t("Гала-ужин конгресса", "Kongress gala-kechasi", "Congress gala dinner")} · ${PRICING.galaDinner.price}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {galaOpen
                      ? t(
                          `Бронирование закрывается ${formatDayMonth(galaDeadline())} — строго за 5 дней до начала.`,
                          `Bron ${formatDayMonth(galaDeadline())} da yopiladi — boshlanishidan qat’iy 5 kun oldin.`,
                          `Booking closes on ${formatDayMonth(galaDeadline())} — strictly 5 days before the start.`,
                        )
                      : t("Бронирование гала-ужина закрыто.", "Gala-kecha broni yopilgan.", "Gala dinner booking is closed.")}
                  </span>
                </span>
              </label>

              <div className="flex items-end justify-between border-t border-accent/20 pt-3">
                <div className="text-xs text-muted-foreground">
                  <p>
                    {periodLabel(t, period)} {t("цена", "narx", "price")} · {residencyLabel(t, residency)}
                  </p>
                  <p>
                    {t("Билет", "Chipta", "Ticket")} ${ticket}
                    {galaPrice > 0 && ` + ${t("гала-ужин", "gala-kecha", "gala")} $${galaPrice}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-3xl font-bold text-accent">${total}</p>
                  <p className="text-[11px] text-muted-foreground">
                    ≈ {fmtUzs(total)} {t("сум", "so‘m", "UZS")}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className={labelClass} htmlFor="reg2027-name">{t("Ф.И.О. полностью *", "F.I.SH. to‘liq *", "Full name *")}</label>
                <input id="reg2027-name" required name="fullName" autoComplete="name" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="reg2027-phone">{t("Телефон *", "Telefon *", "Phone *")}</label>
                  <input id="reg2027-phone" required name="phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="reg2027-email">Email *</label>
                  <input id="reg2027-email" required name="email" type="email" autoComplete="email" placeholder="doctor@example.com" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="reg2027-country">{t("Страна *", "Mamlakat *", "Country *")}</label>
                  <select
                    id="reg2027-country"
                    name="country"
                    required
                    className={inputClass}
                    key={residency}
                    defaultValue={residency === "resident" ? "Узбекистан" : "Казахстан"}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="reg2027-city">{t("Город / Клиника", "Shahar / Klinika", "City / Clinic")}</label>
                  <input id="reg2027-city" name="city" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="reg2027-specialty">{t("Специальность", "Mutaxassislik", "Specialty")}</label>
                <input
                  id="reg2027-specialty"
                  name="specialty"
                  placeholder={t("Трихолог, дерматолог, хирург...", "Trixolog, dermatolog, jarroh...", "Trichologist, dermatologist, surgeon...")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reg2027-comment">{t("Комментарий", "Izoh", "Comment")}</label>
                <textarea
                  id="reg2027-comment"
                  name="comment"
                  rows={2}
                  className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {errorMessage && (
                <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">{errorMessage}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-accent font-bold text-accent-foreground shadow-md hover:bg-accent/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("Отправка...", "Yuborilmoqda...", "Submitting...")}
                  </>
                ) : (
                  <>
                    <Ticket className="size-4" />
                    {t(`Зарегистрироваться · $${total}`, `Ro‘yxatdan o‘tish · $${total}`, `Register · $${total}`)}
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                {t(
                  "Оплата после подтверждения оргкомитетом; возможна оплата на месте. Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
                  "To‘lov tashkiliy qo‘mita tasdiqlagandan so‘ng; joyida to‘lash ham mumkin. Tugmani bosib, shaxsiy ma’lumotlaringiz qayta ishlanishiga rozilik bildirasiz.",
                  "Payment after confirmation by the committee; on-site payment is possible. By submitting you agree to the processing of your personal data.",
                )}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
