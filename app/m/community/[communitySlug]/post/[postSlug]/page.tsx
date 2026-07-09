// Mobile Journal 文章详情页
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Img from "@/components/Img";
import {
  journalPosts, getCategory, getPost, relatedPosts,
} from "@/lib/journal-data";
import JournalArticleBody from "@/components/Journal/JournalArticleBody";
import JournalCTA from "@/components/Journal/JournalCTA";
import JournalPostCard from "@/components/Journal/JournalPostCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return journalPosts.map((p) => ({
    communitySlug: p.categorySlug,
    postSlug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string; postSlug: string } }): Promise<Metadata> {
  const post = getPost(params.communitySlug, params.postSlug);
  if (!post) return { title: "Article · Sugardating Journal" };
  return {
    title: `${post.title} · Sugardating Journal`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverImage], type: "article" },
  };
}

function fmtDate(iso: string, lang: "zh" | "en"): string {
  const d = new Date(iso);
  if (lang === "zh") return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MobileJournalArticlePage({ params }: { params: { communitySlug: string; postSlug: string } }) {
  const post = getPost(params.communitySlug, params.postSlug);
  if (!post) notFound();
  const category = getCategory(post.categorySlug);
  const related = relatedPosts(post, 2);

  return (
    <div className="mj-art-page">
      {/* Cover */}
      <div className="mj-art-cover">
        <Img src={post.coverImage} alt={post.title} sizes="100vw" />
        <div className="mj-art-cover-veil" />
        <Link href={`/m/community/${post.categorySlug}`} className="mj-art-back" aria-label="返回">←</Link>
      </div>

      {/* Article */}
      <article className="mj-art">
        <div className="mj-art-cat">{category?.title}</div>
        <h1 className="mj-art-h1">{post.title}</h1>
        {post.subtitle && <p className="mj-art-sub">{post.subtitle}</p>}
        <div className="mj-art-meta">
          <span className="mj-art-author">{post.author}</span>
          <span>·</span>
          <time>{fmtDate(post.publishedAt, post.language)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <p className="mj-art-lead">{post.excerpt}</p>

        <JournalArticleBody blocks={post.body} />

        {post.tags.length > 0 && (
          <div className="mj-art-tags">
            {post.tags.map((t) => <span key={t} className="mj-art-tag">#{t}</span>)}
          </div>
        )}

        <JournalCTA variants={post.cta} />

        {related.length > 0 && (
          <section className="mj-art-rel">
            <h3 className="mj-art-rel-h">相关阅读</h3>
            <div className="mj-list">
              {related.map((p) => (
                <JournalPostCard key={p.id} post={p} basePath="/m/community" />
              ))}
            </div>
          </section>
        )}
      </article>

      <style>{`
        .mj-art-page{background:#F4F4F5;min-height:100vh;padding-bottom:80px}
        .mj-art-cover{position:relative;aspect-ratio:16/10;background:#1a1a1c;overflow:hidden}
        .mj-art-cover img{width:100%;height:100%;object-fit:cover;display:block}
        .mj-art-cover-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 40%,rgba(0,0,0,.4))}
        .mj-art-back{position:absolute;top:12px;left:12px;width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:20px;text-decoration:none;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15)}
        .mj-art{background:#fff;margin:-24px 12px 0;position:relative;border-radius:20px 20px 0 0;padding:24px 20px 32px}
        .mj-art-cat{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .mj-art-h1{font-size:26px;font-weight:700;line-height:1.22;color:#161618;letter-spacing:-0.01em;margin:0 0 12px}
        .mj-art-sub{font-size:15.5px;line-height:1.5;color:#5a5a62;margin:0 0 14px;font-style:italic}
        .mj-art-meta{display:flex;flex-wrap:wrap;gap:6px;font-size:12px;color:#8a8a92;padding-bottom:16px;margin-bottom:20px;border-bottom:1px solid var(--line)}
        .mj-art-author{font-weight:700;color:#3d3d42}
        .mj-art-lead{font-size:16.5px;line-height:1.7;color:#161618;font-weight:500;margin:0 0 24px}
        .mj-art-tags{display:flex;flex-wrap:wrap;gap:6px;margin:24px 0 4px}
        .mj-art-tag{padding:4px 10px;background:#F4F4F5;border-radius:999px;font-size:11.5px;color:#5a5a62}
        .mj-art-rel{margin-top:36px;padding-top:24px;border-top:1px solid var(--line)}
        .mj-art-rel-h{font-size:16px;font-weight:700;color:#161618;margin:0 0 14px}
        .mj-list{display:flex;flex-direction:column;gap:14px}
      `}</style>
    </div>
  );
}
