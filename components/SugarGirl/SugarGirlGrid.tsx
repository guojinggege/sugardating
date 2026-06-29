"use client";
import { useMemo, useState } from "react";
import SugarGirlCard from "./SugarGirlCard";
import SugarGirlFilterBar, { DEFAULT_FILTERS, SugarFilters } from "./SugarGirlFilterBar";
import { ageRanges, heightRanges } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";

const PAGE_SIZE = 12;
const PAGE_STEP = 8;

// /male-artists 页编排:Featured(顶) + FilterBar + Grid + Load More
export default function SugarGirlGrid({ entries }: { entries: SugarGirlEntry[] }) {
  const [filters, setFilters] = useState<SugarFilters>(DEFAULT_FILTERS);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const featured = useMemo(() => entries.filter((e) => e.featured), [entries]);
  const rest = useMemo(() => entries.filter((e) => !e.featured), [entries]);

  const filtered = useMemo(() => {
    const ageR = ageRanges.find((r) => r.key === filters.ageKey);
    const htR  = heightRanges.find((r) => r.key === filters.heightKey);
    const list = rest.filter((e) => {
      if (filters.country !== "all" && e.country !== filters.country) return false;
      if (filters.city !== "all" && e.city !== filters.city) return false;
      if (filters.category !== "all" && !e.categories.includes(filters.category as any)) return false;
      if (ageR && "min" in ageR && (e.age < (ageR as any).min || e.age > (ageR as any).max)) return false;
      if (htR  && "min" in htR  && (e.height < (htR as any).min || e.height > (htR as any).max)) return false;
      return true;
    });
    if (filters.sort === "popular") {
      list.sort((a, b) => b.popularity - a.popularity);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [rest, filters]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const setFiltersAndReset = (next: SugarFilters) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
      {/* Featured */}
      {featured.length > 0 && (
        <section className="pt-12 md:pt-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">Featured</div>
              <h2 className="mt-1.5 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">本期推荐</h2>
            </div>
            <span className="text-[12px] text-feed-dim">手工精选</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {featured.map((e) => (<SugarGirlCard key={e.id} entry={e} />))}
          </div>
        </section>
      )}

      {/* 主目录 */}
      <section id="directory" className="scroll-mt-24 pt-16 md:pt-20">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">Directory</div>
            <h2 className="mt-1.5 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">全部 SugarGirl</h2>
          </div>
          <span className="text-[12px] text-feed-dim md:hidden tabular-nums">{filtered.length} 位</span>
        </div>

        <SugarGirlFilterBar value={filters} onChange={setFiltersAndReset} resultCount={filtered.length} />

        {list.length === 0 ? (
          <div className="rounded-2xl border border-feed-line bg-feed-surface p-12 text-center text-feed-mute">
            该条件下暂无人物 — 试试清空筛选
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {list.map((e) => (<SugarGirlCard key={e.id} entry={e} />))}
          </div>
        )}

        {/* Load More */}
        <div className="grid place-items-center pt-12 pb-4">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_STEP)}
              className="group inline-flex items-center gap-2 rounded-pill border border-feed-line2 bg-feed-surface px-7 py-3 text-[13.5px] font-semibold text-feed-ink transition hover:border-gold hover:text-gold"
            >
              加载更多
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-y-0.5">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </button>
          ) : list.length > 0 ? (
            <span className="text-[12px] text-feed-dim">— 没有更多了 —</span>
          ) : null}
        </div>
      </section>
    </div>
  );
}
