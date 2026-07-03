"use client";
// App-like Bottom Navigation — mobile only (< md)
// Fixed bottom · safe-area-inset · glass bg · active route highlight
// 5 items: 首页 / 动态 / Sugargirl / 社区 / 我的
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth, useRequireLogin } from "@/components/Auth/AuthProvider";

interface Item {
  href: string;
  labelKey: string;
  fallback: string;
  match: (p: string) => boolean;
  icon: React.ReactNode;
  requireAuth?: boolean;
}

// sg / me 用 fill silhouette 避免 outline head 圈在小尺寸下呈"漂浮黑点"
const Ic = {
  home: <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />,
  feed: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>,
  sg:   <path fill="currentColor" stroke="none" d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c4.4 0 8 2.3 8 5v3H4v-3c0-2.7 3.6-5 8-5z" />,
  com:  <path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" />,
  me:   <path fill="currentColor" stroke="none" d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c4.4 0 8 2.3 8 5v3H4v-3c0-2.7 3.6-5 8-5z" />,
};

export default function BottomNav() {
  const pathname = usePathname() || "/";
  const t = useTranslations("nav.bottom");
  const { user } = useAuth();
  const requireLogin = useRequireLogin();

  const items: Item[] = [
    { href: "/",             labelKey: "home",       fallback: "首页",       icon: Ic.home, match: (p) => p === "/" },
    { href: "/photography",  labelKey: "discover",   fallback: "发现",       icon: Ic.feed, match: (p) => p.startsWith("/photography") },
    { href: "/creators",     labelKey: "sugargirl",  fallback: "Sugargirl", icon: Ic.sg,   match: (p) => p.startsWith("/creators") },
    { href: "/community",    labelKey: "community",  fallback: "社区",       icon: Ic.com,  match: (p) => p.startsWith("/community") },
    { href: user ? "/me" : "/login", labelKey: "me", fallback: "我的",       icon: Ic.me,   match: (p) => p === "/me" || p === "/login", requireAuth: !user },
  ];

  // 若 i18n 缺 key,next-intl 返回 "nav.bottom.xxx" 原样;检测后 fallback 到中文默认
  const label = (k: string, fallback: string) => {
    const v = t(k);
    return v && !v.includes(".") ? v : fallback;
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        borderColor: "var(--line)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Bottom Navigation"
    >
      <ul className="flex items-stretch justify-around h-[64px]">
        {items.map((it) => {
          const active = it.match(pathname);
          const inner = (
            <span className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
              <span className={`text-[10.5px] leading-none ${active ? "font-bold" : "font-medium"}`}>
                {label(it.labelKey, it.fallback)}
              </span>
              {/* Active 状态用 bold + ink 色区分,无 indicator bar */}
            </span>
          );
          return (
            <li key={it.href} className="flex-1 min-w-0 relative">
              {it.requireAuth ? (
                <button
                  type="button"
                  onClick={() => requireLogin()}
                  className="w-full h-full block"
                  aria-label={label(it.labelKey, it.fallback)}
                >
                  {inner}
                </button>
              ) : (
                <Link href={it.href} className="w-full h-full block" aria-label={label(it.labelKey, it.fallback)}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
