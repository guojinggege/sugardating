// Hero — 全宽 dark banner,560px,12-col grid (7 left info + 5 right glass action panel)
// Background: HeroVideo (poster-only 现,src 后续接) + dark overlay
// NO absolute (仅 bg / veil / online-dot / verified badge), NO 负 margin
import CreatorHeroVideo from "./CreatorHeroVideo";
import CreatorInfo from "./CreatorInfo";
import ActionPanel from "./ActionPanel";
import type { Creator } from "@/lib/types";

interface Props {
  creator: Creator;
  bio: string;
  slogan?: string;
  cover: string;
  avatar: string;
  age: number;
  height: number;
  languages: string[];
  profession?: string;
  zodiac?: string;
  tags: string[];
  online?: boolean;
  vip?: boolean;
}

export default async function CreatorHero({
  creator, bio, slogan, cover, avatar,
  age, height, languages, profession, zodiac,
  tags, online = true, vip = true,
}: Props) {
  return (
    <section className="cr-hero">
      <div className="cr-hero-bg" aria-hidden>
        <CreatorHeroVideo poster={cover} />
      </div>
      <div className="cr-hero-veil" aria-hidden />

      <div className="cr-shell cr-hero-inner">
        <div className="cr-hero-grid">
          {/* Left 7 col — Creator Info */}
          <div className="cr-hero-c-left">
            <CreatorInfo
              creator={creator}
              avatar={avatar}
              age={age}
              height={height}
              languages={languages}
              profession={profession}
              zodiac={zodiac}
              slogan={slogan}
              bio={bio}
              tags={tags}
              online={online}
              vip={vip}
            />
          </div>
          {/* Right 5 col — Glass Action Panel */}
          <div className="cr-hero-c-right">
            <ActionPanel creatorName={creator.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
