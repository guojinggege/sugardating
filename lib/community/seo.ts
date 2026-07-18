// Community SEO · Story / Question metadata + QAPage / Article JSON-LD
import type { Metadata } from "next";
import type { CommunityAuthor, CommunityPost } from "./types";

const BASE = "https://sugardating.co.uk";

export function postMetadata(post: CommunityPost, author?: CommunityAuthor): Metadata {
  const isStory = post.contentType === "story";
  const excerpt = post.excerpt || post.body.slice(0, 158);
  const image = post.images?.[0] || `${BASE}/images/whisper-og-default.jpg`;
  const path = isStory ? "story" : "question";
  const url = `${BASE}/community/${path}/${post.slug}`;
  const authorName = post.isAnonymous ? "匿名读者" : (author?.name || "Sugardating Community");
  return {
    title: isStory
      ? `${post.title} · 私语广场 · Sugardating`
      : `${post.title} · 问答专区 · Sugardating`,
    description: excerpt,
    keywords: post.tags.join(", "),
    robots: post.seoIndexable ? undefined : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: excerpt,
      url,
      images: [image],
      type: "article",
      authors: [authorName],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
      images: [image],
    },
  };
}

export function buildStorySchema(post: CommunityPost, author?: CommunityAuthor): object {
  const url = `${BASE}/community/story/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title.slice(0, 110),
    articleBody: post.body.slice(0, 5000),
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.isAnonymous ? "匿名读者" : (author?.name || "Sugardating 用户"),
    },
    publisher: {
      "@type": "Organization",
      name: "Sugardating",
      url: BASE,
    },
    keywords: post.tags.join(", "),
    inLanguage: "zh-CN",
    isAccessibleForFree: true,
  };
}

export function buildQaSchema(post: CommunityPost, author?: CommunityAuthor): object {
  const url = `${BASE}/community/question/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${url}#qa`,
    mainEntity: {
      "@type": "Question",
      name: post.title,
      text: post.body.slice(0, 3000),
      answerCount: post.answerCount,
      upvoteCount: post.reactionCounts.helpful ?? 0,
      dateCreated: post.createdAt,
      author: {
        "@type": "Person",
        name: post.isAnonymous ? "匿名读者" : (author?.name || "Sugardating 用户"),
      },
      // P0 无真实回答数据 · 输出提示占位 (Google 允许没有 acceptedAnswer)
      suggestedAnswer: post.answerCount > 0 ? [{
        "@type": "Answer",
        text: `${post.answerCount} 条回答由社区成员提交,请访问页面查看。`,
        url,
        dateCreated: post.updatedAt,
        author: { "@type": "Organization", name: "Sugardating Community" },
      }] : undefined,
    },
    inLanguage: "zh-CN",
  };
}

export function stringifyJson(obj: unknown): string {
  return JSON.stringify(obj, (_k, v) => v === undefined ? undefined : v, 2);
}
