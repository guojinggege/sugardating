// Mobile Live — 单列直播卡片 (mock data,业务逻辑未接)
import Link from "next/link";
import Image from "next/image";
import { sugarGirls } from "@/lib/sugarGirlMock";

export const dynamic = "force-dynamic";

export default function Page() {
  // 使用 online sugargirls 作为 "正在直播" mock
  const liveStreams = sugarGirls.filter((s) => s.online).slice(0, 8);

  return (
    <div>
      <div className="px-5 pt-4">
        <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0 flex items-center gap-2">
          直播
          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-white bg-[var(--live)] rounded-full px-1.5 py-0.5">
            <span className="w-1 h-1 rounded-full bg-white" />
            LIVE
          </span>
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-1">{liveStreams.length} 位正在直播</p>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 px-5 mt-4 overflow-x-auto scrollbar-hide pb-1">
        {["全部", "推荐", "热门", "新人", "唱歌", "聊天", "户外"].map((c, i) => (
          <button
            key={c}
            type="button"
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[13px] font-semibold ${i === 0 ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--muted)] border border-[var(--line)]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Live stream grid — 1 col big cards */}
      <div className="flex flex-col gap-3 px-5 mt-5 pb-4">
        {liveStreams.map((s, i) => (
          <Link key={s.id} href={`/m/creators/${s.id}`} className="block">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#F3F4F6] shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              <Image src={s.cover} alt={s.name} fill sizes="100vw" priority={i === 0} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* LIVE badge */}
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--live)] text-white text-[10.5px] font-bold rounded-full px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              {/* Viewers */}
              <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-[10.5px] font-semibold rounded-full px-2 py-1 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
                {(1200 + Math.round(s.popularity * 2)).toLocaleString("en-US")}
              </span>

              {/* Bottom info */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold truncate">{s.name}</span>
                  <span className="text-[11px] text-white/80">{s.city} · {s.age}</span>
                </div>
                <p className="text-[12px] text-white/85 mt-1 line-clamp-1">{s.intro}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {liveStreams.length === 0 && (
        <div className="mx-5 mt-8 rounded-2xl bg-[var(--page)] p-8 text-center border border-[var(--line)]">
          <p className="text-[13px] text-[var(--muted)]">暂无直播中的创作者</p>
        </div>
      )}
    </div>
  );
}
