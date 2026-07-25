// Email OTP · 抽象 Provider · 未接真实邮件服务时走 Demo Mode
// Demo Mode: OTP 存 globalThis · 通过特殊接口回显 (仅 dev / preview)
// Production: 未配置 EMAIL_PROVIDER 时 · send 返回 "邮箱验证暂未开放"
import { randomBytes, timingSafeEqual } from "node:crypto";

interface OtpRecord {
  email: string;
  code: string;
  purpose: "register" | "link_provider" | "generic";
  createdAt: number;
  expiresAt: number;
  attempts: number;
  consumed: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgEmailOtps: Map<string, OtpRecord> | undefined;
}
const store = globalThis.__sgEmailOtps ?? new Map<string, OtpRecord>();
globalThis.__sgEmailOtps = store;

const TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

export function isDemoMode(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.EMAIL_OTP_DEMO_MODE === "true";
}

export function isRealProviderConfigured(): boolean {
  // 未来接真实邮件服务 (Resend / Postmark / SES) 时检查对应 API key
  return !!process.env.EMAIL_PROVIDER_API_KEY;
}

function keyOf(email: string, purpose: string): string {
  return `${purpose}::${email.trim().toLowerCase()}`;
}

/** Demo · 生成 6 位 OTP · 生产接真实 provider 时通过 API 发送 */
export function issueOtp(email: string, purpose: OtpRecord["purpose"] = "generic"): { ok: boolean; code?: string; demoMode: boolean; message?: string } {
  const normalized = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
    return { ok: false, demoMode: isDemoMode(), message: "邮箱格式不正确" };
  }
  if (!isDemoMode() && !isRealProviderConfigured()) {
    return { ok: false, demoMode: false, message: "邮箱验证暂未开放" };
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const now = Date.now();
  const record: OtpRecord = {
    email: normalized, code, purpose,
    createdAt: now, expiresAt: now + TTL_MS,
    attempts: 0, consumed: false,
  };
  store.set(keyOf(normalized, purpose), record);
  // Demo 环境 · 返回 code · 前端可直接展示 (仅测试用)
  return { ok: true, demoMode: isDemoMode(), code: isDemoMode() ? code : undefined };
}

export function verifyOtp(email: string, code: string, purpose: OtpRecord["purpose"] = "generic"): { ok: boolean; message?: string } {
  const normalized = email.trim().toLowerCase();
  const rec = store.get(keyOf(normalized, purpose));
  if (!rec) return { ok: false, message: "验证码不存在,请重新发送" };
  if (rec.consumed) return { ok: false, message: "验证码已使用,请重新发送" };
  if (rec.expiresAt < Date.now()) return { ok: false, message: "验证码已过期,请重新发送" };
  if (rec.attempts >= MAX_ATTEMPTS) return { ok: false, message: "尝试次数过多,请重新发送" };
  rec.attempts += 1;
  const a = Buffer.from(rec.code);
  const b = Buffer.from(String(code || ""));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, message: `验证码不正确 · 还剩 ${MAX_ATTEMPTS - rec.attempts} 次` };
  }
  rec.consumed = true;
  return { ok: true };
}

export function generateProviderStub(): string {
  return `otp_${randomBytes(4).toString("hex")}`;
}
