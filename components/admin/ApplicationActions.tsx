"use client";
// Application approve / reject 快捷操作 client 组件
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApplicationStatus } from "@/lib/cms/types";

interface Props {
  id: string;
  status: ApplicationStatus;
}

export default function ApplicationActions({ id, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject") {
    if (busy) return;
    if (action === "reject" && !confirm("确认拒绝此入驻申请?")) return;
    setBusy(action);
    try {
      const r = await fetch(`/api/admin/applications/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.message || "操作失败");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "操作失败,请重试");
    } finally { setBusy(null); }
  }

  if (status === "approved" || status === "rejected") {
    return <span style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>已完结</span>;
  }

  return (
    <div className="aa">
      <button type="button" onClick={() => act("reject")} disabled={!!busy} className="aa-btn aa-btn--rej">
        {busy === "reject" ? "…" : "拒绝"}
      </button>
      <button type="button" onClick={() => act("approve")} disabled={!!busy} className="aa-btn aa-btn--app">
        {busy === "approve" ? "…" : "通过"}
      </button>
      <style jsx>{`
        .aa{display:inline-flex;gap:4px}
        .aa-btn{padding:5px 12px;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;border:1px solid transparent;transition:opacity .12s}
        .aa-btn:disabled{opacity:.5;cursor:not-allowed}
        .aa-btn--rej{background:#fff;color:#B91C1C;border-color:#FEE2E2}
        .aa-btn--rej:hover:not(:disabled){background:#FEE2E2}
        .aa-btn--app{background:#111;color:#EEDDB8}
        .aa-btn--app:hover:not(:disabled){background:#000}
      `}</style>
    </div>
  );
}
