// 右侧栏 4 个模块 · 单文件多导出减少 boilerplate
import Link from "next/link";
import type { CommunityListItem, CommunityPost } from "@/lib/community/types";
import type { JournalPost } from "@/lib/journal-data";

// ══════════════════════════════════════
// 正在热议
// ══════════════════════════════════════
export function CommunityTrendingPanel({ items }: { items: CommunityListItem[] }) {
  return (
    <div className="sp">
      <div className="sp-h">
        <b>正在热议</b>
        <span>Trending</span>
      </div>
      <ol className="tp">
        {items.map((it, i) => (
          <li key={it.post.id}>
            <span className="tp-rank">{i + 1}</span>
            <div className="tp-body">
              <Link
                href={`/community/${it.post.contentType}/${it.post.slug}`}
                className="tp-t"
              >{it.post.title}</Link>
              <div className="tp-meta">
                <span className={"tp-badge tp-badge--" + it.post.contentType}>
                  {it.post.contentType === "story" ? "情感私话" : "问答专区"}
                </span>
                <span>{it.post.contentType === "question" ? `${it.post.answerCount} 回答` : `${it.post.commentCount} 评论`}</span>
                {it.hotnessDelta === "up" && <span className="tp-up">↑</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <style>{spStyles}{`
        .tp{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
        .tp li{display:flex;gap:12px;align-items:flex-start}
        .tp-rank{width:20px;font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:500;color:#C5A56A;line-height:1;flex-shrink:0;text-align:center}
        .tp-body{flex:1;min-width:0}
        .tp-t{font-size:13px;line-height:1.4;color:#171512;text-decoration:none;font-weight:600;display:block;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .tp-t:hover{color:#8C4B54}
        .tp-meta{display:flex;gap:8px;align-items:center;margin-top:4px;font-size:11px;color:#a19a91;flex-wrap:wrap}
        .tp-badge{font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;padding:1px 8px;border-radius:99px}
        .tp-badge--story{background:rgba(169,111,120,.12);color:#8C4B54}
        .tp-badge--question{background:rgba(102,122,155,.12);color:#4B5E80}
        .tp-up{color:#42856B;font-weight:800}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 等待回答
// ══════════════════════════════════════
export function CommunityUnansweredPanel({ items }: { items: CommunityPost[] }) {
  return (
    <div className="sp">
      <div className="sp-h">
        <b>等待回答</b>
        <span>{items.length} unanswered</span>
      </div>
      <ul className="up">
        {items.slice(0, 4).map((q) => (
          <li key={q.id}>
            <Link href={`/community/question/${q.slug}`} className="up-t">{q.title}</Link>
            <div className="up-meta">
              <span>{q.followerCount ?? 0} 关注</span>
              <Link href={`/community/question/${q.slug}`} className="up-cta">回答 →</Link>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/community/unanswered" className="sp-more">查看更多等待回答 →</Link>
      <style>{spStyles}{`
        .up{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
        .up li{padding-bottom:14px;border-bottom:1px dashed #F0EAE1}
        .up li:last-child{border-bottom:0;padding-bottom:0}
        .up-t{display:block;font-size:13px;line-height:1.5;color:#171512;text-decoration:none;font-weight:600;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .up-t:hover{color:#4B5E80}
        .up-meta{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:11.5px;color:#a19a91}
        .up-cta{color:#171512;font-weight:700;text-decoration:none;padding:3px 10px;background:#F7F4EF;border-radius:999px;font-size:11px}
        .up-cta:hover{background:#171512;color:#F5EEDD}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Journal 精选
// ══════════════════════════════════════
export function CommunityJournalPanel({ posts }: { posts: JournalPost[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="sp sp--gold">
      <div className="sp-h">
        <b>Journal 精选</b>
        <span>想系统了解这些话题?</span>
      </div>
      <ul className="jp">
        {posts.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link href={`/community/${p.categorySlug}/post/${p.slug}`} className="jp-item">
              <div className="jp-cat">{p.tags[0] ?? "Journal"}</div>
              <div className="jp-t">{p.title}</div>
              <div className="jp-meta">{p.readingTime}</div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/community/journal" className="sp-more">查看全部 Journal →</Link>
      <style>{spStyles}{`
        .sp--gold{background:linear-gradient(180deg,#FBF5E7,#F5EDD9)}
        .jp{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
        .jp-item{display:block;padding:12px;background:rgba(255,255,255,.65);border:1px solid rgba(197,165,106,.24);border-radius:12px;text-decoration:none;transition:background .12s}
        .jp-item:hover{background:#fff}
        .jp-cat{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#C5A56A;font-weight:700}
        .jp-t{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:16px;line-height:1.35;color:#171512;font-weight:500;margin-top:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;letter-spacing:-0.005em}
        .jp-meta{font-size:11px;color:#a19a91;margin-top:4px}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 安全提示
// ══════════════════════════════════════
export function CommunitySafetyCard() {
  return (
    <div className="sp sp--soft">
      <div className="sp-h">
        <b>分享真实经历,也要保护真实身份</b>
      </div>
      <p className="sa-body">
        请勿公开姓名、电话、地址、公司、酒店房间号或未经允许的私人照片。
      </p>
      <Link href="/community/safety" className="sa-cta">查看社区规则 →</Link>
      <style>{spStyles}{`
        .sp--soft{background:#FBF7EF;border-color:#EFE7D8}
        .sa-body{margin:0 0 10px;font-size:12.5px;line-height:1.65;color:#3d3a35}
        .sa-cta{font-size:11.5px;color:#171512;font-weight:700;text-decoration:none;padding:6px 12px;background:#fff;border:1px solid #E9E3DA;border-radius:999px;display:inline-block}
        .sa-cta:hover{border-color:#171512}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 共用样式
// ══════════════════════════════════════
const spStyles = `
  .sp{background:#fff;border:1px solid #E9E3DA;border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:12px}
  .sp-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
  .sp-h b{font-size:13.5px;color:#171512;font-weight:700;letter-spacing:-0.005em}
  .sp-h span{font-size:10.5px;color:#a19a91;letter-spacing:.04em}
  .sp-more{font-size:12px;color:#171512;font-weight:700;text-decoration:none;padding-top:6px;border-top:1px dashed #F0EAE1;text-align:center;display:block}
  .sp-more:hover{color:#C5A56A}
`;
