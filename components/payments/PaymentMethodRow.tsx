"use client";
import type { DisplayPaymentMethod } from "@/lib/payments/display-methods";

interface Props {
  method: DisplayPaymentMethod;
  selected?: boolean;
  onClick?: () => void;
}

// ══════════════════════════════════════
// Icon rendering · 保守文字/单字符 · 不引入真实品牌 SVG
// (真实上架前需替换为经过品牌方许可的官方 Logo)
// ══════════════════════════════════════

const ICONS: Record<DisplayPaymentMethod["iconKey"], { label: string; bg: string; fg: string }> = {
  "card":          { label: "VISA · MC · AMEX", bg: "#F7F4EF", fg: "#171512" },
  "apple-pay":     { label: " Pay",             bg: "#111111", fg: "#ffffff" },
  "google-pay":    { label: "G Pay",            bg: "#ffffff", fg: "#111111" },
  "paypal":        { label: "PayPal",           bg: "#F7F4EF", fg: "#003087" },
  "pay-by-bank":   { label: "🏦",               bg: "#F0EAE1", fg: "#171512" },
  "bank-transfer": { label: "⇄",                bg: "#F0EAE1", fg: "#171512" },
  "direct-debit":  { label: "DD",               bg: "#F0EAE1", fg: "#171512" },
  "usdc":          { label: "USDC",             bg: "#EEF3FC", fg: "#2775CA" },
  "usdt":          { label: "USDT",             bg: "#EAF6F0", fg: "#26A17B" },
};

export default function PaymentMethodRow({ method, selected, onClick }: Props) {
  const ic = ICONS[method.iconKey];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={"pmr" + (selected ? " is-selected" : "")}
    >
      <span
        className="pmr-ic"
        style={{ background: ic.bg, color: ic.fg }}
        aria-hidden
      >{ic.label}</span>
      <div className="pmr-body">
        <b>{method.title}</b>
        <em>{method.subtitle}</em>
      </div>
      <span className="pmr-arrow" aria-hidden>{selected ? "✓" : "→"}</span>

      <style>{`
        .pmr{display:flex;align-items:center;gap:14px;width:100%;padding:14px 18px;background:#fff;border:1px solid #E9E3DA;border-radius:16px;font:inherit;color:inherit;cursor:pointer;text-align:left;transition:border-color .12s,background .12s,transform .12s}
        .pmr:hover{border-color:#B8A789}
        .pmr:focus-visible{outline:2px solid #171512;outline-offset:2px}
        .pmr.is-selected{border-color:#B8A789;background:linear-gradient(135deg,#FBF7EF,#F4EEDF)}
        .pmr-ic{flex-shrink:0;min-width:64px;height:40px;padding:0 10px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;letter-spacing:.04em;font-family:ui-monospace,monospace}
        .pmr-body{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.35}
        .pmr-body b{font-size:14px;color:#171512;font-weight:800;letter-spacing:-0.005em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .pmr-body em{font-size:12px;color:#77716A;font-style:normal;margin-top:2px}
        .pmr-arrow{color:#a19a91;font-size:16px;font-weight:800;flex-shrink:0}
        .pmr.is-selected .pmr-arrow{color:#42856B}
      `}</style>
    </button>
  );
}
