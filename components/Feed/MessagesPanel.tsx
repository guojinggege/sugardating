"use client";
// 消息中心 · 双栏 · 左侧会话列表 (未读/已读 Tab) · 右侧聊天区
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Conversation, ChatMessage } from "@/lib/chat";

type Tab = "unread" | "read";

function fmtAgo(iso?: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1)  return "刚刚";
  if (m < 60) return `${m} 分钟`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天`;
  return `${Math.floor(d / 30)} 月`;
}

export default function MessagesPanel({ loggedIn }: { loggedIn: boolean }) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("unread");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    let alive = true;
    fetch("/api/chat/conversations", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.ok) {
          setConvos(d.conversations);
          // 默认选中未读中的第一条 · 否则选最新一条
          const unread = d.conversations.find((c: Conversation) => c.unreadCount > 0);
          setActiveId((unread ?? d.conversations[0])?.id ?? null);
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [loggedIn]);

  // Load messages when activeId changes + mark as read
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    let alive = true;
    setMsgLoading(true);
    fetch(`/api/chat/conversations/${activeId}/messages`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.ok) setMessages(d.messages ?? []);
      })
      .finally(() => { if (alive) setMsgLoading(false); });

    // Mark read
    fetch(`/api/chat/conversations/${activeId}/read`, { method: "POST", credentials: "include" })
      .then(() => {
        if (!alive) return;
        setConvos((prev) => prev.map((c) => c.id === activeId ? { ...c, unreadCount: 0 } : c));
      })
      .catch(() => { /* silent */ });
    return () => { alive = false; };
  }, [activeId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const { unreadList, readList } = useMemo(() => {
    const u = convos.filter((c) => c.unreadCount > 0);
    const r = convos.filter((c) => c.unreadCount === 0);
    return { unreadList: u, readList: r };
  }, [convos]);

  const list = tab === "unread" ? unreadList : readList;
  const active = convos.find((c) => c.id === activeId) ?? null;

  async function send() {
    if (!activeId || !draft.trim() || sending) return;
    const text = draft.trim();
    setSending(true);
    try {
      const r = await fetch(`/api/chat/conversations/${activeId}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const d = await r.json();
      if (d?.ok) {
        // POST 已同步返回 user message + creator auto-reply
        setMessages((prev) => {
          const next = [...prev, d.message];
          if (d.reply) next.push(d.reply);
          return next;
        });
        setDraft("");
      }
    } finally { setSending(false); }
  }

  if (!loggedIn) {
    return (
      <div className="rounded-2xl border border-feed-line bg-feed-card p-10 text-center">
        <h2 className="text-[22px] font-bold text-feed-ink italic mb-2" style={{ fontFamily: "'Cormorant Garamond',ui-serif" }}>私信中心</h2>
        <p className="text-[13px] text-feed-mute mb-4">登录后可以查看和回复你与创作者的会话。</p>
        <Link href="/login?next=/photography%3Fpanel%3Dmessages" className="inline-block px-5 py-2 rounded-full bg-feed-ink text-white text-[13px] font-bold">前往登录</Link>
      </div>
    );
  }

  return (
    <div className="mp">
      <div className="mp-list">
        <div className="mp-list-h">
          <div>
            <div className="mp-eyebrow">Messages</div>
            <h2 className="mp-title">私信</h2>
          </div>
        </div>
        <div className="mp-tabs" role="tablist">
          <button
            type="button" role="tab"
            aria-selected={tab === "unread"}
            onClick={() => setTab("unread")}
            className={"mp-tab" + (tab === "unread" ? " is-active" : "")}
          >
            未读<span className="mp-tab-n">{unreadList.length}</span>
          </button>
          <button
            type="button" role="tab"
            aria-selected={tab === "read"}
            onClick={() => setTab("read")}
            className={"mp-tab" + (tab === "read" ? " is-active" : "")}
          >
            已读<span className="mp-tab-n">{readList.length}</span>
          </button>
        </div>
        <div className="mp-list-body">
          {loading && <div className="mp-empty">加载中…</div>}
          {!loading && list.length === 0 && (
            <div className="mp-empty">
              {tab === "unread" ? "没有未读消息" : "还没有历史会话"}
              <div className="mt-2 text-[11.5px]"><Link href="/creators">去发现创作者 →</Link></div>
            </div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={"mp-conv" + (activeId === c.id ? " is-active" : "")}
            >
              <div className={"mp-conv-ava" + (c.unreadCount > 0 ? " has-dot" : "")}>
                {(c.creatorName || "?")[0]?.toUpperCase()}
              </div>
              <div className="mp-conv-body">
                <div className="mp-conv-h">
                  <b>{c.creatorName}</b>
                  <time>{fmtAgo(c.lastMessageAt)}</time>
                </div>
                <div className="mp-conv-sub">
                  {c.lastMessage || <em>暂无消息</em>}
                </div>
              </div>
              {c.unreadCount > 0 && <span className="mp-conv-n">{c.unreadCount}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mp-chat">
        {!active ? (
          <div className="mp-chat-empty">
            <div className="mp-chat-empty-t">选择左侧会话开始聊天</div>
            <div className="mp-chat-empty-s">未读消息会自动置顶 · 打开后标记为已读</div>
          </div>
        ) : (
          <>
            <div className="mp-chat-h">
              <div className="mp-conv-ava mp-conv-ava--lg">{active.creatorName[0]?.toUpperCase()}</div>
              <div>
                <b>{active.creatorName}</b>
                <span>创作者 · {active.creatorLanguages.join(" · ")}</span>
              </div>
              <Link href={`/creators/${active.creatorSlug}`} className="mp-chat-view">查看主页</Link>
            </div>
            <div className="mp-chat-scroll" ref={scrollRef}>
              {msgLoading && <div className="mp-empty">加载消息…</div>}
              {!msgLoading && messages.length === 0 && (
                <div className="mp-empty">还没有消息 · 说点什么打招呼吧</div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={"mp-msg mp-msg--" + m.senderType}>
                  <div className="mp-msg-bubble">{m.text}</div>
                  <time>{fmtAgo(m.createdAt)}</time>
                </div>
              ))}
            </div>
            <form
              className="mp-chat-input"
              onSubmit={(e) => { e.preventDefault(); send(); }}
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 500))}
                placeholder="输入消息…"
                maxLength={500}
                disabled={sending}
              />
              <button type="submit" disabled={!draft.trim() || sending}>
                {sending ? "…" : "发送"}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        .mp{display:grid;grid-template-columns:340px minmax(0,1fr);gap:12px;height:calc(100vh - 180px);min-height:520px}
        .mp-list{background:#fff;border:1px solid var(--line,#E9E3DA);border-radius:16px;display:flex;flex-direction:column;overflow:hidden}
        .mp-list-h{padding:16px 18px 8px}
        .mp-eyebrow{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:700;text-transform:uppercase}
        .mp-title{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;font-weight:600;color:#171512;margin:4px 0 0;letter-spacing:-0.008em}

        .mp-tabs{display:flex;gap:4px;padding:0 18px 10px;border-bottom:1px solid #F0EAE1}
        .mp-tab{background:none;border:0;padding:8px 4px;font:inherit;font-size:13px;font-weight:700;color:#77716A;cursor:pointer;position:relative;display:inline-flex;align-items:center;gap:6px}
        .mp-tab-n{font-size:11px;font-weight:700;padding:1px 8px;background:#F0EAE1;color:#77716A;border-radius:99px;font-variant-numeric:tabular-nums}
        .mp-tab.is-active{color:#171512}
        .mp-tab.is-active:after{content:"";position:absolute;left:0;right:0;bottom:-11px;height:2px;background:#171512;border-radius:2px}
        .mp-tab.is-active .mp-tab-n{background:#171512;color:#EEDDB8}

        .mp-list-body{flex:1;overflow-y:auto;padding:8px 8px 12px;display:flex;flex-direction:column;gap:2px}
        .mp-empty{padding:24px;text-align:center;font-size:12.5px;color:#a19a91;line-height:1.7}
        .mp-empty a{color:#171512;font-weight:700;text-decoration:none}

        .mp-conv{display:flex;gap:10px;align-items:center;padding:10px 12px;background:transparent;border:0;border-radius:12px;cursor:pointer;text-align:left;font:inherit;width:100%;transition:background .12s}
        .mp-conv:hover{background:#FBFAF7}
        .mp-conv.is-active{background:linear-gradient(135deg,#FBFAF7,#F4EEDF)}
        .mp-conv-ava{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#DACFBE,#B8AA95);color:#171512;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0;position:relative}
        .mp-conv-ava.has-dot:before{content:"";position:absolute;top:1px;right:1px;width:9px;height:9px;background:#D6B980;border:2px solid #fff;border-radius:50%}
        .mp-conv-ava--lg{width:44px;height:44px;font-size:16px}
        .mp-conv-body{flex:1;min-width:0}
        .mp-conv-h{display:flex;justify-content:space-between;align-items:baseline;gap:6px}
        .mp-conv-h b{font-size:13px;color:#171512;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}
        .mp-conv-h time{font-size:11px;color:#a19a91;font-variant-numeric:tabular-nums;flex-shrink:0}
        .mp-conv-sub{font-size:12px;color:#77716A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.4;margin-top:1px}
        .mp-conv-sub em{color:#a19a91;font-style:italic}
        .mp-conv-n{background:#D6B980;color:#1a1409;font-size:11px;font-weight:800;padding:1px 8px;border-radius:99px;font-variant-numeric:tabular-nums;flex-shrink:0}

        .mp-chat{background:#fff;border:1px solid var(--line,#E9E3DA);border-radius:16px;display:flex;flex-direction:column;overflow:hidden}
        .mp-chat-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;color:#a19a91}
        .mp-chat-empty-t{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:20px;color:#171512;margin-bottom:6px}
        .mp-chat-empty-s{font-size:12.5px}

        .mp-chat-h{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #F0EAE1}
        .mp-chat-h > div:not(.mp-conv-ava){display:flex;flex-direction:column;line-height:1.3;flex:1;min-width:0}
        .mp-chat-h b{font-size:14px;color:#171512;font-weight:800}
        .mp-chat-h span{font-size:11.5px;color:#a19a91}
        .mp-chat-view{padding:6px 12px;background:#F7F4EF;color:#171512;border:1px solid #E9E3DA;border-radius:99px;font-size:11.5px;font-weight:700;text-decoration:none;white-space:nowrap}
        .mp-chat-view:hover{border-color:#171512}

        .mp-chat-scroll{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:10px}
        .mp-msg{display:flex;flex-direction:column;gap:2px;max-width:78%}
        .mp-msg--user{align-self:flex-end;align-items:flex-end}
        .mp-msg--creator,.mp-msg--system{align-self:flex-start;align-items:flex-start}
        .mp-msg-bubble{padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;color:#171512}
        .mp-msg--user .mp-msg-bubble{background:linear-gradient(135deg,#EEDDB8,#D6B980);color:#1a1409;border-bottom-right-radius:4px}
        .mp-msg--creator .mp-msg-bubble,.mp-msg--system .mp-msg-bubble{background:#F7F4EF;border:1px solid #E9E3DA;border-bottom-left-radius:4px}
        .mp-msg time{font-size:10.5px;color:#a19a91;padding:0 4px}

        .mp-chat-input{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #F0EAE1;background:#FBFAF7}
        .mp-chat-input input{flex:1;padding:10px 14px;border:1px solid #E9E3DA;border-radius:99px;font:inherit;font-size:13.5px;color:#171512;background:#fff;outline:none}
        .mp-chat-input input:focus{border-color:#171512}
        .mp-chat-input button{padding:10px 20px;background:#171512;color:#fff;border:0;border-radius:99px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}
        .mp-chat-input button:disabled{opacity:.4;cursor:not-allowed}

        @media(max-width:900px){
          .mp{grid-template-columns:1fr;height:auto}
          .mp-list{max-height:400px}
          .mp-chat{min-height:500px}
        }
      `}</style>
    </div>
  );
}
