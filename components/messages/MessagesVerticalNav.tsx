"use client";
// 私信页左侧竖排导航 · 4 项 · 私信为默认高亮
// Desktop 固定 88px · Mobile 折叠为水平 4 icon 顶栏
import Link from "next/link";
import { useEffect, useState } from "react";

interface Counts {
  following: number;
  notificationsUnread: number;
  isPaid: boolean;
}

interface Item {
  key: "messages" | "following" | "notifications" | "vip";
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ICONS = {
  messages: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H4l3-3v-5z" />
    </svg>
  ),
  following: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  vip: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l4 5 5-8 5 8 4-5v13H3z" />
    </svg>
  ),
};

interface Props {
  activeKey?: "messages" | "following" | "notifications" | "vip";
}

export default function MessagesVerticalNav({ activeKey = "messages" }: Props) {
  const [c, setC] = useState<Counts | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/user/me",         { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/notifications",   { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/membership/me",   { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]).then(([me, notif, mem]) => {
      if (!alive) return;
      setC({
        following: me?.ok ? (me.counts?.following ?? 0) : 0,
        notificationsUnread: notif?.ok ? (notif.unreadCount ?? 0) : 0,
        isPaid: !!(mem?.ok && mem.membership?.tier === "paid"),
      });
    });
    return () => { alive = false; };
  }, []);

  const items: Item[] = [
    { key: "messages",       label: "私信", href: "/messages",                          icon: ICONS.messages },
    { key: "following",      label: "关注", href: "/me?section=following",              icon: ICONS.following },
    { key: "notifications",  label: "通知", href: "/photography?panel=notifications",   icon: ICONS.notifications },
    { key: "vip",            label: "VIP",  href: "/membership",                        icon: ICONS.vip },
  ];

  const badgeOf = (k: Item["key"]): { text: string; tone: "unread" | "warn" | "ok" | null } | null => {
    if (!c) return null;
    if (k === "following"      && c.following > 0)           return { text: c.following > 99 ? "99+" : String(c.following), tone: "unread" };
    if (k === "notifications"  && c.notificationsUnread > 0) return { text: c.notificationsUnread > 99 ? "99+" : String(c.notificationsUnread), tone: "warn" };
    if (k === "vip"            && c.isPaid)                  return { text: "✓", tone: "ok" };
    return null;
  };

  return (
    <nav className="mvn" aria-label="消息导航">
      {items.map((it) => {
        const active = activeKey === it.key;
        const badge = badgeOf(it.key);
        return (
          <Link key={it.key} href={it.href}
            className={"mvn-item" + (active ? " is-active" : "")}
            aria-current={active ? "page" : undefined}
          >
            <span className="mvn-ic" aria-hidden>{it.icon}</span>
            <span className="mvn-label">{it.label}</span>
            {badge && (
              <span className={"mvn-badge mvn-badge--" + badge.tone}>{badge.text}</span>
            )}
          </Link>
        );
      })}
      <style>{`
        .mvn{background:#0F0F11;color:#EEDDB8;padding:20px 8px;display:flex;flex-direction:column;gap:4px;border-right:1px solid rgba(238,221,184,.1)}
        .mvn-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;color:rgba(238,221,184,.55);text-decoration:none;border-radius:14px;transition:color .12s,background .12s;font-family:inherit}
        .mvn-item:hover{color:#EEDDB8;background:rgba(238,221,184,.06)}
        .mvn-item.is-active{color:#EEDDB8;background:linear-gradient(135deg,rgba(238,221,184,.16),rgba(184,167,137,.08))}
        .mvn-item.is-active:before{content:"";position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:3px;height:22px;background:#EEDDB8;border-radius:0 3px 3px 0}
        .mvn-ic{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px}
        .mvn-label{font-size:11px;font-weight:700;letter-spacing:.04em}
        .mvn-badge{position:absolute;top:6px;right:6px;min-width:18px;height:18px;padding:0 5px;font-size:10px;font-weight:800;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;line-height:1;color:#fff}
        .mvn-badge--unread{background:#D6B980;color:#1a1409}
        .mvn-badge--warn{background:#B77945}
        .mvn-badge--ok{background:#42856B}

        @media(max-width:900px){
          .mvn{flex-direction:row;justify-content:space-around;padding:8px 4px;border-right:0;border-bottom:1px solid rgba(238,221,184,.1)}
          .mvn-item{flex:1}
          .mvn-item.is-active:before{left:50%;top:-4px;transform:translateX(-50%);width:22px;height:3px;border-radius:3px 3px 0 0}
        }
      `}</style>
    </nav>
  );
}
