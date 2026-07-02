"use client";
// Mobile Creator Detail — 全功能单列
// Sections: Hero · CTA sticky · Stats · Tabs (anchor scroll) · 简介 · 基础资料 · 生活方式 ·
//           兴趣 · 照片 · 视频 · 服务 · 打赏 · 动态 · 相似
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";
import type {
  CreatorAbout, AvailabilityData, VideoItem, GalleryItem,
  ServiceItem, GiftRank, FeedPost,
} from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  creator: Creator;
  cover: string;
  age: number;
  heightCm: number;
  about: CreatorAbout;
  availability: AvailabilityData;
  feed: FeedPost[];
  videos: VideoItem[];
  gallery: GalleryItem[];
  services: ServiceItem[];
  giftBoard: GiftRank[];
  others: CreatorRef[];
}

const TABS = [
  { id: "about",    label: "简介" },
  { id: "photos",   label: "照片" },
  { id: "videos",   label: "视频" },
  { id: "services", label: "服务" },
  { id: "gifts",    label: "打赏" },
  { id: "feed",     label: "动态" },
];

const SERVICE_META: Record<ServiceItem["key"], { emoji: string; title: string; desc: string }> = {
  dating:       { emoji: "☕", title: "约会",     desc: "线下精致约会 · 城市内 1v1" },
  travel:       { emoji: "✈️", title: "旅游",     desc: "短途 / 长途旅伴 · 摄影记录" },
  shoot:        { emoji: "📸", title: "拍摄",     desc: "时尚 / 写真 / 街拍" },
  "video-chat": { emoji: "📹", title: "视频聊天", desc: "1v1 视频沟通" },
};

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default function MobileCreatorDetail({
  creator, cover, age, heightCm, about, availability,
  feed, videos, gallery, services, giftBoard, others,
}: Props) {
  const requireLogin = useRequireLogin();
  const guard = () => requireLogin();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  const bioIsLong = about.bio.length > 100;
  const bioText = bioExpanded || !bioIsLong ? about.bio : about.bio.slice(0, 100) + "…";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  const basicRows = [
    { label: "年龄", value: `${age} 岁` },
    { label: "身高", value: `${heightCm} cm` },
    { label: "体重", value: `${about.weight} kg` },
    { label: "体型", value: about.bodyType },
    { label: "肤色", value: about.skinTone },
    { label: "发色", value: about.hairColor },
    { label: "眼睛", value: about.eyeColor },
    { label: "城市", value: about.city },
    { label: "出生地", value: about.birthCountry },
    { label: "语言", value: about.languages.join(" / ") },
    { label: "学历", value: about.education },
    { label: "星座", value: about.zodiac },
    { label: "血型", value: `${about.bloodType} 型` },
    { label: "加入", value: about.joinedAt },
  ];

  const ls = about.lifestyle;
  const lifestyleRows = ls ? [
    { label: "吸烟", value: ls.smoking },
    { label: "饮酒", value: ls.drinking },
    { label: "饮食", value: ls.diet },
    { label: "作息", value: ls.schedule },
    { label: "运动", value: ls.exercise },
    { label: "旅行", value: ls.travel },
    { label: "约会", value: ls.datingPref },
  ] : [];

  const sectionH = "text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3 px-5";

  return (
    <div className="pb-4">
      {/* ═══ Hero ═══ */}
      <div className="relative w-full h-[420px] bg-black">
        <Image src={cover} alt={creator.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <Link
          href="/m/creators"
          className="absolute top-3 left-3 w-9 h-9 grid place-items-center rounded-full text-white"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[26px] font-extrabold tracking-tight leading-tight m-0">{creator.name}</h1>
            {availability.isOnline && (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-500/90 rounded-full px-1.5 py-0.5">
                <span className="w-1 h-1 rounded-full bg-white" /> Online
              </span>
            )}
          </div>
          <div className="text-[13px] text-white/85">{creator.region} · {age} 岁 · {about.languages.join(" / ")}</div>
        </div>
      </div>

      {/* ═══ Sticky CTA ═══ */}
      <div
        className="sticky top-14 z-30 border-b bg-white/95 backdrop-blur-md px-4 py-3 flex gap-2"
        style={{ borderColor: "var(--line)" }}
      >
        <button type="button" onClick={guard} className="h-11 flex-1 rounded-full text-[13px] font-bold text-[#1a1409]" style={{ background: "linear-gradient(135deg,#d4bf95,#b8a789 50%,#f0c9a3)" }}>🎁 打赏</button>
        <button type="button" onClick={guard} className="h-11 flex-1 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold">💬 聊天</button>
        <button type="button" onClick={guard} className="h-11 flex-1 rounded-full bg-white text-[var(--ink)] border border-[var(--line2)] text-[13px] font-semibold">📅 约她</button>
      </div>

      {/* ═══ Stats ═══ */}
      <div className="grid grid-cols-4 gap-2 px-5 mt-4 text-center">
        {[
          { label: "关注",  value: creator.followers },
          { label: "作品",  value: creator.works },
          { label: "评分",  value: "4.9" },
          { label: "回复",  value: `${availability.responseRate}%` },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[16px] font-bold text-[var(--ink)] tabular-nums">{s.value}</div>
            <div className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ Tabs (anchor scroll) — 非 sticky 避免与 CTA 重叠 ═══ */}
      <div className="mt-5">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide px-4 py-2 border-y bg-white" style={{ borderColor: "var(--line)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(t.id)}
              className="flex-shrink-0 h-8 px-3.5 rounded-full text-[13px] font-semibold bg-white border border-[var(--line)] text-[var(--ink)] whitespace-nowrap hover:bg-[var(--ink)] hover:text-white transition"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 简介 ═══ */}
      <section id="about" className="mt-6 px-5" style={{ scrollMarginTop: "140px" }}>
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">简介</h2>
        <p className="text-[14px] leading-[1.7] text-[var(--ink2)] m-0 whitespace-pre-wrap">{bioText}</p>
        {bioIsLong && (
          <button
            type="button"
            onClick={() => setBioExpanded((v) => !v)}
            className="mt-2 text-[12.5px] font-semibold text-[var(--accent)] hover:opacity-80"
          >
            {bioExpanded ? "收起 ↑" : "展开更多 ↓"}
          </button>
        )}
      </section>

      {/* ═══ 基础资料 ═══ */}
      <section className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <h2 className={sectionH}>基础资料</h2>
        <div className="grid grid-cols-2 gap-2 px-5">
          {basicRows.map((r) => (
            <div key={r.label} className="bg-white border border-[var(--line)] rounded-[14px] px-3 py-2.5">
              <div className="text-[10.5px] text-[var(--muted)] font-medium">{r.label}</div>
              <div className="text-[13px] font-bold text-[var(--ink)] truncate mt-0.5">{r.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 生活方式 ═══ */}
      {lifestyleRows.length > 0 && (
        <section className="mt-8" style={{ scrollMarginTop: "140px" }}>
          <h2 className={sectionH}>生活方式</h2>
          <div className="grid grid-cols-2 gap-2 px-5">
            {lifestyleRows.map((r) => (
              <div key={r.label} className="bg-white border border-[var(--line)] rounded-[14px] px-3 py-2.5">
                <div className="text-[10.5px] text-[var(--muted)] font-medium">{r.label}</div>
                <div className="text-[13px] font-bold text-[var(--ink)] truncate mt-0.5">{r.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 兴趣爱好 ═══ */}
      {about.interests.length > 0 && (
        <section className="mt-8 px-5" style={{ scrollMarginTop: "140px" }}>
          <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">兴趣爱好</h2>
          <div className="flex flex-wrap gap-2">
            {about.interests.map((i) => (
              <span key={i} className="text-[12.5px] font-semibold text-[var(--ink)] bg-[#F5F5F5] border border-[#EEEEEE] px-3 py-1.5 rounded-full">
                {i}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 照片 ═══ */}
      <section id="photos" className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] m-0">照片</h2>
          <span className="text-[11.5px] text-[var(--muted)]">{gallery.length} 张</span>
        </div>
        <div className="grid grid-cols-3 gap-1 px-5">
          {gallery.slice(0, 9).map((g) => (
            <div key={g.id} className="relative aspect-square rounded-md overflow-hidden bg-[var(--page)]">
              <Image src={g.src} alt={g.alt} fill sizes="(max-width:640px) 33vw, 150px" className="object-cover" />
            </div>
          ))}
        </div>
        {gallery.length > 9 && (
          <button type="button" className="mx-5 mt-3 w-[calc(100%-40px)] h-10 rounded-full bg-white border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]">
            查看全部 {gallery.length} 张
          </button>
        )}
      </section>

      {/* ═══ 视频 ═══ */}
      <section id="videos" className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-[var(--muted)] m-0">视频</h2>
          <span className="text-[11.5px] text-[var(--muted)]">{videos.length} 支</span>
        </div>
        <div className="grid grid-cols-2 gap-3 px-5">
          {videos.slice(0, 6).map((v) => (
            <button key={v.id} type="button" onClick={guard} className="flex flex-col text-left">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F3F4F6]">
                <Image src={v.cover} alt={v.title} fill sizes="(max-width:640px) 50vw, 200px" className="object-cover" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-10 h-10 rounded-full bg-black/50 grid place-items-center backdrop-blur-md">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9.5px] font-bold px-1 py-0.5 rounded">{v.duration}</span>
              </div>
              <h3 className="text-[12.5px] font-bold text-[var(--ink)] mt-1.5 line-clamp-2 leading-[1.35]">{v.title}</h3>
              <div className="text-[10.5px] text-[var(--muted)] mt-0.5">{fmt(v.views)} 播放 · {v.daysAgo}d</div>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ 服务 ═══ */}
      <section id="services" className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <h2 className={sectionH}>服务</h2>
        <div className="grid grid-cols-2 gap-2 px-5">
          {services.map((s) => {
            const meta = SERVICE_META[s.key];
            return (
              <button
                key={s.key}
                type="button"
                onClick={guard}
                className="flex flex-col items-start gap-2 p-3.5 rounded-[14px] bg-white border border-[var(--line)] text-left hover:border-[var(--ink)] transition"
              >
                <span className="text-[20px] leading-none" aria-hidden>{meta.emoji}</span>
                <div className="min-w-0 w-full">
                  <div className="text-[13px] font-bold text-[var(--ink)] leading-tight">{meta.title}</div>
                  <div className="text-[10.5px] text-[var(--muted)] mt-0.5 line-clamp-1">{meta.desc}</div>
                </div>
                <div className="w-full pt-2 border-t border-[var(--line)] flex items-end justify-between">
                  <div>
                    <div className="text-[12.5px] font-bold text-[var(--ink)] tabular-nums">{s.price}</div>
                    <div className="text-[10px] text-[var(--muted)]">{s.duration}</div>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--accent)]">预约 →</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ 打赏 ═══ */}
      <section id="gifts" className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <h2 className={sectionH}>打赏 Ta</h2>
        <div className="mx-5 rounded-2xl p-4 bg-gradient-to-br from-[rgba(184,167,137,0.10)] to-[rgba(184,167,137,0.02)] border border-[rgba(184,167,137,0.28)]">
          {/* Gift picker */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {giftBoard.slice(0, 8).map((g) => {
              const active = selectedGift === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setSelectedGift(active ? null : g.key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${active ? "bg-[var(--accent)]/15 border-2 border-[var(--accent)]" : "bg-white border border-[var(--line)] hover:border-[var(--accent)]/50"}`}
                >
                  <span className="text-[22px] leading-none" aria-hidden>{g.emoji}</span>
                  <span className="text-[10px] font-bold text-[var(--ink)]">{g.count.toLocaleString("en-US")}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={guard}
            disabled={!selectedGift}
            className="w-full h-11 rounded-full text-[13px] font-bold transition disabled:opacity-40"
            style={{
              background: selectedGift ? "linear-gradient(135deg,#d4bf95,#b8a789 50%,#f0c9a3)" : "var(--page)",
              color: selectedGift ? "#1a1409" : "var(--muted)",
            }}
          >
            {selectedGift ? "立即送出" : "选择一份礼物"}
          </button>
          {/* Stats footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(184,167,137,0.2)] text-[11.5px]">
            <span className="text-[var(--muted)]">累计收到 <b className="text-[var(--ink)] tabular-nums">{totalGifts.toLocaleString("en-US")}</b></span>
            {topGift && (
              <span className="text-[var(--muted)] inline-flex items-center gap-1">
                Top:
                <span className="text-[13px]">{topGift.emoji}</span>
                <b className="text-[var(--ink)]">× {topGift.count.toLocaleString("en-US")}</b>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 最新动态 ═══ */}
      <section id="feed" className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <h2 className={sectionH}>最新动态</h2>
        <ul className="flex flex-col gap-3 px-5">
          {feed.map((p) => (
            <li key={p.id} className="bg-white border border-[var(--line)] rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[var(--page)] ring-1 ring-[var(--line)] flex-shrink-0">
                  <Image src={cover} alt={creator.name} fill sizes="36px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[var(--ink)] leading-tight">{creator.name}</div>
                  <div className="text-[11px] text-[var(--muted)]">{p.time}</div>
                </div>
              </div>
              <p className="text-[14px] text-[var(--ink)] leading-[1.6] m-0 whitespace-pre-wrap break-words line-clamp-4">{p.text}</p>
              <div className="flex items-center gap-4 mt-3 text-[12px] text-[var(--muted)]">
                <span>♡ {fmt(p.likes)}</span>
                <span>💬 {p.comments}</span>
                <span>↗ 分享</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══ 相似 Sugargirl ═══ */}
      <section className="mt-8" style={{ scrollMarginTop: "140px" }}>
        <h2 className={sectionH}>相似 Sugargirl</h2>
        <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide pb-2">
          {others.map(({ creator: c, photo }) => (
            <Link key={c.slug} href={`/m/creators/${c.slug}`} className="flex-shrink-0 w-[120px]">
              <div className="relative w-[120px] h-[150px] rounded-xl overflow-hidden bg-[#F3F4F6]">
                <Image src={photo} alt={c.name} fill sizes="120px" className="object-cover" />
              </div>
              <div className="text-[12.5px] font-bold text-[var(--ink)] mt-1.5 truncate">{c.name}</div>
              <div className="text-[10.5px] text-[var(--muted)] truncate">{c.region}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
