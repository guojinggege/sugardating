"use client";
// Watch My Story — 按钮 + fullscreen 视频 modal
// 现无真视频文件,modal 显示 poster + "视频预览即将上线" 占位
// 真视频接入时:在 <video> 加 <source src> 即可
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  poster: string;
  creatorName: string;
  videoSrc?: string;
}

export default function WatchStoryButton({ poster, creatorName, videoSrc }: Props) {
  const t = useTranslations("creatorProfile.watchStory");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="cr-ws-trigger">
        <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none" /></svg>
        {t("cta")}
      </button>

      {open && (
        <div className="cr-ws-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button type="button" className="cr-ws-close" aria-label={t("close")} onClick={() => setOpen(false)}>×</button>
          <div className="cr-ws-frame" onClick={(e) => e.stopPropagation()}>
            {videoSrc ? (
              <video src={videoSrc} poster={poster} controls autoPlay className="cr-ws-video" />
            ) : (
              <>
                <Image src={poster} alt={creatorName} fill sizes="90vw" className="object-cover" priority />
                <div className="cr-ws-placeholder">
                  <div className="cr-ws-play-big" aria-hidden>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <p>{t("comingSoon")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
