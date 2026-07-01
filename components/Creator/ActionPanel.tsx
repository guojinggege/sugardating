"use client";
// Hero 右侧 5-col Floating Glass Card
// Status block (Online/Reply/Rate/Next/Timezone) → CTA hierarchy → Gift row → Ghost row
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

interface StatusData {
  isOnline: boolean;
  lastActiveText: string;
  responseRate: number;
  replyMinutes: number;
  nextAvailableText: string;
  timezone: string;
}

interface Props {
  creatorName: string;
  status?: StatusData;
}

export default function ActionPanel({ creatorName, status }: Props) {
  const t = useTranslations("creatorProfile.actions");
  const tG = useTranslations("creatorProfile.gifts");
  const tS = useTranslations("creatorProfile.status");
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

  return (
    <aside className="cr-ap" aria-label="Actions">
      {/* Status block — 顶部信任信号 */}
      {status && (
        <div className="cr-ap-status">
          <div className="cr-ap-status-row cr-ap-status-online">
            {status.isOnline ? (
              <>
                <span className="cr-ap-dot cr-ap-dot-on" aria-hidden><span /></span>
                <b>{tS("onlineNow")}</b>
              </>
            ) : (
              <>
                <span className="cr-ap-dot" aria-hidden />
                <b>{tS("lastActive")} {status.lastActiveText}</b>
              </>
            )}
          </div>
          <div className="cr-ap-status-grid">
            <div className="cr-ap-status-item"><span>{tS("replyRate")}</span><b>{status.responseRate}%</b></div>
            <div className="cr-ap-status-item"><span>{tS("avgReply")}</span><b>{status.replyMinutes < 60 ? `${status.replyMinutes}m` : `<${Math.round(status.replyMinutes/60)}h`}</b></div>
            <div className="cr-ap-status-item"><span>{tS("nextAvailable")}</span><b>{status.nextAvailableText}</b></div>
            <div className="cr-ap-status-item"><span>{tS("timezone")}</span><b>{status.timezone}</b></div>
          </div>
        </div>
      )}

      {/* Primary CTA — 立即聊天 */}
      <button type="button" onClick={guard(() => {})} className="cr-ap-btn cr-ap-primary">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>
        {t("chat")}
      </button>

      {/* Secondary CTAs — 视频 + 预约 */}
      <div className="cr-ap-row">
        <button type="button" onClick={guard(() => {})} className="cr-ap-btn cr-ap-secondary">
          <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
          {t("videoCall")}
        </button>
        <button type="button" onClick={guard(() => {})} className="cr-ap-btn cr-ap-secondary">
          <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
          {t("bookDate")}
        </button>
      </div>

      {/* Gradient Tip CTA */}
      <button type="button" onClick={guard(() => {})} className="cr-ap-btn cr-ap-tip">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>
        {t("tip")}
      </button>

      {/* Gift row — mini 4 gifts + Send */}
      <div className="cr-ap-gifts">
        <span className="cr-ap-gifts-h">{tG("quick")}</span>
        <div className="cr-ap-gift-row">
          {[
            { k: "rose", e: "🌹" },
            { k: "coffee", e: "☕" },
            { k: "dinner", e: "🍽️" },
            { k: "diamond", e: "💎" },
          ].map((g) => (
            <button key={g.k} type="button" onClick={guard(() => {})} className="cr-ap-gift" title={tG(`items.${g.k}`)}>
              <span aria-hidden>{g.e}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ghost / icon row — follow / save / share / report */}
      <div className="cr-ap-ghost-row">
        <button
          type="button"
          onClick={guard(() => setFollowing((v) => !v))}
          className={"cr-ap-ghost" + (following ? " on" : "")}
        >
          {following ? (
            <><svg viewBox="0 0 24 24" aria-hidden><path d="M5 12l4 4 10-10" /></svg>{t("following")}</>
          ) : (
            <><svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14" /></svg>{t("follow")}</>
          )}
        </button>
        <button
          type="button"
          onClick={guard(() => setSaved((v) => !v))}
          aria-label={t("save")}
          className={"cr-ap-icon" + (saved ? " on" : "")}
        >
          <svg viewBox="0 0 24 24" aria-hidden fill={saved ? "currentColor" : "none"}>
            <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
          </svg>
        </button>
        <button type="button" onClick={onShare} aria-label={t("share")} className="cr-ap-icon">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
            <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
          </svg>
        </button>
        <button type="button" onClick={guard(() => {})} aria-label={t("report")} className="cr-ap-icon cr-ap-icon-warn">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M12 9v4M12 17h.01M10.3 3.86l-8.3 14.36A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.78L13.7 3.86a2 2 0 0 0-3.4 0z" /></svg>
        </button>
      </div>
      {copied && <div className="cr-ap-toast">{t("linkCopied")}</div>}
    </aside>
  );
}
