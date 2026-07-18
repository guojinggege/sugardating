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

function authorInitial(name: string): string {
  return name.trim().slice(0, 1);
}

export default function StoryPostCard({ post, author, variant = "default" }: Props) {
  const excerpt = post.excerpt || post.body.slice(0, 200);
  const reactionsTotal = Object.values(post.reactionCounts).reduce((s, n) => s + (n ?? 0), 0);
  const isAnon = post.isAnonymous;
  const name = isAnon ? "匿名读者" : (author?.name || "Sugardating 用户");
  const isCompact = variant === "compact";

  return (
    <article className={"sc" + (isCompact ? " sc--compact" : "")}>
      <div className="sc-h">
        <span className="sc-badge sc-badge--story">情感私话</span>
        {isAnon && <span className="sc-badge sc-badge--anon">匿名</span>}
        <div className="sc-author">
          <span className={"sc-avatar" + (isAnon ? " is-anon" : "")}>
            {isAnon ? "?" : authorInitial(name)}
          </span>
          <span className="sc-name">{name}</span>
          {!isAnon && author?.type === "sugargirl" && <span className="sc-tag">sugargirl</span>}
          {!isAnon && author?.type === "sugarboy" && <span className="sc-tag">sugarboy</span>}
          {!isAnon && author?.isVerified && <span className="sc-verified" title="Verified">✓</span>}
        </div>
        <time className="sc-time">{fmtAgo(post.createdAt)}</time>
      </div>

      <Link href={`/community/story/${post.slug}`} className="sc-t">
        {post.title}
      </Link>
      <p className="sc-excerpt">{excerpt}</p>

      {post.tags.length > 0 && (
        <div className="sc-tags">
          {post.tags.slice(0, 4).map((t) => (
            <Link key={t} href={`/community/tag/${t}`} className="sc-chip">#{t}</Link>
          ))}
        </div>
      )}

      <div className="sc-foot">
        <div className="sc-react">
          <ReactionBtn icon="♥" count={post.reactionCounts.empathy} label="同感" />
          <ReactionBtn icon="✧" count={post.reactionCounts.insight} label="有启发" />
          <ReactionBtn icon="+" count={post.reactionCounts["want-more"]} label="想听后续" />
        </div>
        <div className="sc-stats">
          <span>💬 {post.commentCount}</span>
          <span>👁 {post.viewCount.toLocaleString()}</span>
          {reactionsTotal > 100 && <span className="sc-hot">Hot</span>}
        </div>
      </div>

      <style>{`
        .sc{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:22px 24px;display:flex;flex-direction:column;gap:12px;transition:transform .18s,box-shadow .18s,border-color .18s}
        .sc:hover{transform:translateY(-1px);border-color:#DACFBE;box-shadow:0 12px 30px -20px rgba(23,21,18,.14)}
        .sc--compact{padding:16px 18px;gap:8px}

        .sc-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:#77716A}
        .sc-badge{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;padding:3px 10px;border-radius:999px}
        .sc-badge--story{background:rgba(169,111,120,.12);color:#8C4B54}
        .sc-badge--anon{background:rgba(119,113,106,.12);color:#544f47}
        .sc-author{display:inline-flex;align-items:center;gap:6px}
        .sc-avatar{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#DACFBE,#B8AA95);color:#171512;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
        .sc-avatar.is-anon{background:#F5EEDD;color:#a19a91}
        .sc-name{font-weight:600;color:#3d3a35}
        .sc-tag{background:#F7F4EF;border:1px solid #E9E3DA;color:#77716A;padding:1px 6px;border-radius:4px;font-size:10.5px;font-weight:700}
        .sc-verified{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;background:#42856B;color:#fff;font-size:9px;border-radius:50%;font-weight:800}
        .sc-time{margin-left:auto;font-size:11.5px;color:#a19a91;font-variant-numeric:tabular-nums}

        .sc-t{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:22px;line-height:1.32;color:#171512;letter-spacing:-0.008em;text-decoration:none;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .sc--compact .sc-t{font-size:17px}
        .sc-t:hover{color:#8C4B54}
        .sc-excerpt{font-size:14.5px;line-height:1.7;color:#3d3a35;margin:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical}
        .sc--compact .sc-excerpt{-webkit-line-clamp:2;font-size:13.5px}

        .sc-tags{display:flex;flex-wrap:wrap;gap:4px}
        .sc-chip{padding:3px 10px;background:#F7F4EF;border:1px solid #E9E3DA;border-radius:999px;font-size:11px;color:#77716A;font-weight:500;text-decoration:none;transition:background .12s}
        .sc-chip:hover{background:#EFE7D8;color:#171512}

        .sc-foot{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px dashed #F0EAE1;gap:8px}
        .sc-react{display:inline-flex;gap:4px;flex-wrap:wrap}
        .sc-stats{display:inline-flex;gap:12px;font-size:11.5px;color:#a19a91;font-variant-numeric:tabular-nums}
        .sc-hot{background:linear-gradient(135deg,#EEDDB8,#C5A56A);color:#2A1D0A;padding:1px 8px;border-radius:999px;font-weight:800;font-size:10.5px;letter-spacing:.04em}
      `}</style>
    </article>
  );
}

function ReactionBtn({ icon, count, label }: { icon: string; count?: number; label: string }) {
  if (!count) return null;
  return (
    <span className="rb" title={label}>
      <span className="rb-ic">{icon}</span>
      <span className="rb-n">{count}</span>
      <style>{`
        .rb{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#FBF7EF;border:1px solid #EFE7D8;border-radius:999px;font-size:11.5px;color:#3d3a35;font-weight:600}
        .rb-ic{color:#A96F78;font-weight:700}
        .rb-n{font-variant-numeric:tabular-nums}
      `}</style>
    </span>
  );
}
