"use client";
// Right Sidebar — 5 卡结构 (per spec §七, 转化优先):
//   ① Creator Action Card — 聊天 / 打赏 / 预约 (转化核心)
//   ② Online Status — 在线/回复率/平均回复/下次可预约/时区/最近活跃
//   ③ Gift Statistics — Rose/Coffee/Dinner/Diamond + 累计 + Top Gift (无大图 preview)
//   ④ Similar Sugargirl — Creator List
//   ⑤ Recent Media (optional) — 2×2 小图 grid
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";
import type { AvailabilityData, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  availability: AvailabilityData;
  giftBoard: GiftRank[];
  similar: CreatorRef[];
  recentMedia?: string[];
  timezone?: string;
  nextAvailable?: string;
}

export default function RightSidebar({
  availability, giftBoard, similar, recentMedia = [],
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tS  = useTranslations("creatorProfile.status");
  const tG  = useTranslations("creatorProfile.gifts.items");
  const tA  = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const guard = () => { if (!requireLogin()) return; /* TODO: route */ };

  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  const replyValue = availability.replyMinutes < 60
    ? `${availability.replyMinutes} 分钟`
    : `< ${Math.round(availability.replyMinutes / 60)} 小时`;

  return (
    <aside className="cr-sidebar">
      {/* ① Creator Action Card — 转化核心 3 CTA */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("quickContact")}</h5>
        <div className="flex flex-col gap-2">
          <button
            type="button" onClick={guard}
            className="h-11 rounded-full bg-[var(--ink)] text-white text-[13.5px] font-semibold hover:bg-black transition inline-flex items-center justify-center gap-2"
          >
            💬 {tA("chat")}
          </button>
          <button
            type="button" onClick={guard}
            className="h-11 rounded-full text-[#1a1409] text-[13.5px] font-bold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
          >
            🎁 {tA("tip")}
          </button>
          <button
            type="button" onClick={guard}
            className="h-11 rounded-full bg-white text-[var(--ink)] border border-[var(--line2)] text-[13.5px] font-semibold hover:border-[var(--ink)] hover:bg-[var(--page)] transition inline-flex items-center justify-center gap-2"
          >
            📅 {tA("bookDate")}
          </button>
        </div>
      </div>

      {/* ② Online Status Card */}
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

      {/* ③ Gift Statistics — 无大图 preview,flat row list */}
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
          {similar.map(({ creator, photo }) => (
            <li key={creator.slug}>
              <Link href={`/creators/${creator.slug}`} className="cr-sb-row">
                <div className="cr-sb-ava">
                  <Img src={photo} alt={creator.name} sizes="44px" />
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

      {/* ⑤ Recent Media (optional) — 2×2 小图,不撑高 sidebar */}
      {recentMedia.length > 0 && (
        <div className="cr-sb-card">
          <h5 className="cr-sb-h">{t("recentMedia")}</h5>
          <div className="grid grid-cols-2 gap-2">
            {recentMedia.slice(0, 4).map((src, i) => (
              <div
                key={i}
                className="relative rounded-[12px] overflow-hidden bg-[var(--page)]"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Img src={src} alt="" sizes="150px" />
              </div>
            ))}
          </div>
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
