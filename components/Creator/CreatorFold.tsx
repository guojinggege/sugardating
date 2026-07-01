// Hero + Creator Header 融合 (V2 Final Hero Refactor)
// Instagram/Twitter/Patreon/Airbnb 风格:
//   - Hero video banner (500h)
//   - 底部 gradient fade 平滑过渡到正文
//   - Glass Overlay Header 悬浮在 Hero 底部,内含 avatar/info/3 buttons
//   - Avatar translate 顶部浮出 Glass Card (跨 Hero 与 Header)
//   - align-items:center — avatar/info/actions 垂直居中
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import CreatorHeroVideo from "./CreatorHeroVideo";
import CreatorFoldActions from "./CreatorFoldActions";

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
      {/* Hero video banner + veil + bottom gradient fade */}
      <div className="cr-fold-hero">
        <CreatorHeroVideo poster={cover} videoSrc={videoSrc} />
        <div className="cr-fold-hero-veil" aria-hidden />
        <div className="cr-fold-hero-fade" aria-hidden />
      </div>

      {/* Glass Overlay Header — 悬浮 Hero 底部,与正文融合 */}
      <div className="cr-shell cr-fold-header-wrap">
        <div className="cr-fold-glass">
          {/* Avatar — translate 上移使 50/50 straddle glass 顶边 */}
          <div className="cr-fold-avatar">
            <Img src={avatar} alt={creator.name} sizes="160px" />
            {online && (
              <span className="cr-fold-avatar-online" aria-label={t("online")} />
            )}
          </div>

          {/* Info — vertically centered */}
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

          {/* Actions — 只 3 button (Follow / Gift / Share) */}
          <div className="cr-fold-actions">
            <CreatorFoldActions creatorName={creator.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
