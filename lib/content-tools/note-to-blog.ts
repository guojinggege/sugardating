// 启发式笔记 → Sugardating Journal blog 转换
// 无 AI 依赖 · 纯规则:strip 噪点 → 拆行 → 检测标题/列表 → 组 blocks
// → 按方向插入 Sugardating idiom + insight + CTA
import { randomBytes } from "node:crypto";
import type { CmsJournalBlock } from "@/lib/cms/types";
import type {
  ConversionInput, ConversionOutput, ConversionSettings, QualityCheck, ConversionLength,
} from "./conversion-types";

// ══════════════════════════════════════
// 1. Content sanitizer — 移除小红书风噪点
// ══════════════════════════════════════

// emoji ranges (常见小红书 emoji + 装饰符号) · 剥离但不改标点
const NOISE_PATTERNS: RegExp[] = [
  /[\u{1F300}-\u{1F5FF}]/gu, // Misc Symbols and Pictographs
  /[\u{1F600}-\u{1F64F}]/gu, // Emoticons
  /[\u{1F680}-\u{1F6FF}]/gu, // Transport
  /[\u{1F700}-\u{1F77F}]/gu,
  /[\u{1F900}-\u{1F9FF}]/gu, // Supplemental Symbols
  /[\u{2600}-\u{26FF}]/gu,   // Misc symbols (☀ ⭐)
  /[\u{2700}-\u{27BF}]/gu,   // Dingbats (✂ ✅)
  /[\u{1F1E6}-\u{1F1FF}]/gu, // Regional indicator flags
  /[✨🌟💕💖💫🔥🎉🌈❤️💜🌸🌷💐🎀]/g,
  /#[^\s#]{1,30}#/g,          // #hashtag# 双井号形式
];

// 常见小红书流水式话术,直接删除或替换
const STOP_PHRASES: [RegExp, string][] = [
  [/^\s*姐妹们[:：!！]?\s*/g, ""],
  [/^\s*(sisters|guys)[:,!]?\s*/gi, ""],
  [/(记得|一定要|快来|求|求求你们|超值得|真的太[^\n。,]{1,10})[!！]?/g, ""],
  [/(码住|收藏起来|收藏起来!?|冲！?|冲鸭|冲吧)[!！~]?/g, ""],
  [/(点赞|评论|转发)[+][^。\n]{0,20}/g, ""],
  [/(号称|据说|听说)/g, ""],
  [/(超绝|绝了|绝绝子|yyds|YYDS)/g, ""],
];

// 常见 xhs 列表符号 → 统一为半角 -
const LIST_MARKERS: [RegExp, string][] = [
  [/^\s*[1-9][0-9]?[️⃣]?\s*[.、)）]?\s*/, ""],
  [/^\s*[•·●◆◇▪▫➤➢▶⇨]\s*/, ""],
  [/^\s*[-–—]\s*/, ""],
  [/^\s*\d+\s*[.．]\s*/, ""],
];

export function sanitize(raw: string): string {
  let s = raw.replace(/\r\n/g, "\n").replace(/　/g, " ");
  for (const p of NOISE_PATTERNS) s = s.replace(p, "");
  for (const [p, r] of STOP_PHRASES) s = s.replace(p, r);
  // 多空行合并
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  // 折行的中文中间空格清理 (小红书粘贴常见)
  s = s.replace(/([一-鿿])[  ]([一-鿿])/g, "$1$2");
  return s;
}

// ══════════════════════════════════════
// 2. Line-level classifier — heading / list / paragraph
// ══════════════════════════════════════

type ClassifiedLine = { type: "heading" | "list" | "paragraph" | "blank"; text: string };

function classifyLine(rawLine: string): ClassifiedLine {
  const line = rawLine.trim();
  if (!line) return { type: "blank", text: "" };

  // 明显的列表项
  for (const [marker] of LIST_MARKERS) {
    if (marker.test(rawLine)) {
      return { type: "list", text: rawLine.replace(marker, "").trim() };
    }
  }

  // 全 emoji 装饰行,已在 sanitize 阶段移除
  // 短行 (<= 30 字) 且以 ？! 或冒号收尾 → heading
  const isShort = line.length <= 30;
  const endsWithHint = /[:：?？!!]$/.test(line);
  const questionShape = /^(什么|为什么|如何|怎么|why|how|what)/i.test(line);
  if (isShort && (endsWithHint || questionShape)) {
    return { type: "heading", text: line.replace(/[:：?？!!]+$/, "") };
  }

  return { type: "paragraph", text: line };
}

// ══════════════════════════════════════
// 3. Blocks builder
// ══════════════════════════════════════

function buildBlocks(sanitized: string): CmsJournalBlock[] {
  const lines = sanitized.split(/\n/).map(classifyLine);
  const blocks: CmsJournalBlock[] = [];
  let currentList: string[] | null = null;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      blocks.push({ type: "paragraph", text: paragraphBuffer.join(" ").trim() });
      paragraphBuffer = [];
    }
  };
  const flushList = () => {
    if (currentList && currentList.length) {
      blocks.push({ type: "list", items: currentList });
    }
    currentList = null;
  };

  for (const l of lines) {
    if (l.type === "blank") {
      flushParagraph();
      flushList();
      continue;
    }
    if (l.type === "heading") {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: l.text });
      continue;
    }
    if (l.type === "list") {
      flushParagraph();
      if (!currentList) currentList = [];
      currentList.push(l.text);
      continue;
    }
    // paragraph
    flushList();
    paragraphBuffer.push(l.text);
  }
  flushParagraph();
  flushList();
  return blocks;
}

// ══════════════════════════════════════
// 4. Category-aware Sugardating overlay (idiom + CTA seeds)
// ══════════════════════════════════════

const CATEGORY_INSIGHTS: Record<string, string> = {
  "relationship-intelligence":   "在 Sugardating,关系的高级玩法从不是套路,是判断力 —— 视频、认证、语言一致性都是节省时间的过滤。",
  "asian-southeast-asian-culture": "亚洲女性群体从不是单一模板 —— 文化背景、语言、家族观念都不同,理解差异是尊重的第一步。",
  "london-elite-lifestyle":      "在伦敦,不是所有 postcode 都指向同一种社交 —— Mayfair、Kensington、Canary Wharf 各有语法。",
  "massage-spa-recovery":        "恢复不是奢侈,是一种表现能力 —— 优质的按摩和 SPA 决定你到达下一个场合时的能量水平。",
  "fitness-performance":         "40 岁之后,吸引力更多来自能量与专注度的稳定输出,而非外形。",
  "wealth-privacy-risk":         "高净值用户从不在早期沟通中谈论具体资产 —— 那是风险入口,不是吸引力入口。",
  "longevity-wellness":          "养生不是老派话题 —— 它是长期吸引力管理。5 年后你能量水平的差距,从今天开始定价。",
  "grooming-style-photography":  "个人形象是可训练的信号系统 —— 让对的人先看到对的信息。",
  "business-travellers-london":  "48 小时的伦敦不容许每件事都做 —— 挑两件,做到位。",
  "safety-privacy-trust":        "隐私不是偏执,是设计选择 —— 每一层可控性都值得主动升级。",
  "sugargirl-creator-journal":   "第一张照片决定 70% 的点击率 —— 它不需要最美,但必须最清晰地传递你希望被理解的形象。",
  "chinese-in-uk":               "英国华人圈子看似分散,实际非常小 —— 一张照片流出后 72 小时内会被识别的概率远高于想象。",
};

const CATEGORY_CTAS: Record<string, string[]> = {
  "relationship-intelligence":    ["browse-sugargirls", "premium"],
  "asian-southeast-asian-culture": ["browse-asian", "safety", "video-profiles"],
  "london-elite-lifestyle":       ["browse-london", "browse-sugargirls"],
  "massage-spa-recovery":         ["browse-london"],
  "fitness-performance":          ["browse-sugargirls", "premium"],
  "wealth-privacy-risk":          ["safety", "premium"],
  "longevity-wellness":           ["browse-sugargirls"],
  "grooming-style-photography":   ["browse-sugargirls", "apply-creator"],
  "business-travellers-london":   ["browse-london", "premium", "video-profiles"],
  "safety-privacy-trust":         ["video-profiles", "safety", "browse-asian"],
  "sugargirl-creator-journal":    ["apply-creator", "browse-sugargirls"],
  "chinese-in-uk":                ["safety", "premium", "browse-asian"],
};

// ══════════════════════════════════════
// 5. Title / excerpt / tags derivation
// ══════════════════════════════════════

function extractTitle(blocks: CmsJournalBlock[], fallback: string): string {
  // 找第一个 heading;否则用首个 paragraph 首句
  const h = blocks.find((b) => b.type === "heading");
  if (h?.text) return h.text.slice(0, 80);
  const p = blocks.find((b) => b.type === "paragraph");
  if (p?.text) return p.text.split(/[。.!?！?]/)[0].slice(0, 80);
  return fallback.slice(0, 80) || "未命名文章";
}

function extractExcerpt(blocks: CmsJournalBlock[]): string {
  const p = blocks.find((b) => b.type === "paragraph");
  if (!p?.text) return "";
  return p.text.slice(0, 200);
}

function estimateReadingTime(blocks: CmsJournalBlock[], lang: "zh" | "en"): string {
  const words = blocks.reduce((s, b) => {
    if (b.text) return s + b.text.length;
    if (b.items) return s + b.items.join("").length;
    if (b.title) return s + b.title.length;
    return s;
  }, 0);
  // 中文按 300 字/分钟,英文按 200 词/分钟 (词 ≈ 5 chars)
  const minutes = lang === "zh"
    ? Math.max(2, Math.round(words / 300))
    : Math.max(2, Math.round(words / 1000));
  return lang === "zh" ? `${minutes} 分钟阅读` : `${minutes} min read`;
}

function slugify(text: string): string {
  const t = text.toLowerCase().replace(/[^a-z0-9一-鿿\s-]/g, "");
  // pinyin-free · 保留中文短语式 slug (Chinese-in-URL is OK for Next.js)
  return t.trim().replace(/\s+/g, "-").slice(0, 60) || `note-${randomBytes(3).toString("hex")}`;
}

function guessTags(rawText: string): string[] {
  const dict: Record<string, string> = {
    "伦敦": "london", "London": "london",
    "亚裔": "asian", "亚洲": "asian",
    "泰": "thai", "越南": "vietnamese", "菲律宾": "filipina",
    "隐私": "privacy", "安全": "safety",
    "视频": "video", "认证": "verification",
    "健身": "fitness", "养生": "wellness", "按摩": "massage",
    "商务": "business", "旅行": "travel",
    "华人": "chinese",
  };
  const out = new Set<string>();
  for (const [k, v] of Object.entries(dict)) {
    if (rawText.includes(k)) out.add(v);
  }
  return Array.from(out).slice(0, 6);
}

// ══════════════════════════════════════
// 6. Quality checklist
// ══════════════════════════════════════

function checkQuality(rawText: string, blocks: CmsJournalBlock[]): QualityCheck[] {
  const wordCount = blocks.reduce((s, b) => s + (b.text?.length ?? b.items?.join("").length ?? 0), 0);
  return [
    {
      key: "length",
      label: "内容长度合理",
      passed: wordCount >= 200 && wordCount <= 3000,
      hint: wordCount < 200 ? `当前 ${wordCount} 字 · 建议 200+` : wordCount > 3000 ? `当前 ${wordCount} 字 · 建议控制在 3000 以内` : `${wordCount} 字`,
    },
    {
      key: "structure",
      label: "有结构化 blocks",
      passed: blocks.some((b) => b.type === "heading") || blocks.some((b) => b.type === "list"),
      hint: "至少 1 个 heading 或 list,阅读体验更好",
    },
    {
      key: "no-emoji-noise",
      label: "已清理小红书装饰符号",
      passed: !/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}]/u.test(blocks.map((b) => b.text || "").join("")),
      hint: "自动 sanitizer 已移除 · 检查是否残留",
    },
    {
      key: "sensitive-check",
      label: "无明显露骨/未成年/交易词",
      passed: !/(未成年|包夜|外围|特殊服务|保证约|保证见面)/i.test(rawText),
      hint: "如触发,请手动改写后再发布",
    },
    {
      key: "source-rights",
      label: "已确认素材授权",
      passed: false,     // caller 应根据 settings.sourceRightsConfirmed 覆盖
      hint: "必须勾选:承诺内容为原创 / 已获授权改写",
    },
  ];
}

// ══════════════════════════════════════
// 7. Main converter
// ══════════════════════════════════════

export function convertNoteToBlog(input: ConversionInput, actorEmail?: string): ConversionOutput {
  const { rawText, settings, sourceUrl, sourceAuthor } = input;
  const sanitized = sanitize(rawText);
  const blocks = buildBlocks(sanitized);

  // Insert Sugardating Insight at end if requested
  if (settings.insertInsight) {
    const insightText = CATEGORY_INSIGHTS[settings.categorySlug];
    if (insightText) {
      blocks.push({ type: "insight", title: "Sugardating Insight", text: insightText });
    }
  }

  // Length adjust: brief → trim to 2-3 paragraphs; deep → keep all; standard → keep all
  const trimmed: CmsJournalBlock[] = settings.length === "brief"
    ? blocks.slice(0, Math.min(6, blocks.length))
    : blocks;

  // Language handling (heuristic:仅标记 · 不做真翻译)
  const primaryLang: "zh" | "en" = /[一-鿿]/.test(sanitized) ? "zh" : "en";
  const finalLang: "zh" | "en" = settings.language === "en" ? "en" : primaryLang;

  // If bilingual, prepend a note block (no real translation available heuristically)
  if (settings.language === "bilingual" && primaryLang === "zh") {
    trimmed.unshift({
      type: "paragraph",
      text: "[双语版本 · English translation required · 请人工翻译或删除此提示]",
    });
  }
  if (settings.language === "en" && primaryLang === "zh") {
    trimmed.unshift({
      type: "paragraph",
      text: "[English draft · 原文中文,需人工翻译]",
    });
  }

  const title = extractTitle(trimmed, "从小红书笔记生成的文章");
  const excerpt = extractExcerpt(trimmed);
  const readingTime = estimateReadingTime(trimmed, finalLang);
  const tags = guessTags(rawText);
  const slug = slugify(title);
  const cta = settings.suggestedCtas.length
    ? settings.suggestedCtas.slice(0, 3)
    : (CATEGORY_CTAS[settings.categorySlug] ?? []).slice(0, 3);

  const quality = checkQuality(rawText, trimmed).map((q) =>
    q.key === "source-rights" ? { ...q, passed: settings.sourceRightsConfirmed } : q
  );

  return {
    id: `conv_${randomBytes(4).toString("hex")}`,
    title,
    slug,
    excerpt,
    categorySlug: settings.categorySlug,
    language: finalLang,
    author: actorEmail || "Sugardating Editorial",
    readingTime,
    tags,
    body: trimmed,
    cta,
    qualityChecks: quality,
    sourceUrl,
    sourceAuthor,
    createdAt: new Date().toISOString(),
    createdBy: actorEmail,
  };
}
