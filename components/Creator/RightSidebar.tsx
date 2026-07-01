"use client";
// V3 — Right Sidebar (6 widgets, per spec §Sidebar)
//   ① Online Status
//   ② Quick Contact (2×2 grid: 聊天 / 视频聊天 / 私拍 / 预约伴游)
//   ③ Recent Visitors    — Creator List
//   ④ Trending Creator   — Creator List
//   ⑤ Similar Sugargirl  — Creator List
//   ⑥ Gift Statistics    — Rose/Coffee/Dinner/Diamond + 累计 + Top Gift
// 删除 (spec §删除旧模块):
//   - Verification widget (Hero Header 已有 Verified badge,重复展示)
//   - Tip 独立按钮 (Gift 已在 Hero Actions)
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";
import type { AvailabilityData, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  availability: AvailabilityData;
  recentVisitors: CreatorRef[];
  trending: CreatorRef[];
  similar: CreatorRef[];
  giftBoard: GiftRank[];
  timezone?: string;
  nextAvailable?: string;
}

export default function RightSidebar({
  availability, recentVisitors, trending, similar, giftBoard,
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tS  = useTranslations("creatorProfile.status");
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

  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  return (
    <aside className="cr-sidebar">
      {/* ① Online Status */}
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
          <SbRow label={tS("lastActive")} value={availability.lastActiveText} />
          <SbRow label={tS("nextAvailable")} value={nextAvailable} />
          <SbRow label={tS("timezone")} value={timezone} />
        </div>
      </div>

      {/* ② Quick Contact — 2×2 grid (spec: 聊天/视频聊天/私拍/预约伴游) */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("quickContact")}</h5>
        <div className="grid grid-cols-2 gap-2">
          <QcBtn onClick={guard(() => {})} emoji="💬" label={tA("chat")} primary />
          <QcBtn onClick={guard(() => {})} emoji="📹" label={tA("videoCall")} />
          <QcBtn onClick={guard(() => {})} emoji="📷" label={tA("privateShoot")} />
          <QcBtn onClick={guard(() => {})} emoji="✈️" label={tA("bookTravel")} />
        </div>
      </div>

      {/* ③ Recent Visitors */}
      {creatorList(t("recentVisitors"), recentVisitors)}

      {/* ④ Trending Creator */}
      {creatorList(t("trending"), trending)}

      {/* ⑤ Similar Sugargirl */}
      {creatorList(t("similar"), similar)}

      {/* ⑥ Gift Statistics */}
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
  onClick, emoji, label, primary,
}: {
  onClick: () => void;
  emoji: string;
  label: string;
  primary?: boolean;
}) {
  const base = "flex flex-col items-center justify-center gap-1 h-[68px] rounded-[14px] font-semibold text-[12.5px] font-ui cursor-pointer transition-all";
  const cls = primary
    ? `${base} bg-[var(--ink)] text-white border border-[var(--ink)] hover:bg-black`
    : `${base} bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:bg-[var(--page)]`;
  return (
    <button type="button" onClick={onClick} className={cls}>
      <span className="text-[20px] leading-none" aria-hidden>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
