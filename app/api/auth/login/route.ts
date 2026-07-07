// POST /api/auth/login
import { NextResponse } from "next/server";
import { findUserByEmail, verifyUserPassword, toPublicUser } from "@/lib/mock-db";
import { setSessionCookie } from "@/lib/session";
import { isValidEmail, isValidPassword } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return err("INVALID_CREDENTIALS", 400, "邮箱或密码格式错误");
  }

  const user = findUserByEmail(email);
  if (!user || !verifyUserPassword(user, password)) {
    return err("INVALID_CREDENTIALS", 401, "邮箱或密码错误");
  }

  setSessionCookie({ userId: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json({ ok: true, user: toPublicUser(user) });
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
