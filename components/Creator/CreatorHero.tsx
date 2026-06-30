// Creator Profile 顶部 Hero — 大封面 + 圆形头像 + 信息 + 操作按钮
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import CreatorActions from "./CreatorActions";
import type { Creator } from "@/lib/types";

interface Props {
  creator: Creator;
  bio: string;
  cover: string;
  avatar: string;
  age: number;
  languages: string[];
  tags: string[];
  online?: boolean;
}

export default async function CreatorHero({
  creator, bio, cover, avatar, age, languages, tags, online = true,
}: Props) {
  const t = await getTranslations("creatorProfile.hero");

  return (
    <section className="cr-hero">
      {/* 大封面 */}
      <div className="cr-cover">
        <Img src={cover} alt={`${creator.name} cover`} sizes="100vw" priority />
        <div className="cr-cover-veil" />
      </div>

      {/* 头像 + 信息 + 操作 */}
      <div className="cr-head">
        <div className="cr-ava-wrap">
          <div className="cr-ava">
            <Img src={avatar} alt={creator.name} sizes="160px" />
          </div>
          {online && (
            <span className="cr-online-dot" aria-label={t("online")}>
              <span className="cr-online-dot-ping" />
            </span>
          )}
        </div>

        <div className="cr-id">
          <div className="cr-name-row">
            <h1 className="cr-name">{creator.name}</h1>
            <span className="cr-badge cr-badge-verified">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" /><path d="M9 12l2.2 2.2L15 10.5" /></svg>
              {t("verified")}
            </span>
            <span className="cr-badge cr-badge-sg">Sugargirl</span>
          </div>
          <div className="cr-handle">@{creator.slug}</div>

          <ul className="cr-meta">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {creator.region}
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {age} {t("yearsOld")}
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden><path d="M4 6h16M4 12h16M4 18h12" /></svg>
              {languages.join(" / ")}
            </li>
          </ul>

          <p className="cr-bio">{bio || t("defaultBio")}</p>

          <div className="cr-tags">
            {tags.map((tg) => <span key={tg} className="cr-tag">#{tg}</span>)}
          </div>
        </div>

        <CreatorActions creatorName={creator.name} />
      </div>
    </section>
  );
}
