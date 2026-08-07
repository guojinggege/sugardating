"use client";
// /apply 页面共享:任何 CTA 调用 openInterestDialog() 打开同一张表
// 用 Context · 避免 prop 层层传递
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import CreatorInterestForm from "./CreatorInterestForm";
import { useTranslations } from "next-intl";

type Source = "hero" | "inline" | "sticky" | "final";

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
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<Source>("inline");

  const openDialog = useCallback((s: Source = "inline") => {
    setSource(s);
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => setOpen(false), []);

  // Esc 关闭 · body scroll lock
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") closeDialog(); }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
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
            <CreatorInterestForm source={source} compact onSuccess={() => { /* close manually after user reads thanks */ }} />
          </div>
        </div>
      )}
    </InterestDialogCtx.Provider>
  );
}
