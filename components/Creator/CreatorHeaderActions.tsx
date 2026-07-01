"use client";
// About Header 右侧 3 快捷操作:❤️ 关注 · 🎁 打赏 · 🔗 分享
// 小尺寸 pill,与 avatar/title 同一水平线 (Instagram Profile Header 风格)
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function CreatorHeaderActions({ creatorName }: { creatorName: string }) {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const [following, setFollowing] = useState(false);
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

  const pill = "inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full font-semibold text-[12.5px] leading-none font-ui cursor-pointer transition-all whitespace-nowrap";

  return (
    <div className="flex items-center gap-2 relative flex-shrink-0">
      {/* Follow */}
      <button
        type="button"
        onClick={guard(() => setFollowing((v) => !v))}
        className={pill + " " + (following
          ? "bg-[#e11d48] text-white border border-[#e11d48] hover:bg-[#be123c]"
          : "bg-[var(--page)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)] hover:-translate-y-px")}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={following ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {following ? t("following") : t("follow")}
      </button>

      {/* Tip (gradient primary) */}
      <button
        type="button"
        onClick={guard(() => {})}
        className={pill + " text-[#1a1409] border-0 hover:-translate-y-px font-bold shadow-[0_3px_10px_-3px_rgba(184,167,137,0.5)]"}
        style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
      >
        <span className="text-[13px]" aria-hidden>🎁</span>
        {t("tipShort")}
      </button>

      {/* Share (icon only) */}
      <button
        type="button"
        onClick={onShare}
        aria-label={t("share")}
        title={t("share")}
        className="grid place-items-center w-9 h-9 rounded-full bg-[var(--page)] border border-[var(--line)] text-[var(--ink2)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-all cursor-pointer flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-none stroke-current stroke-[1.9]">
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
        </svg>
      </button>

      {copied && (
        <span className="absolute -top-9 right-0 bg-[var(--ink)] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-semibold shadow-lg whitespace-nowrap">
          {t("linkCopied")}
        </span>
      )}
    </div>
  );
}
