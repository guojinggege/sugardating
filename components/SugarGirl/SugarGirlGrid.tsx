"use client";
// SugarGirl 频道页主区编排:
//   FeaturedCarousel (顶部横向)
//   ↓
//   Sidebar (sticky 左) + [ FilterBar(sticky 顶) + Grid + LoadMore + Paywall ] (右)
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import FeaturedCarousel from "./FeaturedCarousel";
import SugarGirlCard from "./SugarGirlCard";
import SugarGirlFilterBar, { DEFAULT_FILTERS, isDefaultFilters } from "./SugarGirlFilterBar";
import type { SugarFilters } from "./SugarGirlFilterBar";
import SugarGirlSidebar from "./SugarGirlSidebar";
import type { QuickKey } from "./SugarGirlSidebar";
import { ageRanges, heightRanges } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";

const PAGE_SIZE = 12;
const PAGE_STEP = 8;

export default function SugarGirlGrid({ entries }: { entries: SugarGirlEntry[] }) {
  const t = useTranslations("sugarGirl");
  const [filters, setFilters] = useState<SugarFilters>(DEFAULT_FILTERS);
  const [activeQuick, setActiveQuick] = useState<QuickKey>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const featured = useMemo(() => entries.filter((e) => e.featured), [entries]);

  // 主目录过滤集 — scope=featured 时只看 featured,否则全集
  const pool = useMemo(
    () => (filters.scope === "featured" ? entries.filter((e) => e.featured) : entries),
    [entries, filters.scope]
  );

  const filtered = useMemo(() => {
    const ageR = ageRanges.find((r) => r.key === filters.ageKey);
    const htR  = heightRanges.find((r) => r.key === filters.heightKey);

    const list = pool.filter((e) => {
      if (filters.region   !== "all" && e.region   !== filters.region)   return false;
      if (filters.country  !== "all" && e.country  !== filters.country)  return false;
      if (filters.city     !== "all" && e.city     !== filters.city)     return false;
      if (filters.language !== "all" && !e.languages.includes(filters.language)) return false;
      if (filters.bodyType !== "all" && e.bodyType !== filters.bodyType) return false;
      if (filters.category !== "all" && !e.categories.includes(filters.category)) return false;
      if (filters.tag      !== "all" && !e.tags.includes(filters.tag))   return false;
      if (filters.interaction !== "all" && !e.interactions.includes(filters.interaction)) return false;
      if (filters.online === "yes" && !e.online) return false;
      if (filters.online === "no"  &&  e.online) return false;
      if (filters.verified === "yes" && !e.tags.includes("Verified")) return false;
      if (ageR && "min" in ageR && (e.age < (ageR as { min: number; max: number }).min || e.age > (ageR as { min: number; max: number }).max)) return false;
      if (htR  && "min" in htR  && (e.height < (htR as { min: number; max: number }).min || e.height > (htR as { min: number; max: number }).max)) return false;
      return true;
    });

    if (filters.sort === "popular") {
      list.sort((a, b) => b.popularity - a.popularity);
    } else if (filters.sort === "recommended") {
      // 推荐优先:featured 排前,其余按 popularity desc
      list.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.popularity - a.popularity;
      });
    } else {
      // latest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [pool, filters]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const onFilterBarChange = (next: SugarFilters) => {
    setFilters(next);
    setActiveQuick(isDefaultFilters(next) ? "all" : activeQuick);  // 用户手动改顶部筛选,sidebar 激活状态不动
    setVisible(PAGE_SIZE);
  };

  const onSidebarPick = (key: QuickKey, next: SugarFilters) => {
    setActiveQuick(key);
    setFilters(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
      {/* 1. 本期推荐 — 横向 carousel */}
      {featured.length > 0 && (
        <FeaturedCarousel items={featured} />
      )}

      {/* 2. 主目录 = Sidebar + (FilterBar + Grid) */}
      <section id="directory" className="scroll-mt-24 pt-12 md:pt-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">{t("directory.eyebrow")}</div>
            <h2 className="mt-1.5 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">{t("directory.title")}</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px,1fr] lg:gap-7 xl:grid-cols-[240px,1fr]">
          <SugarGirlSidebar active={activeQuick} onPick={onSidebarPick} />

          <div className="min-w-0">
            <SugarGirlFilterBar
              value={filters}
              onChange={onFilterBarChange}
              resultCount={filtered.length}
              total={entries.length}
            />

            {list.length === 0 ? (
              <div className="rounded-2xl border border-feed-line bg-feed-surface p-12 text-center text-feed-mute">
                <p className="mb-4 text-[14px]">{t("empty.title")}</p>
                <button
                  type="button"
                  onClick={() => { setFilters(DEFAULT_FILTERS); setActiveQuick("all"); }}
                  className="rounded-pill border border-feed-line2 px-5 py-2 text-[12.5px] font-semibold text-feed-ink transition hover:border-gold hover:text-gold"
                >
                  {t("empty.cta")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                {list.map((e) => (<SugarGirlCard key={e.id} entry={e} />))}
              </div>
            )}

            <div className="grid place-items-center pt-12">
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_STEP)}
                  className="group inline-flex items-center gap-2 rounded-pill border border-feed-line2 bg-feed-surface px-7 py-3 text-[13.5px] font-semibold text-feed-ink transition hover:border-gold hover:text-gold"
                >
                  {t("loadMore")}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-y-0.5">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </button>
              )}
            </div>

            {!hasMore && list.length > 0 && <PaywallGate />}
          </div>
        </div>
      </section>
    </div>
  );
}

function PaywallGate() {
  const t = useTranslations("sugarGirl.paywall");
  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.10] via-gold/[0.03] to-transparent p-8 text-center md:p-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(184,167,137,0.15),transparent_60%)]" />
      <div className="inline-flex items-center gap-2">
        <span className="h-px w-7 bg-gold" />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">{t("eyebrow")}</span>
        <span className="h-px w-7 bg-gold" />
      </div>
      <h3 className="mt-4 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">{t("title")}</h3>
      <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-feed-mute md:text-[14px]">{t("desc")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/membership"
          className="group inline-flex items-center gap-2 rounded-pill bg-gold px-7 py-3 text-[13.5px] font-semibold text-feed-bg transition hover:bg-gold-bright"
        >
          {t("join")}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-pill border border-feed-line2 px-6 py-3 text-[13px] font-medium text-feed-ink transition hover:border-gold hover:text-gold"
        >
          {t("login")}
        </Link>
      </div>
    </div>
  );
}
