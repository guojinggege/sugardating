// Mobile Creator Detail — 单列紧凑 · 复用现有数据 mock
// 结构:大图 Hero + name/age/city chip + 3 CTA sticky + About + Feed
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { pick } from "@/lib/images";
import { getCreatorBySlug, listCreators } from "@/lib/queries";
import { sugarGirls } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";
import type { Creator, Tier } from "@/lib/types";
import { makeFeed, deriveAbout, deriveStats, deriveAvailability } from "@/lib/creatorProfileMock";

export const dynamic = "force-dynamic";

function offsetFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function fmtNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

function loadFromSugarGirls(slug: string): { creator: Creator; bio: string; sg: SugarGirlEntry } | null {
  const sg = sugarGirls.find((x) => x.id === slug);
  if (!sg) return null;
  return {
    creator: {
      slug: sg.id, name: sg.name, category: "SugarGirl",
      specialty: sg.intro, region: `${sg.country} · ${sg.city}`,
      price: "—", tier: "elite" as Tier,
      subs: "—", followers: fmtNum(Math.round(sg.popularity * 3)),
      works: String(sg.categories.length),
    },
    bio: sg.bio, sg,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [dbDetail, allCreators] = await Promise.all([getCreatorBySlug(params.slug), listCreators()]);
  let creator: Creator;
  let baseBio: string;
  let sgSource: SugarGirlEntry | null = null;
  if (dbDetail) { creator = dbDetail.creator; baseBio = dbDetail.bio; }
  else {
    const fromSg = loadFromSugarGirls(params.slug);
    if (!fromSg) notFound();
    creator = fromSg.creator; baseBio = fromSg.bio; sgSource = fromSg.sg;
  }

  const off = offsetFromSlug(creator.slug);
  const cover  = sgSource?.cover ?? pick(0, off) ?? "/images/placeholder.png";
  const stats  = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const about  = deriveAbout(creator.slug, baseBio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, { online: sgSource ? sgSource.online : true });
  const feed = makeFeed(creator.slug).slice(0, 5);
  const age = sgSource?.age ?? 24 + (off % 6);
  const others = allCreators.filter((x) => x.slug !== creator.slug).slice(0, 4);

  return (
    <div className="pb-4">
      {/* Hero — 大图 */}
      <div className="relative w-full h-[420px] bg-black">
        <Image src={cover} alt={creator.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        {/* Back */}
        <Link
          href="/m/creators"
          className="absolute top-3 left-3 w-9 h-9 grid place-items-center rounded-full text-white"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        </Link>
        {/* Info overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-[26px] font-extrabold tracking-tight leading-tight m-0">{creator.name}</h1>
            {availability.isOnline && (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-500/90 rounded-full px-1.5 py-0.5">
                <span className="w-1 h-1 rounded-full bg-white" /> Online
              </span>
            )}
          </div>
          <div className="text-[13px] text-white/85">{creator.region} · {age} · {about.languages.join(" / ")}</div>
          <div className="text-[13px] text-white/90 mt-2 line-clamp-2">{about.bio}</div>
        </div>
      </div>

      {/* Sticky CTA row */}
      <div
        className="sticky top-14 z-30 border-b bg-white/95 backdrop-blur-md px-4 py-3 flex gap-2"
        style={{ borderColor: "var(--line)" }}
      >
        <button type="button" className="h-11 flex-1 rounded-full text-[13px] font-bold text-[#1a1409]" style={{ background: "linear-gradient(135deg,#d4bf95,#b8a789 50%,#f0c9a3)" }}>🎁 打赏</button>
        <button type="button" className="h-11 flex-1 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold">💬 聊天</button>
        <button type="button" className="h-11 flex-1 rounded-full bg-white text-[var(--ink)] border border-[var(--line2)] text-[13px] font-semibold">📅 约她</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-5 mt-4 text-center">
        {[
          { label: "关注", value: creator.followers },
          { label: "作品", value: creator.works },
          { label: "评分", value: "4.9" },
          { label: "回复", value: `${availability.responseRate}%` },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[16px] font-bold text-[var(--ink)] tabular-nums">{s.value}</div>
            <div className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <section className="px-5 mt-6">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">简介</h2>
        <p className="text-[14px] leading-[1.7] text-[var(--ink2)] m-0">{about.bio}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {about.interests.slice(0, 6).map((i) => (
            <span key={i} className="text-[12px] font-semibold text-[var(--ink)] bg-[#F5F5F5] border border-[#EEEEEE] px-2.5 py-1 rounded-full">{i}</span>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="mt-6">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3 px-5">最新动态</h2>
        <ul className="flex flex-col gap-3 px-5">
          {feed.map((p) => (
            <li key={p.id} className="bg-white border border-[var(--line)] rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86]" />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--ink)] leading-tight">{creator.name}</div>
                  <div className="text-[11px] text-[var(--muted)]">{p.time}</div>
                </div>
              </div>
              <p className="text-[14px] text-[var(--ink)] leading-[1.6] m-0 whitespace-pre-wrap break-words">{p.text}</p>
              <div className="flex items-center gap-4 mt-3 text-[12px] text-[var(--muted)]">
                <span>♡ {fmtNum(p.likes)}</span>
                <span>💬 {p.comments}</span>
                <span>↗ 分享</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Related */}
      <section className="mt-8">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3 px-5">相似 Sugargirl</h2>
        <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide pb-2">
          {others.map((c) => {
            const h = pick(1, offsetFromSlug(c.slug)) ?? "/images/placeholder.png";
            return (
              <Link key={c.slug} href={`/m/creators/${c.slug}`} className="flex-shrink-0 w-[120px]">
                <div className="relative w-[120px] h-[150px] rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <Image src={h} alt={c.name} fill sizes="120px" className="object-cover" />
                </div>
                <div className="text-[12.5px] font-bold text-[var(--ink)] mt-1.5 truncate">{c.name}</div>
                <div className="text-[10.5px] text-[var(--muted)] truncate">{c.region}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
