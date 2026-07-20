"use client";
// 补交证据 · 详情页内嵌 · 状态非 resolved/dismissed 时显示
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props { reportId: string; disabled?: boolean }

export default function ReportAdditionalEvidence({ reportId, disabled }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [desc, setDesc] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0 || busy) return;
    setBusy(true); setError(null); setMsg(null);
    try {
      for (const f of Array.from(files).slice(0, 4)) {
        const r = await fetch(`/api/reports/${reportId}/evidence`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            filename: f.name,
            mimeType: f.type || "application/octet-stream",
            sizeBytes: f.size,
            description: desc || undefined,
          }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d?.ok) throw new Error(d?.message || "补交失败");
      }
      setMsg("补交成功 · 安全团队会尽快查看");
      setDesc("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "补交失败");
    } finally { setBusy(false); }
  }

  if (disabled) {
    return (
      <div className="rae rae--dis">
        此举报已完成或驳回 · 无法补交材料。如果情况有变化,可以 <a href="/me/reports/new">提交新的举报</a>。
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="rae">
      <div className="rae-h">
        <b>补充证据</b>
        <span>P0 阶段仅记录文件名和描述 · 不上传文件内容</span>
      </div>
      <input type="text" value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 500))}
        placeholder="简单描述这批材料 · 例:视频通话截图" />
      <label className="rae-drop">
        <input type="file" multiple accept="image/*,video/*,.pdf" disabled={busy}
          onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        <span>{busy ? "上传中…" : "选择文件补交"}</span>
        <em>每次最多 4 个 · 单个 ≤ 50MB</em>
      </label>
      {error && <div className="rae-err">{error}</div>}
      {msg && <div className="rae-ok">{msg}</div>}
      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .rae{background:#FBFAF7;border:1px dashed var(--line);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
  .rae--dis{background:#F3F1EE;color:#77716A;font-size:12.5px;line-height:1.6}
  .rae--dis a{color:#171512;font-weight:700}
  .rae-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
  .rae-h b{font-size:13px;color:var(--ink);font-weight:800}
  .rae-h span{font-size:10.5px;color:var(--muted)}
  .rae input[type="text"]{padding:8px 12px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:12.5px;background:#fff;outline:none}
  .rae input[type="text"]:focus{border-color:#171512}
  .rae-drop{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border:1px dashed var(--line);border-radius:10px;cursor:pointer;font-size:12.5px}
  .rae-drop:hover{border-color:#171512}
  .rae-drop input[type="file"]{display:none}
  .rae-drop span{font-weight:700;color:var(--ink)}
  .rae-drop em{color:var(--muted);font-style:normal;margin-left:auto}
  .rae-err{padding:8px 12px;background:#FEE2E2;color:#B91C1C;border-radius:8px;font-size:12px}
  .rae-ok{padding:8px 12px;background:#DCFCE7;color:#166534;border-radius:8px;font-size:12px}
`;
