"use client";
// Floating CTA — 右下角固定,滚动 > 600 显示
// 4 快捷:聊天 / 视频 / 预约 / 打赏
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function FloatingCTA() {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      setVisible(window.scrollY > 600);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  return (
    <div className={"cr-fab" + (visible ? " visible" : "")} aria-hidden={!visible}>
      <button type="button" onClick={guard(() => {})} className="cr-fab-btn cr-fab-primary" title={t("chat")}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>
      </button>
      <button type="button" onClick={guard(() => {})} className="cr-fab-btn" title={t("videoCall")}>
        <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
      </button>
      <button type="button" onClick={guard(() => {})} className="cr-fab-btn" title={t("bookDate")}>
        <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
      </button>
      <button type="button" onClick={guard(() => {})} className="cr-fab-btn cr-fab-tip" title={t("tip")}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>
      </button>
    </div>
  );
}
