"use client";
// 私信 · 语音通话 Demo 弹层 · 无 WebRTC · 前端计时
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoConversation } from "./chat/types";
import { fmtDuration } from "./chat/utils";
import { IcoMic, IcoMicOff, IcoSpeaker, IcoPhoneOff } from "./chat/icons";

interface Props {
  conv: DemoConversation;
  onClose: (durationSec: number) => void;    // 关闭时把通话时长回填给聊天记录
}

export default function VoiceCallModal({ conv, onClose }: Props) {
  const t = useTranslations("messages");
  const [connecting, setConnecting] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [sec, setSec] = useState(0);
  const startAt = useRef<number | null>(null);

  useEffect(() => {
    const to = setTimeout(() => { setConnecting(false); startAt.current = Date.now(); }, 1200);
    return () => clearTimeout(to);
  }, []);

  useEffect(() => {
    if (connecting) return;
    const id = setInterval(() => {
      if (startAt.current) setSec(Math.floor((Date.now() - startAt.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [connecting]);

  return (
    <div className="modal-scrim" role="dialog">
      <div className="modal-card mc-voice">
        <div className="mv-ava">{conv.peerAvatarSeed}</div>
        <h2 className="mv-name">{conv.peerName}</h2>
        <div className="mv-status" suppressHydrationWarning>
          {connecting ? t("callingWithName", { name: conv.peerName }) : fmtDuration(sec)}
        </div>
        <div className="mv-actions">
          <button type="button" className={"mv-btn" + (muted ? " on" : "")} onClick={() => setMuted((v) => !v)}
            aria-pressed={muted} title={t("mute")}>
            {muted ? <IcoMicOff /> : <IcoMic />}
          </button>
          <button type="button" className={"mv-btn" + (speaker ? " on" : "")} onClick={() => setSpeaker((v) => !v)}
            aria-pressed={speaker} title={t("speaker")}>
            <IcoSpeaker />
          </button>
          <button type="button" className="mv-btn mv-hang" onClick={() => onClose(connecting ? 0 : sec)}
            title={t("endCall")}>
            <IcoPhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
}
