"use client";
import { useMemo, useState } from "react";
import VideoCard from "./VideoCard";
import VideoFilterBar from "./VideoFilterBar";
import VideoSidebar from "./VideoSidebar";
import {
  applyCategory,
  applySort,
  type VideoCategoryKey,
  type VideoEntry,
  type VideoSortKey,
} from "@/lib/videoMock";

const PAGE_SIZE = 12;
const PAGE_STEP = 8;

// /video 编排:Sidebar(左固定) | [FilterBar 顶 + Grid + Load More](右)
export default function VideoGrid({ entries }: { entries: VideoEntry[] }) {
  const [category, setCategory] = useState<VideoCategoryKey>("all");
  const [sort, setSort]         = useState<VideoSortKey>("latest");
  const [visible, setVisible]   = useState(PAGE_SIZE);

  // category 决定 sort 是否被强制(latest/popular/recommended 三个 chip 同时也是 sort 维度)
  // 这里规则:点了带有 sort 含义的 category 时同步切 sort
  const onCategory = (k: VideoCategoryKey) => {
    setCategory(k);
    setVisible(PAGE_SIZE);
    if (k === "latest" || k === "popular" || k === "recommended") {
      setSort(k as VideoSortKey);
    }
  };
  const onSort = (k: VideoSortKey) => {
    setSort(k);
    setVisible(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const byCat = applyCategory(entries, category);
    return applySort(byCat, sort);
  }, [entries, category, sort]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-2 md:px-6 lg:px-8">
      {/* 顶部 chip 筛选 */}
      <VideoFilterBar active={category} onChange={onCategory} />

      <div className="grid gap-6 pt-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        {/* 左 Sidebar(lg 以上) */}
        <VideoSidebar
          activeCategory={category}
          activeSort={sort}
          onChangeCategory={onCategory}
          onChangeSort={onSort}
          countAll={entries.length}
        />

        {/* 右 Grid */}
        <main className="min-w-0">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-[22px] italic tracking-tight text-feed-ink md:text-[26px]">
              {labelOf(category)}
            </h2>
            <span className="text-[12px] text-feed-dim tabular-nums">{filtered.length} 个视频</span>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-feed-line bg-feed-surface p-12 text-center text-feed-mute">
              该条件下暂无视频
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
              {list.map((v) => (<VideoCard key={v.id} entry={v} />))}
            </div>
          )}

          {/* Load More */}
          <div className="grid place-items-center pt-12 pb-6">
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
              <span className="text-[12px] text-feed-dim">— 已展示全部 —</span>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function labelOf(k: VideoCategoryKey): string {
  switch (k) {
    case "all":         return "全部视频";
    case "recommended": return "推荐视频";
    case "latest":      return "最新发布";
    case "popular":     return "热门内容";
    case "featured":    return "精选创作者";
    case "verified":    return "已认证创作者";
    case "online":      return "在线中";
  }
}
