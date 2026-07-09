// Sugarboy 频道 mock — 12 位高端男性 Creator
// 结构复用 SugarGirlEntry (保持 UI + 详情页兼容),仅 cover 用 /sugarboy/*.avif 男性图
// 定位:面向女性、双向、LGBTQ+ 用户的 companion / lifestyle / business social

import type {
  SugarGirlEntry, SugarTag, SugarCategory, Interaction, BodyType, Region,
} from "./sugarGirlMock";

// 15 张男性头像 (public/sugarboy/*.avif) — 硬编码路径避免 client bundle 引 fs
const MALE_IMAGES = [
  "/sugarboy/profile_photo.avif",
  "/sugarboy/profile_photo (1).avif",
  "/sugarboy/profile_photo (2).avif",
  "/sugarboy/profile_photo (3).avif",
  "/sugarboy/profile_photo (4).avif",
  "/sugarboy/profile_photo (5).avif",
  "/sugarboy/profile_photo (6).avif",
  "/sugarboy/profile_photo (7).avif",
  "/sugarboy/profile_photo (8).avif",
  "/sugarboy/profile_photo (9).avif",
  "/sugarboy/profile_photo (10).avif",
  "/sugarboy/profile_photo (11).avif",
  "/sugarboy/profile_photo (12).avif",
  "/sugarboy/profile_photo (13).avif",
  "/sugarboy/profile_photo (14).avif",
];

function pickImg(i: number, offset = 0): string {
  const n = MALE_IMAGES.length;
  return MALE_IMAGES[(((i + offset) % n) + n) % n];
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const iso = (ms: number) => new Date(NOW - ms).toISOString();

// UK 覆盖 (Sugarboy 主市场)
const CITY_META: Record<string, { country: string; region: Region }> = {
  London:     { country: "United Kingdom", region: "other" },
  Manchester: { country: "United Kingdom", region: "other" },
  Birmingham: { country: "United Kingdom", region: "other" },
  Liverpool:  { country: "United Kingdom", region: "other" },
  Leeds:      { country: "United Kingdom", region: "other" },
  Bristol:    { country: "United Kingdom", region: "other" },
  Glasgow:    { country: "United Kingdom", region: "other" },
  Edinburgh:  { country: "United Kingdom", region: "other" },
  Singapore:  { country: "Singapore",       region: "se-asia" },
  "Hong Kong":{ country: "China (HK)",      region: "east-asia" },
};

function deriveRating(popularity: number): number {
  const norm = Math.min(Math.max(popularity, 0), 10000) / 10000;
  return Math.round((4.5 + norm * 0.5) * 100) / 100;
}

type Seed = {
  id: string; name: string; age: number; city: string; height: number;
  bodyType: BodyType; languages: string[]; online: boolean;
  intro: string; bio: string;
  tags: SugarTag[]; categories: SugarCategory[]; interactions: Interaction[];
  popularity: number; ageDays: number;
  imgIdx: number; imgOff?: number;
  featured?: boolean;
};

function build(s: Seed): SugarGirlEntry {
  const meta = CITY_META[s.city] ?? { country: s.city, region: "other" };
  return {
    id: s.id, name: s.name, age: s.age, city: s.city,
    country: meta.country, region: meta.region,
    height: s.height, bodyType: s.bodyType, languages: s.languages,
    online: s.online, intro: s.intro, bio: s.bio,
    tags: s.tags, categories: s.categories, interactions: s.interactions,
    popularity: s.popularity, rating: deriveRating(s.popularity),
    createdAt: iso(s.ageDays * DAY),
    cover: pickImg(s.imgIdx, s.imgOff ?? 0),
    featured: !!s.featured,
  };
}

export const sugarBoys: SugarGirlEntry[] = [
  build({ id: "leo",    name: "Leo",     age: 28, city: "London",    height: 184, bodyType: "athletic", languages: ["English", "中文"], online: true,
    intro: "健身教练 · 商务与视频沟通",  bio: "低调、礼貌、注重边界感 · 适合商务社交、视频聊天、旅行陪伴与高端活动场景。",
    tags: ["VIP", "Verified"], categories: ["运动", "时尚"], interactions: ["dating", "video-chat", "travel"],
    popularity: 9420, ageDays: 3, imgIdx: 0, featured: true }),
  build({ id: "aiden",  name: "Aiden",   age: 30, city: "London",    height: 186, bodyType: "athletic", languages: ["English", "French"], online: true,
    intro: "Consultant · 会员俱乐部熟客", bio: "London-based independent · 商务与私人晚宴陪伴 · 尊重时间与隐私。",
    tags: ["VIP", "Verified"], categories: ["时尚", "时尚"], interactions: ["dating", "video-chat"],
    popularity: 9120, ageDays: 5, imgIdx: 1, featured: true }),
  build({ id: "kai",    name: "Kai",     age: 27, city: "Manchester", height: 182, bodyType: "athletic", languages: ["English", "日本語"], online: false,
    intro: "摄影 · 私拍 · 短途旅行",     bio: "摄影背景 · 擅长私拍与短途旅行陪伴 · 站内视频确认后再线下。",
    tags: ["Verified"], categories: ["摄影", "旅行"], interactions: ["shoot", "travel", "video-chat"],
    popularity: 7420, ageDays: 6, imgIdx: 2, featured: true }),
  build({ id: "ethan",  name: "Ethan",   age: 32, city: "London",    height: 188, bodyType: "athletic", languages: ["English"], online: true,
    intro: "投行 · 红酒 · 老电影",       bio: "投行背景 · Mayfair 熟人局常客 · 谈话高于表演。",
    tags: ["VIP"], categories: ["时尚", "音乐"], interactions: ["dating", "video-chat"],
    popularity: 8730, ageDays: 8, imgIdx: 3, featured: true }),
  build({ id: "noah",   name: "Noah",    age: 26, city: "Birmingham", height: 180, bodyType: "athletic", languages: ["English", "Spanish"], online: true,
    intro: "个人教练 · 城市向导",         bio: "健身与徒步爱好者 · 适合商务旅客的短期城市陪伴。",
    tags: ["New", "Verified"], categories: ["运动", "旅行"], interactions: ["dating", "travel", "shoot"],
    popularity: 5820, ageDays: 2, imgIdx: 4, featured: true }),
  build({ id: "julian", name: "Julian",  age: 29, city: "Liverpool", height: 183, bodyType: "standard", languages: ["English", "Italian"], online: false,
    intro: "厨师 · 私人晚宴陪伴",        bio: "私人厨师背景 · 慢节奏晚宴与深度对话 · 尊重边界。",
    tags: ["Verified"], categories: ["美食", "艺术"], interactions: ["dating", "video-chat"],
    popularity: 6280, ageDays: 9, imgIdx: 5, featured: true }),
  build({ id: "hiro",   name: "Hiro",    age: 28, city: "London",    height: 178, bodyType: "slim",     languages: ["日本語", "English"], online: true,
    intro: "时尚编辑 · 拍摄 · 短评",     bio: "时尚编辑 · 慢节奏 · 私拍与视频聊天优先。",
    tags: ["VIP", "Verified"], categories: ["时尚", "摄影"], interactions: ["shoot", "video-chat"],
    popularity: 8140, ageDays: 4, imgIdx: 6, featured: true }),
  build({ id: "marcus", name: "Marcus",  age: 34, city: "Edinburgh", height: 186, bodyType: "athletic", languages: ["English"], online: false,
    intro: "登山向导 · 苏格兰旅拍",       bio: "苏格兰旅行向导 · 户外拍摄与安静的谈话时间。",
    tags: ["VIP"], categories: ["运动", "旅行"], interactions: ["travel", "shoot"],
    popularity: 7460, ageDays: 12, imgIdx: 7 }),
  build({ id: "daniel", name: "Daniel",  age: 27, city: "Leeds",     height: 181, bodyType: "standard", languages: ["English"], online: true,
    intro: "咖啡师 · 慢生活 · 阅读",     bio: "独立咖啡馆主理人 · 慢生活与阅读 · 城市漫步陪伴。",
    tags: ["New"], categories: ["美食", "阅读"], interactions: ["dating", "video-chat"],
    popularity: 4980, ageDays: 1, imgIdx: 8 }),
  build({ id: "arthur", name: "Arthur",  age: 31, city: "Bristol",   height: 185, bodyType: "athletic", languages: ["English", "French"], online: false,
    intro: "建筑师 · 极简 · 老爵士",     bio: "建筑背景 · 极简主义 · 慢节奏与深度对话。",
    tags: ["Verified"], categories: ["艺术", "音乐"], interactions: ["dating", "shoot"],
    popularity: 6720, ageDays: 10, imgIdx: 9 }),
  build({ id: "ryo",    name: "Ryo",     age: 26, city: "Manchester", height: 179, bodyType: "slim",     languages: ["日本語", "English"], online: true,
    intro: "创业者 · 视频优先 · 深谈",   bio: "SaaS 创业者 · 视频先聊 · 时间与边界都很清晰。",
    tags: ["New", "Verified"], categories: ["时尚", "阅读"], interactions: ["video-chat", "dating"],
    popularity: 5340, ageDays: 2, imgIdx: 10 }),
  build({ id: "victor", name: "Victor",  age: 33, city: "Glasgow",   height: 187, bodyType: "athletic", languages: ["English", "Russian"], online: false,
    intro: "红酒商 · 会员俱乐部",         bio: "红酒进口商 · 会员俱乐部之夜与雪茄吧陪伴 · 尊重隐私。",
    tags: ["VIP", "Verified"], categories: ["时尚", "音乐"], interactions: ["dating"],
    popularity: 7910, ageDays: 14, imgIdx: 11 }),
  build({ id: "sam",    name: "Sam",     age: 29, city: "London",    height: 183, bodyType: "athletic", languages: ["English", "中文"], online: true,
    intro: "医生 · 恢复 · 冷静",         bio: "医疗背景 · 稳定、克制、有边界感的陪伴与谈话时间。",
    tags: ["Verified"], categories: ["运动", "阅读"], interactions: ["dating", "video-chat"],
    popularity: 8210, ageDays: 7, imgIdx: 12 }),
  build({ id: "mateo",  name: "Mateo",   age: 30, city: "Birmingham", height: 182, bodyType: "standard", languages: ["English", "Portuguese"], online: false,
    intro: "音乐制作人 · 深夜漫步",       bio: "独立音乐制作人 · 城市夜行漫步 · 视频优先。",
    tags: ["Verified"], categories: ["音乐", "艺术"], interactions: ["dating", "video-chat"],
    popularity: 5620, ageDays: 11, imgIdx: 13 }),
];

// 复用 sugarGirlMock 的 age/height 范围与筛选谓词,保证 Grid 组件行为一致
export { ageRanges, heightRanges } from "./sugarGirlMock";
