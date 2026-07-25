"use client";
// 通知面板 · 列表 + mark-read
import { useEffect, useState } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  kind: string;
  title: string;
  body?: string;
  href?: string;
  actorName?: string;
  read: boolean;
  createdAt: string;
}

const KIND_LABEL: Record<string, string> = {
  follow: "新粉丝", tip: "打赏", credit: "Credits",
  safety: "安全", review: "审核", membership: "会员",
  verify: "认证", system: "系统",
};
const KIND_TONE: Record<string, string> = {
  follow: "#4B5E80", tip: "#8C4B54", credit: "#B8A789",
  safety: "#B77945", review: "#42856B", membership: "#4B5E80",
  verify: "#42856B", system: "#77716A",
};

function fmt(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  return `${Math.floor(d / 30)} 月前`;
}

export default function NotificationsPanel({ loggedIn }: { loggedIn: boolean }) {
  const [list, setList] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    let alive = true;
    fetch("/api/notifications", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.ok) return;
        setList(d.notifications);
        setUnread(d.unreadCount);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [loggedIn]);

  async function markRead(id: string) {
    setList((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnread((n) => Math.max(0, n - 1));
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH", credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).catch(() => { /* silent */ });
  }

  async function markAll() {
    setList((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    await fetch("/api/notifications", {
      method: "POST", credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    }).catch(() => { /* silent */ });
  }

  if (!loggedIn) {
    return (
      <div className="rounded-2xl border border-feed-line bg-feed-card p-10 text-center">
        <h2 className="text-[22px] font-bold text-feed-ink italic mb-2" style={{ fontFamily: "'Cormorant Garamond',ui-serif" }}>通知中心</h2>
        <p className="text-[13px] text-feed-mute mb-4">登录后可以查看通知。</p>
        <Link href="/login?next=/photography%3Fpanel%3Dnotifications" className="inline-block px-5 py-2 rounded-full bg-feed-ink text-white text-[13px] font-bold">前往登录</Link>
      </div>
    );
  }

  return (
    <div className="np">
      <div className="np-h">
        <div>
          <div className="np-eye">Notifications</div>
          <h2>通知中心</h2>
          <p>{unread > 0 ? `${unread} 条未读` : "全部已读"}</p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAll} className="np-mark-all">全部标为已读</button>
        )}
      </div>

      {loading ? (
        <div className="np-empty">加载中…</div>
      ) : list.length === 0 ? (
        <div className="np-empty">暂无通知</div>
      ) : (
        <ul className="np-list">
          {list.map((n) => {
            const tone = KIND_TONE[n.kind] ?? "#77716A";
            return (
              <li key={n.id} className={"np-item" + (n.read ? "" : " is-unread")}>
                <span className="np-kind" style={{ background: tone }}>{KIND_LABEL[n.kind] ?? n.kind}</span>
                <div className="np-body">
                  <div className="np-t">{n.title}</div>
                  {n.body && <p className="np-p">{n.body}</p>}
                  <div className="np-meta">
                    {n.actorName && <span>{n.actorName} ·</span>}
                    <time>{fmt(n.createdAt)}</time>
                  </div>
                </div>
                <div className="np-r">
                  {!n.read && <span className="np-dot" aria-label="未读" />}
                  {n.href && (
                    <Link href={n.href} onClick={() => !n.read && markRead(n.id)} className="np-open">查看 →</Link>
                  )}
                  {!n.read && (
                    <button type="button" onClick={() => markRead(n.id)} className="np-mark">标为已读</button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .np{display:flex;flex-direction:column;gap:12px}
        .np-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding:16px 20px;background:#fff;border:1px solid var(--line,#E9E3DA);border-radius:16px}
        .np-eye{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:700;text-transform:uppercase}
        .np-h h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;font-weight:600;color:#171512;margin:4px 0 2px;letter-spacing:-0.008em}
        .np-h p{font-size:12px;color:#77716A;margin:0}
        .np-mark-all{background:#171512;color:#fff;border:0;padding:8px 14px;font:inherit;font-size:12px;font-weight:800;border-radius:99px;cursor:pointer}
        .np-empty{padding:40px;background:#fff;border:1px dashed var(--line,#E9E3DA);border-radius:16px;text-align:center;color:#a19a91;font-size:13px}

        .np-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .np-item{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:#fff;border:1px solid var(--line,#E9E3DA);border-radius:14px;transition:border-color .12s}
        .np-item:hover{border-color:#D6B980}
        .np-item.is-unread{background:linear-gradient(135deg,#FBF7EF,#fff);border-color:rgba(214,185,128,.4)}
        .np-kind{font-size:9.5px;letter-spacing:.08em;color:#fff;font-weight:800;padding:2px 8px;border-radius:99px;text-transform:uppercase;flex-shrink:0;margin-top:2px}
        .np-body{flex:1;min-width:0}
        .np-t{font-size:13.5px;color:#171512;font-weight:700;line-height:1.4}
        .np-p{margin:4px 0 0;font-size:12.5px;color:#3d3a35;line-height:1.55}
        .np-meta{margin-top:4px;font-size:11px;color:#a19a91;display:flex;gap:4px}
        .np-r{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
        .np-dot{width:8px;height:8px;background:#D6B980;border-radius:50%}
        .np-open{font-size:11.5px;color:#171512;text-decoration:none;font-weight:700;padding:4px 10px;background:#F7F4EF;border-radius:99px}
        .np-open:hover{background:#EEDDB8}
        .np-mark{background:none;border:0;font:inherit;font-size:10.5px;color:#a19a91;cursor:pointer}
        .np-mark:hover{color:#171512;text-decoration:underline}
      `}</style>
    </div>
  );
}
