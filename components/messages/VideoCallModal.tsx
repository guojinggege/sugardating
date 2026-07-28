"use client";
// 私信 · 视频通话 Demo 弹层 · 无摄像头 · 无 WebRTC
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoConversation } from "./chat/types";
import { fmtDuration } from "./chat/utils";
import { IcoMic, IcoMicOff, IcoVideo, IcoVideoOff, IcoLayout, IcoPhoneOff } from "./chat/icons";

interface Props {
  conv: DemoConversation;
  onClose: (durationSec: number) => void;
}

export default function VideoCallModal({ conv, onClose }: Props) {
  const t = useTranslations("messages");
  const [connecting, setConnecting] = useState(true);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [flipped, setFlipped] = useState(false);          // 布局切换
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
    <div className="modal-scrim modal-scrim--dark" role="dialog">
      <div className={"video-stage" + (flipped ? " flipped" : "")}>
        <div className="video-main">
          <div className="video-avatar-lg">{conv.peerAvatarSeed}</div>
          <div className="video-top">
            <b>{conv.peerName}</b>
            <span suppressHydrationWarning>{connecting ? t("videoCalling") : fmtDuration(sec)}</span>
          </div>
        </div>
        <div className="video-pip">
          {camOff ? <span className="video-pip-avatar">M</span> : <div className="video-pip-cam" />}
        </div>
      </div>
      <div className="video-actions">
        <button type="button" className={"mv-btn" + (muted ? " on" : "")} onClick={() => setMuted((v) => !v)} title={t("mute")}>
          {muted ? <IcoMicOff /> : <IcoMic />}
        </button>
        <button type="button" className={"mv-btn" + (camOff ? " on" : "")} onClick={() => setCamOff((v) => !v)} title={t("camera")}>
          {camOff ? <IcoVideoOff /> : <IcoVideo />}
        </button>
        <button type="button" className="mv-btn" onClick={() => setFlipped((v) => !v)} title={t("switchLayout")}>
          <IcoLayout />
        </button>
        <button type="button" className="mv-btn mv-hang" onClick={() => onClose(connecting ? 0 : sec)} title={t("endCall")}>
          <IcoPhoneOff />
        </button>
      </div>
    </div>
  );
}
