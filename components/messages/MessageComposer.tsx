"use client";
// 私信 · 底部输入区 · 表情 / 图片预览 / 语音录制 / 发送
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IcoSmile, IcoImage, IcoMic, IcoSend, IcoClose } from "./chat/icons";
import EmojiPicker from "./EmojiPicker";
import VoiceRecordingBar from "./VoiceRecordingBar";

interface Props {
  onSendText: (text: string) => void;
  onSendImage: (objectUrl: string) => void;
  onSendVoice: (durationSec: number) => void;
}

export default function MessageComposer({ onSendText, onSendImage, onSendVoice }: Props) {
  const t = useTranslations("messages");
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 释放 object URL · 组件卸载或替换图片时
  const prevImg = useRef<string | null>(null);
  useEffect(() => {
    if (prevImg.current && prevImg.current !== imgUrl) URL.revokeObjectURL(prevImg.current);
    prevImg.current = imgUrl;
    return () => { if (prevImg.current) URL.revokeObjectURL(prevImg.current); };
  }, [imgUrl]);

  // 自动增长 textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [text]);

  function handleSend() {
    if (imgUrl) {
      onSendImage(imgUrl);
      prevImg.current = null;                       // 交给消息列表持有 · 不 revoke
      setImgUrl(null);
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendText(trimmed);
    setText("");
  }

  function insertEmoji(e: string) {
    const el = textareaRef.current;
    if (!el) { setText((prev) => prev + e); return; }
    const start = el.selectionStart ?? text.length;
    const end   = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + e + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + e.length;
    });
  }

  function onKeyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (ev.key === "Enter" && !ev.shiftKey && !ev.nativeEvent.isComposing) {
      ev.preventDefault();
      handleSend();
    }
  }

  function onPickImage(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";                            // 允许再次选同一文件
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
  }

  if (recording) {
    return (
      <div className="mc mc--rec">
        <VoiceRecordingBar
          onCancel={() => setRecording(false)}
          onSend={(sec) => { onSendVoice(sec); setRecording(false); }}
        />
      </div>
    );
  }

  const canSend = imgUrl || text.trim().length > 0;

  return (
    <div className="mc">
      {imgUrl && (
        <div className="mc-preview">
          <img src={imgUrl} alt="preview" />
          <button type="button" className="mc-preview-x" onClick={() => setImgUrl(null)} title={t("cancel")}>
            <IcoClose />
          </button>
        </div>
      )}
      <div className="mc-row">
        <div className="mc-tools">
          <button type="button" className="mc-tool" onClick={() => setEmojiOpen((v) => !v)} title={t("emoji")}>
            <IcoSmile />
          </button>
          <button type="button" className="mc-tool" onClick={() => fileRef.current?.click()} title={t("image")}>
            <IcoImage />
          </button>
          <button type="button" className="mc-tool" onClick={() => setRecording(true)} title={t("voice")}>
            <IcoMic />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
        </div>
        <textarea
          ref={textareaRef}
          className="mc-input"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("typeMessage")}
        />
        <button type="button" className={"mc-send" + (canSend ? " on" : "")}
          disabled={!canSend} onClick={handleSend} title={t("send")}>
          <IcoSend />
        </button>
      </div>
      {emojiOpen && (
        <div className="mc-emoji-wrap">
          <EmojiPicker onPick={insertEmoji} onClose={() => setEmojiOpen(false)} />
        </div>
      )}
    </div>
  );
}
