// CMS 类型定义 · client-safe · 与 lib/mock-db、journal-data、massage-data 等对接

// ══════════════════════════════════════
// 通用
// ══════════════════════════════════════

export type CmsStatus = "draft" | "published" | "archived" | "scheduled";
export type ApplicationStatus = "draft" | "submitted" | "reviewing" | "needs_changes" | "approved" | "rejected";
export type MediaStatus = "pending" | "approved" | "rejected" | "hidden";
export type ProfileType = "sugargirl" | "sugarboy" | "massage";

// ══════════════════════════════════════
// Home Content (首页运营内容)
// ══════════════════════════════════════

export interface CmsHeroBlock {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  chips: string[];
}

export interface CmsChannelCard {
  key: string;
  enabled: boolean;
  title: string;
  description: string;
  href: string;
  coverImage?: string;
  sort: number;
}

export interface CmsFaqItem { question: string; answer: string; enabled: boolean }

export interface CmsHomeContent {
  hero: CmsHeroBlock;
  channels: CmsChannelCard[];
  featuredCreatorIds: string[];   // 手动置顶 (为空则自动)
  faq: CmsFaqItem[];
  bottomCta: { enabled: boolean; title: string; subtitle: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  updatedAt: string;
  updatedBy?: string;
}

// ══════════════════════════════════════
// Dashboard metrics
// ══════════════════════════════════════

export interface CmsDashboardMetrics {
  today: {
    newUsers: number;
    newApplications: number;
    newCreators: number;
    newChats: number;
    creditsSpent: number;
    newReports: number;
    pendingMedia: number;
  };
  overview: {
    sugargirls: number;
    sugarboys: number;
    massageProviders: number;
    journalPosts: number;
    cityPages: number;
    premiumMembers: number;
    creditsTransactions: number;
  };
  pending: {
    applications: number;
    media: number;
    reports: number;
    missingTranslations: number;
    missingMetadata: number;
  };
}

// ══════════════════════════════════════
// Creators (unified — sugargirl / sugarboy / massage)
// ══════════════════════════════════════

export interface CmsCreatorRow {
  id: string;
  slug: string;
  displayName: string;
  type: ProfileType;
  avatar?: string;
  city?: string;
  country?: string;
  online?: boolean;
  verified?: boolean;
  featured?: boolean;
  vip?: boolean;
  mediaCount: number;
  languages: string[];
  status: "active" | "hidden" | "suspended";
  createdAt: string;
}

// ══════════════════════════════════════
// Applications (creator onboarding)
// ══════════════════════════════════════

export interface CmsApplicationRow {
  id: string;
  userId?: string;
  applicantName: string;
  applicantEmail: string;
  type: ProfileType;
  city?: string;
  country?: string;
  languages: string[];
  completion: number;      // 0–100
  status: ApplicationStatus;
  mediaCount: number;
  submittedAt?: string;
  reviewNotes?: string;
}

// ══════════════════════════════════════
// Journal
// ══════════════════════════════════════

export interface CmsJournalPostRow {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryTitle: string;
  status: CmsStatus;
  featured?: boolean;
  popular?: boolean;
  publishedAt?: string;
  updatedAt: string;
  readingTime: string;
  language: "zh" | "en";
  wordCount: number;
}

// ══════════════════════════════════════
// Media Library
// ══════════════════════════════════════

export interface CmsMediaItem {
  id: string;
  kind: "image" | "video";
  src: string;
  thumbnail?: string;
  previewSrc?: string;
  ownerType?: "creator" | "journal" | "home" | "custom-service";
  ownerId?: string;
  alt?: string;
  status: MediaStatus;
  isLocked?: boolean;
  price?: number;
  unlockType?: "coins";
  unlockCount?: number;
  revenue?: number;
  createdAt: string;
  size?: number;    // bytes
  width?: number;
  height?: number;
}

// ══════════════════════════════════════
// Custom Service Requests
// ══════════════════════════════════════

export type CustomRequestStatus = "new" | "reviewing" | "matched" | "contacted" | "completed" | "cancelled";

export interface CmsCustomRequestRow {
  id: string;
  applicantName: string;
  applicantEmail: string;
  eventTypes: string[];
  city?: string;
  date?: string;
  budgetRange?: string;
  status: CustomRequestStatus;
  createdAt: string;
  assignedTo?: string;
  matchedCreatorIds?: string[];
  notes?: string;
}

// ══════════════════════════════════════
// Settings / Feature Flags
// ══════════════════════════════════════

export interface CmsSettings {
  siteName: string;
  defaultLocale: string;
  supportedLocales: string[];
  maintenanceMode: boolean;
  flags: {
    registrationEnabled: boolean;
    creatorApplicationEnabled: boolean;
    chatEnabled: boolean;
    lockedMediaEnabled: boolean;
    creditsEnabled: boolean;
    massageChannelEnabled: boolean;
    sugarboyChannelEnabled: boolean;
    journalEnabled: boolean;
    customServicesEnabled: boolean;
  };
  updatedAt: string;
}

// ══════════════════════════════════════
// Audit Log
// ══════════════════════════════════════

export type AuditAction =
  | "create" | "update" | "delete"
  | "publish" | "unpublish"
  | "approve" | "reject" | "suspend" | "restore"
  | "settings.update" | "login" | "logout";

export interface CmsAuditEntry {
  id: string;
  actorId: string;
  actorEmail: string;
  action: AuditAction;
  targetType: string;    // "creator" | "application" | "journal" | "media" | "settings" | ...
  targetId?: string;
  summary: string;       // 一句人类可读描述
  createdAt: string;
  ip?: string;
}
