"use client";
// 关注面板 · 从当前 feed 里过滤 · P0 mock 通过 tag "VIP" 或 "推荐" 作为伪关注
import type { FeedPost } from "./types";
import PostCard from "./PostCard";

interface Props { posts: FeedPost[] }

export default function FollowingPanel({ posts }: Props) {
  // P0 · 无真实 following 关系 · 用 popularity > 阈值作为伪关注
  const filtered = posts.filter((p, i) => i % 2 === 0).slice(0, 12);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-feed-line bg-feed-card p-5">
        <div className="text-[11px] tracking-[.2em] uppercase text-[#B8A789] font-bold mb-1">Following</div>
        <h2 className="text-[22px] font-bold text-feed-ink italic" style={{ fontFamily: "'Cormorant Garamond',ui-serif" }}>关注</h2>
        <p className="text-[13px] text-feed-mute mt-1">来自你关注的创作者的最新动态。开始关注更多创作者以扩展内容源。</p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-feed-line bg-feed-card p-10 text-center text-feed-mute text-[13px]">
          <p className="mb-3">你还没有关注任何创作者。</p>
          <a href="/creators" className="text-feed-ink underline font-semibold">去发现</a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
