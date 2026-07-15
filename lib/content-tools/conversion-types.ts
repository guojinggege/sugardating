// 内容智能工坊 · 类型 (client-safe · 与 Journal block 兼容)
import type { CmsJournalBlock } from "@/lib/cms/types";

export type ConversionLanguage = "zh" | "en" | "bilingual";
export type ConversionTone = "editorial" | "insider" | "practical" | "narrative";
export type ConversionLength = "brief" | "standard" | "deep";

export interface ConversionSettings {
  // 内容方向 · 对应 Sugardating Journal 12 分类之一
  categorySlug: string;
  language: ConversionLanguage;
  tone: ConversionTone;
  length: ConversionLength;
  // 是否在末尾自动插入一条 Sugardating Insight
  insertInsight: boolean;
  // 是否自动追加 CTA (最多 3 个)
  suggestedCtas: string[];
  // Source rights confirmation — required
  sourceRightsConfirmed: boolean;
}

export interface ConversionInput {
  // 用户粘贴的小红书笔记正文
  rawText: string;
  // Source metadata (可选,仅归属)
  sourceUrl?: string;
  sourceAuthor?: string;
  sourceTitle?: string;
  settings: ConversionSettings;
}

export interface ConversionOutput {
  id: string;
  title: string;
  slug: string;                    // normalized
  excerpt: string;
  categorySlug: string;
  language: "zh" | "en";           // bilingual 输出仍标记主语言 zh
  author: string;
  readingTime: string;
  tags: string[];
  body: CmsJournalBlock[];
  cta: string[];
  qualityChecks: QualityCheck[];   // 输入长度、结构、Sugardating idiom 命中等
  sourceUrl?: string;
  sourceAuthor?: string;
  createdAt: string;
  createdBy?: string;              // admin email
  usedForDraft?: string;           // 已用于创建的 Journal draft slug (追踪)
}

export interface QualityCheck {
  key: string;
  label: string;
  passed: boolean;
  hint: string;
}
