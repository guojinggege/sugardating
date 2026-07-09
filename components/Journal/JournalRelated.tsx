// 相关文章 — 3 张
import type { JournalPost } from "@/lib/journal-data";
import JournalPostCard from "./JournalPostCard";

interface Props {
  posts: JournalPost[];
  basePath?: string;
}

export default function JournalRelated({ posts, basePath = "/community" }: Props) {
  if (!posts.length) return null;
  return (
    <section className="jn-rel">
      <div className="jn-rel-head">
        <h3 className="jn-rel-h">Related Articles</h3>
        <span className="jn-rel-sub">相关阅读</span>
      </div>
      <div className="jn-rel-grid">
        {posts.map((p) => (
          <JournalPostCard key={p.id} post={p} basePath={basePath} />
        ))}
      </div>
      <style>{`
        .jn-rel{margin:48px 0 20px}
        .jn-rel-head{display:flex;align-items:baseline;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--line)}
        .jn-rel-h{font-size:20px;font-weight:700;color:#161618;margin:0}
        .jn-rel-sub{font-size:13px;color:#8a8a92;font-weight:500}
        .jn-rel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        @media (max-width:900px){.jn-rel-grid{grid-template-columns:1fr;gap:16px}}
      `}</style>
    </section>
  );
}
