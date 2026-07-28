"use client";
// 私信 · 聊天顶部信息栏
import { useTranslations } from "next-intl";
import type { DemoConversation } from "./chat/types";
import { IcoBack, IcoVerified, IcoTranslate, IcoSearch, IcoPhone, IcoVideo, IcoMore } from "./chat/icons";

interface Props {
  conv: DemoConversation;
  autoTranslate: boolean;
  onToggleAutoTranslate: () => void;
  onToggleSearch: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onBackMobile: () => void;
  locale: "zh" | "en";
}

export default function ChatHeader({
  conv, autoTranslate, onToggleAutoTranslate, onToggleSearch,
  onVoiceCall, onVideoCall, onBackMobile, locale,
}: Props) {
  const t = useTranslations("messages");
  const status = conv.online
    ? t("online")
    : conv.lastActiveMinutesAgo != null
      ? t("lastActiveAgo", { time: fmtGap(conv.lastActiveMinutesAgo, locale) })
      : "";

  return (
    <header className="ch-h">
      <button type="button" className="ch-back" onClick={onBackMobile} aria-label={t("back")}>
        <IcoBack />
      </button>
      <div className="ch-ava">
        <span className="ch-ava-t">{conv.peerAvatarSeed}</span>
        {conv.online && <span className="ch-online" aria-label={t("online")} />}
      </div>
      <div className="ch-body">
        <div className="ch-name">
          <b>{conv.peerName}</b>
          {conv.verified && <IcoVerified width={14} height={14} />}
        </div>
        <span className={"ch-status" + (conv.online ? " on" : "")} suppressHydrationWarning>{status}</span>
      </div>
      <div className="ch-actions">
        <button type="button" className={"ch-btn" + (autoTranslate ? " on" : "")}
          onClick={onToggleAutoTranslate} title={t("autoTranslate")} aria-pressed={autoTranslate}>
          <IcoTranslate />
        </button>
        <button type="button" className="ch-btn" onClick={onToggleSearch} title={t("searchMessages")}>
          <IcoSearch />
        </button>
        <button type="button" className="ch-btn" onClick={onVoiceCall} title={t("voiceCall")}>
          <IcoPhone />
        </button>
        <button type="button" className="ch-btn" onClick={onVideoCall} title={t("videoCall")}>
          <IcoVideo />
        </button>
        <button type="button" className="ch-btn" title={t("more")} disabled>
          <IcoMore />
        </button>
      </div>
    </header>
  );
}

function fmtGap(minutes: number, locale: "zh" | "en"): string {
  if (minutes < 60) return locale === "zh" ? `${minutes} 分钟` : `${minutes} min`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return locale === "zh" ? `${h} 小时` : `${h} h`;
  const d = Math.floor(h / 24);
  return locale === "zh" ? `${d} 天` : `${d} d`;
}
