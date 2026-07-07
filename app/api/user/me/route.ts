// GET /api/user/me   — 拿当前用户 UserProfile
// PATCH /api/user/me — 更新 profile / preferences
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import {
  findUserById, getUserProfile, updateUserProfile, createUserProfile,
  getApplicationByUser, getFollowing, getBookings, getGifts, getSaved,
  toPublicUser,
} from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);

  const user = findUserById(uid);
  if (!user) return err("USER_NOT_FOUND", 401);

  // Legacy 用户可能没 profile (在 UserProfile 类型加入前注册) — 补建
  const profile = getUserProfile(uid) || createUserProfile(uid, user.name);
  const application = getApplicationByUser(uid);

  return NextResponse.json({
    ok: true,
    user: toPublicUser(user),
    profile,
    counts: {
      following: getFollowing(uid).length,
      saved:     getSaved(uid).length,
      bookings:  getBookings(uid).length,
      gifts:     getGifts(uid).length,
    },
    creatorApplication: application
      ? { slug: application.slug, status: application.status }
      : null,
  });
}

export async function PATCH(req: Request) {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);

  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const b = (body ?? {}) as Record<string, unknown>;

  // White-list update (never trust arbitrary keys)
  const patch: Record<string, unknown> = {};
  const strFields = ["displayName", "username", "avatar", "bio", "phone", "gender", "birthday", "city", "country", "language"] as const;
  for (const k of strFields) {
    const v = b[k];
    if (typeof v === "string") patch[k] = v.trim().slice(0, 240) || undefined;
  }
  if (Array.isArray(b.interests)) {
    patch.interests = b.interests.filter((x) => typeof x === "string" && x.trim().length > 0).map((s: string) => s.trim());
  }
  if (b.preferences && typeof b.preferences === "object") patch.preferences = b.preferences;
  if (b.privacy && typeof b.privacy === "object") patch.privacy = b.privacy;

  const updated = updateUserProfile(uid, patch as never);
  if (!updated) return err("PROFILE_NOT_FOUND", 404);

  return NextResponse.json({ ok: true, profile: updated });
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
