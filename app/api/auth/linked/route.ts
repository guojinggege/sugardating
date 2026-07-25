// GET  /api/auth/linked · 当前用户已关联账号列表 + capability
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listByUser, isAppleAvailable, isXAvailable } from "@/lib/auth/linked-accounts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    linked: listByUser(s.userId),
    capability: {
      apple: isAppleAvailable(),
      x:     isXAvailable(),
    },
    email: {
      address: s.email,
      // 后续接真实验证时读 profile.emailVerified · 目前默认 true (register 时已验证)
      verified: true,
    },
  });
}
