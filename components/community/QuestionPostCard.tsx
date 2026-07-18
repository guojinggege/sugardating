import Link from "next/link";
import type { CommunityAuthor, CommunityPost } from "@/lib/community/types";

interface Props {
  post: CommunityPost;
  author?: CommunityAuthor;
  variant?: "default" | "compact";
}

function fmtAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  return `${Math.floor(d / 30)} 月前`;
}

export default function QuestionPostCard({ post, author, variant = "default" }: Props) {
  const bodyPreview = post.body.slice(0, 200);
  const isAnon = post.isAnonymous;
  const name = isAnon ? "匿名读者" : (author?.name || "Sugardating 用户");
  const isCompact = variant === "compact";
  const hasAcceptedAnswer = !!post.acceptedAnswerId;
  const isUnanswered = post.answerCount === 0;

  return (
    <article className={"qc" + (isCompact ? " qc--compact" : "")}>
      <div className="qc-accent" aria-hidden />
      <div className="qc-body">
        <div className="qc-h">
          <span className="qc-badge qc-badge--qa">问答专区</span>
          {hasAcceptedAnswer && <span className="qc-badge qc-badge--ok">已有最佳答案</span>}
          {isUnanswered && <span className="qc-badge qc-badge--warn">等待第一个回答</span>}
          {isAnon && <span className="qc-badge qc-badge--anon">匿名提问</span>}
          <time className="qc-time">{fmtAgo(post.createdAt)}</time>
        </div>

        <Link href={`/community/question/${post.slug}`} className="qc-t">
          {post.title}
        </Link>
        <p className="qc-excerpt">{bodyPreview}</p>

        {!isUnanswered && !isCompact && (
          <div className="qc-top-answer">
            <div className="qc-top-h">
              最高赞回答摘要 · {post.answerCount} 条回答
            </div>
            <p className="qc-top-body">
              点击查看社区成员分享的经验与建议。回答会按帮助数、最新、最早三种维度排序。
            </p>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="qc-tags">
            {post.tags.slice(0, 4).map((t) => (
              <Link key={t} href={`/community/tag/${t}`} className="qc-chip">#{t}</Link>
            ))}
          </div>
        )}

        <div className="qc-foot">
          <div className="qc-stats">
            <span><b>{post.answerCount}</b> 回答</span>
            {post.followerCount ? <span><b>{post.followerCount}</b> 关注</span> : null}
            <span>👁 {post.viewCount.toLocaleString()}</span>
          </div>
          <div className="qc-actions">
            <span className="qc-author">by {name}</span>
            <Link href={`/community/question/${post.slug}`} className="qc-btn">
              {isUnanswered ? "回答问题" : `查看 ${post.answerCount} 个回答`}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .qc{background:#fff;border:1px solid #E9E3DA;border-radius:20px;overflow:hidden;display:flex;transition:transform .18s,box-shadow .18s,border-color .18s;position:relative}
        .qc:hover{transform:translateY(-1px);border-color:#C9D0DE;box-shadow:0 12px 30px -20px rgba(23,21,18,.14)}
        .qc-accent{width:4px;background:linear-gradient(180deg,#667A9B,#8C9EBF);flex-shrink:0}
        .qc-body{flex:1;padding:22px 24px;display:flex;flex-direction:column;gap:12px;min-width:0}
        .qc--compact .qc-body{padding:16px 18px;gap:8px}

        .qc-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .qc-badge{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;padding:3px 10px;border-radius:999px}
        .qc-badge--qa{background:rgba(102,122,155,.12);color:#4B5E80}
        .qc-badge--ok{background:rgba(66,133,107,.14);color:#2B6249}
        .qc-badge--warn{background:rgba(183,121,69,.16);color:#7A4C27}
        .qc-badge--anon{background:rgba(119,113,106,.12);color:#544f47}
        .qc-time{margin-left:auto;font-size:11.5px;color:#a19a91;font-variant-numeric:tabular-nums}

        .qc-t{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:22px;line-height:1.32;color:#171512;letter-spacing:-0.008em;text-decoration:none;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .qc--compact .qc-t{font-size:17px}
        .qc-t:hover{color:#4B5E80}
        .qc-excerpt{font-size:14.5px;line-height:1.7;color:#3d3a35;margin:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}
        .qc--compact .qc-excerpt{-webkit-line-clamp:2;font-size:13.5px}

        .qc-top-answer{background:#F7F9FC;border-radius:12px;padding:12px 14px}
        .qc-top-h{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#4B5E80;font-weight:700;margin-bottom:4px}
        .qc-top-body{font-size:13px;line-height:1.6;color:#3d3a35;margin:0}

        .qc-tags{display:flex;flex-wrap:wrap;gap:4px}
        .qc-chip{padding:3px 10px;background:#F7F4EF;border:1px solid #E9E3DA;border-radius:999px;font-size:11px;color:#77716A;font-weight:500;text-decoration:none}
        .qc-chip:hover{background:#EFE7D8;color:#171512}

        .qc-foot{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px dashed #F0EAE1;gap:12px;flex-wrap:wrap}
        .qc-stats{display:inline-flex;gap:14px;font-size:12px;color:#77716A}
        .qc-stats b{color:#171512;font-weight:700;font-variant-numeric:tabular-nums}
        .qc-actions{display:inline-flex;align-items:center;gap:12px;margin-left:auto}
        .qc-author{font-size:11.5px;color:#a19a91}
        .qc-btn{padding:7px 14px;background:#171512;color:#F5EEDD;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:-0.005em;transition:background .12s}
        .qc-btn:hover{background:#2b2822}
      `}</style>
    </article>
  );
}
