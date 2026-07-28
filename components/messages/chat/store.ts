"use client";
// 私信 workspace · 状态管理 · 全部前端 · 支持 localStorage 持久化
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DemoConversation, DemoMessage, ChatLang } from "./types";
import { DEMO_CONVERSATIONS, DEMO_MESSAGES, pickAutoReply } from "./mockData";

const LS_KEY = "sg_msg_ws_v1";

interface Persisted {
  convos: DemoConversation[];
  messagesByConv: Record<string, DemoMessage[]>;
  autoTranslate: boolean;
}

/** SSR safe · 客户端才读 localStorage · 保证初始 state 服务端/客户端一致 */
function loadPersisted(): Persisted {
  const base: Persisted = {
    convos: DEMO_CONVERSATIONS.map((c) => ({ ...c })),
    messagesByConv: Object.fromEntries(
      Object.entries(DEMO_MESSAGES).map(([k, v]) => [k, v.map((m) => ({ ...m }))]),
    ),
    autoTranslate: false,
  };
  return base;
}

export function useChatStore(locale: ChatLang) {
  // 初始 = 干净的 mock · 不读 localStorage · SSR 一致
  const [state, setState] = useState<Persisted>(() => loadPersisted());
  const [activeId, setActiveId] = useState<string>(DEMO_CONVERSATIONS[0].id);
  const [hydrated, setHydrated] = useState(false);

  // 客户端 mount 后再合并 localStorage · 避免 SSR 漂移
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Persisted>;
      setState((prev) => ({
        convos: parsed.convos ?? prev.convos,
        messagesByConv: parsed.messagesByConv ?? prev.messagesByConv,
        autoTranslate: parsed.autoTranslate ?? prev.autoTranslate,
      }));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch { /* noop · quota / private mode */ }
  }, [state, hydrated]);

  const active = state.convos.find((c) => c.id === activeId) ?? state.convos[0] ?? null;
  const messages = activeId ? (state.messagesByConv[activeId] ?? []) : [];

  const markRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      convos: prev.convos.map((c) => c.id === id ? { ...c, unreadCount: 0 } : c),
    }));
  }, []);

  const setAutoTranslate = useCallback((v: boolean) => {
    setState((prev) => ({ ...prev, autoTranslate: v }));
  }, []);

  const activeIdRef = useRef(activeId);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  const appendMessage = useCallback((convId: string, msg: DemoMessage, preview: string) => {
    setState((prev) => {
      const list = prev.messagesByConv[convId] ?? [];
      const next: Persisted = {
        ...prev,
        messagesByConv: { ...prev.messagesByConv, [convId]: [...list, msg] },
        convos: prev.convos.map((c) => c.id === convId
          ? { ...c, lastMessagePreview: preview, lastMessageAt: msg.createdAt, lastMessageType: msg.type }
          : c),
      };
      return next;
    });
  }, []);

  const patchMessage = useCallback((convId: string, msgId: string, patch: Partial<DemoMessage>) => {
    setState((prev) => {
      const list = prev.messagesByConv[convId] ?? [];
      return {
        ...prev,
        messagesByConv: {
          ...prev.messagesByConv,
          [convId]: list.map((m) => m.id === msgId ? { ...m, ...patch } : m),
        },
      };
    });
  }, []);

  /** 发送文本 · 立即 sent → 1s 后 read · 若目标非"我" 自动 mock 回复 */
  const sendText = useCallback((text: string) => {
    if (!activeId || !text.trim()) return;
    const conv = state.convos.find((c) => c.id === activeId);
    if (!conv) return;
    const id = `local_${Date.now()}`;
    const msg: DemoMessage = {
      id, conversationId: activeId, senderSide: "me", type: "text",
      originalText: text.trim(), originalLanguage: locale,
      status: "sent", createdAt: new Date().toISOString(),
    };
    appendMessage(activeId, msg, text.trim().slice(0, 60));
    // 1s 后变 read
    setTimeout(() => {
      if (activeIdRef.current === activeId) patchMessage(activeId, id, { status: "read" });
    }, 1000);
    // 800-1600ms 后对方回复
    const replyDelay = 1400 + Math.random() * 1500;
    setTimeout(() => {
      if (activeIdRef.current !== activeId) return;
      const reply: DemoMessage = {
        id: `local_r_${Date.now()}`,
        conversationId: activeId,
        senderSide: "them", type: "text",
        originalText: pickAutoReply(conv.peerName, locale),
        originalLanguage: locale === "zh" ? "zh" : "en",
        status: "delivered", createdAt: new Date().toISOString(),
      };
      appendMessage(activeId, reply, (reply.originalText ?? "").slice(0, 60));
    }, replyDelay);
  }, [activeId, state.convos, appendMessage, patchMessage, locale]);

  const sendImage = useCallback((imageUrl: string) => {
    if (!activeId) return;
    const id = `local_img_${Date.now()}`;
    const msg: DemoMessage = {
      id, conversationId: activeId, senderSide: "me", type: "image",
      imageUrl, imageAlt: "shared photo",
      status: "sent", createdAt: new Date().toISOString(),
    };
    appendMessage(activeId, msg, locale === "zh" ? "[图片]" : "[Photo]");
    setTimeout(() => {
      if (activeIdRef.current === activeId) patchMessage(activeId, id, { status: "read" });
    }, 1200);
  }, [activeId, appendMessage, patchMessage, locale]);

  const sendVoice = useCallback((duration: number) => {
    if (!activeId) return;
    const id = `local_v_${Date.now()}`;
    const msg: DemoMessage = {
      id, conversationId: activeId, senderSide: "me", type: "voice",
      voiceDuration: Math.max(1, Math.round(duration)),
      status: "sent", createdAt: new Date().toISOString(),
    };
    appendMessage(activeId, msg, locale === "zh" ? "[语音]" : "[Voice]");
    setTimeout(() => {
      if (activeIdRef.current === activeId) patchMessage(activeId, id, { status: "read" });
    }, 1200);
  }, [activeId, appendMessage, patchMessage, locale]);

  const appendCallRecord = useCallback((callType: "voice" | "video", duration: number) => {
    if (!activeId) return;
    const id = `local_c_${Date.now()}`;
    const msg: DemoMessage = {
      id, conversationId: activeId, senderSide: "system", type: "call",
      callType, callDuration: Math.max(0, Math.round(duration)),
      callResult: "ended",
      createdAt: new Date().toISOString(),
    };
    const preview = callType === "voice"
      ? (locale === "zh" ? "[语音通话]" : "[Voice call]")
      : (locale === "zh" ? "[视频通话]" : "[Video call]");
    appendMessage(activeId, msg, preview);
  }, [activeId, appendMessage, locale]);

  const openConversation = useCallback((id: string) => {
    setActiveId(id);
    markRead(id);
  }, [markRead]);

  const upsertConversationForPeer = useCallback((peerName: string, peerAvatarSeed: string, peerHandle: string) => {
    // 若已存在同 handle 则激活;否则新建
    setState((prev) => {
      const existing = prev.convos.find((c) => c.peerHandle === peerHandle);
      if (existing) {
        setActiveId(existing.id);
        return prev;
      }
      const newConv: DemoConversation = {
        id: `cv_new_${Date.now()}`,
        peerName, peerAvatarSeed, peerHandle,
        verified: false, languages: [locale],
        online: false, lastActiveMinutesAgo: 0,
        unreadCount: 0,
        lastMessagePreview: locale === "zh" ? "开始对话" : "New conversation",
        lastMessageAt: new Date().toISOString(),
        lastMessageType: "text",
      };
      setActiveId(newConv.id);
      return {
        ...prev,
        convos: [newConv, ...prev.convos],
        messagesByConv: { ...prev.messagesByConv, [newConv.id]: [] },
      };
    });
  }, [locale]);

  return useMemo(() => ({
    convos: state.convos,
    messages,
    active,
    activeId,
    autoTranslate: state.autoTranslate,
    hydrated,
    setActiveId: openConversation,
    markRead,
    setAutoTranslate,
    sendText,
    sendImage,
    sendVoice,
    appendCallRecord,
    upsertConversationForPeer,
  }), [state, messages, active, activeId, hydrated, openConversation, markRead, setAutoTranslate, sendText, sendImage, sendVoice, appendCallRecord, upsertConversationForPeer]);
}
