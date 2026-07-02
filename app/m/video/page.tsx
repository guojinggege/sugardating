// Mobile Video 频道 — 2-col grid + hero
import Link from "next/link";
import Image from "next/image";
import { videos } from "@/lib/videoMock";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { key: "all",         label: "全部" },
  { key: "recommended", label: "推荐" },
  { key: "latest",      label: "最新" },
  { key: "popular",     label: "热门" },
  { key: "verified",    label: "已认证" },
];

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default function Page() {
  const featured = videos.filter((v) => v.isFeatured)[0];
  const rest = videos.filter((v) => v.id !== featured?.id);

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-4">
        <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0">视频专区</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1">Vlog · 短篇 · 教程 · 旅行</p>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 px-5 mt-4 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.key}
            type="button"
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[13px] font-semibold ${i === 0 ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--muted)] border border-[var(--line)]"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Featured hero video */}
      {featured && (
        <Link href="#" className="block px-5 mt-5">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#F3F4F6] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <Image src={featured.cover} alt={featured.title} fill sizes="100vw" priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md grid place-items-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            {/* Duration */}
            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10.5px] font-bold px-1.5 py-0.5 rounded">
              {featured.duration}
            </span>
            {/* Info */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h2 className="text-[16px] font-bold leading-tight m-0 mb-1 line-clamp-1">{featured.title}</h2>
              <div className="text-[11.5px] text-white/85">{featured.creator.name} · {fmtViews(featured.views)} 播放</div>
            </div>
          </div>
        </Link>
      )}

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-5">
        {rest.map((v) => (
          <Link key={v.id} href="#" className="flex flex-col">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F3F4F6]">
              <Image src={v.cover} alt={v.title} fill sizes="(max-width:640px) 50vw, 200px" className="object-cover" />
              {/* Play button */}
              <div className="absolute inset-0 grid place-items-center opacity-0 hover:opacity-100 transition">
                <div className="w-10 h-10 rounded-full bg-black/50 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9.5px] font-bold px-1 py-0.5 rounded">
                {v.duration}
              </span>
              {v.tags.includes("Verified") && (
                <span className="absolute top-1.5 left-1.5 bg-[var(--accent)] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full">
                  已认证
                </span>
              )}
            </div>
            <h3 className="text-[13px] font-bold text-[var(--ink)] mt-2 line-clamp-2 leading-[1.35]">{v.title}</h3>
            <div className="text-[11px] text-[var(--muted)] mt-0.5 truncate">
              {v.creator.name} · {fmtViews(v.views)} 播放
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
