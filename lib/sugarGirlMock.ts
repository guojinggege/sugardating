// /male-artists 页(展示名 SugarGirl)的 directory 占位数据
// 头像走 public/images/ 11 张真图;路径硬编码,SugarGirlGrid 是 client component,
// 如果 transitive 引入 lib/images.ts(里面用了 node:fs)bundler 会失败

const IMG_FILES = [
  "8b842efe240c75785893d227066893a617b891b67add8cc26bfef890f4f070ef.webp",
  "v2-29a5587d724d82cd5ae79a0a7907726b_1440w.png",
  "v2-3f14fb06170af477dca684d4cba8023d_1440w.jpg",
  "v2-42d3c6648ccf9bd91c1f1d275cf35bab_1440w.png",
  "v2-443d2c16026da4a40f6c032246ee85da_1440w.png",
  "v2-4f08f6e64e4b7a08029ff25803c7d5ad_1440w.png",
  "v2-6b10011cfa662b4758f93d6b0faa8526_1440w.png",
  "v2-733eb901720eaa60ff4c6b4af7a6af58_1440w.png",
  "v2-929c77914860c506b2762df205e1b3f5_1440w.png",
  "v2-ab393098c7bf5ee1aeea165e8efaeefe_1440w.png",
  "v2-cb8c9dec96499a5f4a2327093935f0b5_1440w.png",
];
function pickImg(i: number, offset = 0): string {
  const n = IMG_FILES.length;
  return `/images/${IMG_FILES[(((i + offset) % n) + n) % n]}`;
}

export type SugarTag = "VIP" | "Verified" | "New";
export type SugarCategory = "旅行" | "艺术" | "美食" | "运动" | "时尚" | "摄影" | "音乐" | "阅读";
export type Interaction = "dating" | "travel" | "shoot" | "video-chat";
export type BodyType = "slim" | "standard" | "curvy" | "athletic";
export type Region = "se-asia" | "east-asia" | "east-europe" | "other";

export interface SugarGirlEntry {
  id: string;
  name: string;        // 昵称
  age: number;
  city: string;        // 中文城市
  country: string;     // 中文国家/地区
  region: Region;      // 大区
  height: number;      // cm
  bodyType: BodyType;
  languages: string[]; // 显示用 (中文/English/日本語/한국어/...)
  online: boolean;
  intro: string;       // 一句话简介 (展示在卡片)
  bio: string;         // 1-2 行长简介
  tags: SugarTag[];
  categories: SugarCategory[];
  interactions: Interaction[];
  popularity: number;  // sort by popular 用
  createdAt: string;   // ISO,sort by latest 用
  cover: string;       // 卡片大图 url
  featured: boolean;   // 顶部 featured 区显示
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const iso = (ms: number) => new Date(NOW - ms).toISOString();

// 城市 → 国家/地区 + 区域归属
const CITY_META: Record<string, { country: string; region: Region }> = {
  新加坡:   { country: "新加坡",     region: "se-asia" },
  吉隆坡:   { country: "马来西亚",   region: "se-asia" },
  曼谷:     { country: "泰国",       region: "se-asia" },
  马尼拉:   { country: "菲律宾",     region: "se-asia" },
  胡志明市: { country: "越南",       region: "se-asia" },
  香港:     { country: "中国香港",   region: "east-asia" },
  台北:     { country: "中国台湾",   region: "east-asia" },
  东京:     { country: "日本",       region: "east-asia" },
  首尔:     { country: "韩国",       region: "east-asia" },
  伦敦:     { country: "英国",       region: "other" },
  悉尼:     { country: "澳大利亚",   region: "other" },
  华沙:     { country: "波兰",       region: "east-europe" },
  布拉格:   { country: "捷克",       region: "east-europe" },
};

type SeedInput = {
  id: string; name: string; age: number; city: string; height: number;
  bodyType: BodyType; languages: string[]; online: boolean;
  intro: string; bio: string;
  tags: SugarTag[]; categories: SugarCategory[]; interactions: Interaction[];
  popularity: number; ageDays: number;
  imgIdx: number; imgOff?: number;
  featured?: boolean;
};

function build(s: SeedInput): SugarGirlEntry {
  const meta = CITY_META[s.city];
  return {
    id: s.id, name: s.name, age: s.age, city: s.city,
    country: meta.country, region: meta.region,
    height: s.height, bodyType: s.bodyType, languages: s.languages,
    online: s.online, intro: s.intro, bio: s.bio,
    tags: s.tags, categories: s.categories, interactions: s.interactions,
    popularity: s.popularity, createdAt: iso(s.ageDays * DAY),
    cover: pickImg(s.imgIdx, s.imgOff ?? 0),
    featured: !!s.featured,
  };
}

export const sugarGirls: SugarGirlEntry[] = [
  build({ id: "sg01", name: "Aria",  age: 24, city: "新加坡", height: 168, bodyType: "slim",     languages: ["中文","English"],         online: true,
    intro: "热爱旅行的双语 Foodie", bio: "热爱旅行与摄影 · 中英双语 · Foodie",
    tags: ["VIP","Verified"], categories: ["旅行","摄影"], interactions: ["dating","travel"],
    popularity: 9870, ageDays: 2, imgIdx: 0, featured: true }),
  build({ id: "sg02", name: "Mira",  age: 26, city: "香港",   height: 170, bodyType: "standard", languages: ["中文","English","日本語"], online: true,
    intro: "时尚买手 · 慢生活",   bio: "时尚买手 · 一年三季在路上 · 慢生活",
    tags: ["Verified"], categories: ["时尚","旅行"], interactions: ["dating","travel","shoot"],
    popularity: 8540, ageDays: 4, imgIdx: 1, featured: true }),
  build({ id: "sg03", name: "Yuna",  age: 23, city: "东京",   height: 163, bodyType: "athletic", languages: ["日本語","English"],        online: false,
    intro: "周末看书与展览的瑜伽教练", bio: "瑜伽教练 · 周末看书与展览",
    tags: ["New"], categories: ["运动","阅读"], interactions: ["dating","video-chat"],
    popularity: 5230, ageDays: 1, imgIdx: 2, featured: true }),
  build({ id: "sg04", name: "Chloe", age: 25, city: "台北",   height: 165, bodyType: "slim",     languages: ["中文","English"],         online: true,
    intro: "电影 / 美食 / 独立咖啡馆控", bio: "电影 / 美食 / 独立咖啡馆控",
    tags: ["VIP"], categories: ["美食","艺术"], interactions: ["dating","video-chat"],
    popularity: 8120, ageDays: 3, imgIdx: 3, featured: true }),
  build({ id: "sg05", name: "Wenxi", age: 22, city: "新加坡", height: 167, bodyType: "slim",     languages: ["中文","English"],         online: false,
    intro: "在读艺术生 · 摄影 + 平面", bio: "艺术院校在读 · 摄影 + 平面设计",
    tags: ["New","Verified"], categories: ["艺术","摄影"], interactions: ["shoot","video-chat"],
    popularity: 4180, ageDays: 0.5, imgIdx: 4 }),
  build({ id: "sg06", name: "Sora",  age: 27, city: "东京",   height: 172, bodyType: "standard", languages: ["日本語","English"],        online: true,
    intro: "时尚 · 慢节奏 · 古典乐", bio: "时尚 / 慢节奏 / 古典乐",
    tags: ["VIP","Verified"], categories: ["时尚","音乐"], interactions: ["dating","travel"],
    popularity: 9230, ageDays: 5, imgIdx: 5 }),
  build({ id: "sg07", name: "Nori",  age: 25, city: "首尔",   height: 169, bodyType: "slim",     languages: ["한국어","English"],        online: false,
    intro: "短途旅行家 · 喜欢拍胶片", bio: "短途旅行家 · 喜欢拍胶片",
    tags: ["Verified"], categories: ["旅行","摄影"], interactions: ["travel","shoot"],
    popularity: 6420, ageDays: 6, imgIdx: 6 }),
  build({ id: "sg08", name: "Ivy",   age: 26, city: "香港",   height: 171, bodyType: "athletic", languages: ["中文","English"],         online: true,
    intro: "金融背景 · 红酒 + 阅读", bio: "金融背景 · 周末徒步 · 红酒 + 阅读",
    tags: ["VIP"], categories: ["运动","阅读"], interactions: ["dating","video-chat"],
    popularity: 7860, ageDays: 7, imgIdx: 7 }),
  build({ id: "sg09", name: "Anika", age: 24, city: "曼谷",   height: 166, bodyType: "athletic", languages: ["ภาษาไทย","English"],       online: false,
    intro: "Yoga + 冲浪 + 海边",   bio: "热带女孩 · Yoga + 冲浪 + 海边",
    tags: ["New"], categories: ["运动","旅行"], interactions: ["travel","video-chat"],
    popularity: 3940, ageDays: 1, imgIdx: 8 }),
  build({ id: "sg10", name: "Linna", age: 28, city: "吉隆坡", height: 174, bodyType: "standard", languages: ["中文","English","Bahasa Melayu"], online: true,
    intro: "极简主义建筑师",         bio: "建筑师 · 极简主义 · 长居热带",
    tags: ["Verified"], categories: ["艺术","时尚"], interactions: ["dating","shoot"],
    popularity: 7120, ageDays: 8, imgIdx: 9 }),
  build({ id: "sg11", name: "Hana",  age: 23, city: "首尔",   height: 162, bodyType: "slim",     languages: ["한국어","English"],        online: true,
    intro: "插画师 · 独居一只猫",   bio: "插画师 · 独居一只猫 · 慢生活",
    tags: ["New","Verified"], categories: ["艺术","阅读"], interactions: ["dating","video-chat"],
    popularity: 5890, ageDays: 2, imgIdx: 10 }),
  build({ id: "sg12", name: "Joy",   age: 25, city: "新加坡", height: 168, bodyType: "athletic", languages: ["中文","English"],         online: false,
    intro: "Foodie + 跑者 · 周末跑半程", bio: "Foodie + 跑者 · 周末跑半程",
    tags: ["VIP"], categories: ["美食","运动"], interactions: ["dating","video-chat"],
    popularity: 8930, ageDays: 9, imgIdx: 0, imgOff: 4 }),
  build({ id: "sg13", name: "Iris",  age: 27, city: "台北",   height: 170, bodyType: "standard", languages: ["中文","English"],         online: true,
    intro: "艺廊策展 · 茶 + 老电影", bio: "艺廊策展 · 茶 + 老电影",
    tags: ["VIP","Verified"], categories: ["艺术","美食"], interactions: ["dating","travel"],
    popularity: 9540, ageDays: 10, imgIdx: 1, imgOff: 4 }),
  build({ id: "sg14", name: "Saya",  age: 22, city: "东京",   height: 161, bodyType: "slim",     languages: ["日本語","English"],        online: false,
    intro: "美院在读 · 平面 + 摄影", bio: "美院在读 · 平面 + 摄影 + 二手书",
    tags: ["New"], categories: ["艺术","摄影"], interactions: ["shoot","video-chat"],
    popularity: 3520, ageDays: 1.5, imgIdx: 2, imgOff: 4 }),
  build({ id: "sg15", name: "Rin",   age: 24, city: "伦敦",   height: 173, bodyType: "standard", languages: ["English","中文"],         online: true,
    intro: "古典乐 / 黑白电影",     bio: "海外工作 · 古典乐 / 黑白电影",
    tags: ["VIP","Verified"], categories: ["音乐","艺术"], interactions: ["dating","travel"],
    popularity: 8230, ageDays: 11, imgIdx: 3, imgOff: 4 }),
  build({ id: "sg16", name: "Eve",   age: 26, city: "香港",   height: 169, bodyType: "standard", languages: ["中文","English"],         online: false,
    intro: "品牌咨询 / 周末徒步",   bio: "品牌咨询 / 红酒 / 周末徒步",
    tags: ["Verified"], categories: ["时尚","运动"], interactions: ["dating","video-chat"],
    popularity: 6710, ageDays: 12, imgIdx: 4, imgOff: 4 }),
  build({ id: "sg17", name: "Mei",   age: 28, city: "悉尼",   height: 175, bodyType: "athletic", languages: ["English","中文"],         online: true,
    intro: "建筑摄影师 · 海岸线常客", bio: "建筑摄影师 · 海岸线常客",
    tags: ["VIP"], categories: ["摄影","旅行"], interactions: ["travel","shoot"],
    popularity: 7980, ageDays: 13, imgIdx: 5, imgOff: 4 }),
  build({ id: "sg18", name: "Kana",  age: 23, city: "胡志明市", height: 164, bodyType: "slim",   languages: ["Tiếng Việt","English"],    online: false,
    intro: "美食 + 街拍 + 热带咖啡馆", bio: "美食 + 街拍 + 热带咖啡馆",
    tags: ["New"], categories: ["美食","摄影"], interactions: ["dating","shoot"],
    popularity: 4120, ageDays: 14, imgIdx: 6, imgOff: 4 }),
  build({ id: "sg19", name: "Lina",  age: 25, city: "马尼拉",  height: 167, bodyType: "standard", languages: ["English"],                online: true,
    intro: "MBA · 跑步 / 阅读",     bio: "海外 MBA · 跑步 / 阅读 / 慢节奏",
    tags: ["Verified"], categories: ["运动","阅读"], interactions: ["dating","video-chat"],
    popularity: 5640, ageDays: 14, imgIdx: 7, imgOff: 4 }),
  build({ id: "sg20", name: "Liyan", age: 29, city: "新加坡",  height: 172, bodyType: "standard", languages: ["中文","English"],         online: false,
    intro: "投行 → 自由职业 · 古典乐", bio: "投行 → 自由职业 · 古典乐 / 红酒",
    tags: ["VIP","Verified"], categories: ["音乐","时尚"], interactions: ["dating","travel"],
    popularity: 9120, ageDays: 15, imgIdx: 8, imgOff: 4 }),
  // 东欧 2 位 — 让"东欧"快速筛选不为空
  build({ id: "sg21", name: "Zofia", age: 25, city: "华沙",   height: 174, bodyType: "slim",     languages: ["Polski","English"],        online: true,
    intro: "古典钢琴 · 慢节奏",     bio: "古典钢琴 · 慢节奏 · 老电影",
    tags: ["VIP","Verified"], categories: ["音乐","艺术"], interactions: ["dating","video-chat"],
    popularity: 7240, ageDays: 5, imgIdx: 9, imgOff: 4 }),
  build({ id: "sg22", name: "Karolina", age: 27, city: "布拉格", height: 173, bodyType: "standard", languages: ["English"],              online: false,
    intro: "建筑摄影 · 长居欧洲",   bio: "建筑摄影师 · 长居欧洲 · 红酒",
    tags: ["Verified"], categories: ["摄影","旅行"], interactions: ["travel","shoot"],
    popularity: 6580, ageDays: 7, imgIdx: 10, imgOff: 4 }),
];

// 全集供 FilterBar 渲染
export const countries = Array.from(new Set(sugarGirls.map((g) => g.country))).sort();
export const cities = Array.from(new Set(sugarGirls.map((g) => g.city))).sort();
export const allCategories: SugarCategory[] = ["旅行", "艺术", "美食", "运动", "时尚", "摄影", "音乐", "阅读"];
export const allLanguages = Array.from(new Set(sugarGirls.flatMap((g) => g.languages))).sort();

export const REGIONS: { key: Region; label: string; labelEn: string }[] = [
  { key: "se-asia",     label: "东南亚", labelEn: "Southeast Asia" },
  { key: "east-asia",   label: "东亚",   labelEn: "East Asia" },
  { key: "east-europe", label: "东欧",   labelEn: "East Europe" },
  { key: "other",       label: "其他",   labelEn: "Other" },
];

export const BODY_TYPES: { key: BodyType; label: string; labelEn: string }[] = [
  { key: "slim",     label: "纤细",   labelEn: "Slim" },
  { key: "standard", label: "标准",   labelEn: "Standard" },
  { key: "curvy",    label: "丰满",   labelEn: "Curvy" },
  { key: "athletic", label: "运动型", labelEn: "Athletic" },
];

export const INTERACTIONS: { key: Interaction; label: string; labelEn: string }[] = [
  { key: "dating",     label: "约会",     labelEn: "Dating" },
  { key: "travel",     label: "旅游",     labelEn: "Travel" },
  { key: "shoot",      label: "拍摄",     labelEn: "Shoot" },
  { key: "video-chat", label: "视频聊天", labelEn: "Video Chat" },
];

// 年龄段 / 身高段 标签集合
export const ageRanges = [
  { key: "all",   label: "全部年龄" },
  { key: "21-23", label: "21–23", min: 21, max: 23 },
  { key: "24-26", label: "24–26", min: 24, max: 26 },
  { key: "27-29", label: "27–29", min: 27, max: 29 },
];
export const heightRanges = [
  { key: "all",     label: "全部身高" },
  { key: "lt-165",  label: "< 165 cm",   min: 0,   max: 164 },
  { key: "165-170", label: "165–170 cm", min: 165, max: 170 },
  { key: "gt-170",  label: "> 170 cm",   min: 171, max: 999 },
];
