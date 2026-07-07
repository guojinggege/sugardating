// Session cookie — HMAC-signed userId · httpOnly · SameSite=Lax
// Vercel serverless 冷启动会重置 in-memory user store,但 session cookie 依然 valid,
// 只是查不到 user — 优雅返回 null 即可
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sg_sess";
const MAX_AGE_S = 60 * 60 * 24 * 30;   // 30 days
const SECRET = process.env.AUTH_SECRET || "sugardating-dev-secret-CHANGE-IN-PROD";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Format: `${userId}.${sig}` */
export function encodeSession(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function decodeSession(raw: string | undefined): string | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const userId = raw.slice(0, dot);
  const sigHex = raw.slice(dot + 1);
  try {
    const expected = Buffer.from(sign(userId), "hex");
    const actual = Buffer.from(sigHex, "hex");
    if (expected.length !== actual.length) return null;
    return timingSafeEqual(expected, actual) ? userId : null;
  } catch {
    return null;
  }
}

// ─── Server-side helpers (used in API routes / server components) ─────────
export function setSessionCookie(userId: string) {
  cookies().set(COOKIE_NAME, encodeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getSessionUserId(): string | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  return decodeSession(raw);
}
