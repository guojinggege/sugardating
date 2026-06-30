"use client";
// 单个 post 底部的 4 个操作: 点赞 / 收藏 / 分享 / 评论
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  postId: string;
  likes: number;
  comments: number;
}

export default function FeedActions({ postId, likes: initialLikes, comments }: Props) {
  const t = useTranslations("creatorProfile.feed");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [copied, setCopied] = useState(false);

  const onLike = () => {
    setLiked((v) => {
      setLikes((n) => n + (v ? -1 : 1));
      return !v;
    });
  };
  const onShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.href}#${postId}` : "";
    if (navigator.share) {
      try { await navigator.share({ url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
    }
  };

  return (
    <footer className="cr-post-acts">
      <button type="button" onClick={onLike} className={"cr-pa" + (liked ? " on" : "")} aria-pressed={liked}>
        <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} aria-hidden>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
        </svg>
        <span className="tabular-nums">{likes.toLocaleString("en-US")}</span>
      </button>
      <button type="button" className="cr-pa" aria-label={t("comment")}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" />
        </svg>
        <span className="tabular-nums">{comments}</span>
      </button>
      <button type="button" onClick={() => setSaved((v) => !v)} className={"cr-pa" + (saved ? " on" : "")} aria-pressed={saved}>
        <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} aria-hidden>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>{t("save")}</span>
      </button>
      <button type="button" onClick={onShare} className="cr-pa cr-pa-right" aria-label={t("share")}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4" />
        </svg>
        <span>{copied ? t("copied") : t("share")}</span>
      </button>
    </footer>
  );
}
