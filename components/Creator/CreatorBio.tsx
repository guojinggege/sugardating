"use client";
// 个人介绍 — slogan (italic quote) + bio 正文 + Read More 收展
// 超 140 字符默认收起显示前 140,点击"展开更多"完整展开
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  slogan?: string;
  bio: string;
  threshold?: number;   // 默认 140
}

export default function CreatorBio({ slogan, bio, threshold = 140 }: Props) {
  const t = useTranslations("creatorProfile.about");
  const [expanded, setExpanded] = useState(false);
  const isLong = bio.length > threshold;
  const shown = expanded || !isLong ? bio : bio.slice(0, threshold).trimEnd() + "…";

  return (
    <div>
      {slogan && (
        <p className="text-[15px] font-medium italic text-[var(--ink)] m-0 mb-3 pl-3 border-l-2 border-[var(--accent)]">
          &quot;{slogan}&quot;
        </p>
      )}
      <p className="text-[15px] leading-[1.75] text-[var(--ink2)] m-0 whitespace-pre-wrap">
        {shown}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] hover:opacity-80 transition cursor-pointer"
        >
          {expanded ? t("collapse") : t("readMore")}
          <svg
            viewBox="0 0 24 24"
            className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth={2.4}
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}
