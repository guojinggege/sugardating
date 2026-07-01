"use client";
// 移动端固定底部 CTA bar (仅 <640 显示,fixed bottom)
// 布局:关注 icon / 收藏 icon / 预约 secondary / 立即聊天 primary
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function MobileCTABar() {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  return (
    <div className="cr-mcta">
      <button
        type="button"
        aria-label={t("follow")}
        onClick={guard(() => setFollowing((v) => !v))}
        className={"cr-mcta-ic" + (following ? " on" : "")}
      >
        {following ? (
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
      <button type="button" onClick={guard(() => {})} className="cr-mcta-primary">
        {t("chat")}
      </button>
    </div>
  );
}
