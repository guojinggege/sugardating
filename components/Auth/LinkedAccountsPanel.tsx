"use client";
// 账号安全 · 已关联账号 · 邮箱始终为主身份 · Apple / X 可选关联
import { useEffect, useState } from "react";
import type { LinkedAccount, LinkedProvider } from "@/lib/auth/linked-accounts";

interface Data {
  ok: boolean;
  linked: LinkedAccount[];
  capability: { apple: boolean; x: boolean };
  email: { address: string; verified: boolean };
}

export default function LinkedAccountsPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function refresh() {
    const r = await fetch("/api/auth/linked", { credentials: "include" });
    const d = await r.json();
    if (d?.ok) setData(d);
  }
  useEffect(() => { refresh(); }, []);

  async function linkStart(provider: LinkedProvider) {
    if (busy) return;
    setBusy(provider); setMsg(null);
    try {
      const r = await fetch(`/api/auth/link/${provider}/init`, { method: "POST", credentials: "include" });
      const d = await r.json();
      if (!r.ok || !d?.ok) throw new Error(d?.message || "关联失败");
      // 真实 OAuth · 跳转 provider authorize URL (未来接入时启用)
    } catch (e) {
      setMsg({ tone: "err", text: e instanceof Error ? e.message : "关联失败" });
    } finally {
      setBusy(null);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  async function doUnlink(provider: LinkedProvider) {
    if (busy) return;
    if (!confirm(`确认解除 ${provider === "apple" ? "Apple" : "X"} 关联?邮箱仍可正常登录。`)) return;
    setBusy(provider); setMsg(null);
    try {
      const r = await fetch(`/api/auth/link/${provider}`, { method: "DELETE", credentials: "include" });
      const d = await r.json();
      if (!r.ok || !d?.ok) throw new Error(d?.message || "解除失败");
      setMsg({ tone: "ok", text: "已解除关联" });
      refresh();
    } catch (e) {
      setMsg({ tone: "err", text: e instanceof Error ? e.message : "解除失败" });
    } finally {
      setBusy(null);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  if (!data) return null;

  const rows: Array<{
    key: string; label: string; sub: string; provider: LinkedProvider | "email";
    available: boolean; account?: LinkedAccount;
  }> = [
    {
      key: "email", label: "邮箱 (主身份)", sub: data.email.address,
      provider: "email", available: true,
    },
    {
      key: "apple", label: "Apple ID", sub: "登录时可使用 Apple 快速进入",
      provider: "apple", available: data.capability.apple,
      account: data.linked.find((a) => a.provider === "apple"),
    },
    {
      key: "x", label: "X (Twitter)", sub: "登录时可使用 X 快速进入",
      provider: "x", available: data.capability.x,
      account: data.linked.find((a) => a.provider === "x"),
    },
  ];

  return (
    <div className="lap">
      <div className="lap-h">
        <div>
          <b>已关联账号</b>
          <span>邮箱是主身份,Apple / X 只作为登录快捷方式</span>
        </div>
      </div>
      <ul className="lap-list">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="lap-body">
              <div className="lap-t">
                <b>{r.label}</b>
                {r.provider === "email" && data.email.verified && <span className="lap-tag ok">已验证</span>}
                {r.account && <span className="lap-tag ok">已关联</span>}
                {r.provider !== "email" && !r.account && !r.available && <span className="lap-tag warn">暂未开放</span>}
                {r.provider !== "email" && !r.account && r.available && <span className="lap-tag">未关联</span>}
              </div>
              <em>{r.sub}</em>
              {r.account?.lastUsedAt && (
                <em className="lap-last">最近使用 · {new Date(r.account.lastUsedAt).toLocaleDateString("zh-CN")}</em>
              )}
            </div>
            <div className="lap-actions">
              {r.provider === "email" && <span className="lap-mute">主身份</span>}
              {r.provider !== "email" && r.account && (
                <button type="button" onClick={() => doUnlink(r.provider as LinkedProvider)} disabled={!!busy} className="lap-btn lap-btn--danger">
                  解除
                </button>
              )}
              {r.provider !== "email" && !r.account && r.available && (
                <button type="button" onClick={() => linkStart(r.provider as LinkedProvider)} disabled={!!busy} className="lap-btn lap-btn--dark">
                  {busy === r.provider ? "…" : "关联"}
                </button>
              )}
              {r.provider !== "email" && !r.account && !r.available && (
                <button type="button" disabled className="lap-btn lap-btn--disabled">
                  暂未开放
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {msg && <div className={"lap-msg " + msg.tone}>{msg.text}</div>}

      <style>{`
        .lap{display:flex;flex-direction:column;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}
        .lap-h b{display:block;font-size:13.5px;color:var(--ink);font-weight:800}
        .lap-h span{font-size:11.5px;color:var(--muted)}
        .lap-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .lap-list li{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FAFAF8;border:1px solid var(--line);border-radius:10px}
        .lap-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
        .lap-t{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}
        .lap-t b{font-size:13px;color:var(--ink);font-weight:800}
        .lap-tag{font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:800;padding:2px 8px;border-radius:99px;background:var(--page);color:var(--muted);border:1px solid var(--line)}
        .lap-tag.ok{background:rgba(34,197,94,.1);color:#16a34a;border-color:rgba(34,197,94,.3)}
        .lap-tag.warn{background:rgba(183,121,69,.14);color:#7A4C27;border-color:rgba(183,121,69,.3)}
        .lap-body em{font-size:11.5px;color:var(--muted);font-style:normal}
        .lap-last{font-size:10.5px !important;color:#a19a91 !important;margin-top:1px}
        .lap-actions{flex-shrink:0}
        .lap-mute{font-size:10.5px;color:#a19a91;letter-spacing:.08em;text-transform:uppercase;font-weight:700}
        .lap-btn{padding:6px 14px;border-radius:99px;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer;border:1px solid transparent}
        .lap-btn:disabled{opacity:.5;cursor:not-allowed}
        .lap-btn--dark{background:#171512;color:#fff;border-color:#171512}
        .lap-btn--danger{background:#fff;color:#B91C1C;border-color:#FEE2E2}
        .lap-btn--danger:hover{background:#FEE2E2}
        .lap-btn--disabled{background:var(--page);color:var(--muted);border-color:var(--line)}
        .lap-msg{padding:8px 12px;border-radius:8px;font-size:12.5px;font-weight:600}
        .lap-msg.ok{background:rgba(34,197,94,.1);color:#16a34a}
        .lap-msg.err{background:#FEE2E2;color:#B91C1C}
      `}</style>
    </div>
  );
}
