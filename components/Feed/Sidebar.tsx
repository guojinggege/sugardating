// Right rail V2 — 6 widgets (Discover Feed)
// Trending Creator / Today's Online / Popular Tags / Upcoming Trips / Recommended / VIP Creator
import Image from "next/image";
import Link from "next/link";
import type { CreatorProfile, SidebarSuggestion } from "./types";

interface Props {
  creator?: CreatorProfile;   // legacy prop 兼容
  suggestions: SidebarSuggestion[];
  hot?: SidebarSuggestion[];  // legacy 兼容
  trending: SidebarSuggestion[];
  online: SidebarSuggestion[];
  vip: SidebarSuggestion[];
  tags: { tag: string; count: number }[];
  trips: { city: string; date: string; sg: string }[];
}

function CreatorRow({ s }: { s: SidebarSuggestion }) {
  const slug = s.handle.replace(/^@/, "");
  return (
    <Link href={`/creators/${slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-feed-elevated transition">
      <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-feed-line bg-feed-elevated shrink-0">
        <Image src={s.avatar} alt={s.name} fill sizes="36px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-feed-ink truncate">{s.name}</div>
        <div className="text-[11.5px] text-feed-dim truncate">{s.bio}</div>
      </div>
    </Link>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-feed-surface border border-feed-line p-4">
      <h5 className="text-[12px] font-bold uppercase tracking-[.14em] text-feed-mute mb-3">{title}</h5>
      {children}
    </div>
  );
}

export default function Sidebar({ trending, online, vip, tags, trips, suggestions }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* ① Trending Creator */}
      <Card title="🔥 Trending Creator">
        <div className="flex flex-col gap-1">
          {trending.map((s) => <CreatorRow key={s.handle} s={s} />)}
        </div>
      </Card>

      {/* ② Today's Online */}
      <Card title="🟢 Today's Online">
        <div className="flex flex-col gap-1">
          {online.map((s) => <CreatorRow key={s.handle} s={s} />)}
        </div>
      </Card>

      {/* ③ Popular Tags */}
      <Card title="🏷️ Popular Tags">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <button
              key={t.tag}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-feed-elevated border border-feed-line text-[12px] font-semibold text-feed-ink hover:border-gold transition"
            >
              #{t.tag}
              <span className="text-[11px] text-feed-dim tabular-nums">{t.count.toLocaleString("en-US")}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ④ Upcoming Trips */}
      <Card title="✈️ Upcoming Trips">
        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
          {trips.map((t, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px]">
              <span className="text-base leading-none" aria-hidden>📍</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-feed-ink truncate">{t.city}</div>
                <div className="text-[11.5px] text-feed-dim">{t.sg} · {t.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* ⑤ Recommended Creators */}
      <Card title="👑 Recommended">
        <div className="flex flex-col gap-1">
          {suggestions.map((s) => <CreatorRow key={s.handle} s={s} />)}
        </div>
      </Card>

      {/* ⑥ VIP Creator */}
      <Card title="✨ VIP Creator">
        <div className="flex flex-col gap-1">
          {vip.map((s) => <CreatorRow key={s.handle} s={s} />)}
        </div>
      </Card>
    </div>
  );
}
