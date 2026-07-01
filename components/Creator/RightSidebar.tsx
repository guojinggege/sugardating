// Right Sidebar V3 — 5 widget 顺序 (spec):
//   ① 在线 Sugargirl → ② Recent Media → ③ Recommended Creators
//   → ④ Top Fans → ⑤ Gift Leaderboard
//
// 已删除 (v2):Availability (移到 About Card) / 猜你喜欢重复 / 热门创作者
// / 推荐视频 / 推荐服务 / 支持 Ta widget
// 移除 sidebar 顶部图片模块 (spec 明确要求)
import Link from "next/link";
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import type { GalleryItem, TopFan, GiftRank } from "@/lib/creatorProfileMock";

interface CreatorRef { creator: Creator; photo: string }

interface Props {
  online: CreatorRef[];       // 在线 Sugargirl
  recentMedia: GalleryItem[]; // Recent Media
  recommended: CreatorRef[];  // Recommended Creators
  topFans: TopFan[];           // Top Fans
  giftBoard: GiftRank[];       // Gift Leaderboard
}

export default async function RightSidebar({
  online, recentMedia, recommended, topFans, giftBoard,
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
      {/* ① 在线 Sugargirl — 顶部 (spec 顺序) */}
      {creatorList(t("online"), online)}

      {/* ② Recent Media */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("recentMedia")}</h5>
        <div className="cr-sb-media">
          {recentMedia.slice(0, 4).map((m) => (
            <Link key={m.id} href="#gallery" className="cr-sb-media-tile" aria-label={m.alt}>
              <Img src={m.src} alt={m.alt} sizes="120px" />
            </Link>
          ))}
        </div>
      </div>

      {/* ③ Recommended Creators */}
      {creatorList(t("recommended"), recommended)}

      {/* ④ Top Fans */}
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

      {/* ⑤ Gift Leaderboard */}
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
