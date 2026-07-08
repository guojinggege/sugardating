"use client";
// Right Sidebar V2 — 分成两个独立模块:
//   TOP (sticky):Media Showcase Card (顶 3 CTA + 大图)
//   BOTTOM (normal flow):Online Status / Gift Statistics / Similar Sugargirl (IG/X style)
// 删除:Recent Media (被 Similar IG/X 替代);原基础 Similar 列表 (合并到 IG/X 版)
import Link from "next/link";
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import { useChat } from "@/components/chat/ChatProvider";
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
  timezone?: string;
  nextAvailable?: string;
}

export default function RightSidebar({
  creator, imageSrc, age, city, price,
  availability, giftBoard, similar,
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t   = useTranslations("creatorProfile.sidebar");
  const tG  = useTranslations("creatorProfile.gifts.items");
  const requireLogin = useRequireLogin();
  const { openChatWith } = useChat();

  // 聊天不做前置 auth gate — ChatDrawer 内部会在未登录时显示 inline 登录提示
  // 直接 gate 会与 auth hydration race,导致已登录用户首次点击弹出登录 Modal
  function openChat() {
    openChatWith({
      slug: creator.slug,
      name: creator.name,
      avatar: imageSrc,
      languages: ["zh", "en"],
      online: availability?.isOnline,
    });
  }

  const giftsOfInterest = ["rose", "coffee", "dinner", "diamond"];
  const giftStats = giftBoard.filter((g) => giftsOfInterest.includes(g.key));
  const totalGifts = giftBoard.reduce((s, g) => s + g.count, 0);
  const topGift = giftBoard.reduce((max, g) => (g.count > max.count ? g : max), giftBoard[0]);

  return (
    <aside className="cr-sidebar">
      {/* ═══ TOP — Media Showcase Card (含 Online Status rows) ═══ */}
      <div className="cr-sidebar-top">
        <CreatorSidebarMediaCard
          creator={creator}
          imageSrc={imageSrc}
          age={age}
          city={city}
          price={price}
          availability={availability}
          timezone={timezone}
          nextAvailable={nextAvailable}
        />
      </div>

      {/* ═══ BOTTOM — 快速互动 / Gifts / Similar (IG/X) ═══ */}
      <div className="cr-sidebar-bottom">
        {/* 快速互动 — 3 CTA (打赏 / 聊天 / 约她) · 从 Media Card 迁移下来 */}
        <div className="cr-sb-card">
          <h5 className="cr-sb-h">快速互动</h5>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => requireLogin()}
              className="h-11 rounded-full text-[#1a1409] text-[13px] font-bold hover:opacity-95 transition inline-flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
            >
              <span aria-hidden>🎁</span>
              打赏
            </button>
            <button
              type="button"
              onClick={openChat}
              className="h-11 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-black transition inline-flex items-center justify-center gap-1.5"
            >
              <span aria-hidden>💬</span>
              聊天
            </button>
            <button
              type="button"
              onClick={() => requireLogin()}
              className="h-11 rounded-full bg-white text-[var(--ink)] border border-[var(--line2)] text-[13px] font-semibold hover:border-[var(--ink)] hover:bg-[var(--page)] transition inline-flex items-center justify-center gap-1.5"
            >
              <span aria-hidden>📅</span>
              约她
            </button>
          </div>
        </div>

        {/* Gift Statistics */}
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

        {/* Similar Sugargirl — Instagram / X 风格 (avatar + name/handle + Follow) */}
        <div className="cr-sb-card">
          <div className="flex items-center justify-between mb-3">
            <h5 className="cr-sb-h m-0">{t("similar")}</h5>
            <button type="button" className="text-[11.5px] text-[var(--muted)] font-semibold hover:text-[var(--ink)] transition">
              查看全部
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {similar.map(({ creator: c, photo }) => (
              <li key={c.slug} className="flex items-center gap-3">
                <Link
                  href={`/creators/${c.slug}`}
                  className="relative w-11 h-11 rounded-full overflow-hidden bg-[var(--page)] flex-shrink-0 ring-1 ring-[var(--line)] hover:ring-[var(--ink)] transition"
                >
                  <Img src={photo} alt={c.name} sizes="44px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/creators/${c.slug}`} className="block truncate text-[14px] font-bold text-[var(--ink)] hover:opacity-80 transition">
                    {c.name}
                  </Link>
                  <div className="truncate text-[12px] text-[var(--muted)] mt-0.5">
                    @{c.slug} · {c.region}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => requireLogin()}
                  className="h-8 px-3.5 rounded-full bg-[var(--ink)] text-white text-[12px] font-bold hover:bg-black transition whitespace-nowrap flex-shrink-0"
                >
                  关注
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

