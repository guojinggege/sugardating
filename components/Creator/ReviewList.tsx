"use client";
// 评价列表 — 复用 DB Comment 数据,展示为带评分 + 头像首字的评价
// 客户端分页 (每页 5 条) + 顶部 ReviewsHeader (Overall/Verified/Photo/Latest)
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ReviewsHeader from "./ReviewsHeader";

export interface ReviewItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Props {
  reviews: ReviewItem[];
  pageSize?: number;
  overallRating?: number;
}

function timeAgo(d: Date, locale: string): string {
  const diff = Date.now() - d.getTime();
  const min = 60_000, hour = 60 * min, day = 24 * hour;
  if (locale === "zh") {
    if (diff < min) return "刚刚";
    if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
    if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
    return d.toLocaleDateString("zh-CN");
  }
  if (diff < min) return "just now";
  if (diff < hour) return `${Math.floor(diff / min)} min ago`;
  if (diff < day) return `${Math.floor(diff / hour)} h ago`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} d ago`;
  return d.toLocaleDateString("en-US");
}

// 评分:基于 author name 派生 4-5 星 deterministic
function deriveRating(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return 4 + (Math.abs(h) % 2);
}

export default function ReviewList({ reviews, pageSize = 5, overallRating = 4.98 }: Props) {
  const t = useTranslations("creatorProfile.reviews");
  const [locale] = useState<string>(() =>
    typeof document !== "undefined" && /lang="zh/.test(document.documentElement.outerHTML.slice(0, 200)) ? "zh" : "en"
  );
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));
  const visible = useMemo(
    () => reviews.slice(0, page * pageSize),
    [reviews, page, pageSize]
  );
  const hasMore = page < totalPages;

  const totalDisplayed = Math.max(reviews.length, 24);
  const verified = Math.round(totalDisplayed * 0.85);
  const withPhoto = Math.round(totalDisplayed * 0.36);

  return (
    <div className="cr-reviews">
      <ReviewsHeader
        overall={overallRating}
        total={totalDisplayed}
        verified={verified}
        withPhoto={withPhoto}
      />
      {reviews.length === 0 && <div className="cr-empty">{t("empty")}</div>}
      {visible.map((r) => {
        const rating = deriveRating(r.authorName);
        return (
          <article key={r.id} className="cr-review">
            <div className="cr-review-ava" aria-hidden>{r.authorName.charAt(0)}</div>
            <div className="cr-review-body">
              <header className="cr-review-h">
                <b>{r.authorName}</b>
                <span className="cr-review-stars" aria-label={`${rating}/5`}>
                  {"★".repeat(rating)}<span className="cr-stars-dim">{"★".repeat(5 - rating)}</span>
                </span>
                <time className="cr-review-time">{timeAgo(r.createdAt, locale)}</time>
              </header>
              <p className="cr-review-text">{r.content}</p>
            </div>
          </article>
        );
      })}
      {hasMore && (
        <div className="cr-review-more">
          <button type="button" className="cr-btn-ghost" onClick={() => setPage((p) => p + 1)}>
            {t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
}
