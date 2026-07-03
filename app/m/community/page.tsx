// Mobile Community — 全站混合帖子 feed
import Link from "next/link";
import { communities, posts, trendingTopics } from "@/lib/communityMock";
import MobileCommunityPostCard from "@/components/Mobile/MobileCommunityPostCard";

export const dynamic = "force-dynamic";

const SORT_TABS = ["热门", "最新", "24h", "关注", "精华"];

export default function Page() {
  const sortedPosts = posts.slice().sort((a, b) => b.score - a.score).slice(0, 16);

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0">互动社区</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1">夜谈 · 情绪 · 关系 · 深夜话题</p>
      </div>

      {/* Community chips horizontal scroll */}
      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide pb-2">
        <button type="button" className="flex-shrink-0 h-9 px-4 rounded-full bg-[var(--ink)] text-white text-[13px] font-bold">
          全部
        </button>
        {communities.map((c) => (
          <Link
            key={c.slug}
            href={`/m/community/${c.slug}`}
            className="flex-shrink-0 h-9 inline-flex items-center gap-1.5 px-4 rounded-full bg-white border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)] whitespace-nowrap hover:border-[var(--ink)] transition"
          >
            {c.name}
            {c.isHot && <span className="text-[9px] font-bold text-[#EC4C86]">HOT</span>}
          </Link>
        ))}
      </div>

      {/* Trending topics banner */}
      <section className="mx-5 mt-3 rounded-2xl bg-gradient-to-br from-[#FEF3F2] to-[#FDF4FF] border border-[#FBCFE8]/40 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11.5px] font-bold uppercase tracking-[.12em] text-[#EC4C86]">今晚在聊</span>
          <span className="text-[10.5px] text-[var(--muted)]">Top 5</span>
        </div>
        <ol className="flex flex-col gap-1.5">
          {trendingTopics.slice(0, 5).map((t) => (
            <li key={t.rank}>
              <Link
                href={`/m/community/${t.communitySlug}/post/${t.postSlug}`}
                className="flex items-center gap-2 text-[13px] font-medium text-[var(--ink)] hover:text-[#EC4C86] transition"
              >
                <span className="text-[13px] font-bold text-[var(--muted)] w-4 tabular-nums flex-shrink-0">{t.rank}</span>
                <span className="flex-1 truncate">{t.title}</span>
                {t.badge && (
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    t.badge === "NEW" ? "text-[#EC4C86] bg-white" :
                    t.badge === "热"  ? "text-[#D6B86A] bg-white" :
                    "text-[#10B981] bg-white"
                  }`}>{t.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Sort tabs */}
      <div className="sticky top-14 z-20 bg-[var(--page)]/95 backdrop-blur-md mt-3">
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

      {/* Post feed */}
      <ul className="flex flex-col gap-3 px-4 mt-3">
        {sortedPosts.map((p) => (
          <li key={p.slug}>
            <MobileCommunityPostCard post={p} />
          </li>
        ))}
      </ul>

      {/* FAB — 发帖 */}
      <button
        type="button"
        className="fixed z-30 bottom-24 right-4 h-14 w-14 rounded-full grid place-items-center text-white shadow-[0_8px_20px_rgba(236,76,134,0.4)]"
        style={{ background: "linear-gradient(135deg,#EC4C86 0%,#7C5CFF 100%)" }}
        aria-label="发帖"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
