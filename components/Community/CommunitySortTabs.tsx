// Reddit-style 排序 Tabs — 热门 / 最新 / 24h 榜 / 关注 / 精华
"use client";
import { useState } from "react";

const TABS = [
  { k: "hot",     label: "热门" },
  { k: "new",     label: "最新" },
  { k: "day",     label: "24h 榜" },
  { k: "follow",  label: "关注" },
  { k: "picked",  label: "精华" },
];

interface Props {
  postsCount: number;
}

export default function CommunitySortTabs({ postsCount }: Props) {
  const [active, setActive] = useState("hot");

  return (
    <section
      className="rounded-[14px] border p-1.5 flex items-center gap-1"
      style={{ background: "rgba(255,255,255,0.045)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setActive(t.k)}
            className={`h-9 px-3.5 rounded-[10px] text-[13px] font-semibold whitespace-nowrap transition ${
              active === t.k
                ? "bg-white/10 text-white"
                : "text-[var(--cm-muted)] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="hidden sm:block text-[12px] text-[var(--cm-muted)] pr-2 tabular-nums shrink-0">
        {postsCount} 帖
      </div>
    </section>
  );
}
