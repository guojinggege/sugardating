// Session cookie — 签名 JSON payload · 无需服务端 store
// 强防御:任何异常都 return null · 从不 throw · 兼容旧格式 cookie
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
  iat: number;
}

function b64urlEncode(buf: Buffer | string): string {
  try {
    const s = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
    return s.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch { return ""; }
}
function b64urlDecode(s: string): Buffer {
  try {
    const pad = 4 - (s.length % 4);
    const padded = s + (pad < 4 ? "=".repeat(pad) : "");
    return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  } catch { return Buffer.alloc(0); }
}
function sign(payload: string): string {
  try { return b64urlEncode(createHmac("sha256", SECRET).update(payload).digest()); }
  catch { return ""; }
}

export function encodeSession(payload: Omit<SessionPayload, "iat">): string {
  const full: SessionPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const p = b64urlEncode(JSON.stringify(full));
  return `${p}.${sign(p)}`;
}

/** 完全 safe decode · 任何情况都不 throw · 无效 cookie 返 null */
export function decodeSession(raw: string | undefined | null): SessionPayload | null {
  if (!raw || typeof raw !== "string") return null;
  try {
    const dot = raw.lastIndexOf(".");
    if (dot < 1 || dot >= raw.length - 1) return null;

    const p = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);

    // 签名验证 — 长度对不上或验证失败都返 null
    const expected = b64urlDecode(sign(p));
    const actual = b64urlDecode(sig);
    if (expected.length === 0 || actual.length === 0) return null;
    if (expected.length !== actual.length) return null;
    if (!timingSafeEqual(expected, actual)) return null;

    // 解 payload — JSON.parse 可能因为旧格式 cookie 内容不是 JSON 而失败
    const jsonStr = b64urlDecode(p).toString("utf8");
    if (!jsonStr) return null;

    let parsed: unknown;
    try { parsed = JSON.parse(jsonStr); }
    catch { return null; }

    // 校验 shape
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.userId !== "string" || obj.userId.length === 0) return null;
    if (typeof obj.name !== "string") return null;
    if (typeof obj.email !== "string") return null;
    const role = typeof obj.role === "string" ? obj.role : "user";
    const iat = typeof obj.iat === "number" ? obj.iat : Math.floor(Date.now() / 1000);

    // Expiry
    if (Date.now() / 1000 - iat > MAX_AGE_S) return null;

    return {
      userId: obj.userId,
      name:   obj.name,
      email:  obj.email,
      role:   (role === "user" || role === "creator" || role === "admin") ? role : "user",
      iat,
    };
  } catch {
    return null;
  }
}

// ─── Server helpers (只可在 Route Handler / Server Action 里 set/delete cookie · 不在 Server Component) ─
export function setSessionCookie(payload: Omit<SessionPayload, "iat">) {
  try {
    cookies().set(COOKIE_NAME, encodeSession(payload), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE_S,
    });
  } catch { /* server component 会抛,忽略 */ }
}

export function clearSessionCookie() {
  try {
    // 清主 cookie
    cookies().delete(COOKIE_NAME);
    // 兼容旧格式 cookie 名 (若历史用过)
    cookies().delete("sg_session");
    cookies().delete("session");
  } catch { /* server component 会抛,忽略 */ }
}

/** 主入口 — 返 session payload 或 null · 完全 safe */
export function getSession(): SessionPayload | null {
  try { return decodeSession(cookies().get(COOKIE_NAME)?.value); }
  catch { return null; }
}

/** Legacy — 仅返 userId · 保留兼容 */
export function getSessionUserId(): string | null {
  return getSession()?.userId ?? null;
}
