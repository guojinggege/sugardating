"use client";
// 统一 Checkout 页面 · 顶部 · 订单摘要 · 支付方式列表 · 详情区
// Demo Mode banner · Provider 未接通支付方式自动隐藏
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CheckoutOrder, PaymentMethodConfig, CheckoutCryptoDetails } from "@/lib/payments/types";
import OrderSummary from "./OrderSummary";
import PaymentMethodList from "./PaymentMethodList";
import CryptoPaymentPanel from "./CryptoPaymentPanel";
import BankTransferPanel from "./BankTransferPanel";
import OpenBankingPanel from "./OpenBankingPanel";
import CardPaymentPanel from "./CardPaymentPanel";
import DemoModeControls from "./DemoModeControls";

interface Props {
  initialOrder: CheckoutOrder;
  availableMethods: PaymentMethodConfig[];
  isMockAllowed: boolean;
}

interface SelectMethodResp {
  ok: boolean;
  message?: string;
  order?: CheckoutOrder;
  method?: PaymentMethodConfig;
  redirectUrl?: string;
  crypto?: CheckoutCryptoDetails;
  bankTransfer?: {
    accountName: string; accountNumber: string; sortCode: string;
    reference: string; estimatedMinutes: string;
  };
  capabilities?: { billingDescriptor?: string };
}

export default function CheckoutClient({ initialOrder, availableMethods, isMockAllowed }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<CheckoutOrder>(initialOrder);
  const [selected, setSelected] = useState<PaymentMethodConfig | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [detail, setDetail] = useState<SelectMethodResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Poll order status when in awaiting_payment/processing
  useEffect(() => {
    if (order.status === "paid" || order.status === "failed" || order.status === "expired" || order.status === "cancelled") {
      return;
    }
    const iv = setInterval(async () => {
      const r = await fetch(`/api/checkout/orders/${order.id}`, { credentials: "include" });
      const d = await r.json().catch(() => null);
      if (d?.ok) {
        setOrder(d.order);
        if (d.order.status === "paid") {
          setTimeout(() => router.push(`/checkout/${order.id}/success`), 400);
        } else if (d.order.status === "failed") {
          setTimeout(() => router.push(`/checkout/${order.id}/failed`), 400);
        }
      }
    }, 4000);
    return () => clearInterval(iv);
  }, [order.id, order.status, router]);

  async function selectMethod(method: PaymentMethodConfig) {
    if (selecting) return;
    setSelecting(true); setError(null);
    setSelected(method);
    try {
      const r = await fetch(`/api/checkout/orders/${order.id}/select-method`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ methodId: method.id }),
      });
      const d: SelectMethodResp = await r.json();
      if (!r.ok || !d?.ok) throw new Error(d?.message || "支付方式初始化失败");
      setDetail(d);
      if (d.order) setOrder(d.order);
    } catch (e) {
      setError(e instanceof Error ? e.message : "支付方式初始化失败");
      setSelected(null);
    } finally {
      setSelecting(false);
    }
  }

  const isTerminal = order.status === "paid" || order.status === "failed" || order.status === "expired" || order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="ck">
      {/* Top brand bar */}
      <header className="ck-top">
        <div className="ck-top-in">
          <Link href={order.type === "membership" ? "/membership" : "/membership#credits"} className="ck-back">← 返回</Link>
          <div className="ck-brand">
            <span className="ck-brand-mark">S</span>
            <b>Sugardating</b>
            <span>Checkout</span>
          </div>
          <div className="ck-status" data-status={order.status}>
            {statusLabel(order.status)}
          </div>
        </div>
      </header>

      {isMockAllowed && (
        <div className="ck-demo-banner">
          <b>Demo Payment Mode</b>
          <span>本环境未接入真实支付商 · 不会产生真实扣款 · 生产环境需配置真实 Provider</span>
        </div>
      )}

      <div className="ck-grid">
        <main className="ck-main">
          <section className="ck-sec">
            <h2 className="ck-h2">选择支付方式</h2>
            {availableMethods.length === 0 ? (
              <div className="ck-empty">
                当前没有可用的支付方式 · 请等待管理员配置或联系客服。
              </div>
            ) : (
              <PaymentMethodList
                methods={availableMethods}
                selected={selected}
                onSelect={selectMethod}
                disabled={isTerminal || selecting}
              />
            )}
          </section>

          {error && <div className="ck-err">{error}</div>}

          {detail && selected && (
            <section className="ck-sec">
              <h2 className="ck-h2">{selected.displayName}</h2>
              {order.billingDescriptor && (
                <div className="ck-descriptor">
                  你的银行卡或银行账单中将显示以下商户名称:<b>{order.billingDescriptor}</b>
                </div>
              )}
              {selected.type === "usdc"          && detail.crypto        && <CryptoPaymentPanel details={detail.crypto} />}
              {selected.type === "bank_transfer" && detail.bankTransfer  && <BankTransferPanel  details={detail.bankTransfer} />}
              {selected.type === "open_banking"  && <OpenBankingPanel redirectUrl={detail.redirectUrl} />}
              {selected.type === "card"          && <CardPaymentPanel provider={selected.provider} />}
            </section>
          )}

          {isMockAllowed && !isTerminal && (
            <DemoModeControls orderId={order.id} onUpdate={setOrder} />
          )}

          <section className="ck-legal">
            <p>点击支付即表示你同意 <Link href="/legal/terms">服务条款</Link> 与 <Link href="/legal/privacy">隐私政策</Link>。</p>
            <p>Sugardating 不接收或存储完整卡号 · 银行卡由持牌收单机构托管处理 · 加密货币由合规支付网关处理。</p>
          </section>
        </main>

        <aside className="ck-side">
          <OrderSummary order={order} />
        </aside>
      </div>

      <style>{clientStyles}</style>
    </div>
  );
}

function statusLabel(s: string): string {
  return { created: "待选择", awaiting_payment: "等待付款", processing: "确认中", paid: "已付款",
           failed: "付款失败", expired: "已过期", cancelled: "已取消", refunded: "已退款",
           chargeback: "chargeback" }[s] || s;
}

const clientStyles = `
  .ck{background:#F7F4EF;min-height:100vh;color:#171512;font-family:'Plus Jakarta Sans',ui-sans-serif}
  .ck-top{background:linear-gradient(180deg,#0F0F11,#161618);color:#EEDDB8;position:sticky;top:0;z-index:20;border-bottom:1px solid rgba(238,221,184,.14)}
  .ck-top-in{max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:16px}
  .ck-back{color:rgba(238,221,184,.7);text-decoration:none;font-size:13px;font-weight:600}
  .ck-back:hover{color:#EEDDB8}
  .ck-brand{display:flex;align-items:center;gap:8px;margin:0 auto}
  .ck-brand-mark{width:26px;height:26px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:16px;font-weight:700}
  .ck-brand b{font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.008em}
  .ck-brand span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(238,221,184,.6);font-weight:700}
  .ck-status{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;padding:4px 10px;border-radius:99px;background:rgba(238,221,184,.14);color:#EEDDB8}
  .ck-status[data-status="paid"]{background:rgba(66,133,107,.22);color:#8FE3B7}
  .ck-status[data-status="failed"],.ck-status[data-status="expired"],.ck-status[data-status="cancelled"]{background:rgba(183,121,69,.22);color:#F5C89A}
  .ck-status[data-status="processing"]{background:rgba(75,94,128,.22);color:#B5C4E0}

  .ck-demo-banner{background:linear-gradient(135deg,#FEF3C7,#F5D073);color:#7C5A05;padding:10px 20px;text-align:center;font-size:12.5px}
  .ck-demo-banner b{font-weight:800;margin-right:8px}

  .ck-grid{max-width:1180px;margin:0 auto;padding:28px 24px 80px;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px;align-items:flex-start}
  .ck-main{display:flex;flex-direction:column;gap:16px;min-width:0}
  .ck-side{position:sticky;top:80px}

  .ck-sec{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:22px 24px}
  .ck-h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:600;color:#171512;margin:0 0 14px;letter-spacing:-0.008em}
  .ck-empty{padding:28px;text-align:center;color:#77716A;font-size:13px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:12px}

  .ck-descriptor{padding:10px 14px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:10px;font-size:12.5px;color:#3d3a35;margin-bottom:14px}
  .ck-descriptor b{color:#171512;font-weight:800;margin-left:4px}

  .ck-legal{font-size:11.5px;color:#77716A;line-height:1.7;padding:12px 4px}
  .ck-legal p{margin:0 0 4px}
  .ck-legal a{color:#171512;text-decoration:underline}

  .ck-err{padding:10px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13px}

  @media(max-width:1024px){
    .ck-grid{grid-template-columns:1fr}
    .ck-side{position:static;order:-1}
  }
  @media(max-width:640px){
    .ck-top-in{padding:12px 16px}
    .ck-brand span{display:none}
    .ck-grid{padding:16px 16px 60px}
    .ck-sec{padding:18px 18px}
  }
`;
