// Admin · 操作日志
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminPrimitives";
import { listAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit Log · Sugardating Admin" };

export default function AdminAuditLogPage() {
  const entries = listAudit(200);
  return (
    <>
      <AdminPageHeader
        eyebrow="System"
        title="操作日志"
        description="所有后台管理操作记录 · 最多显示最近 200 条"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Audit Log" }]}
      />

      <AdminTable
        rows={entries}
        emptyLabel="暂无操作日志"
        columns={[
          {
            key: "when", label: "时间", width: "160px", render: (r) => (
              <span style={{ fontSize: 11.5, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                {new Date(r.createdAt).toLocaleString("zh-CN", { hour12: false })}
              </span>
            ),
          },
          {
            key: "actor", label: "操作人", render: (r) => (
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>{r.actorEmail}</div>
                <div style={{ fontSize: 10.5, color: "#9CA3AF", fontFamily: "ui-monospace,monospace" }}>{r.actorId}</div>
              </div>
            ),
          },
          {
            key: "action", label: "动作", render: (r) => (
              <AdminBadge tone={
                r.action === "approve" ? "success"
                : r.action === "reject" || r.action === "delete" || r.action === "suspend" ? "danger"
                : r.action === "publish" ? "gold"
                : r.action === "update" || r.action === "settings.update" ? "info"
                : "default"
              }>{r.action}</AdminBadge>
            ),
          },
          { key: "target", label: "对象", render: (r) => <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12 }}>{r.targetType}{r.targetId ? `/${r.targetId}` : ""}</span> },
          { key: "summary", label: "摘要", render: (r) => <span style={{ fontSize: 13, color: "#374151" }}>{r.summary}</span> },
        ]}
      />
    </>
  );
}
