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

// ══════════════════════════════════════
// Journal Post (full · for editor + preview)
// ══════════════════════════════════════

export type JournalBlockType = "paragraph" | "heading" | "quote" | "list" | "insight" | "checklist";

export interface CmsJournalBlock {
  type: JournalBlockType;
  text?: string;              // paragraph / heading / quote
  attribution?: string;       // quote
  items?: string[];           // list / checklist
  title?: string;             // insight / checklist
}

export interface CmsJournalCta {
  variant: string;            // browse-sugargirls · premium · credits · safety · ...
}

export interface CmsJournalPostFull {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  categorySlug: string;
  language: "zh" | "en";
  coverImage: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  popular: boolean;
  status: CmsStatus;
  body: CmsJournalBlock[];
  cta: string[];              // JournalCtaVariant strings
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    noindex?: boolean;
  };
  isNewPost?: boolean;        // true = created via admin (not in base seed)
}

export interface CmsJournalCreateInput {
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
  language: "zh" | "en";
  author: string;
  coverImage?: string;
  subtitle?: string;
  readingTime?: string;
  tags?: string[];
  body: CmsJournalBlock[];
  cta?: string[];
  featured?: boolean;
  popular?: boolean;
  status?: CmsStatus;
  seo?: CmsJournalPostFull["seo"];
}

// ══════════════════════════════════════
// Users (registered users management)
// ══════════════════════════════════════

export type UserRole = "user" | "creator" | "admin" | "editor" | "operator" | "reviewer" | "support" | "finance";
export type UserStatus = "active" | "suspended" | "banned";
export type MembershipTier = "free" | "premium" | "vip";

export interface CmsUserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
  membership: MembershipTier;
  city?: string;
  country?: string;
  walletBalance: number;
  followingCount: number;
  savedCount: number;
  giftsCount: number;
  bookingsCount: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CmsUserNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface CmsWalletTx {
  id: string;
  type: "top-up" | "spend" | "refund" | "admin-adjust";
  amount: number;
  memo?: string;
  createdAt: string;
}

export interface CmsUserDetail extends CmsUserRow {
  phone?: string;
  birthDate?: string;
  age?: number;
  gender?: string;
  languages?: string[];
  interests?: string[];
  bio?: string;
  preferredCities?: string[];
  datingPreferences?: string[];
  budgetRange?: [number, number];
  // wallet
  walletTransactions: CmsWalletTx[];
  walletTotalTopUp: number;
  walletTotalSpend: number;
  // application
  creatorApplication?: {
    id: string;
    slug: string;
    status: string;
    submittedAt?: string;
    profileType?: string;
    completion?: number;
  };
  // membership
  membershipStatus: {
    tier: MembershipTier;
    startedAt?: string;
    expiresAt?: string;
    autoRenew: boolean;
  };
  // relations (may be empty)
  following: Array<{ slug: string; name: string; type: string; city?: string; followedAt: string }>;
  saved: Array<{ id: string; type: string; title: string; savedAt: string }>;
  gifts: Array<{ id: string; creatorSlug: string; giftType: string; amount: number; createdAt: string }>;
  bookings: Array<{ id: string; creatorSlug: string; serviceType: string; date?: string; status: string; price?: number }>;
  chats: Array<{ conversationId: string; creatorSlug: string; creatorName: string; lastMessage?: string; unreadCount: number; updatedAt?: string; reportCount: number }>;
  notes: CmsUserNote[];
  // moderation
  reportsAgainst: number;
  reportsBy: number;
  suspendedAt?: string;
  suspensionReason?: string;
}
