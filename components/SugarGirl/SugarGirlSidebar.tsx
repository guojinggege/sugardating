"use client";
// 左侧分类导航 — sticky,5 个分组:
//   推荐专区 / 地区浏览 / 互动类型 / 人物标签 / 排序
// 每项是 quick-filter shortcut:点击应用一组组合筛选条件
import { useTranslations } from "next-intl";
import type { SugarFilters } from "./SugarGirlFilterBar";
import { DEFAULT_FILTERS } from "./SugarGirlFilterBar";
import type { Region, Interaction, SugarTag } from "@/lib/sugarGirlMock";

export type QuickKey =
  | "all"
  // 推荐专区
  | "featured" | "popular" | "latest" | "online"
  // 地区
  | "r-se-asia" | "r-east-asia" | "r-east-europe" | "r-other"
  // 互动
  | "i-dating" | "i-travel" | "i-shoot" | "i-video-chat"
  // 标签
  | "t-verified" | "t-new" | "t-vip" | "t-popular"
  // 排序
  | "s-latest" | "s-popular";

interface Props {
  active: QuickKey;
  onPick: (key: QuickKey, nextFilters: SugarFilters) => void;
  counts?: Partial<Record<QuickKey, number>>;
}

// 每个 quick-filter 把当前筛选条件组合成一份完整 SugarFilters
function buildFilters(key: QuickKey): SugarFilters {
  switch (key) {
    case "featured": return { ...DEFAULT_FILTERS, scope: "featured" };
    case "popular":  return { ...DEFAULT_FILTERS, sort: "popular" };
    case "latest":   return { ...DEFAULT_FILTERS, sort: "latest" };
    case "online":   return { ...DEFAULT_FILTERS, online: "yes" };

    case "r-se-asia":     return { ...DEFAULT_FILTERS, region: "se-asia" as Region };
    case "r-east-asia":   return { ...DEFAULT_FILTERS, region: "east-asia" as Region };
    case "r-east-europe": return { ...DEFAULT_FILTERS, region: "east-europe" as Region };
    case "r-other":       return { ...DEFAULT_FILTERS, region: "other" as Region };

    case "i-dating":     return { ...DEFAULT_FILTERS, interaction: "dating" as Interaction };
    case "i-travel":     return { ...DEFAULT_FILTERS, interaction: "travel" as Interaction };
    case "i-shoot":      return { ...DEFAULT_FILTERS, interaction: "shoot" as Interaction };
    case "i-video-chat": return { ...DEFAULT_FILTERS, interaction: "video-chat" as Interaction };

    case "t-verified": return { ...DEFAULT_FILTERS, tag: "Verified" as SugarTag };
    case "t-new":      return { ...DEFAULT_FILTERS, tag: "New" as SugarTag };
    case "t-vip":      return { ...DEFAULT_FILTERS, tag: "VIP" as SugarTag };
    case "t-popular":  return { ...DEFAULT_FILTERS, sort: "popular" };

    case "s-latest":   return { ...DEFAULT_FILTERS, sort: "latest" };
    case "s-popular":  return { ...DEFAULT_FILTERS, sort: "popular" };

    case "all":
    default:           return { ...DEFAULT_FILTERS };
  }
}

export default function SugarGirlSidebar({ active, onPick, counts = {} }: Props) {
  const t = useTranslations("sugarGirl.sidebar");

  const item = (key: QuickKey, label: string) => {
    const isOn = active === key;
    const n = counts[key];
    return (
      <button
        key={key}
        type="button"
        onClick={() => onPick(key, buildFilters(key))}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition ${
          isOn
            ? "bg-gold/12 text-gold font-semibold"
            : "text-feed-ink/82 hover:bg-white/[0.04] hover:text-feed-ink"
        }`}
      >
        <span className="truncate">{label}</span>
        {typeof n === "number" && (
          <span className={`ml-2 shrink-0 text-[11px] tabular-nums ${isOn ? "text-gold" : "text-feed-dim"}`}>{n}</span>
        )}
      </button>
    );
  };

  const group = (title: string, children: React.ReactNode) => (
    <div className="mb-5">
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-feed-dim">{title}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-[100px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin]">
      <div className="rounded-2xl border border-feed-line bg-feed-surface p-3 backdrop-blur md:p-4">
        {/* 一键回到全部 */}
        <button
          type="button"
          onClick={() => onPick("all", buildFilters("all"))}
          className={`mb-4 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[13px] font-semibold transition ${
            active === "all"
              ? "border-gold/40 bg-gold/8 text-gold"
              : "border-feed-line2 text-feed-ink hover:border-gold/40 hover:text-gold"
          }`}
        >
          <span>{t("all")}</span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth={2.2}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>

        {group(t("title.recommend"), <>
          {item("featured", t("featured"))}
          {item("popular",  t("popularRec"))}
          {item("latest",   t("latestJoin"))}
          {item("online",   t("onlineNow"))}
        </>)}

        {group(t("title.region"), <>
          {item("r-se-asia",     t("seAsia"))}
          {item("r-east-asia",   t("eastAsia"))}
          {item("r-east-europe", t("eastEurope"))}
          {item("r-other",       t("other"))}
        </>)}

        {group(t("title.interact"), <>
          {item("i-dating",     t("dating"))}
          {item("i-travel",     t("travel"))}
          {item("i-shoot",      t("shoot"))}
          {item("i-video-chat", t("videoChat"))}
        </>)}

        {group(t("title.tags"), <>
          {item("t-verified", t("verified"))}
          {item("t-new",      t("newComer"))}
          {item("t-popular",  t("highPopular"))}
          {item("t-vip",      t("vip"))}
        </>)}

        {group(t("title.sort"), <>
          {item("s-latest",  t("sortLatest"))}
          {item("s-popular", t("sortPopular"))}
        </>)}
      </div>
    </aside>
  );
}
