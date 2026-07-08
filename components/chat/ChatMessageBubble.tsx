"use client";
import type { ChatMessage } from "@/lib/chat";
import { LOCALE_LABEL } from "@/lib/translation";

interface Props {
  msg: ChatMessage;
  showTranslation?: boolean;
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function ChatMessageBubble({ msg, showTranslation = true }: Props) {
  const isUser = msg.senderType === "user";
  const isSystem = msg.senderType === "system";

  if (isSystem) {
    return (
      <div className="cb-system">
        <span>{msg.text}</span>
        <style jsx>{`
          .cb-system{text-align:center;font-size:11px;color:#8a8a92;margin:8px 0}
          .cb-system span{background:rgba(0,0,0,.05);padding:4px 10px;border-radius:99px}
        `}</style>
      </div>
    );
  }

  return (
    <div className={`cb-row ${isUser ? "cb-row--user" : "cb-row--creator"}`}>
      <div className="cb-bubble">
        <div className="cb-text">{msg.text}</div>
        {showTranslation && msg.translatedText && msg.translatedTo && (
          <div className="cb-translated">
            <span className="cb-tr-label">{LOCALE_LABEL[msg.translatedTo]} · 翻译</span>
            <div>{msg.translatedText}</div>
          </div>
        )}
        <div className="cb-meta">
          <span className="cb-time">{fmtTime(msg.createdAt)}</span>
          {isUser && msg.status === "failed" && <span className="cb-status cb-failed">! 发送失败</span>}
          {isUser && msg.status !== "failed" && <span className="cb-status">{msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}</span>}
        </div>
      </div>
      <style jsx>{`
        .cb-row{display:flex;margin-bottom:8px;padding:0 4px}
        .cb-row--user{justify-content:flex-end}
        .cb-row--creator{justify-content:flex-start}
        .cb-bubble{max-width:78%;padding:9px 12px 6px;border-radius:16px;font-size:14px;line-height:1.45;position:relative;word-break:break-word;box-shadow:0 1px 2px rgba(0,0,0,.06)}
        .cb-row--user .cb-bubble{background:#161618;color:#fff;border-bottom-right-radius:4px}
        .cb-row--creator .cb-bubble{background:#fff;color:#161618;border-bottom-left-radius:4px;border:1px solid #E8E8EC}
        .cb-text{white-space:pre-wrap}
        .cb-translated{margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.15);font-size:12.5px;opacity:.86}
        .cb-row--creator .cb-translated{border-top-color:#E8E8EC}
        .cb-tr-label{font-size:10px;text-transform:uppercase;letter-spacing:.5px;opacity:.6;display:block;margin-bottom:2px}
        .cb-meta{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px;font-size:10px;opacity:.6}
        .cb-status{font-size:11px}
      `}</style>
    </div>
  );
}
