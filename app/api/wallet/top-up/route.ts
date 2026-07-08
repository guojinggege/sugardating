// POST /api/wallet/top-up — mock 充值 (不接真实支付)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { topUp } from "@/lib/wallet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }
  const coins = Number((body as any)?.coins);
  if (!Number.isFinite(coins) || coins <= 0 || coins > 100_000) {
    return NextResponse.json({ ok: false, code: "INVALID_AMOUNT", message: "充值金额无效" }, { status: 400 });
  }
  try {
    const w = topUp(s.userId, coins, "mock top-up");
    return NextResponse.json({ ok: true, wallet: w });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SERVER_ERROR";
    return NextResponse.json({ ok: false, code: msg, message: "充值失败,请稍后重试" }, { status: 400 });
  }
}
