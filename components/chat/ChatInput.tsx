"use client";
import { useState, KeyboardEvent } from "react";
import type { SupportedLocale } from "@/lib/translation";
import { LOCALE_LABEL } from "@/lib/translation";

interface Props {
  disabled?: boolean;
  translateTo?: SupportedLocale;
  onChangeTranslateTo: (v: SupportedLocale | undefined) => void;
  creatorLang: SupportedLocale;
  onSend: (text: string) => void;
}

const LOCALES: SupportedLocale[] = ["zh", "en", "th", "vi", "fil"];

export default function ChatInput({ disabled, translateTo, onChangeTranslateTo, creatorLang, onSend }: Props) {
  const [text, setText] = useState("");
  const [showLang, setShowLang] = useState(false);

  function submit() {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  }
  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  return (
    <div className="ci">
      <div className="ci-toolbar">
        <button
          type="button"
          className={`ci-toggle ${translateTo ? "is-on" : ""}`}
          onClick={() => setShowLang((v) => !v)}
          disabled={disabled}
          title="翻译发送"
        >
          🌐 {translateTo ? `→ ${LOCALE_LABEL[translateTo]}` : "翻译"}
        </button>
        {showLang && (
          <div className="ci-lang">
            <button className="ci-lang-item" onClick={() => { onChangeTranslateTo(undefined); setShowLang(false); }}>关闭翻译</button>
            {LOCALES.map((l) => (
              <button
                key={l}
                className={`ci-lang-item ${translateTo === l ? "is-active" : ""}`}
                onClick={() => { onChangeTranslateTo(l); setShowLang(false); }}
              >
                → {LOCALE_LABEL[l]} {l === creatorLang ? "· 对方主语言" : ""}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ci-row">
        <textarea
          className="ci-textarea"
          placeholder={disabled ? "请先登录后再发送" : "输入消息…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          rows={1}
          maxLength={2000}
        />
        <button className="ci-send" onClick={submit} disabled={disabled || !text.trim()} aria-label="发送">
          ↑
        </button>
      </div>

      <style jsx>{`
        .ci{position:relative;background:#fff;border-top:1px solid #E8E8EC}
        .ci-toolbar{display:flex;gap:6px;padding:6px 10px 0;position:relative}
        .ci-toggle{background:#F4F4F5;border:1px solid #E8E8EC;color:#161618;font-size:12px;padding:4px 10px;border-radius:99px;cursor:pointer}
        .ci-toggle.is-on{background:#161618;color:#EEDDB8;border-color:#161618}
        .ci-toggle:disabled{opacity:.5;cursor:not-allowed}
        .ci-lang{position:absolute;bottom:calc(100% + 6px);left:10px;background:#fff;border:1px solid #E8E8EC;border-radius:12px;padding:6px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:20;min-width:200px;display:flex;flex-direction:column;gap:2px}
        .ci-lang-item{background:none;border:none;text-align:left;padding:8px 10px;font-size:13px;color:#161618;border-radius:8px;cursor:pointer;white-space:nowrap}
        .ci-lang-item:hover{background:#F4F4F5}
        .ci-lang-item.is-active{background:#161618;color:#EEDDB8}
        .ci-row{display:flex;align-items:flex-end;gap:8px;padding:8px 10px 10px}
        .ci-textarea{flex:1;resize:none;border:1px solid #E8E8EC;border-radius:14px;padding:10px 12px;font:inherit;font-size:14px;line-height:1.4;background:#F8F8F9;color:#161618;outline:none;max-height:120px;min-height:40px}
        .ci-textarea:focus{border-color:#161618;background:#fff}
        .ci-textarea:disabled{opacity:.6;background:#F4F4F5;cursor:not-allowed}
        .ci-send{width:40px;height:40px;border-radius:50%;background:#161618;color:#EEDDB8;border:none;font-size:18px;font-weight:700;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:transform .1s}
        .ci-send:hover:not(:disabled){transform:scale(1.05)}
        .ci-send:disabled{background:#E8E8EC;color:#8a8a92;cursor:not-allowed}
      `}</style>
    </div>
  );
}
