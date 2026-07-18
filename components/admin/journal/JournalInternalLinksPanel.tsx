"use client";
// Internal links · 服务端扫描 · 一键 apply 到 blocks
import { useState, useCallback } from "react";
import type { CmsJournalBlock } from "@/lib/cms/types";
import { applyInlineLink } from "@/lib/journal/apply-inline-link";

interface Suggestion {
  id: string;
  phrase: string;
  url: string;
  blockIndex: number;
  contextSnippet: string;
  kind: "channel" | "product" | "area" | "post";
  reason: string;
}

interface Props {
  blocks: CmsJournalBlock[];
  currentSlug?: string;
  onApply: (blockIndex: number, nextText: string) => void;
}

const KIND_LABEL: Record<Suggestion["kind"], string> = {
  channel: "频道",
  product: "产品",
  area:    "地区",
  post:    "已有文章",
};

export default function JournalInternalLinksPanel({ blocks, currentSlug, onApply }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const scan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/admin/journal/internal-links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          blocks: blocks.map((b) => ({ type: b.type, text: b.text, items: b.items })),
          slug: currentSlug,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "扫描失败");
      setSuggestions(d.suggestions as Suggestion[]);
      setApplied(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "扫描失败");
    } finally { setLoading(false); }
  }, [blocks, currentSlug]);

  function apply(sug: Suggestion) {
    const target = blocks[sug.blockIndex];
    if (!target?.text) return;
    const next = applyInlineLink(target.text, sug.phrase, sug.url);
    if (next === target.text) return;   // 短语已消失/被替换
    onApply(sug.blockIndex, next);
    setApplied((s) => new Set([...s, sug.id]));
  }

  function applyAll() {
    // 按 blockIndex 依次应用 · 避免同一 block 多次替换错位
    const byBlock = new Map<number, Suggestion[]>();
    for (const s of suggestions) {
      if (applied.has(s.id)) continue;
      const arr = byBlock.get(s.blockIndex) ?? [];
      arr.push(s);
      byBlock.set(s.blockIndex, arr);
    }
    for (const [idx, arr] of byBlock) {
      let text = blocks[idx]?.text;
      if (!text) continue;
      for (const s of arr) {
        const next = applyInlineLink(text, s.phrase, s.url);
        if (next !== text) {
          text = next;
          setApplied((prev) => new Set([...prev, s.id]));
        }
      }
      onApply(idx, text);
    }
  }

  const pending = suggestions.filter((s) => !applied.has(s.id));

  return (
    <div className="il">
      <div className="il-h">
        <div>
          <b>内链推荐 · {suggestions.length} 条</b>
          <span>扫描频道 / 产品 / London 区域 / 已有 Journal 文章的关键短语</span>
        </div>
        <div className="il-actions">
          {suggestions.length > 0 && pending.length > 0 && (
            <button type="button" onClick={applyAll} className="il-apply-all">全部应用 ({pending.length})</button>
          )}
          <button type="button" onClick={scan} disabled={loading} className="il-scan">
            {loading ? "扫描中…" : suggestions.length ? "重新扫描" : "扫描内链机会"}
          </button>
        </div>
      </div>
      {error && <div className="il-err">{error}</div>}

      {suggestions.length === 0 && !loading && (
        <div className="il-empty">先在正文写好内容 · 再扫描内链机会 · 命中后一键插入 [文本](/内部链接) 到相应段落</div>
      )}

      {suggestions.length > 0 && (
        <ul className="il-list">
          {suggestions.map((s) => {
            const isApplied = applied.has(s.id);
            return (
              <li key={s.id} className={"il-item" + (isApplied ? " is-applied" : "")}>
                <div className="il-item-body">
                  <div className="il-phrase">
                    <span className={`il-kind il-kind--${s.kind}`}>{KIND_LABEL[s.kind]}</span>
                    <b>{s.phrase}</b>
                    <span className="il-arrow">→</span>
                    <code>{s.url}</code>
                  </div>
                  <div className="il-snippet">…{s.contextSnippet}…</div>
                  <div className="il-reason">{s.reason} · Block #{s.blockIndex + 1}</div>
                </div>
                <button
                  type="button"
                  onClick={() => apply(s)}
                  disabled={isApplied}
                  className={"il-apply" + (isApplied ? " is-applied" : "")}
                >{isApplied ? "已插入 ✓" : "插入"}</button>
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .il{display:flex;flex-direction:column;gap:10px}
        .il-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
        .il-h b{display:block;font-size:12.5px;color:#111;font-weight:700}
        .il-h span{font-size:10.5px;color:#9CA3AF;line-height:1.4}
        .il-actions{display:flex;gap:6px;flex-shrink:0}
        .il-scan,.il-apply-all{background:#111;color:#EEDDB8;border:0;padding:6px 12px;font:inherit;font-size:11.5px;font-weight:700;border-radius:99px;cursor:pointer}
        .il-apply-all{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .il-scan:disabled{opacity:.5;cursor:not-allowed}
        .il-empty{font-size:12px;color:#9CA3AF;padding:14px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:10px;text-align:center;line-height:1.55}
        .il-err{padding:8px 12px;background:#FEE2E2;color:#B91C1C;border-radius:8px;font-size:12px}
        .il-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto}
        .il-item{display:flex;gap:10px;padding:10px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:10px;align-items:center}
        .il-item.is-applied{background:#DCFCE7;border-color:#BBF7D0}
        .il-item-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
        .il-phrase{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12.5px;color:#111}
        .il-phrase b{font-weight:700}
        .il-arrow{color:#9CA3AF;font-size:11px}
        .il-phrase code{background:#F3F4F6;color:#374151;padding:1px 6px;border-radius:4px;font-size:11px}
        .il-kind{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#fff;padding:1px 6px;border-radius:4px;font-weight:700}
        .il-kind--channel{background:#111}
        .il-kind--product{background:#B8A789;color:#1a1409}
        .il-kind--area{background:#0369A1}
        .il-kind--post{background:#7C3AED}
        .il-snippet{font-size:11px;color:#6B7280;line-height:1.45;font-style:italic;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
        .il-reason{font-size:10.5px;color:#9CA3AF}
        .il-apply{background:#F7F5F0;color:#111;border:1px solid #E5E7EB;padding:5px 12px;font:inherit;font-size:11px;font-weight:700;border-radius:99px;cursor:pointer;flex-shrink:0}
        .il-apply:hover:not(:disabled){border-color:#D6B980}
        .il-apply.is-applied{background:#16A34A;color:#fff;border-color:transparent}
        .il-apply:disabled{cursor:default}
      `}</style>
    </div>
  );
}
