"use client";
// Hero 右侧操作按钮 - 3 层 hierarchy:
//   Primary   立即聊天       → 视觉焦点,用户第一步注意力
//   Secondary 预约约会 / 视频聊天 → outlined,标准高度
//   Ghost     关注            → text-only,轻量
//   Icon-only 收藏 / 分享     → 40x40 icon 按钮
//
// 所有写操作走 requireLogin gate;分享不需要登录 (仅复制 URL)
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function CreatorActions({ creatorName }: { creatorName: string }) {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareMsg, setShareMsg] = useState(false);

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: creatorName, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg(true);
        setTimeout(() => setShareMsg(false), 1800);
      } catch {}
    }
  };

  return (
    <div className="cr-acts">
      {/* Primary — 立即聊天 (视觉焦点) */}
      <button type="button" onClick={guard(() => {})} className="cr-act cr-act-primary">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>
        {t("chat")}
      </button>

      {/* Secondary — 预约约会 / 视频聊天 */}
      <button type="button" onClick={guard(() => {})} className="cr-act cr-act-secondary">
        <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        {t("bookDate")}
      </button>
      <button type="button" onClick={guard(() => {})} className="cr-act cr-act-secondary">
        <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
        {t("videoCall")}
      </button>

      {/* Ghost — 关注 (text-style) */}
      <button
        type="button"
        onClick={guard(() => setFollowing((v) => !v))}
        className={"cr-act cr-act-ghost" + (following ? " on" : "")}
      >
        {following ? (
          <>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12l4 4 10-10" /></svg>
            {t("following")}
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
            {t("follow")}
          </>
        )}
      </button>

      {/* Icon-only — 收藏 / 分享 */}
      <button
        type="button"
        onClick={guard(() => setSaved((v) => !v))}
        aria-label={t("save")}
        title={t("save")}
        className={"cr-act cr-act-ic" + (saved ? " on" : "")}
      >
        <svg viewBox="0 0 24 24" aria-hidden fill={saved ? "currentColor" : "none"}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onShare}
        aria-label={t("share")}
        title={t("share")}
        className="cr-act cr-act-ic"
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
        </svg>
      </button>
      {shareMsg && <span className="cr-act-toast">{t("linkCopied")}</span>}
    </div>
  );
}
