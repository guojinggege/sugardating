// GET /api/checkout/orders/[id] · 拉取订单 (仅本人)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/payments/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const o = getOrder(ctx.params.id);
  if (!o) return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });
  if (o.userId !== s.userId) return NextResponse.json({ ok: false, message: "无权查看" }, { status: 403 });
  return NextResponse.json({ ok: true, order: o });
}
