// Mobile Discover Feed /m/photography
import Link from "next/link";
import Image from "next/image";
import { feedPosts, trendingCreators, popularTags } from "@/lib/feedMock";

export const dynamic = "force-dynamic";

const TABS = ["推荐", "关注", "附近", "VIP", "最新"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = 60000, h = 60 * m, d = 24 * h;
  if (diff < h) return `${Math.max(1, Math.floor(diff / m))}m`;
  if (diff < d) return `${Math.floor(diff / h)}h`;
  return `${Math.floor(diff / d)}d`;
}

export default function Page() {
  return (
    <div>
      {/* Header + Tabs sticky */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: "var(--line)" }}>
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0">动态推荐</h1>
        </div>
        <div className="flex gap-1.5 px-5 pb-2.5 overflow-x-auto scrollbar-hide">
          {TABS.map((t, i) => (
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

      {/* Hot tags */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide">
        {popularTags.slice(0, 8).map((tag) => (
          <span key={tag.tag} className="flex-shrink-0 text-[11.5px] text-[var(--muted)] bg-[var(--page)] border border-[var(--line)] px-2.5 py-1 rounded-full">
            #{tag.tag}
          </span>
        ))}
      </div>

      {/* Feed */}
      <ul className="flex flex-col gap-3 px-4 pb-4">
        {feedPosts.slice(0, 16).map((post) => (
          <li key={post.id}>
            <article className="bg-white border border-[var(--line)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
              {/* Author row */}
              <header className="flex items-center gap-2.5 mb-3">
                <Link href={post.authorSlug ? `/m/creators/${post.authorSlug}` : "#"} className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--page)] ring-1 ring-[var(--line)] flex-shrink-0">
                  <Image src={post.author.avatar} alt={post.author.name} fill sizes="40px" className="object-cover" />
                  {post.authorOnline && (
                    <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={post.authorSlug ? `/m/creators/${post.authorSlug}` : "#"} className="block text-[13.5px] font-bold text-[var(--ink)] truncate">
                    {post.author.name}
                  </Link>
                  <div className="text-[11px] text-[var(--muted)] truncate">{post.author.handle} · {timeAgo(post.createdAt)}</div>
                </div>
              </header>

              {/* Text */}
              {post.text && (
                <p className="text-[14px] text-[var(--ink)] leading-[1.6] m-0 mb-3 whitespace-pre-wrap break-words line-clamp-4">
                  {post.text}
                </p>
              )}

              {/* Media — 简化: 单图/多图 grid */}
              {post.media.length > 0 && (
                <div className={`grid gap-1 rounded-xl overflow-hidden mb-3 ${
                  post.media.length === 1 ? "grid-cols-1" :
                  post.media.length === 2 ? "grid-cols-2" : "grid-cols-3"
                }`}>
                  {post.media.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="relative bg-[var(--page)]"
                      style={{ aspectRatio: post.media.length === 1 ? "16/10" : "1/1" }}
                    >
                      <Image src={m.src} alt="" fill sizes="(max-width:640px) 33vw, 300px" className="object-cover" />
                      {post.isVip && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl grid place-items-center">
                          <span className="text-[10px] font-bold text-white bg-gold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#d4bf95,#b8a789)" }}>VIP</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <footer className="flex items-center justify-between text-[12px] text-[var(--muted)]">
                <button type="button" className="inline-flex items-center gap-1.5 h-8 px-2 hover:text-rose-500 transition">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>
                  {post.stats.likes.toLocaleString("en-US")}
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 h-8 px-2 hover:text-sky-500 transition">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" /></svg>
                  {post.stats.comments}
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 h-8 px-2 hover:text-[var(--accent)] transition">
                  <span aria-hidden>🎁</span>
                  打赏
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 h-8 px-2 hover:text-[var(--ink)] transition">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14" /></svg>
                </button>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      {/* Trending creators footer */}
      <section className="px-5 pt-2 pb-6 border-t" style={{ borderColor: "var(--line)" }}>
        <h3 className="text-[13px] font-bold text-[var(--ink)] mb-3 mt-4">热门创作者</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingCreators.slice(0, 6).map((c) => (
            <Link key={c.handle} href={`/m/creators/${c.handle.replace("@", "")}`} className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[64px]">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[var(--page)] ring-2 ring-[var(--accent)]">
                <Image src={c.avatar} alt={c.name} fill sizes="56px" className="object-cover" />
              </div>
              <span className="text-[10.5px] font-semibold text-[var(--ink)] truncate w-full text-center">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
