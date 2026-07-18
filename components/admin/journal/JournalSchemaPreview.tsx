"use client";
// Schema.org JSON-LD 预览 · 折叠面板 · 可复制
import { useState } from "react";
import { buildBlogPostingSchema, buildBreadcrumbSchema, stringifySchema } from "@/lib/journal/schema";

interface Category { slug: string; title: string; titleZh: string }

interface Props {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  categories: Category[];
  language: "zh" | "en";
  author: string;
  publishedAt?: string;
  coverImage?: string;
  ogImage?: string;
  primaryKeyword?: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  tags: string[];
  readingTime?: string;
}

export default function JournalSchemaPreview(props: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const category = props.categories.find((c) => c.slug === props.categorySlug);
  const publishedIso = props.publishedAt || new Date().toISOString();

  const article = buildBlogPostingSchema({
    slug: props.slug || "your-slug",
    title: props.title || "文章标题",
    description: props.description || "文章描述",
    categorySlug: props.categorySlug,
    language: props.language,
    author: props.author,
    publishedAt: publishedIso,
    coverImage: props.coverImage,
    ogImage: props.ogImage,
    primaryKeyword: props.primaryKeyword,
    secondaryKeywords: props.secondaryKeywords,
    longTailKeywords: props.longTailKeywords,
    tags: props.tags,
    readingTime: props.readingTime,
  });

  const breadcrumb = buildBreadcrumbSchema({
    categorySlug: props.categorySlug,
    categoryTitle: category?.title || props.categorySlug,
    postSlug: props.slug || "your-slug",
    postTitle: props.title || "文章标题",
  });

  const jsonBoth = stringifySchema([article, breadcrumb]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(jsonBoth);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  }

  return (
    <div className="ss">
      <div className="ss-h">
        <div>
          <b>schema.org · BlogPosting + BreadcrumbList</b>
          <span>Google Rich Results 兼容 · 前台自动注入 &lt;script type="application/ld+json"&gt;</span>
        </div>
        <div className="ss-actions">
          <button type="button" onClick={copy} className="ss-copy">{copied ? "已复制" : "复制 JSON"}</button>
          <button type="button" onClick={() => setOpen((v) => !v)} className="ss-toggle">
            {open ? "收起" : "展开预览"}
          </button>
        </div>
      </div>
      {open && (
        <pre className="ss-pre">{jsonBoth}</pre>
      )}
      <style>{`
        .ss{display:flex;flex-direction:column;gap:10px}
        .ss-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
        .ss-h b{display:block;font-size:12.5px;color:#111;font-weight:700}
        .ss-h span{font-size:10.5px;color:#9CA3AF;line-height:1.4}
        .ss-actions{display:flex;gap:6px;flex-shrink:0}
        .ss-copy,.ss-toggle{background:#F7F5F0;color:#111;border:1px solid #E5E7EB;padding:5px 12px;font:inherit;font-size:11px;font-weight:700;border-radius:99px;cursor:pointer}
        .ss-copy:hover,.ss-toggle:hover{border-color:#D6B980}
        .ss-pre{background:#161618;color:#EEDDB8;padding:14px;border-radius:10px;font-family:ui-monospace,monospace;font-size:11px;line-height:1.5;max-height:340px;overflow:auto;white-space:pre-wrap;margin:0}
      `}</style>
    </div>
  );
}
