import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { Camera, ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../lib/language";
// Rasmlar `Downloads/` dagi asl fayllardan siqilib yaratilgan (public/gallery/2026)
import manifest from "../data/gallery-2026.json";

type Category = "science" | "people" | "atmosphere";
type Photo = (typeof manifest.items)[number] & { category: Category };

// Joylashuv tartibi va toifalari (vizual ritm uchun qo'lda tanlangan)
const ORDER: [string, Category][] = [
  ["2s3a6615", "people"],
  ["2s3a5132", "science"],
  ["dsc00993", "atmosphere"],
  ["2s3a6456", "science"],
  ["dsc01149", "people"],
  ["2s3a5128", "science"],
  ["2s3a6391", "people"],
  ["dsc01402", "atmosphere"],
  ["2s3a6525", "science"],
  ["dsc00995", "atmosphere"],
  ["2s3a6053", "science"],
  ["img_7224", "people"],
  ["2s3a5887", "atmosphere"],
  ["dsc01068", "atmosphere"],
  ["2s3a6681", "people"],
  ["dsc01355", "people"],
  ["dsc00992", "atmosphere"],
  ["dsc01422", "people"],
  ["img_7190", "people"],
  ["dsc01025", "atmosphere"],
  ["dsc01404", "people"],
  ["img_7195", "people"],
];

const PHOTOS: Photo[] = ORDER.flatMap(([id, category]) => {
  const item = manifest.items.find((p) => p.id === id);
  return item ? [{ ...item, category }] : [];
});

const INITIAL_COUNT = 12;

const srcSet = (p: Photo) => p.srcs.map(([src, w]) => `${src} ${w}w`).join(", ");
const smallest = (p: Photo) => String(p.srcs[0]?.[0] ?? "");
const largest = (p: Photo) => String(p.srcs[p.srcs.length - 1]?.[0] ?? "");

function GalleryTile({ photo, index, featured, onOpen, alt }: { photo: Photo; index: number; featured: boolean; onOpen: (i: number) => void; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // SSR: rasm React ulanishidan oldin yuklangan bo'lsa onLoad chaqirilmaydi
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);
  const portrait = photo.h > photo.w;
  const span = featured ? "col-span-2 row-span-2" : portrait ? "row-span-2" : "";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`group relative overflow-hidden rounded-2xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${span}`}
      style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: "cover", backgroundPosition: "center" }}
      aria-label={alt}
    >
      <img
        ref={imgRef}
        src={smallest(photo)}
        srcSet={srcSet(photo)}
        sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
        width={photo.w}
        height={photo.h}
        alt={alt}
        loading={index < 4 ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-3 right-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-[#1e1b4b] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Expand className="size-4" />
      </span>
    </button>
  );
}

function Lightbox({ photos, index, onClose, onIndex, altFor }: { photos: Photo[]; index: number; onClose: () => void; onIndex: (i: number) => void; altFor: (p: Photo) => string }) {
  const { t } = useLanguage();
  const photo = photos[index];
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const go = useCallback((delta: number) => onIndex((index + delta + photos.length) % photos.length), [index, onIndex, photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  // Qo'shni rasmlarni oldindan yuklab qo'yamiz — o'tish bir zumda bo'ladi
  useEffect(() => {
    setLoaded(false);
    for (const d of [1, -1]) {
      const n = photos[(index + d + photos.length) % photos.length];
      if (n) new Image().src = largest(n);
    }
    stripRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, photos]);

  if (!photo) return null;

  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0]?.clientX ?? null);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("Просмотр фото", "Rasmni ko‘rish", "Photo viewer")}
      className="fixed inset-0 z-[60] flex flex-col bg-[#0b0718]/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold tabular-nums text-white/80">
          {index + 1} / {photos.length}
        </span>
        <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-[#f3d27a] sm:block">PROHAIR 2026 · Samarkand</span>
        <button onClick={onClose} className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" aria-label={t("Закрыть", "Yopish", "Close")}>
          <X className="size-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img
          key={photo.id}
          src={largest(photo)}
          srcSet={srcSet(photo)}
          sizes="100vw"
          alt={altFor(photo)}
          onLoad={() => setLoaded(true)}
          onClick={(e) => e.stopPropagation()}
          className={`max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl transition-all duration-300 ${loaded ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"}`}
          style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: "cover" }}
          draggable={false}
        />
        {[-1, 1].map((d) => (
          <button
            key={d}
            onClick={(e) => {
              e.stopPropagation();
              go(d);
            }}
            className={`absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20 sm:block ${d < 0 ? "left-4" : "right-4"}`}
            aria-label={d < 0 ? t("Предыдущее фото", "Oldingi rasm", "Previous photo") : t("Следующее фото", "Keyingi rasm", "Next photo")}
          >
            {d < 0 ? <ChevronLeft className="size-7" /> : <ChevronRight className="size-7" />}
          </button>
        ))}
      </div>

      <div ref={stripRef} className="flex gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:justify-center" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            data-i={i}
            onClick={() => onIndex(i)}
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-16 sm:w-24 ${
              i === index ? "border-[#f3d27a] opacity-100" : "border-transparent opacity-50 hover:opacity-90"
            }`}
            aria-label={`${t("Фото", "Rasm", "Photo")} ${i + 1}`}
            aria-current={i === index}
          >
            <img src={smallest(p)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Gallery2026() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => (filter === "all" ? PHOTOS : PHOTOS.filter((p) => p.category === filter)), [filter]);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  const categoryName = (c: Category | "all") =>
    ({
      all: t("Все", "Barchasi", "All"),
      science: t("Научная программа", "Ilmiy dastur", "Scientific program"),
      people: t("Участники", "Ishtirokchilar", "Participants"),
      atmosphere: t("Атмосфера", "Muhit", "Atmosphere"),
    })[c];
  const altFor = (p: Photo) => `PROHAIR 2026 — ${categoryName(p.category)}`;

  return (
    <section id="gallery" className="mt-16 scroll-mt-24 border-t border-border pt-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="section-kicker flex items-center gap-2">
            <Camera className="size-4" />
            {t("Фотогалерея", "Fotogalereya", "Photo gallery")}
          </p>
          <h2 className="section-title mt-2">{t("Как это было", "Qanday o‘tdi", "How it was")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t(
              "Два дня науки, встреч и вдохновения в Самарканде — лучшие моменты II Международного конгресса PROHAIR 2026.",
              "Samarqandda ikki kunlik ilm, uchrashuvlar va ilhom — II Xalqaro PROHAIR 2026 kongressining eng yorqin lahzalari.",
              "Two days of science, connections and inspiration in Samarkand — the best moments of the II International PROHAIR 2026 Congress.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("Категории фото", "Rasm toifalari", "Photo categories")}>
          {(["all", "science", "people", "atmosphere"] as const).map((c) => {
            const count = c === "all" ? PHOTOS.length : PHOTOS.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => {
                  setFilter(c);
                  setShowAll(false);
                }}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  filter === c ? "border-primary bg-primary text-primary-foreground shadow" : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {categoryName(c)} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid auto-rows-[140px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-4 md:gap-4 lg:auto-rows-[200px]">
        {visible.map((photo, i) => (
          <GalleryTile key={photo.id} photo={photo} index={i} featured={i === 0 && filter === "all"} onOpen={setOpenIndex} alt={altFor(photo)} />
        ))}
      </div>

      {filtered.length > INITIAL_COUNT && !showAll && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setShowAll(true)} className="h-12 rounded-xl px-6">
            <Images className="size-4" />
            {t(`Показать все ${filtered.length} фото`, `Barcha ${filtered.length} ta rasmni ko‘rsatish`, `Show all ${filtered.length} photos`)}
          </Button>
        </div>
      )}

      {openIndex !== null && (
        <Lightbox photos={filtered} index={openIndex} onClose={() => setOpenIndex(null)} onIndex={setOpenIndex} altFor={altFor} />
      )}
    </section>
  );
}
