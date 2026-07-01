"use client";
// Hero Cover Motion — 无 controls,cinematic 静态背景 · 点击视频 → 全屏播放
// 3-tier priority (由 caller / page.tsx 处理):
//   1. Creator's own Cover Video (未来自上传)
//   2. Hero Demo Video (当前统一使用 /videos/hero.mp4)
//   3. Cover Image (fallback,通过 poster 属性;视频加载失败自动展示)
// 8s+ loop,muted,autoplay,playsInline,object-cover
// 不出现:播放按钮 / 控制栏 / 时间轴 / 字幕 / Logo / 水印
// 点击视频:unmute + 请求全屏 (原生 fullscreen UI,含退出按钮)
import { useRef } from "react";

interface Props {
  poster: string;
  videoSrc?: string;
}

export default function CreatorHeroVideo({ poster, videoSrc }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    // iOS 用 webkitEnterFullscreen,桌面用 requestFullscreen
    const anyV = v as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const req =
      v.requestFullscreen ??
      anyV.webkitRequestFullscreen ??
      anyV.webkitEnterFullscreen;
    try { req?.call(v); } catch {}
    v.play?.().catch(() => {});
  };

  return (
    <video
      ref={ref}
      className="cr-hero-video"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onClick={handleClick}
      aria-label="点击全屏播放"
      style={{ cursor: "pointer" }}
    >
      {videoSrc && <source src={videoSrc} type="video/mp4" />}
    </video>
  );
}
