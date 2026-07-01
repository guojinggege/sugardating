"use client";
// Hero Video 背景 — <video> element (poster-only 现在,src 后续接入真视频)
// 右下角 mute/play/fullscreen 控制条,视觉 affordance 已到位
import { useRef, useState } from "react";

interface Props {
  poster: string;
  videoSrc?: string;   // 后续接入
}

export default function CreatorHeroVideo({ poster, videoSrc }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  const enterFs = () => {
    const v = ref.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        className="cr-hero-video"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
      </video>
      <div className="cr-hero-video-ctl" aria-label="Video controls">
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="cr-hvc-btn">
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="cr-hvc-btn">
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 9v6h4l5 5V4L8 9zm11 3l4-4M19 12l-4-4M15 12l4 4M19 12l-4 4" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 9v6h4l5 5V4L8 9zm11-1a5 5 0 0 1 0 8m0-12a9 9 0 0 1 0 16" /></svg>
          )}
        </button>
        <button type="button" onClick={enterFs} aria-label="Fullscreen" className="cr-hvc-btn">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg>
        </button>
      </div>
    </>
  );
}
