"use client";
import { useState } from "react";
import type { CheckoutCryptoDetails } from "@/lib/payments/types";

export default function CryptoPaymentPanel({ details }: { details: CheckoutCryptoDetails }) {
  const [copied, setCopied] = useState<"addr" | "amt" | null>(null);
  async function copy(text: string, kind: "addr" | "amt") {
    try { await navigator.clipboard.writeText(text); setCopied(kind); setTimeout(() => setCopied(null), 1500); } catch {}
  }
  const qrUrl = details.qrCode
    || `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(details.address || "")}&size=200x200`;

  return (
    <div className="crypto">
      <div className="crypto-net">
        <b>网络</b>
        <span>{details.network.toUpperCase()}</span>
      </div>
      <p className="crypto-warn">
        请从对应网络钱包发送 · 使用错误网络将无法自动恢复。
      </p>

      <div className="crypto-row">
        <div className="crypto-cell">
          <b>金额</b>
          <div className="crypto-val">
            <code>{details.amount} {details.asset}</code>
            <button type="button" onClick={() => copy(details.amount, "amt")}>{copied === "amt" ? "✓" : "复制"}</button>
          </div>
          {details.exchangeRate && <span className="crypto-rate">{details.exchangeRate}</span>}
        </div>

        <div className="crypto-cell">
          <b>收款地址</b>
          <div className="crypto-val">
            <code className="crypto-addr">{details.address}</code>
            <button type="button" onClick={() => copy(details.address || "", "addr")}>{copied === "addr" ? "✓" : "复制"}</button>
          </div>
        </div>
      </div>

      <div className="crypto-qr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt="Payment QR" width={200} height={200} />
        <p>用钱包 App 扫码 · 或复制上方地址</p>
      </div>

      <div className="crypto-meta">
        {details.expiresAt && <div><b>过期时间</b><span>{new Date(details.expiresAt).toLocaleString("zh-CN")}</span></div>}
        {details.confirmationsRequired && (
          <div><b>确认数</b><span>{details.confirmationsReceived ?? 0} / {details.confirmationsRequired}</span></div>
        )}
      </div>

      <p className="crypto-fine">
        订单需 Provider Webhook 确认后才标记为已付款 · 不自动续费
      </p>

      <style>{`
        .crypto{display:flex;flex-direction:column;gap:12px}
        .crypto-net{display:flex;justify-content:space-between;align-items:baseline;padding:10px 14px;background:linear-gradient(135deg,rgba(75,94,128,.14),rgba(75,94,128,.06));border-radius:10px}
        .crypto-net b{font-size:11px;letter-spacing:.14em;color:#4B5E80;font-weight:800;text-transform:uppercase}
        .crypto-net span{font-family:ui-monospace,monospace;font-size:14px;color:#171512;font-weight:800}
        .crypto-warn{margin:0;padding:8px 12px;background:#FBEDD5;color:#7A4C27;border-radius:8px;font-size:12px;line-height:1.55}
        .crypto-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .crypto-cell{padding:10px 14px;background:#FBFAF7;border:1px solid #E9E3DA;border-radius:10px;display:flex;flex-direction:column;gap:4px}
        .crypto-cell b{font-size:11px;letter-spacing:.06em;color:#77716A;font-weight:800;text-transform:uppercase}
        .crypto-val{display:flex;gap:6px;align-items:center}
        .crypto-val code{flex:1;font-family:ui-monospace,monospace;font-size:13px;color:#171512;font-weight:700;overflow-wrap:anywhere;word-break:break-all}
        .crypto-val button{padding:4px 10px;background:#171512;color:#fff;border:0;border-radius:6px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
        .crypto-addr{font-size:11.5px !important}
        .crypto-rate{font-size:10.5px;color:#a19a91}
        .crypto-qr{display:flex;flex-direction:column;align-items:center;padding:16px;background:#fff;border:1px solid #E9E3DA;border-radius:12px}
        .crypto-qr img{border-radius:8px;image-rendering:pixelated}
        .crypto-qr p{margin:8px 0 0;font-size:11.5px;color:#a19a91}
        .crypto-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.5px}
        .crypto-meta > div{display:flex;justify-content:space-between;padding:6px 10px;background:#FBFAF7;border-radius:6px}
        .crypto-meta b{color:#77716A;font-weight:700}
        .crypto-meta span{color:#171512;font-weight:700}
        .crypto-fine{margin:6px 0 0;font-size:11.5px;color:#77716A;font-style:italic}
        @media(max-width:640px){.crypto-row,.crypto-meta{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
