"use client";
// Mobile top header — sticky · logo left · search + menu right
// 56px 高 · glass bg · 独立于 desktop Nav
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const tN = useTranslations("nav");

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          borderColor: "var(--line)",
        }}
      >
        {/* Logo — 与 desktop 一致的 Spark SVG (Cormorant Garamond italic) */}
        <Link href="/m" className="flex items-center gap-2 font-bold text-[16px] text-[var(--ink)] leading-none" style={{ letterSpacing: "-0.02em" }}>
          <span
            className="grid place-items-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: "var(--ink)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
              <text x="12" y="18.2" textAnchor="middle" fill="#fff"
                fontFamily='"Cormorant Garamond","Playfair Display",Didot,Georgia,serif'
                fontSize="20" fontWeight="500" fontStyle="italic">S</text>
            </svg>
          </span>
          Sugardating
        </Link>

        {/* Right: Search + Menu */}
        <div className="flex items-center gap-1">
          <Link
            href="/m/search"
            aria-label="Search"
            className="w-10 h-10 grid place-items-center rounded-full text-[var(--ink)] hover:bg-[var(--page)] transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="w-10 h-10 grid place-items-center rounded-full text-[var(--ink)] hover:bg-[var(--page)] transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer — 全屏抽屉,菜单项 */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed top-14 inset-x-0 z-40 bg-white border-b overflow-y-auto max-h-[calc(100vh-56px)]"
            style={{ borderColor: "var(--line)" }}
          >
            <ul className="flex flex-col py-2">
              {[
                { href: "/m",                 label: safeT(tN, "home", "首页") },
                { href: "/m/photography",     label: safeT(tN, "photography", "动态推荐") },
                { href: "/m/creators",        label: safeT(tN, "sugargirl", "Sugargirl") },
                { href: "/m/community",       label: safeT(tN, "community", "互动社区") },
                { href: "/m/video",           label: safeT(tN, "video", "视频专区") },
                { href: "/m/membership",      label: safeT(tN, "membership", "开通会员") },
                { href: "/m/login",           label: safeT(tN, "login", "登录") },
              ].map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3.5 text-[15px] font-semibold text-[var(--ink)] hover:bg-[var(--page)] transition"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
              <li className="border-t mt-2 pt-2" style={{ borderColor: "var(--line)" }}>
                <Link
                  href="/"
                  className="block px-5 py-3 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition"
                  onClick={() => setOpen(false)}
                >
                  切换到桌面版 →
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}

function safeT(t: (k: string) => string, k: string, fallback: string): string {
  try {
    const v = t(k);
    return v && !v.includes(".") ? v : fallback;
  } catch { return fallback; }
}
