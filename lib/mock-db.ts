// In-memory demo DB · pluggable API 未来可替换 Prisma
// ⚠️ Vercel serverless 冷启动会 reset — 生产阶段必须换真实数据库 (User + password 已在 prisma/schema.prisma
// 有 User 模型,只需加 passwordHash 字段并 migrate,即可无缝切换)
import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "./hash";

export type UserRole = "user" | "creator" | "admin";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}

export type ApplicationStatus = "draft" | "pending" | "approved" | "rejected" | "suspended";

export interface CreatorProfileDraft {
  id: string;
  userId: string;
  slug: string;                     // URL slug (unique)
  status: ApplicationStatus;
  // ── Public identity ──
  displayName: string;
  username: string;
  avatar?: string;
  coverImage?: string;
  coverVideo?: string;
  bio?: string;
  slogan?: string;
  city?: string;
  country?: string;
  // ── Basic info ──
  age?: number;
  height?: number;                  // cm
  weight?: number;                  // kg
  bodyType?: string;
  skinTone?: string;
  hairColor?: string;
  eyeColor?: string;
  occupation?: string;
  languages?: string[];
  education?: string;
  zodiac?: string;
  bloodType?: string;
  interests?: string[];
  // ── Lifestyle ──
  lifestyle?: {
    smoking?: string;
    drinking?: string;
    diet?: string;
    fitness?: string;
    travel?: string;
    datingPref?: string;
  };
  // ── Services ──
  services?: {
    chat?:         { enabled: boolean; price?: string; duration?: string };
    videoChat?:    { enabled: boolean; price?: string; duration?: string };
    privatePhoto?: { enabled: boolean; price?: string; duration?: string };
    dating?:       { enabled: boolean; price?: string; duration?: string };
    travel?:       { enabled: boolean; price?: string; duration?: string };
    shooting?:     { enabled: boolean; price?: string; duration?: string };
  };
  // ── Availability ──
  availability?: {
    replyTime?: string;
    timezone?: string;
  };
  // ── Verification (KYC placeholder) ──
  verification?: {
    identity?: boolean;
    phone?: boolean;
    email?: boolean;
    video?: boolean;
    face?: boolean;
    safeMeet?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── In-memory stores (globalThis 保留 dev HMR 状态) ─────────────────
declare global {
  // eslint-disable-next-line no-var
  var __sgUsers: Map<string, DemoUser> | undefined;
  // eslint-disable-next-line no-var
  var __sgUsersByEmail: Map<string, string> | undefined;   // email → id
  // eslint-disable-next-line no-var
  var __sgProfiles: Map<string, CreatorProfileDraft> | undefined;   // id → profile
  // eslint-disable-next-line no-var
  var __sgProfilesBySlug: Map<string, string> | undefined; // slug → id
  // eslint-disable-next-line no-var
  var __sgProfilesByUser: Map<string, string> | undefined; // userId → profileId
}

const users        = globalThis.__sgUsers        ?? new Map<string, DemoUser>();
const usersByEmail = globalThis.__sgUsersByEmail ?? new Map<string, string>();
const profiles     = globalThis.__sgProfiles     ?? new Map<string, CreatorProfileDraft>();
const profilesBySlug = globalThis.__sgProfilesBySlug ?? new Map<string, string>();
const profilesByUser = globalThis.__sgProfilesByUser ?? new Map<string, string>();

globalThis.__sgUsers = users;
globalThis.__sgUsersByEmail = usersByEmail;
globalThis.__sgProfiles = profiles;
globalThis.__sgProfilesBySlug = profilesBySlug;
globalThis.__sgProfilesByUser = profilesByUser;

// ─── User CRUD ─────────────────────────────────────
export interface CreateUserInput { name: string; email: string; password: string; role?: UserRole }

export function createUser(input: CreateUserInput): DemoUser {
  const email = input.email.trim().toLowerCase();
  if (usersByEmail.has(email)) throw new Error("EMAIL_TAKEN");
  const id = `u_${randomBytes(6).toString("hex")}`;
  const user: DemoUser = {
    id, email,
    name: input.name.trim(),
    role: input.role ?? "user",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  users.set(id, user);
  usersByEmail.set(email, id);
  return user;
}

export function findUserByEmail(email: string): DemoUser | null {
  const id = usersByEmail.get(email.trim().toLowerCase());
  return id ? users.get(id) ?? null : null;
}

export function findUserById(id: string): DemoUser | null {
  return users.get(id) ?? null;
}

export function verifyUserPassword(user: DemoUser, plain: string): boolean {
  return verifyPassword(plain, user.passwordHash);
}

// Safe subset for API response
export function toPublicUser(u: DemoUser) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt };
}

export function updateUserRole(userId: string, role: UserRole) {
  const u = users.get(userId);
  if (u) u.role = role;
}

// ─── Creator profile CRUD ──────────────────────────
export type ApplyInput = Omit<CreatorProfileDraft, "id" | "userId" | "status" | "createdAt" | "updatedAt">;

export function isSlugTaken(slug: string): boolean {
  return profilesBySlug.has(slug);
}

export function createOrUpdateApplication(userId: string, input: ApplyInput): CreatorProfileDraft {
  const now = new Date().toISOString();
  const existingId = profilesByUser.get(userId);

  if (existingId) {
    const existing = profiles.get(existingId)!;
    // Slug 变了要维护索引
    if (existing.slug !== input.slug) {
      if (isSlugTaken(input.slug)) throw new Error("SLUG_TAKEN");
      profilesBySlug.delete(existing.slug);
      profilesBySlug.set(input.slug, existing.id);
    }
    const updated: CreatorProfileDraft = { ...existing, ...input, updatedAt: now };
    profiles.set(existing.id, updated);
    return updated;
  }

  // 新建
  if (isSlugTaken(input.slug)) throw new Error("SLUG_TAKEN");
  const id = `p_${randomBytes(6).toString("hex")}`;
  const draft: CreatorProfileDraft = {
    ...input,
    id, userId,
    status: "pending",       // Demo 提交后进 pending
    createdAt: now, updatedAt: now,
  };
  profiles.set(id, draft);
  profilesByUser.set(userId, id);
  profilesBySlug.set(input.slug, id);
  updateUserRole(userId, "creator");   // 提交后 role 升级
  return draft;
}

export function getApplicationByUser(userId: string): CreatorProfileDraft | null {
  const id = profilesByUser.get(userId);
  return id ? profiles.get(id) ?? null : null;
}

export function getProfileBySlug(slug: string): CreatorProfileDraft | null {
  const id = profilesBySlug.get(slug);
  return id ? profiles.get(id) ?? null : null;
}

// ─── Utility: slug validation & generation ─────────
export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{1,30}[a-z0-9])?$/.test(slug);
}
