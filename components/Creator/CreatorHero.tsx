// Creator Hero — 纯视觉 banner (Instagram/Twitter 风格)
// 只包含:video bg + dark overlay + 右下角 video controls
// 信息 / 按钮 全部移到 ProfileHeader (下方 avatar overlap)
import CreatorHeroVideo from "./CreatorHeroVideo";

interface Props {
  cover: string;
  videoSrc?: string;
}

export default function CreatorHero({ cover, videoSrc }: Props) {
  return (
    <section className="cr-hero" aria-hidden>
      <div className="cr-hero-bg">
        <CreatorHeroVideo poster={cover} videoSrc={videoSrc} />
      </div>
      <div className="cr-hero-veil" />
    </section>
  );
}
