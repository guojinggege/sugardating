// Sugardating · Sensual Massage / 情趣按摩频道数据
// 定位:18+ 高端私密放松 / wellness companion 目录 · 文案克制、认证优先、隐私第一
// 复用现有 CreatorProfile / LockedMedia / Chat 逻辑,不做单独系统

import { pick } from "@/lib/images";
import type { Creator, Tier } from "@/lib/types";
import {
  SERVICE_STYLE_LABEL, APPOINTMENT_LABEL,
  type ServiceStyle, type AppointmentType, type ProviderTag,
} from "@/lib/massage-labels";

// Re-export for backwards compat (server-only files can still import from massage-data)
export { SERVICE_STYLE_LABEL, APPOINTMENT_LABEL };
export type { ServiceStyle, AppointmentType, ProviderTag };

// MassageProvider / Verification / Availability types moved to lib/massage-labels
// (client-safe) — re-exported below for backwards compat
import type { MassageProvider, Verification, Availability } from "@/lib/massage-labels";
export type { MassageProvider, Verification, Availability };

export interface City {
  slug: string;
  label: string;
  labelZh: string;
  country: string;
  areas: Area[];
  seoTitle: string;
  seoTitleZh: string;
  seoIntro: string;          // 简介
  seoIntroZh: string;
}

export interface Area {
  slug: string;
  label: string;
  parentCity: string;
}

// ══════════════════════════════════════
// Cities & Areas
// ══════════════════════════════════════

export const cities: City[] = [
  {
    slug: "london",
    label: "London",
    labelZh: "伦敦",
    country: "UK",
    seoTitle: "Private Sensual Massage in London",
    seoTitleZh: "伦敦高端情趣按摩与私密放松体验",
    seoIntro: "Verified 18+ massage providers in central London, from Mayfair to Canary Wharf. Filter by language, availability, video introduction and verification status.",
    seoIntroZh: "浏览伦敦中区已认证的 18+ 私密按摩与放松体验服务者 — 从 Mayfair 到 Canary Wharf,支持按语言、在线状态、视频资料与认证信息筛选。",
    areas: [
      { slug: "mayfair",       label: "Mayfair",       parentCity: "london" },
      { slug: "kensington",    label: "Kensington",    parentCity: "london" },
      { slug: "chelsea",       label: "Chelsea",       parentCity: "london" },
      { slug: "canary-wharf",  label: "Canary Wharf",  parentCity: "london" },
      { slug: "soho",          label: "Soho",          parentCity: "london" },
      { slug: "shoreditch",    label: "Shoreditch",    parentCity: "london" },
      { slug: "westminster",   label: "Westminster",   parentCity: "london" },
      { slug: "hillingdon",    label: "Hillingdon",    parentCity: "london" },
      { slug: "hayes",         label: "Hayes",         parentCity: "london" },
    ],
  },
  {
    slug: "manchester", label: "Manchester", labelZh: "曼彻斯特", country: "UK",
    seoTitle: "Private Sensual Massage in Manchester",
    seoTitleZh: "曼彻斯特情趣按摩与私密放松",
    seoIntro: "Verified massage providers in Manchester city centre with in-platform chat, video introductions and safe booking tools.",
    seoIntroZh: "曼彻斯特市中心已认证的按摩服务者 — 站内聊天、视频介绍与安全预约。",
    areas: [
      { slug: "city-centre", label: "City Centre", parentCity: "manchester" },
      { slug: "deansgate",   label: "Deansgate",   parentCity: "manchester" },
      { slug: "salford",     label: "Salford",     parentCity: "manchester" },
    ],
  },
  {
    slug: "birmingham", label: "Birmingham", labelZh: "伯明翰", country: "UK",
    seoTitle: "Private Sensual Massage in Birmingham",
    seoTitleZh: "伯明翰情趣按摩与私密放松",
    seoIntro: "Verified 18+ massage providers across Birmingham with language filters, verification badges and secure in-platform contact.",
    seoIntroZh: "伯明翰的 18+ 认证按摩服务者 — 支持语言筛选、认证徽章与站内安全沟通。",
    areas: [
      { slug: "city-centre", label: "City Centre", parentCity: "birmingham" },
      { slug: "jewellery",   label: "Jewellery Quarter", parentCity: "birmingham" },
    ],
  },
  {
    slug: "liverpool", label: "Liverpool", labelZh: "利物浦", country: "UK",
    seoTitle: "Private Sensual Massage in Liverpool",
    seoTitleZh: "利物浦情趣按摩与私密放松",
    seoIntro: "Verified providers in Liverpool with clear service styles, video-first profiles and safe communication.",
    seoIntroZh: "利物浦的认证服务者 — 清晰的服务风格、视频优先的资料与安全沟通工具。",
    areas: [
      { slug: "city-centre", label: "City Centre", parentCity: "liverpool" },
    ],
  },
  {
    slug: "leeds", label: "Leeds", labelZh: "利兹", country: "UK",
    seoTitle: "Private Sensual Massage in Leeds",
    seoTitleZh: "利兹情趣按摩与私密放松",
    seoIntro: "Verified 18+ providers in Leeds with in-platform chat, video introductions and secure booking.",
    seoIntroZh: "利兹的 18+ 认证服务者 — 站内聊天、视频介绍与安全预约。",
    areas: [
      { slug: "city-centre", label: "City Centre", parentCity: "leeds" },
    ],
  },
  {
    slug: "bristol", label: "Bristol", labelZh: "布里斯托", country: "UK",
    seoTitle: "Private Sensual Massage in Bristol",
    seoTitleZh: "布里斯托情趣按摩与私密放松",
    seoIntro: "Verified providers in Bristol with language filters, video introductions and privacy-first chat.",
    seoIntroZh: "布里斯托的认证服务者 — 支持语言筛选、视频介绍与隐私优先聊天。",
    areas: [{ slug: "city-centre", label: "City Centre", parentCity: "bristol" }],
  },
  {
    slug: "glasgow", label: "Glasgow", labelZh: "格拉斯哥", country: "UK",
    seoTitle: "Private Sensual Massage in Glasgow",
    seoTitleZh: "格拉斯哥情趣按摩与私密放松",
    seoIntro: "Verified 18+ providers in Glasgow, with clear service styles and safe booking tools.",
    seoIntroZh: "格拉斯哥的 18+ 认证服务者 — 清晰服务风格与安全预约工具。",
    areas: [{ slug: "city-centre", label: "City Centre", parentCity: "glasgow" }],
  },
  {
    slug: "edinburgh", label: "Edinburgh", labelZh: "爱丁堡", country: "UK",
    seoTitle: "Private Sensual Massage in Edinburgh",
    seoTitleZh: "爱丁堡情趣按摩与私密放松",
    seoIntro: "Verified providers in Edinburgh with language filters and privacy-first communication.",
    seoIntroZh: "爱丁堡的认证服务者 — 支持语言筛选与隐私优先沟通。",
    areas: [{ slug: "city-centre", label: "City Centre", parentCity: "edinburgh" }],
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getArea(city: string, area: string): Area | undefined {
  return getCity(city)?.areas.find((a) => a.slug === area);
}

// ══════════════════════════════════════
// Providers (20+ mock data)
// ══════════════════════════════════════

function galleryOf(seed: number, n = 8): string[] {
  const arr: string[] = [];
  for (let i = 0; i < n; i++) arr.push(pick(i * 2 + 3, seed + 11) ?? "");
  return arr.filter(Boolean);
}

export const providers: MassageProvider[] = [
  // ═════ London ═════
  {
    id: "mp001", slug: "mira-mayfair",
    displayName: "Mira", age: 26,
    city: "london", cityLabel: "London", area: "mayfair", areaLabel: "Mayfair", country: "UK",
    languages: ["Chinese", "English"], tags: ["asian", "chinese"],
    avatar: pick(2, 5) ?? "", coverImage: pick(3, 7) ?? "", gallery: galleryOf(5),
    bio: "温柔、安静、注重边界感的私密放松体验。适合希望在忙碌工作后获得轻松、舒适和高质量沟通的成熟用户。所有沟通请通过站内进行。",
    serviceStyles: ["aromatherapy", "wellness-companion", "conversation", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 180, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 8 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.92, reviewCount: 148, followers: 3200, gifts: 620, vip: true, featured: true,
    memberSince: "2024-05",
  },
  {
    id: "mp002", slug: "amelia-kensington",
    displayName: "Amelia", age: 28,
    city: "london", cityLabel: "London", area: "kensington", areaLabel: "Kensington", country: "UK",
    languages: ["English", "French"], tags: ["european"],
    avatar: pick(4, 9) ?? "", coverImage: pick(5, 11) ?? "", gallery: galleryOf(7),
    bio: "Quiet, thoughtful and boundary-aware wellness sessions. Ideal for professionals seeking recovery after long working days. All communication via the platform.",
    serviceStyles: ["deep-relaxation", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio"],
    priceFrom: 220, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 22 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.88, reviewCount: 92, followers: 2100, gifts: 380, featured: true,
    memberSince: "2024-08",
  },
  {
    id: "mp003", slug: "nina-chelsea",
    displayName: "Nina", age: 24,
    city: "london", cityLabel: "London", area: "chelsea", areaLabel: "Chelsea", country: "UK",
    languages: ["Thai", "English"], tags: ["thai", "asian"],
    avatar: pick(6, 13) ?? "", coverImage: pick(7, 15) ?? "", gallery: galleryOf(9),
    bio: "Warm, calm, and welcoming — traditional Thai relaxation techniques focused on tension release and comfortable pacing. Please contact only via in-app chat.",
    serviceStyles: ["aromatherapy", "swedish", "spa", "wellness-companion"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 160, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 6 },
    verification: { identity: true, phone: true, email: true, face: true, video: false, safeMeet: true },
    rating: 4.85, reviewCount: 76, followers: 1600, gifts: 240, featured: true,
    memberSince: "2024-11",
  },
  {
    id: "mp004", slug: "lin-canarywharf",
    displayName: "Lin", age: 27,
    city: "london", cityLabel: "London", area: "canary-wharf", areaLabel: "Canary Wharf", country: "UK",
    languages: ["Chinese", "English"], tags: ["asian", "chinese"],
    avatar: pick(8, 17) ?? "", coverImage: pick(9, 19) ?? "", gallery: galleryOf(11),
    bio: "适合商务旅客的私密放松体验。所有预约均通过站内完成,支持中英双语沟通,注重隐私与边界。",
    serviceStyles: ["deep-relaxation", "wellness-companion", "conversation"],
    appointmentTypes: ["hotel-visit", "studio"],
    priceFrom: 200, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 12 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.90, reviewCount: 118, followers: 2600, gifts: 460, vip: true, featured: true,
    memberSince: "2024-07",
  },
  {
    id: "mp005", slug: "sofia-soho",
    displayName: "Sofia", age: 29,
    city: "london", cityLabel: "London", area: "soho", areaLabel: "Soho", country: "UK",
    languages: ["English", "Italian"], tags: ["european"],
    avatar: pick(10, 21) ?? "", coverImage: pick(11, 23) ?? "", gallery: galleryOf(13),
    bio: "Central London studio focused on comfortable pacing and honest conversation. In-platform chat and video calls preferred before booking.",
    serviceStyles: ["swedish", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 180, currency: "£",
    availability: { online: true, availableToday: false, availableThisWeek: true, replyMinutes: 15 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.78, reviewCount: 54, followers: 1200, gifts: 180,
    memberSince: "2025-01",
  },
  {
    id: "mp006", slug: "yuki-shoreditch",
    displayName: "Yuki", age: 25,
    city: "london", cityLabel: "London", area: "shoreditch", areaLabel: "Shoreditch", country: "UK",
    languages: ["Japanese", "English"], tags: ["japanese", "asian"],
    avatar: pick(12, 25) ?? "", coverImage: pick(13, 27) ?? "", gallery: galleryOf(15),
    bio: "静かで丁寧なリラクゼーション体験。Quiet, careful relaxation sessions. In-app chat only — no off-platform contact.",
    serviceStyles: ["aromatherapy", "deep-relaxation", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio"],
    priceFrom: 220, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 30 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.94, reviewCount: 62, followers: 1800, gifts: 320, vip: true,
    memberSince: "2024-09",
  },
  {
    id: "mp007", slug: "hana-westminster",
    displayName: "Hana", age: 26,
    city: "london", cityLabel: "London", area: "westminster", areaLabel: "Westminster", country: "UK",
    languages: ["Korean", "English"], tags: ["korean", "asian"],
    avatar: pick(14, 29) ?? "", coverImage: pick(15, 31) ?? "", gallery: galleryOf(17),
    bio: "차분하고 프로페셔널한 웰니스 세션. Calm, professional wellness sessions for business travellers. Booking through the app only.",
    serviceStyles: ["swedish", "deep-relaxation", "spa", "wellness-companion"],
    appointmentTypes: ["hotel-visit", "studio"],
    priceFrom: 210, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 10 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.87, reviewCount: 88, followers: 2050, gifts: 300,
    memberSince: "2024-10",
  },
  {
    id: "mp008", slug: "clara-hillingdon",
    displayName: "Clara", age: 30,
    city: "london", cityLabel: "London", area: "hillingdon", areaLabel: "Hillingdon", country: "UK",
    languages: ["English", "Spanish"], tags: ["european", "mixed"],
    avatar: pick(16, 33) ?? "", coverImage: pick(17, 35) ?? "", gallery: galleryOf(19),
    bio: "West London studio catering to travellers connecting via Heathrow. Structured, honest, in-platform communication.",
    serviceStyles: ["swedish", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 150, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 40 },
    verification: { identity: true, phone: true, email: true, face: false, video: false, safeMeet: true },
    rating: 4.70, reviewCount: 42, followers: 780, gifts: 100,
    memberSince: "2025-02",
  },
  {
    id: "mp009", slug: "mai-hayes",
    displayName: "Mai", age: 24,
    city: "london", cityLabel: "London", area: "hayes", areaLabel: "Hayes", country: "UK",
    languages: ["Vietnamese", "English"], tags: ["vietnamese", "asian"],
    avatar: pick(18, 37) ?? "", coverImage: pick(19, 39) ?? "", gallery: galleryOf(21),
    bio: "Nhẹ nhàng, tôn trọng ranh giới. Warm and boundary-aware sessions. All arrangements through in-app chat.",
    serviceStyles: ["aromatherapy", "wellness-companion"],
    appointmentTypes: ["studio"],
    priceFrom: 140, currency: "£",
    availability: { online: true, availableToday: false, availableThisWeek: true, replyMinutes: 25 },
    verification: { identity: true, phone: true, email: true, face: true, video: false, safeMeet: true },
    rating: 4.75, reviewCount: 36, followers: 620, gifts: 90,
    memberSince: "2025-03",
  },
  {
    id: "mp010", slug: "isla-mayfair",
    displayName: "Isla", age: 27,
    city: "london", cityLabel: "London", area: "mayfair", areaLabel: "Mayfair", country: "UK",
    languages: ["English", "French"], tags: ["european"],
    avatar: pick(20, 41) ?? "", coverImage: pick(21, 43) ?? "", gallery: galleryOf(23),
    bio: "Independent Mayfair-based wellness companion. All bookings confirmed via video call. Discretion and boundaries are the baseline.",
    serviceStyles: ["deep-relaxation", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["hotel-visit", "studio"],
    priceFrom: 260, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 5 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.95, reviewCount: 210, followers: 4200, gifts: 890, vip: true, featured: true,
    memberSince: "2024-04",
  },
  // ═════ Manchester ═════
  {
    id: "mp011", slug: "grace-manchester-centre",
    displayName: "Grace", age: 26,
    city: "manchester", cityLabel: "Manchester", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English"], tags: ["european"],
    avatar: pick(22, 45) ?? "", coverImage: pick(23, 47) ?? "", gallery: galleryOf(25),
    bio: "Central Manchester studio near Deansgate. Focused on relaxed, honest sessions with clear boundaries.",
    serviceStyles: ["swedish", "spa", "wellness-companion"],
    appointmentTypes: ["studio"],
    priceFrom: 130, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 12 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.82, reviewCount: 68, followers: 1400, gifts: 180, featured: true,
    memberSince: "2024-12",
  },
  {
    id: "mp012", slug: "sara-deansgate",
    displayName: "Sara", age: 29,
    city: "manchester", cityLabel: "Manchester", area: "deansgate", areaLabel: "Deansgate", country: "UK",
    languages: ["English", "Portuguese"], tags: ["european"],
    avatar: pick(24, 49) ?? "", coverImage: pick(25, 51) ?? "", gallery: galleryOf(27),
    bio: "Warm, unhurried wellness sessions in central Manchester. In-platform communication only.",
    serviceStyles: ["deep-relaxation", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 150, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 35 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.80, reviewCount: 52, followers: 960, gifts: 140,
    memberSince: "2025-01",
  },
  {
    id: "mp013", slug: "linh-salford",
    displayName: "Linh", age: 25,
    city: "manchester", cityLabel: "Manchester", area: "salford", areaLabel: "Salford", country: "UK",
    languages: ["Vietnamese", "English"], tags: ["vietnamese", "asian"],
    avatar: pick(26, 53) ?? "", coverImage: pick(27, 55) ?? "", gallery: galleryOf(29),
    bio: "Careful, respectful wellness sessions with a calm pace. Ask about video introduction before booking.",
    serviceStyles: ["aromatherapy", "wellness-companion"],
    appointmentTypes: ["studio"],
    priceFrom: 120, currency: "£",
    availability: { online: true, availableToday: false, availableThisWeek: true, replyMinutes: 20 },
    verification: { identity: true, phone: true, email: true, face: false, video: false, safeMeet: true },
    rating: 4.72, reviewCount: 30, followers: 520, gifts: 60,
    memberSince: "2025-04",
  },
  // ═════ Birmingham ═════
  {
    id: "mp014", slug: "olivia-birmingham",
    displayName: "Olivia", age: 27,
    city: "birmingham", cityLabel: "Birmingham", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English"], tags: ["european"],
    avatar: pick(28, 57) ?? "", coverImage: pick(29, 59) ?? "", gallery: galleryOf(31),
    bio: "Central Birmingham studio with a focus on genuine, unhurried recovery. All arrangements through the app.",
    serviceStyles: ["swedish", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 140, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 10 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.86, reviewCount: 74, followers: 1520, gifts: 220, featured: true,
    memberSince: "2024-09",
  },
  {
    id: "mp015", slug: "elena-jewellery",
    displayName: "Elena", age: 30,
    city: "birmingham", cityLabel: "Birmingham", area: "jewellery", areaLabel: "Jewellery Quarter", country: "UK",
    languages: ["English", "Russian"], tags: ["european"],
    avatar: pick(30, 61) ?? "", coverImage: pick(31, 63) ?? "", gallery: galleryOf(33),
    bio: "Independent studio in the Jewellery Quarter. Boundaries and honest communication are baseline.",
    serviceStyles: ["deep-relaxation", "wellness-companion"],
    appointmentTypes: ["studio"],
    priceFrom: 160, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 45 },
    verification: { identity: true, phone: true, email: true, face: true, video: false, safeMeet: true },
    rating: 4.78, reviewCount: 48, followers: 880, gifts: 110,
    memberSince: "2024-12",
  },
  // ═════ Liverpool ═════
  {
    id: "mp016", slug: "chloe-liverpool",
    displayName: "Chloe", age: 26,
    city: "liverpool", cityLabel: "Liverpool", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English"], tags: ["european"],
    avatar: pick(32, 65) ?? "", coverImage: pick(33, 67) ?? "", gallery: galleryOf(35),
    bio: "Independent Liverpool wellness studio near the docks. Comfortable, honest sessions with clear boundaries.",
    serviceStyles: ["swedish", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 120, currency: "£",
    availability: { online: true, availableToday: false, availableThisWeek: true, replyMinutes: 18 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.75, reviewCount: 42, followers: 720, gifts: 95,
    memberSince: "2025-02",
  },
  // ═════ Leeds ═════
  {
    id: "mp017", slug: "kim-leeds",
    displayName: "Kim", age: 28,
    city: "leeds", cityLabel: "Leeds", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["Korean", "English"], tags: ["korean", "asian"],
    avatar: pick(34, 69) ?? "", coverImage: pick(35, 71) ?? "", gallery: galleryOf(37),
    bio: "차분한 웰니스 세션. Calm wellness sessions in central Leeds. Booking via in-app chat only.",
    serviceStyles: ["aromatherapy", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio"],
    priceFrom: 130, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 14 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.84, reviewCount: 58, followers: 1100, gifts: 160, featured: true,
    memberSince: "2024-11",
  },
  // ═════ Bristol ═════
  {
    id: "mp018", slug: "ava-bristol",
    displayName: "Ava", age: 27,
    city: "bristol", cityLabel: "Bristol", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English"], tags: ["european"],
    avatar: pick(36, 73) ?? "", coverImage: pick(37, 75) ?? "", gallery: galleryOf(39),
    bio: "Bristol independent studio focused on comfortable, unhurried wellness. In-platform chat preferred before booking.",
    serviceStyles: ["swedish", "spa", "wellness-companion"],
    appointmentTypes: ["studio"],
    priceFrom: 120, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 30 },
    verification: { identity: true, phone: true, email: true, face: true, video: false, safeMeet: true },
    rating: 4.70, reviewCount: 34, followers: 560, gifts: 70,
    memberSince: "2025-03",
  },
  // ═════ Glasgow ═════
  {
    id: "mp019", slug: "iris-glasgow",
    displayName: "Iris", age: 29,
    city: "glasgow", cityLabel: "Glasgow", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English"], tags: ["european"],
    avatar: pick(38, 77) ?? "", coverImage: pick(39, 79) ?? "", gallery: galleryOf(41),
    bio: "Central Glasgow studio with structured, clear communication. All bookings via the platform.",
    serviceStyles: ["deep-relaxation", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 130, currency: "£",
    availability: { online: true, availableToday: true, availableThisWeek: true, replyMinutes: 11 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.81, reviewCount: 46, followers: 820, gifts: 110,
    memberSince: "2024-10",
  },
  // ═════ Edinburgh ═════
  {
    id: "mp020", slug: "ruby-edinburgh",
    displayName: "Ruby", age: 28,
    city: "edinburgh", cityLabel: "Edinburgh", area: "city-centre", areaLabel: "City Centre", country: "UK",
    languages: ["English", "German"], tags: ["european"],
    avatar: pick(40, 81) ?? "", coverImage: pick(41, 83) ?? "", gallery: galleryOf(43),
    bio: "Independent Edinburgh studio. Comfortable pacing, honest conversation, in-platform booking.",
    serviceStyles: ["swedish", "spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio"],
    priceFrom: 140, currency: "£",
    availability: { online: false, availableToday: false, availableThisWeek: true, replyMinutes: 40 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.77, reviewCount: 50, followers: 900, gifts: 130,
    memberSince: "2024-12",
  },
  {
    id: "mp021", slug: "eva-mayfair",
    displayName: "Eva", age: 25,
    city: "london", cityLabel: "London", area: "mayfair", areaLabel: "Mayfair", country: "UK",
    languages: ["English", "Spanish"], tags: ["european"],
    avatar: pick(42, 85) ?? "", coverImage: pick(43, 87) ?? "", gallery: galleryOf(45),
    bio: "Warm, quiet Mayfair studio. All arrangements confirmed via chat and video before booking.",
    serviceStyles: ["spa", "wellness-companion", "video-intro"],
    appointmentTypes: ["studio", "hotel-visit"],
    priceFrom: 230, currency: "£",
    availability: { online: true, availableToday: false, availableThisWeek: true, replyMinutes: 16 },
    verification: { identity: true, phone: true, email: true, face: true, video: true, safeMeet: true },
    rating: 4.86, reviewCount: 82, followers: 1750, gifts: 260, featured: true,
    memberSince: "2024-08",
  },
];

// ══════════════════════════════════════
// Helpers
// ══════════════════════════════════════

export function getProvider(slug: string): MassageProvider | undefined {
  return providers.find((p) => p.slug === slug);
}

export interface ProviderFilter {
  city?: string;
  area?: string;
  verifiedOnly?: boolean;
  onlineOnly?: boolean;
  availableToday?: boolean;
  hasVideo?: boolean;
  vipOnly?: boolean;
  language?: string;
  tag?: ProviderTag;
  serviceStyle?: ServiceStyle;
  priceMax?: number;
}

export function listProviders(filter: ProviderFilter = {}): MassageProvider[] {
  return providers.filter((p) => {
    if (filter.city && p.city !== filter.city) return false;
    if (filter.area && p.area !== filter.area) return false;
    if (filter.verifiedOnly && !p.verification.identity) return false;
    if (filter.onlineOnly && !p.availability.online) return false;
    if (filter.availableToday && !p.availability.availableToday) return false;
    if (filter.hasVideo && !p.verification.video) return false;
    if (filter.vipOnly && !p.vip) return false;
    if (filter.language && !p.languages.some((l) => l.toLowerCase() === filter.language!.toLowerCase())) return false;
    if (filter.tag && !p.tags.includes(filter.tag)) return false;
    if (filter.serviceStyle && !p.serviceStyles.includes(filter.serviceStyle)) return false;
    if (filter.priceMax !== undefined && p.priceFrom > filter.priceMax) return false;
    return true;
  });
}

export type { SortKey } from "@/lib/massage-labels";
import type { SortKey } from "@/lib/massage-labels";

export function sortProviders(list: MassageProvider[], key: SortKey = "recommended"): MassageProvider[] {
  const arr = [...list];
  switch (key) {
    case "newest":       return arr.sort((a, b) => b.memberSince.localeCompare(a.memberSince));
    case "online-first": return arr.sort((a, b) => Number(b.availability.online) - Number(a.availability.online));
    case "top-rated":    return arr.sort((a, b) => b.rating - a.rating);
    case "fast-reply":   return arr.sort((a, b) => a.availability.replyMinutes - b.availability.replyMinutes);
    case "price-asc":    return arr.sort((a, b) => a.priceFrom - b.priceFrom);
    case "price-desc":   return arr.sort((a, b) => b.priceFrom - a.priceFrom);
    case "video-first":  return arr.sort((a, b) => Number(b.verification.video) - Number(a.verification.video));
    case "gifts":        return arr.sort((a, b) => b.gifts - a.gifts);
    default:             return arr.sort((a, b) =>
      (Number(!!b.featured) - Number(!!a.featured)) ||
      (Number(!!b.vip) - Number(!!a.vip)) ||
      (b.rating - a.rating)
    );
  }
}

export interface CityStats {
  total: number;
  online: number;
  verified: number;
  withVideo: number;
  availableToday: number;
}

export function getCityStats(citySlug: string): CityStats {
  const list = listProviders({ city: citySlug });
  return {
    total: list.length,
    online: list.filter((p) => p.availability.online).length,
    verified: list.filter((p) => p.verification.identity).length,
    withVideo: list.filter((p) => p.verification.video).length,
    availableToday: list.filter((p) => p.availability.availableToday).length,
  };
}

// ══════════════════════════════════════
// Creator-shape adapter — 让 CreatorFold / RightSidebar 等复用
// ══════════════════════════════════════

export function providerToCreator(p: MassageProvider): Creator {
  return {
    slug: p.slug,
    name: p.displayName,
    category: "Sensual Massage",
    specialty: p.serviceStyles.slice(0, 2).map((s) => SERVICE_STYLE_LABEL[s].en).join(" · "),
    region: `${p.cityLabel}${p.areaLabel ? ` · ${p.areaLabel}` : ""}`,
    price: `${p.currency} ${p.priceFrom}/hr`,
    tier: (p.vip ? "elite" : "pro") as Tier,
    subs: p.reviewCount.toString(),
    followers: p.followers >= 10000
      ? `${(p.followers / 10000).toFixed(1).replace(/\.0$/, "")}万`
      : p.followers.toLocaleString("en-US"),
    works: p.gallery.length.toString(),
  };
}
