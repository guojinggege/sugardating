"use client";
// 标准分享按钮 · 各页面统一调用 · 44px 圆形 icon button
import { useShare, type SharePayload } from "./ShareProvider";

interface Props {
  payload: SharePayload;
  className?: string;
  label?: string;
  variant?: "icon" | "chip";
}

export default function ShareButton({ payload, className, label = "分享", variant = "icon" }: Props) {
  const { openShare } = useShare();
  return (
    <button
      type="button"
      onClick={() => openShare(payload)}
      aria-label="分享"
      className={"sbtn sbtn--" + variant + (className ? " " + className : "")}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
      </svg>
      {variant === "chip" && <span>{label}</span>}
      <style>{`
        .sbtn{display:inline-flex;align-items:center;gap:6px;background:transparent;border:0;cursor:pointer;color:inherit;font:inherit;padding:0}
        .sbtn:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:50%}
        .sbtn--icon{width:40px;height:40px;justify-content:center;border-radius:50%;transition:background .12s}
        .sbtn--icon:hover{background:rgba(0,0,0,.06)}
        .sbtn--chip{padding:6px 12px;border:1px solid #E9E3DA;border-radius:99px;font-size:12.5px;font-weight:700;color:#171512;background:#fff}
        .sbtn--chip:hover{border-color:#171512}
      `}</style>
    </button>
  );
}
