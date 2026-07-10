// Sugargirl 入驻向导 · client-safe 类型 + 步骤定义 + 选项
// 独立于 mock-db (server-only),让 wizard client bundle 不引入 node deps

export type WizardStatus = "draft" | "submitted" | "reviewing" | "approved" | "rejected";

export interface CreatorMediaItem {
  id: string;
  kind: "image" | "video";
  url: string;       // data URL 或已上传 CDN URL
  title?: string;
  isCover?: boolean; // 主图/主视频
  isLocked?: boolean; // 需 coins 解锁
  createdAt: string;
}

export interface ApplyWizardDraft {
  status: WizardStatus;
  // Step 1 · 基础身份
  displayName: string;
  username: string;
  email: string;
  phone?: string;
  birthDate: string;
  country: string;
  city: string;
  availableCities: string[];
  languages: string[];
  // Step 2 · 主页介绍
  slogan: string;
  bio: string;
  occupation: string;
  profileTags: string[];
  // Step 3 · 外貌资料
  height?: number;
  weight?: number;
  bodyType?: string;
  skinTone?: string;
  hairColor?: string;
  eyeColor?: string;
  zodiac?: string;
  bloodType?: string;
  education?: string;
  nationality?: string;
  // Step 4 · 生活方式
  lifestyle: {
    smoking?: string;
    drinking?: string;
    diet?: string;
    fitness?: string;
    travel?: string;
    datingPref?: string;
    schedule?: string;
    availability?: string;
    timezone?: string;
  };
  // Step 5 · 兴趣
  interests: string[];
  // Step 6 · 服务
  services: Record<string, { enabled: boolean; priceFrom?: string; duration?: string; notes?: string }>;
  customEventTags: string[];
  // Step 7 · 照片
  avatar?: string;
  coverImage?: string;
  photos: CreatorMediaItem[];
  // Step 8 · 视频
  coverVideo?: string;
  introVideo?: string;
  videos: CreatorMediaItem[];
  // Step 9 · 认证
  verification: {
    confirmAdult: boolean;
    confirmTruth: boolean;
    acceptRules: boolean;
    identity: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    face: boolean;
    video: boolean;
    safeMeet: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ══════════════════════════════════════
// Step definitions (顺序 + 完成校验)
// ══════════════════════════════════════

export interface StepDef {
  key: StepKey;
  index: number;
  label: string;
  labelEn: string;
  helper: string;
  isComplete: (d: ApplyWizardDraft) => boolean;
}

export type StepKey = "identity" | "profile" | "physical" | "lifestyle" | "interests" | "services" | "photos" | "videos" | "verify";

export const STEPS: StepDef[] = [
  {
    key: "identity", index: 1,
    label: "基础身份", labelEn: "Identity",
    helper: "创建你的 sugargirl 主页 · 昵称、地区与语言",
    isComplete: (d) => !!(d.displayName && d.username && d.birthDate && d.country && d.city && d.languages.length),
  },
  {
    key: "profile", index: 2,
    label: "主页介绍", labelEn: "About",
    helper: "让别人 30 秒内理解你的风格与生活方式",
    isComplete: (d) => !!(d.slogan && d.bio && d.bio.length >= 40 && d.profileTags.length >= 2),
  },
  {
    key: "physical", index: 3,
    label: "外貌资料", labelEn: "Physical",
    helper: "帮助用户更准确了解你 · 可自选公开范围",
    isComplete: (d) => !!(d.height && d.bodyType),
  },
  {
    key: "lifestyle", index: 4,
    label: "生活方式", labelEn: "Lifestyle",
    helper: "作息、运动、旅行与约会偏好",
    isComplete: (d) => !!(d.lifestyle.smoking || d.lifestyle.drinking || d.lifestyle.fitness),
  },
  {
    key: "interests", index: 5,
    label: "兴趣爱好", labelEn: "Interests",
    helper: "至少选择 3 个,建议不超过 12 个",
    isComplete: (d) => d.interests.length >= 3,
  },
  {
    key: "services", index: 6,
    label: "服务设置", labelEn: "Services",
    helper: "打开你愿意提供的服务 · 可以后续再增补",
    isComplete: (d) => Object.values(d.services).some((s) => s.enabled),
  },
  {
    key: "photos", index: 7,
    label: "照片上传", labelEn: "Photos",
    helper: "头像 + 封面 + 至少 3 张个人照片",
    isComplete: (d) => !!(d.avatar && d.photos.length >= 3),
  },
  {
    key: "videos", index: 8,
    label: "视频上传", labelEn: "Videos",
    helper: "自我介绍视频能显著提升信任 · 可跳过",
    isComplete: () => true, // optional
  },
  {
    key: "verify", index: 9,
    label: "认证与提交", labelEn: "Verify & Submit",
    helper: "18+ 确认 · 平台规则 · 提交审核",
    isComplete: (d) => d.verification.confirmAdult && d.verification.confirmTruth && d.verification.acceptRules,
  },
];

export function completionPercent(d: ApplyWizardDraft): number {
  const done = STEPS.filter((s) => s.isComplete(d)).length;
  return Math.round((done / STEPS.length) * 100);
}

// ══════════════════════════════════════
// Selection option maps
// ══════════════════════════════════════

export const OPTIONS = {
  languages: ["中文", "English", "日本語", "한국어", "ภาษาไทย", "Tiếng Việt", "Filipino", "Français", "Deutsch", "Italiano", "Español"],
  countries: ["United Kingdom", "Singapore", "Hong Kong", "Malaysia", "Thailand", "Japan", "Korea", "Vietnam", "Philippines", "United States", "Australia"],
  profileTags: ["优雅", "安静", "活泼", "成熟", "旅行", "摄影", "美食", "健身", "艺术", "夜生活", "商务", "Luxury"],
  bodyType: ["纤细 Slim", "标准 Standard", "运动型 Athletic", "曲线 Curvy"],
  skinTone: ["白皙", "自然", "小麦色", "浅古铜"],
  hairColor: ["黑色", "棕色", "深棕", "栗色", "亚麻色", "金色", "染色"],
  eyeColor: ["黑色", "深棕色", "棕色", "琥珀色", "灰色", "蓝色"],
  smoking: ["不吸烟", "偶尔", "社交场合", "不公开"],
  drinking: ["不饮酒", "偶尔", "社交场合", "喜欢红酒", "不公开"],
  schedule: ["早睡型", "夜猫子", "弹性"],
  fitness: ["每周 1-2 次", "每周 3 次以上", "偶尔", "不公开"],
  travel: ["很少", "偶尔", "经常", "可接受旅行安排"],
  datingPref: ["长期陪伴", "偶尔约会", "视频优先", "商务场合", "不公开"],
  duration: ["30 分钟", "1 小时", "2 小时", "半天", "全天", "2 天以上"],
  interests: [
    "旅行", "摄影", "咖啡", "美食", "音乐", "电影", "健身", "艺术",
    "阅读", "时尚", "Luxury", "夜生活", "徒步", "品酒", "收藏", "设计",
    "舞蹈", "瑜伽", "剧院", "购物",
    "游艇派对", "高端酒会", "私人拍摄", "商务伴游", "会员俱乐部之夜",
  ],
  customEventTags: ["游艇派对", "高端酒会", "私人拍摄", "商务伴游", "会员俱乐部之夜"],
};

export const SERVICE_DEFS: { key: string; label: string; labelEn: string; desc: string; defaultOn?: boolean }[] = [
  { key: "chat",         label: "立即聊天",     labelEn: "Instant Chat",       desc: "站内私密聊天 · 支持 5 语言翻译",             defaultOn: true },
  { key: "videoChat",    label: "视频聊天",     labelEn: "Video Call",         desc: "预约前或预约中的视频沟通",                    defaultOn: true },
  { key: "privatePhoto", label: "私人拍摄",     labelEn: "Private Photoshoot", desc: "写真 / lifestyle / 旅行拍摄内容合作",          defaultOn: true },
  { key: "dating",       label: "预约陪伴",     labelEn: "Date Booking",       desc: "咖啡、晚餐、社交场合陪伴",                    defaultOn: true },
  { key: "travel",       label: "旅行陪伴",     labelEn: "Travel Companion",   desc: "短途 / 长途城市或旅行陪伴" },
  { key: "cocktail",     label: "高端酒会",     labelEn: "Cocktail Night",     desc: "酒会、rooftop、networking 高端社交" },
  { key: "yacht",        label: "游艇派对",     labelEn: "Yacht Party",        desc: "游艇派对与私人船上社交" },
  { key: "business",     label: "商务伴游",     labelEn: "Business Companion", desc: "商务旅行、客户晚宴、会议后社交" },
  { key: "membersClub",  label: "会员俱乐部之夜", labelEn: "Members' Club",     desc: "Mayfair / Kensington 会员俱乐部与私人 lounge" },
  { key: "tips",         label: "接受打赏",     labelEn: "Accept Gifts",        desc: "开启 credits 礼物与打赏" },
];

// ══════════════════════════════════════
// Default draft
// ══════════════════════════════════════

export function createEmptyDraft(prefill?: { email?: string; displayName?: string }): ApplyWizardDraft {
  const now = new Date().toISOString();
  const services: ApplyWizardDraft["services"] = {};
  for (const s of SERVICE_DEFS) {
    services[s.key] = { enabled: !!s.defaultOn };
  }
  return {
    status: "draft",
    displayName: prefill?.displayName ?? "",
    username: "",
    email: prefill?.email ?? "",
    phone: "",
    birthDate: "",
    country: "United Kingdom",
    city: "",
    availableCities: [],
    languages: [],
    slogan: "",
    bio: "",
    occupation: "",
    profileTags: [],
    lifestyle: {},
    interests: [],
    services,
    customEventTags: [],
    photos: [],
    videos: [],
    verification: {
      confirmAdult: false,
      confirmTruth: false,
      acceptRules: false,
      identity: false,
      phoneVerified: false,
      emailVerified: !!prefill?.email,
      face: false,
      video: false,
      safeMeet: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}

// ══════════════════════════════════════
// Username slug helper (mirror server)
// ══════════════════════════════════════

export function normalizeUsername(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
}

export function computeAge(iso: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export const DRAFT_KEY = "sg_apply_draft_v1";
