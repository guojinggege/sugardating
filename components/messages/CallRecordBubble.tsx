"use client";
// 私信 · 通话记录气泡 · 系统消息 · 居中显示
import { useTranslations } from "next-intl";
import type { DemoMessage } from "./chat/types";
import { fmtClock, fmtDuration } from "./chat/utils";
import { IcoPhone, IcoVideo } from "./chat/icons";

interface Props { msg: DemoMessage; }

export default function CallRecordBubble({ msg }: Props) {
  const t = useTranslations("messages");
  const type = msg.callType ?? "voice";
  const dur = msg.callDuration ?? 0;
  const label = type === "voice"
    ? t("voiceCallEndedWith", { time: fmtDuration(dur) })
    : t("videoCallEndedWith", { time: fmtDuration(dur) });
  return (
    <div className="mb mb-sys">
      <div className="mb-call">
        {type === "voice" ? <IcoPhone width={14} height={14} /> : <IcoVideo width={14} height={14} />}
        <span>{label}</span>
        <time suppressHydrationWarning>· {fmtClock(msg.createdAt)}</time>
      </div>
    </div>
  );
}
