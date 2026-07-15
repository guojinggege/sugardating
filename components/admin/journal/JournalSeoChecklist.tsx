"use client";
// SEO 检查清单 · 逐项显示 · 得分 · 颜色分级
import type { SeoReport } from "@/lib/journal/seo";

interface Props { report: SeoReport }

export default function JournalSeoChecklist({ report }: Props) {
  const scoreColor = report.score >= 80 ? "#16A34A" : report.score >= 55 ? "#EAB308" : "#B91C1C";
  const scoreLabel = report.score >= 80 ? "优秀" : report.score >= 55 ? "可发布" : "待优化";

  return (
    <div className="sc">
      <div className="sc-score">
        <div className="sc-num" style={{ color: scoreColor }}>{report.score}</div>
        <div className="sc-meta">
          <b>SEO 综合得分</b>
          <span style={{ color: scoreColor }}>{scoreLabel}</span>
        </div>
      </div>
      <ul className="sc-list">
        {report.checks.map((c) => (
          <li key={c.key} className={`sc-item sc-item--${c.level}`}>
            <span className="sc-dot">
              {c.level === "ok" ? "✓" : c.level === "warn" ? "!" : "×"}
            </span>
            <div>
              <b>{c.label}</b>
              <em>{c.hint}</em>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        .sc{display:flex;flex-direction:column;gap:10px}
        .sc-score{display:flex;align-items:center;gap:12px;padding:12px 14px;background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border:1px solid #EEE9DC;border-radius:10px}
        .sc-num{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:40px;font-weight:600;line-height:1;letter-spacing:-0.01em}
        .sc-meta{display:flex;flex-direction:column}
        .sc-meta b{font-size:11.5px;color:#374151;font-weight:700;letter-spacing:.02em}
        .sc-meta span{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
        .sc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .sc-item{display:flex;gap:10px;align-items:flex-start;padding:8px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:8px}
        .sc-item--ok{border-color:#BBF7D0}
        .sc-item--warn{background:#FEF3C7;border-color:#F5D073}
        .sc-item--error{background:#FEE2E2;border-color:#FCA5A5}
        .sc-dot{flex-shrink:0;width:16px;height:16px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff}
        .sc-item--ok .sc-dot{background:#16A34A}
        .sc-item--warn .sc-dot{background:#EAB308}
        .sc-item--error .sc-dot{background:#DC2626}
        .sc-item b{display:block;font-size:12px;color:#111;font-weight:700;line-height:1.3}
        .sc-item em{font-size:11px;color:#6B7280;font-style:normal;line-height:1.35;display:block;margin-top:1px}
      `}</style>
    </div>
  );
}
