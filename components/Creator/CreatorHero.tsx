// Hero — 全宽 dark banner,560px,12-col grid (7 left info + 5 right glass action panel)
// Background: HeroVideo (poster-only 现,src 后续接) + dark overlay
// NO absolute (仅 bg / veil / online-dot / verified badge), NO 负 margin
import CreatorHeroVideo from "./CreatorHeroVideo";
import CreatorInfo from "./CreatorInfo";
import ActionPanel from "./ActionPanel";
import type { Creator } from "@/lib/types";
import type { AvailabilityData } from "@/lib/creatorProfileMock";

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
  availability?: AvailabilityData;
  timezone?: string;
  nextAvailableText?: string;
}

export default async function CreatorHero({
  creator, bio, slogan, cover, avatar,
  age, height, languages, profession, zodiac,
  tags, online = true, vip = true,
  availability, timezone = "GMT+8", nextAvailableText = "Tonight",
}: Props) {
  const status = availability
    ? {
        isOnline: availability.isOnline,
        lastActiveText: availability.lastActiveText,
        responseRate: availability.responseRate,
        replyMinutes: availability.replyMinutes,
        nextAvailableText,
        timezone,
      }
    : undefined;
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
              cover={cover}
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
          {/* Right 5 col — Glass Action Panel (with Status block) */}
          <div className="cr-hero-c-right">
            <ActionPanel creatorName={creator.name} status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}
