"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserNotesForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}/notes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "添加失败");
      setText("");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "添加失败");
    } finally { setBusy(false); }
  }

  return (
    <div className="nf">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
        placeholder="添加内部备注 · 前台用户不可见" maxLength={500} />
      <button type="button" onClick={add} disabled={busy || !text.trim()}>
        {busy ? "添加中…" : "添加备注"}
      </button>
      <style jsx>{`
        .nf{display:flex;flex-direction:column;gap:6px}
        .nf textarea{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:13px;color:#111;background:#FAFAF8;outline:none;resize:vertical}
        .nf textarea:focus{border-color:#D6B980;background:#fff}
        .nf button{align-self:flex-end;padding:6px 14px;background:#111;color:#EEDDB8;border:0;border-radius:8px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
        .nf button:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
    </div>
  );
}
