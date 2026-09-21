import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "../lib/language";
import { pricingPlansData, type PricingPlan } from "../lib/data";
import { Button } from "./ui/button";

interface PricingSectionProps {
  onRegisterClick: (plan: PricingPlan) => void;
}

const USD_RATE = 12100;

export function PricingSection({ onRegisterClick }: PricingSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="relative z-10 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="section-kicker">
            {t("Условия участия", "Ishtirok shartlari", "Participation Options")}
          </p>
          <h2 className="section-title mt-3">
            {t("Тарифы и регистрация на Конгресс", "Tariflar va Kongressga ro‘yxatdan o‘tish", "Registration Passes")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-7">
            {t(
              "Выберите подходящий формат участия для врачей-членов ассоциации, делегатов и ординаторов. Все тарифы включают доступ к материалам и сертификат.",
              "Assotsiatsiya a’zolari, delegatlar va ordinatorlar uchun qulay ishtirok formatini tanlang. Barcha tariflar materiallar to‘plami va sertifikatni o‘z ichiga oladi.",
              "Select your category for association members, delegates and residents. All passes include access to conference materials and certificate."
            )}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlansData.map((plan, index) => {
            const isPopular = plan.id === 1 || plan.id === 2;
            const priceUzs = plan.priceUsd * USD_RATE;

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-7 sm:p-8 transition-all duration-300 hover:shadow-xl ${
                  isPopular
                    ? "border-accent bg-card shadow-lg ring-1 ring-accent/30"
                    : "border-border bg-card hover:border-accent/40"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow">
                    <Sparkles className="size-3" />
                    {t("Популярный выбор", "Ommabop tanlov", "Most Popular")}
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {plan.category}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{plan.title}</h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-bold text-accent">${plan.priceUsd}</span>
                    <span className="text-xs text-muted-foreground">/ {t("участник", "ishtirokchi", "pass")}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    ≈ {new Intl.NumberFormat("uz-UZ").format(priceUzs)} {t("сум", "so‘m", "UZS")}
                  </p>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                      {t("В стоимость входит:", "Tarif ichiga kiradi:", "Included in pass:")}
                    </p>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="size-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    onClick={() => onRegisterClick(plan)}
                    className={`w-full h-11 rounded-lg font-semibold transition-all ${
                      isPopular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {t("Оформить заявку", "Ariza topshirish", "Register Now")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card/60 p-6 text-center text-xs text-muted-foreground">
          {t(
            "По вопросам групповой регистрации от клиник или спонсорских пакетов обращайтесь по телефону +998 77 300 30 80 или info@prohair.uz",
            "Klinikalardan guruh bo‘lib ro‘yxatdan o‘tish yoki homiylik paketlari bo‘yicha +998 77 300 30 80 yoki info@prohair.uz orqali bog‘laning.",
            "For group registrations or sponsorship opportunities, please contact us at +998 77 300 30 80 or info@prohair.uz"
          )}
        </div>
      </div>
    </section>
  );
}
