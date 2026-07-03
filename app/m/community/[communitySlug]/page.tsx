// Mobile Community — 单社区页
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  communities, getCommunityBySlug, getPostsByCommunity,
} from "@/lib/communityMock";
import type { CommunityColor } from "@/lib/communityMock";
import MobileCommunityPostCard from "@/components/Mobile/MobileCommunityPostCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return communities.map((c) => ({ communitySlug: c.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string } }): Promise<Metadata> {
  const c = getCommunityBySlug(params.communitySlug);
  if (!c) return { title: "社区 · Sugardating" };
  return { title: `${c.name} · 互动社区 · Sugardating`, description: c.description };
}

const DOT: Record<CommunityColor, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};
const SORT_TABS = ["热门", "最新", "24h"];

export default function Page({ params }: { params: { communitySlug: string } }) {
  const c = getCommunityBySlug(params.communitySlug);
  if (!c) notFound();
  const posts = getPostsByCommunity(c.slug);

  return (
    <div>
      {/* Back */}
      <div className="px-5 pt-3">
        <Link href="/m/community" className="inline-flex items-center gap-1 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          返回社区
        </Link>
      </div>

      {/* Community header */}
      <section className="mx-5 mt-3 rounded-2xl bg-white border border-[var(--line)] p-5">
        <div className="flex items-start gap-3">
          <span
            className="w-11 h-11 rounded-full flex-shrink-0"
            style={{ background: DOT[c.color], boxShadow: `0 0 12px ${DOT[c.color]}55` }}
            aria-hidden
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-extrabold text-[var(--ink)] tracking-tight m-0 leading-tight">{c.name}</h1>
            <p className="text-[12.5px] text-[var(--muted)] mt-1 leading-[1.5] m-0">{c.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[11.5px] text-[var(--muted)]">
          {c.onlineCount !== undefined && (
            <span><b className="text-[var(--ink)] tabular-nums">{c.onlineCount.toLocaleString("en-US")}</b> 在线</span>
          )}
          {c.memberCount !== undefined && (
            <span><b className="text-[var(--ink)] tabular-nums">{(c.memberCount / 1000).toFixed(0)}k</b> 成员</span>
          )}
          <span><b className="text-[var(--ink)] tabular-nums">{posts.length}</b> 帖子</span>
          <button
            type="button"
            className="ml-auto h-8 px-4 rounded-full text-[12px] font-bold text-white transition"
            style={{ background: "linear-gradient(135deg,#EC4C86 0%,#7C5CFF 100%)" }}
          >
            加入
          </button>
        </div>
      </section>

      {/* Sort tabs */}
      <div className="sticky top-14 z-20 bg-[var(--page)]/95 backdrop-blur-md mt-4">
        <div className="flex gap-1 px-5 py-2 overflow-x-auto scrollbar-hide border-y" style={{ borderColor: "var(--line)" }}>
          {SORT_TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[13px] font-semibold ${i === 0 ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--muted)] border border-[var(--line)]"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <ul className="flex flex-col gap-3 px-4 mt-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <MobileCommunityPostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
