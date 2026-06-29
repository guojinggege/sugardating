"use client";
import { ageRanges, allCategories, cities, countries, heightRanges } from "@/lib/sugarGirlMock";

export type SortKey = "latest" | "popular";

export interface SugarFilters {
  country: string;   // "all" 表示不过滤
  city: string;
  ageKey: string;
  heightKey: string;
  category: string;
  sort: SortKey;
}

export const DEFAULT_FILTERS: SugarFilters = {
  country: "all",
  city: "all",
  ageKey: "all",
  heightKey: "all",
  category: "all",
  sort: "latest",
};

interface Props {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
  resultCount: number;
}

// 顶部 sticky 筛选条 — 6 个原生 <select>,自定义箭头 + 黑金风
export default function SugarGirlFilterBar({ value, onChange, resultCount }: Props) {
  const update = <K extends keyof SugarFilters>(k: K, v: SugarFilters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="sticky top-[60px] z-30 -mx-3 mb-6 border-y border-feed-line bg-feed-bg/85 px-3 backdrop-blur-xl md:top-[64px] md:mx-0 md:rounded-2xl md:border md:px-5">
      <div className="flex flex-wrap items-center gap-2 py-3 md:gap-3">
        <Select
          label="国家"
          value={value.country}
          onChange={(v) => update("country", v)}
          options={[{ v: "all", l: "全部国家" }, ...countries.map((c) => ({ v: c, l: c }))]}
        />
        <Select
          label="城市"
          value={value.city}
          onChange={(v) => update("city", v)}
          options={[{ v: "all", l: "全部城市" }, ...cities.map((c) => ({ v: c, l: c }))]}
        />
        <Select
          label="年龄"
          value={value.ageKey}
          onChange={(v) => update("ageKey", v)}
          options={ageRanges.map((r) => ({ v: r.key, l: r.label }))}
        />
        <Select
          label="身高"
          value={value.heightKey}
          onChange={(v) => update("heightKey", v)}
          options={heightRanges.map((r) => ({ v: r.key, l: r.label }))}
        />
        <Select
          label="分类"
          value={value.category}
          onChange={(v) => update("category", v)}
          options={[{ v: "all", l: "全部分类" }, ...allCategories.map((c) => ({ v: c, l: c }))]}
        />

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[12px] text-feed-dim md:inline tabular-nums">{resultCount} 位</span>
          <Select
            label="排序"
            value={value.sort}
            onChange={(v) => update("sort", v as SortKey)}
            options={[
              { v: "latest", l: "最新加入" },
              { v: "popular", l: "最受欢迎" },
            ]}
          />
          {!isDefault(value) && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="rounded-pill border border-feed-line2 px-3 py-1.5 text-[12px] font-semibold text-feed-mute transition hover:border-gold hover:text-gold"
            >
              清空
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  const active = !value.startsWith("all") && value !== "latest";
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`appearance-none cursor-pointer rounded-pill border bg-feed-surface py-1.5 pl-3.5 pr-9 text-[12.5px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/40 ${
          active
            ? "border-gold/60 text-gold"
            : "border-feed-line text-feed-ink hover:border-feed-line2"
        }`}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-[#161618] text-feed-ink">
            {label}: {o.l}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 h-3 w-3 fill-none stroke-current text-feed-mute" strokeWidth={2.4}>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  );
}

function isDefault(f: SugarFilters): boolean {
  return f.country === "all" && f.city === "all" && f.ageKey === "all" && f.heightKey === "all" && f.category === "all" && f.sort === "latest";
}
