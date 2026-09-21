import { useState } from "react";
import { ChevronDown, HelpCircle, Play } from "lucide-react";
import { useLanguage } from "../lib/language";
import { faqsData, type FAQItem } from "../lib/data";

export function FAQSection() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(1); // first FAQ open by default

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const getQuestion = (faq: FAQItem) => {
    if (language === "uz") return faq.questionUz;
    if (language === "en") return faq.questionEn;
    return faq.questionRu;
  };

  const getAnswer = (faq: FAQItem) => {
    if (language === "uz") return faq.answerUz;
    if (language === "en") return faq.answerEn;
    return faq.answerRu;
  };

  return (
    <section id="faq" className="relative z-10 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <div className="text-center">
          <p className="section-kicker">
            {t("Вопросы и ответы", "Savol-javoblar", "Frequently Asked Questions")}
          </p>
          <h2 className="section-title mt-3">
            {t("Часто задаваемые вопросы", "Ko‘p beriladigan savollar", "Congress FAQ")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-7">
            {t(
              "Ответы на ключевые организационные вопросы: участие, регистрация, онлайн-трансляция и сертификаты.",
              "Asosiy tashkiliy masalalar bo‘yicha javoblar: ishtirok, ro‘yxatdan o‘tish, onlayn translatsiya va sertifikatlar.",
              "Key information regarding participation, registration, live streaming, and certificates."
            )}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqsData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-accent bg-card shadow-md"
                    : "border-border bg-card/60 hover:border-accent/40"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="flex items-center gap-3 font-serif text-lg sm:text-xl font-bold text-foreground">
                    <HelpCircle className="size-5 text-accent shrink-0" />
                    {getQuestion(faq)}
                  </span>
                  <ChevronDown
                    className={`size-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 px-6 pb-6 pt-4 text-sm leading-7 text-muted-foreground animate-in fade-in duration-200">
                    <p className="whitespace-pre-line">{getAnswer(faq)}</p>

                    {faq.videoUrl && (
                      <div className="mt-4 pt-3 border-t border-border/40">
                        <a
                          href={faq.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline"
                        >
                          <Play className="size-3.5 fill-accent" />
                          {t("Смотреть видео-инструкцию", "Video yo‘riqnomani tomosha qilish", "Watch video guide")}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
