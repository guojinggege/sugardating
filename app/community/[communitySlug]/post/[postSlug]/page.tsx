// Journal 文章详情页 /community/[communitySlug]/post/[postSlug]
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Img from "@/components/Img";
import {
  journalPosts, getCategory, getPost, relatedPosts, getPostBySlug,
} from "@/lib/journal-data";
import JournalCategoryNav from "@/components/Journal/JournalCategoryNav";
import JournalArticleBody from "@/components/Journal/JournalArticleBody";
import JournalCTA from "@/components/Journal/JournalCTA";
import JournalRelated from "@/components/Journal/JournalRelated";
import JournalSidebar from "@/components/Journal/JournalSidebar";
import { buildBlogPostingSchema, buildBreadcrumbSchema, stringifySchema } from "@/lib/journal/schema";
import { cmsRepo } from "@/lib/cms/repository";
import ShareButton from "@/components/share/ShareButton";

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
  const cms = cmsRepo.getJournalPost(post.slug);
  const seo = cms?.seo;
  const title = seo?.title || `${post.title} · Sugardating Journal`;
  const description = seo?.description || post.excerpt;
  const image = seo?.ogImage || post.coverImage;
  const keywords = [
    seo?.primaryKeyword,
    ...(seo?.secondaryKeywords || []),
    ...(seo?.longTailKeywords || []),
    ...post.tags,
  ].filter((s): s is string => Boolean(s && s.trim()));
  return {
    title,
    description,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.title,
      description,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

function fmtDate(iso: string, lang: "zh" | "en"): string {
  const d = new Date(iso);
  if (lang === "zh") return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function JournalArticlePage({ params }: { params: { communitySlug: string; postSlug: string } }) {
  const post = getPost(params.communitySlug, params.postSlug);
  if (!post) notFound();
  const category = getCategory(post.categorySlug);

  // Related · 先看运营锁定的 relatedSlugs (Admin SEO 面板持久化的),否则回退到自动
  const cmsFull = cmsRepo.getJournalPost(post.slug);
  const pinnedSlugs = cmsFull?.seo?.relatedSlugs ?? [];
  const pinned = pinnedSlugs
    .map((s: string) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = pinned.length >= 3 ? pinned.slice(0, 3) : [...pinned, ...relatedPosts(post, 3 - pinned.length)].slice(0, 3);

  // JSON-LD · BlogPosting + BreadcrumbList
  const articleSchema = buildBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: cmsFull?.seo?.description || post.excerpt,
    categorySlug: post.categorySlug,
    language: post.language,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    coverImage: post.coverImage,
    ogImage: cmsFull?.seo?.ogImage,
    primaryKeyword: cmsFull?.seo?.primaryKeyword,
    secondaryKeywords: cmsFull?.seo?.secondaryKeywords,
    longTailKeywords: cmsFull?.seo?.longTailKeywords,
    tags: post.tags,
    readingTime: post.readingTime,
  });
  const breadcrumbSchema = buildBreadcrumbSchema({
    categorySlug: post.categorySlug,
    categoryTitle: category?.title || post.categorySlug,
    postSlug: post.slug,
    postTitle: post.title,
  });
  const jsonLd = stringifySchema([articleSchema, breadcrumbSchema]);

  return (
    <div className="jn-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <JournalCategoryNav activeSlug={post.categorySlug} />

      <div className="jn-shell">
        <div className="jn-grid">
          <main className="jn-main">
            {/* Breadcrumb */}
            <nav className="jn-crumb" aria-label="Breadcrumb">
              <Link href="/community">Journal</Link>
              <span>/</span>
              <Link href={`/community/${post.categorySlug}`}>{category?.title}</Link>
            </nav>

            <article className="jn-article">
              {/* Header */}
              <header className="jn-art-head">
                <div className="jn-art-cat">{category?.title}</div>
                <h1 className="jn-art-h1">{post.title}</h1>
                {post.subtitle && <p className="jn-art-sub">{post.subtitle}</p>}
                <div className="jn-art-meta">
                  <span className="jn-art-author">{post.author}</span>
                  <span className="jn-art-dot" />
                  <time>{fmtDate(post.publishedAt, post.language)}</time>
                  <span className="jn-art-dot" />
                  <span>{post.readingTime}</span>
                  <span style={{ marginLeft: "auto" }}>
                    <ShareButton
                      variant="chip"
                      payload={{
                        title: post.title,
                        text: post.excerpt,
                        canonicalUrl: `/community/${post.categorySlug}/post/${post.slug}`,
                        image: post.coverImage,
                        contentType: "journal",
                        contentId: post.slug,
                      }}
                    />
                  </span>
                </div>
              </header>

              {/* Cover */}
              <figure className="jn-art-cover">
                <Img src={post.coverImage} alt={post.title} sizes="(max-width:900px) 100vw, 780px" />
              </figure>

              {/* Excerpt lead */}
              <p className="jn-art-lead">{post.excerpt}</p>

              {/* Body blocks */}
              <JournalArticleBody blocks={post.body} />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="jn-art-tags">
                  {post.tags.map((t) => (
                    <span key={t} className="jn-art-tag">#{t}</span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <JournalCTA variants={post.cta} />
            </article>

            {/* Related */}
            <JournalRelated posts={related} />
          </main>

          <JournalSidebar activeCategorySlug={post.categorySlug} />
        </div>
      </div>

      <style>{`
        .jn-page{background:#F4F4F5;min-height:100vh}
        .jn-shell{max-width:1240px;margin:0 auto;padding:32px 24px 80px}
        .jn-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:40px}
        .jn-main{min-width:0}
        .jn-crumb{display:flex;gap:8px;font-size:12.5px;color:#8a8a92;margin-bottom:16px;align-items:center}
        .jn-crumb a{color:#8a8a92;text-decoration:none}
        .jn-crumb a:hover{color:#161618}
        .jn-article{background:#fff;border:1px solid var(--line);border-radius:22px;padding:40px 44px 44px;overflow:hidden}
        .jn-art-head{padding-bottom:24px;border-bottom:1px solid var(--line);margin-bottom:28px}
        .jn-art-cat{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .jn-art-h1{font-size:38px;line-height:1.2;color:#161618;letter-spacing:-0.012em;font-weight:700;margin:0 0 14px;font-family:'Plus Jakarta Sans',ui-sans-serif}
        .jn-art-sub{font-size:18px;line-height:1.5;color:#5a5a62;margin:0 0 20px;font-style:italic}
        .jn-art-meta{display:flex;align-items:center;gap:10px;font-size:13px;color:#8a8a92;flex-wrap:wrap}
        .jn-art-author{font-weight:700;color:#3d3d42}
        .jn-art-dot{width:3px;height:3px;border-radius:50%;background:#c0c0c8}
        .jn-art-cover{margin:0 -44px 32px;aspect-ratio:16/9;background:#F4F4F5;overflow:hidden;position:relative}
        .jn-art-cover img{width:100%;height:100%;object-fit:cover;display:block}
        .jn-art-lead{font-size:19px;line-height:1.7;color:#161618;font-weight:500;margin:0 0 32px;padding:0 0 24px;border-bottom:1px dashed var(--line);max-width:68ch}
        .jn-art-tags{display:flex;flex-wrap:wrap;gap:6px;margin:36px 0 8px}
        .jn-art-tag{padding:4px 10px;background:#F4F4F5;border-radius:999px;font-size:11.5px;color:#5a5a62;font-weight:500}
        @media (max-width:1024px){.jn-grid{grid-template-columns:1fr;gap:32px}}
        @media (max-width:640px){
          .jn-shell{padding:20px 12px 60px}
          .jn-article{padding:24px 20px 30px;border-radius:16px}
          .jn-art-cover{margin:0 -20px 24px}
          .jn-art-h1{font-size:26px}
          .jn-art-sub{font-size:15.5px}
          .jn-art-lead{font-size:16.5px}
        }
      `}</style>
    </div>
  );
}
