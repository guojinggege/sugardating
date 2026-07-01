// Hero + Profile Header 融合成一个 Fold (Instagram/Twitter/Threads 风格)
// 单一 flex column 容器,内含:
//   - hero (video + veil + 控件),normal flow 高度 460
//   - profile shell (grid 3 col: avatar | info | actions)
//     avatar 用 CSS transform: translate(0, -50%) 视觉横跨 hero 底与 profile 顶
//     不用 absolute,不用 margin,不用负 top
//
// 视觉:第一眼看到 Creator (video bg),第二眼看到 avatar 跨越边界,
// 第三眼看到 name,第四眼看到 CTA
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import CreatorHeroVideo from "./CreatorHeroVideo";
import CreatorQuickActions from "./CreatorQuickActions";

interface Props {
  creator: Creator;
  cover: string;
  avatar: string;
  age: number;
  languages: string[];
  profession?: string;
  joinedAt: string;
  intro?: string;
  online?: boolean;
  vip?: boolean;
  videoSrc?: string;
}

export default async function CreatorFold({
  creator, cover, avatar, age, languages, profession, joinedAt, intro,
  online = true, vip = true, videoSrc,
}: Props) {
  const t = await getTranslations("creatorProfile.hero");
  const tS = await getTranslations("creatorProfile.stats");

  return (
    <div className="cr-fold">
      {/* Hero band — 460px video banner (normal flow) */}
      <div className="cr-fold-hero">
        <CreatorHeroVideo poster={cover} videoSrc={videoSrc} />
        <div className="cr-fold-hero-veil" aria-hidden />
      </div>

      {/* Profile shell — 3-col grid,avatar 用 translate 视觉横跨 hero/body 边界 */}
      <div className="cr-shell cr-fold-profile">
        {/* Avatar column — translate -50% 使一半浮出,一半在 profile row */}
        <div className="cr-fold-avatar-col">
          <div className="cr-fold-avatar">
            <Img src={avatar} alt={creator.name} sizes="160px" />
            {online && (
              <span className="cr-fold-avatar-online" aria-label={t("online")} />
            )}
          </div>
        </div>

        {/* Info column */}
        <div className="cr-fold-info">
          <div className="cr-fold-name-row">
            <h1 className="cr-fold-name">{creator.name}</h1>
            <span className="cr-fold-vf" title={t("verified")}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
                <path d="M9 12l2.2 2.2L15 10.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("verified")}
            </span>
            {vip && <span className="cr-fold-vip">VIP</span>}
            {online && (
              <span className="cr-fold-on-badge">
                <i />Online
              </span>
            )}
          </div>
          <div className="cr-fold-handle">@{creator.slug}</div>
          {intro && <p className="cr-fold-slogan">{intro}</p>}
          <ul className="cr-fold-meta">
            <li>
              <svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {creator.region}
            </li>
            <li>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {age} {t("yearsOld")}
            </li>
            <li>
              <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h12" /></svg>
              {languages.join(" / ")}
            </li>
            {profession && (
              <li>
                <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                {profession}
              </li>
            )}
            <li>
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
              {tS("joinedAt")} {joinedAt}
            </li>
          </ul>
        </div>

        {/* Actions column — horizontal button row */}
        <div className="cr-fold-actions">
          <CreatorQuickActions creatorName={creator.name} />
        </div>
      </div>
    </div>
  );
}
