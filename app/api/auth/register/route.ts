// POST /api/auth/register — 创建用户 + 自动登录
import { NextResponse } from "next/server";
import { createUser, createUserProfile, toPublicUser } from "@/lib/mock-db";
import { setSessionCookie } from "@/lib/session";
import { isValidEmail, isValidPassword, isValidName } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const { name, email, password } = (body ?? {}) as Record<string, unknown>;

  if (!isValidName(name))         return err("INVALID_NAME", 400,     "姓名不能为空");
  if (!isValidEmail(email))       return err("INVALID_EMAIL", 400,    "请输入合法邮箱");
  if (!isValidPassword(password)) return err("INVALID_PASSWORD", 400, "密码至少 8 位");

  try {
    const user = createUser({ name, email, password });
    createUserProfile(user.id, user.name);   // 自动生成 UserProfile,不留空白
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
