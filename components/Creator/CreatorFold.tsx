// V3 Final — Hero Cover Motion + Floating Identity Bar 嵌入 Hero
// spec §Hero: 620~680 · Cover Motion (Priority: Creator Video → AI Demo → Cover Image)
// spec §Floating Identity Bar:
//   - 与正文 Container 同宽 (1200-1280,.cr-shell)
//   - 高 120-140,glass rgba(255,255,255,.90) blur 20 radius 24
//   - 嵌入 Hero (absolute bottom),而非 Hero 下方
// spec §头像:160,~35% 越出 Bar,形成 Instagram / Twitter / Airbnb Host 跨 Banner 效果
// spec §Hero Header Button:只 Follow / Gift / Share (聊天/视频/私拍/伴游 → Sidebar Quick Contact)
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
  const t  = await getTranslations("creatorProfile.hero");
  const tS = await getTranslations("creatorProfile.stats");

  return (
    <div className="cr-fold">
      <div className="cr-fold-hero">
        <CreatorHeroVideo poster={cover} videoSrc={videoSrc} />
        <div className="cr-fold-hero-veil" aria-hidden />
        <div className="cr-fold-hero-fade" aria-hidden />
      </div>

      {/* Identity Bar — sibling of Hero,flex column 布局下自动落在首屏底部 */}
      <div className="cr-fold-bar-abs">
        <div className="cr-shell">
          <div className="cr-fold-bar">
              {/* Avatar 160 — translate 上移 35% straddle Bar 顶边 */}
              <div className="cr-fold-avatar">
                <Img src={avatar} alt={creator.name} sizes="160px" />
                {online && (
                  <span className="cr-fold-avatar-online" aria-label={t("online")} />
                )}
              </div>

              {/* Info */}
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
                    <span className="cr-fold-on-badge"><i />Online</span>
                  )}
                  <span className="cr-fold-handle">@{creator.slug}</span>
                </div>
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

            {/* Actions — 3 button (Follow / Gift / Share) */}
            <div className="cr-fold-actions">
              <CreatorFoldActions creatorName={creator.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
