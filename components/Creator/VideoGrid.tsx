// 视频区 — Masonry waterfall (CSS columns,无 JS)
// hover 显示居中播放按钮
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { VideoItem } from "@/lib/creatorProfileMock";

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default async function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const t = await getTranslations("creatorProfile.videos");
  return (
    <div className="cr-videos">
      {videos.map((v) => (
        <div key={v.id} className="cr-video-card">
          <div className="cr-video-cover">
            <Img src={v.cover} alt={v.title} sizes="(max-width: 768px) 50vw, 33vw" />
            <span className="cr-video-dur">{v.duration}</span>
            <span className="cr-video-play" aria-hidden>
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </div>
          <div className="cr-video-info">
            <h4 className="cr-video-title">{v.title}</h4>
            <div className="cr-video-meta">
              <span>{fmtViews(v.views)} {t("views")}</span>
              <span>·</span>
              <span>{v.daysAgo} {t("daysAgo")}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
