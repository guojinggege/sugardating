// Client-safe event labels for form (no node:fs deps)
export type EventKey = "yacht" | "cocktail" | "photoshoot" | "business" | "members-club";

export const EVENT_KEY_LABEL: Record<EventKey, { title: string; titleEn: string }> = {
  "yacht":        { title: "游艇派对",         titleEn: "Yacht Party" },
  "cocktail":     { title: "高端酒会",         titleEn: "Luxury Cocktail Night" },
  "photoshoot":   { title: "私人拍摄",         titleEn: "Private Photoshoot" },
  "business":     { title: "商务伴游",         titleEn: "Business Companion" },
  "members-club": { title: "会员俱乐部之夜",   titleEn: "Members' Club Night" },
};

export const BUDGET_TIERS = [
  { value: "280",   label: "S$ 280+"   },
  { value: "680",   label: "S$ 680+"   },
  { value: "1200",  label: "S$ 1,200+" },
  { value: "2500",  label: "S$ 2,500+" },
  { value: "custom", label: "自定义预算" },
];

export const STYLE_PREFS = [
  "优雅", "活泼", "安静", "社交型", "镜头感强", "商务型",
];

export const LANG_PREFS = [
  "中文", "English", "ไทย", "Tiếng Việt", "Filipino", "日本語", "한국어",
];
