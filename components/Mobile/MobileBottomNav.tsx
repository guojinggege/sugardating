"use client";
// Bottom nav for /m/* routes — 5 tabs 直连 /m/* URLs (无 middleware 重定向环节)
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth, useRequireLogin } from "@/components/Auth/AuthProvider";

// sg / me 用 fill silhouette 避免 outline head 圈在小尺寸下呈"漂浮黑点"
const Ic = {
  home: <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />,
  msg:  <path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" />,
  sg:   <path fill="currentColor" stroke="none" d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c4.4 0 8 2.3 8 5v3H4v-3c0-2.7 3.6-5 8-5z" />,
  com:  <><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9" r="2.7" /><path d="M3 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20M15 15h2a4 4 0 0 1 4 4v1" /></>,
  me:   <path fill="currentColor" stroke="none" d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c4.4 0 8 2.3 8 5v3H4v-3c0-2.7 3.6-5 8-5z" />,
};

export default function MobileBottomNav() {
  const pathname = usePathname() || "/m";
  const t = useTranslations("nav.bottom");
  const { user } = useAuth();
  const requireLogin = useRequireLogin();

  // 私信 · 无 /m/messages 独立路由 · 直接跳 /messages
  // /messages 页面内置未登录 gate 提示登录 · 不在 nav 层做 auth
  const items = [
    { href: "/m",              labelKey: "home",       fallback: "首页",       icon: Ic.home, match: (p: string) => p === "/m" },
    { href: "/messages",       labelKey: "messages",   fallback: "私信",       icon: Ic.msg,  match: (p: string) => p === "/messages" || p.startsWith("/messages") },
    { href: "/m/creators",     labelKey: "sugargirl",  fallback: "Sugargirl", icon: Ic.sg,   match: (p: string) => p.startsWith("/m/creators") },
    { href: "/m/community",    labelKey: "community",  fallback: "社区",       icon: Ic.com,  match: (p: string) => p.startsWith("/m/community") },
    { href: user ? "/m/me" : "/m/login", labelKey: "me", fallback: "我的",   icon: Ic.me,   match: (p: string) => p === "/m/me" || p === "/m/login", requireAuth: !user },
  ];

  const label = (k: string, fb: string) => {
    const v = t(k);
    return v && !v.includes(".") ? v : fb;
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        borderColor: "var(--line)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Bottom Navigation"
    >
      <ul className="list-none m-0 p-0 flex items-stretch justify-around h-16">
        {items.map((it) => {
          const active = it.match(pathname);
          const inner = (
            <span className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
              <span className={`text-[10.5px] leading-none ${active ? "font-bold" : "font-medium"}`}>
                {label(it.labelKey, it.fallback)}
              </span>
              {/* Active 状态用 bold + ink 色区分,无 indicator bar (spec: 简洁高级) */}
            </span>
          );
          return (
            <li key={it.href} className="flex-1 min-w-0">
              {it.requireAuth ? (
                <button type="button" onClick={() => requireLogin()} className="w-full h-full block">{inner}</button>
              ) : (
                <Link href={it.href} className="w-full h-full block">{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
