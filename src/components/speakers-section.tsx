import { useState, useEffect, useRef, type SyntheticEvent } from "react";
import { ChevronLeft, ChevronRight, Globe, Search } from "lucide-react";
import { useLanguage } from "../lib/language";
import { speakersData, type Speaker } from "../lib/data";
import { apiUrl } from "../lib/api-client";

// 12 — 2, 3 va 4 ustunli setkalarga teng bo'linadi (oxirgi qator chala qolmaydi)
const PAGE_SIZE = 12;

// /uploads/xxx.png -> /uploads/thumbs/xxx.webp (600px, siqilgan nusxa).
// Admin keyin yuklagan rasmlarda nusxa bo'lmasa, onError aslini ko'rsatadi.
function speakerThumb(src: string): string {
  const m = /^\/uploads\/([^/]+)\.(png|jpe?g|webp)$/i.exec(src);
  return m ? `/uploads/thumbs/${m[1]}.webp` : src;
}

function handleImgError(original: string) {
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset["fallback"] === "original") {
      img.src = "/favicon.ico";
      img.dataset["fallback"] = "done";
    } else if (!img.dataset["fallback"]) {
      img.dataset["fallback"] = "original";
      img.src = original;
    }
  };
}

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function SpeakersSection() {
  const { t } = useLanguage();
  const [speakers, setSpeakers] = useState<Speaker[]>(speakersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(apiUrl("/api/speakers"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch speakers");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const countryFallbackMap: Record<number, string> = Object.fromEntries(
            speakersData.map((s) => [s.id, s.country || "Узбекистан"])
          );
          const enriched: Speaker[] = data.map((s: any) => ({
            id: s.id,
            name: s.name ? s.name.trim() : "",
            role: s.role || "",
            image: s.image || "",
            label: s.label ? s.label.trim() : undefined,
            description: s.description || null,
            country: s.country || countryFallbackMap[s.id] || "Узбекистан",
          }));
          setSpeakers(enriched);
        }
      })
      .catch(() => {
        // Fallback to speakersData already set
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique countries
  const countries = ["all", ...Array.from(new Set(speakers.map((s) => s.country).filter(Boolean)))];

  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (speaker.description && speaker.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry = selectedCountry === "all" || speaker.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSpeakers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSpeakers = filteredSpeakers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Qidiruv yoki davlat o'zgarsa — birinchi sahifaga qaytamiz
  useEffect(() => setPage(1), [searchQuery, selectedCountry]);

  const goToPage = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} id="speakers" className="relative z-10 scroll-mt-24 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="section-kicker">
              {t("Международные эксперты", "Xalqaro ekspertlar", "International Faculty")}
            </p>
            <h2 className="section-title mt-3">
              {t("Спикеры Конгресса PROHAIR", "PROHAIR Kongressi Spikerlari", "PROHAIR Congress Speakers")}
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
              {t(
                "Ведущие мировые и региональные лидеры мнений, авторы научных исследований и практикующие специалисты в области трихологии и трансплантации волос.",
                "Trixologiya va soch transplantatsiyasi sohasidagi yetakchi jahon va mintaqa mutaxassislari, ilmiy tadqiqotchilar hamda amaliyotchi shifokorlar.",
                "Leading international and regional opinion leaders, research authors, and clinical experts in trichology and hair restoration surgery."
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("Поиск спикера...", "Spikerni qidirish...", "Search speaker...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full sm:w-56 rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">{t("Все страны", "Barcha davlatlar", "All countries")}</option>
              {countries.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pageSpeakers.map((speaker) => (
            <article
              key={speaker.id}
              onClick={() => setSelectedSpeaker(speaker)}
              className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <img
                  src={speakerThumb(speaker.image)}
                  alt={speaker.name}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={750}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={handleImgError(speaker.image)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {speaker.label && (
                  <span className="absolute top-3 left-3 rounded-md bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground backdrop-blur-md">
                    {speaker.label}
                  </span>
                )}

                {speaker.country && (
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-md">
                    <Globe className="size-3 text-accent" />
                    {speaker.country}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold group-hover:text-accent transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground line-clamp-2">
                    {speaker.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-accent">
                  <span>{t("Подробнее", "Batafsil", "Learn more")}</span>
                  <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
            aria-label={t("Страницы спикеров", "Spikerlar sahifalari", "Speaker pages")}
          >
            <p className="text-xs text-muted-foreground">
              {t("Показано", "Ko‘rsatilmoqda", "Showing")}{" "}
              <b className="text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredSpeakers.length)}
              </b>{" "}
              {t("из", "/", "of")} <b className="text-foreground">{filteredSpeakers.length}</b>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:border-accent disabled:pointer-events-none disabled:opacity-40"
                aria-label={t("Предыдущая страница", "Oldingi sahifa", "Previous page")}
              >
                <ChevronLeft className="size-4" />
              </button>
              {pageList(currentPage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`gap${i}`} className="px-1 text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={`size-10 rounded-lg text-sm font-semibold transition ${
                      p === currentPage
                        ? "bg-primary text-primary-foreground shadow"
                        : "border border-border bg-card text-foreground hover:border-accent"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:border-accent disabled:pointer-events-none disabled:opacity-40"
                aria-label={t("Следующая страница", "Keyingi sahifa", "Next page")}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </nav>
        )}

        {filteredSpeakers.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            {t("Спикеры не найдены.", "Spikerlar topilmadi.", "No speakers found.")}
          </div>
        )}

        {/* Modal Bio for Selected Speaker */}
        {selectedSpeaker && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedSpeaker(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                ✕
              </button>

              <div className="flex gap-5 items-start">
                <img
                  src={speakerThumb(selectedSpeaker.image)}
                  onError={handleImgError(selectedSpeaker.image)}
                  alt={selectedSpeaker.name}
                  className="size-24 sm:size-28 rounded-xl object-cover shrink-0 border border-border"
                />
                <div>
                  {selectedSpeaker.label && (
                    <span className="inline-block rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent mb-1.5">
                      {selectedSpeaker.label}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-bold">{selectedSpeaker.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{selectedSpeaker.role}</p>
                  {selectedSpeaker.country && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground/80">
                      <Globe className="size-3.5 text-accent" />
                      {selectedSpeaker.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("О спикере", "Spiker haqida", "About Speaker")}
                </h4>
                <p className="text-sm leading-7 text-foreground/90 whitespace-pre-line">
                  {selectedSpeaker.description || selectedSpeaker.role}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedSpeaker(null)}
                  className="rounded-lg bg-secondary px-5 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                >
                  {t("Закрыть", "Yopish", "Close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
