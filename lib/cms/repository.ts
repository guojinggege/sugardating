// CMS Repository · 统一数据抽象层
// 当前:mock impl · 从既有 sugarGirls / sugarBoys / providers / journalPosts /
// custom-request-store / mock-db 组合读取,少量运营字段 (home content / settings)
// 走 globalThis-backed in-memory,支持后台编辑保存到内存 (dev 可持久 · prod
// 需接真实 DB — 后台 UI 会显示 Demo Mode 提示)
import { randomBytes } from "node:crypto";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { sugarBoys } from "@/lib/sugarBoyMock";
import { providers as massageProviders } from "@/lib/massage-data";
import { journalPosts, journalCategories, type JournalPost } from "@/lib/journal-data";
import { pick } from "@/lib/images";
import type {
  CmsDashboardMetrics, CmsCreatorRow, CmsApplicationRow,
  CmsJournalPostRow, CmsJournalPostFull, CmsJournalCreateInput,
  CmsMediaItem, CmsCustomRequestRow,
  CmsHomeContent, CmsSettings, CmsStatus,
  CmsUserRow, CmsUserDetail, CmsUserNote, CmsWalletTx,
} from "./types";

// ══════════════════════════════════════
// Home Content (runtime editable · in-memory)
// ══════════════════════════════════════

const defaultHomeContent = (): CmsHomeContent => ({
  hero: {
    enabled: true,
    eyebrow: "Premium Social Dating · Since 2024",
    title: "进入一个更高质量的私密社交世界",
    subtitle: "在 Sugardating,你可以浏览已认证的 Sugargirls、Sugarboys 与高端服务者。",
    primaryCta: { label: "浏览 Sugargirls", href: "/male-artists" },
    secondaryCta: { label: "探索 Sugarboy", href: "/sugarboy" },
    chips: ["Sugargirl", "Sugarboy", "情趣按摩", "定制服务", "Sugardating Journal"],
  },
  channels: [
    { key: "sugargirl", enabled: true, title: "Sugargirl",   description: "浏览已认证的高质量女性 Creator",     href: "/male-artists", sort: 1 },
    { key: "sugarboy",  enabled: true, title: "Sugarboy",    description: "高端男性 Creator · Companion",         href: "/sugarboy",     sort: 2 },
    { key: "massage",   enabled: true, title: "情趣按摩",     description: "18+ 高端私密按摩与放松体验",           href: "/massage",       sort: 3 },
    { key: "events",    enabled: true, title: "高端活动定制", description: "游艇派对、酒会、私拍、商务伴游、俱乐部之夜", href: "/art-services", sort: 4 },
    { key: "journal",   enabled: true, title: "Sugardating Journal", description: "高端男性关系与伦敦生活方式指南", href: "/community",  sort: 5 },
  ],
  featuredCreatorIds: [],
  faq: [
    { question: "Sugardating 是什么?", answer: "面向 18+ 成年用户的高端私密社交与 Creator 平台。", enabled: true },
    { question: "聊天是否需要金币?", answer: "不需要。已登录用户可直接开启聊天。", enabled: true },
    { question: "什么内容需要 Credits 解锁?", answer: "部分私密照片、高清视频与 VIP 内容。", enabled: true },
  ],
  bottomCta: {
    enabled: true,
    title: "开始你的高端私密社交体验",
    subtitle: "浏览已认证的高质量 profiles · 使用私密聊天与视频确认",
    primary:   { label: "注册领 30 Credits", href: "/register" },
    secondary: { label: "先浏览资料",         href: "/male-artists" },
  },
  updatedAt: new Date().toISOString(),
});

// ══════════════════════════════════════
// Settings (runtime editable)
// ══════════════════════════════════════

const defaultSettings = (): CmsSettings => ({
  siteName: "Sugardating",
  defaultLocale: "zh",
  supportedLocales: ["zh", "en", "th", "vi", "fil"],
  maintenanceMode: false,
  flags: {
    registrationEnabled: true,
    creatorApplicationEnabled: true,
    chatEnabled: true,
    lockedMediaEnabled: true,
    creditsEnabled: true,
    massageChannelEnabled: true,
    sugarboyChannelEnabled: true,
    journalEnabled: true,
    customServicesEnabled: true,
  },
  updatedAt: new Date().toISOString(),
});

declare global {
  // eslint-disable-next-line no-var
  var __sgCmsHome: CmsHomeContent | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsSettings: CmsSettings | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsMedia: CmsMediaItem[] | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsJournalOverride: Map<string, Partial<CmsJournalPostFull>> | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsJournalNew: Map<string, CmsJournalPostFull> | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsUserNotes: Map<string, Array<{ id: string; text: string; author: string; createdAt: string }>> | undefined;
  // eslint-disable-next-line no-var
  var __sgCmsUserStatus: Map<string, { status: "active" | "suspended" | "banned"; suspendedAt?: string; suspensionReason?: string }> | undefined;
}
const homeStore = globalThis.__sgCmsHome ?? defaultHomeContent();
globalThis.__sgCmsHome = homeStore;
const settingsStore = globalThis.__sgCmsSettings ?? defaultSettings();
globalThis.__sgCmsSettings = settingsStore;
const journalOverrides = globalThis.__sgCmsJournalOverride ?? new Map<string, Partial<CmsJournalPostFull>>();
globalThis.__sgCmsJournalOverride = journalOverrides;
const journalNewPosts = globalThis.__sgCmsJournalNew ?? new Map<string, CmsJournalPostFull>();
globalThis.__sgCmsJournalNew = journalNewPosts;
const userNotes = globalThis.__sgCmsUserNotes ?? new Map<string, Array<{ id: string; text: string; author: string; createdAt: string }>>();
globalThis.__sgCmsUserNotes = userNotes;
const userStatus = globalThis.__sgCmsUserStatus ?? new Map<string, { status: "active" | "suspended" | "banned"; suspendedAt?: string; suspensionReason?: string }>();
globalThis.__sgCmsUserStatus = userStatus;

// ══════════════════════════════════════
// Media (seed from creator galleries)
// ══════════════════════════════════════

function seedMedia(): CmsMediaItem[] {
  const items: CmsMediaItem[] = [];
  // 12 image samples from creator galleries
  for (let i = 0; i < 12; i++) {
    items.push({
      id: `m_${i.toString().padStart(3, "0")}`,
      kind: "image",
      src: pick(i * 2, 100 + i) ?? "/images/placeholder.png",
      ownerType: "creator",
      ownerId: sugarGirls[i % sugarGirls.length]?.id,
      alt: `Creator gallery ${i + 1}`,
      status: i % 4 === 0 ? "pending" : "approved",
      isLocked: i % 3 === 2,
      price: i % 3 === 2 ? [8, 12, 16, 20][i % 4] : undefined,
      unlockType: i % 3 === 2 ? "coins" : undefined,
      unlockCount: i % 3 === 2 ? Math.floor(Math.random() * 40) : undefined,
      revenue: i % 3 === 2 ? Math.floor(Math.random() * 400) : undefined,
      createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
    });
  }
  return items;
}
const mediaStore = globalThis.__sgCmsMedia ?? seedMedia();
globalThis.__sgCmsMedia = mediaStore;

// ══════════════════════════════════════
// Sample applications (for demo · reflects apply wizard drafts)
// ══════════════════════════════════════

function sampleApplications(): CmsApplicationRow[] {
  return [
    { id: "app_001", applicantName: "Aria Chen",      applicantEmail: "aria@demo.io",    type: "sugargirl", city: "London",     country: "UK", languages: ["中文", "English"],       completion: 92, status: "submitted",     mediaCount: 8, submittedAt: new Date(Date.now() - 3600_000).toISOString() },
    { id: "app_002", applicantName: "Leo Alaric",     applicantEmail: "leo@demo.io",     type: "sugarboy",  city: "London",     country: "UK", languages: ["English"],                 completion: 88, status: "reviewing",     mediaCount: 6, submittedAt: new Date(Date.now() - 10800_000).toISOString() },
    { id: "app_003", applicantName: "Mira Wei",       applicantEmail: "mira@demo.io",    type: "massage",   city: "Manchester", country: "UK", languages: ["中文", "English"],       completion: 76, status: "needs_changes", mediaCount: 4, submittedAt: new Date(Date.now() - 86400_000).toISOString(), reviewNotes: "需要补充视频认证" },
    { id: "app_004", applicantName: "Sofia Reyes",    applicantEmail: "sofia@demo.io",   type: "sugargirl", city: "Birmingham", country: "UK", languages: ["English", "Español"],   completion: 100, status: "approved",    mediaCount: 12, submittedAt: new Date(Date.now() - 3 * 86400_000).toISOString() },
    { id: "app_005", applicantName: "Yuki Tanaka",    applicantEmail: "yuki@demo.io",    type: "sugargirl", city: "London",     country: "UK", languages: ["日本語", "English"],    completion: 45, status: "draft",         mediaCount: 2 },
    { id: "app_006", applicantName: "Marcus O'Neal",  applicantEmail: "marcus@demo.io",  type: "sugarboy",  city: "Edinburgh",  country: "UK", languages: ["English"],               completion: 100, status: "approved",    mediaCount: 10, submittedAt: new Date(Date.now() - 5 * 86400_000).toISOString() },
  ];
}
declare global {
  // eslint-disable-next-line no-var
  var __sgCmsApplications: CmsApplicationRow[] | undefined;
}
const appStore = globalThis.__sgCmsApplications ?? sampleApplications();
globalThis.__sgCmsApplications = appStore;

// ══════════════════════════════════════
// Repository interface
// ══════════════════════════════════════

export const cmsRepo = {
  // Dashboard
  getDashboardMetrics(): CmsDashboardMetrics {
    return {
      today: {
        newUsers: 24, newApplications: 6, newCreators: 3, newChats: 148,
        creditsSpent: 1240, newReports: 2, pendingMedia: mediaStore.filter((m) => m.status === "pending").length,
      },
      overview: {
        sugargirls: sugarGirls.length,
        sugarboys: sugarBoys.length,
        massageProviders: massageProviders.length,
        journalPosts: journalPosts.length,
        cityPages: 8 + 12,   // 8 cities × ~12 london areas
        premiumMembers: 342,
        creditsTransactions: 1856,
      },
      pending: {
        applications: appStore.filter((a) => a.status === "submitted" || a.status === "reviewing").length,
        media: mediaStore.filter((m) => m.status === "pending").length,
        reports: 2,
        missingTranslations: 12,
        missingMetadata: 4,
      },
    };
  },

  // Home content
  getHomeContent(): CmsHomeContent { return homeStore; },
  updateHomeContent(patch: Partial<CmsHomeContent>, actor?: string): CmsHomeContent {
    Object.assign(homeStore, patch, { updatedAt: new Date().toISOString(), updatedBy: actor });
    return homeStore;
  },

  // Creators (union of all profile types)
  listCreators(filter?: { type?: "sugargirl" | "sugarboy" | "massage"; search?: string }): CmsCreatorRow[] {
    const rows: CmsCreatorRow[] = [];
    if (!filter?.type || filter.type === "sugargirl") {
      for (const s of sugarGirls) rows.push({
        id: s.id, slug: s.id, displayName: s.name, type: "sugargirl",
        avatar: s.cover, city: s.city, country: s.country, online: s.online,
        verified: s.tags.includes("Verified"), featured: !!s.featured, vip: s.tags.includes("VIP"),
        mediaCount: 12, languages: s.languages, status: "active",
        createdAt: s.createdAt,
      });
    }
    if (!filter?.type || filter.type === "sugarboy") {
      for (const s of sugarBoys) rows.push({
        id: s.id, slug: s.id, displayName: s.name, type: "sugarboy",
        avatar: s.cover, city: s.city, country: s.country, online: s.online,
        verified: s.tags.includes("Verified"), featured: !!s.featured, vip: s.tags.includes("VIP"),
        mediaCount: 10, languages: s.languages, status: "active",
        createdAt: s.createdAt,
      });
    }
    if (!filter?.type || filter.type === "massage") {
      for (const p of massageProviders) rows.push({
        id: p.id, slug: p.slug, displayName: p.displayName, type: "massage",
        avatar: p.avatar, city: p.cityLabel, country: p.country, online: p.availability.online,
        verified: p.verification.identity, featured: !!p.featured, vip: !!p.vip,
        mediaCount: p.gallery.length, languages: p.languages, status: "active",
        createdAt: `${p.memberSince}-01T00:00:00Z`,
      });
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      return rows.filter((r) => r.displayName.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q));
    }
    return rows;
  },

  // Applications
  listApplications(status?: string): CmsApplicationRow[] {
    return status ? appStore.filter((a) => a.status === status) : appStore;
  },
  getApplication(id: string): CmsApplicationRow | undefined {
    return appStore.find((a) => a.id === id);
  },
  updateApplication(id: string, patch: Partial<CmsApplicationRow>): CmsApplicationRow | null {
    const idx = appStore.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    appStore[idx] = { ...appStore[idx], ...patch };
    return appStore[idx];
  },

  // Journal ═════════════════════════════════════════════════
  listJournalPosts(): CmsJournalPostRow[] {
    const rows: CmsJournalPostRow[] = [];
    // Base seed posts (with overrides applied)
    for (const p of journalPosts) {
      const o = journalOverrides.get(p.slug);
      rows.push({
        id: p.id, slug: p.slug,
        title: o?.title ?? p.title,
        categorySlug: o?.categorySlug ?? p.categorySlug,
        categoryTitle: journalCategories.find((c) => c.slug === (o?.categorySlug ?? p.categorySlug))?.title ?? p.categorySlug,
        status: (o?.status ?? "published") as CmsStatus,
        featured: o?.featured ?? !!p.featured,
        popular: o?.popular ?? !!p.popular,
        publishedAt: o?.publishedAt ?? p.publishedAt,
        updatedAt: o?.updatedAt ?? p.updatedAt ?? p.publishedAt,
        readingTime: o?.readingTime ?? p.readingTime,
        language: o?.language ?? p.language,
        wordCount: (o?.body ?? p.body).reduce((s: number, b: any) => s + (b.text?.length ?? (b.items?.join("").length ?? 0)), 0),
      });
    }
    // Admin-created new posts
    for (const p of journalNewPosts.values()) {
      rows.push({
        id: p.id, slug: p.slug, title: p.title,
        categorySlug: p.categorySlug,
        categoryTitle: journalCategories.find((c) => c.slug === p.categorySlug)?.title ?? p.categorySlug,
        status: p.status,
        featured: p.featured, popular: p.popular,
        publishedAt: p.publishedAt, updatedAt: p.updatedAt ?? p.publishedAt,
        readingTime: p.readingTime, language: p.language,
        wordCount: p.body.reduce((s, b) => s + (b.text?.length ?? (b.items?.join("").length ?? 0)), 0),
      });
    }
    return rows.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  },

  getJournalPost(slug: string): CmsJournalPostFull | null {
    // Prefer new post over base+override
    const newPost = journalNewPosts.get(slug);
    if (newPost) return newPost;
    const base = journalPosts.find((p) => p.slug === slug);
    if (!base) return null;
    const o = journalOverrides.get(slug) ?? {};
    return {
      id: base.id,
      slug: base.slug,
      title: o.title ?? base.title,
      subtitle: o.subtitle ?? base.subtitle,
      excerpt: o.excerpt ?? base.excerpt,
      categorySlug: o.categorySlug ?? base.categorySlug,
      language: (o.language ?? base.language) as "zh" | "en",
      coverImage: o.coverImage ?? base.coverImage,
      author: o.author ?? base.author,
      publishedAt: o.publishedAt ?? base.publishedAt,
      updatedAt: o.updatedAt ?? base.updatedAt,
      readingTime: o.readingTime ?? base.readingTime,
      tags: o.tags ?? base.tags,
      featured: o.featured ?? !!base.featured,
      popular: o.popular ?? !!base.popular,
      status: (o.status ?? "published") as CmsStatus,
      body: (o.body ?? base.body) as any,
      cta: (o.cta ?? base.cta) as string[],
      seo: o.seo,
    };
  },

  createJournalPost(input: CmsJournalCreateInput, actorEmail?: string): CmsJournalPostFull {
    const slug = input.slug.trim() || `p_${randomBytes(4).toString("hex")}`;
    // Collision guard: don't overwrite base post
    if (journalPosts.some((p) => p.slug === slug) || journalNewPosts.has(slug)) {
      throw new Error("SLUG_TAKEN");
    }
    const now = new Date().toISOString();
    const post: CmsJournalPostFull = {
      id: `n_${randomBytes(4).toString("hex")}`,
      slug,
      title: input.title,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      categorySlug: input.categorySlug,
      language: input.language,
      coverImage: input.coverImage || (pick(0, Math.floor(Math.random() * 100)) ?? "/images/placeholder.png"),
      author: input.author || (actorEmail ?? "Sugardating Editorial"),
      publishedAt: input.status === "published" ? now : now,
      updatedAt: now,
      readingTime: input.readingTime || "5 min read",
      tags: input.tags || [],
      featured: !!input.featured,
      popular: !!input.popular,
      status: input.status ?? "draft",
      body: input.body,
      cta: input.cta || [],
      seo: input.seo,
      isNewPost: true,
    };
    journalNewPosts.set(slug, post);
    return post;
  },

  updateJournalPost(slug: string, patch: Partial<CmsJournalPostFull>): CmsJournalPostFull | null {
    const now = new Date().toISOString();
    if (journalNewPosts.has(slug)) {
      const cur = journalNewPosts.get(slug)!;
      const updated = { ...cur, ...patch, slug, updatedAt: now };
      if (patch.status === "published" && !cur.publishedAt) updated.publishedAt = now;
      journalNewPosts.set(slug, updated);
      return updated;
    }
    const base = journalPosts.find((p) => p.slug === slug);
    if (!base) return null;
    const cur = journalOverrides.get(slug) ?? {};
    const next: Partial<CmsJournalPostFull> = { ...cur, ...patch, updatedAt: now };
    if (patch.status === "published" && !next.publishedAt) next.publishedAt = now;
    journalOverrides.set(slug, next);
    return this.getJournalPost(slug);
  },

  deleteJournalPost(slug: string): boolean {
    // Delete admin-created posts fully; base posts get archived override
    if (journalNewPosts.has(slug)) {
      journalNewPosts.delete(slug);
      return true;
    }
    if (journalPosts.some((p) => p.slug === slug)) {
      const cur = journalOverrides.get(slug) ?? {};
      journalOverrides.set(slug, { ...cur, status: "archived", updatedAt: new Date().toISOString() });
      return true;
    }
    return false;
  },

  toggleJournalPublish(slug: string): CmsJournalPostRow | null {
    const post = this.getJournalPost(slug);
    if (!post) return null;
    const nextStatus: CmsStatus = post.status === "published" ? "draft" : "published";
    this.updateJournalPost(slug, { status: nextStatus });
    return this.listJournalPosts().find((p) => p.slug === slug) ?? null;
  },
  toggleJournalFeatured(slug: string): CmsJournalPostRow | null {
    const post = this.getJournalPost(slug);
    if (!post) return null;
    this.updateJournalPost(slug, { featured: !post.featured });
    return this.listJournalPosts().find((p) => p.slug === slug) ?? null;
  },
  toggleJournalPopular(slug: string): CmsJournalPostRow | null {
    const post = this.getJournalPost(slug);
    if (!post) return null;
    this.updateJournalPost(slug, { popular: !post.popular });
    return this.listJournalPosts().find((p) => p.slug === slug) ?? null;
  },

  // Journal Categories ══════════════════════════════════════
  listCategories() {
    return journalCategories.map((c) => ({
      slug: c.slug,
      title: c.title,
      titleZh: c.titleZh,
      description: c.description,
      accent: c.accent,
      postCount: journalPosts.filter((p) => p.categorySlug === c.slug).length
        + Array.from(journalNewPosts.values()).filter((p) => p.categorySlug === c.slug).length,
    }));
  },

  // Media
  listMedia(filter?: { kind?: "image" | "video"; status?: string; locked?: boolean }): CmsMediaItem[] {
    return mediaStore.filter((m) => {
      if (filter?.kind && m.kind !== filter.kind) return false;
      if (filter?.status && m.status !== filter.status) return false;
      if (filter?.locked !== undefined && !!m.isLocked !== filter.locked) return false;
      return true;
    });
  },
  updateMedia(id: string, patch: Partial<CmsMediaItem>): CmsMediaItem | null {
    const idx = mediaStore.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    mediaStore[idx] = { ...mediaStore[idx], ...patch };
    return mediaStore[idx];
  },

  // Custom Service Requests — read from real store
  listCustomRequests(): CmsCustomRequestRow[] {
    // 从 custom-request-store 读 · 但不要 top-level import (server-only 循环风险)
    // 这里用 require 延迟加载
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const store: any = require("@/lib/custom-request-store");
    const raw: any[] = Array.from(((globalThis as any).__sgCustomRequests as Map<string, any>)?.values?.() ?? []);
    return raw.map((r) => ({
      id: r.id,
      applicantName: r.name,
      applicantEmail: r.email,
      eventTypes: r.eventTypes,
      city: r.city,
      date: r.date,
      budgetRange: r.budgetRange,
      status: "new" as const,
      createdAt: r.createdAt,
      notes: r.notes,
    }));
  },

  // Settings
  getSettings(): CmsSettings { return settingsStore; },
  updateSettings(patch: Partial<CmsSettings>): CmsSettings {
    Object.assign(settingsStore, patch, { updatedAt: new Date().toISOString() });
    if (patch.flags) settingsStore.flags = { ...settingsStore.flags, ...patch.flags };
    return settingsStore;
  },

  // Users ═════════════════════════════════════════════════
  async listUsers(filter?: { search?: string; role?: string; status?: string; limit?: number }) {
    // 延迟 import 防 client bundle 引 Prisma
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/db");
    const where: any = {};
    if (filter?.search) {
      where.OR = [
        { email: { contains: filter.search, mode: "insensitive" } },
        { name:  { contains: filter.search, mode: "insensitive" } },
      ];
    }
    if (filter?.role) where.role = filter.role;
    const users = await prisma.user.findMany({
      where,
      take: filter?.limit ?? 200,
      orderBy: { createdAt: "desc" },
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getWallet } = require("@/lib/wallet");
    return users.map((u: any) => {
      const st = userStatus.get(u.id);
      const filtered_status: UserStatusType = st?.status ?? "active";
      if (filter?.status && filter.status !== filtered_status) return null;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        status: filtered_status,
        membership: "free" as const,       // TODO: 接会员系统
        city: undefined as string | undefined,
        country: undefined as string | undefined,
        walletBalance: getWallet(u.id).coins,
        followingCount: 0,                  // TODO: 接 follow 系统
        savedCount: 0,
        giftsCount: 0,
        bookingsCount: 0,
        createdAt: u.createdAt.toISOString?.() ?? String(u.createdAt),
      } as CmsUserRow;
    }).filter(Boolean) as CmsUserRow[];
  },

  async getUser(id: string): Promise<CmsUserDetail | null> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/db");
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) return null;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wallet = require("@/lib/wallet");
    const w = wallet.getWallet(u.id);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockDb = require("@/lib/mock-db");
    const profile = mockDb.getUserProfile?.(u.id);
    const app = mockDb.getApplicationByUser?.(u.id);
    const txStore: any[] = ((globalThis as any).__sgWalletTxByUser as Map<string, any[]>)?.get?.(u.id) ?? [];
    const totalTop = txStore.filter((t) => t.type === "top-up").reduce((s, t) => s + t.amount, 0);
    const totalSpend = txStore.filter((t) => t.type === "spend").reduce((s, t) => s + t.amount, 0);
    const st = userStatus.get(u.id);
    const notes = userNotes.get(u.id) ?? [];

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: st?.status ?? "active",
      membership: "free",
      walletBalance: w.coins,
      followingCount: 0,
      savedCount: 0,
      giftsCount: 0,
      bookingsCount: 0,
      createdAt: u.createdAt.toISOString?.() ?? String(u.createdAt),
      // extended fields
      phone: profile?.phone,
      birthDate: profile?.birthday,
      age: profile?.birthday ? computeAge(profile.birthday) : undefined,
      gender: profile?.gender,
      city: profile?.city,
      country: profile?.country,
      languages: profile?.languages,
      interests: profile?.interests,
      bio: profile?.bio,
      preferredCities: profile?.preferences?.interestedCities,
      datingPreferences: profile?.preferences?.interestedTypes,
      budgetRange: profile?.preferences?.priceRange as [number, number] | undefined,
      walletTransactions: txStore.slice(-20).reverse() as CmsWalletTx[],
      walletTotalTopUp: totalTop,
      walletTotalSpend: totalSpend,
      creatorApplication: app ? {
        id: app.id,
        slug: app.slug,
        status: app.status,
        submittedAt: app.updatedAt,
        profileType: "sugargirl",
        completion: app.completion,
      } : undefined,
      membershipStatus: { tier: "free", autoRenew: false },
      following: [],
      saved: [],
      gifts: [],
      bookings: [],
      chats: [],
      notes: notes as any,
      reportsAgainst: 0,
      reportsBy: 0,
      suspendedAt: st?.suspendedAt,
      suspensionReason: st?.suspensionReason,
    };
  },

  setUserStatus(id: string, status: "active" | "suspended" | "banned", reason?: string) {
    userStatus.set(id, {
      status,
      suspendedAt: status !== "active" ? new Date().toISOString() : undefined,
      suspensionReason: reason,
    });
  },

  async setUserRole(id: string, role: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/db");
    await prisma.user.update({ where: { id }, data: { role } });
  },

  adjustUserWallet(id: string, delta: number, memo?: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wallet = require("@/lib/wallet");
    if (delta > 0) return wallet.topUp(id, delta, memo || "admin adjust +");
    return wallet.spend(id, -delta, memo || "admin adjust -");
  },

  addUserNote(id: string, text: string, author: string): CmsUserNote {
    const arr = userNotes.get(id) ?? [];
    const note = { id: `n_${randomBytes(4).toString("hex")}`, text, author, createdAt: new Date().toISOString() };
    arr.unshift(note);
    userNotes.set(id, arr);
    return note;
  },

  removeUserNote(id: string, noteId: string): boolean {
    const arr = userNotes.get(id);
    if (!arr) return false;
    const idx = arr.findIndex((n) => n.id === noteId);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    userNotes.set(id, arr);
    return true;
  },
};

type UserStatusType = "active" | "suspended" | "banned";

function computeAge(iso: string): number | undefined {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function isDemoMode(): boolean {
  // 无真实 DB · 全部 in-memory
  return true;
}
