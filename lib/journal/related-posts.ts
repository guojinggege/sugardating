// Journal 相关文章推荐 · 基于分类 + tag + 关键词命中打分
// 数据源:listAllPosts() (过滤 draft/archived · 已经处理 override)
import { listAllPosts, type JournalPost } from "@/lib/journal-data";

export interface RelatedContext {
  slug?: string;              // 当前文章 slug · 用于自我排除 (新建时可选)
  categorySlug: string;
  tags: string[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  longTailKeywords?: string[];
  title?: string;             // 用于额外 · 命中候选文章 tags 检查
}

export interface RelatedCandidate {
  post: JournalPost;
  score: number;
  reasons: string[];          // 人类可读原因 · 面板 tooltip
}

const RECENCY_DAYS = 30;

function daysBetween(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (24 * 3600 * 1000);
}

function containsAny(haystack: string, needles: string[]): string[] {
  const h = haystack.toLowerCase();
  return needles.filter((n) => n && h.includes(n.toLowerCase()));
}

export function recommendRelatedPosts(ctx: RelatedContext, limit = 8): RelatedCandidate[] {
  const pool = listAllPosts().filter((p) => p.slug !== ctx.slug);
  const primary = ctx.primaryKeyword?.trim();
  const secondaries = (ctx.secondaryKeywords || []).filter(Boolean);
  const longTails = (ctx.longTailKeywords || []).filter(Boolean);
  const ownTags = ctx.tags.map((t) => t.toLowerCase());

  const scored: RelatedCandidate[] = pool.map((p) => {
    let score = 0;
    const reasons: string[] = [];
    const candidateHaystack = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`;

    if (p.categorySlug === ctx.categorySlug) {
      score += 40;
      reasons.push("同分类 +40");
    }

    const tagOverlap = p.tags.filter((t) => ownTags.includes(t.toLowerCase()));
    if (tagOverlap.length) {
      score += tagOverlap.length * 10;
      reasons.push(`Tag 交集 ${tagOverlap.length} 个 (${tagOverlap.join(", ")}) +${tagOverlap.length * 10}`);
    }

    if (primary) {
      const hit = containsAny(candidateHaystack, [primary]);
      if (hit.length) {
        score += 25;
        reasons.push(`命中主关键词 "${primary}" +25`);
      }
    }

    if (secondaries.length) {
      const hits = containsAny(candidateHaystack, secondaries);
      if (hits.length) {
        score += hits.length * 8;
        reasons.push(`次要关键词命中 ${hits.length} 个 +${hits.length * 8}`);
      }
    }

    if (longTails.length) {
      const hits = containsAny(candidateHaystack, longTails);
      if (hits.length) {
        score += hits.length * 5;
        reasons.push(`长尾命中 ${hits.length} 个 +${hits.length * 5}`);
      }
    }

    if (daysBetween(p.publishedAt) <= RECENCY_DAYS) {
      score += 5;
      reasons.push("30 天内新文 +5");
    }
    if (p.featured) {
      score += 3;
      reasons.push("Featured +3");
    }

    return { post: p, score, reasons };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt))
    .slice(0, limit);
}
