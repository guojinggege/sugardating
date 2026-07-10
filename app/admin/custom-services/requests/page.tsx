// Admin · 定制服务需求 · 从 custom-request-store 读取
import { AdminPageHeader, AdminTable, AdminBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Custom Requests · Sugardating Admin" };

const EVENT_LABEL: Record<string, string> = {
  "yacht": "游艇派对", "cocktail": "高端酒会", "photoshoot": "私人拍摄",
  "business": "商务伴游", "members-club": "会员俱乐部之夜",
};

export default function AdminCustomRequestsPage() {
  const rows = cmsRepo.listCustomRequests();

  return (
    <>
      <AdminPageHeader
        eyebrow="Channels"
        title="定制服务需求"
        description="用户提交的高端活动定制需求 · 分配运营 · 推荐合适 sugargirl"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Custom Services" }]}
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          icon="💎"
          title="暂无用户需求"
          description="当前尚未收到任何定制服务提交。前台用户在 /art-services 提交需求后会在此显示。"
        />
      ) : (
        <AdminTable
          rows={rows}
          columns={[
            {
              key: "app", label: "申请人", render: (r) => (
                <div>
                  <div style={{ fontWeight: 700, color: "#111", fontSize: 13.5 }}>{r.applicantName}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{r.applicantEmail}</div>
                </div>
              ),
            },
            {
              key: "type", label: "活动", render: (r) => (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {r.eventTypes.slice(0, 2).map((t) => (
                    <AdminBadge key={t} tone="gold">{EVENT_LABEL[t] || t}</AdminBadge>
                  ))}
                  {r.eventTypes.length > 2 && <AdminBadge tone="muted">+{r.eventTypes.length - 2}</AdminBadge>}
                </div>
              ),
            },
            { key: "city", label: "城市", render: (r) => <span>{r.city || "—"}</span> },
            {
              key: "date", label: "日期", render: (r) => (
                <span style={{ fontSize: 12, color: "#374151", fontVariantNumeric: "tabular-nums" }}>
                  {r.date || "—"}
                </span>
              ),
            },
            {
              key: "budget", label: "预算", render: (r) => (
                <AdminBadge tone={r.budgetRange && r.budgetRange !== "custom" ? "info" : "muted"}>
                  {r.budgetRange ? (r.budgetRange === "custom" ? "自定义" : `S$ ${r.budgetRange}+`) : "—"}
                </AdminBadge>
              ),
            },
            { key: "status", label: "状态", render: (r) => <AdminBadge tone="info">{r.status}</AdminBadge> },
            {
              key: "when", label: "提交", render: (r) => (
                <span style={{ fontSize: 11.5, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                  {new Date(r.createdAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
