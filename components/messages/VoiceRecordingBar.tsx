"use client";
// 私信 · 语音录制 Demo · 前端计时 · 无真实麦克风权限
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fmtDuration } from "./chat/utils";
import { IcoClose, IcoSend } from "./chat/icons";

interface Props {
  onCancel: () => void;
  onSend: (durationSec: number) => void;
}

export default function VoiceRecordingBar({ onCancel, onSend }: Props) {
  const t = useTranslations("messages");
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setSec(Math.floor((Date.now() - start) / 1000)), 200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="vr">
      <button type="button" className="vr-cancel" onClick={onCancel} title={t("cancel")}>
        <IcoClose />
      </button>
      <span className="vr-pulse" aria-hidden />
      <span className="vr-label">{t("recording")}</span>
      <span className="vr-time">{fmtDuration(sec)}</span>
      <button type="button" className="vr-send" onClick={() => onSend(Math.max(1, sec))} title={t("sendVoice")}>
        <IcoSend />
      </button>
    </div>
  );
}
