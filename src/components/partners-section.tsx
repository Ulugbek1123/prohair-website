import { useEffect, useState } from "react";
import { useLanguage } from "../lib/language";
import { partnersData, Partner } from "../lib/data";

export function PartnersSection() {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>(partnersData);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge with fallback data to preserve clean names if DB has empty names
          const merged = data.map((item: Partner) => {
            const fallback = partnersData.find((p) => p.id === item.id || p.image === item.image);
            return {
              ...item,
              name: item.name && item.name.trim() ? item.name : fallback?.name || "",
              type: item.type || fallback?.type || "partner"
            };
          });
          setPartners(merged);
        }
      })
      .catch(() => {});
  }, []);

  const generalPartner = partners.find((p) => p.type === "general" || p.id === 35) || partnersData[0];
  const regularPartners = partners.filter((p) => p.id !== generalPartner?.id && p.type !== "general");

  return (
    <section id="partners" className="relative z-10 py-16 sm:py-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center">
          <p className="section-kicker">
            {t("Партнеры и Спонсоры", "Hamkorlar va Homiylar", "Partners & Sponsors")}
          </p>
          <h2 className="section-title mt-2">
            {t("При поддержке лидеров отрасли", "Soha yetakchilari ko‘magida", "Supported by Industry Leaders")}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Ведущие фармацевтические компании, производители трихологических препаратов, клиники и научные центры — партнеры Конгресса PROHAIR 2026.",
              "Yetakchi farmatsevtika kompaniyalari, trixologik preparatlar ishlab chiqaruvchilari, klinikalar va ilmiy markazlar — PROHAIR 2026 Kongressi hamkorlari.",
              "Leading pharmaceutical brands, trichology product manufacturers, clinics, and academic academies supporting the PROHAIR 2026 Congress."
            )}
          </p>
        </div>

        {/* Генеральный партнер */}
        {generalPartner && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              {t("Генеральный партнер", "Bosh hamkor", "General Partner")}
            </div>

            <div className="mt-5 mx-auto max-w-md rounded-3xl border border-accent/30 bg-white p-8 sm:p-10 shadow-lg transition-all duration-300 hover:border-accent hover:shadow-2xl group flex flex-col items-center justify-center">
              <div className="flex h-28 w-full items-center justify-center">
                <img
                  src={generalPartner.image}
                  alt={generalPartner.name}
                  loading="lazy"
                  className="max-h-24 max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/uploads/1786426301457.png";
                  }}
                />
              </div>
              <p className="mt-4 font-serif text-xl font-bold text-neutral-900 tracking-wide">
                {generalPartner.name}
              </p>
              <p className="mt-1 text-xs text-neutral-500 font-medium">
                {t(
                  "Генеральный партнер Конгресса PROHAIR 2026",
                  "PROHAIR 2026 Kongressi Bosh Hamkori",
                  "General Partner of PROHAIR 2026 Congress"
                )}
              </p>
            </div>
          </div>
        )}

        {/* Официальные партнеры и спонсоры */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {t("Официальные партнеры и спонсоры", "Rasmiy hamkorlar va homiylar", "Official Partners & Sponsors")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {regularPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg group"
              >
                <div className="flex h-16 w-full items-center justify-center">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-12 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <p className="mt-3 font-semibold text-xs text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
