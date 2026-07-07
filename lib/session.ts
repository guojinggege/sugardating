// Session cookie — 签名 JSON payload · 无需服务端 store (fix Vercel 冷启动 / 跨实例 in-memory 丢失)
// 只签名不加密 — cookie 内容用户能看到,但改不了 (HMAC 保完整)
// 敏感字段(password)绝不放入 payload
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sg_sess";
const MAX_AGE_S = 60 * 60 * 24 * 30;
const SECRET = process.env.AUTH_SECRET || "sugardating-dev-secret-CHANGE-IN-PROD";

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "user" | "creator" | "admin";
  iat: number;              // issued at (seconds)
}

function b64urlEncode(buf: Buffer | string): string {
  const s = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return s.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4);
  const padded = s + (pad < 4 ? "=".repeat(pad) : "");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function sign(payload: string): string {
  return b64urlEncode(createHmac("sha256", SECRET).update(payload).digest());
}

/** Format: `${b64urlPayload}.${b64urlSig}` */
export function encodeSession(payload: Omit<SessionPayload, "iat">): string {
  const full: SessionPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const p = b64urlEncode(JSON.stringify(full));
  return `${p}.${sign(p)}`;
}

export function decodeSession(raw: string | undefined): SessionPayload | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const p = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  try {
    const expected = b64urlDecode(sign(p));
    const actual = b64urlDecode(sig);
    if (expected.length !== actual.length) return null;
    if (!timingSafeEqual(expected, actual)) return null;
    const payload = JSON.parse(b64urlDecode(p).toString("utf8")) as SessionPayload;
    // Basic shape check
    if (typeof payload.userId !== "string" || typeof payload.name !== "string") return null;
    // Expiry check
    if (typeof payload.iat === "number" && Date.now() / 1000 - payload.iat > MAX_AGE_S) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Server helpers ────────────────────────────────
export function setSessionCookie(payload: Omit<SessionPayload, "iat">) {
  cookies().set(COOKIE_NAME, encodeSession(payload), {
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

// 主入口 — 返 payload 或 null
export function getSession(): SessionPayload | null {
  return decodeSession(cookies().get(COOKIE_NAME)?.value);
}

// Legacy — 仅返 userId (向后兼容)
export function getSessionUserId(): string | null {
  return getSession()?.userId ?? null;
}
