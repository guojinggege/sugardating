// Journal SEO 助手 · 长度/关键词/密度检查 · 无外部依赖
// 检查项参考 Google 官方 SEO 指南 + Yoast 通用规则

export interface SeoCheck {
  key: string;
  label: string;
  passed: boolean;
  level: "ok" | "warn" | "error";
  hint: string;
}

export interface SeoInput {
  title: string;
  seoTitle?: string;
  slug: string;
  excerpt: string;
  seoDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  bodyText: string;                    // 拼接后的正文
  headings: string[];                  // heading blocks 的 text
  categorySlug?: string;
  coverImage?: string;
  ogImage?: string;
}

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;
const SLUG_MAX = 75;
const BODY_MIN = 300;

// ══════════════════════════════════════
// 单项检查
// ══════════════════════════════════════

export function checkSeoTitle(effectiveTitle: string): SeoCheck {
  const len = effectiveTitle.length;
  if (!effectiveTitle) return { key: "title-length", label: "SEO 标题", passed: false, level: "error", hint: "缺失 · Google 会自动截取,建议手动定" };
  if (len < TITLE_MIN) return { key: "title-length", label: "SEO 标题", passed: false, level: "warn", hint: `${len} 字符 · 建议 ${TITLE_MIN}-${TITLE_MAX}` };
  if (len > TITLE_MAX + 5) return { key: "title-length", label: "SEO 标题", passed: false, level: "warn", hint: `${len} 字符 · SERP 会截断 (建议 ≤ ${TITLE_MAX})` };
  return { key: "title-length", label: "SEO 标题", passed: true, level: "ok", hint: `${len} 字符 · 合适` };
}

export function checkSeoDescription(effectiveDesc: string): SeoCheck {
  const len = effectiveDesc.length;
  if (!effectiveDesc) return { key: "desc-length", label: "SEO 描述", passed: false, level: "error", hint: "缺失 · 建议 120-158 字符" };
  if (len < DESC_MIN) return { key: "desc-length", label: "SEO 描述", passed: false, level: "warn", hint: `${len} 字符 · 建议 ${DESC_MIN}-${DESC_MAX}` };
  if (len > DESC_MAX + 20) return { key: "desc-length", label: "SEO 描述", passed: false, level: "warn", hint: `${len} 字符 · SERP 会截断 (建议 ≤ ${DESC_MAX})` };
  return { key: "desc-length", label: "SEO 描述", passed: true, level: "ok", hint: `${len} 字符 · 合适` };
}

export function checkSlug(slug: string): SeoCheck {
  if (!slug) return { key: "slug", label: "Slug", passed: false, level: "error", hint: "必填" };
  if (slug.length > SLUG_MAX) return { key: "slug", label: "Slug", passed: false, level: "warn", hint: `${slug.length} 字符 · 建议 ≤ ${SLUG_MAX}` };
  if (!/^[a-z0-9-]+$/.test(slug)) return { key: "slug", label: "Slug", passed: false, level: "error", hint: "仅小写字母/数字/连字符" };
  if (/^-|-$|--/.test(slug)) return { key: "slug", label: "Slug", passed: false, level: "warn", hint: "不要以 - 开头/结尾 · 不要出现连续 --" };
  return { key: "slug", label: "Slug", passed: true, level: "ok", hint: "格式合规" };
}

export function checkPrimaryKeywordInTitle(effectiveTitle: string, kw?: string): SeoCheck {
  if (!kw) return { key: "kw-title", label: "主关键词在标题", passed: false, level: "warn", hint: "未设置主关键词" };
  const hit = effectiveTitle.toLowerCase().includes(kw.toLowerCase());
  return {
    key: "kw-title", label: "主关键词在标题",
    passed: hit, level: hit ? "ok" : "warn",
    hint: hit ? `已命中: "${kw}"` : `建议标题中包含 "${kw}"`,
  };
}

export function checkPrimaryKeywordInDesc(effectiveDesc: string, kw?: string): SeoCheck {
  if (!kw) return { key: "kw-desc", label: "主关键词在描述", passed: false, level: "warn", hint: "未设置主关键词" };
  const hit = effectiveDesc.toLowerCase().includes(kw.toLowerCase());
  return {
    key: "kw-desc", label: "主关键词在描述",
    passed: hit, level: hit ? "ok" : "warn",
    hint: hit ? "已命中" : `建议描述中包含 "${kw}"`,
  };
}

export function checkKeywordDensity(bodyText: string, kw?: string): SeoCheck {
  if (!kw) return { key: "kw-density", label: "关键词密度", passed: false, level: "warn", hint: "未设置主关键词" };
  const kwLower = kw.toLowerCase();
  const bodyLower = bodyText.toLowerCase();
  // 计算命中次数 (正则转义)
  const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = bodyLower.match(new RegExp(escaped, "g")) || [];
  const totalLen = bodyLower.length || 1;
  const kwCharsCovered = matches.length * kwLower.length;
  const density = (kwCharsCovered / totalLen) * 100;
  const pct = density.toFixed(2);
  if (matches.length === 0) return { key: "kw-density", label: "关键词密度", passed: false, level: "error", hint: `正文未出现 "${kw}" · 至少 1 次` };
  if (density < 0.3) return { key: "kw-density", label: "关键词密度", passed: false, level: "warn", hint: `${matches.length} 次 · 密度 ${pct}% (偏低 · 建议 0.5-2.5%)` };
  if (density > 3.5) return { key: "kw-density", label: "关键词密度", passed: false, level: "warn", hint: `${matches.length} 次 · 密度 ${pct}% (过高 · 有堆砌嫌疑)` };
  return { key: "kw-density", label: "关键词密度", passed: true, level: "ok", hint: `${matches.length} 次 · 密度 ${pct}%` };
}

export function checkBodyLength(bodyText: string): SeoCheck {
  const len = bodyText.length;
  if (len < BODY_MIN) return { key: "body-length", label: "正文长度", passed: false, level: "warn", hint: `${len} 字 · 建议 ≥ ${BODY_MIN}` };
  return { key: "body-length", label: "正文长度", passed: true, level: "ok", hint: `${len} 字` };
}

export function checkHeadingStructure(headings: string[]): SeoCheck {
  if (headings.length === 0) return { key: "headings", label: "标题结构", passed: false, level: "warn", hint: "无 H2 · 建议至少 2 个二级标题" };
  if (headings.length === 1) return { key: "headings", label: "标题结构", passed: false, level: "warn", hint: "仅 1 个 · 建议 2 个以上" };
  return { key: "headings", label: "标题结构", passed: true, level: "ok", hint: `${headings.length} 个 H2` };
}

export function checkOgImage(coverImage?: string, ogImage?: string): SeoCheck {
  const eff = ogImage || coverImage;
  if (!eff) return { key: "og-image", label: "分享图 (OG image)", passed: false, level: "warn", hint: "缺失 · Facebook/X 分享会用文字卡片" };
  return { key: "og-image", label: "分享图 (OG image)", passed: true, level: "ok", hint: "已设置" };
}

// ══════════════════════════════════════
// 综合评分 · 前端展示
// ══════════════════════════════════════

export interface SeoReport {
  score: number;               // 0-100
  checks: SeoCheck[];
  effectiveTitle: string;
  effectiveDescription: string;
}

export function analyzeSeo(input: SeoInput): SeoReport {
  const effectiveTitle = input.seoTitle?.trim() || input.title;
  const effectiveDescription = input.seoDescription?.trim() || input.excerpt;

  const checks: SeoCheck[] = [
    checkSeoTitle(effectiveTitle),
    checkSeoDescription(effectiveDescription),
    checkSlug(input.slug),
    checkPrimaryKeywordInTitle(effectiveTitle, input.primaryKeyword),
    checkPrimaryKeywordInDesc(effectiveDescription, input.primaryKeyword),
    checkKeywordDensity(input.bodyText, input.primaryKeyword),
    checkBodyLength(input.bodyText),
    checkHeadingStructure(input.headings),
    checkOgImage(input.coverImage, input.ogImage),
  ];

  const okCount = checks.filter((c) => c.passed).length;
  const score = Math.round((okCount / checks.length) * 100);

  return { score, checks, effectiveTitle, effectiveDescription };
}

// ══════════════════════════════════════
// SERP 预览截断 · 与 Google 桌面版一致
// ══════════════════════════════════════

export function truncateForSerpTitle(text: string, max = 60): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export function truncateForSerpDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export function displaySerpUrl(slug: string, categorySlug: string): string {
  const host = "sugardating.co.uk";
  return `https://${host} › community › ${categorySlug} › post › ${slug}`;
}
