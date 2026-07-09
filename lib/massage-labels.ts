// Client-safe labels + types for massage components
// 独立于 massage-data.ts (后者依赖 node:fs 通过 lib/images) — 让 client bundle 不引 fs

export type ServiceStyle =
  | "aromatherapy" | "swedish" | "deep-relaxation" | "spa"
  | "wellness-companion" | "conversation" | "video-intro"
  | "private-booking" | "travel-companion";

export type AppointmentType = "incall" | "outcall" | "hotel-visit" | "studio" | "travel";

export type ProviderTag =
  | "asian" | "thai" | "filipina" | "vietnamese" | "chinese"
  | "japanese" | "korean" | "european" | "mixed";

export const SERVICE_STYLE_LABEL: Record<ServiceStyle, { en: string; zh: string }> = {
  "aromatherapy":       { en: "Aromatherapy Relaxation", zh: "香薰按摩" },
  "swedish":            { en: "Swedish Relaxation",       zh: "瑞典式放松" },
  "deep-relaxation":    { en: "Deep Relaxation",           zh: "深层放松" },
  "spa":                { en: "SPA Wellness",              zh: "SPA 放松" },
  "wellness-companion": { en: "Wellness Companion",        zh: "陪伴放松" },
  "conversation":       { en: "Private Conversation",      zh: "私密聊天" },
  "video-intro":        { en: "Video Introduction",        zh: "视频介绍" },
  "private-booking":    { en: "Private Booking",           zh: "私密预约" },
  "travel-companion":   { en: "Travel Companion",          zh: "旅行陪伴" },
};

export const APPOINTMENT_LABEL: Record<AppointmentType, { en: string; zh: string }> = {
  "incall":       { en: "Studio / Incall",     zh: "到店" },
  "outcall":      { en: "Outcall",              zh: "上门" },
  "hotel-visit":  { en: "Hotel Appointment",    zh: "酒店预约" },
  "studio":       { en: "Studio",               zh: "工作室" },
  "travel":       { en: "Travel Companion",     zh: "旅行陪伴" },
};

// City list (client-safe · 不含 provider 数据) — 供 SearchPanel / dropdown 使用
export interface CityBrief { slug: string; label: string; labelZh: string }
export const CITY_LIST: CityBrief[] = [
  { slug: "london",     label: "London",     labelZh: "伦敦" },
  { slug: "manchester", label: "Manchester", labelZh: "曼彻斯特" },
  { slug: "birmingham", label: "Birmingham", labelZh: "伯明翰" },
  { slug: "liverpool",  label: "Liverpool",  labelZh: "利物浦" },
  { slug: "leeds",      label: "Leeds",      labelZh: "利兹" },
  { slug: "bristol",    label: "Bristol",    labelZh: "布里斯托" },
  { slug: "glasgow",    label: "Glasgow",    labelZh: "格拉斯哥" },
  { slug: "edinburgh",  label: "Edinburgh",  labelZh: "爱丁堡" },
];

// Client-safe types (fully erased at compile time)
export type SortKey = "recommended" | "newest" | "online-first" | "top-rated" | "fast-reply" | "price-asc" | "price-desc" | "video-first" | "gifts";

export interface Verification {
  identity: boolean; phone: boolean; email: boolean;
  face: boolean; video: boolean; safeMeet: boolean;
}
export interface Availability {
  online: boolean; availableToday: boolean; availableThisWeek: boolean; replyMinutes: number;
}
export interface MassageProvider {
  id: string; slug: string; displayName: string; age: number;
  city: string; cityLabel: string; area?: string; areaLabel?: string; country: string;
  languages: string[]; tags: ProviderTag[];
  avatar: string; coverImage: string; coverVideo?: string; gallery: string[];
  bio: string;
  serviceStyles: ServiceStyle[]; appointmentTypes: AppointmentType[];
  priceFrom: number; currency: string;
  availability: Availability; verification: Verification;
  rating: number; reviewCount: number; followers: number; gifts: number;
  vip?: boolean; featured?: boolean; memberSince: string;
}
