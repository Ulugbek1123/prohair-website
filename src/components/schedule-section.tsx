import { useState } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp, Printer, User, Sparkles } from "lucide-react";
import { useLanguage } from "../lib/language";
import { scheduleDaysData, scheduleEventsData } from "../lib/data";
import { Button } from "./ui/button";

export function ScheduleSection() {
  const { t, language } = useLanguage();
  const [activeDayId, setActiveDayId] = useState<number>(1);
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({});

  const events = scheduleEventsData.filter((e) => e.dayId === activeDayId);

  const toggleExpand = (id: number) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getDayTitle = (day: typeof scheduleDaysData[0]) => {
    if (language === "uz") return day.titleUz;
    if (language === "en") return day.titleEn;
    return day.title;
  };

  return (
    <section id="schedule" className="relative z-10 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="section-kicker">
              {t("Научная повестка", "Ilmiy kun tartibi", "Scientific Agenda")}
            </p>
            <h2 className="section-title mt-3">
              {t("Программа Конгресса PROHAIR 2026", "PROHAIR 2026 Kongressi Dasturi", "PROHAIR 2026 Program")}
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
              {t(
                "2 насыщенных дня: клинические разборы, передовые доклады по рубцовой и андрогенетической алопеции, детской трихологии и трансплантации волос.",
                "2 kunlik boy ilmiy dastur: klinik tahlillar, chandiqli va androgenetik alopetsiya, bolalar trixologiyasi hamda soch ko‘chirib o‘tkazish bo‘yicha ma’ruzalar.",
                "2 comprehensive days: clinical cases, cutting-edge sessions on cicatricial and androgenetic alopecia, pediatric trichology and hair restoration."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2 text-xs"
            >
              <Printer className="size-3.5" />
              {t("Распечатать программу", "Dasturni chop etish", "Print Program")}
            </Button>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="mt-10 flex flex-wrap gap-3 border-b border-border pb-4">
          {scheduleDaysData.map((day) => {
            const isActive = day.id === activeDayId;
            return (
              <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-card text-foreground hover:bg-secondary border border-border"
                }`}
              >
                <Calendar className="size-4" />
                <span>{getDayTitle(day)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-accent-foreground/15 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {day.date}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeline list */}
        <div className="mt-8 space-y-4">
          {events.map((item) => {
            const hasSub = item.subEvents && item.subEvents.length > 0;
            const isExpanded = expandedEvents[item.id] ?? true; // expanded by default for easy reading
            const isBreak = item.title.includes("КОФЕ") || item.title.includes("ОБЕД") || item.title.includes("ГАЛА") || item.title.includes("ЗАКРЫТИЕ");

            return (
              <article
                key={item.id}
                className={`rounded-2xl border transition-all ${
                  isBreak
                    ? "border-accent/30 bg-accent/5 p-5"
                    : "border-border bg-card p-6 shadow-sm hover:border-accent/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1 font-mono text-xs font-bold text-accent">
                        <Clock className="size-3.5" />
                        {item.time}
                      </span>
                      {isBreak && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent uppercase tracking-wider">
                          <Sparkles className="size-3" />
                          {t("Специальное событие", "Maxsus tadbir", "Special event")}
                        </span>
                      )}
                    </div>

                    <h3 className={`mt-3 font-serif font-bold ${isBreak ? "text-lg text-accent" : "text-xl sm:text-2xl text-foreground"}`}>
                      {item.title}
                    </h3>

                    {item.speaker && (
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <User className="size-4 text-accent shrink-0" />
                        <span>{item.speaker}</span>
                      </p>
                    )}
                  </div>

                  {hasSub && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="self-start inline-flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          {t("Скрыть доклады", "Ma’ruzalarni yopish", "Hide topics")} <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          {t("Все доклады", "Barcha ma’ruzalar", "Show topics")} ({item.subEvents?.length}) <ChevronDown className="size-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-events topics */}
                {hasSub && isExpanded && (
                  <div className="mt-5 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      {t("Темы и докладчики сессии:", "Sessiya mavzulari va ma’ruzachilari:", "Session presentations:")}
                    </p>
                    <ul className="space-y-3">
                      {item.subEvents?.map((sub, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 rounded-lg bg-background/60 p-3 border border-border/40 text-xs sm:text-sm"
                        >
                          <span className="font-medium text-foreground leading-snug">
                            {sub.title}
                          </span>
                          {sub.speaker && (
                            <span className="text-xs font-semibold text-accent whitespace-nowrap shrink-0 sm:ml-4">
                              {sub.speaker}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
