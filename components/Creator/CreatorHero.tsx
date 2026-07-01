// Creator Profile Hero — single flex group in unified container
//   Left  : avatar + info (name/verified/handle/meta/bio/tags)
//   Right : CreatorActions button group (single row)
//   Bottom: 4 key stats ribbon
// NO absolute (except online dot), NO negative margin, NO magic numbers
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import CreatorActions from "./CreatorActions";
import type { Creator } from "@/lib/types";
import type { CreatorStatsData } from "@/lib/creatorProfileMock";

interface Props {
  creator: Creator;
  bio: string;
  cover: string;
  avatar: string;
  age: number;
  languages: string[];
  tags: string[];
  online?: boolean;
  stats: CreatorStatsData;
}

function fmtCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export default async function CreatorHero({
  creator, bio, cover, avatar, age, languages, tags, online = true, stats,
}: Props) {
  const t   = await getTranslations("creatorProfile.hero");
  const tS  = await getTranslations("creatorProfile.stats");

  return (
    <section className="cr-hero">
      {/* 全屏 bg,blur + brightness 45% + gradient overlay 保证文字对比度 */}
      <div className="cr-hero-bg" aria-hidden>
        <Img src={cover} alt="" sizes="100vw" priority />
      </div>
      <div className="cr-hero-veil" aria-hidden />

      {/* 内容层 — 用统一 shell 容器 */}
      <div className="cr-shell cr-hero-inner">
        <div className="cr-hero-main">
          {/* Left: avatar + info,同一 Information Group */}
          <div className="cr-hero-left">
            <div className="cr-hero-avatar">
              <Img src={avatar} alt={creator.name} sizes="120px" />
              {online && (
                <span className="cr-hero-online" aria-label={t("online")} />
              )}
            </div>
            <div className="cr-hero-info">
              <div className="cr-hero-name-row">
                <h1 className="cr-hero-name">{creator.name}</h1>
                <span className="cr-badge cr-badge-verified">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
                    <path d="M9 12l2.2 2.2L15 10.5" />
                  </svg>
                  {t("verified")}
                </span>
                <span className="cr-badge cr-badge-sg">Sugargirl</span>
              </div>
              <div className="cr-hero-handle">@{creator.slug}</div>

              <ul className="cr-hero-meta">
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {creator.region}
                </li>
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {age} {t("yearsOld")}
                </li>
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M4 6h16M4 12h16M4 18h12" />
                  </svg>
                  {languages.join(" / ")}
                </li>
              </ul>

              {(bio || t("defaultBio")) && (
                <p className="cr-hero-bio">{bio || t("defaultBio")}</p>
              )}

              {tags.length > 0 && (
                <div className="cr-hero-tags">
                  {tags.map((tg) => (
                    <span key={tg} className="cr-hero-tag">#{tg}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: button group,同一行 */}
          <div className="cr-hero-right">
            <CreatorActions creatorName={creator.name} />
          </div>
        </div>

        {/* Bottom stats ribbon — 4 key metrics 内嵌 hero,取代原独立 stats 段 */}
        <div className="cr-hero-stats" aria-label={tS("ariaLabel")}>
          <div className="cr-hero-stat">
            <b>{fmtCount(stats.followers)}</b>
            <span>{tS("followers")}</span>
          </div>
          <div className="cr-hero-stat">
            <b>{stats.posts}</b>
            <span>{tS("posts")}</span>
          </div>
          <div className="cr-hero-stat">
            <b>{stats.videos}</b>
            <span>{tS("videos")}</span>
          </div>
          <div className="cr-hero-stat">
            <b>{stats.photos}</b>
            <span>{tS("photos")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
