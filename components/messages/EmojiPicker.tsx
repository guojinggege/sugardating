"use client";
// 私信 · 轻量表情选择器 · 24 个常用 · 无外部依赖
import { useEffect, useRef } from "react";
import { EMOJI_LIST } from "./chat/mockData";

interface Props { onPick: (emoji: string) => void; onClose: () => void; }

export default function EmojiPicker({ onPick, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div className="ep" ref={ref} role="dialog">
      {EMOJI_LIST.map((e) => (
        <button key={e} type="button" className="ep-btn" onClick={() => onPick(e)}>{e}</button>
      ))}
    </div>
  );
}
