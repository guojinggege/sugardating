// 动态 Feed 流 — 帖子卡:头像(48,可点跳 Creator 主页)/name/time/文字/9 宫格/视频/交互按钮
// 用 creator 真实 avatar (从 page 传下,与 Header 一致)
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Img from "@/components/Img";
import FeedActions from "./FeedActions";
import type { FeedPost } from "@/lib/creatorProfileMock";

interface Props {
  authorName: string;
  authorAvatar: string;
  authorSlug: string;   // 供头像/名字点击跳自己主页
  posts: FeedPost[];
}

export default async function FeedList({ authorName, authorAvatar, authorSlug, posts }: Props) {
  const t = await getTranslations("creatorProfile.feed");
  return (
    <div className="cr-feed">
      {posts.map((p) => (
        <article key={p.id} className="cr-post">
          <header className="cr-post-h">
            <Link href={`/creators/${authorSlug}`} className="cr-post-ava" aria-label={authorName}>
              <Img src={authorAvatar} alt={authorName} sizes="48px" />
            </Link>
            <div className="cr-post-meta">
              <Link href={`/creators/${authorSlug}`} className="cr-post-name">{authorName}</Link>
              <div className="cr-post-time">{p.time}</div>
            </div>
          </header>
          <p className="cr-post-text">{p.text}</p>
          {p.videoCover && (
            <div className="cr-post-video">
              <Img src={p.videoCover} alt={authorName} sizes="(max-width: 768px) 100vw, 640px" />
              <span className="cr-post-play" aria-hidden>
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
          )}
          {p.images.length > 0 && (
            <div className={`cr-post-grid g-${Math.min(p.images.length, 9)}`}>
              {p.images.slice(0, 9).map((src, i) => (
                <div key={i} className="cr-post-img">
                  <Img src={src} alt={`${authorName} ${i + 1}`} sizes="(max-width: 768px) 33vw, 200px" />
                </div>
              ))}
            </div>
          )}
          <FeedActions postId={p.id} likes={p.likes} comments={p.comments} />
        </article>
      ))}
      <div className="cr-feed-end">{t("end")}</div>
    </div>
  );
}
