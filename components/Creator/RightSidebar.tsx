"use client";
// Right Sidebar — 4 卡结构 (per spec §二):
//   ① 在线 Sugargirl (Creator List)
//   ② 最近媒体 (2×2 image grid)
//   ③ 收到礼物 (Rose/Coffee/Dinner/Diamond + 累计 + Top Gift)
//   ④ 相似 Sugargirl (Creator List)
// 删除:MediaCard (错位大图) · 独立 Online Status · Trending · Quick Contact
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import type { Creator } from "@/lib/types";
import type { AvailabilityData, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  onlineSg: CreatorRef[];         // 在线 Sugargirl (Card 1)
  recentMedia: string[];          // 4 image URLs for 2×2 grid (Card 2)
  giftBoard: GiftRank[];          // Card 3
  similar: CreatorRef[];          // Card 4
  // 保留以兼容 page.tsx 已有调用签名 (未渲染)
  availability?: AvailabilityData;
  timezone?: string;
  nextAvailable?: string;
}

export default function RightSidebar({
  onlineSg, recentMedia, giftBoard, similar,
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tG  = useTranslations("creatorProfile.gifts.items");

  const creatorList = (title: string, items: CreatorRef[]) => (
    <div className="cr-sb-card">
      <h5 className="cr-sb-h">{title}</h5>
      <ul className="cr-sb-list">
        {items.map(({ creator, photo }) => (
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
  );

  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  return (
    <aside className="cr-sidebar">
      {/* ① 在线 Sugargirl */}
      {creatorList(t("online"), onlineSg)}

      {/* ② 最近媒体 — 2×2 图片 Grid */}
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

      {/* ③ 收到礼物 */}
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

      {/* ④ 相似 Sugargirl */}
      {creatorList(t("similar"), similar)}
    </aside>
  );
}
