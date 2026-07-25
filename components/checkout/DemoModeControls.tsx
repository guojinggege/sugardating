"use client";
// Demo mode 专用 · 模拟 provider 状态推进
// 生产环境 PAYMENTS_ALLOW_MOCK !== true 时 · API 已 gate · 此组件不渲染
import { useState } from "react";
import type { CheckoutOrder } from "@/lib/payments/types";

interface Props {
  orderId: string;
  onUpdate: (o: CheckoutOrder) => void;
}

export default function DemoModeControls({ orderId, onUpdate }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  async function simulate(action: "processing" | "paid" | "failed" | "expired") {
    if (busy) return;
    setBusy(action);
    try {
      const r = await fetch(`/api/checkout/orders/${orderId}/simulate`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const d = await r.json();
      if (d?.ok && d.order) onUpdate(d.order);
    } finally { setBusy(null); }
  }
  return (
    <div className="dmc">
      <b>Demo Controls</b>
      <p>本环境为 Demo Payment Mode · 你可以在此手动推进订单状态,用于测试:</p>
      <div className="dmc-btns">
        <button type="button" onClick={() => simulate("processing")} disabled={!!busy}>{busy === "processing" ? "…" : "→ processing"}</button>
        <button type="button" onClick={() => simulate("paid")}       disabled={!!busy} className="ok">{busy === "paid" ? "…" : "→ paid"}</button>
        <button type="button" onClick={() => simulate("failed")}     disabled={!!busy} className="err">{busy === "failed" ? "…" : "→ failed"}</button>
        <button type="button" onClick={() => simulate("expired")}    disabled={!!busy}>{busy === "expired" ? "…" : "→ expired"}</button>
      </div>
      <style>{`
        .dmc{background:#FBF3D8;border:1px dashed #C5A56A;border-radius:12px;padding:14px 18px;display:flex;flex-direction:column;gap:6px}
        .dmc b{font-size:11px;letter-spacing:.14em;color:#7C5A05;font-weight:800;text-transform:uppercase}
        .dmc p{margin:0;font-size:12px;color:#7C5A05;line-height:1.55}
        .dmc-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
        .dmc-btns button{padding:6px 12px;background:#fff;color:#171512;border:1px solid #E9E3DA;border-radius:99px;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer}
        .dmc-btns button:disabled{opacity:.4;cursor:not-allowed}
        .dmc-btns button.ok{border-color:#42856B;color:#2B6249}
        .dmc-btns button.err{border-color:#B77945;color:#7A4C27}
      `}</style>
    </div>
  );
}
