// POST /api/auth/login — Neon Postgres 持久化 · 复用 PBKDF2 verifyPassword
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/hash";
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

  try {
    const user = await prisma.user.findUnique({
      where: { email: (email as string).trim().toLowerCase() },
    });
    if (!user || !verifyPassword(password as string, user.password)) {
      return err("INVALID_CREDENTIALS", 401, "邮箱或密码错误");
    }

    setSessionCookie({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: (user.role as "user" | "creator" | "admin"),
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt.toISOString() },
    });
  } catch (e) {
    console.error("login failed:", e instanceof Error ? e.message : e);
    return err("SERVER_ERROR", 500, "服务错误,请稍后重试");
  }
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
