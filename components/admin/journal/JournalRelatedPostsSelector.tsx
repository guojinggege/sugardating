"use client";
// Related posts · 服务端打分推荐 + 人工锁定 · 最多 5 篇
import { useState, useCallback } from "react";

interface Candidate {
  slug: string;
  title: string;
  categorySlug: string;
  coverImage: string;
  publishedAt: string;
  excerpt: string;
  score: number;
  reasons: string[];
}

interface Props {
  categorySlug: string;
  tags: string[];
  primaryKeyword?: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  currentSlug?: string;
  value: string[];                          // pinned slugs
  onChange: (next: string[]) => void;
}

const MAX_PIN = 5;

export default function JournalRelatedPostsSelector({
  categorySlug, tags, primaryKeyword, secondaryKeywords, longTailKeywords,
  currentSlug, value, onChange,
}: Props) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  const scan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/admin/journal/related-posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          categorySlug, tags, primaryKeyword, secondaryKeywords, longTailKeywords,
          slug: currentSlug, limit: 12,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "获取失败");
      setCandidates(d.candidates as Candidate[]);
      setScanned(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "获取失败");
    } finally { setLoading(false); }
  }, [categorySlug, tags, primaryKeyword, secondaryKeywords, longTailKeywords, currentSlug]);

  function toggle(slug: string) {
    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug));
    } else {
      if (value.length >= MAX_PIN) return;
      onChange([...value, slug]);
    }
  }

  const pinned = candidates.filter((c) => value.includes(c.slug));
  const others = candidates.filter((c) => !value.includes(c.slug));

  return (
    <div className="rp">
      <div className="rp-h">
        <div>
          <b>已锁定 · {value.length}/{MAX_PIN}</b>
          <span>推荐算法:分类 +40 · Tag 交集 +10/个 · 主关键词 +25 · 长尾 +5/个</span>
        </div>
        <button type="button" onClick={scan} disabled={loading} className="rp-scan">
          {loading ? "扫描中…" : scanned ? "重新扫描" : "扫描候选文章"}
        </button>
      </div>
      {error && <div className="rp-err">{error}</div>}

      {value.length === 0 && !scanned && (
        <div className="rp-empty">点击「扫描候选文章」自动匹配 · 选中最多 {MAX_PIN} 篇锁定为相关文章</div>
      )}

      {pinned.length > 0 && (
        <>
          <div className="rp-sub">已锁定</div>
          <div className="rp-list">
            {pinned.map((c) => renderCard(c, true, () => toggle(c.slug)))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <div className="rp-sub">推荐候选</div>
          <div className="rp-list">
            {others.map((c) => renderCard(c, false, () => toggle(c.slug), value.length >= MAX_PIN))}
          </div>
        </>
      )}

      {scanned && candidates.length === 0 && (
        <div className="rp-empty">无相关文章 · 请先填写分类、tag 或关键词后再扫描</div>
      )}

      <style>{`
        .rp{display:flex;flex-direction:column;gap:10px}
        .rp-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
        .rp-h b{display:block;font-size:12.5px;color:#111;font-weight:700}
        .rp-h span{font-size:10.5px;color:#9CA3AF;line-height:1.4}
        .rp-scan{background:#111;color:#EEDDB8;border:0;padding:6px 12px;font:inherit;font-size:11.5px;font-weight:700;border-radius:99px;cursor:pointer;flex-shrink:0}
        .rp-scan:disabled{opacity:.5;cursor:not-allowed}
        .rp-sub{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-top:6px}
        .rp-list{display:flex;flex-direction:column;gap:6px}
        .rp-empty{font-size:12px;color:#9CA3AF;padding:14px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:10px;text-align:center}
        .rp-err{padding:8px 12px;background:#FEE2E2;color:#B91C1C;border-radius:8px;font-size:12px}
      `}</style>
    </div>
  );
}

function renderCard(c: Candidate, pinned: boolean, onToggle: () => void, disabled = false) {
  return (
    <div key={c.slug} className={"rp-card" + (pinned ? " is-pin" : "")}>
      <div className="rp-card-body">
        <div className="rp-card-t" title={c.title}>{c.title}</div>
        <div className="rp-card-meta">
          <span className="rp-score" title={c.reasons.join(" · ")}>Score {c.score}</span>
          <span className="rp-slug">/community/{c.categorySlug}/post/{c.slug}</span>
        </div>
        <div className="rp-card-reasons">{c.reasons.slice(0, 2).join(" · ")}</div>
      </div>
      <button type="button" onClick={onToggle} disabled={!pinned && disabled}
        className={"rp-toggle" + (pinned ? " is-pin" : "")}>
        {pinned ? "已锁 ✓" : "锁定"}
      </button>
      <style>{`
        .rp-card{display:flex;gap:10px;align-items:center;padding:10px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:10px}
        .rp-card.is-pin{background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border-color:#D6B980}
        .rp-card-body{flex:1;min-width:0}
        .rp-card-t{font-size:12.5px;font-weight:700;color:#111;line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;letter-spacing:-0.005em}
        .rp-card-meta{display:flex;gap:8px;font-size:10.5px;color:#9CA3AF;margin-top:2px;font-variant-numeric:tabular-nums}
        .rp-score{background:#F3F4F6;padding:1px 6px;border-radius:4px;color:#374151;font-weight:600}
        .rp-slug{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,monospace}
        .rp-card-reasons{font-size:10.5px;color:#6B7280;margin-top:2px;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .rp-toggle{background:#F7F5F0;color:#111;border:1px solid #E5E7EB;padding:5px 10px;font:inherit;font-size:11px;font-weight:700;border-radius:99px;cursor:pointer;flex-shrink:0}
        .rp-toggle:hover:not(:disabled){border-color:#D6B980}
        .rp-toggle.is-pin{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-color:transparent}
        .rp-toggle:disabled{opacity:.4;cursor:not-allowed}
      `}</style>
    </div>
  );
}
