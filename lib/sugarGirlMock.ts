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
function pick(i: number, offset = 0): string {
  const n = IMG_FILES.length;
  return `/images/${IMG_FILES[(((i + offset) % n) + n) % n]}`;
}

export type SugarTag = "VIP" | "Verified" | "New";
export type SugarCategory = "旅行" | "艺术" | "美食" | "运动" | "时尚" | "摄影" | "音乐" | "阅读";

export interface SugarGirlEntry {
  id: string;
  name: string;        // 昵称
  age: number;
  city: string;        // 中文城市
  country: string;     // 中文国家/地区
  height: number;      // cm
  online: boolean;
  bio: string;         // 1-2 行
  tags: SugarTag[];
  categories: SugarCategory[];
  popularity: number;  // sort by popular 用
  createdAt: string;   // ISO,sort by latest 用
  cover: string;       // 卡片大图 url
  featured: boolean;   // 顶部 featured 区显示
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const iso = (ms: number) => new Date(NOW - ms).toISOString();

// 城市 → 国家/地区
const CITY_COUNTRY: Record<string, string> = {
  新加坡: "新加坡",
  香港: "中国香港",
  台北: "中国台湾",
  东京: "日本",
  首尔: "韩国",
  吉隆坡: "马来西亚",
  曼谷: "泰国",
  伦敦: "英国",
  悉尼: "澳大利亚",
  马尼拉: "菲律宾",
  胡志明市: "越南",
};

const cover = (i: number, off: number) => pick(i, off) ?? "/images/placeholder.png";

export const sugarGirls: SugarGirlEntry[] = [
  {
    id: "sg01", name: "Aria",     age: 24, city: "新加坡", country: CITY_COUNTRY.新加坡, height: 168, online: true,
    bio: "热爱旅行与摄影 · 中英双语 · Foodie",
    tags: ["VIP", "Verified"], categories: ["旅行", "摄影"], popularity: 9870, createdAt: iso(2 * DAY),
    cover: cover(0, 0), featured: true,
  },
  {
    id: "sg02", name: "Mira",     age: 26, city: "香港", country: CITY_COUNTRY.香港, height: 170, online: true,
    bio: "时尚买手 · 一年三季在路上 · 慢生活",
    tags: ["Verified"], categories: ["时尚", "旅行"], popularity: 8540, createdAt: iso(4 * DAY),
    cover: cover(1, 0), featured: true,
  },
  {
    id: "sg03", name: "Yuna",     age: 23, city: "东京", country: CITY_COUNTRY.东京, height: 163, online: false,
    bio: "瑜伽教练 · 周末看书与展览",
    tags: ["New"], categories: ["运动", "阅读"], popularity: 5230, createdAt: iso(1 * DAY),
    cover: cover(2, 0), featured: true,
  },
  {
    id: "sg04", name: "Chloe",    age: 25, city: "台北", country: CITY_COUNTRY.台北, height: 165, online: true,
    bio: "电影 / 美食 / 独立咖啡馆控",
    tags: ["VIP"], categories: ["美食", "艺术"], popularity: 8120, createdAt: iso(3 * DAY),
    cover: cover(3, 0), featured: true,
  },
  {
    id: "sg05", name: "Wenxi",    age: 22, city: "新加坡", country: CITY_COUNTRY.新加坡, height: 167, online: false,
    bio: "艺术院校在读 · 摄影 + 平面设计",
    tags: ["New", "Verified"], categories: ["艺术", "摄影"], popularity: 4180, createdAt: iso(0.5 * DAY),
    cover: cover(4, 0), featured: false,
  },
  {
    id: "sg06", name: "Sora",     age: 27, city: "东京", country: CITY_COUNTRY.东京, height: 172, online: true,
    bio: "时尚 / 慢节奏 / 古典乐",
    tags: ["VIP", "Verified"], categories: ["时尚", "音乐"], popularity: 9230, createdAt: iso(5 * DAY),
    cover: cover(5, 0), featured: false,
  },
  {
    id: "sg07", name: "Nori",     age: 25, city: "首尔", country: CITY_COUNTRY.首尔, height: 169, online: false,
    bio: "短途旅行家 · 喜欢拍胶片",
    tags: ["Verified"], categories: ["旅行", "摄影"], popularity: 6420, createdAt: iso(6 * DAY),
    cover: cover(6, 0), featured: false,
  },
  {
    id: "sg08", name: "Ivy",      age: 26, city: "香港", country: CITY_COUNTRY.香港, height: 171, online: true,
    bio: "金融背景 · 周末徒步 · 红酒 + 阅读",
    tags: ["VIP"], categories: ["运动", "阅读"], popularity: 7860, createdAt: iso(7 * DAY),
    cover: cover(7, 0), featured: false,
  },
  {
    id: "sg09", name: "Anika",    age: 24, city: "曼谷", country: CITY_COUNTRY.曼谷, height: 166, online: false,
    bio: "热带女孩 · Yoga + 冲浪 + 海边",
    tags: ["New"], categories: ["运动", "旅行"], popularity: 3940, createdAt: iso(1 * DAY),
    cover: cover(8, 0), featured: false,
  },
  {
    id: "sg10", name: "Linna",    age: 28, city: "吉隆坡", country: CITY_COUNTRY.吉隆坡, height: 174, online: true,
    bio: "建筑师 · 极简主义 · 长居热带",
    tags: ["Verified"], categories: ["艺术", "时尚"], popularity: 7120, createdAt: iso(8 * DAY),
    cover: cover(9, 0), featured: false,
  },
  {
    id: "sg11", name: "Hana",     age: 23, city: "首尔", country: CITY_COUNTRY.首尔, height: 162, online: true,
    bio: "插画师 · 独居一只猫 · 慢生活",
    tags: ["New", "Verified"], categories: ["艺术", "阅读"], popularity: 5890, createdAt: iso(2 * DAY),
    cover: cover(10, 0), featured: false,
  },
  {
    id: "sg12", name: "Joy",      age: 25, city: "新加坡", country: CITY_COUNTRY.新加坡, height: 168, online: false,
    bio: "Foodie + 跑者 · 周末跑半程",
    tags: ["VIP"], categories: ["美食", "运动"], popularity: 8930, createdAt: iso(9 * DAY),
    cover: cover(0, 4), featured: false,
  },
  {
    id: "sg13", name: "Iris",     age: 27, city: "台北", country: CITY_COUNTRY.台北, height: 170, online: true,
    bio: "艺廊策展 · 茶 + 老电影",
    tags: ["VIP", "Verified"], categories: ["艺术", "美食"], popularity: 9540, createdAt: iso(10 * DAY),
    cover: cover(1, 4), featured: false,
  },
  {
    id: "sg14", name: "Saya",     age: 22, city: "东京", country: CITY_COUNTRY.东京, height: 161, online: false,
    bio: "美院在读 · 平面 + 摄影 + 二手书",
    tags: ["New"], categories: ["艺术", "摄影"], popularity: 3520, createdAt: iso(1.5 * DAY),
    cover: cover(2, 4), featured: false,
  },
  {
    id: "sg15", name: "Rin",      age: 24, city: "伦敦", country: CITY_COUNTRY.伦敦, height: 173, online: true,
    bio: "海外工作 · 古典乐 / 黑白电影",
    tags: ["VIP", "Verified"], categories: ["音乐", "艺术"], popularity: 8230, createdAt: iso(11 * DAY),
    cover: cover(3, 4), featured: false,
  },
  {
    id: "sg16", name: "Eve",      age: 26, city: "香港", country: CITY_COUNTRY.香港, height: 169, online: false,
    bio: "品牌咨询 / 红酒 / 周末徒步",
    tags: ["Verified"], categories: ["时尚", "运动"], popularity: 6710, createdAt: iso(12 * DAY),
    cover: cover(4, 4), featured: false,
  },
  {
    id: "sg17", name: "Mei",      age: 28, city: "悉尼", country: CITY_COUNTRY.悉尼, height: 175, online: true,
    bio: "建筑摄影师 · 海岸线常客",
    tags: ["VIP"], categories: ["摄影", "旅行"], popularity: 7980, createdAt: iso(13 * DAY),
    cover: cover(5, 4), featured: false,
  },
  {
    id: "sg18", name: "Kana",     age: 23, city: "胡志明市", country: CITY_COUNTRY.胡志明市, height: 164, online: false,
    bio: "美食 + 街拍 + 热带咖啡馆",
    tags: ["New"], categories: ["美食", "摄影"], popularity: 4120, createdAt: iso(2 * DAY),
    cover: cover(6, 4), featured: false,
  },
  {
    id: "sg19", name: "Lina",     age: 25, city: "马尼拉", country: CITY_COUNTRY.马尼拉, height: 167, online: true,
    bio: "海外 MBA · 跑步 / 阅读 / 慢节奏",
    tags: ["Verified"], categories: ["运动", "阅读"], popularity: 5640, createdAt: iso(14 * DAY),
    cover: cover(7, 4), featured: false,
  },
  {
    id: "sg20", name: "Liyan",    age: 29, city: "新加坡", country: CITY_COUNTRY.新加坡, height: 172, online: false,
    bio: "投行 → 自由职业 · 古典乐 / 红酒",
    tags: ["VIP", "Verified"], categories: ["音乐", "时尚"], popularity: 9120, createdAt: iso(15 * DAY),
    cover: cover(8, 4), featured: false,
  },
];

// 国家/城市/分类全集供 FilterBar 渲染
export const countries = Array.from(new Set(sugarGirls.map((g) => g.country))).sort();
export const cities = Array.from(new Set(sugarGirls.map((g) => g.city))).sort();
export const allCategories: SugarCategory[] = ["旅行", "艺术", "美食", "运动", "时尚", "摄影", "音乐", "阅读"];

// 年龄段 / 身高段 标签集合(展示用)
export const ageRanges = [
  { key: "all",   label: "全部" },
  { key: "21-23", label: "21–23", min: 21, max: 23 },
  { key: "24-26", label: "24–26", min: 24, max: 26 },
  { key: "27-29", label: "27–29", min: 27, max: 29 },
];
export const heightRanges = [
  { key: "all",     label: "全部" },
  { key: "lt-165",  label: "< 165",       min: 0,   max: 164 },
  { key: "165-170", label: "165–170 cm",  min: 165, max: 170 },
  { key: "gt-170",  label: "> 170 cm",    min: 171, max: 999 },
];
