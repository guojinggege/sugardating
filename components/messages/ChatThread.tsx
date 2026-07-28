"use client";
// 私信 · 消息滚动区 · 日期分隔 · 支持搜索高亮 + 跳转
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import type { DemoMessage, ChatLang } from "./chat/types";
import { dayKey } from "./chat/utils";
import MessageBubble from "./MessageBubble";
import VoiceMessageBubble from "./VoiceMessageBubble";
import CallRecordBubble from "./CallRecordBubble";

interface Props {
  messages: DemoMessage[];
  locale: ChatLang;
  autoTranslate: boolean;
  searchQuery: string;
  activeHitId: string | null;
}

export default function ChatThread({ messages, locale, autoTranslate, searchQuery, activeHitId }: Props) {
  const t = useTranslations("messages");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    if (!activeHitId) return;
    const el = document.getElementById(`msg-${activeHitId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeHitId]);

  const dayGrouped = useMemo(() => {
    let last = "";
    return messages.map((m) => {
      const dk = dayKey(m.createdAt, locale);
      const showDay = dk !== last;
      last = dk;
      return { m, showDay, dk };
    });
  }, [messages, locale]);

  return (
    <div className="ct-scroll" ref={scrollRef}>
      {messages.length === 0 && (
        <div className="ct-empty">{t("emptyThread")}</div>
      )}
      {dayGrouped.map(({ m, showDay, dk }) => (
        <Fragment key={m.id}>
          {showDay && <div className="ct-day" suppressHydrationWarning><span>{dk}</span></div>}
          <div id={`msg-${m.id}`} className={"ct-slot" + (activeHitId === m.id ? " ct-slot--hit" : "")}>
            {m.type === "call" && <CallRecordBubble msg={m} />}
            {m.type === "voice" && <VoiceMessageBubble msg={m} isMe={m.senderSide === "me"} />}
            {(m.type === "text" || m.type === "image") && (
              <MessageBubble msg={m} locale={locale} autoTranslate={autoTranslate}
                highlight={searchQuery} isMe={m.senderSide === "me"} />
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
