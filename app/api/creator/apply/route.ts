// POST /api/creator/apply — 提交或更新创作者入驻资料
// GET  /api/creator/apply — 拿当前登录用户的申请状态
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import {
  createOrUpdateApplication, getApplicationByUser,
  isSlugTaken, isValidSlug, normalizeSlug,
  type ApplyInput,
} from "@/lib/mock-db";
import { isNonEmptyString } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ── GET ──────────────────────────────────────────
export async function GET() {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);
  const app = getApplicationByUser(uid);
  return NextResponse.json({ ok: true, application: app });
}

// ── POST ─────────────────────────────────────────
export async function POST(req: Request) {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401, "请先登录");

  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const b = (body ?? {}) as Record<string, unknown>;

  // ── Required ─────
  if (!isNonEmptyString(b.displayName, 60))     return err("INVALID_NAME", 400,     "请填写主页昵称");
  if (!isNonEmptyString(b.username, 32))        return err("INVALID_USERNAME", 400, "请填写 username");
  const slug = normalizeSlug(String(b.username));
  if (!isValidSlug(slug))                       return err("INVALID_SLUG", 400,     "username 仅允许字母/数字/短横线,3-32 位");

  // 判 slug 冲突时先看是不是本人已有的
  const existing = getApplicationByUser(uid);
  if (isSlugTaken(slug) && existing?.slug !== slug) {
    return err("SLUG_TAKEN", 409, "该 username 已被占用,请换一个");
  }

  // ── Compose payload — 只白名单已知字段 ─────
  const input: ApplyInput = {
    slug,
    displayName:  String(b.displayName).trim(),
    username:     slug,
    bio:          strOrUndef(b.bio, 800),
    slogan:       strOrUndef(b.slogan, 140),
    city:         strOrUndef(b.city, 60),
    country:      strOrUndef(b.country, 60),
    avatar:       strOrUndef(b.avatar, 500),
    coverImage:   strOrUndef(b.coverImage, 500),
    coverVideo:   strOrUndef(b.coverVideo, 500),
    age:          numOrUndef(b.age, 18, 99),
    height:       numOrUndef(b.height, 120, 220),
    weight:       numOrUndef(b.weight, 30, 200),
    bodyType:     strOrUndef(b.bodyType, 40),
    skinTone:     strOrUndef(b.skinTone, 40),
    hairColor:    strOrUndef(b.hairColor, 40),
    eyeColor:     strOrUndef(b.eyeColor, 40),
    occupation:   strOrUndef(b.occupation, 60),
    education:    strOrUndef(b.education, 40),
    zodiac:       strOrUndef(b.zodiac, 20),
    bloodType:    strOrUndef(b.bloodType, 4),
    languages:    strArrOrUndef(b.languages, 10),
    interests:    strArrOrUndef(b.interests, 20),
    lifestyle:    isObj(b.lifestyle) ? {
      smoking:    strOrUndef((b.lifestyle as any).smoking, 40),
      drinking:   strOrUndef((b.lifestyle as any).drinking, 40),
      diet:       strOrUndef((b.lifestyle as any).diet, 40),
      fitness:    strOrUndef((b.lifestyle as any).fitness, 40),
      travel:     strOrUndef((b.lifestyle as any).travel, 40),
      datingPref: strOrUndef((b.lifestyle as any).datingPref, 60),
    } : undefined,
    services:     isObj(b.services) ? {
      chat:         normalizeService((b.services as any).chat),
      videoChat:    normalizeService((b.services as any).videoChat),
      privatePhoto: normalizeService((b.services as any).privatePhoto),
      dating:       normalizeService((b.services as any).dating),
      travel:       normalizeService((b.services as any).travel),
      shooting:     normalizeService((b.services as any).shooting),
    } : undefined,
    availability: isObj(b.availability) ? {
      replyTime: strOrUndef((b.availability as any).replyTime, 40),
      timezone:  strOrUndef((b.availability as any).timezone, 40),
    } : undefined,
    verification: {
      email:    true,   // 已登录即默认 email 通过 (demo)
      identity: false,
      phone:    false,
      video:    false,
      face:     false,
      safeMeet: false,
    },
  };

  try {
    const draft = createOrUpdateApplication(uid, input);
    return NextResponse.json({
      ok: true,
      application: { id: draft.id, slug: draft.slug, status: draft.status },
      profilePreview: { slug: draft.slug, url: `/creators/${draft.slug}` },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "SLUG_TAKEN") return err("SLUG_TAKEN", 409, "该 username 已被占用");
    return err("SERVER_ERROR", 500, "保存失败,请稍后重试");
  }
}

// ── helpers ──────────────────────────────────────
function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function strOrUndef(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length > 0 && s.length <= max ? s : undefined;
}
function numOrUndef(v: unknown, min: number, max: number): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : undefined;
}
function strArrOrUndef(v: unknown, max: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const arr = v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
  return arr.length > 0 ? arr.slice(0, max) : undefined;
}
function normalizeService(v: unknown): { enabled: boolean; price?: string; duration?: string } | undefined {
  if (!isObj(v)) return undefined;
  return {
    enabled: v.enabled === true,
    price:    strOrUndef(v.price, 30),
    duration: strOrUndef(v.duration, 30),
  };
}
