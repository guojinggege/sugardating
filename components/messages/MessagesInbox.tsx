"use client";
// 私信页 · 双栏收件箱布局
// 左侧:关注/通知/VIP 快捷入口 + 会话列表 + 未读/信息 tabs · 右侧:欢迎空态或精简聊天区
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Conversation, ChatMessage } from "@/lib/chat";
import QuickActionsBar from "./QuickActionsBar";
import ChatComposer from "./ChatComposer";

type Tab = "unread" | "all";

function fmtAgo(iso?: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return `${Math.floor(d / 30)} month${Math.floor(d / 30) > 1 ? "s" : ""} ago`;
}

interface Props {
  loggedIn: boolean;
}

export default function MessagesInbox({ loggedIn }: Props) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  // Composer 内部管理 text/busy · 只需暴露 sendText 回调
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    let alive = true;
    fetch("/api/chat/conversations", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.ok) return;
        setConvos(d.conversations ?? []);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [loggedIn]);

  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    let alive = true;
    setMsgLoading(true);
    fetch(`/api/chat/conversations/${activeId}/messages`, { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive && d?.ok) setMessages(d.messages ?? []); })
      .finally(() => { if (alive) setMsgLoading(false); });

    fetch(`/api/chat/conversations/${activeId}/read`, { method: "POST", credentials: "include" })
      .then(() => {
        if (!alive) return;
        setConvos((prev) => prev.map((c) => c.id === activeId ? { ...c, unreadCount: 0 } : c));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [activeId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const { unreadList, allList } = useMemo(() => {
    return {
      unreadList: convos.filter((c) => c.unreadCount > 0),
      allList: convos,
    };
  }, [convos]);
  const list = tab === "unread" ? unreadList : allList;
  const active = convos.find((c) => c.id === activeId) ?? null;

  async function sendText(text: string) {
    if (!activeId || !text.trim()) return;
    const r = await fetch(`/api/chat/conversations/${activeId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });
    const d = await r.json();
    if (d?.ok) {
      setMessages((prev) => {
        const next = [...prev, d.message];
        if (d.reply) next.push(d.reply);
        return next;
      });
    }
  }

  if (!loggedIn) {
    return (
      <div className="inbox-gate">
        <div className="inbox-gate-in">
          <div className="inbox-gate-eye">Private Messages</div>
          <h1>登录后查看你的私信</h1>
          <p>与已认证创作者的所有对话集中在此 · 未读一目了然 · 支持多语言翻译</p>
          <Link href="/login?next=/messages" className="inbox-gate-btn">前往登录</Link>
        </div>
        <style>{`
          .inbox-gate{background:#F7F4EF;min-height:calc(100vh - 120px);display:grid;place-items:center;padding:32px}
          .inbox-gate-in{background:#fff;border:1px solid #E9E3DA;border-radius:22px;padding:52px 44px;max-width:520px;text-align:center;box-shadow:0 30px 80px -40px rgba(15,23,42,.2)}
          .inbox-gate-eye{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:800}
          .inbox-gate-in h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:34px;font-weight:600;color:#171512;margin:8px 0 10px;letter-spacing:-0.015em}
          .inbox-gate-in p{margin:0 0 22px;font-size:14px;line-height:1.7;color:#3d3a35}
          .inbox-gate-btn{display:inline-block;padding:12px 28px;background:#171512;color:#F5EEDD;border-radius:99px;font-size:13.5px;font-weight:800;text-decoration:none;letter-spacing:-0.005em}
          .inbox-gate-btn:hover{background:#2b2822}
        `}</style>
      </div>
    );
  }

  return (
    <div className="inbox">
      {/* Left · conversation list */}
      <aside className="ix-list">
        <div className="ix-list-h">
          <div>
            <div className="ix-eye">Messages</div>
            <h1>私信</h1>
          </div>
          <button type="button" className="ix-compose" aria-label="发起新会话" title="发起新会话 (即将开放)">✎</button>
        </div>
        <QuickActionsBar />
        <div className="ix-tabs" role="tablist">
          <button role="tab" type="button" aria-selected={tab === "all"} onClick={() => setTab("all")}
            className={"ix-tab" + (tab === "all" ? " is-active" : "")}>信息<span className="ix-tab-n">{allList.length}</span></button>
          <button role="tab" type="button" aria-selected={tab === "unread"} onClick={() => setTab("unread")}
            className={"ix-tab" + (tab === "unread" ? " is-active" : "")}>未读<span className="ix-tab-n">{unreadList.length}</span></button>
        </div>
        <div className="ix-scroll">
          {loading && <div className="ix-empty">加载中…</div>}
          {!loading && list.length === 0 && (
            <div className="ix-empty">
              {tab === "unread" ? "没有未读消息" : "还没有历史会话"}
              <div className="mt-2 text-[11.5px]"><Link href="/creators">去发现创作者 →</Link></div>
            </div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={"ix-conv" + (activeId === c.id ? " is-active" : "")}
            >
              <div className={"ix-ava" + (c.unreadCount > 0 ? " has-dot" : "")}>
                {(c.creatorName || "?")[0]?.toUpperCase()}
              </div>
              <div className="ix-conv-body">
                <div className="ix-conv-h">
                  <b>{c.creatorName}</b>
                  <time>{fmtAgo(c.lastMessageAt)}</time>
                </div>
                <div className="ix-conv-sub">{c.lastMessage || <em>暂无消息</em>}</div>
              </div>
              {c.unreadCount > 0 && <span className="ix-unread-dot" aria-label={`${c.unreadCount} 未读`} />}
            </button>
          ))}
        </div>
      </aside>

      {/* Right · welcome empty or chat */}
      <main className="ix-main">
        {!active ? (
          <div className="ix-welcome">
            <div className="ix-welcome-art">
              <div className="ix-welcome-orb" aria-hidden />
              <div className="ix-welcome-orb ix-welcome-orb--2" aria-hidden />
              <div className="ix-welcome-mark" aria-hidden>
                <svg viewBox="0 0 40 40" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 12h24a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H12l-6 6v-22a2 2 0 0 1 2-2z" strokeLinejoin="round" />
                  <path d="M14 20h12M14 24h8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h2>Say hello! <span aria-hidden>👋</span></h2>
            <p>to the new Messages</p>
            <div className="ix-welcome-lines">
              <span>左侧点开一个会话开始聊天</span>
              <span>· 消息按未读 / 全部分组</span>
              <span>· 支持多语言自动翻译</span>
            </div>
          </div>
        ) : (
          <div className="ix-chat">
            <header className="ix-chat-h">
              <div className="ix-ava ix-ava--lg">{active.creatorName[0]?.toUpperCase()}</div>
              <div className="ix-chat-h-body">
                <b>{active.creatorName}</b>
                <span>{active.creatorLanguages.join(" · ")}</span>
              </div>
              <Link href={`/creators/${active.creatorSlug}`} className="ix-chat-view">查看主页</Link>
            </header>
            <div className="ix-chat-scroll" ref={scrollRef}>
              {msgLoading && <div className="ix-empty">加载消息…</div>}
              {!msgLoading && messages.length === 0 && (
                <div className="ix-empty">还没有消息 · 说点什么打招呼吧</div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={"ix-msg ix-msg--" + m.senderType}>
                  <div className="ix-bubble">{m.text}</div>
                  <time>{fmtAgo(m.createdAt)}</time>
                </div>
              ))}
            </div>
            <ChatComposer onSend={sendText} />
          </div>
        )}
      </main>

      <style>{inboxStyles}</style>
    </div>
  );
}

const inboxStyles = `
  .inbox{background:#F7F4EF;display:grid;grid-template-columns:360px minmax(0,1fr);height:calc(100vh - 120px);min-height:560px;color:#171512;font-family:'Plus Jakarta Sans',ui-sans-serif}

  .ix-list{background:#fff;border-right:1px solid #E9E3DA;display:flex;flex-direction:column;overflow:hidden}
  .ix-list-h{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 22px 12px}
  .ix-eye{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:800}
  .ix-list-h h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:28px;font-weight:600;color:#171512;margin:4px 0 0;letter-spacing:-0.01em}
  .ix-compose{width:36px;height:36px;background:#171512;color:#F5EEDD;border:0;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0}
  .ix-compose:hover{background:#2b2822}

  .ix-tabs{display:flex;gap:4px;padding:0 22px 10px;border-bottom:1px solid #F0EAE1}
  .ix-tab{position:relative;background:none;border:0;padding:8px 4px;font:inherit;font-size:13px;font-weight:700;color:#77716A;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
  .ix-tab-n{font-size:10.5px;font-weight:800;padding:1px 8px;background:#F0EAE1;color:#77716A;border-radius:99px;font-variant-numeric:tabular-nums}
  .ix-tab.is-active{color:#171512}
  .ix-tab.is-active .ix-tab-n{background:#171512;color:#EEDDB8}
  .ix-tab.is-active:after{content:"";position:absolute;left:0;right:0;bottom:-11px;height:2px;background:#171512;border-radius:2px}

  .ix-scroll{flex:1;overflow-y:auto;padding:8px 8px 12px;display:flex;flex-direction:column;gap:2px}
  .ix-empty{padding:24px;text-align:center;font-size:12.5px;color:#a19a91;line-height:1.7}
  .ix-empty a{color:#171512;font-weight:700;text-decoration:none}

  .ix-conv{display:flex;gap:12px;align-items:center;padding:12px 14px;background:transparent;border:0;border-radius:14px;cursor:pointer;text-align:left;font:inherit;width:100%;transition:background .12s}
  .ix-conv:hover{background:#FBFAF7}
  .ix-conv.is-active{background:linear-gradient(135deg,#FBF7EF,#F4EEDF)}
  .ix-ava{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#DACFBE,#B8AA95);color:#171512;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;flex-shrink:0;position:relative}
  .ix-ava.has-dot:before{content:"";position:absolute;top:1px;right:1px;width:10px;height:10px;background:#D6B980;border:2px solid #fff;border-radius:50%}
  .ix-ava--lg{width:44px;height:44px}
  .ix-conv-body{flex:1;min-width:0}
  .ix-conv-h{display:flex;justify-content:space-between;align-items:baseline;gap:6px}
  .ix-conv-h b{font-size:13.5px;color:#171512;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}
  .ix-conv-h time{font-size:11px;color:#a19a91;font-variant-numeric:tabular-nums;flex-shrink:0}
  .ix-conv-sub{font-size:12px;color:#77716A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.4;margin-top:2px}
  .ix-conv-sub em{color:#a19a91;font-style:italic}
  .ix-unread-dot{width:9px;height:9px;background:#D6B980;border-radius:50%;flex-shrink:0}

  .ix-main{background:linear-gradient(180deg,#FBFAF7,#F7F4EF);display:flex;flex-direction:column;overflow:hidden}

  .ix-welcome{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;color:#3d3a35}
  .ix-welcome-art{position:relative;width:180px;height:180px;margin-bottom:20px}
  .ix-welcome-orb{position:absolute;top:20px;left:20px;width:140px;height:140px;background:radial-gradient(closest-side,#EEDDB8,transparent 70%);border-radius:50%;opacity:.7}
  .ix-welcome-orb--2{top:auto;bottom:0;left:auto;right:0;width:100px;height:100px;background:radial-gradient(closest-side,#F4EEDF,transparent 70%);opacity:.8}
  .ix-welcome-mark{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:96px;height:96px;background:#fff;border:1px solid #E9E3DA;border-radius:24px;display:grid;place-items:center;color:#B8A789;box-shadow:0 20px 40px -20px rgba(184,167,137,.35)}
  .ix-welcome h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:36px;font-weight:600;color:#171512;margin:0 0 4px;letter-spacing:-0.015em}
  .ix-welcome > p{margin:0 0 18px;font-size:15px;color:#77716A}
  .ix-welcome-lines{display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:#a19a91;line-height:1.7}

  .ix-chat{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .ix-chat-h{display:flex;align-items:center;gap:12px;padding:16px 22px;background:#fff;border-bottom:1px solid #F0EAE1}
  .ix-chat-h-body{display:flex;flex-direction:column;line-height:1.3;flex:1;min-width:0}
  .ix-chat-h-body b{font-size:14px;color:#171512;font-weight:800}
  .ix-chat-h-body span{font-size:11.5px;color:#a19a91}
  .ix-chat-view{padding:6px 14px;background:#F7F4EF;color:#171512;border:1px solid #E9E3DA;border-radius:99px;font-size:11.5px;font-weight:700;text-decoration:none;white-space:nowrap}
  .ix-chat-view:hover{border-color:#171512}

  .ix-chat-scroll{flex:1;overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:10px}
  .ix-msg{display:flex;flex-direction:column;gap:2px;max-width:78%}
  .ix-msg--user{align-self:flex-end;align-items:flex-end}
  .ix-msg--creator,.ix-msg--system{align-self:flex-start;align-items:flex-start}
  .ix-bubble{padding:10px 14px;border-radius:18px;font-size:13.5px;line-height:1.55;color:#171512}
  .ix-msg--user .ix-bubble{background:linear-gradient(135deg,#EEDDB8,#D6B980);color:#1a1409;border-bottom-right-radius:6px}
  .ix-msg--creator .ix-bubble,.ix-msg--system .ix-bubble{background:#fff;border:1px solid #E9E3DA;border-bottom-left-radius:6px}
  .ix-msg time{font-size:10.5px;color:#a19a91;padding:0 6px}

  /* .ix-chat-input 已由 ChatComposer 组件接管 */

  @media(max-width:900px){
    .inbox{grid-template-columns:1fr;height:auto}
    .ix-list{max-height:320px;border-right:0;border-bottom:1px solid #E9E3DA}
    .ix-main{min-height:520px}
  }
`;
