// Mobile Post Detail — 全屏正文 + 评论区
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  posts, getCommunityBySlug, getPostBySlug,
} from "@/lib/communityMock";
import type { PostBadge } from "@/lib/communityMock";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return posts.map((p) => ({ communitySlug: p.communitySlug, postSlug: p.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string; postSlug: string } }): Promise<Metadata> {
  const p = getPostBySlug(params.communitySlug, params.postSlug);
  if (!p) return { title: "帖子 · Sugardating" };
  return { title: `${p.title} · ${p.communityName}`, description: p.body?.slice(0, 140) || p.title };
}

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

export default function Page({ params }: { params: { communitySlug: string; postSlug: string } }) {
  const c = getCommunityBySlug(params.communitySlug);
  const p = getPostBySlug(params.communitySlug, params.postSlug);
  if (!c || !p) notFound();

  const comments = p.comments || [];

  return (
    <div className="pb-6">
      {/* Back */}
      <div className="px-5 pt-3">
        <Link href={`/m/community/${c.slug}`} className="inline-flex items-center gap-1 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          {c.name}
        </Link>
      </div>

      {/* Post main */}
      <article className="mx-4 mt-3 rounded-2xl bg-white border border-[var(--line)] p-5">
        {/* Meta */}
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] mb-3 flex-wrap">
          <Link href={`/m/community/${c.slug}`} className="font-bold text-[var(--ink)]">
            {p.communityName}
          </Link>
          <span>·</span>
          <span>{p.author}</span>
          <span>·</span>
          <span>{p.createdAt}</span>
          {p.badges.map((b) => {
            const s = BADGE[b];
            return <span key={b} className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold border leading-none ${s.cls}`}>{s.label}</span>;
          })}
        </div>

        {/* Title */}
        <h1 className="text-[20px] font-extrabold text-[var(--ink)] leading-snug m-0 mb-3 tracking-tight">{p.title}</h1>

        {/* Body */}
        {p.body && (
          <p className="text-[15px] leading-[1.75] text-[var(--ink2)] m-0 mb-4 whitespace-pre-wrap">
            {p.body}
          </p>
        )}

        {/* Poll — 静态展示 (无投票 client interaction) */}
        {p.poll && (
          <div className="flex flex-col gap-2 mb-4">
            {p.poll.options.map((o) => {
              const pct = p.poll!.totalVotes > 0 ? Math.round((o.votes / p.poll!.totalVotes) * 100) : 0;
              return (
                <div key={o.id} className="relative overflow-hidden rounded-full border border-[var(--line)] h-10">
                  <div className="absolute inset-y-0 left-0 bg-[var(--page)]" style={{ width: `${pct}%` }} />
                  <div className="relative h-full flex items-center justify-between px-4 text-[13px]">
                    <span className="font-semibold text-[var(--ink)] truncate">{o.text}</span>
                    <span className="font-bold text-[var(--muted)] tabular-nums flex-shrink-0 ml-2">{pct}%</span>
                  </div>
                </div>
              );
            })}
            <div className="text-[11.5px] text-[var(--muted)] tabular-nums px-1 pt-1">
              {p.poll.totalVotes.toLocaleString("en-US")} 人参与
            </div>
          </div>
        )}

        {/* Tags */}
        {p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.tags.map((t) => (
              <span key={t} className="text-[11px] text-[var(--muted)] bg-[var(--page)] border border-[var(--line)] px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--line)] text-[12px] text-[var(--muted)]">
          <div className="inline-flex items-center bg-[var(--page)] rounded-full h-8">
            <button type="button" className="w-8 h-8 grid place-items-center hover:text-[#EC4C86]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg>
            </button>
            <span className="text-[12px] font-bold text-[var(--ink)] tabular-nums px-1 min-w-[36px] text-center">{fmt(p.score)}</span>
            <button type="button" className="w-8 h-8 grid place-items-center hover:text-[#7C5CFF]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 20L4 10h5V4h6v6h5z"/></svg>
            </button>
          </div>
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/></svg>
            {fmt(p.commentsCount)}
          </span>
          {p.roomCount ? (
            <span className="inline-flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>
              {p.roomCount}
            </span>
          ) : null}
          <button type="button" className="ml-auto w-8 h-8 grid place-items-center rounded-full hover:bg-[var(--page)]" aria-label="Bookmark">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
          </button>
        </div>
      </article>

      {/* Comments */}
      <section id="comments" className="mx-4 mt-4 rounded-2xl bg-white border border-[var(--line)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-[var(--ink)] m-0">评论{comments.length > 0 ? ` (${comments.length})` : ""}</h2>
          <span className="text-[11px] text-[var(--muted)] uppercase tracking-widest">最热</span>
        </div>
        {comments.length === 0 ? (
          <div className="text-[13px] text-[var(--muted)] text-center py-8">
            还没有评论,来做第一个说话的人。
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {comments.map((cm) => (
              <li key={cm.id} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86] grid place-items-center text-white text-[11px] font-bold flex-shrink-0">
                  {cm.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                    <b className="text-[12.5px] font-bold text-[var(--ink)]">{cm.author}</b>
                    <span>·</span>
                    <span>{cm.createdAt}</span>
                  </div>
                  <p className="text-[13.5px] text-[var(--ink2)] leading-[1.7] m-0 mt-1 whitespace-pre-wrap">{cm.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg>
                      {cm.score}
                    </span>
                    <button type="button" className="hover:text-[var(--ink)]">回复</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sticky comment composer */}
      <div className="sticky bottom-0 mt-4 px-4 py-3 bg-white/95 backdrop-blur-md border-t" style={{ borderColor: "var(--line)" }}>
        <button
          type="button"
          className="w-full h-11 rounded-full bg-[var(--page)] text-left px-4 text-[13px] text-[var(--muted)] border border-[var(--line)] hover:border-[var(--ink)] transition"
        >
          写下你的想法...
        </button>
      </div>
    </div>
  );
}
