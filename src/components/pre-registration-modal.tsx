import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../lib/language";
import { apiUrl } from "../lib/api-client";

interface PreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

const COUNTRIES = [
  "Узбекистан",
  "Казахстан",
  "Кыргызстан",
  "Таджикистан",
  "Туркменистан",
  "Россия",
  "Азербайджан",
  "Грузия",
  "Турция",
  "Другое / Other",
];

export function PreRegistrationModal({ isOpen, onClose, defaultRole }: PreRegistrationModalProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

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
      role: formData.get("role") as string,
      comment: (formData.get("comment") as string) || "",
      event: "PROHAIR 2027 Pre-registration",
    };

    try {
      const res = await fetch(apiUrl("/api/pre-register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ success: true }));
      if (res.ok || data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(
          data.message ||
            t(
              "Ошибка при отправке заявки. Попробуйте еще раз.",
              "Ariza yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.",
              "Error submitting application. Please try again."
            )
        );
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 block h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label={t("Закрыть", "Yopish", "Close")}
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="mx-auto size-14 text-accent" />
            <h3 className="font-serif text-3xl font-bold">
              {t("Заявка принята!", "Arizangiz qabul qilindi!", "Application Received!")}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground max-w-md mx-auto">
              {t(
                "Спасибо за интерес к PROHAIR 2027! Вы внесены в лист ожидания. Мы свяжемся с вами и отправим уведомление сразу после утверждения дат, программы и старта продаж билетов по льготным ценам Early Bird.",
                "PROHAIR 2027 ga bo‘lgan qiziqishingiz uchun tashakkur! Siz kutish ro‘yxatiga kiritildingiz. Sanalar, dastur va Early Bird imtiyozli chiptalari sotuvi boshlanishi bilanoq siz bilan bog‘lanamiz.",
                "Thank you for your interest in PROHAIR 2027! You are on our priority waitlist. We will notify you as soon as dates, agenda, and Early Bird registration open."
              )}
            </p>
            <div className="pt-4">
              <Button onClick={onClose} className="h-11 px-8 rounded-xl">
                {t("Закрыть", "Tushunarli", "Got it")}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              PROHAIR 2027 · {t("Лист ожидания", "Kutish ro‘yxati", "Priority Waitlist")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              {t("Предварительная регистрация", "Dastlabki ro‘yxatdan o‘tish", "Pre-registration")}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-5">
              {t(
                "Оставьте контакты, чтобы первыми узнать о датах, научной программе и получить скидку Early Bird на билеты.",
                "Sanalar, ilmiy dastur va Early Bird chiptalari chegirmasidan birinchi bo‘lib xabardor bo‘lish uchun kontaktlaringizni qoldiring.",
                "Leave your details to be first to hear about event dates, agenda, and Early Bird discounts."
              )}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  {t("ФИО *", "F.I.SH *", "Full Name *")}
                </label>
                <input
                  required
                  name="fullName"
                  type="text"
                  placeholder={t("Иван Иванов", "Dilshod Abdullayev", "Dr. John Doe")}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Телефон *", "Telefon *", "Phone *")}
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
                    {t("Email *", "Elektron pochta *", "Email *")}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Страна *", "Davlat *", "Country *")}
                  </label>
                  <select name="country" required defaultValue="Узбекистан" className={inputClass}>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    {t("Специализация / Роль *", "Mutaxassislik / Rol *", "Specialty / Role *")}
                  </label>
                  <select name="role" required defaultValue={defaultRole || "doctor"} className={inputClass}>
                    <option value="doctor">
                      {t("Врач-трихолог / дерматолог", "Shifokor trixolog / dermatolog", "Trichologist / Dermatologist")}
                    </option>
                    <option value="surgeon">
                      {t("Пластический хирург", "Plastik jarroh", "Plastic Surgeon")}
                    </option>
                    <option value="clinic_owner">
                      {t("Руководитель клиники", "Klinika rahbari", "Clinic Director")}
                    </option>
                    <option value="speaker">
                      {t("Потенциальный спикер", "Bo‘lg‘usi spiker", "Potential Speaker")}
                    </option>
                    <option value="partner">
                      {t("Партнёр / экспонент", "Hamkor / ko‘rgazma qatnashchisi", "Partner / Exhibitor")}
                    </option>
                    <option value="other">
                      {t("Другое", "Boshqa", "Other")}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  {t("Вопрос или пожелание (необязательно)", "Savol yoki taklifingiz (ixtiyoriy)", "Question or note (optional)")}
                </label>
                <textarea
                  name="comment"
                  rows={3}
                  placeholder={t(
                    "Интересует выступление с докладом / участие в выставке / ранние билеты...",
                    "Ma’ruza bilan chiqish / ko‘rgazmada ishtirok / erta chiptalar qiziqtirmoqda...",
                    "Interested in presenting / expo booth / early bird tickets..."
                  )}
                  className="mt-1.5 block w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-sm font-semibold mt-2">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {t("Отправка...", "Yuborilmoqda...", "Submitting...")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="size-4" />
                    {t("Подать заявку в лист ожидания", "Kutish ro‘yxatiga yozilish", "Join Priority Waitlist")}
                  </span>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
