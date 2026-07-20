// Admin · 用户举报列表 · 支持状态筛选
import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminStatCard } from "@/components/admin/AdminPrimitives";
import { listAllReports } from "@/lib/reports/repository";
import type { ReportStatus } from "@/lib/reports/types";
import { getCategoryMeta } from "@/lib/reports/categories";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { title: "用户举报 · Sugardating Admin" };

const STATUS_LABEL: Record<ReportStatus, string> = {
  submitted: "已提交", reviewing: "处理中", awaiting_evidence: "等待补充",
  resolved: "已完成",  dismissed: "已驳回", escalated: "已上报",
};

const STATUS_TONES: Record<ReportStatus, string> = {
  submitted: "#77716A", reviewing: "#4B5E80", awaiting_evidence: "#B77945",
  resolved: "#42856B",  dismissed: "#a19a91", escalated: "#8C4B54",
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

interface Props { searchParams?: { status?: string } }

export default function AdminReportsPage({ searchParams }: Props) {
  const filter = searchParams?.status as ReportStatus | undefined;
  const all = listAllReports();
  const list = filter ? all.filter((r) => r.status === filter) : all;

  const byStatus = all.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <>
      <AdminPageHeader
        eyebrow="Safety"
        title="用户举报"
        description="用户提交的线上与线下举报 · 统一处理入口 · 支持公开回复、要求补充、驳回、上报"
      />

      <section className="db-grid db-grid-4" style={{ marginBottom: 20 }}>
        <AdminStatCard label="全部"         value={all.length} />
        <AdminStatCard label="待处理"       value={(byStatus.submitted || 0) + (byStatus.reviewing || 0)} />
        <AdminStatCard label="等待用户补充" value={byStatus.awaiting_evidence || 0} />
        <AdminStatCard label="已完成"       value={(byStatus.resolved || 0) + (byStatus.dismissed || 0)} />
      </section>

      <AdminCard title={filter ? `筛选:${STATUS_LABEL[filter]}` : "所有举报"}>
        <div className="ar-filter">
          <Link href="/admin/reports" className={"ar-chip" + (!filter ? " is-active" : "")}>全部</Link>
          {(["submitted", "reviewing", "awaiting_evidence", "resolved", "dismissed", "escalated"] as ReportStatus[]).map((s) => (
            <Link key={s} href={`/admin/reports?status=${s}`} className={"ar-chip" + (filter === s ? " is-active" : "")}>
              {STATUS_LABEL[s]} <em>{byStatus[s] || 0}</em>
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="ar-empty">当前筛选下没有举报</div>
        ) : (
          <table className="ar-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>标题</th>
                <th>场景 · 类型</th>
                <th>对象</th>
                <th>状态</th>
                <th>更新</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td><code>{r.publicRef}</code></td>
                  <td className="ar-t">{r.title}</td>
                  <td>{r.scene === "online" ? "线上" : "线下"} · {getCategoryMeta(r.category)?.label ?? r.category}</td>
                  <td>{r.target.label || r.target.type}</td>
                  <td><span className="ar-status" style={{ color: STATUS_TONES[r.status] }}>{STATUS_LABEL[r.status]}</span></td>
                  <td>{fmt(r.updatedAt)}</td>
                  <td><Link href={`/admin/reports/${r.id}`} className="ar-open">处理 →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      <style>{`
        .db-grid{display:grid;gap:12px}.db-grid-4{grid-template-columns:repeat(4,1fr)}
        @media(max-width:1024px){.db-grid-4{grid-template-columns:repeat(2,1fr)}}
        .ar-filter{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
        .ar-chip{padding:5px 12px;background:#F3F4F6;color:#374151;text-decoration:none;border-radius:99px;font-size:12px;font-weight:700}
        .ar-chip:hover{background:#E5E7EB}
        .ar-chip.is-active{background:#111;color:#EEDDB8}
        .ar-chip em{font-style:normal;color:#9CA3AF;margin-left:4px;font-weight:500}
        .ar-chip.is-active em{color:rgba(238,221,184,.7)}
        .ar-empty{padding:40px;text-align:center;color:#9CA3AF;font-size:13px}
        .ar-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
        .ar-table th{text-align:left;padding:8px 10px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;font-weight:700;border-bottom:1px solid #E5E7EB}
        .ar-table td{padding:12px 10px;border-bottom:1px solid #F3F4F6;color:#374151;vertical-align:top}
        .ar-table code{font-family:ui-monospace,monospace;font-size:11.5px;color:#374151;background:#F3F4F6;padding:2px 8px;border-radius:5px;font-weight:700}
        .ar-t{color:#111;font-weight:600;max-width:280px}
        .ar-status{font-weight:800;font-size:12px}
        .ar-open{color:#111;font-weight:700;text-decoration:none;padding:4px 10px;background:#fff;border:1px solid #D6B980;border-radius:99px;font-size:11.5px}
        .ar-open:hover{background:#EEDDB8}
      `}</style>
    </>
  );
}
