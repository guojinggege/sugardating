"use client";
// Sidebar Video Card — 竖版视频 + 视频底部 Floating CTA + 下方 Online Status 信息
// spec §四: 9:16 · full-width · radius 24 · overflow hidden · autoplay muted loop
// spec §四(CTA over video): 聊天 / 打赏 / 预约 覆盖在视频底部,glass 半透明
// spec §六: 视频下方保留 最近活跃 / 下次可预约 / 时区 (合并原 Online Status)
// spec §七: 复用现有 useRequireLogin handler
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";
import type { AvailabilityData } from "@/lib/creatorProfileMock";

// 视频文件名已 rename 到 ASCII (Vercel edge / 部分 CDN 对非 ASCII URL 处理不稳);
// 原始文件保留于 git 历史(97537a2 → 97537a2 前),运营素材依然是同一段
const VIDEO_SRC = "/videos/sidebar-demo.mp4";

interface Props {
  creator: Creator;
  availability: AvailabilityData;
  timezone?: string;
  nextAvailable?: string;
  poster?: string;
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

export default function CreatorSidebarVideoCard({
  creator, availability, timezone = "GMT+8", nextAvailable = "今天", poster,
}: Props) {
  const tA = useTranslations("creatorProfile.actions");
  const tS = useTranslations("creatorProfile.status");
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

  const replyValue = availability.replyMinutes < 60
    ? `${availability.replyMinutes} 分钟`
    : `< ${Math.round(availability.replyMinutes / 60)} 小时`;

  return (
    <div>
      {/* ── Video 区域 (9:16 竖版,radius 24) ── */}
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

        {/* 顶右轻量控制:mute + fullscreen (半透明毛玻璃圆按钮) */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="w-9 h-9 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <IcMute /> : <IcSound />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); enterFullscreen(); }}
            className="w-9 h-9 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
            aria-label="Fullscreen"
          >
            <IcFull />
          </button>
        </div>

        {/* 底部渐变遮罩 — 保证 CTA 在视频上可读 */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.28) 55%, transparent)" }}
          aria-hidden
        />

        {/* Floating CTA Bar — 覆盖在视频底部 (spec §四) */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-20">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); guard(() => {})(); }}
              className="h-11 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-black transition shadow-[0_6px_18px_-4px_rgba(0,0,0,0.4)]"
            >
              {tA("chatShort")}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); guard(() => {})(); }}
              className="h-11 rounded-full text-[#1a1409] text-[13px] font-bold hover:opacity-95 transition shadow-[0_6px_18px_-4px_rgba(0,0,0,0.4)]"
              style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
            >
              {tA("tipShort")}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); guard(() => {})(); }}
              className="h-11 rounded-full text-[#111] text-[13px] font-semibold transition hover:bg-white shadow-[0_6px_18px_-4px_rgba(0,0,0,0.4)]"
              style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            >
              {tA("bookShort")}
            </button>
          </div>
        </div>
      </div>

      {/* ── 信息区域 (合并原 Online Status widget) ── */}
      <div className="cr-sb-card mt-3">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[var(--muted)]">{tS("onlineNow")}</span>
            {availability.isOnline ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#16a34a]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
                {tS("onlineNow")}
              </span>
            ) : (
              <span className="font-semibold text-[var(--ink)]">{availability.lastActiveText}</span>
            )}
          </div>
          <Row label={tS("lastActive")}    value={availability.lastActiveText} />
          <Row label={tS("replyRate")}     value={`${availability.responseRate}%`} />
          <Row label={tS("avgReply")}      value={replyValue} />
          <Row label={tS("nextAvailable")} value={nextAvailable} />
          <Row label={tS("timezone")}      value={timezone} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-[var(--muted)]">{label}</span>
      <b className="text-[13px] font-bold text-[var(--ink)] tabular-nums">{value}</b>
    </div>
  );
}
