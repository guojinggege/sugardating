// 私语广场 · in-memory 存储 · HMR-safe globalThis
// P0 read-only · 后续接 Neon 时替换 CRUD 层即可
import type { CommunityAuthor, CommunityPost, CommunityTag, CommunityListItem } from "./types";
import { seedCommunityPosts, communityAuthors, computeTags } from "./mock-data";

declare global {
  // eslint-disable-next-line no-var
  var __sgCommunityPosts: CommunityPost[] | undefined;
  // eslint-disable-next-line no-var
  var __sgCommunityAuthors: CommunityAuthor[] | undefined;
}

const posts = globalThis.__sgCommunityPosts ?? [...seedCommunityPosts];
globalThis.__sgCommunityPosts = posts;

const authors = globalThis.__sgCommunityAuthors ?? [...communityAuthors];
globalThis.__sgCommunityAuthors = authors;

// ══════════════════════════════════════
// Author helpers
// ══════════════════════════════════════

export function getAuthor(id: string): CommunityAuthor | undefined {
  return authors.find((a) => a.id === id);
}

export function scrubAuthor(post: CommunityPost): CommunityAuthor | undefined {
  if (post.isAnonymous) {
    return { id: "anonymous", name: "匿名读者", type: "user" };
  }
  return getAuthor(post.authorId);
}

// ══════════════════════════════════════
// Post listing / filtering
// ══════════════════════════════════════

export function listPublished(): CommunityPost[] {
  return posts.filter((p) => p.status === "published");
}

export function getPostBySlug(slug: string): CommunityPost | undefined {
  return posts.find((p) => p.slug === slug && p.status === "published");
}

export function listStories(): CommunityPost[] {
  return listPublished()
    .filter((p) => p.contentType === "story")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listQuestions(): CommunityPost[] {
  return listPublished()
    .filter((p) => p.contentType === "question")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listLatest(): CommunityPost[] {
  return listPublished().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listUnanswered(): CommunityPost[] {
  return listQuestions().filter((q) => q.answerCount === 0 && !q.acceptedAnswerId);
}

export function listByTag(tag: string): CommunityPost[] {
  return listPublished().filter((p) => p.tags.includes(tag))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ══════════════════════════════════════
// For-you 混合流 · 55% story · 35% question · 10% Journal (Journal 由页面自己拼)
// ══════════════════════════════════════

export function listForYou(limit = 12): CommunityPost[] {
  const stories = listStories();
  const questions = listQuestions();
  const out: CommunityPost[] = [];
  const storyRatio = 0.55;
  let sI = 0, qI = 0;
  while (out.length < limit && (sI < stories.length || qI < questions.length)) {
    const wantStory = Math.random() < storyRatio;
    if (wantStory && sI < stories.length) out.push(stories[sI++]);
    else if (qI < questions.length) out.push(questions[qI++]);
    else if (sI < stories.length) out.push(stories[sI++]);
  }
  return out;
}

// 热度计算 · 综合互动 / views / 时间衰减
function hotness(p: CommunityPost): number {
  const reactionsSum = Object.values(p.reactionCounts).reduce((s, n) => s + (n ?? 0), 0);
  const engagement = reactionsSum + p.commentCount * 2 + p.answerCount * 3;
  const views = p.viewCount;
  const ageHours = Math.max(1, (Date.now() - new Date(p.createdAt).getTime()) / 3600_000);
  const decay = 1 / Math.pow(ageHours, 0.4);
  return (engagement * 3 + views) * decay;
}

export function listTrending(limit = 5): CommunityListItem[] {
  const scored = listPublished().map((p) => ({
    post: p,
    author: scrubAuthor(p),
    topReactionCount: Object.values(p.reactionCounts).reduce((s, n) => s + (n ?? 0), 0),
    hotness: hotness(p),
  }));
  return scored
    .sort((a, b) => b.hotness - a.hotness)
    .slice(0, limit)
    .map(({ post, author, topReactionCount }, i) => ({
      post, author, topReactionCount,
      hotnessDelta: i < 2 ? "up" : i > 3 ? "flat" : "up",
    }));
}

// ══════════════════════════════════════
// Tags
// ══════════════════════════════════════

export function listTags(limit = 20): CommunityTag[] {
  return computeTags(posts).slice(0, limit);
}

// ══════════════════════════════════════
// Card assembly helper · 卡片显示前 scrub 匿名信息
// ══════════════════════════════════════

export function toListItem(post: CommunityPost): CommunityListItem {
  return {
    post,
    author: scrubAuthor(post),
    topReactionCount: Object.values(post.reactionCounts).reduce((s, n) => s + (n ?? 0), 0),
  };
}
