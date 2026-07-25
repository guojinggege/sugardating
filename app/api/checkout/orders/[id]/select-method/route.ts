// POST /api/checkout/orders/[id]/select-method · 选择支付方式 · 调用 provider createPayment
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrder, updateOrder } from "@/lib/payments/repository";
import { getMethodById, listAvailableMethods } from "@/lib/payments/config";
import { getProvider } from "@/lib/payments/providers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const order = getOrder(ctx.params.id);
  if (!order) return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });
  if (order.userId !== s.userId) return NextResponse.json({ ok: false, message: "无权操作" }, { status: 403 });
  if (order.status !== "created" && order.status !== "awaiting_payment") {
    return NextResponse.json({ ok: false, message: `订单状态 ${order.status} · 不可再修改支付方式` }, { status: 409 });
  }

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const methodId = typeof body?.methodId === "string" ? body.methodId : "";
  const method = getMethodById(methodId);
  if (!method) return NextResponse.json({ ok: false, message: "无效的支付方式" }, { status: 400 });

  // 二次可用性 gate · 服务端不信任前端已过滤
  const available = listAvailableMethods({ orderType: "one_off" });
  if (!available.some((m) => m.id === method.id)) {
    return NextResponse.json({ ok: false, message: "该支付方式当前不可用" }, { status: 400 });
  }

  const provider = getProvider(method.provider);
  if (!provider) return NextResponse.json({ ok: false, message: "支付通道未配置" }, { status: 400 });

  const capabilities = await provider.getCapabilities();
  const result = await provider.createPayment(order, method);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message || "支付通道拒绝了本次请求" }, { status: 502 });
  }

  const updated = updateOrder(order.id, {
    paymentMethodId: method.id,
    provider: provider.id,
    providerOrderId: result.providerOrderId,
    billingDescriptor: capabilities.billingDescriptor,
    status: "awaiting_payment",
    crypto: result.crypto,
  });

  return NextResponse.json({
    ok: true,
    order: updated,
    method,
    capabilities,
    crypto: result.crypto,
    bankTransfer: result.bankTransfer,
    redirectUrl: result.redirectUrl,
  });
}
