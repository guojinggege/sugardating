// Sugardating Journal · 内容数据
// 12 分类 + 30 篇文章,body 采用结构化 block,不做纯字符串堆积
// 图片走 public/images/ 循环 pick,不引外链

import { pick } from "@/lib/images";

// ══════════════════════════════════════
// Types
// ══════════════════════════════════════

export type JournalLang = "zh" | "en";

export interface JournalCategory {
  slug: string;
  title: string;      // EN 主标题
  titleZh: string;    // 中文标题
  subtitle: string;   // EN 副标题
  subtitleZh: string; // 中文副标题
  description: string;
  descriptionZh: string;
  accent?: string;    // 品牌色 hex
}

export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "insight"; title: string; text: string }
  | { type: "checklist"; title: string; items: string[] };

export type JournalCtaVariant =
  | "browse-sugargirls"
  | "browse-asian"
  | "browse-london"
  | "premium"
  | "credits"
  | "safety"
  | "apply-creator"
  | "video-profiles";

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  categorySlug: string;
  language: JournalLang;
  coverImage: string;
  author: string;
  publishedAt: string;   // ISO
  updatedAt?: string;
  readingTime: string;   // e.g. "6 min read"
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  body: JournalBlock[];
  cta: JournalCtaVariant[];
}

// ══════════════════════════════════════
// Categories
// ══════════════════════════════════════

export const journalCategories: JournalCategory[] = [
  {
    slug: "relationship-intelligence",
    title: "Relationship Intelligence",
    titleZh: "高端两性与关系智慧",
    subtitle: "Modern courtship, communication and boundaries for high-value men",
    subtitleZh: "面向成熟男性的现代关系、沟通与边界",
    description: "从沟通节奏、情绪成本到长期匹配 — 关系的高级玩法从不是套路,而是判断力。",
    descriptionZh: "从沟通节奏、情绪成本到长期匹配 — 关系的高级玩法从不是套路,而是判断力。",
    accent: "#B8A789",
  },
  {
    slug: "asian-southeast-asian-culture",
    title: "Asian & Southeast Asian Culture",
    titleZh: "亚洲与东南亚女性文化",
    subtitle: "Cultural context for engaging respectfully with Asian sugargirls",
    subtitleZh: "尊重且深入的亚洲女性文化视角",
    description: "在伦敦遇见来自东京、曼谷、马尼拉、河内的女性 — 差异不是障碍,是理解的起点。",
    descriptionZh: "在伦敦遇见来自东京、曼谷、马尼拉、河内的女性 — 差异不是障碍,是理解的起点。",
  },
  {
    slug: "london-elite-lifestyle",
    title: "London Elite Lifestyle",
    titleZh: "伦敦高端生活方式",
    subtitle: "Where discerning men live, dine and socialise in London",
    subtitleZh: "伦敦的高级餐饮、社交空间与生活节奏",
    description: "Mayfair、Chelsea、Marylebone、Canary Wharf — 每一区都有它的社交语法。",
    descriptionZh: "Mayfair、Chelsea、Marylebone、Canary Wharf — 每一区都有它的社交语法。",
  },
  {
    slug: "massage-spa-recovery",
    title: "Massage, Spa & Recovery",
    titleZh: "按摩、SPA 与身心恢复",
    subtitle: "Recovery is a performance discipline, not a luxury",
    subtitleZh: "恢复不是奢侈,是一种表现能力",
    description: "睡眠、按摩、冷热交替与呼吸训练 — 高端男性的静态实力。",
    descriptionZh: "睡眠、按摩、冷热交替与呼吸训练 — 高端男性的静态实力。",
  },
  {
    slug: "fitness-performance",
    title: "Fitness & Performance",
    titleZh: "健身、状态与男性吸引力",
    subtitle: "Body composition, energy and social presence",
    subtitleZh: "身形、能量与社交存在感",
    description: "40 岁之后,健身的意义不是外形 — 是能量与专注度的稳定输出。",
    descriptionZh: "40 岁之后,健身的意义不是外形 — 是能量与专注度的稳定输出。",
  },
  {
    slug: "wealth-privacy-risk",
    title: "Wealth, Privacy & Risk",
    titleZh: "财富、隐私与风险识别",
    subtitle: "Protecting identity, capital and reputation",
    subtitleZh: "保护身份、资产与声誉",
    description: "为什么高净值男性从不在关系中谈资产?因为那是风险入口,不是吸引力入口。",
    descriptionZh: "为什么高净值男性从不在关系中谈资产?因为那是风险入口,不是吸引力入口。",
  },
  {
    slug: "longevity-wellness",
    title: "Longevity & Wellness",
    titleZh: "养生、长寿与抗压",
    subtitle: "The long game: energy, hormones and stress",
    subtitleZh: "能量、荷尔蒙与压力的长期管理",
    description: "养生不是老派话题 — 它是长期吸引力管理。",
    descriptionZh: "养生不是老派话题 — 它是长期吸引力管理。",
  },
  {
    slug: "grooming-style-photography",
    title: "Grooming, Style & Photography",
    titleZh: "形象、穿搭与资料包装",
    subtitle: "Personal image, from wardrobe to profile photography",
    subtitleZh: "从衣橱到资料照片的整体形象",
    description: "个人形象是一种可训练的信号系统 — 让对的人先看到对的信息。",
    descriptionZh: "个人形象是一种可训练的信号系统 — 让对的人先看到对的信息。",
  },
  {
    slug: "business-travellers-london",
    title: "Business Traveller's London",
    titleZh: "商务旅客伦敦指南",
    subtitle: "For men who arrive in London for a week and want to spend it well",
    subtitleZh: "在伦敦停留一周的商务旅客指南",
    description: "48 小时、5 天、10 天 — 不同节奏对应不同的社交策略。",
    descriptionZh: "48 小时、5 天、10 天 — 不同节奏对应不同的社交策略。",
  },
  {
    slug: "safety-privacy-trust",
    title: "Safety, Privacy & Trust",
    titleZh: "安全、隐私与真实资料",
    subtitle: "How Sugardating protects members and how you should protect yourself",
    subtitleZh: "平台如何保护你,以及你如何保护自己",
    description: "身份验证、视频资料、边界规则、支付隐私 — 每一层都可以更主动。",
    descriptionZh: "身份验证、视频资料、边界规则、支付隐私 — 每一层都可以更主动。",
  },
  {
    slug: "sugargirl-creator-journal",
    title: "Sugargirl Creator Journal",
    titleZh: "Sugargirl 成长与摄影包装",
    subtitle: "For sugargirls: how to present, protect and grow on Sugardating",
    subtitleZh: "面向 sugargirl 的资料包装与成长指南",
    description: "写真、视频、文案与边界 — 一份长期可持续的自我表达系统。",
    descriptionZh: "写真、视频、文案与边界 — 一份长期可持续的自我表达系统。",
  },
  {
    slug: "chinese-in-uk",
    title: "Chinese in UK",
    titleZh: "在英华人指南",
    subtitle: "For Chinese-speaking members in the UK",
    subtitleZh: "面向英国华人用户",
    description: "身份、语言、文化边界 — 华人在英国如何更清晰地社交。",
    descriptionZh: "身份、语言、文化边界 — 华人在英国如何更清晰地社交。",
  },
];

export function getCategory(slug: string): JournalCategory | undefined {
  return journalCategories.find((c) => c.slug === slug);
}

// ══════════════════════════════════════
// Article builders — 减少重复
// ══════════════════════════════════════

const AUTHORS = [
  "Sugardating Editorial",
  "Alexander Chen",
  "Nina Whitfield",
  "许知远 · 特约撰稿",
  "James Okafor",
  "林嘉音 · 编辑部",
  "Camille Reed",
  "陈慕之 · 特约作者",
];

function author(i: number): string {
  return AUTHORS[i % AUTHORS.length];
}

// deterministic 日期,倒序 2026-06 → 2026-04
function dateFor(i: number): string {
  const base = new Date("2026-06-25T09:00:00Z").getTime();
  const daysBack = i * 3 + (i % 5);
  return new Date(base - daysBack * 86400_000).toISOString();
}

function reading(minutes: number, lang: JournalLang): string {
  return lang === "zh" ? `${minutes} 分钟阅读` : `${minutes} min read`;
}

// ══════════════════════════════════════
// Posts — 30 articles
// ══════════════════════════════════════

export const journalPosts: JournalPost[] = [
  // ============================================
  // P0 · Priority articles (10)
  // ============================================
  {
    id: "p001", slug: "how-to-meet-verified-asian-sugargirls-in-london",
    title: "How to Meet Verified Asian Sugargirls in London",
    subtitle: "A practical framework for engaging respectfully — and skipping the noise",
    excerpt: "Verification, video profiles and mutual language cues — the three signals that separate real profiles from noise on any platform.",
    categorySlug: "asian-southeast-asian-culture",
    language: "en",
    coverImage: pick(0, 3) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(0), readingTime: reading(6, "en"),
    tags: ["asian", "london", "verification", "video profile"],
    featured: true, popular: true,
    cta: ["browse-asian", "video-profiles", "safety"],
    body: [
      { type: "paragraph", text: "London's Asian community is not a monolith. Women from Tokyo, Bangkok, Manila, Ho Chi Minh City and mainland China each bring different cultural rhythms — and the profiles that look most similar are often the ones you should investigate most carefully." },
      { type: "heading", text: "Three signals that matter" },
      { type: "list", items: [
        "A verified badge that references an ID check, not just a phone number.",
        "A short video introduction — 20 seconds of natural voice reveals more than 30 static photos.",
        "Consistent language use across profile, bio and messages — real accounts rarely switch fluency mid-thread.",
      ]},
      { type: "paragraph", text: "On Sugardating, verified sugargirls have completed identity checks before their profile is discoverable. Video introductions are optional but strongly encouraged — you'll see a small camera icon on the card when they exist." },
      { type: "insight", title: "Sugardating Insight", text: "Discerning members open the video first, the price second, and the photo grid last. Photos can be curated; a voice cannot." },
      { type: "heading", text: "Opening a conversation" },
      { type: "paragraph", text: "Skip the compliment on appearance. Reference something specific from her profile — a city she mentions, a food she cooks, a place she'd like to visit. Respect signals literacy; literacy signals value." },
      { type: "checklist", title: "Before your first meeting", items: [
        "Confirm she has verified status and at least one video.",
        "Video-call once via the platform — 5 minutes is enough.",
        "Meet in a public, well-reviewed venue (hotel bar, restaurant lobby).",
        "Never wire money before meeting — real profiles never ask.",
      ]},
    ],
  },
  {
    id: "p002", slug: "gentlemans-guide-privacy-first-dating-london",
    title: "The Gentleman's Guide to Privacy-First Dating in London",
    subtitle: "Identity, phone number, calendar — three surfaces most men leak by accident",
    excerpt: "For high-visibility men, the wrong photo, phone number or calendar entry can create years of exposure. Here is a lightweight privacy stack that costs almost nothing.",
    categorySlug: "wealth-privacy-risk",
    language: "en",
    coverImage: pick(1, 5) ?? "/images/placeholder.png",
    author: author(1), publishedAt: dateFor(1), readingTime: reading(7, "en"),
    tags: ["privacy", "security", "london"],
    featured: true, popular: true,
    cta: ["safety", "premium", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Privacy is not paranoia — it is a design choice. Every man with meaningful reputation, capital or family relationships benefits from separating his social life from his identity graph." },
      { type: "heading", text: "The three surfaces" },
      { type: "list", items: [
        "Phone number: a personal SIM tied to your name is the single largest leak. Use a second eSIM or a call-through number.",
        "Photos: reverse-image search can trace your face in seconds. Keep dating profiles visually distinct from LinkedIn.",
        "Calendar & location: never share your live location; share venues, not routes.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "On Sugardating, in-platform chat means she never sees your real number, and video calls never leave the app. If a match wants to move to WhatsApp on day one — that's a signal, not a compliment." },
      { type: "heading", text: "A minimal privacy stack" },
      { type: "paragraph", text: "One second eSIM (~£10/month). One password manager. One private email alias for dating profiles. That's it. It takes an afternoon to set up, and it protects you for years." },
      { type: "checklist", title: "Privacy self-audit", items: [
        "Would a reverse image search of my profile photo find my LinkedIn?",
        "Is my dating phone number distinct from work and family?",
        "Do I share venues, not maps, when confirming meetings?",
        "Have I enabled 2FA on the dating platform itself?",
      ]},
    ],
  },
  {
    id: "p003", slug: "london-sugardating-shouren-zhinan",
    title: "伦敦 Sugardating 新手指南:如何筛选真实 Sugargirls",
    subtitle: "视频、认证、语言一致性 — 三个基础信号",
    excerpt: "在伦敦初次使用 Sugardating,不要看照片,要先看视频、看认证、看语言的一致性 — 这三层信号能过滤掉 90% 的低质资料。",
    categorySlug: "chinese-in-uk",
    language: "zh",
    coverImage: pick(2, 7) ?? "/images/placeholder.png",
    author: author(3), publishedAt: dateFor(2), readingTime: reading(5, "zh"),
    tags: ["华人", "新手", "筛选", "伦敦"],
    featured: true, popular: true,
    cta: ["browse-asian", "safety", "video-profiles"],
    body: [
      { type: "paragraph", text: "在英国,尤其是伦敦,华人使用 Sugardating 的第一个障碍不是语言 — 是筛选。伦敦华人圈子小,信息透明度不高,大部分人一上来看照片就下判断,这是最容易被误导的路径。" },
      { type: "heading", text: "第一层:认证徽章" },
      { type: "paragraph", text: "认证不是可选项。认证徽章代表 Sugargirl 已经完成身份核验 — 没有认证的资料,基本不需要投入注意力。" },
      { type: "heading", text: "第二层:视频资料" },
      { type: "paragraph", text: "20 秒的自我介绍视频比 30 张精修照片透露更多信息 — 语速、气息、眼神稳定度、真实妆感,这些都不是照片能修图的。" },
      { type: "insight", title: "Sugardating 提示", text: "在 Sugargirl 卡片上,有 🎬 图标的资料含视频,优先看这些。" },
      { type: "heading", text: "第三层:语言一致性" },
      { type: "paragraph", text: "看她的简介文字、tag、聊天用词是否稳定。真实资料的语言风格从头到尾一致 — 突然切换用词、语气不匹配的,通常是模板。" },
      { type: "checklist", title: "第一次沟通前的三分钟自查", items: [
        "确认对方有认证徽章。",
        "看过至少一段自我介绍视频。",
        "语言风格稳定,不像模板。",
        "从不在见面前要求任何形式的转账。",
      ]},
    ],
  },
  {
    id: "p004", slug: "premium-unlimited-chat-explained",
    title: "Premium 无限畅聊是什么?适合哪些用户?",
    subtitle: "按次付费 vs 月度订阅 — 什么样的使用节奏适合升级",
    excerpt: "Premium 无限畅聊不是万灵药,它面向的是每周与多位 Sugargirl 有持续对话、希望降低沟通摩擦成本的用户。",
    categorySlug: "relationship-intelligence",
    language: "zh",
    coverImage: pick(3, 11) ?? "/images/placeholder.png",
    author: author(5), publishedAt: dateFor(3), readingTime: reading(5, "zh"),
    tags: ["premium", "订阅", "会员"],
    featured: false, popular: true,
    cta: ["premium", "credits", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Premium 无限畅聊是 Sugardating 面向高频用户的月度订阅。它不改变你能看到什么,它改变的是你能持续沟通的宽度。" },
      { type: "heading", text: "谁适合" },
      { type: "list", items: [
        "每周与 3 位以上 Sugargirl 有持续对话的用户。",
        "希望在决定见面前完成多轮语音/视频筛选的用户。",
        "商务出差频繁、需要提前 1-2 周规划社交的用户。",
      ]},
      { type: "heading", text: "谁不适合" },
      { type: "list", items: [
        "每月使用 1-2 次的低频用户 — Credits 按次消费更划算。",
        "对某一位 Sugargirl 有明确匹配意图,已进入线下阶段的用户。",
      ]},
      { type: "insight", title: "Sugardating 建议", text: "先用 Credits 度过前 4 周;如果连续两周消费超过 300 credits,再考虑升级 Premium。" },
    ],
  },
  {
    id: "p005", slug: "credits-usage-guide-gifts-video-livestream",
    title: "Sugardating Credits 使用指南:礼物、视频、直播和优先互动",
    subtitle: "Credits 是站内通用的沟通与礼物货币",
    excerpt: "Credits 用于打赏、解锁视频、参与直播和获得优先互动 — 一份清晰的定价与使用建议。",
    categorySlug: "wealth-privacy-risk",
    language: "zh",
    coverImage: pick(4, 13) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(4), readingTime: reading(6, "zh"),
    tags: ["credits", "打赏", "礼物"],
    featured: false, popular: true,
    cta: ["credits", "premium", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Sugardating Credits 是站内通用货币,不涉及任何线下现金交易。所有 credits 消费均记录在钱包账本中,可随时查询。" },
      { type: "heading", text: "主要使用场景" },
      { type: "list", items: [
        "礼物打赏:虚拟礼物触发对方通知,提升回复优先级。",
        "解锁视频/图集:部分 Sugargirl 会将高清视频、私密相册设为付费解锁。",
        "直播打赏:直播间的礼物直接进入 Sugargirl 结算账户。",
        "优先互动:某些高关注 Sugargirl 支持 credits 提升消息优先级。",
      ]},
      { type: "insight", title: "使用建议", text: "首月建议 50-100 credits 起步 — 熟悉平台节奏后再决定是否加大投入。" },
      { type: "heading", text: "什么绝对不做" },
      { type: "checklist", title: "红线", items: [
        "从不在站外转账。",
        "从不为线下见面单独付款 — 平台不撮合任何形式的交易。",
        "从不代购卡券、加密货币、礼品卡 — 这些请求 100% 是骗局。",
      ]},
    ],
  },
  {
    id: "p006", slug: "thai-filipina-vietnamese-respectful-guide",
    title: "Thai, Filipina and Vietnamese Sugargirls: A Respectful Guide for European Men",
    subtitle: "Language, family, faith and independence — the four axes that matter",
    excerpt: "Southeast Asian women in London are often misread by Western men — not because of language, but because of missing cultural context. A short primer.",
    categorySlug: "asian-southeast-asian-culture",
    language: "en",
    coverImage: pick(5, 17) ?? "/images/placeholder.png",
    author: author(2), publishedAt: dateFor(5), readingTime: reading(7, "en"),
    tags: ["thai", "filipina", "vietnamese", "culture"],
    featured: true, popular: true,
    cta: ["browse-asian", "browse-london", "safety"],
    body: [
      { type: "paragraph", text: "Thai, Filipina and Vietnamese women make up a growing share of London's Sugardating community. They are also the most frequently misread — often flattened by Western men into a single stereotype that helps no one." },
      { type: "heading", text: "Four axes to keep in mind" },
      { type: "list", items: [
        "Language: fluency varies widely. Do not assume broken English means broken understanding — many are trilingual.",
        "Family: in most Southeast Asian cultures, family and financial responsibility to parents are non-negotiable. Do not moralise about this.",
        "Faith: the Philippines is deeply Catholic; Thailand largely Buddhist; Vietnam a mix. Sunday matters differently in each.",
        "Independence: many have relocated to London specifically for autonomy. Read this correctly.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Ask 'where are you from?' not 'are you Thai?' The first opens conversation; the second closes it." },
      { type: "heading", text: "What good conversation looks like" },
      { type: "paragraph", text: "Ask about food, ask about home, ask about a place she wants to visit. Do not begin with why she is in London — she has been asked that question a hundred times, usually as a veiled interrogation." },
    ],
  },
  {
    id: "p007", slug: "high-net-worth-dating-privacy",
    title: "The High-Net-Worth Man's Guide to Dating Privacy",
    subtitle: "Reputation is a compounding asset — protect it like one",
    excerpt: "For men with significant net worth, dating privacy is not about hiding — it is about limiting exposure to volatility.",
    categorySlug: "wealth-privacy-risk",
    language: "en",
    coverImage: pick(6, 19) ?? "/images/placeholder.png",
    author: author(4), publishedAt: dateFor(6), readingTime: reading(8, "en"),
    tags: ["hnw", "privacy", "wealth"],
    featured: false, popular: true,
    cta: ["safety", "premium", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "The higher your net worth, the more asymmetric the risk in casual dating. A single leaked screenshot, a single geo-tagged photo, and years of quiet reputation can be re-priced overnight." },
      { type: "heading", text: "The rule of three separations" },
      { type: "list", items: [
        "Financial separation: never discuss holdings, LLCs or business specifics in early conversation.",
        "Digital separation: dating identity and professional identity share no photos, no emails, no phone numbers.",
        "Geographic separation: meet in venues that are not tied to your home, office or family routines.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "The men who leak least are the men who volunteer least. Discretion is not glamour — it is architecture." },
      { type: "heading", text: "What to say if she asks what you do" },
      { type: "paragraph", text: "A high-level industry ('finance', 'tech', 'property') is enough. Specifics come later, after trust is built. Real interest survives ambiguity; predatory interest does not." },
    ],
  },
  {
    id: "p008", slug: "uk-chinese-identity-privacy-protection",
    title: "英国华人男性如何保护身份、隐私和消费安全",
    subtitle: "小圈子的英国,信息传播比想象快",
    excerpt: "在英国的华人圈子远比想象中小 — 一张照片、一个手机号、一次线下见面,信息传播速度可能远超预期。",
    categorySlug: "chinese-in-uk",
    language: "zh",
    coverImage: pick(7, 23) ?? "/images/placeholder.png",
    author: author(7), publishedAt: dateFor(7), readingTime: reading(6, "zh"),
    tags: ["华人", "隐私", "英国"],
    featured: false, popular: true,
    cta: ["safety", "premium", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "英国华人圈子看起来分散,实际非常小。共同校友、行业社群、微信群 — 一张照片流出后,72 小时内会被识别的概率远高于想象。" },
      { type: "heading", text: "三条基本纪律" },
      { type: "list", items: [
        "手机号:准备一张 EE / O2 独立 SIM 或 eSIM,不与实名工作号混用。",
        "照片:约会平台的头像不要与微信朋友圈、LinkedIn 重合。",
        "见面地点:不要在自己常去的 Chinese fine dining、私人会所 — 换到中性的酒店大堂 bar。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "站内视频和聊天不暴露真实号码,是最省成本的隐私屏障 — 不要在早期迁移到 WhatsApp。" },
      { type: "heading", text: "消费安全" },
      { type: "checklist", title: "三条红线", items: [
        "永不站外转账,包括微信、支付宝、加密货币。",
        "永不为线下见面单独付款。",
        "永不代购卡券、机票、礼品卡 — 100% 是骗局。",
      ]},
    ],
  },
  {
    id: "p009", slug: "gentlemans-guide-massage-recovery-london",
    title: "A Gentleman's Guide to Massage and Recovery in London",
    subtitle: "Not a hedonism guide — a performance one",
    excerpt: "The best massage in London is the one that raises your baseline for the week, not the one that feels most indulgent in the moment.",
    categorySlug: "massage-spa-recovery",
    language: "en",
    coverImage: pick(8, 29) ?? "/images/placeholder.png",
    author: author(6), publishedAt: dateFor(8), readingTime: reading(6, "en"),
    tags: ["massage", "recovery", "london", "wellness"],
    featured: false, popular: false,
    cta: ["browse-london", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Recovery in London splits into three tiers. Chain sports massage (£70–120), member's club treatments (£180–280), and private in-room therapists at premium hotels (£220+). Which one matters depends on what you're recovering from." },
      { type: "heading", text: "For deep muscle work" },
      { type: "paragraph", text: "Sports-focused therapists in Marylebone and Belgravia handle desk-job neck tension and lifting soreness better than most spa menus advertise. Ten Health and Ten Chiropractic are the working man's default." },
      { type: "heading", text: "For jet lag and travel" },
      { type: "paragraph", text: "Manual lymphatic drainage after long-haul flights is underrated — an hour reduces facial puffiness, restores sleep pressure and makes the next 24 hours materially better. Book on arrival day, not day two." },
      { type: "insight", title: "Sugardating Insight", text: "The point of recovery is not luxury — it is being fully present in your next conversation. Book it before, not after." },
    ],
  },
  {
    id: "p010", slug: "london-elite-mens-state-management",
    title: "伦敦高端男性约会前的状态管理:健身、按摩、睡眠与形象",
    subtitle: "约会前 24 小时决定了 80% 的社交表现",
    excerpt: "决定约会质量的从来不是餐厅选择,是你到达时的能量与专注度。",
    categorySlug: "fitness-performance",
    language: "zh",
    coverImage: pick(9, 31) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(9), readingTime: reading(6, "zh"),
    tags: ["健身", "睡眠", "状态"],
    featured: false, popular: true,
    cta: ["browse-london", "browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "40 岁以后,约会的胜负手不是台词,不是餐厅,是能量水平。你到达时是紧张、疲劳、分神,还是放松、清醒、有耐心 — 对方 30 秒内就能感受到。" },
      { type: "heading", text: "约会前 24 小时" },
      { type: "list", items: [
        "睡眠:前一晚 7-8 小时,不要熬夜谈事。",
        "训练:轻量心肺 30 分钟 + 拉伸,避免大重量训练留下的僵硬感。",
        "按摩:如果本周训练强度大,可以约会当天早上做 60 分钟深层放松。",
        "饮食:见面前 3 小时以内不吃辛辣、大量咖啡因,避免影响气息与专注。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "见面前 90 分钟散步 20 分钟 — 这是所有干预中投入产出比最高的。" },
      { type: "heading", text: "形象" },
      { type: "paragraph", text: "剪发提前 3-4 天,让边缘不再锐利;衬衫熨烫要真的做,袖口清洁最容易被注意到。香水轻用一喷,不要构成侵入感。" },
    ],
  },
  // ============================================
  // P1 · Second batch (10)
  // ============================================
  {
    id: "p011", slug: "fitness-confidence-dating-outcomes",
    title: "Fitness, Confidence and Dating: Why Physical State Changes Social Outcomes",
    excerpt: "Confidence is not a personality trait — it is a downstream signal of energy, sleep and body composition.",
    categorySlug: "fitness-performance",
    language: "en",
    coverImage: pick(10, 37) ?? "/images/placeholder.png",
    author: author(2), publishedAt: dateFor(10), readingTime: reading(5, "en"),
    tags: ["fitness", "confidence"],
    cta: ["browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "Men who train consistently do not date better because they look better — they date better because they show up with more energy and less anxiety. That is a physiological effect, not a cosmetic one." },
      { type: "heading", text: "The three inputs" },
      { type: "list", items: [
        "Body composition: 15–18% body fat is the range where testosterone, sleep and skin quality all cooperate.",
        "Heart rate variability: rising HRV over weeks means recovery is winning; it correlates with mood stability.",
        "Sleep pressure: 7 hours as a floor, not a target. Everything downstream — patience, humour, presence — is priced from here.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "The most attractive thing you can bring to a dinner is a nervous system that isn't stressed." },
    ],
  },
  {
    id: "p012", slug: "40plus-social-state-management",
    title: "40 岁以后,男性如何保持更好的社交状态",
    excerpt: "身体机能会衰退,社交表现不必衰退 — 关键在能量、睡眠与情绪稳定性的长期管理。",
    categorySlug: "longevity-wellness",
    language: "zh",
    coverImage: pick(11, 41) ?? "/images/placeholder.png",
    author: author(3), publishedAt: dateFor(11), readingTime: reading(6, "zh"),
    tags: ["养生", "40岁", "能量"],
    cta: ["browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "身体在衰老,能量输出不必衰老。40 岁以后男性社交状态的差距,不来自基因,来自习惯的长期复利。" },
      { type: "heading", text: "五个杠杆" },
      { type: "list", items: [
        "训练:每周 3 次抗阻训练,不追大重量。",
        "睡眠:7 小时下限,固定作息比早睡更重要。",
        "咖啡因:12 点以后不摄入。",
        "酒精:社交场合不超过 2 单位,平日以零为默认。",
        "情绪:每周 2 次 20 分钟散步 — 是最低成本的抗抑郁干预。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "40 岁以后的吸引力,80% 来自情绪稳定性 — 那不是天生的,是训练出来的。" },
    ],
  },
  {
    id: "p013", slug: "48-hours-london-dining-wellness-sugargirls",
    title: "48 Hours in London: Dining, Wellness and Verified Sugargirls",
    excerpt: "A 48-hour framework for the visiting professional — food, recovery and one thoughtful evening.",
    categorySlug: "business-travellers-london",
    language: "en",
    coverImage: pick(12, 43) ?? "/images/placeholder.png",
    author: author(4), publishedAt: dateFor(12), readingTime: reading(7, "en"),
    tags: ["business travel", "48 hours"],
    cta: ["browse-london", "video-profiles", "premium"],
    body: [
      { type: "paragraph", text: "48 hours in London does not accommodate every intention. Choose two — food, meetings, wellness, one evening of company — and do those with intent." },
      { type: "heading", text: "Day one" },
      { type: "paragraph", text: "Land, drop bags, one hour of lymphatic drainage massage. Lunch light. Meetings until 6. Dinner in Marylebone or Fitzrovia — small, quiet, no photo scenes." },
      { type: "heading", text: "Day two" },
      { type: "paragraph", text: "Morning gym at the hotel. Breakfast slow. Meetings mid-day. Evening: verified sugargirl introduction over a drink at Claridge's or the Connaught — no dinner unless you already had a good phone call. First evenings should have exits." },
      { type: "insight", title: "Sugardating Insight", text: "Message 3–5 verified sugargirls one week ahead. First conversations happen on video before you land, not after." },
    ],
  },
  {
    id: "p014", slug: "respectful-conversation-asian-sugargirls",
    title: "How to Start a Respectful Conversation with Asian Sugargirls",
    excerpt: "The first three messages do more work than the next thirty. A short framework.",
    categorySlug: "asian-southeast-asian-culture",
    language: "en",
    coverImage: pick(13, 47) ?? "/images/placeholder.png",
    author: author(5), publishedAt: dateFor(13), readingTime: reading(4, "en"),
    tags: ["conversation", "asian", "opening"],
    cta: ["browse-asian", "premium"],
    body: [
      { type: "paragraph", text: "Openings that reference her actual profile outperform generic openers by an order of magnitude. This is true across every dating platform ever studied. The question is why so few men do it." },
      { type: "heading", text: "A workable template" },
      { type: "list", items: [
        "Reference one concrete detail from her profile — a city, a food, a book, a hobby.",
        "Ask an open question, not a compliment.",
        "Keep it under three lines. Long openers signal effort but also anxiety.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Compliments on appearance are what everyone else sends. Anything else is a differentiation strategy." },
    ],
  },
  {
    id: "p015", slug: "video-profile-vs-photo-trust",
    title: "为什么视频资料比照片更能判断真实性",
    excerpt: "20 秒视频包含的信息量远超 30 张照片 — 语速、气息、眼神稳定度都无法后期。",
    categorySlug: "safety-privacy-trust",
    language: "zh",
    coverImage: pick(14, 53) ?? "/images/placeholder.png",
    author: author(7), publishedAt: dateFor(14), readingTime: reading(4, "zh"),
    tags: ["视频", "认证", "真实性"],
    cta: ["video-profiles", "safety", "browse-asian"],
    body: [
      { type: "paragraph", text: "照片可以精修、可以借用、可以 AI 生成 — 视频不行,或者说,能造假的成本高到不划算。这就是为什么 Sugardating 强烈鼓励 Sugargirl 上传视频资料。" },
      { type: "heading", text: "看视频看什么" },
      { type: "list", items: [
        "语速是否稳定 — 紧张或背稿会有明显停顿。",
        "眼神是否与镜头对齐 — 假账号常低头念稿。",
        "环境音是否自然 — 完全无环境音的视频往往是重录多次。",
        "妆感是否与照片一致 — 剧烈差异是资料混用信号。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "首次消息前看完视频,决定是否投入注意力 — 这是最省时间的筛选。" },
    ],
  },
  {
    id: "p016", slug: "business-travellers-private-social-dating",
    title: "Business Traveller's Guide to Private Social Dating in London",
    excerpt: "Private social time is not entertainment — it's how frequent travellers reset between weeks.",
    categorySlug: "business-travellers-london",
    language: "en",
    coverImage: pick(15, 59) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(15), readingTime: reading(6, "en"),
    tags: ["business travel", "social"],
    cta: ["browse-london", "premium", "video-profiles"],
    body: [
      { type: "paragraph", text: "For the frequent London visitor, the delta between a good week and a burnt-out week is often one thing: whether you had one genuinely present evening that was not a work dinner." },
      { type: "heading", text: "Planning" },
      { type: "paragraph", text: "Message verified sugargirls a week in advance. Aim for one video call before landing. Keep the first evening short — one drink, then either she goes home or you cross the threshold naturally." },
      { type: "insight", title: "Sugardating Insight", text: "Do not schedule intimate evenings on meeting-heavy days. Presence competes with cortisol, and cortisol wins." },
    ],
  },
  {
    id: "p017", slug: "london-after-work-fitness-drinks-private-time",
    title: "London After Work: Fitness, Drinks and Private Social Time",
    excerpt: "How to structure the 6pm–11pm window when you actually have energy left.",
    categorySlug: "london-elite-lifestyle",
    language: "en",
    coverImage: pick(16, 61) ?? "/images/placeholder.png",
    author: author(1), publishedAt: dateFor(16), readingTime: reading(5, "en"),
    tags: ["london", "lifestyle", "after work"],
    cta: ["browse-london", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "The London after-work window is short and precious. Most men spend it on the phone. A better default: 45 minutes at the gym, 30 minutes at home to shower and change, then one plan — not three." },
      { type: "heading", text: "Three formats" },
      { type: "list", items: [
        "Gym → dinner alone → early night. Restores the week.",
        "Gym → drinks with one friend or one sugargirl. Genuinely social.",
        "Gym → private dinner in a small restaurant, no phone. Rare but memorable.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Never plan three things in one evening. One thing done well beats three things half-done." },
    ],
  },
  {
    id: "p018", slug: "chinese-uk-private-social-boundaries",
    title: "英国华人为什么更需要边界清晰的私密社交",
    excerpt: "小圈子、家庭压力、职业身份 — 华人在英国的社交需要更明确的隐私架构。",
    categorySlug: "chinese-in-uk",
    language: "zh",
    coverImage: pick(17, 67) ?? "/images/placeholder.png",
    author: author(3), publishedAt: dateFor(17), readingTime: reading(5, "zh"),
    tags: ["华人", "边界", "隐私"],
    cta: ["safety", "premium", "browse-asian"],
    body: [
      { type: "paragraph", text: "在英华人的社交结构和本地欧美男性不同 — 家族纽带更强,同事同乡重叠度更高,信息扩散速度更快。这决定了边界必须更明确。" },
      { type: "heading", text: "三个易被低估的暴露点" },
      { type: "list", items: [
        "微信朋友圈:头像重合是最直接的身份泄露。",
        "华人餐厅:高端 fine dining 是华人圈子重叠密度最高的地方。",
        "校友群/行业群:任何一次照片被搬运,72 小时内会被识别。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "站内聊天+视频,是最省事的隐私屏障 — 不需要给出真实微信、真实手机号。" },
    ],
  },
  {
    id: "p019", slug: "separate-money-investment-dating",
    title: "Why You Should Keep Money, Investment and Dating Separate",
    excerpt: "The most consistent pattern in dating fraud: it begins with a genuine relationship and shifts, gradually, into an investment conversation.",
    categorySlug: "wealth-privacy-risk",
    language: "en",
    coverImage: pick(18, 71) ?? "/images/placeholder.png",
    author: author(4), publishedAt: dateFor(18), readingTime: reading(6, "en"),
    tags: ["fraud", "privacy", "investment"],
    cta: ["safety", "premium"],
    body: [
      { type: "paragraph", text: "Modern dating fraud rarely starts with money. It starts with warmth — weeks of genuine, well-paced conversation. Then, softly, a mention of a family friend's crypto opportunity. That is the moment to disengage." },
      { type: "heading", text: "The pattern" },
      { type: "list", items: [
        "First 2–3 weeks: unusually attentive, well-written messages.",
        "Week 3–4: casual mention of a family investment, small returns.",
        "Week 4+: pressure to move to an off-platform investment app.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Real sugargirls do not pitch investments. The moment 'trading' enters a chat, treat it as a red flag, not a coincidence." },
    ],
  },
  {
    id: "p020", slug: "avoid-online-investment-fraud",
    title: "如何避免线上关系中的投资骗局和站外付款风险",
    excerpt: "感情投入不等于财务信任 — 任何要求站外付款的沟通都值得立刻停下。",
    categorySlug: "safety-privacy-trust",
    language: "zh",
    coverImage: pick(19, 73) ?? "/images/placeholder.png",
    author: author(5), publishedAt: dateFor(19), readingTime: reading(5, "zh"),
    tags: ["安全", "反诈", "投资骗局"],
    cta: ["safety", "premium"],
    body: [
      { type: "paragraph", text: "所有针对成熟男性的线上骗局都遵循同一个模板:先建立情感,后引导投资。这个模式在国内叫杀猪盘,在英国叫 pig butchering — 全球一致。" },
      { type: "heading", text: "识别三步骤" },
      { type: "list", items: [
        "沟通异常顺利、对方节奏永远优雅 — 真实关系有摩擦。",
        "对方主动提及家人朋友做投资、小额回报可复现。",
        "开始引导下载新 app、转账小金额测试。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "Sugardating 从不撮合任何形式的站外付款。任何要求微信/加密货币/礼品卡的沟通,直接举报。" },
    ],
  },
  // ============================================
  // P2 · Third batch (10)
  // ============================================
  {
    id: "p021", slug: "mayfair-kensington-canary-wharf-social-life",
    title: "Mayfair, Kensington or Canary Wharf: Where Premium Social Life Feels Different",
    excerpt: "Three postcodes, three social languages — where you live shapes who you meet and how.",
    categorySlug: "london-elite-lifestyle",
    language: "en",
    coverImage: pick(20, 79) ?? "/images/placeholder.png",
    author: author(6), publishedAt: dateFor(20), readingTime: reading(6, "en"),
    tags: ["london", "neighbourhoods"],
    cta: ["browse-london", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Mayfair is polished and international; Kensington is older-money quiet; Canary Wharf is fast and professional. Each attracts a different profile — of resident, of visitor, of sugargirl." },
      { type: "list", items: [
        "Mayfair: hotel bars, private members' clubs, high visitor turnover.",
        "Kensington: long-term residents, quieter restaurants, older accounts.",
        "Canary Wharf: after-work density Tuesday–Thursday, quieter weekends.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Where you meet shapes how you talk. Choose the postcode before you choose the venue." },
    ],
  },
  {
    id: "p022", slug: "quiet-luxury-dating-profiles",
    title: "The Quiet Luxury Approach to Dating Profiles",
    excerpt: "The best profiles are not the loudest — they are the ones that tell you the most in the fewest words.",
    categorySlug: "grooming-style-photography",
    language: "en",
    coverImage: pick(21, 83) ?? "/images/placeholder.png",
    author: author(1), publishedAt: dateFor(21), readingTime: reading(5, "en"),
    tags: ["profile", "quiet luxury"],
    cta: ["browse-sugargirls", "apply-creator"],
    body: [
      { type: "paragraph", text: "A quiet-luxury profile does the work of a loud one without the exposure. It signals taste, not price. It attracts fewer, better conversations." },
      { type: "list", items: [
        "One considered portrait, not a carousel of holidays.",
        "A bio in three lines, not three paragraphs.",
        "Interests specific enough to be true, general enough not to identify you.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "If your profile could belong to twenty other men, rewrite it. If it could only belong to you, ship it." },
    ],
  },
  {
    id: "p023", slug: "london-mens-spa-recovery",
    title: "伦敦男士 SPA 和运动恢复指南",
    excerpt: "从 Ten Health 到私人会所 — 伦敦男士恢复的三个层级。",
    categorySlug: "massage-spa-recovery",
    language: "zh",
    coverImage: pick(22, 89) ?? "/images/placeholder.png",
    author: author(2), publishedAt: dateFor(22), readingTime: reading(6, "zh"),
    tags: ["伦敦", "SPA", "恢复"],
    cta: ["browse-london", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "伦敦男士 SPA 大致分三层:连锁运动理疗、会所深层放松、酒店 in-room 私人理疗师。每一层解决不同问题。" },
      { type: "list", items: [
        "连锁运动理疗:Ten Health、Ten Chiropractic — 长途出差和训练后的默认选择。",
        "会所深层放松:Bulgari、Nobu、Corinthia Spa — 适合月度深度恢复。",
        "酒店 in-room:适合临时会议前调整状态,60 分钟即可。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "长途飞行后当天做 60 分钟淋巴引流 — 第二天状态的差异会立刻显现。" },
    ],
  },
  {
    id: "p024", slug: "video-introductions-trust-faster",
    title: "How Video Introductions Build Trust Faster Than Photos",
    excerpt: "60 seconds of video does more work than 60 messages of chat — for both sides.",
    categorySlug: "safety-privacy-trust",
    language: "en",
    coverImage: pick(23, 91) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(23), readingTime: reading(4, "en"),
    tags: ["video", "trust"],
    cta: ["video-profiles", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Video is bandwidth — micro-expressions, voice, room lighting, posture. All of it compresses trust-building into a fraction of the time text takes." },
      { type: "heading", text: "For men" },
      { type: "paragraph", text: "Recording a 30-second self-intro on your profile filters better than any bio ever will. Warm voice + steady eye contact outperforms a well-lit photo." },
      { type: "insight", title: "Sugardating Insight", text: "The best-performing member profiles have a short video intro. If yours doesn't, that's the first thing to add." },
    ],
  },
  {
    id: "p025", slug: "sugargirl-photography-packaging",
    title: "Sugargirl 摄影包装指南:如何提升资料点击率",
    excerpt: "光线、构图、色调、微表情 — Sugargirl 资料包装的四个基础项。",
    categorySlug: "sugargirl-creator-journal",
    language: "zh",
    coverImage: pick(24, 97) ?? "/images/placeholder.png",
    author: author(3), publishedAt: dateFor(24), readingTime: reading(6, "zh"),
    tags: ["sugargirl", "写真", "包装"],
    cta: ["apply-creator", "browse-sugargirls"],
    body: [
      { type: "paragraph", text: "Sugargirl 资料的第一张照片决定 70% 的点击率。它不需要最美,但必须最清晰地传递你希望被理解的形象。" },
      { type: "heading", text: "四个基础项" },
      { type: "list", items: [
        "自然光:上午 10 点或下午 4 点的窗光,比任何影棚灯温柔。",
        "构图:半身像优于全身,眼神与镜头持平。",
        "色调:低饱和 + 暖色,营造克制的高级感。",
        "表情:微笑不是必需,眼神稳定就够了。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "Sugardating 为认证 Sugargirl 提供免费写真支持 — 申请入驻后可预约。" },
    ],
  },
  {
    id: "p026", slug: "what-sugargirls-notice-first",
    title: "What Sugargirls Notice First in a Member Profile",
    excerpt: "Not what you think. A short list of things that shift the first impression.",
    categorySlug: "grooming-style-photography",
    language: "en",
    coverImage: pick(25, 101) ?? "/images/placeholder.png",
    author: author(7), publishedAt: dateFor(25), readingTime: reading(4, "en"),
    tags: ["profile", "first impression"],
    cta: ["browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "The signals that shift first impression on a member profile are surprisingly consistent. They are not what most men focus on." },
      { type: "list", items: [
        "Whether the profile photo makes eye contact.",
        "Whether the bio mentions specific interests, or defaults to industries.",
        "Whether there is a video — indicates seriousness.",
        "Whether the account has been verified.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "Complete profiles receive 3× the response rate. Verification alone raises it by 40%." },
    ],
  },
  {
    id: "p027", slug: "sleep-recovery-better-conversations",
    title: "Sleep, Recovery and Better Conversations",
    excerpt: "The single most reliable predictor of conversational presence is last night's sleep.",
    categorySlug: "longevity-wellness",
    language: "en",
    coverImage: pick(26, 103) ?? "/images/placeholder.png",
    author: author(4), publishedAt: dateFor(26), readingTime: reading(5, "en"),
    tags: ["sleep", "recovery"],
    cta: ["browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "Every book on charisma eventually admits the same thing: it correlates with sleep. Presence is a function of a nervous system that isn't stressed." },
      { type: "insight", title: "Sugardating Insight", text: "Never schedule a first meeting the same evening as a red-eye landing. The version of you she'll meet won't be you." },
    ],
  },
  {
    id: "p028", slug: "business-travellers-efficient-sugardating",
    title: "伦敦商务旅客如何高效使用 Sugardating",
    excerpt: "出差窗口短,决策成本高 — 一份 5 天商务旅客节奏参考。",
    categorySlug: "business-travellers-london",
    language: "zh",
    coverImage: pick(27, 107) ?? "/images/placeholder.png",
    author: author(6), publishedAt: dateFor(27), readingTime: reading(5, "zh"),
    tags: ["商务", "出差", "伦敦"],
    cta: ["browse-london", "premium", "video-profiles"],
    body: [
      { type: "paragraph", text: "5 天商务出差,能真正腾出来的社交窗口通常是 2 个晚上。用好这两个晚上,比投入 30 小时刷资料有意义。" },
      { type: "heading", text: "行前 7 天" },
      { type: "list", items: [
        "浏览 verified sugargirls,视频优先。",
        "开启 3-5 个初步对话,不承诺时间。",
        "开通 Premium,减少沟通摩擦。",
      ]},
      { type: "heading", text: "落地后" },
      { type: "list", items: [
        "落地日不安排见面,做恢复。",
        "第二晚 hotel bar 一杯酒,不做晚餐承诺。",
        "第三晚根据前一晚感受决定是否继续。",
      ]},
    ],
  },
  {
    id: "p029", slug: "cross-border-dating-etiquette",
    title: "Cross-Border Dating Etiquette for European Men in London",
    excerpt: "London is Europe's most cross-cultural dating market — a short primer on friction that isn't yours.",
    categorySlug: "relationship-intelligence",
    language: "en",
    coverImage: pick(28, 109) ?? "/images/placeholder.png",
    author: author(1), publishedAt: dateFor(28), readingTime: reading(5, "en"),
    tags: ["cross-cultural", "london", "etiquette"],
    cta: ["browse-sugargirls", "browse-asian"],
    body: [
      { type: "paragraph", text: "London is one of the few cities where you can plausibly date across five cultures in a single month. That is a privilege — and a responsibility to learn the small etiquettes that reduce unnecessary friction." },
      { type: "list", items: [
        "Punctuality expectations vary — Northern European ≈ on time, Southern ≈ +15, some Asian contexts ≈ early.",
        "Alcohol norms vary — a full drink is polite in some cultures, a red flag in others.",
        "Payment on first meeting: assume you offer; assume she has the right to decline.",
      ]},
      { type: "insight", title: "Sugardating Insight", text: "When in doubt, ask — softly, once. Etiquette failure is forgiven; presumption is not." },
    ],
  },
  {
    id: "p030", slug: "wellness-long-term-male-attractiveness",
    title: "养生不是老派话题:它是高端男性的长期吸引力管理",
    excerpt: "5 年、10 年,能量、专注、情绪 — 都在养生这件事上复利。",
    categorySlug: "longevity-wellness",
    language: "zh",
    coverImage: pick(29, 113) ?? "/images/placeholder.png",
    author: author(0), publishedAt: dateFor(29), readingTime: reading(6, "zh"),
    tags: ["养生", "长期主义", "吸引力"],
    cta: ["browse-sugargirls", "premium"],
    body: [
      { type: "paragraph", text: "养生这个词在中文语境里被讲坏了。它不是老派,不是保温杯泡枸杞 — 它是长期能量管理。5 年后你还有多少能量、多少专注度、多少稳定的情绪,都从今天开始定价。" },
      { type: "heading", text: "三个复利项" },
      { type: "list", items: [
        "睡眠:固定作息 > 早睡。",
        "训练:每周 3 次,不追求突破,追求持续。",
        "情绪:每天 20 分钟无手机时间。",
      ]},
      { type: "insight", title: "Sugardating 提示", text: "40 岁以后男性的吸引力,80% 来自长期状态管理 — 那不是天赋,是选择。" },
    ],
  },
];

// ══════════════════════════════════════
// Helpers
// ══════════════════════════════════════

// Runtime status/overlay accessors — 读取 CMS 后台修改
// 通过 globalThis 无循环依赖 (repository.ts 也读同一 key)
function getOverride(slug: string): any {
  const m: Map<string, any> | undefined = (globalThis as any).__sgCmsJournalOverride;
  return m?.get(slug);
}
function getNewPosts(): JournalPost[] {
  const m: Map<string, any> | undefined = (globalThis as any).__sgCmsJournalNew;
  if (!m) return [];
  return Array.from(m.values()).map((p) => ({
    ...p,
    updatedAt: p.updatedAt ?? p.publishedAt,
  })) as JournalPost[];
}

// 应用 override 到 post (title / featured / popular / status)
function withOverride(p: JournalPost): JournalPost & { status?: string } {
  const o = getOverride(p.slug);
  if (!o) return { ...p, status: "published" };
  return {
    ...p,
    title: o.title ?? p.title,
    featured: o.featured ?? p.featured,
    popular: o.popular ?? p.popular,
    status: o.status ?? "published",
  } as JournalPost & { status?: string };
}

// 返回全部 posts (base + new) · 已应用 override
function allWithStatus(): (JournalPost & { status?: string })[] {
  const base = journalPosts.map(withOverride);
  const news = getNewPosts().map((p) => ({ ...p, status: (p as any).status ?? "draft" }));
  return [...news, ...base];
}

function isPublic(p: { status?: string }): boolean {
  return (p.status ?? "published") === "published";
}

export function getPost(categorySlug: string, postSlug: string): JournalPost | undefined {
  const all = allWithStatus();
  const p = all.find((x) => x.categorySlug === categorySlug && x.slug === postSlug);
  if (!p || !isPublic(p)) return undefined;
  return p;
}

export function getPostBySlug(postSlug: string): JournalPost | undefined {
  const all = allWithStatus();
  const p = all.find((x) => x.slug === postSlug);
  if (!p || !isPublic(p)) return undefined;
  return p;
}

export function listPostsByCategory(categorySlug: string): JournalPost[] {
  return allWithStatus()
    .filter((p) => p.categorySlug === categorySlug && isPublic(p))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function listAllPosts(): JournalPost[] {
  return allWithStatus()
    .filter(isPublic)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function featuredPosts(): JournalPost[] {
  return allWithStatus().filter((p) => isPublic(p) && p.featured);
}

export function popularPosts(limit = 5): JournalPost[] {
  return allWithStatus().filter((p) => isPublic(p) && p.popular).slice(0, limit);
}

export function relatedPosts(post: JournalPost, limit = 3): JournalPost[] {
  // 同分类优先;不足则按 tag 交集 · 也过滤 draft/archived
  const all = allWithStatus().filter(isPublic);
  const sameCategory = all
    .filter((p) => p.categorySlug === post.categorySlug && p.slug !== post.slug);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const tagOverlap = all
    .filter((p) => p.slug !== post.slug && !sameCategory.includes(p))
    .map((p) => ({ post: p, overlap: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map((x) => x.post);
  return [...sameCategory, ...tagOverlap].slice(0, limit);
}
