"use client";
// Sidebar Video Preview Card — Creator video 名片 + 3 CTA (聊天 / 打赏 / 预约)
// spec §四: 9:16 竖版 · full-width · radius 24 · overflow hidden · autoplay/muted/loop
// spec §五: 半透明控制按钮 (mute + fullscreen),不做完整播放器
// spec §六: 底部 gradient overlay + Creator 名/年龄/城市/在线
// spec §七-八: 3 CTA 复用现有 useRequireLogin guard (chat / gift / book)
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";

// 中文文件名需 encodeURI (Vercel edge / 部分 CDN 对非 ASCII URL 支持不一致)
const VIDEO_SRC = encodeURI("/videos/侧边demo.mp4");

interface Props {
  creator: Creator;
  age?: number;
  online?: boolean;
  poster?: string;   // fallback 视频加载失败时显示
}

function IcMute() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M22 9l-6 6M16 9l6 6" />
    </svg>
  );
}
function IcSound() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
function IcFull() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

export default function CreatorSidebarVideoCard({ creator, age, online = true, poster }: Props) {
  const tA = useTranslations("creatorProfile.actions");
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const requireLogin = useRequireLogin();
  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const enterFullscreen = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    const anyV = v as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const req = v.requestFullscreen ?? anyV.webkitRequestFullscreen ?? anyV.webkitEnterFullscreen;
    try { req?.call(v); } catch {}
    v.play?.().catch(() => {});
  };

  return (
    <div>
      {/* Video — 9:16 vertical · full-width · radius 24 */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden bg-black shadow-[0_18px_44px_-22px_rgba(0,0,0,0.4)]"
        style={{ aspectRatio: "9 / 16" }}
      >
        <video
          ref={ref}
          src={VIDEO_SRC}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onClick={enterFullscreen}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          aria-label={`${creator.name} — video preview`}
        />

        {/* Top-right controls (mute + fullscreen) */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="w-9 h-9 grid place-items-center rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/50 transition"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <IcMute /> : <IcSound />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); enterFullscreen(); }}
            className="w-9 h-9 grid place-items-center rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/50 transition"
            aria-label="Fullscreen"
          >
            <IcFull />
          </button>
        </div>

        {/* Bottom gradient + Creator info */}
        <div className="absolute inset-x-0 bottom-0 pt-14 pb-4 px-4 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.2) 60%, transparent)" }}
            aria-hidden
          />
          <div className="relative">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white text-[15px] font-bold leading-tight">{creator.name}</span>
              {online && (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-white bg-emerald-500/85 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: "0 0 4px #fff" }} />
                  Online
                </span>
              )}
            </div>
            <div className="text-white/85 text-[12px] mt-1 font-medium">
              {age ? `${age} · ` : ""}{creator.region}
            </div>
          </div>
        </div>
      </div>

      {/* CTA row — 聊天(primary) · 打赏(gold) · 预约(outline) */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          type="button"
          onClick={guard(() => {})}
          className="h-11 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-black transition"
        >
          {tA("chatShort")}
        </button>
        <button
          type="button"
          onClick={guard(() => {})}
          className="h-11 rounded-full text-[#1a1409] text-[13px] font-bold hover:opacity-95 transition"
          style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
        >
          {tA("tipShort")}
        </button>
        <button
          type="button"
          onClick={guard(() => {})}
          className="h-11 rounded-full bg-white border border-[var(--line2)] text-[var(--ink)] text-[13px] font-semibold hover:border-[var(--ink)] transition"
        >
          {tA("bookShort")}
        </button>
      </div>
    </div>
  );
}
