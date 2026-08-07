"use client";
// Admin · 入驻意向详情按钮 · 打开 modal 展示完整联系方式 + 更新状态/备注
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Interest {
  id: string;
  nickname: string;
  city: string;
  status: string;                  // student | employed | freelancer
  telephone: string | null;
  email: string | null;
  mobile: string | null;
  locale: string | null;
  source: string | null;
  createdAt: string;
  reviewStatus: string;
  reviewNotes: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

const STATUS_ZH: Record<string, string> = {
  submitted: "已提交", reviewing: "审核中", needs_changes: "需补充",
  approved: "已通过", rejected: "已拒绝",
};
const CUR_ZH: Record<string, string> = {
  student: "留学生", employed: "工作者", freelancer: "自由职业",
};

export default function ApplicationDetailButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Interest | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  async function loadDetail() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/applications/${id}`, { credentials: "include", cache: "no-store" });
      const d = await r.json();
      if (r.ok && d?.ok && d.interest) {
        setData(d.interest);
        setNotes(d.interest.reviewNotes ?? "");
        setStatus(d.interest.reviewStatus);
      }
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!open) return;
    loadDetail();
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!data || saving) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) { alert(d?.message || "保存失败"); return; }
      setOpen(false);
      router.refresh();
    } finally { setSaving(false); }
  }

  return (
    <>
      <button type="button" className="adb-open" onClick={() => setOpen(true)}>详情</button>
      {open && (
        <div className="adb-scrim" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="adb-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="adb-close" onClick={() => setOpen(false)} aria-label="close">✕</button>
            <h3>入驻意向详情</h3>
            {loading && <div className="adb-hint">加载中…</div>}
            {!loading && data && (
              <div className="adb-body">
                <div className="adb-grid">
                  <Row k="昵称" v={data.nickname} />
                  <Row k="城市" v={data.city} />
                  <Row k="当前状态" v={CUR_ZH[data.status] || data.status} />
                  <Row k="邮箱" v={data.email || "—"} mono />
                  <Row k="手机号" v={data.mobile || "—"} mono />
                  <Row k="联系电话" v={data.telephone || "—"} mono />
                  <Row k="页面语言" v={data.locale || "—"} />
                  <Row k="来源" v={data.source || "—"} />
                  <Row k="提交时间" v={new Date(data.createdAt).toLocaleString("zh-CN", { hour12: false })} mono />
                </div>
                <hr />
                <label className="adb-lbl">审核状态</label>
                <select className="adb-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {Object.entries(STATUS_ZH).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <label className="adb-lbl">备注(仅内部可见)</label>
                <textarea className="adb-textarea" rows={4} value={notes} maxLength={500}
                  onChange={(e) => setNotes(e.target.value)} placeholder="如需补充或拒绝原因,记录在此" />
                <div className="adb-actions">
                  <button type="button" className="adb-btn" onClick={() => setOpen(false)}>关闭</button>
                  <button type="button" className="adb-btn adb-btn--primary" onClick={save} disabled={saving}>
                    {saving ? "保存中…" : "保存"}
                  </button>
                </div>
                {data.reviewedAt && (
                  <div className="adb-audit">
                    最近更新:{new Date(data.reviewedAt).toLocaleString("zh-CN", { hour12: false })}
                    {data.reviewedBy ? ` · by ${data.reviewedBy}` : ""}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .adb-open{padding:5px 10px;border-radius:99px;font-size:11.5px;font-weight:700;background:#F7F5F0;color:#374151;border:1px solid #E5E7EB;cursor:pointer}
        .adb-open:hover{background:#111;color:#EEDDB8;border-color:#111}
        .adb-scrim{position:fixed;inset:0;background:rgba(23,21,18,.55);backdrop-filter:blur(6px);z-index:100;display:grid;place-items:center;padding:20px}
        .adb-card{position:relative;background:#fff;border-radius:16px;max-width:560px;width:100%;padding:22px 22px 18px;box-shadow:0 40px 100px -30px rgba(0,0,0,.5);max-height:calc(100dvh - 40px);overflow-y:auto}
        .adb-close{position:absolute;top:12px;right:12px;width:30px;height:30px;background:#F3F4F6;border:0;border-radius:50%;color:#6B7280;cursor:pointer;font-size:14px}
        .adb-card h3{margin:0 0 14px;font-size:16px;color:#111;font-weight:800}
        .adb-hint{padding:20px;color:#6B7280;font-size:13px;text-align:center}
        .adb-body{display:flex;flex-direction:column;gap:12px}
        .adb-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px}
        hr{border:0;border-top:1px solid #E5E7EB;margin:4px 0}
        .adb-lbl{font-size:12px;font-weight:700;color:#374151;margin-top:6px}
        .adb-input,.adb-textarea{width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #D1D5DB;border-radius:8px;font-size:13px;font-family:inherit;color:#111;outline:none;background:#fff}
        .adb-textarea{resize:vertical;min-height:80px}
        .adb-input:focus,.adb-textarea:focus{border-color:#111}
        .adb-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:6px}
        .adb-btn{padding:8px 16px;border-radius:8px;font-size:12.5px;font-weight:700;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer}
        .adb-btn:hover:not(:disabled){background:#F3F4F6}
        .adb-btn--primary{background:#111;color:#EEDDB8;border-color:#111}
        .adb-btn--primary:hover:not(:disabled){background:#000}
        .adb-btn:disabled{opacity:.6;cursor:not-allowed}
        .adb-audit{font-size:11px;color:#9CA3AF;text-align:right}
        @media(max-width:640px){
          .adb-grid{grid-template-columns:1fr}
          .adb-card{padding:18px 16px}
        }
      `}</style>
    </>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{k}</div>
      <div style={{ fontSize: 13, color: "#111", fontWeight: 700, wordBreak: "break-all", fontFamily: mono ? "ui-monospace, SFMono-Regular, monospace" : "inherit" }}>{v}</div>
    </div>
  );
}
