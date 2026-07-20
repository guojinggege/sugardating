// Admin · 用户举报详情 + 时间线 + 行动面板
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminBadge } from "@/components/admin/AdminPrimitives";
import { getReportById } from "@/lib/reports/repository";
import { getCategoryMeta, TARGET_TYPES } from "@/lib/reports/categories";
import ReportStatusTimeline from "@/components/reports/ReportStatusTimeline";
import AdminReportActionPanel from "@/components/admin/reports/AdminReportActionPanel";
import type { ReportStatus } from "@/lib/reports/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { title: "举报详情 · Sugardating Admin" };

const STATUS_LABEL: Record<ReportStatus, string> = {
  submitted: "已提交", reviewing: "处理中", awaiting_evidence: "等待补充",
  resolved: "已完成",  dismissed: "已驳回", escalated: "已上报",
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", { hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const r = getReportById(params.id);
  if (!r) notFound();

  const catMeta = getCategoryMeta(r.category);
  const targetMeta = TARGET_TYPES.find((t) => t.key === r.target.type);

  return (
    <>
      <AdminPageHeader
        eyebrow="Safety · Report"
        title={r.publicRef}
        description={r.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "举报", href: "/admin/reports" },
          { label: r.publicRef },
        ]}
      />

      <div className="ad-grid">
        <div className="ad-main">
          <AdminCard title="举报内容">
            <div className="ad-meta">
              <AdminBadge tone={r.status === "resolved" ? "success" : r.status === "dismissed" ? "danger" : "info"}>{STATUS_LABEL[r.status]}</AdminBadge>
              <span>{r.scene === "online" ? "线上" : "线下"} · {catMeta?.label ?? r.category}</span>
              <span>严重度 · {r.severity}</span>
              <span>提交 {fmt(r.createdAt)}</span>
              {r.assignedTo && <span>处理人 {r.assignedTo}</span>}
            </div>
            <div className="ad-desc">
              {r.description.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {(r.occurredAt || r.location) && (
              <div className="ad-facts">
                {r.occurredAt && <div><b>发生时间</b><span>{fmt(r.occurredAt)}</span></div>}
                {r.location   && <div><b>地点</b><span>{r.location}</span></div>}
              </div>
            )}
          </AdminCard>

          <AdminCard title="处理时间线">
            <ReportStatusTimeline actions={r.actions} />
          </AdminCard>

          <AdminCard title={`证据 · ${r.evidence.length}`}>
            {r.evidence.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>用户未上传证据</p>
            ) : (
              <ul className="ad-ev">
                {r.evidence.map((e) => (
                  <li key={e.id}>
                    <div className="ad-ev-h">
                      <b>{e.filename}</b>
                      <span>{fmtSize(e.sizeBytes)} · {e.mimeType.split("/")[0]}</span>
                      <em>{e.addedBy === "user" ? "用户" : "内部"}</em>
                    </div>
                    {e.description && <p>{e.description}</p>}
                    <div className="ad-ev-meta">{fmt(e.addedAt)}</div>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>

        <aside className="ad-side">
          <AdminCard title="举报人">
            <div className="ad-side-body">
              <div><b>用户 ID</b><code>{r.reporterId}</code></div>
              {r.reporterEmail && <div><b>邮件</b><span>{r.reporterEmail}</span></div>}
              <div><b>联系偏好</b><span>{r.contactPreference === "in_app" ? "站内消息" : r.contactPreference === "email" ? "邮件" : "不需要联系"}</span></div>
              <Link href={`/admin/users?q=${encodeURIComponent(r.reporterEmail || r.reporterId)}`} className="ad-link">查看用户档案 →</Link>
            </div>
          </AdminCard>

          <AdminCard title="对象">
            <div className="ad-side-body">
              <div><b>类型</b><span>{targetMeta?.label ?? r.target.type}</span></div>
              {r.target.label && <div><b>展示</b><span>{r.target.label}</span></div>}
              {r.target.id && <div><b>ID</b><code>{r.target.id}</code></div>}
              {r.target.type === "creator" && r.target.id && (
                <Link href={`/admin/creators?q=${r.target.id}`} className="ad-link">查看 Creator →</Link>
              )}
            </div>
          </AdminCard>

          <AdminCard title="行动">
            <AdminReportActionPanel reportId={r.id} currentStatus={STATUS_LABEL[r.status]} />
          </AdminCard>
        </aside>
      </div>

      <style>{`
        .ad-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:flex-start}
        @media(max-width:1024px){.ad-grid{grid-template-columns:1fr}}
        .ad-main,.ad-side{display:flex;flex-direction:column;gap:16px;min-width:0}

        .ad-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#6B7280;margin-bottom:12px;align-items:center}
        .ad-desc p{margin:0 0 10px;font-size:14px;line-height:1.75;color:#374151}
        .ad-desc p:last-child{margin-bottom:0}
        .ad-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;padding-top:12px;border-top:1px dashed #F3F4F6;margin-top:12px;font-size:12.5px}
        .ad-facts b{display:block;color:#6B7280;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2px}
        .ad-facts span{color:#111;font-weight:600}

        .ad-ev{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .ad-ev li{padding:10px 12px;background:#FAFAF8;border:1px solid #E5E7EB;border-radius:10px}
        .ad-ev-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
        .ad-ev-h b{font-size:12.5px;color:#111;font-weight:700}
        .ad-ev-h span{font-size:11px;color:#9CA3AF;font-variant-numeric:tabular-nums}
        .ad-ev-h em{font-style:normal;font-size:10px;color:#B8A789;background:#FBFAF7;padding:1px 6px;border-radius:4px;font-weight:700}
        .ad-ev p{font-size:12.5px;color:#374151;margin:4px 0 0;line-height:1.55}
        .ad-ev-meta{font-size:10.5px;color:#9CA3AF;margin-top:4px}

        .ad-side-body{display:flex;flex-direction:column;gap:8px;font-size:12.5px}
        .ad-side-body > div{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
        .ad-side-body b{color:#6B7280;font-weight:600;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
        .ad-side-body span{color:#111;font-weight:600;text-align:right}
        .ad-side-body code{font-family:ui-monospace,monospace;color:#374151;background:#F3F4F6;padding:1px 8px;border-radius:5px;font-size:11.5px}
        .ad-link{color:#111;font-weight:700;text-decoration:none;padding:6px 12px;background:#fff;border:1px solid #D6B980;border-radius:99px;font-size:11.5px;text-align:center;margin-top:6px}
        .ad-link:hover{background:#EEDDB8}
      `}</style>
    </>
  );
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
