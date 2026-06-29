import Image from "next/image";
import type { CreatorProfile } from "./types";

function fmtCount(n: number): string {
  if (n >= 100000) return `${(n / 10000).toFixed(0)}万`;
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

// 左侧栏 creator profile 卡(桌面端)
export default function CreatorCard({ creator }: { creator: CreatorProfile }) {
  return (
    <div className="overflow-hidden rounded-card border border-feed-line bg-feed-surface">
      {/* 封面 */}
      <div className="relative h-24 overflow-hidden">
        <Image src={creator.cover} alt="" fill sizes="280px" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-feed-bg/70" />
      </div>

      {/* 头像 + 在线 dot */}
      <div className="px-5 pb-5 pt-0">
        <div className="-mt-9 mb-3 flex items-end justify-between">
          <div className="relative">
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full ring-4 ring-feed-bg">
              <Image src={creator.avatar} alt={creator.name} fill sizes="72px" className="object-cover" />
            </div>
            {creator.online && (
              <span className="absolute bottom-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-feed-bg ring-2 ring-feed-bg">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            )}
          </div>
        </div>

        <div className="text-[17px] font-semibold tracking-tight text-feed-ink">{creator.name}</div>
        <div className="text-[12px] text-feed-dim">{creator.handle}</div>

        <p className="mt-3 text-[13px] leading-relaxed text-feed-mute line-clamp-3">{creator.bio}</p>

        {/* 数据 */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-feed-line py-3 text-center">
          <Stat label="粉丝" value={fmtCount(creator.stats.followers)} />
          <Stat label="关注" value={fmtCount(creator.stats.following)} />
          <Stat label="获赞" value={fmtCount(creator.stats.likes)} />
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-4 w-full rounded-pill bg-gold py-2.5 text-[13.5px] font-semibold text-feed-bg transition hover:bg-gold-bright"
        >
          + 关注
        </button>
        <button
          type="button"
          className="mt-2 w-full rounded-pill border border-feed-line2 bg-transparent py-2.5 text-[13.5px] font-semibold text-feed-ink transition hover:bg-feed-elevated"
        >
          消息
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[15px] font-semibold tracking-tight text-feed-ink tabular-nums">{value}</div>
      <div className="text-[11px] text-feed-dim">{label}</div>
    </div>
  );
}
