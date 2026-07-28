"use client";
// 私信 · 单条文本 / 图片气泡 · 含翻译展开
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoMessage, ChatLang } from "./chat/types";
import { fmtClock } from "./chat/utils";
import { IcoCheck, IcoCheck2 } from "./chat/icons";

interface Props {
  msg: DemoMessage;
  locale: ChatLang;
  autoTranslate: boolean;
  highlight?: string;               // 搜索关键字 · 高亮
  isMe: boolean;
}

export default function MessageBubble({ msg, locale, autoTranslate, highlight, isMe }: Props) {
  const t = useTranslations("messages");
  const [manualShown, setManualShown] = useState(false);
  const targetLang: ChatLang = locale;
  const hasTranslation = !!msg.translations?.[targetLang];
  const needsTranslate = msg.originalLanguage && msg.originalLanguage !== targetLang && hasTranslation;
  const translationShown = needsTranslate && (autoTranslate || manualShown);
  const translated = translationShown ? msg.translations?.[targetLang] ?? "" : "";

  return (
    <div className={"mb" + (isMe ? " me" : " them")}>
      {msg.type === "image" && msg.imageUrl && (
        <div className="mb-bubble mb-bubble--img">
          <img src={msg.imageUrl} alt={msg.imageAlt ?? ""} />
        </div>
      )}
      {msg.type === "text" && (
        <div className="mb-bubble">
          <p className="mb-text">{renderHighlight(msg.originalText ?? "", highlight)}</p>
          {translationShown && (
            <div className="mb-trans">
              <span className="mb-trans-tag">{t("translationTag")}</span>
              <p>{renderHighlight(translated, highlight)}</p>
            </div>
          )}
          {needsTranslate && !autoTranslate && (
            <button type="button" className="mb-trans-btn"
              onClick={() => setManualShown((v) => !v)}>
              {manualShown ? t("hideTranslation") : t("translate")}
            </button>
          )}
        </div>
      )}
      <div className="mb-meta">
        <time suppressHydrationWarning>{fmtClock(msg.createdAt)}</time>
        {isMe && msg.status && (
          <span className={"mb-status mb-status--" + msg.status}>
            {msg.status === "read" ? <IcoCheck2 width={12} height={12} /> : <IcoCheck width={12} height={12} />}
          </span>
        )}
      </div>
    </div>
  );
}

function renderHighlight(text: string, highlight?: string) {
  if (!highlight || !highlight.trim()) return text;
  const q = highlight.trim().toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="mb-hit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
