"use client";
// Right Sidebar 顺序 (per spec §Media Card §七):
//   ① Media Showcase Card (大图 + chip + 4-button pill action bar)  ← 新
//   ② Online Status
//   ③ Gift Statistics
//   ④ Similar Sugargirl
//   ⑤ Recent Media (optional 小图 grid)
// 删除:Quick Contact / 快速互动 3-CTA (与 Media Card action bar 重复,spec §十二)
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import type { Creator } from "@/lib/types";
import type { AvailabilityData, GiftRank } from "@/lib/creatorProfileMock";
import CreatorSidebarMediaCard from "./CreatorSidebarMediaCard";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  creator: Creator;
  imageSrc: string;
  age?: number;
  city?: string;
  price?: string;
  availability: AvailabilityData;
  giftBoard: GiftRank[];
  similar: CreatorRef[];
  recentMedia?: { src: string; title: string; meta: string }[];
  timezone?: string;
  nextAvailable?: string;
}

export default function RightSidebar({
  creator, imageSrc, age, city, price,
  availability, giftBoard, similar, recentMedia = [],
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tS  = useTranslations("creatorProfile.status");
  const tG  = useTranslations("creatorProfile.gifts.items");

  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  const replyValue = availability.replyMinutes < 60
    ? `${availability.replyMinutes} 分钟`
    : `< ${Math.round(availability.replyMinutes / 60)} 小时`;

  return (
    <aside className="cr-sidebar">
      {/* ① Media Showcase Card — 大图 + 底部 pill Action Bar */}
      <CreatorSidebarMediaCard
        creator={creator}
        imageSrc={imageSrc}
        age={age}
        city={city}
        price={price}
      />

      {/* ② Online Status */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{tS("onlineNow")}</h5>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[var(--muted)]">{tS("onlineNow")}</span>
            {availability.isOnline ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#16a34a]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
                {tS("onlineNow")}
              </span>
            ) : (
              <span className="font-semibold text-[var(--ink)]">{availability.lastActiveText}</span>
            )}
          </div>
          <SbRow label={tS("replyRate")}     value={`${availability.responseRate}%`} />
          <SbRow label={tS("avgReply")}      value={replyValue} />
          <SbRow label={tS("nextAvailable")} value={nextAvailable} />
          <SbRow label={tS("timezone")}      value={timezone} />
          <SbRow label={tS("lastActive")}    value={availability.lastActiveText} />
        </div>
      </div>

      {/* ③ Gift Statistics */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("giftStats")}</h5>
        <ul className="cr-sb-list mb-3">
          {giftStats.map((g) => (
            <li key={g.key}>
              <div className="cr-sb-row" aria-label={tG(g.key)}>
                <span className="cr-sb-gift-emoji" aria-hidden>{g.emoji}</span>
                <div className="cr-sb-meta flex-1">
                  <div className="cr-sb-name">{tG(g.key)}</div>
                </div>
                <span className="cr-sb-gift-count tabular-nums">{g.count.toLocaleString("en-US")}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--line)] text-[12.5px]">
          <span className="text-[var(--muted)]">{t("giftTotal")}</span>
          <b className="text-[15px] font-extrabold text-[var(--ink)] tabular-nums">{totalGifts.toLocaleString("en-US")}</b>
        </div>
        {topGift && (
          <div className="flex items-center justify-between pt-2 text-[12.5px]">
            <span className="text-[var(--muted)]">{t("topGift")}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[14px] leading-none" aria-hidden>{topGift.emoji}</span>
              <b className="text-[13px] font-bold text-[var(--ink)]">{tG(topGift.key)}</b>
              <span className="text-[11.5px] text-[var(--muted)] tabular-nums">× {topGift.count.toLocaleString("en-US")}</span>
            </span>
          </div>
        )}
      </div>

      {/* ④ Similar Sugargirl */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("similar")}</h5>
        <ul className="cr-sb-list">
          {similar.map(({ creator: c, photo }) => (
            <li key={c.slug}>
              <Link href={`/creators/${c.slug}`} className="cr-sb-row">
                <div className="cr-sb-ava">
                  <Img src={photo} alt={c.name} sizes="44px" />
                </div>
                <div className="cr-sb-meta">
                  <div className="cr-sb-name">{c.name}</div>
                  <div className="cr-sb-sub">{c.region} · {c.followers} {t("followers")}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ⑤ Recent Media (optional) — 竖向列表 · 与 Similar Sugargirl 风格统一 */}
      {recentMedia.length > 0 && (
        <div className="cr-sb-card">
          <h5 className="cr-sb-h">{t("recentMedia")}</h5>
          <ul className="flex flex-col">
            {recentMedia.slice(0, 4).map((m, i, arr) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => { /* TODO: lightbox / media detail — placeholder */ }}
                  className={`w-full flex items-center gap-3 py-2.5 text-left transition-all hover:bg-[#F9FAFB] hover:rounded-[12px] hover:px-2 hover:-mx-2 cursor-pointer ${i < arr.length - 1 ? "border-b border-[#F1F1F1]" : ""}`}
                >
                  <div className="relative w-[52px] h-[52px] rounded-[12px] overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                    <Img src={m.src} alt={m.title} sizes="52px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#111827] truncate">{m.title}</div>
                    <div className="text-[12px] text-[#9CA3AF] mt-1 truncate">{m.meta}</div>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#D1D5DB] flex-shrink-0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function SbRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-[var(--muted)]">{label}</span>
      <b className="text-[13px] font-bold text-[var(--ink)] tabular-nums">{value}</b>
    </div>
  );
}
