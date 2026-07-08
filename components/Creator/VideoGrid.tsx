"use client";
// 视频区 — Masonry waterfall;locked 走 LockedMediaCard,unlocked 走原样式
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import type { VideoItem } from "@/lib/creatorProfileMock";
import LockedMediaCard from "@/components/media/LockedMediaCard";

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

interface Props {
  videos: VideoItem[];
  creatorSlug: string;
  creatorName: string;
}

export default function VideoGrid({ videos, creatorSlug, creatorName }: Props) {
  const t = useTranslations("creatorProfile.videos");
  return (
    <div className="cr-videos">
      {videos.map((v) => (
        <div key={v.id} className="cr-video-card">
          {v.isLocked && v.price ? (
            <LockedMediaCard
              creatorSlug={creatorSlug}
              creatorName={creatorName}
              mediaId={v.id}
              type="video"
              price={v.price}
              thumbnail={v.cover}
              previewSrc={v.cover}
              aspect="16x9"
            />
          ) : (
            <div className="cr-video-cover">
              <Img src={v.cover} alt={v.title} sizes="(max-width: 768px) 50vw, 33vw" />
              <span className="cr-video-dur">{v.duration}</span>
              <span className="cr-video-play" aria-hidden>
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
          )}
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
