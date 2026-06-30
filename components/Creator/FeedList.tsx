// 动态 Feed 流 — 帖子卡:时间 / 文字 / 9 宫格图 / 视频 / 点赞 / 收藏 / 分享 / 评论
// MVP: 服务端渲染 + 客户端交互 widget (FeedActions)
import { getTranslations } from "next-intl/server";
import Img from "@/components/Img";
import FeedActions from "./FeedActions";
import type { FeedPost } from "@/lib/creatorProfileMock";

interface Props {
  authorName: string;
  authorAvatar: string;
  posts: FeedPost[];
}

export default async function FeedList({ authorName, authorAvatar, posts }: Props) {
  const t = await getTranslations("creatorProfile.feed");
  return (
    <div className="cr-feed">
      {posts.map((p) => (
        <article key={p.id} className="cr-post">
          <header className="cr-post-h">
            <div className="cr-post-ava">
              <Img src={authorAvatar} alt={authorName} sizes="40px" />
            </div>
            <div className="cr-post-meta">
              <div className="cr-post-name">{authorName}</div>
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
