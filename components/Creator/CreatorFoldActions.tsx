"use client";
// Hero Header 只保留 3 按钮:❤️ Follow · 🎁 Gift · 🔗 Share
// Follow · 真实持久化 · 挂载时拉取初始状态 · 点击调 API · 失败回滚
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

interface Props {
  creatorName: string;
  creatorSlug: string;
  creatorType?: "sugargirl" | "sugarboy" | "massage";
}

export default function CreatorFoldActions({ creatorName, creatorSlug, creatorType = "sugargirl" }: Props) {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  // null = 尚未从服务端确认 · 禁止显示 Follow / Following · 只显示 loading
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/user/following/status?creatorSlug=${encodeURIComponent(creatorSlug)}`, { credentials: "include", cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (!alive) return;
        setFollowing(d?.ok ? !!d.following : false);
      })
      .catch((e) => {
        if (!alive) return;
        setFollowing(false);
        if (process.env.NODE_ENV !== "production") console.warn("[follow.status]", e);
      });
    return () => { alive = false; };
  }, [creatorSlug]);

  async function onFollowClick() {
    if (!requireLogin()) return;
    if (busy || following === null) return;
    const wasFollowing = following;
    setBusy(true);
    setFollowing(!wasFollowing);  // optimistic
    try {
      const r = wasFollowing
        ? await fetch(`/api/user/following/${encodeURIComponent(creatorSlug)}`, { method: "DELETE", credentials: "include" })
        : await fetch("/api/user/following", {
            method: "POST", credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ creatorSlug, creatorType }),
          });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) {
        if (process.env.NODE_ENV !== "production") console.warn("[follow.click]", r.status, d);
        throw new Error(d?.message || `HTTP ${r.status}`);
      }
      setFollowing(!!d.following);
    } catch (e) {
      setFollowing(wasFollowing);
      if (process.env.NODE_ENV !== "production") console.warn("[follow.rollback]", e);
    } finally { setBusy(false); }
  }

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: creatorName, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
    }
  };

  const pill = "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full font-semibold text-[13px] leading-none font-ui cursor-pointer transition-all whitespace-nowrap";

  return (
    <div className="flex items-center gap-2 relative">
      <button
        type="button"
        onClick={onFollowClick}
        disabled={busy || following === null}
        aria-pressed={following === true}
        className={pill + " " + (following === null
          ? "bg-white text-[var(--muted)] border border-[var(--line2)] opacity-70 cursor-wait"
          : following
          ? "bg-[#e11d48] text-white border border-[#e11d48] hover:bg-[#be123c]"
          : "bg-white text-[var(--ink)] border border-[var(--line2)] hover:border-[var(--ink)] hover:-translate-y-px")}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill={following === true ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {following === null ? "…" : following ? t("following") : t("follow")}
      </button>

      <button
        type="button"
        onClick={() => requireLogin() && undefined}
        className={pill + " text-[#1a1409] border-0 hover:-translate-y-px font-bold shadow-[0_4px_14px_-4px_rgba(184,167,137,0.55)]"}
        style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
      >
        <span className="text-[14px]" aria-hidden>🎁</span>
        {t("tipShort")}
      </button>

      <button
        type="button"
        onClick={onShare}
        aria-label={t("share")}
        title={t("share")}
        className="grid place-items-center w-10 h-10 rounded-full bg-white border border-[var(--line2)] text-[var(--ink2)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-all cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.9]">
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
