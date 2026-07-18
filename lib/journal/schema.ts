// Journal Schema.org JSON-LD 生成 · BlogPosting 类型 · Google Rich Results 兼容
// 用于:1) Admin 编辑器 SchemaPreview 面板  2) 前台文章页 <script> 注入

export interface SchemaInput {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  language: "zh" | "en";
  author: string;
  publishedAt: string;         // ISO
  updatedAt?: string;
  coverImage?: string;
  ogImage?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  longTailKeywords?: string[];
  tags?: string[];
  readingTime?: string;        // e.g. "5 min read"
  siteBaseUrl?: string;        // 默认 https://sugardating.co.uk
  publisherLogo?: string;      // absolute URL
}

export interface JsonLd {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

const DEFAULT_BASE = "https://sugardating.co.uk";
const DEFAULT_LOGO = "https://sugardating.co.uk/logo.png";

function absoluteUrl(base: string, path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${clean}`;
}

function estimateWordCount(desc: string, readingTime?: string): number {
  const m = readingTime?.match(/(\d+)/);
  if (m) {
    const min = Number(m[1]);
    return min * 220;
  }
  return Math.max(300, desc.length * 4);
}

export function buildBlogPostingSchema(input: SchemaInput): JsonLd {
  const base = (input.siteBaseUrl || DEFAULT_BASE).replace(/\/$/, "");
  const canonical = `${base}/community/${input.categorySlug}/post/${input.slug}`;
  const image = absoluteUrl(base, input.ogImage || input.coverImage || "/images/journal-og-default.jpg");
  const keywords = [
    input.primaryKeyword,
    ...(input.secondaryKeywords || []),
    ...(input.longTailKeywords || []),
    ...(input.tags || []),
  ].filter((s): s is string => Boolean(s && s.trim())).slice(0, 20);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: input.title.slice(0, 110),
    description: input.description.slice(0, 300),
    image: image ? [image] : undefined,
    author: {
      "@type": "Organization",
      name: input.author || "Sugardating Editorial",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "Sugardating",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: input.publisherLogo || DEFAULT_LOGO,
      },
    },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    inLanguage: input.language === "zh" ? "zh-CN" : "en-GB",
    keywords: keywords.length ? keywords.join(", ") : undefined,
    wordCount: estimateWordCount(input.description, input.readingTime),
    articleSection: input.categorySlug,
    isAccessibleForFree: true,
  };
}

// Breadcrumb schema · 独立的 BreadcrumbList · Google 会与 BlogPosting 一起解析
export function buildBreadcrumbSchema(input: {
  categorySlug: string;
  categoryTitle: string;
  postSlug: string;
  postTitle: string;
  siteBaseUrl?: string;
}): JsonLd {
  const base = (input.siteBaseUrl || DEFAULT_BASE).replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal",              item: `${base}/community` },
      { "@type": "ListItem", position: 2, name: input.categoryTitle,    item: `${base}/community/${input.categorySlug}` },
      { "@type": "ListItem", position: 3, name: input.postTitle,        item: `${base}/community/${input.categorySlug}/post/${input.postSlug}` },
    ],
  };
}

// 客户端友好的 pretty print · 用于面板预览
export function stringifySchema(ld: JsonLd | JsonLd[]): string {
  return JSON.stringify(ld, (_k, v) => v === undefined ? undefined : v, 2);
}
