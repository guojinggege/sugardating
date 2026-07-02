// Reddit-style Post Card — Vote 列 + Content (passive area 用 Link 包裹进详情页)
// 点击帖子主体(meta/title/body/tags)跳转 /community/[slug]/post/[postSlug]
// Vote / Poll / Actions 独立于 Link,click 不导航
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { CommunityPost, CommunityColor, PostBadge } from "@/lib/communityMock";
import CommunityPollCard from "./CommunityPollCard";

const DOT_COLOR: Record<CommunityColor, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};

const BADGE_STYLE: Record<PostBadge, { label: string; cls: string }> = {
  hot:       { label: "热议",   cls: "bg-[var(--cm-pink)]/12 text-[var(--cm-pink)] border-[var(--cm-pink)]/30" },
  adult:     { label: "18+",   cls: "bg-[var(--cm-purple)]/12 text-[var(--cm-purple)] border-[var(--cm-purple)]/30" },
  anonymous: { label: "匿名",   cls: "bg-white/[0.06] text-[var(--cm-muted)] border-white/[0.1]" },
  poll:      { label: "投票",   cls: "bg-[var(--cm-emerald)]/12 text-[var(--cm-emerald)] border-[var(--cm-emerald)]/30" },
  official:  { label: "官方",   cls: "bg-[var(--cm-gold)]/12 text-[var(--cm-gold)] border-[var(--cm-gold)]/30" },
  creator:   { label: "创作者", cls: "bg-white/[0.06] text-white border-white/[0.12]" },
};

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default function CommunityPostCard({ post }: { post: CommunityPost }) {
  const [vote, setVote] = useState<0 | 1 | -1>(0);
  const requireLogin = useRequireLogin();
  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  const dot = DOT_COLOR[post.communityColor];
  const displayScore = post.score + vote;
  const detailHref = `/community/${post.communitySlug}/post/${post.slug}`;
  const communityHref = `/community/${post.communitySlug}`;

  return (
    <article className="rounded-[18px] border border-white/[0.08] bg-white/[0.045] overflow-hidden transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]">
      <div className="flex">
        {/* Vote 列 — 独立,不导航 */}
        <div className="w-14 flex flex-col items-center gap-1.5 py-4 bg-white/[0.025] flex-shrink-0">
          <button
            type="button"
            onClick={guard(() => setVote(vote === 1 ? 0 : 1))}
            className={`w-8 h-8 grid place-items-center rounded-md transition ${
              vote === 1 ? "text-[var(--cm-pink)] bg-[var(--cm-pink)]/10" : "text-[var(--cm-muted)] hover:text-[var(--cm-pink)] hover:bg-white/[0.05]"
            }`}
            aria-label="Upvote"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg>
          </button>
          <div className="text-[12px] font-bold text-white tabular-nums leading-none">{fmt(displayScore)}</div>
          <button
            type="button"
            onClick={guard(() => setVote(vote === -1 ? 0 : -1))}
            className={`w-8 h-8 grid place-items-center rounded-md transition ${
              vote === -1 ? "text-[var(--cm-purple)] bg-[var(--cm-purple)]/10" : "text-[var(--cm-muted)] hover:text-[var(--cm-purple)] hover:bg-white/[0.05]"
            }`}
            aria-label="Downvote"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 20L4 10h5V4h6v6h5z"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 md:p-5">
          {/* Meta — community name 单独 Link,防嵌套 Link */}
          <div className="flex items-center gap-2 text-[11.5px] text-[var(--cm-muted)] mb-2.5 flex-wrap">
            <Link href={communityHref} className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[var(--cm-pink)] transition">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
              {post.communityName}
            </Link>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
            {post.badges.map((b) => {
              const s = BADGE_STYLE[b];
              return <span key={b} className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border leading-none ${s.cls}`}>{s.label}</span>;
            })}
          </div>

          {/* Passive area (title + body + tags) — 整块跳详情 */}
          <Link href={detailHref} className="block group">
            <h3 className="text-[17px] md:text-[18px] font-bold text-white leading-snug m-0 mb-2 group-hover:text-[var(--cm-pink)] transition-colors">
              {post.title}
            </h3>
            {post.body && (
              <p className="text-[13.5px] text-[var(--cm-text)]/85 leading-[1.7] m-0 mb-3 line-clamp-3">
                {post.body}
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((t) => (
                  <span key={t} className="text-[11px] text-[var(--cm-muted)] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">#{t}</span>
                ))}
              </div>
            )}
          </Link>

          {/* Poll — 独立,不导航 */}
          {post.poll && (
            <div className="mb-3">
              <CommunityPollCard options={post.poll.options} totalVotes={post.poll.totalVotes} />
            </div>
          )}

          {/* Actions — 独立,不导航 */}
          <div className="flex items-center gap-1 text-[var(--cm-muted)] -ml-2">
            <ActionBtn label={`${fmt(post.commentsCount)} 评论`} onClick={guard(() => {})} icon={<path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/>} />
            {post.roomCount !== undefined && post.roomCount > 0 && (
              <ActionBtn label={`${fmt(post.roomCount)} 在房间`} onClick={guard(() => {})} icon={<><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>} />
            )}
            <ActionBtn label="分享" onClick={guard(() => {})} icon={<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"/>} />
            <ActionBtn label="收藏" onClick={guard(() => {})} icon={<path d="M6 3h12v18l-6-4-6 4z"/>} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[12px] font-medium hover:bg-white/[0.05] hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      {label}
    </button>
  );
}
