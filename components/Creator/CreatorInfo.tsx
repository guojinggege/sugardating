// Hero 左侧 Information Group (server-rendered):
//   Avatar (140,shadow,border) + status
//   Name + Verified + VIP + Online badges
//   @username
//   Meta 8 rows (city / age / height / language / job / zodiac / interests / etc)
//   Slogan
//   About (2 lines,client 组件可展开 — 这里默认展开)
//   Tags cloud
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";

interface Props {
  creator: Creator;
  avatar: string;
  age: number;
  height: number;
  languages: string[];
  profession?: string;
  zodiac?: string;
  slogan?: string;
  bio: string;
  tags: string[];
  online?: boolean;
  vip?: boolean;
}

export default async function CreatorInfo({
  creator, avatar, age, height, languages,
  profession, zodiac, slogan, bio, tags,
  online = true, vip = true,
}: Props) {
  const t = await getTranslations("creatorProfile.hero");

  return (
    <div className="cr-info">
      <div className="cr-info-head">
        <div className="cr-info-avatar">
          <Img src={avatar} alt={creator.name} sizes="140px" />
          {online && <span className="cr-info-online" aria-label={t("online")} />}
        </div>

        <div className="cr-info-id">
          <div className="cr-info-name-row">
            <h1 className="cr-info-name">{creator.name}</h1>
            <span className="cr-badge cr-badge-verified" title={t("verified")}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
                <path d="M9 12l2.2 2.2L15 10.5" />
              </svg>
              {t("verified")}
            </span>
            {vip && <span className="cr-badge cr-badge-vip">VIP</span>}
            {online && <span className="cr-badge cr-badge-online"><i />Online</span>}
          </div>
          <div className="cr-info-handle">@{creator.slug}</div>
        </div>
      </div>

      {slogan && <p className="cr-info-slogan">"{slogan}"</p>}

      <ul className="cr-info-meta">
        <li><Icon k="pin" /> {creator.region}</li>
        <li><Icon k="age" /> {age} {t("yearsOld")}</li>
        <li><Icon k="height" /> {height} cm</li>
        <li><Icon k="lang" /> {languages.join(" / ")}</li>
        {profession && <li><Icon k="job" /> {profession}</li>}
        {zodiac && <li><Icon k="star" /> {zodiac}</li>}
      </ul>

      {bio && (
        <details className="cr-info-about">
          <summary className="cr-info-about-line">{bio}</summary>
          <div className="cr-info-about-full">{bio}</div>
        </details>
      )}

      {tags.length > 0 && (
        <div className="cr-info-tags">
          {tags.map((tg) => <span key={tg} className="cr-info-tag">#{tg}</span>)}
        </div>
      )}
    </div>
  );
}

function Icon({ k }: { k: "pin" | "age" | "height" | "lang" | "job" | "star" }) {
  const paths: Record<typeof k, React.ReactNode> = {
    pin:    <><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
    age:    <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    height: <><path d="M12 3v18M8 6l4-3 4 3M8 18l4 3 4-3" /></>,
    lang:   <><path d="M4 6h16M4 12h16M4 18h12" /></>,
    job:    <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>,
    star:   <><path d="M12 2l3 7 7 .6-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.6L2 9.6 9 9z" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden>{paths[k]}</svg>;
}
