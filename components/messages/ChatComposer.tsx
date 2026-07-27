"use client";
// 精简聊天输入区 · 只保留 文字 · 语音 · 视频 · 表情
// spec §四:图片/GIF/文件/日历/标签/@/Aa 等复杂能力已全部移除
import { useEffect, useRef, useState } from "react";

interface Props {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

const EMOJIS = [
  "😊", "😍", "🥰", "😘", "😉", "😌", "😎", "🤗",
  "❤️", "💕", "💖", "✨", "🌹", "🎁", "🥂", "☕",
  "🌙", "☀️", "🍷", "🌸", "💐", "🎈", "🎀", "💌",
  "👋", "🙏", "👍", "🤝", "💫", "🌟", "🌷", "🕯️",
];

export default function ChatComposer({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [modal, setModal] = useState<"voice" | "video" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emojiOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest?.("[data-emoji-root]")) setEmojiOpen(false);
    };
    window.addEventListener("click", onDown);
    return () => window.removeEventListener("click", onDown);
  }, [emojiOpen]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  async function submit() {
    if (!text.trim() || busy || disabled) return;
    setBusy(true);
    try { await onSend(text.trim()); setText(""); }
    finally { setBusy(false); }
  }

  function insertEmoji(e: string) {
    const el = inputRef.current;
    if (!el) { setText((t) => t + e); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + e + text.slice(end);
    setText(next);
    // Restore cursor after emoji
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + e.length;
    });
  }

  return (
    <div className="cc" data-composer>
      <div className="cc-tools">
        <button type="button" className="cc-tool" aria-label="表情" title="表情"
          onClick={(e) => { e.stopPropagation(); setEmojiOpen((v) => !v); }} data-emoji-root>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M9 10h.01M15 10h.01M8 15c1.5 1.5 3.5 2 4 2s2.5-.5 4-2" />
          </svg>
          {emojiOpen && (
            <div className="cc-emoji-popover" role="dialog" aria-label="选择表情" data-emoji-root onClick={(e) => e.stopPropagation()}>
              {EMOJIS.map((e) => (
                <button key={e} type="button" className="cc-emoji-item"
                  onClick={() => { insertEmoji(e); setEmojiOpen(false); }}
                >{e}</button>
              ))}
            </div>
          )}
        </button>
        <button type="button" className="cc-tool" aria-label="语音" title="语音消息" onClick={() => setModal("voice")}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
          </svg>
        </button>
        <button type="button" className="cc-tool" aria-label="视频" title="视频通话" onClick={() => setModal("video")}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10l6-3v10l-6-3z" />
          </svg>
        </button>
      </div>

      <form className="cc-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="输入消息…"
          maxLength={500}
          disabled={disabled || busy}
          aria-label="消息输入"
        />
        <button type="submit" disabled={!text.trim() || busy || disabled} className="cc-send">
          {busy ? "…" : "发送"}
        </button>
      </form>

      {modal && (
        <>
          <div className="cc-veil" onClick={() => setModal(null)} aria-hidden />
          <div className="cc-modal" role="dialog" aria-modal="true" aria-label={modal === "voice" ? "语音消息" : "视频通话"}>
            <button type="button" onClick={() => setModal(null)} className="cc-modal-x" aria-label="关闭">×</button>
            <div className="cc-modal-ic">
              {modal === "voice" ? "🎙" : "📹"}
            </div>
            <h3>{modal === "voice" ? "语音消息" : "视频通话"}</h3>
            <p>
              {modal === "voice"
                ? "语音消息功能即将开放 · 我们正在完成音频编解码与合规处理"
                : "视频通话入口即将接入 · 完成 SDK 集成后自动开启"}
            </p>
            <div className="cc-modal-note">
              需要即时确认真实性?你可以在聊天中直接文字请求对方发送视频快速确认。
            </div>
            <button type="button" onClick={() => setModal(null)} className="cc-modal-close">知道了</button>
          </div>
        </>
      )}

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .cc{position:relative;padding:12px 18px 14px;border-top:1px solid #F0EAE1;background:#fff;display:flex;flex-direction:column;gap:8px}
  .cc-tools{display:flex;gap:2px}
  .cc-tool{position:relative;width:34px;height:34px;background:transparent;border:0;color:#77716A;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .12s,color .12s}
  .cc-tool:hover{background:#F7F4EF;color:#171512}

  .cc-emoji-popover{position:absolute;left:0;bottom:44px;z-index:20;background:#fff;border:1px solid #E9E3DA;border-radius:14px;box-shadow:0 20px 48px -20px rgba(23,21,18,.28);padding:8px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;min-width:280px}
  .cc-emoji-item{width:32px;height:32px;background:transparent;border:0;font-size:18px;line-height:1;cursor:pointer;border-radius:8px;padding:0;display:inline-flex;align-items:center;justify-content:center}
  .cc-emoji-item:hover{background:#F7F4EF}

  .cc-form{display:flex;gap:8px;align-items:center}
  .cc-form input{flex:1;padding:11px 16px;border:1px solid #E9E3DA;border-radius:99px;font:inherit;font-size:14px;color:#171512;background:#FBFAF7;outline:none}
  .cc-form input:focus{border-color:#171512;background:#fff}
  .cc-send{padding:11px 22px;background:#171512;color:#fff;border:0;border-radius:99px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}
  .cc-send:disabled{opacity:.4;cursor:not-allowed}

  .cc-veil{position:fixed;inset:0;background:rgba(10,10,12,.6);backdrop-filter:blur(6px);z-index:900}
  .cc-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:901;width:min(400px,calc(100vw - 32px));background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:32px 28px 20px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.3)}
  .cc-modal-x{position:absolute;top:12px;right:14px;background:none;border:0;font-size:22px;color:#77716A;cursor:pointer;line-height:1;width:28px;height:28px;border-radius:50%}
  .cc-modal-x:hover{background:#F7F4EF;color:#171512}
  .cc-modal-ic{font-size:44px;line-height:1;margin-bottom:12px}
  .cc-modal h3{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;font-weight:600;color:#171512;margin:0 0 8px;letter-spacing:-0.008em}
  .cc-modal p{font-size:13px;line-height:1.65;color:#3d3a35;margin:0 0 12px}
  .cc-modal-note{padding:10px 14px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:10px;font-size:12px;color:#77716A;line-height:1.6;margin-bottom:16px}
  .cc-modal-close{padding:9px 22px;background:#171512;color:#fff;border:0;border-radius:99px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}
  .cc-modal-close:hover{background:#2b2822}
`;
