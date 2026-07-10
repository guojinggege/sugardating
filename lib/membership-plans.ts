// Sugardating 会员定价 · Credits 点充 · 集中配置
// 单一 source of truth · 后台可读可改 · 前端 /membership 与 Wallet 组件复用

export type MembershipTier = "free" | "vip" | "svip";
export type BillingPeriod = "monthly" | "quarterly" | "yearly";

export interface MembershipPlan {
  id: string;
  tier: "vip" | "svip";
  period: BillingPeriod;
  price: number;
  currency: "S$";
  monthlyEquivalent: number;
  savings?: number;
  badge?: string;
  includedCredits: number;
  newChatLimitPerMonth: number;
  unlimitedMessagesInExistingChats: boolean;
  translationLimit: number | "fair-use";
  creditBonusPercent: number;
  features: string[];
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  currency: "S$";
  pricePerCredit: number;
  badge?: string;
  suitFor: string;
}

// ══════════════════════════════════════
// Period labels · 3 语言 fallback
// ══════════════════════════════════════

export const PERIOD_LABEL: Record<BillingPeriod, string> = {
  monthly:   "月度",
  quarterly: "季度",
  yearly:    "年度",
};

export const PERIOD_LABEL_EN: Record<BillingPeriod, string> = {
  monthly:   "Monthly",
  quarterly: "Quarterly",
  yearly:    "Yearly",
};

export const PERIOD_SUFFIX: Record<BillingPeriod, string> = {
  monthly:   "/月",
  quarterly: "/3 个月",
  yearly:    "/年",
};

// ══════════════════════════════════════
// VIP · 3 periods
// ══════════════════════════════════════

const VIP_PLANS: MembershipPlan[] = [
  {
    id: "vip-monthly",
    tier: "vip",
    period: "monthly",
    price: 89,
    currency: "S$",
    monthlyEquivalent: 89,
    includedCredits: 80,
    newChatLimitPerMonth: 60,
    unlimitedMessagesInExistingChats: true,
    translationLimit: 1000,
    creditBonusPercent: 10,
    features: [
      "每月最多 60 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译 1,000 条 / 月",
      "查看已读状态",
      "匿名浏览 profiles",
      "每月赠送 80 Credits",
      "Credits 充值 +10% bonus",
      "优先客服",
      "VIP Badge",
    ],
  },
  {
    id: "vip-quarterly",
    tier: "vip",
    period: "quarterly",
    price: 239,
    currency: "S$",
    monthlyEquivalent: 79.7,
    savings: 28,
    badge: "推荐新用户",
    includedCredits: 80,
    newChatLimitPerMonth: 60,
    unlimitedMessagesInExistingChats: true,
    translationLimit: 1000,
    creditBonusPercent: 10,
    features: [
      "每月最多 60 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译 1,000 条 / 月",
      "查看已读状态",
      "匿名浏览 profiles",
      "每月赠送 80 Credits",
      "Credits 充值 +10% bonus",
      "优先客服",
      "VIP Badge",
    ],
  },
  {
    id: "vip-yearly",
    tier: "vip",
    period: "yearly",
    price: 799,
    currency: "S$",
    monthlyEquivalent: 66.6,
    savings: 269,
    includedCredits: 80,
    newChatLimitPerMonth: 60,
    unlimitedMessagesInExistingChats: true,
    translationLimit: 1000,
    creditBonusPercent: 10,
    features: [
      "每月最多 60 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译 1,000 条 / 月",
      "查看已读状态",
      "匿名浏览 profiles",
      "每月赠送 80 Credits",
      "Credits 充值 +10% bonus",
      "优先客服",
      "VIP Badge",
    ],
  },
];

// ══════════════════════════════════════
// SVIP · 3 periods
// ══════════════════════════════════════

const SVIP_PLANS: MembershipPlan[] = [
  {
    id: "svip-monthly",
    tier: "svip",
    period: "monthly",
    price: 189,
    currency: "S$",
    monthlyEquivalent: 189,
    badge: "适合短期高强度用户",
    includedCredits: 220,
    newChatLimitPerMonth: 200,
    unlimitedMessagesInExistingChats: true,
    translationLimit: "fair-use",
    creditBonusPercent: 20,
    features: [
      "每月最多 200 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译不限量 (fair use)",
      "视频确认请求优先",
      "消息在 creator inbox 中优先展示",
      "高级隐私模式",
      "查看更完整活跃状态",
      "每月赠送 220 Credits",
      "Credits 充值 +20% bonus",
      "每月 5 次平台人工推荐",
      "定制服务请求优先处理",
      "SVIP Badge",
      "高级客服",
    ],
  },
  {
    id: "svip-quarterly",
    tier: "svip",
    period: "quarterly",
    price: 499,
    currency: "S$",
    monthlyEquivalent: 166.3,
    savings: 68,
    includedCredits: 220,
    newChatLimitPerMonth: 200,
    unlimitedMessagesInExistingChats: true,
    translationLimit: "fair-use",
    creditBonusPercent: 20,
    features: [
      "每月最多 200 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译不限量 (fair use)",
      "视频确认请求优先",
      "消息在 creator inbox 中优先展示",
      "高级隐私模式",
      "查看更完整活跃状态",
      "每月赠送 220 Credits",
      "Credits 充值 +20% bonus",
      "每月 5 次平台人工推荐",
      "定制服务请求优先处理",
      "SVIP Badge",
      "高级客服",
    ],
  },
  {
    id: "svip-yearly",
    tier: "svip",
    period: "yearly",
    price: 1699,
    currency: "S$",
    monthlyEquivalent: 141.6,
    savings: 569,
    badge: "最佳价值",
    includedCredits: 220,
    newChatLimitPerMonth: 200,
    unlimitedMessagesInExistingChats: true,
    translationLimit: "fair-use",
    creditBonusPercent: 20,
    features: [
      "每月最多 200 个新聊天对象",
      "已建立会话消息不限量",
      "多语言翻译不限量 (fair use)",
      "视频确认请求优先",
      "消息在 creator inbox 中优先展示",
      "高级隐私模式",
      "查看更完整活跃状态",
      "每月赠送 220 Credits",
      "Credits 充值 +20% bonus",
      "每月 5 次平台人工推荐",
      "定制服务请求优先处理",
      "SVIP Badge",
      "高级客服",
    ],
  },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [...VIP_PLANS, ...SVIP_PLANS];

export function getPlan(tier: "vip" | "svip", period: BillingPeriod): MembershipPlan {
  return MEMBERSHIP_PLANS.find((p) => p.tier === tier && p.period === period)!;
}

export function listPlansByTier(tier: "vip" | "svip"): MembershipPlan[] {
  return MEMBERSHIP_PLANS.filter((p) => p.tier === tier);
}

// ══════════════════════════════════════
// Credits packages · 4 tiers
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

// ══════════════════════════════════════
// Credits usage guide (只做区间参考)
// ══════════════════════════════════════

export const CREDIT_USAGE_GUIDE: { label: string; range: string }[] = [
  { label: "私密照片解锁",   range: "8 – 18 Credits" },
  { label: "私密视频解锁",   range: "28 – 88 Credits" },
  { label: "虚拟礼物 / 打赏", range: "10 – 200 Credits" },
  { label: "优先消息",       range: "5 Credits" },
  { label: "视频确认请求",   range: "20 – 60 Credits" },
  { label: "Boost 曝光",     range: "50 – 150 Credits" },
];

// ══════════════════════════════════════
// Free tier reference (只用于对比表 · 不售卖)
// ══════════════════════════════════════

export const FREE_TIER = {
  tier: "free" as const,
  label: "Free",
  description: "适合先浏览和体验平台",
  newChatLimitPerDay: 1,
  messagesPerDay: 5,
  translationLimit: "basic" as const,
  includedCredits: 0,
  features: [
    "浏览公开 profiles",
    "收藏 profiles",
    "使用基础筛选",
    "查看公开照片",
    "每日 1 个新聊天对象",
    "每日最多 5 条试聊消息",
    "购买 Credits 解锁私密内容",
  ],
};

// ══════════════════════════════════════
// Comparison rows (Free / VIP / SVIP)
// ══════════════════════════════════════

export interface ComparisonRow {
  label: string;
  free: string | boolean;
  vip: string | boolean;
  svip: string | boolean;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "浏览公开 profiles",   free: true,          vip: true,             svip: true },
  { label: "收藏 profiles",       free: true,          vip: true,             svip: true },
  { label: "基础筛选",            free: true,          vip: true,             svip: true },
  { label: "每日新聊天对象",       free: "1 / 天",      vip: "—",              svip: "—" },
  { label: "每月新聊天对象",       free: "≈ 30",       vip: "60 / 月",         svip: "200 / 月" },
  { label: "每日消息数量",         free: "5 条",       vip: "不限量",          svip: "不限量" },
  { label: "已建立会话消息",       free: "有限",       vip: "不限量",          svip: "不限量" },
  { label: "多语言翻译",           free: "基础",       vip: "1,000 条 / 月",   svip: "不限量 (fair use)" },
  { label: "查看已读状态",         free: false,        vip: true,             svip: true },
  { label: "匿名浏览",             free: false,        vip: true,             svip: true },
  { label: "高级筛选",             free: false,        vip: true,             svip: true },
  { label: "在线状态详情",         free: "简化",       vip: "完整",            svip: "完整 + 活跃趋势" },
  { label: "消息在 inbox 优先展示", free: false,        vip: false,            svip: true },
  { label: "视频确认请求优先",     free: false,        vip: false,            svip: true },
  { label: "每月赠送 Credits",     free: "无",         vip: "80",             svip: "220" },
  { label: "Credits 充值 bonus",   free: "无",         vip: "+10%",           svip: "+20%" },
  { label: "定制服务优先推荐",     free: false,        vip: false,            svip: true },
  { label: "每月平台人工推荐",     free: "无",         vip: "无",             svip: "5 次" },
  { label: "客服支持",             free: "标准",       vip: "优先",           svip: "高级" },
  { label: "Badge",                free: "—",         vip: "VIP",            svip: "SVIP" },
];
