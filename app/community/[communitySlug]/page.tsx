// 单社区页 /community/[communitySlug] — 复用 3-col shell,center 展示该社区帖子
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import CommunityLayout from "@/components/Community/CommunityLayout";
import CommunityLeftSidebar from "@/components/Community/CommunityLeftSidebar";
import CommunityRightSidebar from "@/components/Community/CommunityRightSidebar";
import CommunitySortTabs from "@/components/Community/CommunitySortTabs";
import CommunityPostCard from "@/components/Community/CommunityPostCard";
import {
  communities, myCommunities, discoverCommunities, trendingTopics,
  getCommunityBySlug, getPostsByCommunity,
} from "@/lib/communityMock";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return communities.map((c) => ({ communitySlug: c.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string } }): Promise<Metadata> {
  const c = getCommunityBySlug(params.communitySlug);
  if (!c) return { title: "社区 · Sugardating" };
  return { title: `${c.name} · 互动社区 · Sugardating`, description: c.description };
}

const DOT: Record<string, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};

export default function Page({ params }: { params: { communitySlug: string } }) {
  const c = getCommunityBySlug(params.communitySlug);
  if (!c) notFound();
  const communityPosts = getPostsByCommunity(c.slug);

  return (
    <CommunityLayout
      left={<CommunityLeftSidebar joined={myCommunities} discover={discoverCommunities} activeSlug={c.slug} />}
      right={<CommunityRightSidebar topics={trendingTopics} activeCommunities={myCommunities.slice(0, 5)} />}
      center={
        <>
          {/* 返回主社区 */}
          <Link href="/community" className="inline-flex items-center gap-1 text-[12.5px] text-[var(--cm-muted)] hover:text-white transition w-fit">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            返回互动社区
          </Link>

          {/* Community Header */}
          <section className="rounded-[18px] border border-white/[0.08] p-5 md:p-6 bg-white/[0.05]">
            <div className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-full shrink-0"
                style={{ background: DOT[c.color], boxShadow: `0 0 16px ${DOT[c.color]}66` }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-[22px] md:text-[24px] font-bold text-white leading-tight m-0">{c.name}</h1>
                <p className="text-[13px] text-[var(--cm-muted)] mt-1.5 leading-[1.6] m-0">{c.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[12px] text-[var(--cm-muted)]">
                  {c.onlineCount !== undefined && <Stat label="在线" value={c.onlineCount} />}
                  {c.memberCount !== undefined && <Stat label="成员" value={c.memberCount} />}
                  <Stat label="帖子" value={communityPosts.length} />
                </div>
              </div>
              <button
                type="button"
                className="h-9 px-4 rounded-full text-[12.5px] font-bold text-white transition hover:opacity-90 shrink-0"
                style={{ background: "linear-gradient(135deg,#EC4C86 0%,#7C5CFF 100%)" }}
              >
                加入
              </button>
            </div>
          </section>

          <CommunitySortTabs postsCount={communityPosts.length} />

          {communityPosts.map((p) => (
            <CommunityPostCard key={p.slug} post={p} />
          ))}
        </>
      }
    />
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <b className="text-white tabular-nums font-bold">{value.toLocaleString("en-US")}</b>
      <span className="ml-1">{label}</span>
    </span>
  );
}
