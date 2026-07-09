// Mobile · Sugardating Journal 首页
import Link from "next/link";
import Img from "@/components/Img";
import {
  featuredPosts, listAllPosts, journalCategories,
} from "@/lib/journal-data";
import JournalPostCard from "@/components/Journal/JournalPostCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sugardating Journal · Mobile",
  description: "高端男性关系、伦敦生活方式与隐私社交指南。",
};

export default function MobileJournalHome() {
  const featured = featuredPosts();
  const heroPost = featured[0];
  const latest = listAllPosts().slice(0, 12);

  return (
    <div className="mj-page">
      {/* Hero */}
      <section className="mj-hero">
        <div className="mj-hero-eyebrow">Sugardating Journal</div>
        <h1 className="mj-hero-h1">高端关系、伦敦生活方式<br />与隐私社交指南</h1>
        <p className="mj-hero-lead">
          围绕高端关系、亚洲文化、伦敦生活方式、隐私安全、健身恢复与商务旅行
          — 为成熟用户提供清晰、安全、高效的社交参考。
        </p>
        <div className="mj-hero-cta">
          <Link href="#latest" className="mj-btn mj-btn--primary">浏览最新</Link>
          <Link href="/m/creators" className="mj-btn mj-btn--ghost">Sugargirls</Link>
        </div>
      </section>

      {/* Category chips */}
      <nav className="mj-cats" aria-label="Categories">
        <Link href="/m/community" className="mj-cat is-active">Featured</Link>
        {journalCategories.map((c) => (
          <Link key={c.slug} href={`/m/community/${c.slug}`} className="mj-cat">
            {c.title}
          </Link>
        ))}
      </nav>

      {/* Featured hero card */}
      {heroPost && (
        <section className="mj-sec">
          <div className="mj-sec-h">Featured</div>
          <Link href={`/m/community/${heroPost.categorySlug}/post/${heroPost.slug}`} className="mj-featured">
            <div className="mj-featured-img">
              <Img src={heroPost.coverImage} alt={heroPost.title} sizes="100vw" />
            </div>
            <div className="mj-featured-body">
              <div className="mj-featured-cat">{heroPost.categorySlug}</div>
              <h2 className="mj-featured-h">{heroPost.title}</h2>
              <p className="mj-featured-p">{heroPost.excerpt}</p>
              <span className="mj-featured-more">阅读全文 →</span>
            </div>
          </Link>
        </section>
      )}

      {/* Latest */}
      <section id="latest" className="mj-sec">
        <div className="mj-sec-h">Latest Articles</div>
        <div className="mj-list">
          {latest.map((p) => (
            <JournalPostCard key={p.id} post={p} basePath="/m/community" />
          ))}
        </div>
      </section>

      <style>{`
        .mj-page{background:#F4F4F5;min-height:100vh;padding-bottom:80px}
        .mj-hero{background:linear-gradient(180deg,#FBFAF7,#F4F4F5);padding:28px 20px 24px;border-bottom:1px solid var(--line)}
        .mj-hero-eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .mj-hero-h1{font-size:26px;line-height:1.25;color:#161618;font-weight:700;margin:0 0 12px;letter-spacing:-0.01em}
        .mj-hero-lead{font-size:14px;line-height:1.7;color:#3d3d42;margin:0 0 18px}
        .mj-hero-cta{display:flex;gap:8px}
        .mj-btn{display:inline-flex;align-items:center;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none}
        .mj-btn--primary{background:#161618;color:#fff}
        .mj-btn--ghost{background:#fff;color:#161618;border:1px solid #E8E8EC}
        .mj-cats{display:flex;gap:6px;padding:12px 16px;overflow-x:auto;scrollbar-width:none;background:#fff;border-bottom:1px solid var(--line)}
        .mj-cats::-webkit-scrollbar{display:none}
        .mj-cat{flex-shrink:0;padding:7px 12px;border-radius:999px;font-size:12.5px;font-weight:600;color:#3d3d42;text-decoration:none;white-space:nowrap;background:#F4F4F5}
        .mj-cat.is-active{background:#161618;color:#fff}
        .mj-sec{padding:24px 16px 8px}
        .mj-sec-h{font-size:13px;font-weight:700;color:#161618;letter-spacing:-0.005em;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--line)}
        .mj-featured{display:block;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;margin-bottom:8px}
        .mj-featured-img{aspect-ratio:16/10;background:#F4F4F5}
        .mj-featured-img img{width:100%;height:100%;object-fit:cover;display:block}
        .mj-featured-body{padding:18px 20px 20px}
        .mj-featured-cat{font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;color:#B8A789;font-weight:700;margin-bottom:6px}
        .mj-featured-h{font-size:20px;font-weight:700;color:#161618;line-height:1.3;margin:0 0 8px;letter-spacing:-0.005em}
        .mj-featured-p{font-size:14px;line-height:1.7;color:#3d3d42;margin:0 0 12px}
        .mj-featured-more{font-size:13px;font-weight:700;color:#161618}
        .mj-list{display:flex;flex-direction:column;gap:14px}
      `}</style>
    </div>
  );
}
