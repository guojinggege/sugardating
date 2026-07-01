"use client";
// Profile row 右侧 horizontal 按钮组 (Instagram/OF/Patreon 风格):
//   Primary  立即聊天
//   Secondary 视频 / 预约
//   Gradient 打赏 Ta
//   Outline 关注 / 收藏 / 分享
// 所有写操作走 requireLogin gate
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function CreatorQuickActions({ creatorName }: { creatorName: string }) {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: creatorName, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
    }
  };

  const btnBase = "inline-flex items-center justify-center gap-1.5 font-semibold text-[13.5px] leading-none rounded-[14px] transition-all whitespace-nowrap font-ui cursor-pointer";
  const iconBase = "grid place-items-center w-10 h-10 rounded-[14px] transition-all cursor-pointer border";

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
      {/* Primary — 立即聊天 */}
      <button
        type="button"
        onClick={guard(() => {})}
        className={btnBase + " h-11 px-5 bg-[var(--ink)] text-white border border-[var(--ink)] hover:bg-black hover:-translate-y-px shadow-[0_4px_14px_-6px_rgba(0,0,0,0.35)]"}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {t("chat")}
      </button>

      {/* Secondary — 视频 / 预约 */}
      <button
        type="button"
        onClick={guard(() => {})}
        className={btnBase + " h-10 px-4 bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px"}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
        {t("videoCall")}
      </button>
      <button
        type="button"
        onClick={guard(() => {})}
        className={btnBase + " h-10 px-4 bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px"}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        {t("bookDate")}
      </button>

      {/* Gradient Tip */}
      <button
        type="button"
        onClick={guard(() => {})}
        className={btnBase + " h-10 px-4 text-[#1a1409] border-0 hover:-translate-y-px font-bold shadow-[0_6px_18px_-4px_rgba(184,167,137,0.5)]"}
        style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {t("tip")}
      </button>

      {/* Ghost + icons */}
      <button
        type="button"
        onClick={guard(() => setFollowing((v) => !v))}
        className={btnBase + " h-10 px-4 border " + (following ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-transparent text-[var(--ink2)] border-transparent hover:bg-white hover:border-[var(--line)] hover:text-[var(--ink)]")}
      >
        {following ? (
          <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("following")}</>
        ) : (
          <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("follow")}</>
        )}
      </button>

      <button
        type="button"
        onClick={guard(() => setSaved((v) => !v))}
        aria-label={t("save")}
        className={iconBase + " " + (saved ? "text-[#e11d48] border-[#e11d48] bg-[rgba(225,29,72,0.08)]" : "bg-white text-[var(--ink2)] border-[var(--line2)] hover:border-[var(--ink)] hover:text-[var(--ink)]")}
      >
        <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onShare}
        aria-label={t("share")}
        className={iconBase + " bg-white text-[var(--ink2)] border-[var(--line2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}
      >
        <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] fill-none stroke-current stroke-[1.9]">
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
        </svg>
      </button>
      <button
        type="button"
        onClick={guard(() => {})}
        aria-label={t("report")}
        className={iconBase + " bg-white text-[var(--muted)] border-[var(--line2)] hover:border-[#e11d48] hover:text-[#e11d48]"}
      >
        <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] fill-none stroke-current stroke-[1.9]" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.86l-8.3 14.36A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.78L13.7 3.86a2 2 0 0 0-3.4 0z" /></svg>
      </button>

      {copied && (
        <div className="absolute -top-10 right-0 bg-[var(--ink)] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg">
          {t("linkCopied")}
        </div>
      )}
    </div>
  );
}
