// Sugardating 会员定价 · 3 级递进 (Basic / Paid / Verified) · 集中配置
// GBP · 单一 source of truth · 前端 /membership + purchase modal + Admin 复用
// Legacy 兼容:free / vip / svip 会被映射到新体系,不再单独展示

// ══════════════════════════════════════
// Types
// ══════════════════════════════════════

/** 新数据模型 · 只有两个 storage tier;verified 是 paid + 通过认证的 derived 展示 */
export type MembershipTier = "basic" | "paid";

/** 独立字段 · 与 tier 正交 · 认证通过后即使会员到期也保留 */
export type VerificationStatus = "unverified" | "pending" | "verified";

/** 前台展示身份 · 由 tier + verificationStatus 组合决定 */
export type DisplayMembershipLevel = "basic" | "paid" | "verified";

/** 4 种付费购买选项 · basic 免费不计入 */
export type BillingPeriod = "intro7d" | "monthly" | "quarterly" | "yearly";

/** 遗留兼容 · 旧 tier 值(free/vip/svip)在读侧被映射 */
export type LegacyTier = "free" | "vip" | "svip";

export interface MembershipPlan {
  id: string;
  tier: "paid";                       // 只有 paid 有购买计划
  period: BillingPeriod;
  price: number;                      // 单位:£
  currency: "£";
  monthlyEquivalent: number;          // 月均 · 用于 UI 展示
  savings?: number;                   // vs 逐月购买节省 · £
  badge?: string;                     // 「最受欢迎」/「最佳价值」
  isIntro?: boolean;                  // 首充体验 · 每账号只可购一次
  autoRenew: boolean;
  displayName: string;                // 弹窗名 · 例:付费会员 · 月度
  buttonText: string;                 // 卡片按钮
  features: string[];                 // 简短权益 · 卡片显示
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;                      // Credits 保留原有 S$ 定价 · 本次不动
  currency: "S$";
  pricePerCredit: number;
  badge?: string;
  suitFor: string;
}

// ══════════════════════════════════════
// Level / Legacy 映射
// ══════════════════════════════════════

/** 前台身份计算:paid + verified → verified · 否则 paid / basic */
export function computeDisplayLevel(
  tier: MembershipTier | LegacyTier | undefined,
  verification: VerificationStatus | undefined,
): DisplayMembershipLevel {
  const normalized = mapLegacyTier(tier);
  if (normalized === "paid" && verification === "verified") return "verified";
  return normalized;
}

/** Legacy tier 迁移 · 旧值统一映射到新体系 */
export function mapLegacyTier(t: MembershipTier | LegacyTier | undefined): MembershipTier {
  if (!t) return "basic";
  if (t === "vip" || t === "svip") return "paid";
  if (t === "free") return "basic";
  return t;
}

export const LEVEL_LABEL_ZH: Record<DisplayMembershipLevel, string> = {
  basic:    "基础会员",
  paid:     "付费会员",
  verified: "认证会员",
};

export const LEVEL_LABEL_EN: Record<DisplayMembershipLevel, string> = {
  basic:    "Basic Member",
  paid:     "Paid Member",
  verified: "Verified Member",
};

// ══════════════════════════════════════
// Period labels
// ══════════════════════════════════════

export const PERIOD_LABEL: Record<BillingPeriod, string> = {
  intro7d:   "7 天体验",
  monthly:   "月度",
  quarterly: "季度",       // 用户可见文案统一「3 个月」· 见 PERIOD_SUFFIX
  yearly:    "年度",
};

export const PERIOD_LABEL_EN: Record<BillingPeriod, string> = {
  intro7d:   "7-Day Intro",
  monthly:   "Monthly",
  quarterly: "3 Months",
  yearly:    "Yearly",
};

export const PERIOD_SUFFIX: Record<BillingPeriod, string> = {
  intro7d:   "/ 7 天",
  monthly:   "/ 月",
  quarterly: "/ 3 个月",
  yearly:    "/ 年",
};

export function periodDays(p: BillingPeriod): number {
  return p === "intro7d" ? 7 : p === "monthly" ? 30 : p === "quarterly" ? 90 : 365;
}

// ══════════════════════════════════════
// 付费会员 · 4 计划
// ══════════════════════════════════════

const PAID_FEATURES_SHORT: string[] = [
  "解除聊天对象人数限制",
  "解除消息次数限制",
  "已建立会话消息不限量",
  "多语言自动翻译",
  "已读状态",
  "匿名浏览",
  "高级筛选",
  "付费会员身份",
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "paid_intro_7d",
    tier: "paid",
    period: "intro7d",
    price: 9.99,
    currency: "£",
    monthlyEquivalent: 42.81,           // 展示用 · 不参与营销
    isIntro: true,
    autoRenew: false,
    displayName: "新用户首充体验会员",
    buttonText: "£9.99 体验 7 天",
    features: PAID_FEATURES_SHORT,
  },
  {
    id: "paid_monthly",
    tier: "paid",
    period: "monthly",
    price: 29.99,
    currency: "£",
    monthlyEquivalent: 29.99,
    autoRenew: true,
    displayName: "付费会员 · 月度",
    buttonText: "开通月度会员",
    features: PAID_FEATURES_SHORT,
  },
  {
    id: "paid_quarterly",
    tier: "paid",
    period: "quarterly",
    price: 69.99,
    currency: "£",
    monthlyEquivalent: 23.33,
    savings: 19.98,
    badge: "最受欢迎",
    autoRenew: true,
    displayName: "付费会员 · 3 个月",
    buttonText: "开通季度会员",
    features: PAID_FEATURES_SHORT,
  },
  {
    id: "paid_yearly",
    tier: "paid",
    period: "yearly",
    price: 259.99,
    currency: "£",
    monthlyEquivalent: 21.67,
    savings: 99.89,
    badge: "最佳价值",
    autoRenew: true,
    displayName: "付费会员 · 年度",
    buttonText: "开通年度会员",
    features: PAID_FEATURES_SHORT,
  },
];

/** 默认高亮季度 */
export const DEFAULT_PLAN_ID = "paid_quarterly";

export function getPlanById(id: string): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export function getPlansForPurchase(includeIntro: boolean): MembershipPlan[] {
  return MEMBERSHIP_PLANS.filter((p) => includeIntro || !p.isIntro);
}

// ══════════════════════════════════════
// Basic 用户参考 (免费 · 保留当前免费限制)
// ══════════════════════════════════════

export const BASIC_TIER = {
  tier: "basic" as const,
  label: "基础会员",
  labelEn: "Basic Member",
  description: "适合先浏览和体验平台 · 保留当前所有免费用户规则",
  features: [
    "浏览公开资料",
    "查看公开照片",
    "收藏资料",
    "基础筛选",
    "使用当前已有的有限聊天体验",
    "购买 Credits",
    "使用 Credits 解锁付费照片与视频",
    "使用 Credits 购买礼物或打赏",
  ],
};

// ══════════════════════════════════════
// Verified 展示 (无独立价格 · paid + KYC 后自动获得)
// ══════════════════════════════════════

export const VERIFIED_TIER = {
  tier: "verified" as const,
  label: "认证会员",
  labelEn: "Verified Member",
  description: "付费会员 + 通过平台身份认证 · 无独立价格",
  extras: [
    "认证会员 Badge",
    "身份已认证状态",
    "展示已完成的认证项目",
    "包含付费会员全部权益",
  ],
};

// ══════════════════════════════════════
// Credits 保持原样 (S$ 定价不动 · 本次不修改)
// ══════════════════════════════════════

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    credits: 100,
    price: 59,
    currency: "S$",
    pricePerCredit: 0.59,
    badge: "适合体验",
    suitFor: "先解锁 1-2 张私密照片 · 试送礼物",
  },
  {
    id: "popular",
    credits: 350,
    price: 169,
    currency: "S$",
    pricePerCredit: 0.48,
    badge: "最受欢迎",
    suitFor: "每周持续互动 · 解锁多张照片 + 视频确认",
  },
  {
    id: "pro",
    credits: 800,
    price: 329,
    currency: "S$",
    pricePerCredit: 0.41,
    badge: "高频用户",
    suitFor: "商务旅行 + 多位对象 · 私密视频解锁 + 打赏",
  },
  {
    id: "whale",
    credits: 1800,
    price: 649,
    currency: "S$",
    pricePerCredit: 0.36,
    badge: "最佳价值",
    suitFor: "重度用户 · 长期沟通 + 高端礼物 + boost",
  },
];

export function getCreditPackage(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}

/** 付费会员点充权益 · 保留原 VIP bonus 数值 (10%) · 展示文案改为「付费会员」 */
export const PAID_CREDIT_BONUS_PCT = 10;

export const CREDIT_USAGE_GUIDE: { label: string; range: string }[] = [
  { label: "私密照片解锁",   range: "8 – 18 Credits" },
  { label: "私密视频解锁",   range: "28 – 88 Credits" },
  { label: "虚拟礼物 / 打赏", range: "10 – 200 Credits" },
  { label: "优先消息",       range: "5 Credits" },
  { label: "视频确认请求",   range: "20 – 60 Credits" },
  { label: "Boost 曝光",     range: "50 – 150 Credits" },
];

// ══════════════════════════════════════
// 权益对比表 · 基础 / 付费 / 认证 三列
// ══════════════════════════════════════

export interface ComparisonRow {
  label: string;
  basic: string | boolean;
  paid: string | boolean;
  verified: string | boolean;
}

export interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

export const COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    title: "基础使用",
    rows: [
      { label: "浏览公开资料",       basic: true,      paid: true, verified: true },
      { label: "查看公开照片",       basic: true,      paid: true, verified: true },
      { label: "收藏资料",           basic: true,      paid: true, verified: true },
      { label: "基础筛选",           basic: true,      paid: true, verified: true },
    ],
  },
  {
    title: "聊天与沟通",
    rows: [
      { label: "有限聊天体验",           basic: "使用当前免费限制", paid: "已解除",     verified: "已解除" },
      { label: "解除聊天对象人数限制",   basic: false,             paid: true,         verified: true },
      { label: "解除消息次数限制",       basic: false,             paid: true,         verified: true },
      { label: "已建立会话消息不限量",   basic: false,             paid: true,         verified: true },
      { label: "自动翻译",               basic: "基础",            paid: "完整",       verified: "完整" },
      { label: "已读状态",               basic: false,             paid: true,         verified: true },
      { label: "匿名浏览",               basic: false,             paid: true,         verified: true },
      { label: "高级筛选",               basic: false,             paid: true,         verified: true },
    ],
  },
  {
    title: "认证与信任",
    rows: [
      { label: "身份认证状态",       basic: "可提前完成", paid: "可提前完成", verified: "已认证" },
      { label: "认证会员 Badge",     basic: false,       paid: false,       verified: true },
      { label: "认证项目展示",       basic: false,       paid: false,       verified: true },
    ],
  },
  {
    title: "付费功能",
    rows: [
      { label: "Credits 充值",       basic: true, paid: true, verified: true },
      { label: "Locked Media 解锁",  basic: true, paid: true, verified: true },
      { label: "礼物与打赏",         basic: true, paid: true, verified: true },
      { label: "定制服务提交",       basic: true, paid: true, verified: true },
    ],
  },
];

/** 兼容旧引用 · 保留 flat 版本 */
export const COMPARISON_ROWS: ComparisonRow[] = COMPARISON_GROUPS.flatMap((g) => g.rows);
