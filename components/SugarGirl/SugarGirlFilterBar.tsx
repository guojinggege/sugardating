"use client";
// 顶部筛选栏 — 11 个维度,sticky,响应式 flex wrap
// 字段: 地区 / 国家 / 城市 / 年龄 / 语言 / 身高 / 体型 / 标签 / 在线状态 / 是否认证 / 排序
import { useTranslations } from "next-intl";
import {
  ageRanges, allCategories, allLanguages, cities, countries, heightRanges,
  REGIONS, BODY_TYPES,
} from "@/lib/sugarGirlMock";
import type { Region, SugarCategory, SugarTag, Interaction, BodyType } from "@/lib/sugarGirlMock";

export type SortKey = "latest" | "popular" | "recommended";
export type Scope = "all" | "featured";

export interface SugarFilters {
  scope: Scope;            // 主目录 vs 仅看精选
  region: Region | "all";  // 大区
  country: string;         // "all" or 国家名
  city: string;            // "all" or 城市名
  ageKey: string;
  heightKey: string;
  language: string;        // "all" or 具体语言
  bodyType: BodyType | "all";
  category: SugarCategory | "all";
  tag: SugarTag | "all";
  interaction: Interaction | "all";  // 互动类型 (sidebar 用)
  online: "all" | "yes" | "no";
  verified: "all" | "yes";
  sort: SortKey;
}

export const DEFAULT_FILTERS: SugarFilters = {
  scope: "all",
  region: "all",
  country: "all",
  city: "all",
  ageKey: "all",
  heightKey: "all",
  language: "all",
  bodyType: "all",
  category: "all",
  tag: "all",
  interaction: "all",
  online: "all",
  verified: "all",
  sort: "latest",
};

export function isDefaultFilters(f: SugarFilters): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof SugarFilters)[]).every(
    (k) => f[k] === DEFAULT_FILTERS[k]
  );
}

interface Props {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
  resultCount: number;
  total: number;
}

export default function SugarGirlFilterBar({ value, onChange, resultCount, total }: Props) {
  const t = useTranslations("sugarGirl.filter");
  const update = <K extends keyof SugarFilters>(k: K, v: SugarFilters[K]) =>
    onChange({ ...value, [k]: v });

  // 当前激活的筛选项数(不含 sort) —— 用于展示 X 个筛选已应用
  const activeCount = (Object.keys(DEFAULT_FILTERS) as (keyof SugarFilters)[])
    .filter((k) => k !== "sort" && value[k] !== DEFAULT_FILTERS[k])
    .length;

  return (
    <div className="sticky top-[64px] z-30 -mx-3 mb-6 border-y border-feed-line bg-feed-bg/85 px-3 backdrop-blur-xl md:top-[80px] md:mx-0 md:rounded-2xl md:border md:px-4">
      <div className="flex flex-wrap items-center gap-2 py-3">
        <Select
          label={t("region")}
          value={value.region}
          onChange={(v) => update("region", v as Region | "all")}
          options={[
            { v: "all", l: t("allRegions") },
            ...REGIONS.map((r) => ({ v: r.key, l: r.label })),
          ]}
        />
        <Select
          label={t("country")}
          value={value.country}
          onChange={(v) => update("country", v)}
          options={[{ v: "all", l: t("allCountries") }, ...countries.map((c) => ({ v: c, l: c }))]}
        />
        <Select
          label={t("city")}
          value={value.city}
          onChange={(v) => update("city", v)}
          options={[{ v: "all", l: t("allCities") }, ...cities.map((c) => ({ v: c, l: c }))]}
        />
        <Select
          label={t("age")}
          value={value.ageKey}
          onChange={(v) => update("ageKey", v)}
          options={ageRanges.map((r) => ({ v: r.key, l: r.label }))}
        />
        <Select
          label={t("language")}
          value={value.language}
          onChange={(v) => update("language", v)}
          options={[{ v: "all", l: t("allLanguages") }, ...allLanguages.map((l) => ({ v: l, l }))]}
        />
        <Select
          label={t("height")}
          value={value.heightKey}
          onChange={(v) => update("heightKey", v)}
          options={heightRanges.map((r) => ({ v: r.key, l: r.label }))}
        />
        <Select
          label={t("bodyType")}
          value={value.bodyType}
          onChange={(v) => update("bodyType", v as BodyType | "all")}
          options={[
            { v: "all", l: t("allBodyTypes") },
            ...BODY_TYPES.map((b) => ({ v: b.key, l: b.label })),
          ]}
        />
        <Select
          label={t("tag")}
          value={value.tag}
          onChange={(v) => update("tag", v as SugarTag | "all")}
          options={[
            { v: "all", l: t("allTags") },
            { v: "VIP", l: "VIP" },
            { v: "Verified", l: t("verified") },
            { v: "New", l: t("newcomer") },
          ]}
        />
        <Select
          label={t("category")}
          value={value.category}
          onChange={(v) => update("category", v as SugarCategory | "all")}
          options={[
            { v: "all", l: t("allCategories") },
            ...allCategories.map((c) => ({ v: c, l: c })),
          ]}
        />
        <Select
          label={t("online")}
          value={value.online}
          onChange={(v) => update("online", v as "all" | "yes" | "no")}
          options={[
            { v: "all", l: t("allOnline") },
            { v: "yes", l: t("onlineYes") },
            { v: "no",  l: t("onlineNo") },
          ]}
        />
        <Select
          label={t("verified")}
          value={value.verified}
          onChange={(v) => update("verified", v as "all" | "yes")}
          options={[
            { v: "all", l: t("allVerified") },
            { v: "yes", l: t("verifiedYes") },
          ]}
        />

        <div className="ml-auto flex items-center gap-2">
          <Select
            label={t("sort")}
            value={value.sort}
            onChange={(v) => update("sort", v as SortKey)}
            options={[
              { v: "latest",      l: t("sortLatest") },
              { v: "popular",     l: t("sortPopular") },
              { v: "recommended", l: t("sortRecommended") },
            ]}
          />
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...DEFAULT_FILTERS, sort: value.sort })}
              className="rounded-pill border border-feed-line2 px-3 py-1.5 text-[12px] font-semibold text-feed-mute transition hover:border-gold hover:text-gold"
            >
              {t("clear")} {activeCount}
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-feed-line py-2 text-[11.5px] text-feed-dim tabular-nums">
        {t("results", { count: resultCount, total })}
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
  const active = value !== "all" && value !== "latest";
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
