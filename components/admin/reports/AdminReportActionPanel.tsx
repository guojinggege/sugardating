"use client";
// Admin 行动面板 · 追加公开回复 · 内部备注 · 要求补充 · 处理完成 · 驳回 · 上报
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReportActionKind } from "@/lib/reports/types";

interface Props {
  reportId: string;
  currentStatus: string;
}

const ACTIONS: { kind: ReportActionKind; label: string; placeholder: string; tone: string }[] = [
  { kind: "reply",             label: "公开回复",       placeholder: "用户可见的回复 · 例:已核实,已限制对方账号",  tone: "#4B5E80" },
  { kind: "request_evidence",  label: "要求补充材料",   placeholder: "告诉用户需要什么材料 · 例:视频通话截图",       tone: "#B77945" },
  { kind: "internal_note",     label: "内部备注",       placeholder: "仅内部可见 · 用户看不到",                       tone: "#77716A" },
  { kind: "resolve",           label: "处理完成",       placeholder: "关闭理由 · 会显示给用户",                       tone: "#42856B" },
  { kind: "dismiss",           label: "驳回",           placeholder: "驳回理由 · 会显示给用户",                       tone: "#a19a91" },
  { kind: "escalate",          label: "上报合规团队",   placeholder: "上报理由 · 会显示给用户",                       tone: "#8C4B54" },
];

export default function AdminReportActionPanel({ reportId, currentStatus }: Props) {
  const router = useRouter();
  const [kind, setKind] = useState<ReportActionKind>("reply");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignTo, setAssignTo] = useState("");

  const cur = ACTIONS.find((a) => a.kind === kind)!;

  async function submit() {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actionKind: kind,
          message: message.trim() || undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "操作失败");
      setMessage("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    } finally { setBusy(false); }
  }

  async function doAssign() {
    if (busy || !assignTo.trim()) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ assignTo: assignTo.trim() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "分配失败");
      setAssignTo("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "分配失败");
    } finally { setBusy(false); }
  }

  return (
    <div className="ap">
      <div className="ap-h">
        <b>Admin 行动</b>
        <span>当前状态 · {currentStatus}</span>
      </div>

      <div className="ap-actions">
        {ACTIONS.map((a) => (
          <button key={a.kind} type="button" onClick={() => setKind(a.kind)}
            className={"ap-tab" + (kind === a.kind ? " is-active" : "")}
            style={kind === a.kind ? { background: a.tone, color: "#fff", borderColor: a.tone } : {}}>
            {a.label}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
        placeholder={cur.placeholder}
        rows={4}
      />
      <div className="ap-foot">
        <span>{message.length}/2000</span>
        <button type="button" onClick={submit} disabled={busy} className="ap-submit"
          style={{ background: cur.tone }}>
          {busy ? "处理中…" : `执行 · ${cur.label}`}
        </button>
      </div>

      <div className="ap-assign">
        <label>
          <span>分配处理人</span>
          <input type="email" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}
            placeholder="admin@sugardating.local" />
        </label>
        <button type="button" onClick={doAssign} disabled={busy || !assignTo.trim()} className="ap-assign-btn">
          分配
        </button>
      </div>

      {error && <div className="ap-err">{error}</div>}

      <style>{`
        .ap{display:flex;flex-direction:column;gap:10px}
        .ap-h{display:flex;justify-content:space-between;align-items:baseline}
        .ap-h b{font-size:12.5px;color:#111;font-weight:800}
        .ap-h span{font-size:11px;color:#9CA3AF}
        .ap-actions{display:flex;flex-wrap:wrap;gap:4px}
        .ap-tab{padding:6px 10px;background:#fff;color:#374151;border:1px solid #E5E7EB;border-radius:99px;font:inherit;font-size:11.5px;font-weight:700;cursor:pointer}
        .ap-tab:hover{border-color:#374151}
        textarea{padding:10px 12px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13px;color:#111;background:#FAFAF8;outline:none;resize:vertical}
        textarea:focus{border-color:#D6B980;background:#fff}
        .ap-foot{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9CA3AF}
        .ap-submit{padding:8px 16px;color:#fff;border:0;border-radius:99px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;letter-spacing:-0.005em}
        .ap-submit:disabled{opacity:.5;cursor:not-allowed}
        .ap-assign{display:flex;gap:8px;align-items:flex-end;padding-top:10px;border-top:1px dashed #E5E7EB}
        .ap-assign label{flex:1;display:flex;flex-direction:column;gap:4px}
        .ap-assign span{font-size:11px;color:#374151;font-weight:600}
        .ap-assign input{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:12.5px;background:#FAFAF8;outline:none}
        .ap-assign input:focus{border-color:#D6B980;background:#fff}
        .ap-assign-btn{padding:8px 14px;background:#111;color:#fff;border:0;border-radius:99px;font:inherit;font-size:11.5px;font-weight:700;cursor:pointer}
        .ap-assign-btn:disabled{opacity:.4;cursor:not-allowed}
        .ap-err{padding:8px 12px;background:#FEE2E2;color:#B91C1C;border-radius:8px;font-size:12px}
      `}</style>
    </div>
  );
}
