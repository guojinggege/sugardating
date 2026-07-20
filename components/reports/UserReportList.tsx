import Link from "next/link";
import type { Report, ReportStatus } from "@/lib/reports/types";
import { getCategoryMeta } from "@/lib/reports/categories";

interface Props { reports: Report[] }

const STATUS_LABEL: Record<ReportStatus, { label: string; bg: string; fg: string }> = {
  submitted:         { label: "已提交",     bg: "#F0EAE1", fg: "#77716A" },
  reviewing:         { label: "处理中",     bg: "#E4EBF3", fg: "#4B5E80" },
  awaiting_evidence: { label: "等待补充",   bg: "#FBEDD5", fg: "#7A4C27" },
  resolved:          { label: "已完成",     bg: "#DCEEDF", fg: "#2B6249" },
  dismissed:         { label: "已驳回",     bg: "#F3F1EE", fg: "#a19a91" },
  escalated:         { label: "已上报",     bg: "#F1E1E4", fg: "#8C4B54" },
};

function fmtAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  return `${Math.floor(d / 30)} 月前`;
}

export default function UserReportList({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="url-empty">
        <div className="url-empty-h">你还没有提交过举报</div>
        <p>如果遇到线上或线下问题,可以通过下方按钮提交。所有举报仅供授权安全人员查看。</p>
        <Link href="/me/reports/new" className="url-empty-cta">提交第一个举报</Link>
        <style>{`
          .url-empty{background:#fff;border:1px dashed var(--line);border-radius:16px;padding:44px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
          .url-empty-h{font-size:16px;color:var(--ink);font-weight:800}
          .url-empty p{font-size:13px;color:var(--muted);margin:0;max-width:42ch;line-height:1.7}
          .url-empty-cta{margin-top:6px;padding:10px 20px;background:var(--ink);color:#fff;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none}
          .url-empty-cta:hover{background:#2b2822}
        `}</style>
      </div>
    );
  }

  return (
    <ul className="url">
      {reports.map((r) => {
        const cat = getCategoryMeta(r.category);
        const s = STATUS_LABEL[r.status];
        const lastAction = r.actions[r.actions.length - 1];
        return (
          <li key={r.id}>
            <Link href={`/me/reports/${r.id}`} className="url-card">
              <div className="url-h">
                <span className="url-ref">{r.publicRef}</span>
                <span className="url-badge" style={{ background: s.bg, color: s.fg }}>{s.label}</span>
                <span className="url-scene">{r.scene === "online" ? "线上" : "线下"} · {cat?.label ?? r.category}</span>
                <time>{fmtAgo(r.createdAt)}</time>
              </div>
              <div className="url-t">{r.title}</div>
              {r.target.label && <div className="url-target">对象: {r.target.label}</div>}
              {lastAction && lastAction.visibleToUser && lastAction.message && (
                <div className="url-last">
                  <b>{lastAction.actorName || "S&T 团队"}:</b> {lastAction.message}
                </div>
              )}
              <div className="url-foot">
                <span>{r.evidence.length} 份材料</span>
                <span>{r.actions.filter((a) => a.visibleToUser).length} 条互动</span>
                <span className="url-open">查看详情 →</span>
              </div>
            </Link>
          </li>
        );
      })}
      <style>{`
        .url{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
        .url-card{display:flex;flex-direction:column;gap:6px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px 18px;text-decoration:none;color:var(--ink);transition:border-color .12s,box-shadow .12s}
        .url-card:hover{border-color:#D6B980;box-shadow:0 8px 24px -14px rgba(23,21,18,.14)}
        .url-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px;color:var(--muted)}
        .url-ref{font-family:ui-monospace,monospace;font-size:11px;color:#77716A;background:#F7F4EF;padding:2px 8px;border-radius:6px;font-weight:700}
        .url-badge{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;padding:3px 10px;border-radius:99px}
        .url-scene{color:#77716A;font-weight:500}
        .url-h time{margin-left:auto;font-variant-numeric:tabular-nums}
        .url-t{font-size:14.5px;color:var(--ink);font-weight:700;line-height:1.35;letter-spacing:-0.005em}
        .url-target{font-size:12px;color:#77716A}
        .url-last{margin-top:4px;padding:8px 12px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:8px;font-size:12.5px;line-height:1.55;color:#3d3a35}
        .url-last b{color:var(--ink);font-weight:700}
        .url-foot{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px dashed #F0EAE1;font-size:11.5px;color:var(--muted)}
        .url-open{color:var(--ink);font-weight:700}
      `}</style>
    </ul>
  );
}
