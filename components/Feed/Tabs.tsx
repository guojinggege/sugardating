"use client";
import type { FeedTabKey, FeedTabDef } from "./types";

export const DEFAULT_TABS: FeedTabDef[] = [
  { key: "all",   label: "全部" },
  { key: "image", label: "图片" },
  { key: "video", label: "视频" },
  { key: "vip",   label: "VIP" },
  { key: "hot",   label: "热门" },
];

interface Props {
  tabs?: FeedTabDef[];
  active: FeedTabKey;
  onChange: (k: FeedTabKey) => void;
  countBy?: Partial<Record<FeedTabKey, number>>;
}

// 顶部 sticky tab 条
export default function Tabs({ tabs = DEFAULT_TABS, active, onChange, countBy }: Props) {
  return (
    <div className="sticky top-0 z-30 -mx-1 border-b border-feed-line bg-feed-bg/82 px-1 backdrop-blur-xl">
      <div className="flex gap-1 overflow-x-auto py-2.5 scrollbar-hide">
        {tabs.map((t) => {
          const on = t.key === active;
          const c = countBy?.[t.key];
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(t.key)}
              className={`relative shrink-0 rounded-pill px-4 py-1.5 text-[13.5px] font-semibold transition ${
                on
                  ? "bg-feed-ink text-feed-bg"
                  : "text-feed-mute hover:bg-feed-elevated hover:text-feed-ink"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {t.label}
                {typeof c === "number" && (
                  <span className={`tabular-nums text-[11px] ${on ? "text-feed-bg/65" : "text-feed-dim"}`}>
                    {c}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
