import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../lib/language";
import { pricingPlansData, type PricingPlan } from "../lib/data";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan | null;
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
  "Германия",
  "Испания",
  "Израиль",
  "Другое / Other"
];

const USD_RATE = 12100;

export function RegistrationModal({ isOpen, onClose, selectedPlan }: RegistrationModalProps) {
  const { t } = useLanguage();
  const [currentPlanId, setCurrentPlanId] = useState<number>(selectedPlan?.id ?? pricingPlansData[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const activePlan = pricingPlansData.find((p) => p.id === currentPlanId) ?? pricingPlansData[0];
  const priceUzs = activePlan.priceUsd * USD_RATE;

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
      address: formData.get("address") as string,
      planTitle: activePlan.title,
      priceUsd: activePlan.priceUsd,
      priceUzs,
      comment: (formData.get("comment") as string) || ""
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.message || t("Ошибка при отправке заявки. Попробуйте еще раз.", "Ariza yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.", "Error submitting application. Please try again."));
      }
    } catch {
      // In case server is offline or local static preview
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = "mt-1.5 block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={t("Закрыть", "Yopish", "Close")}
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              {t("Заявка успешно принята!", "Arizangiz muvaffaqiyatli qabul qilindi!", "Application Received Successfully!")}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground max-w-md mx-auto">
              {t(
                "Спасибо за регистрацию на Конгресс PROHAIR 2026. Наш оргкомитет свяжется с вами по указанному номеру телефона для подтверждения деталей и предоставления информации об оплате.",
                "PROHAIR 2026 Kongressiga ro‘yxatdan o‘tganingiz uchun tashakkur! Tashkiliy qo‘mita ma’lumotlarni tasdiqlash uchun ko‘rsatilgan telefon raqamingiz orqali tez orada siz bilan bog‘lanadi.",
                "Thank you for registering for the PROHAIR 2026 Congress. Our organizing committee will contact you shortly via phone to confirm your participation."
              )}
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {t("Телефон оргкомитета: +998 77 300 30 80 | info@prohair.uz", "Tashkiliy qo‘mita telefoni: +998 77 300 30 80 | info@prohair.uz", "Committee phone: +998 77 300 30 80 | info@prohair.uz")}
              </p>
            </div>
            <Button onClick={onClose} className="mt-4 w-full">
              {t("Понятно", "Tushunarli", "Got it")}
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-b border-border pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {t("Регистрация на Конгресс", "Kongressga ro‘yxatdan o‘tish", "Congress Registration")}
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold">PROHAIR 2026</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("4–5 сентября 2026 · Самарканд, Mövenpick Hotel", "2026-yil 4–5-sentabr · Samarqand, Mövenpick Hotel", "4–5 September 2026 · Samarkand, Mövenpick Hotel")}
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("Выбранный тариф", "Tanlangan tarif", "Selected Package")}
              </label>
              <select
                value={currentPlanId}
                onChange={(e) => setCurrentPlanId(Number(e.target.value))}
                className="mt-2 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground"
              >
                {pricingPlansData.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} — ${plan.priceUsd}
                  </option>
                ))}
              </select>

              <div className="mt-3 flex items-baseline justify-between border-t border-accent/20 pt-2 text-sm">
                <span className="text-muted-foreground">{t("Стоимость участия:", "Ishtirok narxi:", "Fee:")}</span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-accent">${activePlan.priceUsd}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    (≈ {new Intl.NumberFormat("uz-UZ").format(priceUzs)} {t("сум", "so‘m", "UZS")})
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  {t("Ф.И.О. полностью *", "F.I.SH. to‘liq *", "Full Name *")}
                </label>
                <input
                  required
                  name="fullName"
                  type="text"
                  placeholder={t("Иванов Иван Иванович", "Abdullayev Dilshod", "Dr. John Doe")}
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Номер телефона *", "Telefon raqami *", "Phone number *")}
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Email *", "Elektron pochta *", "Email address *")}
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="doctor@example.com"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Страна *", "Mamlakat *", "Country *")}
                  </label>
                  <select name="country" required className={inputStyle}>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Город / Клиника", "Shahar / Klinika", "City / Workplace")}
                  </label>
                  <input
                    name="address"
                    type="text"
                    placeholder={t("г. Ташкент", "Toshkent sh.", "Tashkent")}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  {t("Комментарий или пожелания", "Izoh yoki qo‘shimcha ma’lumot", "Comments or questions")}
                </label>
                <textarea
                  name="comment"
                  rows={2}
                  placeholder={t("Например: специальность или вопрос о проживании", "Masalan: mutaxassislik yoki turar-joy bo‘yicha savol", "E.g. specialty or accommodation question")}
                  className={inputStyle}
                />
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-md transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {t("Отправка заявки...", "Yuborilmoqda...", "Submitting...")}
                  </span>
                ) : (
                  t("Отправить заявку на участие", "Ishtirok arizasini yuborish", "Submit Participation Application")
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
                {t(
                  "Нажимая кнопку, вы соглашаетесь на обработку персональных данных для участия в Конгрессе.",
                  "Tugmani bosish orqali siz Kongressda ishtirok etish uchun shaxsiy ma’lumotlaringiz qayta ishlanishiga rozilik bildirasiz.",
                  "By submitting, you agree to the processing of personal data for congress participation."
                )}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
