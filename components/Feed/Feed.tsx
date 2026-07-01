"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Tabs, { DEFAULT_TABS } from "./Tabs";
import PostCard from "./PostCard";
import type { FeedPost, FeedTabKey } from "./types";

// V2:平台级 Discover Feed (无 Composer,posts 来自不同 creator)
// Tabs:For You / Following / Nearby / VIP / Newest
// (composerAvatar/composerName prop 保留兼容,不再使用)
const NEARBY_CITIES = new Set(["新加坡", "香港", "台北", "东京", "首尔", "曼谷", "吉隆坡", "上海"]);

export default function Feed({ posts }: { posts: FeedPost[]; composerAvatar?: string; composerName?: string }) {
  const [active, setActive] = useState<FeedTabKey>("for-you");
  const [visible, setVisible] = useState(5);

  const filtered = useMemo(() => {
    switch (active) {
      case "following":
        // Mock:随机取 60% 作为 followed
        return posts.filter((_, i) => (i * 7 + 3) % 5 < 3);
      case "nearby":
        return posts.filter((p) => p.authorCity && NEARBY_CITIES.has(p.authorCity));
      case "vip":
        return posts.filter((p) => p.isVip);
      case "newest":
        return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "for-you":
      default:
        return posts;
    }
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
    "for-you": posts.length,
    following: posts.filter((_, i) => (i * 7 + 3) % 5 < 3).length,
    nearby: posts.filter((p) => p.authorCity && NEARBY_CITIES.has(p.authorCity)).length,
    vip: posts.filter((p) => p.isVip).length,
    newest: posts.length,
  }), [posts]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="flex flex-col gap-4">
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
