"use client";
// 私信 · 语音消息气泡 · Demo · 无真实音频 · 波形和进度前端模拟
import { useEffect, useRef, useState } from "react";
import type { DemoMessage } from "./chat/types";
import { fmtClock, fmtDuration } from "./chat/utils";
import { IcoPlay, IcoPause, IcoCheck, IcoCheck2 } from "./chat/icons";

interface Props { msg: DemoMessage; isMe: boolean; }

// 稳定的波形高度 · 基于消息 id · SSR/hydrate 一致
function bars(seed: string, count = 22): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    arr.push(24 + (h % 60));
  }
  return arr;
}

export default function VoiceMessageBubble({ msg, isMe }: Props) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);          // 0..1
  const timerRef = useRef<any>();
  const duration = msg.voiceDuration ?? 5;
  const heights = bars(msg.id);

  useEffect(() => {
    if (!playing) { clearInterval(timerRef.current); return; }
    const start = Date.now() - pos * duration * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(1, elapsed / duration);
      setPos(p);
      if (p >= 1) { setPlaying(false); setPos(0); clearInterval(timerRef.current); }
    }, 90);
    return () => clearInterval(timerRef.current);
  }, [playing, duration]);

  return (
    <div className={"mb" + (isMe ? " me" : " them")}>
      <div className="mb-bubble mb-bubble--voice">
        <button type="button" className="vm-play" onClick={() => setPlaying((v) => !v)} aria-label="play/pause">
          {playing ? <IcoPause width={16} height={16} /> : <IcoPlay width={16} height={16} />}
        </button>
        <div className="vm-wave" role="presentation">
          {heights.map((h, i) => {
            const played = i / heights.length < pos;
            return <span key={i} className={"vm-bar" + (played ? " vm-bar--on" : "")} style={{ height: h + "%" }} />;
          })}
        </div>
        <span className="vm-time">{fmtDuration(playing ? duration * pos : duration)}</span>
      </div>
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
