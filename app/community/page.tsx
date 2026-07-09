// Sugardating Journal — 首页 (原互动社区已重构为内容频道)
import type { Metadata } from "next";
import {
  featuredPosts, listAllPosts, journalCategories, listPostsByCategory,
} from "@/lib/journal-data";
import JournalHero from "@/components/Journal/JournalHero";
import JournalCategoryNav from "@/components/Journal/JournalCategoryNav";
import JournalPostCard from "@/components/Journal/JournalPostCard";
import JournalSidebar from "@/components/Journal/JournalSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sugardating Journal | Relationships, Lifestyle and Privacy Guides",
  description: "High-end relationship, London lifestyle, wellness and privacy guides for mature Sugardating users. 高端男性关系、伦敦生活方式与隐私社交指南。",
};

export default function JournalHomePage() {
  const featured = featuredPosts();
  const heroPost = featured[0];
  const secondaryFeatured = featured.slice(1, 4);
  const latest = listAllPosts().slice(0, 9);

  // 3 个精选分类区块
  const featuredCategories = [
    "relationship-intelligence",
    "asian-southeast-asian-culture",
    "london-elite-lifestyle",
  ].map((slug) => journalCategories.find((c) => c.slug === slug)!).filter(Boolean);

  return (
    <div className="jn-page">
      <JournalHero />
      <JournalCategoryNav />

      <div className="jn-shell">
        <div className="jn-grid">
          <main className="jn-main">
            {/* Featured */}
            {heroPost && (
              <section className="jn-sec" aria-label="Featured">
                <div className="jn-sec-head">
                  <h2 className="jn-sec-h">Featured</h2>
                  <span className="jn-sec-sub">编辑精选</span>
                </div>
                <JournalPostCard post={heroPost} variant="featured" />
                {secondaryFeatured.length > 0 && (
                  <div className="jn-sec-sub-grid">
                    {secondaryFeatured.map((p) => (
                      <JournalPostCard key={p.id} post={p} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Latest */}
            <section id="latest" className="jn-sec" aria-label="Latest Articles">
              <div className="jn-sec-head">
                <h2 className="jn-sec-h">Latest Articles</h2>
                <span className="jn-sec-sub">最新文章</span>
              </div>
              <div className="jn-post-grid">
                {latest.map((p) => (
                  <JournalPostCard key={p.id} post={p} />
                ))}
              </div>
            </section>

            {/* Category blocks */}
            {featuredCategories.map((cat) => {
              const posts = listPostsByCategory(cat.slug).slice(0, 3);
              if (!posts.length) return null;
              return (
                <section key={cat.slug} className="jn-sec" aria-label={cat.title}>
                  <div className="jn-sec-head">
                    <div>
                      <h2 className="jn-sec-h">{cat.title}</h2>
                      <span className="jn-sec-sub">{cat.titleZh}</span>
                    </div>
                    <Link href={`/community/${cat.slug}`} className="jn-sec-viewall">View all →</Link>
                  </div>
                  <p className="jn-sec-desc">{cat.description}</p>
                  <div className="jn-post-grid">
                    {posts.map((p) => (
                      <JournalPostCard key={p.id} post={p} />
                    ))}
                  </div>
                </section>
              );
            })}
          </main>

          <JournalSidebar />
        </div>
      </div>

      <style>{`
        .jn-page{background:#F4F4F5;min-height:100vh}
        .jn-shell{max-width:1240px;margin:0 auto;padding:32px 24px 80px}
        .jn-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:40px}
        .jn-main{min-width:0;display:flex;flex-direction:column;gap:56px}
        .jn-sec-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--line)}
        .jn-sec-h{font-size:22px;font-weight:700;color:#161618;margin:0;letter-spacing:-0.005em}
        .jn-sec-sub{font-size:13px;color:#8a8a92;font-weight:500}
        .jn-sec-desc{font-size:14.5px;line-height:1.7;color:#5a5a62;margin:0 0 20px;max-width:62ch}
        .jn-sec-viewall{color:#161618;font-weight:600;font-size:13px;text-decoration:none;padding:6px 12px;border-radius:999px;background:#fff;border:1px solid var(--line);white-space:nowrap}
        .jn-sec-viewall:hover{border-color:#161618}
        .jn-sec-sub-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px}
        .jn-post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
        @media (max-width:1024px){
          .jn-grid{grid-template-columns:1fr;gap:32px}
          .jn-sec-sub-grid,.jn-post-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:640px){
          .jn-shell{padding:24px 16px 60px}
          .jn-sec-sub-grid,.jn-post-grid{grid-template-columns:1fr}
          .jn-main{gap:44px}
        }
      `}</style>
    </div>
  );
}
