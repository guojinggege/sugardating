"use client";
// Right Sidebar V2 Final — 7 widget (per spec)
//   ① 在线状态 (Online Status)     — creator 自己的 online/reply/next avail/timezone
//   ② 认证 (Verification)          — 6 verify chips
//   ③ 快速联系 (Quick Contact)     — 5 stacked CTA (聊天/视频/私拍/伴游/打赏)
//   ④ 最近浏览 (Recent Visitors)   — creator list
//   ⑤ 热门推荐 (Popular)           — creator list
//   ⑥ 相似 Sugargirl (Similar)     — creator list
//   ⑦ Gift Statistics             — 4 gift rank + total + top gift
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";
import type { AvailabilityData, TrustFlags, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  availability: AvailabilityData;
  trust: TrustFlags;
  recentVisitors: CreatorRef[];
  popular: CreatorRef[];
  similar: CreatorRef[];
  giftBoard: GiftRank[];
  timezone?: string;
  nextAvailable?: string;
}

const TRUST_ORDER: (keyof TrustFlags)[] = ["identity", "phone", "email", "video", "face", "safeMeet"];

export default function RightSidebar({
  availability, trust, recentVisitors, popular, similar, giftBoard,
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tS  = useTranslations("creatorProfile.status");
  const tT  = useTranslations("creatorProfile.trust");
  const tG  = useTranslations("creatorProfile.gifts.items");
  const tA  = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  const creatorList = (title: string, items: CreatorRef[]) => (
    <div className="cr-sb-card">
      <h5 className="cr-sb-h">{title}</h5>
      <ul className="cr-sb-list">
        {items.map(({ creator, photo }) => (
          <li key={creator.slug}>
            <Link href={`/creators/${creator.slug}`} className="cr-sb-row">
              <div className="cr-sb-ava">
                <Img src={photo} alt={creator.name} sizes="40px" />
              </div>
              <div className="cr-sb-meta">
                <div className="cr-sb-name">{creator.name}</div>
                <div className="cr-sb-sub">{creator.region} · {creator.followers} {t("followers")}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // Gift Statistics: 只显示 Rose/Coffee/Dinner/Diamond (spec 列出的 4 项)
  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  return (
    <aside className="cr-sidebar">
      {/* ① 在线状态 */}
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
          <SbRow label={tS("replyRate")} value={`${availability.responseRate}%`} />
          <SbRow label={tS("avgReply")} value={availability.replyMinutes < 60 ? `${availability.replyMinutes} 分钟` : `< ${Math.round(availability.replyMinutes / 60)} 小时`} />
          <SbRow label={tS("nextAvailable")} value={nextAvailable} />
          <SbRow label={tS("timezone")} value={timezone} />
        </div>
      </div>

      {/* ② 认证 — 在 Online Status 下面 (spec §认证) */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{tT("title")}</h5>
        <div className="flex flex-wrap gap-1.5">
          {TRUST_ORDER.filter((k) => trust[k]).map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] text-[#16a34a] font-semibold text-[11.5px] whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2.4]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l4 4 10-10" />
              </svg>
              {tT(`items.${k}`)}
            </span>
          ))}
        </div>
      </div>

      {/* ③ 快速联系 (Quick Contact) — 5 vertical CTA buttons */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("quickContact")}</h5>
        <div className="flex flex-col gap-2">
          <QcBtn onClick={guard(() => {})} emoji="💬" label={tA("chat")} primary />
          <QcBtn onClick={guard(() => {})} emoji="📹" label={tA("videoCall")} />
          <QcBtn onClick={guard(() => {})} emoji="📷" label={tA("privateShoot")} />
          <QcBtn onClick={guard(() => {})} emoji="✈️" label={tA("bookTravel")} />
          <QcBtn onClick={guard(() => {})} emoji="🎁" label={tA("tip")} gradient />
        </div>
      </div>

      {/* ④ 最近浏览 */}
      {creatorList(t("recentVisitors"), recentVisitors)}

      {/* ⑤ 热门推荐 */}
      {creatorList(t("popular"), popular)}

      {/* ⑥ 相似 Sugargirl */}
      {creatorList(t("similar"), similar)}

      {/* ⑦ Gift Statistics */}
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
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-[rgba(184,167,137,0.12)] to-[rgba(184,167,137,0.03)] border border-[rgba(184,167,137,0.25)]">
            <div className="text-[10.5px] font-bold uppercase tracking-[.12em] text-[var(--accent)] mb-1">{t("topGift")}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none" aria-hidden>{topGift.emoji}</span>
              <div>
                <div className="text-[13px] font-bold text-[var(--ink)]">{tG(topGift.key)}</div>
                <div className="text-[11.5px] text-[var(--muted)] tabular-nums">× {topGift.count.toLocaleString("en-US")}</div>
              </div>
            </div>
          </div>
        )}
      </div>
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

function QcBtn({
  onClick, emoji, label, primary, gradient,
}: {
  onClick: () => void;
  emoji: string;
  label: string;
  primary?: boolean;
  gradient?: boolean;
}) {
  let cls = "flex items-center gap-2.5 w-full h-10 px-3.5 rounded-[12px] font-semibold text-[13px] font-ui cursor-pointer transition-all whitespace-nowrap ";
  const style: React.CSSProperties = {};
  if (primary) {
    cls += "bg-[var(--ink)] text-white border border-[var(--ink)] hover:bg-black";
  } else if (gradient) {
    cls += "text-[#1a1409] border-0 font-bold hover:opacity-95";
    style.background = "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)";
  } else {
    cls += "bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)]";
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      <span className="text-[15px] leading-none" aria-hidden>{emoji}</span>
      {label}
    </button>
  );
}
