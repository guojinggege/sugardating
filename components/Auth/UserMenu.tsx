"use client";
// 已登录态 Nav 头像下拉:个人中心 / 消息 / 通知 / 退出登录
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const t = useTranslations("auth.menu");
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={wrap} className="user-menu">
      <button
        type="button"
        className="user-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("openMenu")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="user-avatar" aria-hidden>{user.avatarChar}</span>
      </button>
      {open && (
        <div className="user-pop" role="menu">
          <div className="user-pop-h">
            <span className="user-pop-avatar" aria-hidden>{user.avatarChar}</span>
            <div>
              <div className="user-pop-name">{user.name}</div>
              <div className="user-pop-sub">{t("loggedIn")}</div>
            </div>
          </div>
          <div className="user-pop-divider" />
          <Link href="#" role="menuitem" className="user-pop-item" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
            {t("profile")}
          </Link>
          <Link href="#" role="menuitem" className="user-pop-item" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>
            {t("messages")}
          </Link>
          <Link href="#" role="menuitem" className="user-pop-item" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
            {t("notifications")}
          </Link>
          <div className="user-pop-divider" />
          <button type="button" role="menuitem" className="user-pop-item user-pop-logout" onClick={() => { logout(); setOpen(false); }}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
