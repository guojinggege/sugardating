import type { CheckoutOrder } from "@/lib/payments/types";

const fmt = (pence: number) => `£${(pence / 100).toFixed(2)}`;
const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }) : "-";

export default function OrderSummary({ order }: { order: CheckoutOrder }) {
  const now = new Date();
  const effectiveDate = order.paidAt ? new Date(order.paidAt) : now;
  const expiryDate = order.membership
    ? new Date(effectiveDate.getTime() + order.membership.periodDays * 86400_000)
    : null;

  return (
    <div className="os">
      <div className="os-h">
        <div className="os-eye">Order Summary</div>
        <b>订单摘要</b>
      </div>

      <div className="os-line">
        <span>商品</span>
        <b>{order.productName}</b>
      </div>
      <div className="os-line">
        <span>类型</span>
        <b>{order.type === "membership" ? "付费会员" : "Credits"}</b>
      </div>
      {order.credits && (
        <div className="os-line">
          <span>Credits</span>
          <b>{order.credits.creditAmount.toLocaleString()}</b>
        </div>
      )}
      {order.membership && (
        <>
          <div className="os-line">
            <span>周期</span>
            <b>{periodLabel(order.membership.periodDays)}</b>
          </div>
          <div className="os-line">
            <span>生效时间</span>
            <b>{fmtDate(effectiveDate.toISOString())}</b>
          </div>
          <div className="os-line">
            <span>到期时间</span>
            <b>{fmtDate(expiryDate?.toISOString())}</b>
          </div>
          <div className="os-line">
            <span>自动续费</span>
            <b>{order.autoRenew ? "开启" : "不自动续费"}</b>
          </div>
        </>
      )}

      <div className="os-line os-line--sub">
        <span>小计</span>
        <b>{fmt(order.amount)}</b>
      </div>
      <div className="os-total">
        <span>应付金额</span>
        <b>{fmt(order.amount)}</b>
      </div>

      <div className="os-ref">
        <span>Order Reference</span>
        <code>{order.reference}</code>
      </div>

      <div className="os-cancel">
        <b>取消规则</b>
        <p>
          {order.membership?.isIntro
            ? "首充体验 · 到期后自动恢复基础会员 · 不产生续费扣款"
            : "可随时在会员中心取消 · 当前周期结束后停止续费 · 已使用周期不退款"}
        </p>
      </div>

      <style>{`
        .os{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:22px 24px;display:flex;flex-direction:column;gap:8px}
        .os-h{margin-bottom:6px}
        .os-eye{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:700;text-transform:uppercase}
        .os-h b{display:block;font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:600;color:#171512;margin-top:2px;letter-spacing:-0.008em}
        .os-line{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;color:#77716A;padding:6px 0;border-bottom:1px dashed #F0EAE1}
        .os-line b{color:#171512;font-weight:700;text-align:right}
        .os-line--sub{padding-top:12px;color:#a19a91}
        .os-total{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 8px;border-top:1px solid #E9E3DA;margin-top:6px}
        .os-total span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#77716A;font-weight:700}
        .os-total b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#171512;font-weight:600;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
        .os-ref{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;color:#a19a91;padding-top:8px;border-top:1px dashed #F0EAE1;margin-top:4px}
        .os-ref code{font-family:ui-monospace,monospace;color:#374151;background:#F7F4EF;padding:2px 8px;border-radius:6px;font-weight:700}
        .os-cancel{margin-top:10px;padding:10px 12px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:10px}
        .os-cancel b{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .os-cancel p{margin:4px 0 0;font-size:11.5px;color:#3d3a35;line-height:1.6}
      `}</style>
    </div>
  );
}

function periodLabel(days: number): string {
  if (days === 7)   return "7 天体验";
  if (days === 30)  return "1 个月";
  if (days === 90)  return "3 个月";
  if (days === 365) return "1 年";
  return `${days} 天`;
}
