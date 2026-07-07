// POST /api/auth/register — 创建用户 + 完整 UserProfile + 自动登录
// 必填:name/email/password/birthDate/country/city/interests(≥3) + acceptTerms
// 校验:email 格式 · password ≥8 · 年龄 ≥18 (from birthDate)
import { NextResponse } from "next/server";
import { createUser, createUserProfile, toPublicUser } from "@/lib/mock-db";
import { setSessionCookie } from "@/lib/session";
import { isValidEmail, isValidPassword, isValidName } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const b = (body ?? {}) as Record<string, unknown>;

  // Legacy field name compat: displayName || name
  const name         = (b.displayName ?? b.name) as unknown;
  const email        = b.email;
  const password     = b.password;
  const birthDate    = b.birthDate;
  const country      = b.country;
  const city         = b.city;
  const interests    = b.interests;
  const acceptTerms  = b.acceptTerms !== false;   // default true (backward compat)

  if (!isValidName(name))         return err("INVALID_NAME", 400,     "请填写昵称");
  if (!isValidEmail(email))       return err("INVALID_EMAIL", 400,    "请输入合法邮箱");
  if (!isValidPassword(password)) return err("INVALID_PASSWORD", 400, "密码至少 8 位");

  // birthDate + 18+ age gate (若提供)
  let normBirth: string | undefined = undefined;
  if (typeof birthDate === "string" && birthDate.trim()) {
    const d = new Date(birthDate);
    if (isNaN(d.getTime())) return err("INVALID_BIRTHDATE", 400, "出生日期格式错误");
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    if (age < 18) return err("UNDERAGE", 400, "本平台仅面向 18 岁以上成年人");
    if (age > 120) return err("INVALID_BIRTHDATE", 400, "出生日期无效");
    normBirth = d.toISOString().slice(0, 10);
  }

  if (!acceptTerms) return err("TERMS_REQUIRED", 400, "请先同意平台条款");

  const normCountry = typeof country === "string" ? country.trim() : "";
  const normCity    = typeof city    === "string" ? city.trim()    : "";
  const normLangs   = strArr(b.languages, 10);
  const normInts    = strArr(interests, 30);
  const gender      = typeof b.gender === "string" ? b.gender : undefined;
  const bio         = typeof b.bio    === "string" ? b.bio.trim().slice(0, 400) : undefined;

  const preferredCities = strArr(b.preferredCities, 20);
  const budgetRange     = Array.isArray(b.budgetRange) && b.budgetRange.length === 2
    ? [Number((b.budgetRange as unknown[])[0]), Number((b.budgetRange as unknown[])[1])] as [number, number]
    : undefined;
  const datingPrefs = strArr(b.datingPreferences, 20);

  try {
    const user = createUser({ name: name as string, email: email as string, password: password as string });
    createUserProfile(user.id, user.name, {
      birthday:  normBirth,
      gender,
      country:   normCountry || undefined,
      city:      normCity || undefined,
      languages: normLangs.length ? normLangs : undefined,
      interests: normInts,
      bio,
      preferences: {
        interestedCities: preferredCities.length ? preferredCities : undefined,
        interestedTypes:  datingPrefs.length ? datingPrefs : undefined,
        priceRange:       budgetRange && Number.isFinite(budgetRange[0]) && Number.isFinite(budgetRange[1]) ? budgetRange : undefined,
      },
    });
    setSessionCookie(user.id);
    return NextResponse.json({ ok: true, user: toPublicUser(user) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_TAKEN") return err("EMAIL_TAKEN", 409, "邮箱已注册,请直接登录");
    return err("SERVER_ERROR", 500, "服务错误,请稍后重试");
  }
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
function strArr(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim()).slice(0, max);
}
