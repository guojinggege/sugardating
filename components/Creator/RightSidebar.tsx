// Right Sidebar V4 — 4 widget,无图片预览模块
//   ① 在线 Sugargirl → ② Recommended Creators → ③ Top Fans → ④ Gift Leaderboard
//
// 已删除 Recent Media widget (spec:删除右侧图片预览模块)
// 图片查看统一走 GalleryGrid 的 fullscreen Lightbox (在 Photos tab 内)
import Link from "next/link";
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import type { TopFan, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  online: CreatorRef[];
  recommended: CreatorRef[];
  topFans: TopFan[];
  giftBoard: GiftRank[];
}

export default async function RightSidebar({
  online, recommended, topFans, giftBoard,
}: Props) {
  const t  = await getTranslations("creatorProfile.sidebar");
  const tG = await getTranslations("creatorProfile.gifts.items");

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

  return (
    <aside className="cr-sidebar">
      {/* ① 在线 Sugargirl */}
      {creatorList(t("online"), online)}

      {/* ② Recommended Creators */}
      {creatorList(t("recommended"), recommended)}

      {/* ③ Top Fans */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("topFans")}</h5>
        <ul className="cr-sb-list">
          {topFans.map((f, i) => (
            <li key={f.name + i}>
              <div className="cr-sb-row" aria-label={f.name}>
                <span className="cr-sb-fan-rank" aria-hidden>#{i + 1}</span>
                <div className="cr-sb-fan-ava" aria-hidden>{f.avatarChar}</div>
                <div className="cr-sb-meta">
                  <div className="cr-sb-name">{f.name}</div>
                  <div className="cr-sb-sub">🎁 {f.giftCount} · {f.totalSpent}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ④ Gift Leaderboard */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("giftLeaderboard")}</h5>
        <ul className="cr-sb-list">
          {giftBoard.map((g) => (
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
      </div>
    </aside>
  );
}
