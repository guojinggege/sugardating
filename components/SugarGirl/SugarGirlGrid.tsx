"use client";
import Link from "next/link";
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
        <div className="grid place-items-center pt-12">
          {hasMore && (
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
          )}
        </div>

        {/* Paywall — 已展示精选,完整目录需开通会员 */}
        {!hasMore && list.length > 0 && (
          <PaywallGate />
        )}
      </section>
    </div>
  );
}

function PaywallGate() {
  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.10] via-gold/[0.03] to-transparent p-8 text-center md:p-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(184,167,137,0.15),transparent_60%)]" />

      <div className="inline-flex items-center gap-2">
        <span className="h-px w-7 bg-gold" />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">Members Only</span>
        <span className="h-px w-7 bg-gold" />
      </div>

      <h3 className="mt-4 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">
        解锁完整目录
      </h3>

      <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-feed-mute md:text-[14px]">
        会员可查看完整 SugarGirl 目录、私信通道、隐藏照片与匹配推荐。已展示的是公开精选。
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/membership"
          className="group inline-flex items-center gap-2 rounded-pill bg-gold px-7 py-3 text-[13.5px] font-semibold text-feed-bg transition hover:bg-gold-bright"
        >
          开通会员
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-pill border border-feed-line2 px-6 py-3 text-[13px] font-medium text-feed-ink transition hover:border-gold hover:text-gold"
        >
          已有账号 · 登录
        </Link>
      </div>
    </div>
  );
}
