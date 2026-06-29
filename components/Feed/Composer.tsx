"use client";
import Image from "next/image";
import { useState } from "react";

// 发布动态 composer — 当前仅 UI(占位),不接 server action,后续认证 + 发布流时接
export default function Composer({ avatar, name }: { avatar: string; name: string }) {
  const [text, setText] = useState("");
  const canPost = text.trim().length > 0;

  return (
    <div className="rounded-card border border-feed-line bg-feed-surface p-5">
      <div className="flex gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-feed-line">
          <Image src={avatar} alt={name} fill sizes="44px" className="object-cover" />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`分享一些你的近况,${name}…`}
          rows={2}
          className="min-h-[60px] flex-1 resize-y bg-transparent text-[15px] leading-relaxed text-feed-ink placeholder:text-feed-dim focus:outline-none"
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-feed-line pt-3">
        <div className="flex items-center gap-1">
          <IconBtn label="上传图片" hoverColor="hover:text-gold">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="1.7" />
              <path d="M21 17l-5-5-7 7" />
            </svg>
          </IconBtn>
          <IconBtn label="上传视频" hoverColor="hover:text-gold">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <rect x="3" y="6" width="13" height="12" rx="2" />
              <path d="M16 10l5-2v8l-5-2z" />
            </svg>
          </IconBtn>
          <IconBtn label="Emoji" hoverColor="hover:text-gold">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <circle cx="12" cy="12" r="9" />
              <circle cx="9" cy="10" r="0.9" fill="currentColor" />
              <circle cx="15" cy="10" r="0.9" fill="currentColor" />
              <path d="M8 14c1 2 2.5 3 4 3s3-1 4-3" />
            </svg>
          </IconBtn>
        </div>

        <button
          type="button"
          disabled={!canPost}
          className={`rounded-pill px-5 py-2 text-[13.5px] font-semibold transition ${
            canPost
              ? "bg-gold text-feed-bg hover:bg-gold-bright"
              : "cursor-not-allowed bg-feed-elevated text-feed-dim"
          }`}
        >
          发布
        </button>
      </div>
    </div>
  );
}

function IconBtn({
  children, label, hoverColor,
}: { children: React.ReactNode; label: string; hoverColor: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-feed-mute transition hover:bg-feed-elevated ${hoverColor}`}
    >
      {children}
    </button>
  );
}
