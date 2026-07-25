"use client";
import { useState } from "react";

interface Props {
  details: {
    accountName: string; accountNumber: string; sortCode: string;
    reference: string; estimatedMinutes: string;
  };
}

export default function BankTransferPanel({ details }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(text: string, key: string) {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500); } catch {}
  }
  const rows: Array<[string, string, string]> = [
    ["收款账户名称", details.accountName, "name"],
    ["账户号码",     details.accountNumber, "acc"],
    ["Sort Code",   details.sortCode, "sc"],
    ["付款 Reference", details.reference, "ref"],
  ];
  return (
    <div className="bt">
      <p className="bt-warn">
        请务必在转账时填写下方 Reference · 否则我们无法自动识别订单 · 平均处理时间 <b>{details.estimatedMinutes}</b>
      </p>
      <ul>
        {rows.map(([k, v, key]) => (
          <li key={key}>
            <b>{k}</b>
            <div>
              <code>{v}</code>
              <button type="button" onClick={() => copy(v, key)}>{copied === key ? "✓" : "复制"}</button>
            </div>
          </li>
        ))}
      </ul>
      <p className="bt-fine">
        订单状态默认 pending · 只有平台确认收到款项后才会开通 · 不自动到账
      </p>
      <style>{`
        .bt{display:flex;flex-direction:column;gap:12px}
        .bt-warn{margin:0;padding:10px 14px;background:#FBEDD5;color:#7A4C27;border-radius:8px;font-size:12.5px;line-height:1.55}
        .bt-warn b{font-weight:800}
        .bt ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .bt li{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;background:#FBFAF7;border:1px solid #E9E3DA;border-radius:10px}
        .bt li b{font-size:12px;color:#77716A;font-weight:700}
        .bt li > div{display:flex;gap:6px;align-items:center}
        .bt li code{font-family:ui-monospace,monospace;font-size:13px;color:#171512;font-weight:800}
        .bt li button{padding:4px 10px;background:#171512;color:#fff;border:0;border-radius:6px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
        .bt-fine{margin:0;font-size:11.5px;color:#77716A;font-style:italic}
      `}</style>
    </div>
  );
}
