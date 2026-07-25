// POST /api/checkout/orders/[id]/simulate · Demo 环境专用
// 用户在 checkout 页面点「模拟付款成功 / 失败」时,前端调此 endpoint
// 生产环境 (PAYMENTS_ALLOW_MOCK !== true 且 NODE_ENV=production) 返回 403
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrder, updateOrder, isEventHandled, markEventHandled } from "@/lib/payments/repository";
import { fulfilOrder } from "@/lib/payments/fulfilment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isMockAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.PAYMENTS_ALLOW_MOCK === "true";
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  if (!isMockAllowed()) return NextResponse.json({ ok: false, message: "生产环境已禁用 Demo 模拟" }, { status: 403 });

  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const order = getOrder(ctx.params.id);
  if (!order) return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });
  if (order.userId !== s.userId) return NextResponse.json({ ok: false, message: "无权操作" }, { status: 403 });

  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const action = body?.action;

  const eventId = `sim_${order.id}_${action}`;
  if (isEventHandled(order.id, eventId)) {
    return NextResponse.json({ ok: true, order: getOrder(order.id), alreadyHandled: true });
  }
  markEventHandled(order.id, eventId);

  if (action === "processing") {
    updateOrder(order.id, { status: "processing" });
    return NextResponse.json({ ok: true, order: getOrder(order.id) });
  }
  if (action === "paid") {
    updateOrder(order.id, {
      status: "paid",
      providerTransactionId: `mock_tx_${order.id}`,
    });
    const f = fulfilOrder(order.id);
    if (!f.ok) return NextResponse.json({ ok: false, message: f.message }, { status: 500 });
    return NextResponse.json({ ok: true, order: getOrder(order.id) });
  }
  if (action === "failed") {
    updateOrder(order.id, { status: "failed" });
    return NextResponse.json({ ok: true, order: getOrder(order.id) });
  }
  if (action === "expired") {
    updateOrder(order.id, { status: "expired" });
    return NextResponse.json({ ok: true, order: getOrder(order.id) });
  }
  return NextResponse.json({ ok: false, message: "unknown action" }, { status: 400 });
}
