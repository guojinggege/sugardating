"use client";
// Mobile Community Post Card — Reddit-style 单列紧凑
// 头部 meta · 标题 · 正文 · badges · 底部 actions bar (含 vote)
import Link from "next/link";
import { useState } from "react";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { CommunityPost, CommunityColor, PostBadge } from "@/lib/communityMock";

const DOT: Record<CommunityColor, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};
const BADGE: Record<PostBadge, { label: string; cls: string }> = {
  hot:       { label: "热议",   cls: "text-[#EC4C86] bg-[#EC4C86]/10 border-[#EC4C86]/25" },
  adult:     { label: "18+",   cls: "text-[#7C5CFF] bg-[#7C5CFF]/10 border-[#7C5CFF]/25" },
  anonymous: { label: "匿名",   cls: "text-[var(--muted)] bg-[var(--page)] border-[var(--line)]" },
  poll:      { label: "投票",   cls: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25" },
  official:  { label: "官方",   cls: "text-[#D6B86A] bg-[#D6B86A]/10 border-[#D6B86A]/25" },
  creator:   { label: "创作者", cls: "text-[var(--ink)] bg-[var(--page)] border-[var(--line)]" },
};

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default function MobileCommunityPostCard({ post }: { post: CommunityPost }) {
  const [vote, setVote] = useState<0 | 1 | -1>(0);
  const requireLogin = useRequireLogin();
  const guard = (fn: () => void) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (requireLogin()) fn();
  };
  const dot = DOT[post.communityColor];
  const detailHref = `/m/community/${post.communitySlug}/post/${post.slug}`;
  const communityHref = `/m/community/${post.communitySlug}`;

  return (
    <article className="bg-white border border-[var(--line)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {/* Meta row */}
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] mb-2.5 flex-wrap">
        <Link href={communityHref} className="inline-flex items-center gap-1 font-bold text-[var(--ink)] hover:opacity-80">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
          {post.communityName}
        </Link>
        <span>·</span>
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.createdAt}</span>
        {post.badges.map((b) => {
          const s = BADGE[b];
          return <span key={b} className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold border leading-none ${s.cls}`}>{s.label}</span>;
        })}
      </div>

      {/* Title + Body (clickable) */}
      <Link href={detailHref} className="block active:opacity-70 transition">
        <h3 className="text-[16px] font-bold text-[var(--ink)] leading-snug m-0 mb-1.5">{post.title}</h3>
        {post.body && (
          <p className="text-[13.5px] text-[var(--ink2)] leading-[1.6] m-0 line-clamp-3">
            {post.body}
          </p>
        )}
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {post.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[10.5px] text-[var(--muted)] bg-[var(--page)] border border-[var(--line)] px-2 py-0.5 rounded-full">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <footer className="flex items-center gap-1 mt-3 pt-3 border-t border-[var(--line)] text-[12px] text-[var(--muted)]">
        {/* Vote pill */}
        <div className="inline-flex items-center bg-[var(--page)] rounded-full h-8 border border-[var(--line)]">
          <button
            type="button"
            onClick={guard(() => setVote(vote === 1 ? 0 : 1))}
            className={`w-7 h-8 grid place-items-center rounded-l-full transition ${vote === 1 ? "text-[#EC4C86]" : "hover:text-[#EC4C86]"}`}
            aria-label="Upvote"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg>
          </button>
          <span className="text-[11.5px] font-bold text-[var(--ink)] tabular-nums px-1.5 min-w-[26px] text-center">{fmt(post.score + vote)}</span>
          <button
            type="button"
            onClick={guard(() => setVote(vote === -1 ? 0 : -1))}
            className={`w-7 h-8 grid place-items-center rounded-r-full transition ${vote === -1 ? "text-[#7C5CFF]" : "hover:text-[#7C5CFF]"}`}
            aria-label="Downvote"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 20L4 10h5V4h6v6h5z"/></svg>
          </button>
        </div>

        <Link href={`${detailHref}#comments`} className="inline-flex items-center gap-1 h-8 px-2 rounded-full hover:bg-[var(--page)] transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/></svg>
          {fmt(post.commentsCount)}
        </Link>

        <button type="button" onClick={guard(() => {})} className="inline-flex items-center gap-1 h-8 px-2 rounded-full hover:bg-[var(--page)] transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>
          分享
        </button>

        <button type="button" onClick={guard(() => {})} className="ml-auto w-8 h-8 grid place-items-center rounded-full hover:bg-[var(--page)] transition" aria-label="Bookmark">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
        </button>
      </footer>
    </article>
  );
}
