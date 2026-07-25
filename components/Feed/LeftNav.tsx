"use client";
// 动态推荐左侧固定导航 · 4 项 · badges 显示未读
// 顺序严格:关注 · 私信 · 通知 · VIP
// 注意:不使用 useSearchParams · 避免 SSR bailout · 用 window.location 客户端读
import Link from "next/link";
import { useEffect, useState } from "react";

type PanelKey = "following" | "messages" | "notifications";

interface NavItem {
  k: PanelKey | "vip";
  label: string;
  icon: React.ReactNode;
  href: string;
  external?: boolean;   // vip 走 /membership 真实跳转
}

const IC = {
  following: (
    <svg viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 24 24">
      <path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  vip: (
    <svg viewBox="0 0 24 24">
      <path d="M2 9l4 4 6-8 6 8 4-4v10H2z" />
    </svg>
  ),
};

const NAV: NavItem[] = [
  { k: "following",     label: "关注", href: "/photography?panel=following",     icon: IC.following },
  { k: "messages",      label: "私信", href: "/photography?panel=messages",      icon: IC.messages },
  { k: "notifications", label: "通知", href: "/photography?panel=notifications", icon: IC.notifications },
  { k: "vip",           label: "VIP", href: "/membership",                       icon: IC.vip, external: true },
];

export default function LeftNav() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadNotif, setUnreadNotif] = useState(0);

  // 客户端读 ?panel= · 不用 useSearchParams 以避免 SSR bailout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      const p = new URLSearchParams(window.location.search).get("panel");
      setActivePanel(p);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/chat/conversations", { credentials: "include" }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/notifications",      { credentials: "include" }).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]).then(([chat, notif]) => {
      if (!alive) return;
      if (chat?.ok) {
        const total = (chat.conversations ?? []).reduce((s: number, c: any) => s + (c.unreadCount ?? 0), 0);
        setUnreadMsg(total);
      }
      if (notif?.ok) setUnreadNotif(notif.unreadCount ?? 0);
    });
    return () => { alive = false; };
  }, [activePanel]);

  return (
    <nav className="flex flex-col gap-1 p-2" aria-label="Photography navigation">
      {NAV.map((n) => {
        const active = activePanel === n.k;
        const badge =
          n.k === "messages"      ? unreadMsg   :
          n.k === "notifications" ? unreadNotif :
          0;
        return (
          <Link
            key={n.k}
            href={n.href}
            className={
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] transition-colors " +
              (active
                ? "bg-feed-elevated text-feed-ink"
                : "text-feed-mute hover:text-feed-ink hover:bg-feed-elevated")
            }
            aria-current={active ? "page" : undefined}
          >
            <span className="grid place-items-center w-6 h-6 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.7]">
              {n.icon}
            </span>
            <span className="flex-1">{n.label}</span>
            {badge > 0 && (
              <span
                className={
                  "min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-bold text-white grid place-items-center tabular-nums " +
                  (n.k === "messages" ? "bg-[#D6B980] text-[#1a1409]" : "bg-[#B77945]")
                }
                aria-label={`${badge} 未读`}
              >{badge > 99 ? "99+" : badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
