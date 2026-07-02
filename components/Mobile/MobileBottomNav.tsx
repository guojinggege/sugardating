"use client";
// Bottom nav for /m/* routes — 5 tabs 直连 /m/* URLs (无 middleware 重定向环节)
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth, useRequireLogin } from "@/components/Auth/AuthProvider";

const Ic = {
  home: <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />,
  feed: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>,
  sg:   <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>,
  com:  <path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" />,
  me:   <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>,
};

export default function MobileBottomNav() {
  const pathname = usePathname() || "/m";
  const t = useTranslations("nav.bottom");
  const { user } = useAuth();
  const requireLogin = useRequireLogin();

  const items = [
    { href: "/m",              labelKey: "home",       fallback: "首页",       icon: Ic.home, match: (p: string) => p === "/m" },
    { href: "/m/photography",  labelKey: "discover",   fallback: "发现",       icon: Ic.feed, match: (p: string) => p.startsWith("/m/photography") },
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
      <ul className="flex items-stretch justify-around h-16">
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
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-[var(--ink)]" />}
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
