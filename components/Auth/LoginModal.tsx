"use client";
// 全局 Login Modal — 在 RootLayout 内统一挂载
// 由任何 requireLogin() 调用触发 (通过 AuthProvider 的 modalOpen 状态)
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "./AuthProvider";

export default function LoginModal() {
  const t = useTranslations("auth.modal");
  const { modalOpen, closeLoginModal, login } = useAuth();

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLoginModal(); };
    document.addEventListener("keydown", onKey);
    // 锁滚动
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalOpen, closeLoginModal]);

  if (!modalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeLoginModal} role="dialog" aria-modal="true" aria-label={t("title")}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal-x"
          onClick={closeLoginModal}
          aria-label={t("close")}
        >
          ×
        </button>

        <div className="auth-modal-h">
          <div className="auth-modal-ic">
            <svg viewBox="0 0 24 24" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>{t("title")}</h3>
          <p>{t("desc")}</p>
        </div>

        <div className="auth-modal-acts">
          <button type="button" className="btn btn-ink auth-modal-primary" onClick={() => login({ name: "Demo" })}>
            {t("login")}
          </button>
          <button type="button" className="btn btn-out auth-modal-secondary" onClick={() => login({ name: "Demo" })}>
            {t("register")}
          </button>
        </div>

        <button type="button" className="auth-modal-cancel" onClick={closeLoginModal}>
          {t("close")}
        </button>

        <p className="auth-modal-note">{t("note")}</p>
      </div>
    </div>
  );
}
