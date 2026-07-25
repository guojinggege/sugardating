// POST /api/checkout/webhooks/[provider] · Provider 回调
// 严格:签名验证 → 幂等 → 金额/币种校验 → 更新订单 → 触发开通
import { NextResponse } from "next/server";
import { getProvider } from "@/lib/payments/providers";
import {
  findByProviderOrderId, getOrder, updateOrder, isEventHandled, markEventHandled,
} from "@/lib/payments/repository";
import { fulfilOrder } from "@/lib/payments/fulfilment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { provider: string } }) {
  const provider = getProvider(ctx.params.provider);
  if (!provider) return NextResponse.json({ ok: false, message: "unknown provider" }, { status: 404 });

  // Provider 自己 verify (含签名)
  const ev = await provider.verifyWebhook(req);
  if (!ev.ok) return NextResponse.json({ ok: false, message: ev.message ?? "invalid webhook" }, { status: 400 });

  const providerOrderId = ev.providerOrderId;
  if (!providerOrderId) return NextResponse.json({ ok: false, message: "缺少 providerOrderId" }, { status: 400 });
  const order = findByProviderOrderId(providerOrderId);
  if (!order) return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });

  // 幂等 · 已处理直接返回
  if (isEventHandled(order.id, ev.eventId)) {
    return NextResponse.json({ ok: true, alreadyHandled: true });
  }

  // 金额与币种校验 (防篡改)
  if (ev.amount !== undefined && ev.amount !== order.amount) {
    return NextResponse.json({ ok: false, message: `金额不一致 order=${order.amount} event=${ev.amount}` }, { status: 400 });
  }
  if (ev.currency && ev.currency !== order.currency) {
    return NextResponse.json({ ok: false, message: `币种不一致 order=${order.currency} event=${ev.currency}` }, { status: 400 });
  }

  markEventHandled(order.id, ev.eventId);

  if (ev.status === "paid") {
    updateOrder(order.id, {
      status: "paid",
      providerTransactionId: ev.providerTransactionId ?? providerOrderId,
    });
    fulfilOrder(order.id);
  } else if (ev.status === "failed" || ev.status === "expired" || ev.status === "cancelled") {
    updateOrder(order.id, { status: ev.status });
  } else if (ev.status === "processing") {
    updateOrder(order.id, { status: "processing" });
  }

  return NextResponse.json({ ok: true });
}
