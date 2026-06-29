import Image from "next/image";
import Link from "next/link";
import type { CreatorProfile, SidebarSuggestion } from "./types";

function fmtCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

interface Props {
  creator: CreatorProfile;
  suggestions: SidebarSuggestion[];
  hot: SidebarSuggestion[];
}

// 右侧栏 — about / 数据 / 会员 upsell / 相关推荐 / 热门创作者
export default function Sidebar({ creator, suggestions, hot }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* About Creator */}
      <Section title="关于创作者">
        <div className="space-y-3 text-[13px] leading-relaxed text-feed-mute">
          <div className="flex items-center justify-between text-feed-ink">
            <span className="text-[12px] uppercase tracking-[0.16em] text-feed-dim">handle</span>
            <span className="font-mono text-feed-ink">{creator.handle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.16em] text-feed-dim">地区</span>
            <span className="text-feed-ink">香港 / 新加坡</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.16em] text-feed-dim">加入</span>
            <span className="text-feed-ink">2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.16em] text-feed-dim">语言</span>
            <span className="text-feed-ink">中 / EN</span>
          </div>
        </div>
      </Section>

      {/* Profile Statistics */}
      <Section title="数据统计">
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="动态" value="312" />
          <StatBlock label="VIP 内容" value="86" />
          <StatBlock label="粉丝" value={fmtCount(creator.stats.followers)} />
          <StatBlock label="获赞" value={fmtCount(creator.stats.likes)} />
        </div>
      </Section>

      {/* Membership upsell */}
      <div className="relative overflow-hidden rounded-card border border-gold/30 bg-gradient-to-br from-gold/[0.12] via-gold/[0.04] to-transparent p-5">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">Membership</div>
        <h3 className="mt-2 font-serif text-[22px] italic leading-tight text-feed-ink">
          解锁完整体验
        </h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-feed-mute">
          会员可看 VIP 内容、原图下载、提前看新作,享订阅折扣。
        </p>
        <Link
          href="/membership"
          className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-gold px-4 py-2 text-[12.5px] font-semibold text-feed-bg transition hover:bg-gold-bright"
        >
          开通会员
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      {/* 相关推荐 */}
      <Section title="相关推荐">
        <ul className="space-y-3">
          {suggestions.map((s) => (
            <CreatorRow key={s.handle} item={s} />
          ))}
        </ul>
      </Section>

      {/* 热门创作者 */}
      <Section title="热门创作者">
        <ul className="space-y-3">
          {hot.map((s) => (
            <CreatorRow key={s.handle} item={s} />
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-feed-line bg-feed-surface p-5">
      <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-feed-dim">
        {title}
      </div>
      {children}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-feed-line bg-feed-elevated/40 px-3 py-3">
      <div className="text-[18px] font-semibold tracking-tight text-feed-ink tabular-nums">{value}</div>
      <div className="text-[11px] text-feed-dim">{label}</div>
    </div>
  );
}

function CreatorRow({ item }: { item: SidebarSuggestion }) {
  return (
    <li className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-feed-line">
        <Image src={item.avatar} alt={item.name} fill sizes="40px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-feed-ink">{item.name}</div>
        <div className="truncate text-[11.5px] text-feed-dim">{item.bio}</div>
      </div>
      <button
        type="button"
        className="rounded-pill border border-feed-line2 px-3 py-1 text-[11.5px] font-semibold text-feed-ink transition hover:border-gold hover:text-gold"
      >
        关注
      </button>
    </li>
  );
}
