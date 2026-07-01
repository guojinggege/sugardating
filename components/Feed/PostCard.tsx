import Image from "next/image";
import Link from "next/link";
import MediaGrid from "./MediaGrid";
import type { FeedPost } from "./types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = 60_000, h = 60 * m, d = 24 * h;
  if (diff < m) return "刚刚";
  if (diff < h) return `${Math.floor(diff / m)} 分钟前`;
  if (diff < d) return `${Math.floor(diff / h)} 小时前`;
  if (diff < 30 * d) return `${Math.floor(diff / d)} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}

function fmtCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default function PostCard({ post }: { post: FeedPost }) {
  const hasMedia = post.media.length > 0;
  const creatorHref = post.authorSlug ? `/creators/${post.authorSlug}` : "#";
  return (
    <article className="group relative rounded-card border border-feed-line bg-feed-surface p-5 transition duration-300 ease-out hover:bg-feed-elevated hover:border-feed-line2 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
      {/* Header (avatar + name + time,均可点跳 creator 主页) */}
      <header className="flex items-start gap-3">
        <Link href={creatorHref} className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-feed-line block hover:ring-gold/60 transition">
          <Image src={post.author.avatar} alt={post.author.name} fill sizes="44px" className="object-cover" />
          {post.authorOnline && (
            <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-feed-surface" />
          )}
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href={creatorHref} className="truncate text-[15px] font-semibold text-feed-ink hover:text-gold transition">{post.author.name}</Link>
              {post.author.verified && (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-gold" aria-label="Verified">
                  <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.5-.6 3 .6 3-2.6 1.5-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.3l.6-3L3 10.3l2.6-1.5 1-2.8 3 .2z" />
                </svg>
              )}
              <Link href={creatorHref} className="truncate text-[13px] text-feed-dim hover:text-feed-ink transition">{post.author.handle}</Link>
              {post.authorCity && (
                <span className="text-[11.5px] text-feed-dim inline-flex items-center gap-0.5">
                  · <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-none stroke-current stroke-[1.8]"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  {post.authorCity}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[12px] text-feed-dim">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <button
          type="button"
          aria-label="更多"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-feed-mute transition hover:bg-feed-elevated hover:text-feed-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </header>

      {/* 正文文字 */}
      {post.text && (
        <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-feed-ink/90">
          {post.text}
        </p>
      )}

      {/* 媒体 */}
      {hasMedia && (
        <div className="relative mt-4">
          <MediaGrid media={post.media} />
          {post.isVip && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-card bg-black/45 backdrop-blur-xl">
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/20 ring-1 ring-gold/40">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold">
                    <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z" />
                  </svg>
                </div>
                <div className="mt-3 text-sm font-semibold text-feed-ink">VIP 专享内容</div>
                <div className="mt-1 text-[12px] text-feed-mute">升级 Elite 解锁高清原图</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer — 6 actions (spec V2:Like/Comment/Gift/Share/Book) */}
      <footer className="mt-4 flex items-center justify-between border-t border-feed-line pt-3 text-feed-mute overflow-x-auto scrollbar-hide">
        <Action label="Like" count={post.stats.likes} icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z"/></svg>
        } hoverColor="hover:text-rose-300" />
        <Action label="Comment" count={post.stats.comments} icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/></svg>
        } hoverColor="hover:text-sky-300" />
        {/* Gift — gradient accent */}
        <Action label="Gift" count={null} icon={
          <span className="text-[15px] leading-none" aria-hidden>🎁</span>
        } hoverColor="hover:text-gold" />
        <Action label="Share" count={post.stats.shares} icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>
        } hoverColor="hover:text-gold" />
        {/* Book — 预约 */}
        <Action label="Book" count={null} icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 11h18" /></svg>
        } hoverColor="hover:text-gold" />
      </footer>
    </article>
  );
}

function Action({
  icon, count, label, hoverColor,
}: { icon: React.ReactNode; count: number | null; label: string; hoverColor: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`group/btn inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13px] font-medium transition ${hoverColor}`}
    >
      <span className="transition-transform duration-200 ease-out group-hover/btn:scale-110">{icon}</span>
      {count !== null && <span className="tabular-nums">{fmtCount(count)}</span>}
    </button>
  );
}
