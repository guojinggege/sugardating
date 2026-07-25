"use client";
// 移动端固定底部 CTA bar (仅 <640 显示,fixed bottom)
// 布局:关注 icon / 收藏 icon / 预约 secondary / 立即聊天 primary
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import { useChat } from "@/components/chat/ChatProvider";

interface Props {
  creatorSlug: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorType?: "sugargirl" | "sugarboy" | "massage";
}

export default function MobileCTABar({ creatorSlug, creatorName, creatorAvatar, creatorType = "sugargirl" }: Props) {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const { openChatWith } = useChat();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/user/following/status?creatorSlug=${encodeURIComponent(creatorSlug)}`, { credentials: "include", cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (alive) setFollowing(d?.ok ? !!d.following : false); })
      .catch(() => { if (alive) setFollowing(false); });
    return () => { alive = false; };
  }, [creatorSlug]);

  async function onFollowClick() {
    if (!requireLogin()) return;
    if (busy || following === null) return;
    const was = following;
    setBusy(true);
    setFollowing(!was);
    try {
      const r = was
        ? await fetch(`/api/user/following/${encodeURIComponent(creatorSlug)}`, { method: "DELETE", credentials: "include" })
        : await fetch("/api/user/following", {
            method: "POST", credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ creatorSlug, creatorType }),
          });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message);
      setFollowing(!!d.following);
    } catch { setFollowing(was); }
    finally { setBusy(false); }
  }

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };
  const openChat = () => openChatWith({ slug: creatorSlug, name: creatorName, avatar: creatorAvatar, languages: ["zh", "en"] });

  return (
    <div className="cr-mcta">
      <button
        type="button"
        aria-label={t("follow")}
        onClick={onFollowClick}
        disabled={busy || following === null}
        aria-pressed={following === true}
        className={"cr-mcta-ic" + (following === true ? " on" : "")}
      >
        {following === true ? (
          <svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg>
        ) : (
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
        )}
      </button>
      <button
        type="button"
        aria-label={t("save")}
        onClick={guard(() => setSaved((v) => !v))}
        className={"cr-mcta-ic" + (saved ? " on" : "")}
      >
        <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
        </svg>
      </button>
      <button type="button" onClick={guard(() => {})} className="cr-mcta-secondary">
        {t("bookDate")}
      </button>
      <button type="button" onClick={openChat} className="cr-mcta-primary">
        {t("chat")}
      </button>
    </div>
  );
}
