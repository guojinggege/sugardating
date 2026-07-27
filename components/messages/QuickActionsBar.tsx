"use client";
// 私信页快捷入口 · 关注 / 通知 / VIP
// 挂在 Inbox 顶部左侧栏内 · 移动端也可见
import Link from "next/link";
import { useEffect, useState } from "react";

interface Counts {
  following: number;
  notificationsUnread: number;
  isPaid: boolean;
}

export default function QuickActionsBar() {
  const [c, setC] = useState<Counts | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/user/me", { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/notifications", { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/membership/me", { credentials: "include", cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null),
    ]).then(([me, notif, mem]) => {
      if (!alive) return;
      setC({
        following: me?.ok ? (me.counts?.following ?? 0) : 0,
        notificationsUnread: notif?.ok ? (notif.unreadCount ?? 0) : 0,
        isPaid: mem?.ok && mem.membership?.tier === "paid",
      });
    });
    return () => { alive = false; };
  }, []);

  return (
    <div className="qab">
      <Link href="/me?section=following" className="qab-btn" aria-label="关注">
        <span className="qab-ic" aria-hidden>♡</span>
        <span className="qab-label">关注</span>
        {c && c.following > 0 && <span className="qab-badge">{c.following > 99 ? "99+" : c.following}</span>}
      </Link>
      <Link href="/photography?panel=notifications" className="qab-btn" aria-label="通知">
        <span className="qab-ic" aria-hidden>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </span>
        <span className="qab-label">通知</span>
        {c && c.notificationsUnread > 0 && <span className="qab-badge qab-badge--warn">{c.notificationsUnread > 99 ? "99+" : c.notificationsUnread}</span>}
      </Link>
      <Link href="/membership" className={"qab-btn qab-btn--gold" + (c?.isPaid ? " is-paid" : "")} aria-label="VIP">
        <span className="qab-ic" aria-hidden>◆</span>
        <span className="qab-label">{c?.isPaid ? "会员" : "VIP"}</span>
        {c?.isPaid && <span className="qab-badge qab-badge--ok">✓</span>}
      </Link>

      <style>{`
        .qab{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px 16px;border-bottom:1px solid #F0EAE1;background:#FBFAF7}
        .qab-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 10px;background:#fff;border:1px solid #E9E3DA;border-radius:12px;font:inherit;font-size:12px;font-weight:700;color:#3d3a35;text-decoration:none;letter-spacing:-0.005em;transition:border-color .12s,background .12s,transform .12s}
        .qab-btn:hover{border-color:#171512;color:#171512;transform:translateY(-1px)}
        .qab-btn--gold{background:linear-gradient(135deg,rgba(238,221,184,.32),rgba(184,167,137,.14));border-color:#B8A789;color:#5a4520}
        .qab-btn--gold:hover{background:linear-gradient(135deg,rgba(238,221,184,.5),rgba(184,167,137,.22))}
        .qab-btn--gold.is-paid{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-color:transparent}
        .qab-ic{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;font-size:13px;line-height:1}
        .qab-label{white-space:nowrap}
        .qab-badge{position:absolute;top:-6px;right:6px;min-width:18px;height:18px;padding:0 5px;background:#171512;color:#F5EEDD;font-size:10px;font-weight:800;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;line-height:1;border:1.5px solid #FBFAF7}
        .qab-badge--warn{background:#B77945;color:#fff}
        .qab-badge--ok{background:#42856B;color:#fff}
      `}</style>
    </div>
  );
}
