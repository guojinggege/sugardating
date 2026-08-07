// Admin · 入驻申请审核 · list + approve/reject 快捷操作
import Link from "next/link";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import ApplicationActions from "@/components/admin/ApplicationActions";
import ApplicationDetailButton from "@/components/admin/ApplicationDetailButton";
import { healthCheck } from "@/lib/creator-interest/repository";
import type { ApplicationStatus } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications · Sugardating Admin" };

interface Props { searchParams: { status?: string } }

const STATUS_TONES: Record<ApplicationStatus, "default" | "info" | "warning" | "success" | "danger" | "muted"> = {
  draft: "muted", submitted: "info", reviewing: "warning",
  needs_changes: "warning", approved: "success", rejected: "danger",
};
const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "草稿", submitted: "已提交", reviewing: "审核中",
  needs_changes: "需补充", approved: "已通过", rejected: "已拒绝",
};

export default async function AdminApplicationsPage({ searchParams }: Props) {
  const status = searchParams.status as ApplicationStatus | undefined;
  // 先探测 DB 可用性 · 避免读失败页面直接崩
  const health = await healthCheck();
  const [rows, all] = health.ok
    ? await Promise.all([cmsRepo.listApplications(status), cmsRepo.listApplications()])
    : [[], []];
  const counts: Record<string, number> = { all: all.length };
  for (const a of all) counts[a.status] = (counts[a.status] || 0) + 1;

  // draft 意向不产生 · 意向阶段只有 submitted 起步
  const statusTabs: (ApplicationStatus | "all")[] = ["all", "submitted", "reviewing", "needs_changes", "approved", "rejected"];

  return (
    <>
      <AdminPageHeader
        eyebrow="Creators"
        title="入驻申请"
        description="审核 /apply 页面提交的入驻意向 · 数据源:CreatorInterest (Neon)"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Applications" }]}
      />

      {!health.ok && (
        <div style={{
          marginBottom: 16, padding: "12px 16px", borderRadius: 12,
          background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B",
          fontSize: 13, lineHeight: 1.55,
        }}>
          <b>⚠ 数据库不可用 · {health.code}</b>
          <div style={{ marginTop: 4, fontSize: 12.5 }}>
            {health.message}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#7F1D1D" }}>
            修复步骤:在有 Neon DIRECT_URL 的环境执行 <code style={{background:"#fff",padding:"1px 6px",borderRadius:4}}>npm run db:deploy</code>,然后重启 / 重新部署。
          </div>
        </div>
      )}

      {/* Status tabs */}
      <div className="ap-tabs">
        {statusTabs.map((s) => {
          const active = (status ?? "all") === s;
          const label = s === "all" ? "全部" : STATUS_LABELS[s];
          const count = s === "all" ? counts.all : (counts[s] || 0);
          const href = s === "all" ? "/admin/creators/applications" : `/admin/creators/applications?status=${s}`;
          return (
            <Link key={s} href={href} className={"ap-tab" + (active ? " is-active" : "")}>
              {label} <span>{count}</span>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <AdminTable
          rows={rows}
          emptyLabel="没有匹配的申请"
          columns={[
            {
              key: "applicant", label: "申请人", render: (r) => (
                <div>
                  <div style={{ fontWeight: 700, color: "#111", fontSize: 13.5 }}>{r.applicantName}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{r.applicantEmail}</div>
                </div>
              ),
            },
            {
              key: "type", label: "Type", render: (r) => (
                <AdminBadge tone={r.type === "sugargirl" ? "info" : r.type === "sugarboy" ? "gold" : "default"}>
                  {r.type === "sugargirl" ? "Sugargirl" : r.type === "sugarboy" ? "Sugarboy" : "Massage"}
                </AdminBadge>
              ),
            },
            { key: "loc", label: "地区", render: (r) => <span>{[r.city, r.country].filter(Boolean).join(" · ") || "—"}</span> },
            { key: "lang", label: "语言", render: (r) => <span style={{ fontSize: 12, color: "#6B7280" }}>{r.languages.slice(0, 2).join(" · ")}</span> },
            {
              key: "prog", label: "完成度", render: (r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}>
                  <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden", minWidth: 60 }}>
                    <div style={{ height: "100%", width: `${r.completion}%`, background: r.completion >= 90 ? "#16A34A" : r.completion >= 60 ? "#D6B980" : "#9CA3AF" }} />
                  </div>
                  <b style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: "#374151", minWidth: 32, textAlign: "right" }}>{r.completion}%</b>
                </div>
              ),
            },
            { key: "media", label: "媒体", align: "right", render: (r) => <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.mediaCount}</span> },
            { key: "status", label: "状态", render: (r) => <AdminBadge tone={STATUS_TONES[r.status]}>{STATUS_LABELS[r.status]}</AdminBadge> },
            {
              key: "when", label: "提交时间", render: (r) => (
                <span style={{ fontSize: 11.5, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                  {r.submittedAt ? new Date(r.submittedAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              ),
            },
            { key: "ops", label: "操作", align: "right", render: (r) => (
              <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <ApplicationDetailButton id={r.id} />
                <ApplicationActions id={r.id} status={r.status} />
              </div>
            ) },
          ]}
        />
      </div>

      <style>{`
        .ap-tabs{display:flex;gap:4px;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:3px;overflow-x:auto;scrollbar-width:none}
        .ap-tabs::-webkit-scrollbar{display:none}
        .ap-tab{padding:8px 14px;font-size:12.5px;color:#374151;text-decoration:none;border-radius:8px;font-weight:600;transition:background .12s;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
        .ap-tab:hover{background:#F7F5F0}
        .ap-tab.is-active{background:#111;color:#EEDDB8}
        .ap-tab span{font-size:10.5px;padding:2px 6px;background:rgba(255,255,255,.15);border-radius:99px;font-variant-numeric:tabular-nums}
        .ap-tab:not(.is-active) span{background:#F3F4F6;color:#6B7280}
      `}</style>
    </>
  );
}
