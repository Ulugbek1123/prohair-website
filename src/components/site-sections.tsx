import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronRight, GraduationCap, Menu, MonitorPlay, Users, X } from "lucide-react";
import { Button } from "./ui/button";

const upcomingEvents = [
  {
    type: "Международный конгресс",
    date: "04–05.09.2026",
    title: "PROHAIR 2026",
    details: "Mövenpick Hotel · Самарканд",
    action: "Программа и регистрация",
  },
  {
    type: "Курс",
    date: "Дата уточняется",
    title: "Практическая трихоскопия",
    details: "Очный формат · программа готовится",
    action: "Следить за анонсом",
  },
  {
    type: "Вебинар",
    date: "Анонс скоро",
    title: "Клинические разборы O‘zSTTA",
    details: "Онлайн · для специалистов",
    action: "Узнать первым",
  },
];

const archiveEvents = [
  {
    type: "Конгресс и выставка",
    date: "2025",
    title: "PROHAIR 2025",
    details: "Материалы прошедшего события",
    action: "Открыть архив",
  },
  {
    type: "Архив ассоциации",
    date: "2024",
    title: "Образовательные мероприятия",
    details: "Записи, фотографии и программы",
    action: "Смотреть материалы",
  },
];


export function AssociationSection() { return (        <section id="association" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <p className="section-kicker">Об ассоциации</p>
            <h2 className="section-title mt-4">Профессиональная опора отрасли</h2>
          </div>
          <div>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              O‘zSTTA объединяет специалистов, которым важны доказательная практика, профессиональная этика и постоянное развитие трихологии в Узбекистане.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {[
                [GraduationCap, "Обучение", "Курсы, лекции и вебинары от практикующих экспертов."],
                [BookOpen, "Стандарты", "Методические материалы и актуальные клинические подходы."],
                [Users, "Сообщество", "Профессиональные связи между врачами и клиниками страны."],
              ].map(([Icon, title, copy]) => {
                const IconComponent = Icon as typeof GraduationCap;
                return (
                  <article key={title as string} className="bg-card p-6">
                    <IconComponent className="size-6 text-accent" />
                    <h3 className="mt-8 text-lg font-bold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy as string}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

); }

export function EducationSection() { return (        <section id="education" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-kicker">Образование</p>
              <h2 className="section-title mt-4">Учиться. Обсуждать. Применять.</h2>
              <p className="mt-5 max-w-md leading-7 text-muted-foreground">Программы для непрерывного профессионального развития — от коротких онлайн-встреч до очных практикумов.</p>
              <Button asChild variant="outline" className="mt-8 h-11 rounded-lg"><Link to="/contacts">Получать анонсы<ArrowRight /></Link></Button>
            </div>
            <div className="space-y-3">
              {[
                [CalendarDays, "Курсы", "Системные программы и практические занятия", "Очно и онлайн"],
                [MonitorPlay, "Вебинары", "Живые эфиры и разборы клинических случаев", "Новые темы регулярно"],
                [BookOpen, "Лекции", "Выступления экспертов и научные доклады", "Записи и встречи"],
              ].map(([Icon, title, copy, meta]) => {
                const IconComponent = Icon as typeof CalendarDays;
                return (
                  <article key={title as string} className="learning-row grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <span className="grid size-12 place-items-center rounded-lg bg-secondary"><IconComponent className="size-5 text-primary" /></span>
                    <div><h3 className="text-lg font-bold">{title as string}</h3><p className="mt-1 text-sm text-muted-foreground">{copy as string}</p></div>
                    <span className="text-xs font-semibold text-muted-foreground">{meta as string}</span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

); }

export function MembershipSection() { return (        <section id="membership" className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-8">
          <div className="membership-panel grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Членство в O‘zSTTA</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold text-primary-foreground sm:text-5xl">Станьте частью профессионального сообщества</h2>
              <p className="mt-4 max-w-2xl text-primary-foreground/70">Получайте доступ к анонсам, образовательным программам и мероприятиям ассоциации.</p>
            </div>
            <Button asChild className="h-12 rounded-lg bg-accent px-7 text-accent-foreground hover:bg-accent/90"><Link to="/contacts">Подать заявку<ArrowUpRight /></Link></Button>
          </div>
        </section>
); }

export function EventsSection() { const [eventView,setEventView] = useState<"upcoming" | "archive">("upcoming"); const events = eventView === "upcoming" ? upcomingEvents : archiveEvents; return (        <section id="events" className="section-band relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Афиша O‘zSTTA</p>
                <h2 className="section-title mt-4">Мероприятия</h2>
              </div>
              <div className="inline-flex w-fit rounded-lg border border-border bg-background p-1" role="tablist" aria-label="Фильтр мероприятий">
                <Button variant={eventView === "upcoming" ? "default" : "ghost"} className="rounded-md" onClick={() => setEventView("upcoming")} role="tab" aria-selected={eventView === "upcoming"}>Предстоящие</Button>
                <Button variant={eventView === "archive" ? "default" : "ghost"} className="rounded-md" onClick={() => setEventView("archive")} role="tab" aria-selected={eventView === "archive"}>Архив</Button>
              </div>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {events.map((event, index) => (
                <article key={event.title} className={`event-card flex min-h-72 flex-col p-6 ${event.title === "PROHAIR 2026" ? "featured-event" : ""}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">{event.type}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{event.date}</span>
                  </div>
                  <div className="mt-auto pt-16">
                    <span className="font-serif text-5xl text-border">0{index + 1}</span>
                    <h3 className="mt-3 font-serif text-3xl font-bold">{event.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{event.details}</p>
                    <Link to="/contacts" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-foreground">{event.action}<ChevronRight className="size-4" /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

); }
