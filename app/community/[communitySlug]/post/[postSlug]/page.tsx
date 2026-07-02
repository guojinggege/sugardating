// 帖子详情页 /community/[communitySlug]/post/[postSlug]
// 复用 3-col 暗色社区壳,center = 帖子完整正文 + 评论区
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import CommunityLayout from "@/components/Community/CommunityLayout";
import CommunityLeftSidebar from "@/components/Community/CommunityLeftSidebar";
import CommunityRightSidebar from "@/components/Community/CommunityRightSidebar";
import CommunityPollCard from "@/components/Community/CommunityPollCard";
import {
  posts, myCommunities, discoverCommunities, trendingTopics,
  getCommunityBySlug, getPostBySlug,
} from "@/lib/communityMock";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return posts.map((p) => ({ communitySlug: p.communitySlug, postSlug: p.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string; postSlug: string } }): Promise<Metadata> {
  const p = getPostBySlug(params.communitySlug, params.postSlug);
  if (!p) return { title: "帖子 · Sugardating" };
  return { title: `${p.title} · ${p.communityName} · Sugardating`, description: p.body?.slice(0, 140) || p.title };
}

const DOT: Record<string, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};

const BADGE: Record<string, string> = {
  hot:       "bg-[var(--cm-pink)]/12 text-[var(--cm-pink)] border-[var(--cm-pink)]/30",
  adult:     "bg-[var(--cm-purple)]/12 text-[var(--cm-purple)] border-[var(--cm-purple)]/30",
  anonymous: "bg-white/[0.06] text-[var(--cm-muted)] border-white/[0.1]",
  poll:      "bg-[var(--cm-emerald)]/12 text-[var(--cm-emerald)] border-[var(--cm-emerald)]/30",
  official:  "bg-[var(--cm-gold)]/12 text-[var(--cm-gold)] border-[var(--cm-gold)]/30",
  creator:   "bg-white/[0.06] text-white border-white/[0.12]",
};
const BADGE_LABEL: Record<string, string> = {
  hot: "热议", adult: "18+", anonymous: "匿名", poll: "投票", official: "官方", creator: "创作者",
};

export default function Page({ params }: { params: { communitySlug: string; postSlug: string } }) {
  const c = getCommunityBySlug(params.communitySlug);
  const p = getPostBySlug(params.communitySlug, params.postSlug);
  if (!c || !p) notFound();

  const dot = DOT[p.communityColor];
  const comments = p.comments || [];

  return (
    <CommunityLayout
      left={<CommunityLeftSidebar joined={myCommunities} discover={discoverCommunities} activeSlug={c.slug} />}
      right={<CommunityRightSidebar topics={trendingTopics} activeCommunities={myCommunities.slice(0, 5)} />}
      center={
        <>
          {/* 返回社区 */}
          <Link href={`/community/${c.slug}`} className="inline-flex items-center gap-1 text-[12.5px] text-[var(--cm-muted)] hover:text-white transition w-fit">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            返回 {c.name}
          </Link>

          {/* Post 主体 */}
          <article className="rounded-[18px] border border-white/[0.08] bg-white/[0.045] overflow-hidden">
            <div className="p-6 md:p-7">
              {/* Meta */}
              <div className="flex items-center gap-2 text-[12px] text-[var(--cm-muted)] mb-3 flex-wrap">
                <Link href={`/community/${c.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[var(--cm-pink)] transition">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                  {p.communityName}
                </Link>
                <span>·</span>
                <span>{p.author}</span>
                <span>·</span>
                <span>{p.createdAt}</span>
                {p.badges.map((b) => (
                  <span key={b} className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border leading-none ${BADGE[b]}`}>
                    {BADGE_LABEL[b]}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-[24px] md:text-[28px] font-bold text-white leading-tight m-0 mb-4">{p.title}</h1>

              {/* Body */}
              {p.body && (
                <div className="text-[15px] text-[var(--cm-text)]/90 leading-[1.8] whitespace-pre-wrap m-0 mb-5">
                  {p.body}
                </div>
              )}

              {/* Poll */}
              {p.poll && (
                <div className="mb-5">
                  <CommunityPollCard options={p.poll.options} totalVotes={p.poll.totalVotes} />
                </div>
              )}

              {/* Tags */}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[12px] text-[var(--cm-muted)] bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">#{t}</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/[0.08] text-[var(--cm-muted)] text-[13px] flex-wrap">
                <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg><b className="text-white">{p.score.toLocaleString("en-US")}</b> 分</span>
                <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/></svg>{p.commentsCount.toLocaleString("en-US")} 评论</span>
                {p.roomCount ? (
                  <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>{p.roomCount} 在房间</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>{p.sharesCount} 分享</span>
                <button type="button" className="ml-auto inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.05] transition text-white text-[12.5px] font-semibold">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
                  收藏
                </button>
              </div>
            </div>
          </article>

          {/* Comments */}
          <section className="rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-white m-0">评论 {comments.length > 0 ? comments.length : ""}</h2>
              <span className="text-[11.5px] text-[var(--cm-muted)] uppercase tracking-[.1em]">最热</span>
            </div>
            {comments.length === 0 ? (
              <div className="text-[13px] text-[var(--cm-muted)] py-6 text-center">
                还没有评论,来做第一个说话的人。
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {comments.map((cm) => (
                  <li key={cm.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86] shrink-0 grid place-items-center text-white text-[11px] font-bold">
                      {cm.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11.5px] text-[var(--cm-muted)]">
                        <b className="text-white text-[12.5px] font-semibold">{cm.author}</b>
                        <span>·</span>
                        <span>{cm.createdAt}</span>
                      </div>
                      <p className="text-[13.5px] text-[var(--cm-text)]/90 leading-[1.7] m-0 mt-1 whitespace-pre-wrap">{cm.body}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11.5px] text-[var(--cm-muted)]">
                        <span className="inline-flex items-center gap-1"><svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M12 4l8 10h-5v6H9v-6H4z"/></svg>{cm.score}</span>
                        <button type="button" className="hover:text-white transition">回复</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      }
    />
  );
}
