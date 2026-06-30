"use client";
import { VIDEO_CATEGORIES, VIDEO_SORTS, type VideoCategoryKey, type VideoSortKey } from "@/lib/videoMock";

interface Props {
  activeCategory: VideoCategoryKey;
  activeSort: VideoSortKey;
  onChangeCategory: (k: VideoCategoryKey) => void;
  onChangeSort: (k: VideoSortKey) => void;
  countAll: number;        // 顶部"全部"右侧的数字
}

// 桌面端左侧固定 sidebar — 分类列表 + 排序
export default function VideoSidebar({
  activeCategory, activeSort, onChangeCategory, onChangeSort, countAll,
}: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[140px] flex flex-col gap-6 rounded-2xl border border-feed-line bg-feed-surface p-5">
        {/* 分类 */}
        <section>
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">分类</div>
          <ul className="flex flex-col gap-1">
            {VIDEO_CATEGORIES.map((c) => {
              const on = c.key === activeCategory;
              return (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => onChangeCategory(c.key)}
                    aria-pressed={on}
                    className={`flex w-full items-center justify-between rounded-pill px-3.5 py-2 text-left text-[13.5px] font-medium transition ${
                      on
                        ? "bg-gold/15 text-gold border border-gold/40"
                        : "text-feed-mute hover:bg-feed-elevated hover:text-feed-ink"
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.key === "all" && (
                      <span className="text-[11px] text-feed-dim tabular-nums">{countAll}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 排序 */}
        <section>
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">排序</div>
          <ul className="flex flex-col gap-1">
            {VIDEO_SORTS.map((s) => {
              const on = s.key === activeSort;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => onChangeSort(s.key)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-2 rounded-pill px-3.5 py-2 text-left text-[13px] font-medium transition ${
                      on
                        ? "text-feed-ink"
                        : "text-feed-mute hover:text-feed-ink"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full transition ${on ? "bg-gold" : "bg-feed-dim group-hover:bg-feed-mute"}`} />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </aside>
  );
}
