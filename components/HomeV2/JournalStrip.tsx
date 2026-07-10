// Journal — 4 featured articles teaser
import Link from "next/link";
import Img from "@/components/Img";
import { featuredPosts, journalPosts } from "@/lib/journal-data";

export default function JournalStrip() {
  const featured = featuredPosts();
  const pool = featured.length >= 4 ? featured : journalPosts;
  const picks = pool.slice(0, 4);

  return (
    <section className="hv-jn" aria-label="Sugardating Journal">
      <div className="hv-jn-in">
        <div className="hv-jn-head">
          <div>
            <div className="hv-jn-eyebrow">Sugardating Journal</div>
            <h2>不只是平台<em> · 也是高端社交指南</em></h2>
            <p>阅读关于伦敦生活方式、亚洲与东南亚文化、隐私安全、男性状态、商务旅行与平台使用策略的深度内容。</p>
          </div>
          <Link href="/community" className="hv-jn-link">进入 Journal →</Link>
        </div>
        <div className="hv-jn-grid">
          {picks.map((p) => (
            <Link key={p.id} href={`/community/${p.categorySlug}/post/${p.slug}`} className="hv-jn-card">
              <div className="hv-jn-media">
                <Img src={p.coverImage} alt={p.title} sizes="(max-width:900px) 100vw, 300px" />
              </div>
              <div className="hv-jn-body">
                <div className="hv-jn-cat">{p.categorySlug.replace(/-/g, " ")}</div>
                <h4>{p.title}</h4>
                <div className="hv-jn-meta">{p.readingTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .hv-jn{background:#fff;padding:80px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .hv-jn-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-jn-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:32px;flex-wrap:wrap}
        .hv-jn-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-jn-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 10px;letter-spacing:-0.01em;max-width:20ch}
        .hv-jn-head h2 em{font-style:italic;color:#B8A789}
        .hv-jn-head p{font-size:14.5px;line-height:1.7;color:#5a5a62;margin:0;max-width:60ch}
        .hv-jn-link{font-size:13.5px;font-weight:700;color:#161618;text-decoration:none;padding:10px 18px;border:1px solid var(--line);border-radius:99px;background:#fff;transition:border-color .12s}
        .hv-jn-link:hover{border-color:#161618}
        .hv-jn-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .hv-jn-card{background:#FBFAF7;border:1px solid #EEE9DC;border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:transform .14s,border-color .14s}
        .hv-jn-card:hover{transform:translateY(-3px);border-color:#B8A789}
        .hv-jn-media{aspect-ratio:16/10;background:#F4F4F5;overflow:hidden}
        .hv-jn-media img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .hv-jn-card:hover .hv-jn-media img{transform:scale(1.05)}
        .hv-jn-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;flex:1}
        .hv-jn-cat{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .hv-jn-body h4{font-size:15px;font-weight:700;color:#161618;margin:0;line-height:1.4;letter-spacing:-0.005em;flex:1}
        .hv-jn-meta{font-size:11.5px;color:#8a8a92;margin-top:6px}
        @media (max-width:1024px){.hv-jn-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-jn{padding:60px 0}
          .hv-jn-head h2{font-size:26px}
          .hv-jn-grid{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
