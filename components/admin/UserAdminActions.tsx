"use client";
// Admin 用户操作 · 角色 / 状态 / 钱包调整
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  userId: string;
  currentRole: string;
  currentStatus: string;
  currentBalance: number;
}

const ROLES = ["user", "creator", "admin", "editor", "operator", "reviewer", "support", "finance"];

export default function UserAdminActions({ userId, currentRole, currentStatus, currentBalance }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [role, setRole] = useState(currentRole);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletMemo, setWalletMemo] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [expanded, setExpanded] = useState<"" | "role" | "wallet" | "suspend">("");

  async function post(path: string, body: any, tag: string) {
    if (busy) return;
    setBusy(tag);
    try {
      const r = await fetch(`/api/admin/users/${userId}/${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "操作失败");
      setExpanded("");
      setWalletAmount("");
      setWalletMemo("");
      setSuspendReason("");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "操作失败");
    } finally { setBusy(null); }
  }

  return (
    <div className="ua">
      <div className="ua-row">
        <button type="button" onClick={() => setExpanded(expanded === "role" ? "" : "role")} className="ua-btn">修改角色</button>
        <button type="button" onClick={() => setExpanded(expanded === "wallet" ? "" : "wallet")} className="ua-btn">调整钱包</button>
        {currentStatus === "active" ? (
          <button type="button" onClick={() => setExpanded(expanded === "suspend" ? "" : "suspend")} className="ua-btn ua-btn--danger">禁用</button>
        ) : (
          <button type="button" onClick={() => post("restore", {}, "restore")} disabled={busy === "restore"} className="ua-btn ua-btn--success">
            {busy === "restore" ? "…" : "恢复"}
          </button>
        )}
      </div>

      {expanded === "role" && (
        <div className="ua-panel">
          <label>新角色</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button type="button" disabled={busy === "role" || role === currentRole} onClick={() => post("role", { role }, "role")} className="ua-btn ua-btn--gold">
            {busy === "role" ? "…" : "确认修改"}
          </button>
        </div>
      )}

      {expanded === "wallet" && (
        <div className="ua-panel">
          <div className="ua-mini">当前余额: <b>{currentBalance}</b> credits</div>
          <label>调整金额 · 正数充值 / 负数扣减</label>
          <input type="number" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} placeholder="+100 或 -50" />
          <label>备注 (可选)</label>
          <input type="text" value={walletMemo} onChange={(e) => setWalletMemo(e.target.value)} placeholder="补偿 · 活动奖励..." />
          <button type="button"
            disabled={busy === "wallet" || !walletAmount || Number(walletAmount) === 0}
            onClick={() => {
              const delta = Number(walletAmount);
              if (!Number.isFinite(delta)) return;
              if (!confirm(`确认调整 ${delta > 0 ? "+" : ""}${delta} credits?`)) return;
              post("wallet-adjust", { delta, memo: walletMemo }, "wallet");
            }}
            className="ua-btn ua-btn--gold">
            {busy === "wallet" ? "…" : "确认调整"}
          </button>
        </div>
      )}

      {expanded === "suspend" && (
        <div className="ua-panel">
          <label>禁用原因</label>
          <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={2} placeholder="违反社区规则、异常行为..." maxLength={500} />
          <button type="button" disabled={busy === "suspend"} onClick={() => {
            if (!confirm("确认禁用该用户?")) return;
            post("suspend", { reason: suspendReason }, "suspend");
          }} className="ua-btn ua-btn--danger">
            {busy === "suspend" ? "…" : "确认禁用"}
          </button>
        </div>
      )}

      <style jsx>{`
        .ua{display:flex;flex-direction:column;gap:8px;min-width:280px}
        .ua-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
        .ua-btn{padding:8px 14px;background:#F7F5F0;color:#111;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:border-color .12s,background .12s}
        .ua-btn:hover:not(:disabled){border-color:#D6B980}
        .ua-btn:disabled{opacity:.5;cursor:not-allowed}
        .ua-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-color:#B8A789}
        .ua-btn--danger{background:#fff;color:#B91C1C;border-color:#FEE2E2}
        .ua-btn--danger:hover:not(:disabled){background:#FEE2E2}
        .ua-btn--success{background:#DCFCE7;color:#166534;border-color:#BBF7D0}
        .ua-panel{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:6px}
        .ua-panel label{font-size:11.5px;color:#374151;font-weight:600}
        .ua-panel input,.ua-panel select,.ua-panel textarea{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:13px;color:#111;background:#FAFAF8;outline:none;resize:vertical}
        .ua-panel input:focus,.ua-panel select:focus,.ua-panel textarea:focus{border-color:#D6B980;background:#fff}
        .ua-mini{font-size:12px;color:#6B7280;padding-bottom:4px}
        .ua-mini b{color:#B8A789;font-family:ui-monospace,monospace;font-weight:700}
      `}</style>
    </div>
  );
}
