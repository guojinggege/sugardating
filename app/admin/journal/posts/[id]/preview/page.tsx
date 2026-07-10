// Admin · Journal 文章后台预览 · 支持草稿 · 复用前台组件
import { notFound } from "next/navigation";
import Link from "next/link";
import Img from "@/components/Img";
import { cmsRepo } from "@/lib/cms/repository";
import { journalCategories } from "@/lib/journal-data";
import JournalArticleBody from "@/components/Journal/JournalArticleBody";
import JournalCTA from "@/components/Journal/JournalCTA";
import type { JournalCtaVariant } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

function fmtDate(iso: string, lang: "zh" | "en"): string {
  const d = new Date(iso);
  if (lang === "zh") return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminJournalPreviewPage({ params }: { params: { id: string } }) {
  const post = cmsRepo.getJournalPost(params.id);
  if (!post) notFound();
  const category = journalCategories.find((c) => c.slug === post.categorySlug);

  return (
    <div className="pv">
      <div className="pv-banner">
        <span className="pv-badge">Preview</span>
        <span>状态: <b>{post.status === "published" ? "已发布" : post.status === "archived" ? "已归档" : "草稿"}</b></span>
        <div className="pv-actions">
          <Link href={`/admin/journal/posts/${post.slug}`} className="pv-btn">← 返回编辑</Link>
          {post.status === "published" && (
            <a href={`/community/${post.categorySlug}/post/${post.slug}`} target="_blank" rel="noreferrer" className="pv-btn pv-btn--gold">查看前台</a>
          )}
        </div>
      </div>

      <article className="pv-article">
        <div className="pv-cat">{category?.title || post.categorySlug}</div>
        <h1>{post.title}</h1>
        {post.subtitle && <p className="pv-subtitle">{post.subtitle}</p>}
        <div className="pv-meta">
          <span className="pv-author">{post.author}</span>
          <span>·</span>
          <time>{fmtDate(post.publishedAt, post.language)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.coverImage && (
          <figure className="pv-cover">
            <Img src={post.coverImage} alt={post.title} sizes="(max-width:900px) 100vw, 780px" />
          </figure>
        )}
        <p className="pv-lead">{post.excerpt}</p>
        <JournalArticleBody blocks={post.body as any} />
        {post.tags.length > 0 && (
          <div className="pv-tags">
            {post.tags.map((t) => <span key={t}>#{t}</span>)}
          </div>
        )}
        {post.cta.length > 0 && <JournalCTA variants={post.cta as JournalCtaVariant[]} />}
      </article>

      <style>{`
        .pv{background:#F4F4F5;min-height:100vh;padding:0 0 60px}
        .pv-banner{position:sticky;top:70px;z-index:10;background:linear-gradient(135deg,#EEDDB8,#D4BF95);color:#1a1409;padding:12px 24px;display:flex;align-items:center;gap:14px;font-size:13px;font-weight:600;box-shadow:0 4px 12px -6px rgba(0,0,0,.15)}
        .pv-badge{background:#1a1409;color:#EEDDB8;padding:3px 10px;border-radius:99px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
        .pv-actions{margin-left:auto;display:flex;gap:8px}
        .pv-btn{padding:6px 14px;background:#fff;color:#1a1409;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;border:1px solid rgba(26,20,9,.15)}
        .pv-btn:hover{background:#FBFAF7}
        .pv-btn--gold{background:#161618;color:#EEDDB8;border-color:#161618}
        .pv-article{max-width:800px;margin:36px auto;background:#fff;border:1px solid var(--line);border-radius:22px;padding:44px 48px;overflow:hidden}
        .pv-cat{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .pv-article h1{font-family:'Cormorant Garamond',ui-serif;font-size:38px;line-height:1.2;color:#161618;font-weight:700;letter-spacing:-0.012em;margin:0 0 14px}
        .pv-subtitle{font-size:18px;line-height:1.5;color:#5a5a62;margin:0 0 20px;font-style:italic}
        .pv-meta{display:flex;align-items:center;gap:10px;font-size:13px;color:#8a8a92;flex-wrap:wrap;padding-bottom:22px;border-bottom:1px solid var(--line)}
        .pv-author{font-weight:700;color:#3d3d42}
        .pv-cover{margin:22px -48px;aspect-ratio:16/9;overflow:hidden;background:#F4F4F5}
        .pv-cover img{width:100%;height:100%;object-fit:cover}
        .pv-lead{font-size:19px;line-height:1.7;color:#161618;font-weight:500;margin:0 0 32px;padding:0 0 24px;border-bottom:1px dashed var(--line)}
        .pv-tags{display:flex;flex-wrap:wrap;gap:6px;margin:36px 0 8px}
        .pv-tags span{padding:4px 10px;background:#F4F4F5;border-radius:99px;font-size:11.5px;color:#5a5a62}
        @media (max-width:640px){.pv-article{padding:24px 20px;margin:20px 12px}.pv-cover{margin:20px -20px}.pv-article h1{font-size:26px}}
      `}</style>
    </div>
  );
}
