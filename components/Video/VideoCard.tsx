"use client";
import Image from "next/image";
import Link from "next/link";
import type { VideoEntry, VideoTag } from "@/lib/videoMock";

const TAG_STYLE: Record<VideoTag, string> = {
  New:      "bg-emerald-400/15 text-emerald-200 border border-emerald-300/30",
  Verified: "bg-sky-400/15 text-sky-200 border border-sky-300/30",
  Popular:  "bg-gold/15 text-gold border border-gold/40",
};

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万 播放`;
  return `${n.toLocaleString("en-US")} 播放`;
}

export default function VideoCard({ entry }: { entry: VideoEntry }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-feed-line bg-feed-surface transition duration-300 ease-out hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
      {/* 视频封面 16:9 */}
      <Link href="/membership" className="relative block overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={entry.cover}
          alt={entry.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

        {/* 中央 play 按钮(hover 突出) */}
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-black/55 backdrop-blur transition duration-300 ease-out group-hover:scale-110 group-hover:bg-gold/85">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white transition group-hover:fill-feed-bg">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {/* 时长右下 */}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/72 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
          {entry.duration}
        </span>

        {/* 在线 dot 左上 */}
        {entry.online && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-pill bg-black/55 px-2 py-0.5 text-[10.5px] font-semibold text-feed-ink backdrop-blur">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Online
          </span>
        )}
      </Link>

      {/* 文字区 */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="truncate text-[14.5px] font-semibold text-feed-ink">{entry.title}</h3>
        <p className="line-clamp-2 text-[12.5px] leading-relaxed text-feed-mute">{entry.bio}</p>

        <div className="mt-2 flex items-baseline justify-between gap-2 text-[12px] text-feed-dim">
          <span className="truncate">
            <span className="font-semibold text-feed-ink">{entry.creator.name}</span>
            <span className="ml-1.5">· {entry.creator.city}</span>
          </span>
          <span className="tabular-nums shrink-0">{fmtViews(entry.views)}</span>
        </div>

        {entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <span key={t} className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold tracking-wider ${TAG_STYLE[t]}`}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
