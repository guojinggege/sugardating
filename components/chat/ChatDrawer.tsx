"use client";
// Chat 主抽屉 — Desktop: 右侧 pane 420-480px;Mobile: 全屏 Sheet
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useChat } from "./ChatProvider";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";
import QuickReplies from "./QuickReplies";
import type { ChatMessage, Conversation } from "@/lib/chat";
import type { SupportedLocale } from "@/lib/translation";

export default function ChatDrawer() {
  const { target, open, closeChat } = useChat();
  const { user, hydrated } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [translateTo, setTranslateTo] = useState<SupportedLocale | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const creatorLang: SupportedLocale = target?.languages?.[0] ?? "zh";

  // 打开时 · 创建/获取 conversation → 拉消息
  // API 失败时 fallback 到 local conversation,UI 不阻断
  useEffect(() => {
    if (!open || !target || !user) { setConversation(null); setMessages([]); return; }
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const r1 = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            creatorSlug: target.slug,
            creatorName: target.name,
            creatorAvatar: target.avatar,
            creatorLanguages: target.languages ?? ["zh"],
          }),
        });
        const d1 = await r1.json().catch(() => ({ ok: false }));
        if (!alive) return;
        if (!d1.ok || !d1.conversation) {
          // fallback:local conversation,允许 UI 继续,消息发送时再尝试
          setConversation({
            id: `local-${target.slug}`,
            userId: user.id,
            creatorSlug: target.slug,
            creatorName: target.name,
            creatorAvatar: target.avatar,
            creatorLanguages: target.languages ?? ["zh"],
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Conversation);
          setMessages([]);
          return;
        }
        setConversation(d1.conversation);

        const r2 = await fetch(`/api/chat/conversations/${d1.conversation.id}/messages`, { credentials: "include" });
        const d2 = await r2.json().catch(() => ({ ok: false, messages: [] }));
        if (!alive) return;
        setMessages(d2.ok ? d2.messages : []);
      } catch {
        // network fail → fallback local conversation
        if (!alive) return;
        setConversation({
          id: `local-${target.slug}`,
          userId: user.id,
          creatorSlug: target.slug,
          creatorName: target.name,
          creatorAvatar: target.avatar,
          creatorLanguages: target.languages ?? ["zh"],
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Conversation);
        setMessages([]);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [open, target, user]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeChat(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  async function handleSend(text: string) {
    if (!conversation || sending || !target) return;
    setSending(true);
    // 乐观 append
    const optimistic: ChatMessage = {
      id: `tmp_${Date.now()}`,
      conversationId: conversation.id,
      senderId: user?.id ?? "me",
      senderType: "user",
      text,
      status: "sending",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      // Local-fallback conversation → 先尝试真实创建
      let convoId = conversation.id;
      if (convoId.startsWith("local-")) {
        const rc = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            creatorSlug: target.slug,
            creatorName: target.name,
            creatorAvatar: target.avatar,
            creatorLanguages: target.languages ?? ["zh"],
          }),
        });
        const dc = await rc.json().catch(() => ({ ok: false }));
        if (dc.ok && dc.conversation) {
          setConversation(dc.conversation);
          convoId = dc.conversation.id;
        } else {
          throw new Error("聊天连接失败,请稍后重试");
        }
      }
      const r = await fetch(`/api/chat/conversations/${convoId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text, translateTo }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.message || "发送失败");
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== optimistic.id);
        const next = [...filtered, data.message];
        // 模拟对方 typing 延迟再插入回复
        if (data.reply) {
          setTimeout(() => setMessages((cur) => [...cur, data.reply]), 900 + Math.random() * 800);
        }
        return next;
      });
    } catch {
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" as const } : m));
    } finally { setSending(false); }
  }

  if (!open || !target) return null;

  return (
    <>
      <div className="cd-backdrop" onClick={closeChat} />
      <aside className="cd-drawer" role="dialog" aria-modal="true" aria-label={`与 ${target.name} 的对话`}>
        {/* Header */}
        <header className="cd-header">
          <div className="cd-header-left">
            <div className="cd-avatar">
              {target.avatar
                ? <img src={target.avatar} alt="" />
                : <span>{target.name[0]?.toUpperCase()}</span>}
              {target.online && <span className="cd-online-dot" />}
            </div>
            <div className="cd-header-info">
              <div className="cd-name">{target.name}</div>
              <div className="cd-status">
                {target.online ? "在线" : "最近活跃"} · {creatorLang.toUpperCase()}
              </div>
            </div>
          </div>
          <button className="cd-close" onClick={closeChat} aria-label="关闭聊天">×</button>
        </header>

        {/* Body */}
        <div className="cd-body" ref={scrollRef}>
          {!hydrated ? (
            <div className="cd-loading">加载中…</div>
          ) : !user ? (
            <div className="cd-empty">
              <div className="cd-empty-ic">🔒</div>
              <div className="cd-empty-title">登录后开始对话</div>
              <div className="cd-empty-desc">聊天记录、翻译、快捷回复都会同步到你的账户</div>
              <div className="cd-empty-actions">
                <Link href="/login" className="cd-empty-btn cd-empty-btn--ghost">登录</Link>
                <Link href="/register" className="cd-empty-btn cd-empty-btn--primary">注册</Link>
              </div>
            </div>
          ) : loading ? (
            <div className="cd-loading">加载中…</div>
          ) : messages.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-ic">💬</div>
              <div className="cd-empty-title">开启与 {target.name} 的对话</div>
              <div className="cd-empty-desc">保持尊重与真诚。请勿分享联系方式、约见面等敏感内容。</div>
            </div>
          ) : (
            messages.map((m) => <ChatMessageBubble key={m.id} msg={m} />)
          )}
        </div>

        {/* Footer */}
        {user && (
          <div className="cd-footer">
            <QuickReplies locale={creatorLang} onPick={handleSend} />
            <ChatInput
              disabled={sending}
              translateTo={translateTo}
              onChangeTranslateTo={setTranslateTo}
              creatorLang={creatorLang}
              onSend={handleSend}
            />
          </div>
        )}
      </aside>

      <style jsx>{`
        .cd-backdrop{position:fixed;inset:0;background:rgba(10,10,12,.4);backdrop-filter:blur(4px);z-index:900;animation:cd-fade .2s ease}
        .cd-drawer{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:#F4F4F5;z-index:901;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.15);animation:cd-slide .28s cubic-bezier(.2,.9,.3,1.1)}
        @media (max-width:640px){.cd-drawer{width:100vw}}

        .cd-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#161618;color:#fff;flex-shrink:0}
        .cd-header-left{display:flex;align-items:center;gap:12px;min-width:0}
        .cd-avatar{position:relative;width:40px;height:40px;border-radius:50%;overflow:hidden;background:#B8A789;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
        .cd-avatar img{width:100%;height:100%;object-fit:cover}
        .cd-online-dot{position:absolute;bottom:0;right:0;width:11px;height:11px;background:#34C759;border-radius:50%;border:2px solid #161618}
        .cd-header-info{min-width:0}
        .cd-name{font-size:15px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cd-status{font-size:11px;color:rgba(255,255,255,.6);margin-top:2px}
        .cd-close{background:none;border:none;color:#fff;font-size:26px;cursor:pointer;padding:0 6px;line-height:1;opacity:.7;transition:opacity .12s}
        .cd-close:hover{opacity:1}

        .cd-body{flex:1;overflow-y:auto;padding:14px 12px;background:linear-gradient(180deg,#F4F4F5,#EFEFF1)}
        .cd-loading{text-align:center;color:#8a8a92;padding:40px 20px;font-size:13px}
        .cd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 24px;color:#6a6a70}
        .cd-empty-ic{font-size:44px;margin-bottom:14px}
        .cd-empty-title{font-size:16px;font-weight:600;color:#161618;margin-bottom:6px}
        .cd-empty-desc{font-size:13px;line-height:1.5;margin-bottom:20px}
        .cd-empty-actions{display:flex;gap:10px}
        .cd-empty-btn{padding:9px 20px;border-radius:99px;font-size:13px;font-weight:600;text-decoration:none;transition:opacity .12s}
        .cd-empty-btn--ghost{background:#F4F4F5;color:#161618;border:1px solid #E8E8EC}
        .cd-empty-btn--primary{background:#161618;color:#fff}

        .cd-footer{flex-shrink:0;background:#fff;box-shadow:0 -2px 12px rgba(0,0,0,.04)}

        @keyframes cd-fade{from{opacity:0}to{opacity:1}}
        @keyframes cd-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}
      `}</style>
    </>
  );
}
