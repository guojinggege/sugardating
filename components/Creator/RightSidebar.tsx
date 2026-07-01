// 右侧 sticky 侧栏 — 6 widget + 支持 Ta,固定 320,统一 20px 间距
//   1. 猜你喜欢          — 4 creator list
//   2. 在线 Sugargirl    — 4 creator list
//   3. 推荐视频          — 3 video thumb list
//   4. 推荐服务          — 4 service quick chips
//   5. 热门创作者        — 4 creator list
//   6. Recent Media     — 2x2 gallery thumbs
//   + 支持 Ta (TipButton) — 底部
import Link from "next/link";
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import type { VideoItem, GalleryItem } from "@/lib/creatorProfileMock";
import TipButton from "@/app/creators/[slug]/TipButton";

interface CreatorRef {
  creator: Creator;
  photo: string;
}

interface Props {
  creatorSlug: string;
  guesses: CreatorRef[];
  online: CreatorRef[];
  hot: CreatorRef[];
  videos: VideoItem[];          // 推荐视频 (取前 3)
  recentMedia: GalleryItem[];   // Recent Media (取前 4)
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  dating: <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>,
  travel: <svg viewBox="0 0 24 24"><path d="M2 12l8-3 4 4 6-7 2 2-7 9-4-4z" /></svg>,
  shoot:  <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 7l2-3h4l2 3" /></svg>,
  "video-chat": <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>,
};

const SERVICE_PRICES: Record<string, string> = {
  dating: "S$ 280 起",
  travel: "S$ 1,200 起",
  shoot: "S$ 680 起",
  "video-chat": "S$ 48 起",
};

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default async function RightSidebar({
  creatorSlug, guesses, online, hot, videos, recentMedia,
}: Props) {
  const t   = await getTranslations("creatorProfile.sidebar");
  const tSv = await getTranslations("creatorProfile.services");
  const tVw = await getTranslations("creatorProfile.videos");

  const creatorRow = (title: string, items: CreatorRef[]) => (
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
      {/* 1 猜你喜欢 */}
      {creatorRow(t("guesses"), guesses)}

      {/* 2 在线 Sugargirl */}
      {creatorRow(t("online"), online)}

      {/* 3 推荐视频 */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("recommendedVideos")}</h5>
        <ul className="cr-sb-videos">
          {videos.slice(0, 3).map((v) => (
            <li key={v.id}>
              <Link href={`#videos`}>
                <div className="cr-sb-vt">
                  <Img src={v.cover} alt={v.title} sizes="88px" />
                  <span className="cr-sb-vt-dur">{v.duration}</span>
                </div>
                <div className="cr-sb-vinfo">
                  <b>{v.title}</b>
                  <span>{fmtViews(v.views)} {tVw("views")}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 推荐服务 */}
      <div className="cr-sb-card">
        <h5 className="cr-sb-h">{t("recommendedServices")}</h5>
        <ul className="cr-sb-services">
          {(["dating", "travel", "shoot", "video-chat"] as const).map((k) => (
            <li key={k}>
              <Link href={`#services`}>
                <div className="cr-sb-svc-ic">{SERVICE_ICONS[k]}</div>
                <div className="cr-sb-svc-info">
                  <div className="cr-sb-svc-title">{tSv(`items.${k}.title`)}</div>
                  <div className="cr-sb-svc-price">{SERVICE_PRICES[k]}</div>
                </div>
                <svg className="cr-sb-svc-arr" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 5 热门创作者 */}
      {creatorRow(t("hot"), hot)}

      {/* 6 Recent Media */}
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

      {/* 支持 Ta — 打赏入口 (feature 保留,视觉与前 6 项区分) */}
      <div className="cr-sb-card cr-sb-tip">
        <h5 className="cr-sb-h">{t("support")}</h5>
        <p className="cr-sb-sub">{t("supportDesc")}</p>
        <div className="cr-sb-tip-act">
          <TipButton slug={creatorSlug} />
        </div>
      </div>
    </aside>
  );
}
