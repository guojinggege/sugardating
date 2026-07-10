"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JournalActions({ slug, isPublished, isFeatured }: { slug: string; isPublished: boolean; isFeatured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"pub" | "feat" | null>(null);

  async function toggle(action: "pub" | "feat") {
    if (busy) return;
    setBusy(action);
    try {
      const endpoint = action === "pub" ? "publish" : "feature";
      const r = await fetch(`/api/admin/journal/posts/${slug}/${endpoint}`, { method: "POST", credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.message || "操作失败");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "操作失败");
    } finally { setBusy(null); }
  }

  return (
    <>
      <button type="button" onClick={() => toggle("feat")} disabled={!!busy} className={"ja-btn" + (isFeatured ? " ja-btn--on" : "")}>
        {busy === "feat" ? "…" : (isFeatured ? "★ Featured" : "☆")}
      </button>
      <button type="button" onClick={() => toggle("pub")} disabled={!!busy} className={"ja-btn ja-btn--pub" + (isPublished ? " ja-btn--pub-on" : "")}>
        {busy === "pub" ? "…" : (isPublished ? "下架" : "发布")}
      </button>
      <style jsx>{`
        .ja-btn{padding:5px 10px;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;border:1px solid #E5E7EB;background:#fff;color:#111;transition:background .12s,border-color .12s}
        .ja-btn:hover:not(:disabled){border-color:#D6B980}
        .ja-btn:disabled{opacity:.5;cursor:not-allowed}
        .ja-btn--on{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-color:#B8A789}
        .ja-btn--pub-on{background:#111;color:#EEDDB8;border-color:#111}
      `}</style>
    </>
  );
}
