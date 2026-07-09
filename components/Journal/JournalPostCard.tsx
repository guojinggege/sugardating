// 文章卡片 — Journal 通用
import Link from "next/link";
import Img from "@/components/Img";
import type { JournalPost } from "@/lib/journal-data";
import { getCategory } from "@/lib/journal-data";

interface Props {
  post: JournalPost;
  variant?: "default" | "featured" | "compact";
  basePath?: string;
}

function fmtDate(iso: string, lang: "zh" | "en"): string {
  const d = new Date(iso);
  if (lang === "zh") {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function JournalPostCard({ post, variant = "default", basePath = "/community" }: Props) {
  const cat = getCategory(post.categorySlug);
  const href = `${basePath}/${post.categorySlug}/post/${post.slug}`;

  if (variant === "featured") {
    return (
      <article className="jn-card jn-card--featured">
        <Link href={href} className="jn-card-media" aria-label={post.title}>
          <Img src={post.coverImage} alt={post.title} sizes="(max-width:900px) 100vw, 640px" />
        </Link>
        <div className="jn-card-body">
          <div className="jn-card-meta">
            <span className="jn-card-cat">{cat?.title}</span>
            <span className="jn-card-dot" />
            <time>{fmtDate(post.publishedAt, post.language)}</time>
          </div>
          <h2 className="jn-card-h jn-card-h--lg">
            <Link href={href}>{post.title}</Link>
          </h2>
          {post.subtitle && <p className="jn-card-sub">{post.subtitle}</p>}
          <p className="jn-card-excerpt">{post.excerpt}</p>
          <div className="jn-card-foot">
            <span className="jn-card-author">{post.author}</span>
            <span className="jn-card-read">{post.readingTime}</span>
            <Link href={href} className="jn-card-more">阅读全文 →</Link>
          </div>
        </div>
        <style>{styles}</style>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="jn-card jn-card--compact">
        <Link href={href} className="jn-card-media">
          <Img src={post.coverImage} alt={post.title} sizes="120px" />
        </Link>
        <div className="jn-card-body">
          <div className="jn-card-cat jn-card-cat--sm">{cat?.title}</div>
          <h3 className="jn-card-h jn-card-h--sm">
            <Link href={href}>{post.title}</Link>
          </h3>
          <time className="jn-card-time">{fmtDate(post.publishedAt, post.language)}</time>
        </div>
        <style>{styles}</style>
      </article>
    );
  }

  return (
    <article className="jn-card">
      <Link href={href} className="jn-card-media">
        <Img src={post.coverImage} alt={post.title} sizes="(max-width:900px) 100vw, 400px" />
      </Link>
      <div className="jn-card-body">
        <div className="jn-card-meta">
          <span className="jn-card-cat">{cat?.title}</span>
          <span className="jn-card-dot" />
          <time>{fmtDate(post.publishedAt, post.language)}</time>
        </div>
        <h3 className="jn-card-h">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="jn-card-excerpt">{post.excerpt}</p>
        <div className="jn-card-foot">
          <span className="jn-card-read">{post.readingTime}</span>
          <Link href={href} className="jn-card-more">Read →</Link>
        </div>
      </div>
      <style>{styles}</style>
    </article>
  );
}

const styles = `
.jn-card{background:#fff;border:1px solid #E8E8EC;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 24px -12px rgba(15,23,42,.04);transition:transform .18s,box-shadow .18s,border-color .18s}
.jn-card:hover{transform:translateY(-3px);box-shadow:0 20px 40px -18px rgba(15,23,42,.15);border-color:#dcdce0}
.jn-card-media{display:block;aspect-ratio:16/10;background:#F4F4F5;overflow:hidden;position:relative}
.jn-card-media img{width:100%;height:100%;object-fit:cover;transition:transform .35s}
.jn-card:hover .jn-card-media img{transform:scale(1.04)}
.jn-card-body{padding:18px 20px 20px;display:flex;flex-direction:column;flex:1}
.jn-card-meta{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#8a8a92;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
.jn-card-cat{color:#B8A789;font-weight:700}
.jn-card-dot{width:3px;height:3px;border-radius:50%;background:#c0c0c8}
.jn-card-h{font-size:20px;font-weight:700;line-height:1.35;color:#161618;margin:0 0 8px;letter-spacing:-0.005em}
.jn-card-h--lg{font-size:28px;line-height:1.25;margin-bottom:10px}
.jn-card-h--sm{font-size:14.5px;line-height:1.4;margin:2px 0 4px}
.jn-card-h a{color:inherit;text-decoration:none}
.jn-card-h a:hover{opacity:.75}
.jn-card-sub{font-size:14.5px;color:#5a5a62;margin:0 0 12px;font-style:italic;line-height:1.55}
.jn-card-excerpt{font-size:14.5px;line-height:1.7;color:#3d3d42;margin:0 0 16px;flex:1}
.jn-card-foot{display:flex;align-items:center;gap:12px;font-size:12px;color:#8a8a92;margin-top:auto;padding-top:12px;border-top:1px solid #F4F4F5}
.jn-card-author{font-weight:600;color:#3d3d42}
.jn-card-read{font-size:11.5px}
.jn-card-more{margin-left:auto;color:#161618;font-weight:700;font-size:12.5px;text-decoration:none}
.jn-card-more:hover{color:#B8A789}
.jn-card-time{font-size:11.5px;color:#8a8a92}
.jn-card--featured{display:grid;grid-template-columns:1.1fr 1fr;gap:0}
.jn-card--featured .jn-card-media{aspect-ratio:5/4;height:100%}
.jn-card--featured .jn-card-body{padding:32px}
.jn-card--compact{flex-direction:row;border-radius:14px;border:0;box-shadow:none;padding:10px 0;gap:12px}
.jn-card--compact:hover{transform:none;box-shadow:none}
.jn-card--compact .jn-card-media{width:80px;height:80px;flex-shrink:0;border-radius:10px;aspect-ratio:1}
.jn-card--compact .jn-card-body{padding:0}
.jn-card-cat--sm{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:#B8A789;font-weight:700;margin-bottom:0}
@media (max-width:900px){
  .jn-card--featured{grid-template-columns:1fr}
  .jn-card--featured .jn-card-media{aspect-ratio:16/10}
  .jn-card--featured .jn-card-body{padding:22px 20px 24px}
  .jn-card-h--lg{font-size:22px}
}
`;
