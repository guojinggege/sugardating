"use client";

// 语言切换器
// 切换策略:
// - 写 cookie NEXT_LOCALE,1 年有效
// - router.refresh() 让 server 段重新读 cookie + 重渲
// - 兜底也写 localStorage,cookie 被清时可由 RootLayout 用脚本读出来同步回 cookie
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

type Lang = "en" | "zh";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Lang;
  const t = useTranslations("languageSwitcher");
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Lang) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    try { localStorage.setItem("locale", next); } catch {}
    startTransition(() => router.refresh());
  };

  return (
    <div className="lang-switch" role="group" aria-label={t("label")} data-pending={pending || undefined}>
      <button
        type="button"
        className={"lang-btn" + (locale === "en" ? " on" : "")}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        disabled={pending}
      >
        EN
      </button>
      <span className="lang-sep" aria-hidden>·</span>
      <button
        type="button"
        className={"lang-btn" + (locale === "zh" ? " on" : "")}
        onClick={() => switchTo("zh")}
        aria-pressed={locale === "zh"}
        disabled={pending}
      >
        中文
      </button>
    </div>
  );
}
