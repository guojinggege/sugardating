"use client";

// Language Switcher
// 默认: 仅地球图标按钮
// hover (桌面) / 点击 (移动) 展开 Dropdown 显示 English + 中文
// 切换写 cookie + localStorage,router.refresh() 无刷新即时切
// 当前语言条目右侧打 ✓
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

type Lang = "en" | "zh";

const LANGS: { code: Lang; key: "english" | "chinese" }[] = [
  { code: "en", key: "english" },
  { code: "zh", key: "chinese" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Lang;
  const t = useTranslations("languageSwitcher");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 桌面 hover 自动展开,留 160ms 给鼠标从 trigger → pop 转移
  const onEnter = () => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpen(true);
  };
  const onLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };
  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const switchTo = (next: Lang) => {
    setOpen(false);
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    try { localStorage.setItem("locale", next); } catch {}
    startTransition(() => router.refresh());
  };

  return (
    <div
      className="lang-dd"
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className="lang-trigger"
        aria-label={t("label")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      </button>
      {open && (
        <div className="lang-pop" role="menu">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitem"
              className={"lang-opt" + (locale === l.code ? " on" : "")}
              aria-current={locale === l.code ? "true" : undefined}
              onClick={() => switchTo(l.code)}
            >
              <span>{t(l.key)}</span>
              {locale === l.code && (
                <svg className="lang-check" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 12l4 4 10-10" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
