// GET /api/wallet/balance — 当前用户 coins 余额
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getWallet } from "@/lib/wallet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const w = getWallet(s.userId);
  return NextResponse.json({ ok: true, wallet: w });
}
