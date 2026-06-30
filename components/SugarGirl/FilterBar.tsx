"use client";
// FilterBar — 2 行布局
//   Row 1: [地区 70%] [距离 30%]
//   Row 2: 4 等宽: 服务类型 / 人物标签 / 排序 / 更多筛选
// 内部用 FilterDropdown 组件,白卡 label-on-top
import { useTranslations } from "next-intl";
import FilterDropdown, { FilterOption, FilterSectionTitle } from "./FilterDropdown";
import {
  ageRanges, allLanguages, citiesByCountry, heightRanges, INTERACTIONS,
} from "@/lib/sugarGirlMock";
import type { Interaction } from "@/lib/sugarGirlMock";

export type Distance = "all" | "near" | "5km" | "10km" | "20km" | "50km";
export type PersonTag = "online" | "verified" | "new" | "trending" | "vip";
export type SortKey = "recommended" | "latest" | "popular" | "online-now" | "top-rated";

export interface SugarFilters {
  scope: "all" | "featured";
  country: string;
  city: string;
  distance: Distance;
  interaction: Interaction | "all";
  personTag: PersonTag | "all";
  sort: SortKey;
  ageKey: string;
  heightKey: string;
  language: string;
  onlineMore: "all" | "yes" | "recent";
  // Sidebar 兼容字段
  region: "all" | "se-asia" | "east-asia" | "east-europe" | "other";
}

export const DEFAULT_FILTERS: SugarFilters = {
  scope: "all",
  country: "all",
  city: "all",
  distance: "all",
  interaction: "all",
  personTag: "all",
  sort: "recommended",   // 默认推荐优先
  ageKey: "all",
  heightKey: "all",
  language: "all",
  onlineMore: "all",
  region: "all",
};

export function isDefaultFilters(f: SugarFilters): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof SugarFilters)[]).every(
    (k) => f[k] === DEFAULT_FILTERS[k]
  );
}

export function countMoreActive(f: SugarFilters): number {
  let n = 0;
  if (f.ageKey !== "all") n++;
  if (f.heightKey !== "all") n++;
  if (f.language !== "all") n++;
  if (f.onlineMore !== "all") n++;
  return n;
}

const DISTANCES: { v: Distance; key: string }[] = [
  { v: "all",  key: "any" },
  { v: "near", key: "near" },
  { v: "5km",  key: "km5" },
  { v: "10km", key: "km10" },
  { v: "20km", key: "km20" },
  { v: "50km", key: "km50" },
];

const PERSON_TAGS: PersonTag[] = ["online", "verified", "new", "trending", "vip"];
const SORT_KEYS: SortKey[] = ["recommended", "latest", "popular", "online-now", "top-rated"];

interface Props {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
  resultCount: number;
  total: number;
}

export default function FilterBar({ value, onChange, resultCount, total }: Props) {
  const t  = useTranslations("sugarGirl.filter");
  const tD = useTranslations("sugarGirl.filter.distances");
  const tT = useTranslations("sugarGirl.filter.personTags");
  const tS = useTranslations("sugarGirl.filter.sorts");

  const update = <K extends keyof SugarFilters>(k: K, v: SugarFilters[K]) =>
    onChange({ ...value, [k]: v });

  const regionDisplay =
    value.country === "all" ? t("regionPlaceholder")
    : value.city !== "all"  ? `${value.country} · ${value.city}`
    : value.country;

  const distanceDisplay = tD(distanceKey(value.distance));

  const serviceDisplay = value.interaction === "all"
    ? t("anyService")
    : INTERACTIONS.find((i) => i.key === value.interaction)?.label ?? "";

  const tagDisplay = value.personTag === "all" ? t("anyTag") : tT(value.personTag);

  const sortDisplay = tS(value.sort);

  const moreCount = countMoreActive(value);
  const moreDisplay = moreCount > 0 ? t("moreActive", { count: moreCount }) : t("moreAny");

  const activeCount =
    (value.country  !== "all" ? 1 : 0) +
    (value.city     !== "all" ? 1 : 0) +
    (value.distance !== "all" ? 1 : 0) +
    (value.interaction !== "all" ? 1 : 0) +
    (value.personTag   !== "all" ? 1 : 0) +
    moreCount;

  const reset = () => onChange({ ...DEFAULT_FILTERS, sort: value.sort });

  return (
    <div className="sticky top-[64px] z-30 mb-6 -mx-3 border-y border-feed-line bg-feed-bg/85 px-3 py-4 backdrop-blur-xl md:top-[80px] md:mx-0 md:rounded-2xl md:border md:px-5 md:py-5">
      {/* Row 1: Region (70%) + Distance (30%) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[7fr,3fr]">
        <FilterDropdown
          label={t("region")}
          display={regionDisplay}
          placeholder={t("regionPlaceholder")}
          active={value.country !== "all" || value.city !== "all"}
          align="stretch"
          panelClassName="max-h-[60vh] overflow-y-auto"
        >
          {(close) => (
            <RegionPanel
              country={value.country}
              city={value.city}
              onPick={(country, city) => {
                onChange({ ...value, country, city });
                close();
              }}
              labels={{
                allCountries: t("allCountries"),
                allCitiesIn: t("allCitiesIn"),
              }}
            />
          )}
        </FilterDropdown>

        <FilterDropdown
          label={t("distance")}
          display={distanceDisplay}
          active={value.distance !== "all"}
        >
          {(close) => (
            <div className="flex flex-col gap-0.5">
              {DISTANCES.map((d) => (
                <FilterOption
                  key={d.v}
                  active={value.distance === d.v}
                  onSelect={() => { update("distance", d.v); close(); }}
                >
                  {tD(d.key)}
                </FilterOption>
              ))}
            </div>
          )}
        </FilterDropdown>
      </div>

      {/* Row 2: 4 equal-width — 服务 / 人物标签 / 排序 / 更多筛选 */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <FilterDropdown
          label={t("service")}
          display={serviceDisplay}
          active={value.interaction !== "all"}
        >
          {(close) => (
            <div className="flex flex-col gap-0.5">
              <FilterOption
                active={value.interaction === "all"}
                onSelect={() => { update("interaction", "all"); close(); }}
              >
                {t("anyService")}
              </FilterOption>
              {INTERACTIONS.map((i) => (
                <FilterOption
                  key={i.key}
                  active={value.interaction === i.key}
                  onSelect={() => { update("interaction", i.key); close(); }}
                >
                  {i.label}
                </FilterOption>
              ))}
            </div>
          )}
        </FilterDropdown>

        <FilterDropdown
          label={t("tag")}
          display={tagDisplay}
          active={value.personTag !== "all"}
        >
          {(close) => (
            <div className="flex flex-col gap-0.5">
              <FilterOption
                active={value.personTag === "all"}
                onSelect={() => { update("personTag", "all"); close(); }}
              >
                {t("anyTag")}
              </FilterOption>
              {PERSON_TAGS.map((tg) => (
                <FilterOption
                  key={tg}
                  active={value.personTag === tg}
                  onSelect={() => { update("personTag", tg); close(); }}
                >
                  {tT(tg)}
                </FilterOption>
              ))}
            </div>
          )}
        </FilterDropdown>

        <FilterDropdown
          label={t("sortBy")}
          display={sortDisplay}
          active={value.sort !== "recommended"}
        >
          {(close) => (
            <div className="flex flex-col gap-0.5">
              {SORT_KEYS.map((s) => (
                <FilterOption
                  key={s}
                  active={value.sort === s}
                  onSelect={() => { update("sort", s); close(); }}
                >
                  {tS(s)}
                </FilterOption>
              ))}
            </div>
          )}
        </FilterDropdown>

        <FilterDropdown
          label={t("more")}
          display={moreDisplay}
          active={moreCount > 0}
          align="right"
          panelClassName="min-w-[340px] md:min-w-[400px]"
        >
          {() => <MorePanel value={value} onChange={onChange} />}
        </FilterDropdown>
      </div>

      {/* Footer: 统计 + 清空 */}
      <div className="mt-4 flex items-center justify-between border-t border-feed-line pt-3 text-[12px] text-feed-dim tabular-nums">
        <span>{t("results", { count: resultCount, total })}</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="rounded-pill border border-feed-line2 px-3 py-1.5 text-[12px] font-semibold text-feed-mute transition hover:border-gold hover:text-gold"
          >
            {t("clear")} · {activeCount}
          </button>
        )}
      </div>
    </div>
  );
}

function distanceKey(d: Distance): string {
  switch (d) {
    case "near": return "near";
    case "5km":  return "km5";
    case "10km": return "km10";
    case "20km": return "km20";
    case "50km": return "km50";
    default:     return "any";
  }
}

// ──────────────────────────────────────────────────────────────────────
function RegionPanel({
  country, city, onPick, labels,
}: {
  country: string;
  city: string;
  onPick: (country: string, city: string) => void;
  labels: { allCountries: string; allCitiesIn: string };
}) {
  const allCountries = Object.keys(citiesByCountry).sort();
  const activeCountry = country !== "all" ? country : allCountries[0];
  const citiesList = country !== "all" ? citiesByCountry[country] ?? [] : [];

  return (
    <div className="grid grid-cols-[160px,1fr] gap-2 p-1">
      <div className="flex max-h-[320px] flex-col gap-0.5 overflow-y-auto border-r border-zinc-200 pr-2">
        <FilterOption
          active={country === "all"}
          onSelect={() => onPick("all", "all")}
        >
          {labels.allCountries}
        </FilterOption>
        {allCountries.map((c) => (
          <FilterOption
            key={c}
            active={country === c}
            onSelect={() => onPick(c, "all")}
          >
            {c}
          </FilterOption>
        ))}
      </div>
      <div className="flex max-h-[320px] flex-col gap-0.5 overflow-y-auto">
        {country !== "all" ? (
          <>
            <FilterOption
              active={city === "all"}
              onSelect={() => onPick(country, "all")}
            >
              {labels.allCitiesIn} {activeCountry}
            </FilterOption>
            {citiesList.map((ct) => (
              <FilterOption
                key={ct}
                active={city === ct}
                onSelect={() => onPick(country, ct)}
              >
                {ct}
              </FilterOption>
            ))}
          </>
        ) : (
          <div className="grid place-items-center p-6 text-center text-[12px] text-zinc-400">
            <span>←</span>
            <span className="mt-1">请先选择国家</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
function MorePanel({
  value, onChange,
}: {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
}) {
  const tM = useTranslations("sugarGirl.filter.moreFilters");

  const Chip = ({
    on, onClick, children,
  }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition ${
        on
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col gap-3 p-2">
      {/* 年龄 */}
      <div>
        <FilterSectionTitle>{tM("age")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          {ageRanges.map((r) => (
            <Chip
              key={r.key}
              on={value.ageKey === r.key}
              onClick={() => onChange({ ...value, ageKey: r.key })}
            >
              {r.key === "all" ? tM("anyAge") : r.label}
            </Chip>
          ))}
        </div>
      </div>
      {/* 身高 */}
      <div>
        <FilterSectionTitle>{tM("height")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          {heightRanges.map((r) => (
            <Chip
              key={r.key}
              on={value.heightKey === r.key}
              onClick={() => onChange({ ...value, heightKey: r.key })}
            >
              {r.key === "all" ? tM("anyHeight") : r.label}
            </Chip>
          ))}
        </div>
      </div>
      {/* 语言 */}
      <div>
        <FilterSectionTitle>{tM("language")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          <Chip
            on={value.language === "all"}
            onClick={() => onChange({ ...value, language: "all" })}
          >
            {tM("anyLanguage")}
          </Chip>
          {allLanguages.map((l) => (
            <Chip
              key={l}
              on={value.language === l}
              onClick={() => onChange({ ...value, language: l })}
            >
              {l}
            </Chip>
          ))}
        </div>
      </div>
      {/* 在线状态 */}
      <div>
        <FilterSectionTitle>{tM("onlineState")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          <Chip
            on={value.onlineMore === "all"}
            onClick={() => onChange({ ...value, onlineMore: "all" })}
          >
            {tM("any")}
          </Chip>
          <Chip
            on={value.onlineMore === "yes"}
            onClick={() => onChange({ ...value, onlineMore: "yes" })}
          >
            {tM("onlineOnly")}
          </Chip>
          <Chip
            on={value.onlineMore === "recent"}
            onClick={() => onChange({ ...value, onlineMore: "recent" })}
          >
            {tM("onlineRecent")}
          </Chip>
        </div>
      </div>
    </div>
  );
}
