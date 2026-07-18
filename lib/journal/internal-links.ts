// Journal 内链推荐 · 扫描 body block 文本 · 命中站内关键短语 → 推荐插入 [phrase](url)
// 支持:频道 · 分类 · 产品 (VIP/SVIP/Credits) · London 区域 · 已有 Journal 文章
import { listAllPosts } from "@/lib/journal-data";

export interface InternalLinkSuggestion {
  id: string;
  phrase: string;              // 匹配到的原文短语
  url: string;                 // 目标站内 URL (/...)
  blockIndex: number;          // body[blockIndex]
  contextSnippet: string;      // 前后各 40 字符 · 便于运营辨认
  kind: "channel" | "product" | "area" | "post";
  reason: string;              // 中文简短说明
}

// ══════════════════════════════════════
// 静态短语字典 (优先级 & 冲突处理:长短语优先)
// ══════════════════════════════════════

type StaticEntry = { patterns: string[]; url: string; kind: InternalLinkSuggestion["kind"]; reason: string };

const CHANNELS: StaticEntry[] = [
  { patterns: ["sugargirls", "sugargirl", "sugar girl", "sugar girls"], url: "/sugargirl",    kind: "channel", reason: "→ Sugargirl 频道" },
  { patterns: ["sugarboys", "sugarboy", "sugar boy", "sugar boys"],     url: "/sugarboy",     kind: "channel", reason: "→ Sugarboy 频道" },
  { patterns: ["情趣按摩", "sensual massage", "massage service", "massage london"], url: "/massage",       kind: "channel", reason: "→ 情趣按摩频道" },
  { patterns: ["定制服务", "custom service", "custom services", "bespoke experience"], url: "/custom-services", kind: "channel", reason: "→ 定制服务" },
  { patterns: ["journal", "sugardating journal"],                       url: "/community",    kind: "channel", reason: "→ Journal 首页" },
];

const PRODUCTS: StaticEntry[] = [
  { patterns: ["svip", "sugardating svip"],                                       url: "/membership", kind: "product", reason: "→ Membership · SVIP" },
  { patterns: ["vip 会员", "sugardating vip", "vip membership"],                  url: "/membership", kind: "product", reason: "→ Membership · VIP" },
  { patterns: ["credits", "金币", "credits 包"],                                   url: "/membership", kind: "product", reason: "→ Credits 说明" },
];

const LONDON_AREAS = [
  "mayfair", "kensington", "chelsea", "marylebone", "canary-wharf", "canary wharf",
  "notting-hill", "notting hill", "shoreditch", "soho", "belgravia", "knightsbridge",
];

// ══════════════════════════════════════
// 分词式匹配 · 避免 partial match (Sugar 撞 Sugardating 之类)
// ══════════════════════════════════════

// 词边界:英字前后须为非字母数字;CJK 短语不需要边界
function isCjk(s: string): boolean {
  return /[一-鿿]/.test(s);
}

function findAll(text: string, phrase: string): number[] {
  if (!phrase) return [];
  const t = text.toLowerCase();
  const p = phrase.toLowerCase();
  const positions: number[] = [];
  let i = 0;
  while ((i = t.indexOf(p, i)) !== -1) {
    if (isCjk(phrase)) {
      positions.push(i);
    } else {
      // 检查前后是否是字母数字 · 是则跳过
      const before = i > 0 ? t.charCodeAt(i - 1) : 0;
      const after = i + p.length < t.length ? t.charCodeAt(i + p.length) : 0;
      const isAlnum = (c: number) => (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
      if (!isAlnum(before) && !isAlnum(after)) positions.push(i);
    }
    i += p.length;
  }
  return positions;
}

function snippet(text: string, pos: number, phraseLen: number): string {
  const start = Math.max(0, pos - 30);
  const end = Math.min(text.length, pos + phraseLen + 30);
  const s = text.slice(start, end).replace(/\s+/g, " ").trim();
  return (start > 0 ? "…" : "") + s + (end < text.length ? "…" : "");
}

// ══════════════════════════════════════
// 主入口
// ══════════════════════════════════════

export function scanInternalLinks(bodyBlocks: Array<{ type: string; text?: string; items?: string[] }>, currentSlug?: string): InternalLinkSuggestion[] {
  const out: InternalLinkSuggestion[] = [];
  const seenPhraseInBlock = new Set<string>();     // 每个 block 每个短语只推 1 次

  // Compose Post entries · title 5 字符以上参与匹配 · 排除自身
  const postEntries: StaticEntry[] = listAllPosts()
    .filter((p) => p.slug !== currentSlug && p.title.length >= 6)
    .map((p) => ({
      patterns: [p.title, ...p.tags.filter((t) => t.length >= 4)],
      url: `/community/${p.categorySlug}/post/${p.slug}`,
      kind: "post",
      reason: `→ 已有文章 · ${p.title.slice(0, 30)}${p.title.length > 30 ? "…" : ""}`,
    }));

  const areaEntries: StaticEntry[] = LONDON_AREAS.map((a) => ({
    patterns: [a],
    url: `/massage/london/${a.replace(/\s+/g, "-")}`,
    kind: "area",
    reason: `→ Massage · London · ${a[0].toUpperCase()}${a.slice(1)}`,
  }));

  // 优先级:post > product > channel > area (post URL 更具体)
  const allEntries: StaticEntry[] = [...postEntries, ...PRODUCTS, ...CHANNELS, ...areaEntries];

  bodyBlocks.forEach((b, idx) => {
    if (b.type !== "paragraph" && b.type !== "heading" && b.type !== "quote" && b.type !== "list") return;
    const text = b.text ?? (b.items?.join("\n") ?? "");
    if (!text || text.length < 20) return;

    // Skip if block already contains markdown link (avoid double-linking)
    if (/\[[^\]]+\]\(\/[^)]+\)/.test(text)) return;

    for (const entry of allEntries) {
      for (const phrase of entry.patterns) {
        const key = `${idx}::${phrase.toLowerCase()}`;
        if (seenPhraseInBlock.has(key)) continue;
        const positions = findAll(text, phrase);
        if (positions.length === 0) continue;
        const pos = positions[0];
        // 命中的确切短语用原文 (保留大小写)
        const actual = text.slice(pos, pos + phrase.length);
        out.push({
          id: `il_${idx}_${entry.kind}_${entry.patterns.indexOf(phrase)}`,
          phrase: actual,
          url: entry.url,
          blockIndex: idx,
          contextSnippet: snippet(text, pos, phrase.length),
          kind: entry.kind,
          reason: entry.reason,
        });
        seenPhraseInBlock.add(key);
        break; // 同一 block 同一 entry 只推最长的一个变体
      }
    }
  });

  // 一段最多 3 条 · 避免堆砌
  const byBlock = new Map<number, InternalLinkSuggestion[]>();
  for (const s of out) {
    const arr = byBlock.get(s.blockIndex) ?? [];
    if (arr.length < 3) arr.push(s);
    byBlock.set(s.blockIndex, arr);
  }
  return Array.from(byBlock.values()).flat();
}

// applyInlineLink 已拆分到 ./apply-inline-link (client-safe · 无 node: 依赖)
export { applyInlineLink } from "./apply-inline-link";
