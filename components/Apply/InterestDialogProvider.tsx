"use client";
// /apply 页面共享:任何 CTA 调用 openDialog(source) 打开同一张表
// 桌面 · Dialog · 中央卡片
// 移动 · Drawer · 底部近全屏
// 自动 open · URL 带 ?apply=1 或 hash #apply-interest-form
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import CreatorInterestForm from "./CreatorInterestForm";

type Source =
  | "inline_form" | "header_apply" | "hero_apply"
  | "floating_primary" | "floating_secondary"
  | "onboarding_cta" | "footer_apply" | "mobile_menu_apply";

interface Ctx {
  open: boolean;
  source: Source;
  openDialog: (source?: Source) => void;
  closeDialog: () => void;
}

const InterestDialogCtx = createContext<Ctx | null>(null);
export function useInterestDialog(): Ctx {
  const v = useContext(InterestDialogCtx);
  if (!v) throw new Error("useInterestDialog must be inside <InterestDialogProvider>");
  return v;
}

export default function InterestDialogProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("apply.interest");
  const router = useRouter();
  const pathname = usePathname() || "";
  const search = useSearchParams();

  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<Source>("inline_form");
  const [autoOpenedOnce, setAutoOpenedOnce] = useState(false);

  const openDialog = useCallback((s: Source = "inline_form") => {
    setSource(s);
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
    // 清理 URL 中的 ?apply=1(不影响其它 query)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("apply") === "1") {
        url.searchParams.delete("apply");
        window.history.replaceState({}, "", url.toString() || pathname);
      }
    }
  }, [pathname]);

  // URL ?apply=1 或 #apply-interest-form → 首次进页自动打开
  useEffect(() => {
    if (autoOpenedOnce) return;
    if (typeof window === "undefined") return;
    const apply = search?.get("apply");
    const hash = window.location.hash;
    if (apply === "1" || hash === "#apply-interest-form-modal") {
      setSource("header_apply");
      setOpen(true);
      setAutoOpenedOnce(true);
    }
  }, [search, autoOpenedOnce]);

  // Esc · body scroll lock · restore focus
  useEffect(() => {
    if (!open) return;
    const activeBefore = document.activeElement as HTMLElement | null;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") closeDialog(); }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-apply-dialog");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove("has-apply-dialog");
      activeBefore?.focus?.();
    };
  }, [open, closeDialog]);

  return (
    <InterestDialogCtx.Provider value={{ open, source, openDialog, closeDialog }}>
      {children}
      {open && (
        <div className="cif-scrim" onClick={closeDialog} role="dialog" aria-modal="true" aria-labelledby="cif-dlg-title">
          <div className="cif-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="cif-close" onClick={closeDialog} aria-label={t("close")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="cif-dlg-head">
              <div className="cif-eye">JOIN SUGARDATING</div>
              <h2 id="cif-dlg-title">{t("dialogTitle")}</h2>
              <p>{t("dialogDesc")}</p>
            </div>
            <CreatorInterestForm source={source} compact />
          </div>
        </div>
      )}
    </InterestDialogCtx.Provider>
  );
}
