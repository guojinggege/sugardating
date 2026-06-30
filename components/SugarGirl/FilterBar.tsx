"use client";
// FilterBar — 2 行布局
//   Row 1: [地区 70%] [距离 30%]
//   Row 2: 4 等宽: 服务类型 / 人物标签 / 分类 / 更多筛选
// 内部用 FilterDropdown 组件,白卡 label-on-top
import { useTranslations } from "next-intl";
import FilterDropdown, { FilterOption, FilterSectionTitle } from "./FilterDropdown";
import {
  ageRanges, allLanguages, citiesByCountry, heightRanges, INTERACTIONS,
} from "@/lib/sugarGirlMock";
import type { Interaction } from "@/lib/sugarGirlMock";

export type Distance = "all" | "near" | "5km" | "10km" | "20km" | "50km";
export type PersonTag = "online" | "verified" | "new" | "trending" | "vip";
export type SortKey = "latest" | "recommended" | "popular" | "top-rated";

export interface SugarFilters {
  // 主目录
  scope: "all" | "featured";
  // 地区 dropdown (Row 1)
  country: string;   // "all" 或国家中文名
  city: string;      // "all" 或城市中文名 (二级)
  // 距离 dropdown (Row 1)
  distance: Distance;
  // 服务类型 dropdown (Row 2)
  interaction: Interaction | "all";
  // 人物标签 dropdown (Row 2,composite)
  personTag: PersonTag | "all";
  // 分类 dropdown (Row 2,= sort)
  sort: SortKey;
  // 更多筛选 popover (Row 2)
  ageKey: string;
  heightKey: string;
  language: string;
  onlineMore: "all" | "yes";
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
  sort: "latest",
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

// 当前 More 弹层激活的子项个数 (用于 trigger 上的角标)
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

interface Props {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
  resultCount: number;
  total: number;
}

export default function FilterBar({ value, onChange, resultCount, total }: Props) {
  const t  = useTranslations("sugarGirl.filter");
  const tD = useTranslations("sugarGirl.filter.distance");
  const tT = useTranslations("sugarGirl.filter.personTag");
  const tS = useTranslations("sugarGirl.filter.sortLabel");

  const update = <K extends keyof SugarFilters>(k: K, v: SugarFilters[K]) =>
    onChange({ ...value, [k]: v });

  // —— Region 显示值
  const regionDisplay =
    value.country === "all" ? t("regionPlaceholder")
    : value.city !== "all"  ? `${value.country} · ${value.city}`
    : value.country;

  // —— Distance 显示
  const distanceDisplay = tD(distanceKey(value.distance));

  // —— Service 显示
  const serviceDisplay = value.interaction === "all"
    ? t("anyService")
    : INTERACTIONS.find((i) => i.key === value.interaction)?.label ?? "";

  // —— PersonTag 显示
  const tagDisplay = value.personTag === "all"
    ? t("anyTag")
    : tT(value.personTag);

  // —— Sort/Category 显示
  const sortDisplay = tS(value.sort);

  // —— More 角标
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

      {/* Row 2: 4 equal-width */}
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
          {(close) => {
            const tags: PersonTag[] = ["online", "verified", "new", "trending", "vip"];
            return (
              <div className="flex flex-col gap-0.5">
                <FilterOption
                  active={value.personTag === "all"}
                  onSelect={() => { update("personTag", "all"); close(); }}
                >
                  {t("anyTag")}
                </FilterOption>
                {tags.map((tg) => (
                  <FilterOption
                    key={tg}
                    active={value.personTag === tg}
                    onSelect={() => { update("personTag", tg); close(); }}
                  >
                    {tT(tg)}
                  </FilterOption>
                ))}
              </div>
            );
          }}
        </FilterDropdown>

        <FilterDropdown
          label={t("category")}
          display={sortDisplay}
          active={value.sort !== "latest"}
        >
          {(close) => {
            const sorts: SortKey[] = ["latest", "recommended", "popular", "top-rated"];
            return (
              <div className="flex flex-col gap-0.5">
                {sorts.map((s) => (
                  <FilterOption
                    key={s}
                    active={value.sort === s}
                    onSelect={() => { update("sort", s); close(); }}
                  >
                    {tS(s)}
                  </FilterOption>
                ))}
              </div>
            );
          }}
        </FilterDropdown>

        <FilterDropdown
          label={t("more")}
          display={moreDisplay}
          active={moreCount > 0}
          align="right"
          panelClassName="min-w-[340px] md:min-w-[400px]"
        >
          {() => (
            <MorePanel value={value} onChange={onChange} />
          )}
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
// Region popover — 二级联动:左 country list / 右 city list
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
      {/* 左:国家列表 */}
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
      {/* 右:城市列表 (country!=all 时显示) */}
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
// More popover — 4 个子筛选:年龄 / 身高 / 语言 / 是否在线
function MorePanel({
  value, onChange,
}: {
  value: SugarFilters;
  onChange: (next: SugarFilters) => void;
}) {
  const t  = useTranslations("sugarGirl.filter.more");

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
        <FilterSectionTitle>{t("age")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          {ageRanges.map((r) => (
            <Chip
              key={r.key}
              on={value.ageKey === r.key}
              onClick={() => onChange({ ...value, ageKey: r.key })}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </div>
      {/* 身高 */}
      <div>
        <FilterSectionTitle>{t("height")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          {heightRanges.map((r) => (
            <Chip
              key={r.key}
              on={value.heightKey === r.key}
              onClick={() => onChange({ ...value, heightKey: r.key })}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </div>
      {/* 语言 */}
      <div>
        <FilterSectionTitle>{t("language")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          <Chip
            on={value.language === "all"}
            onClick={() => onChange({ ...value, language: "all" })}
          >
            {t("anyLanguage")}
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
      {/* 是否在线 */}
      <div>
        <FilterSectionTitle>{t("onlineState")}</FilterSectionTitle>
        <div className="flex flex-wrap gap-1.5 px-1 pt-1.5">
          <Chip
            on={value.onlineMore === "all"}
            onClick={() => onChange({ ...value, onlineMore: "all" })}
          >
            {t("any")}
          </Chip>
          <Chip
            on={value.onlineMore === "yes"}
            onClick={() => onChange({ ...value, onlineMore: "yes" })}
          >
            {t("onlineOnly")}
          </Chip>
        </div>
      </div>
    </div>
  );
}
