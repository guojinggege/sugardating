"use client";
// Sugargirl V3 QuickActions — 位于 About Header (原 Hero 右侧移除)
// 按钮顺序 (per spec V3):聊天 · 视频 · 私拍 · 预约伴游 · 打赏 · 关注 · 收藏 · 分享
// 短标签 + 紧凑布局,与 Verification chips 同行
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

  // 紧凑按钮基类 — 短标签用
  const cta = "inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[12px] font-semibold text-[12.5px] leading-none font-ui cursor-pointer transition-all whitespace-nowrap";
  const iconOnly = "grid place-items-center w-9 h-9 rounded-[12px] font-ui cursor-pointer transition-all border";

  return (
    <div className="flex flex-wrap items-center gap-1.5 relative">
      {/* Primary — 聊天 */}
      <button type="button" onClick={guard(() => {})} className={cta + " bg-[var(--ink)] text-white border border-[var(--ink)] hover:bg-black hover:-translate-y-px shadow-[0_3px_10px_-4px_rgba(0,0,0,0.35)]"}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {t("chatShort")}
      </button>
      {/* Secondary — 视频 */}
      <button type="button" onClick={guard(() => {})} className={cta + " bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px"}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
        {t("videoShort")}
      </button>
      {/* Secondary — 私拍 */}
      <button type="button" onClick={guard(() => {})} className={cta + " bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px"}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><rect x="3" y="7" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.5" /><path d="M8 7l2-3h4l2 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {t("privateShoot")}
      </button>
      {/* Secondary — 预约伴游 */}
      <button type="button" onClick={guard(() => {})} className={cta + " bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px"}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12l8-3 4 4 6-7 2 2-7 9-4-4z" /></svg>
        {t("bookTravel")}
      </button>
      {/* Gradient — 打赏 */}
      <button
        type="button"
        onClick={guard(() => {})}
        className={cta + " text-[#1a1409] border-0 hover:-translate-y-px font-bold shadow-[0_4px_12px_-3px_rgba(184,167,137,0.5)]"}
        style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {t("tipShort")}
      </button>

      {/* Ghost — 关注 */}
      <button
        type="button"
        onClick={guard(() => setFollowing((v) => !v))}
        className={cta + " border " + (following ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-transparent text-[var(--ink2)] border-transparent hover:bg-white hover:border-[var(--line)] hover:text-[var(--ink)]")}
      >
        {following ? (
          <><svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("following")}</>
        ) : (
          <><svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.9]"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("follow")}</>
        )}
      </button>

      {/* Icon-only — 收藏 · 分享 */}
      <button
        type="button"
        onClick={guard(() => setSaved((v) => !v))}
        aria-label={t("save")}
        title={t("save")}
        className={iconOnly + " " + (saved ? "text-[#e11d48] border-[#e11d48] bg-[rgba(225,29,72,0.08)]" : "bg-white text-[var(--ink2)] border-[var(--line2)] hover:border-[var(--ink)] hover:text-[var(--ink)]")}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onShare}
        aria-label={t("share")}
        title={t("share")}
        className={iconOnly + " bg-white text-[var(--ink2)] border-[var(--line2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]">
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
        </svg>
      </button>

      {copied && (
        <div className="absolute -top-9 right-0 bg-[var(--ink)] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg z-10">
          {t("linkCopied")}
        </div>
      )}
    </div>
  );
}
