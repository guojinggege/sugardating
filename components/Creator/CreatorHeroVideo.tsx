// Hero Cover Motion — 无 controls,cinematic 静态背景
// 3-tier priority (handled 由 caller / page.tsx):
//   1. Creator's own Cover Video (未来自上传)
//   2. AI Demo Video (当前统一使用)
//   3. Cover Image (fallback,通过 poster 属性)
// 8s+ loop,muted,autoplay,playsInline,object-cover
// 不出现:播放按钮 / 控制栏 / 时间轴 / 字幕 / Logo / 水印
interface Props {
  poster: string;
  videoSrc?: string;   // Creator's own OR AI demo (统一 mp4 URL)
}

export default function CreatorHeroVideo({ poster, videoSrc }: Props) {
  return (
    <video
      className="cr-hero-video"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      /* 视频加载失败:仅显示 poster (browser 默认行为,不 error UI) */
    >
      {videoSrc && <source src={videoSrc} type="video/mp4" />}
    </video>
  );
}
