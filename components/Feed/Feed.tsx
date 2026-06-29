"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Tabs, { DEFAULT_TABS } from "./Tabs";
import PostCard from "./PostCard";
import Composer from "./Composer";
import type { FeedPost, FeedTabKey } from "./types";

// 中间列编排:Composer + Tabs(sticky) + 信息流 + 无限滚动 sentinel
export default function Feed({
  posts,
  composerAvatar,
  composerName,
}: {
  posts: FeedPost[];
  composerAvatar: string;
  composerName: string;
}) {
  const [active, setActive] = useState<FeedTabKey>("all");
  const [visible, setVisible] = useState(5);

  const filtered = useMemo(() => {
    const base =
      active === "image" ? posts.filter((p) => p.media.some((m) => m.type === "image"))
      : active === "video" ? posts.filter((p) => p.media.some((m) => m.type === "video"))
      : active === "vip"   ? posts.filter((p) => p.isVip)
      : active === "hot"   ? [...posts].sort((a, b) => b.stats.likes - a.stats.likes)
      : posts;
    return base;
  }, [posts, active]);

  // tab 切换时把可见数量重置
  useEffect(() => { setVisible(5); }, [active]);

  // 无限滚动 — sentinel 进入视口就把 visible 扩 4 条
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setVisible((v) => Math.min(v + 4, filtered.length));
      }
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const countBy: Partial<Record<FeedTabKey, number>> = useMemo(() => ({
    all: posts.length,
    image: posts.filter((p) => p.media.some((m) => m.type === "image")).length,
    video: posts.filter((p) => p.media.some((m) => m.type === "video")).length,
    vip: posts.filter((p) => p.isVip).length,
  }), [posts]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="flex flex-col gap-4">
      <Composer avatar={composerAvatar} name={composerName} />
      <Tabs tabs={DEFAULT_TABS} active={active} onChange={setActive} countBy={countBy} />

      {list.length === 0 ? (
        <div className="rounded-card border border-feed-line bg-feed-surface p-12 text-center text-feed-mute">
          该分类暂无内容
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {/* 无限滚动哨兵 */}
      {hasMore && (
        <div ref={sentinelRef} className="grid place-items-center py-8 text-[12px] text-feed-dim">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            加载更多…
          </span>
        </div>
      )}
      {!hasMore && list.length > 0 && (
        <div className="py-8 text-center text-[12px] text-feed-dim">— 没有更多了 —</div>
      )}
    </div>
  );
}
