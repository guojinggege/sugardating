// Admin · 入驻意向资料查看 · 只读 · 直接展开所有字段 · 无审核 · 无 Creator Profile 生成
// 数据源:CreatorInterest (Neon) · 与 /apply 同一条记录
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { listInterests, healthCheck } from "@/lib/creator-interest/repository";
import AdminInterestsBoard from "@/components/admin/AdminInterestsBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications · Sugardating Admin" };

export default async function AdminApplicationsPage() {
  const health = await healthCheck();
  const rows = health.ok ? await listInterests() : [];

  // 序列化 Date → ISO · 传给 client 组件
  const serialized = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: (r.updatedAt ?? r.createdAt).toISOString(),
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Creators"
        title="入驻申请"
        description="查看通过 /apply 页面提交的全部入驻意向资料 · 数据源:CreatorInterest (Neon)"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Applications" }]}
      />

      {!health.ok && (
        <div className="ai-warn">
          <b>⚠ 数据库不可用 · {health.code}</b>
          <div className="ai-warn-msg">{health.message}</div>
          <div className="ai-warn-hint">
            在有 Neon <code>DIRECT_URL</code> 的环境执行 <code>npm run db:deploy</code>,然后重新部署。
          </div>
        </div>
      )}

      <AdminInterestsBoard rows={serialized as any} />

      <style>{`
        .ai-warn{margin-bottom:16px;padding:12px 16px;border-radius:12px;background:#FEF2F2;border:1px solid #FECACA;color:#991B1B;font-size:13px;line-height:1.55}
        .ai-warn-msg{margin-top:4px;font-size:12.5px}
        .ai-warn-hint{margin-top:6px;font-size:12px;color:#7F1D1D}
        .ai-warn code{background:#fff;padding:1px 6px;border-radius:4px;font-size:11.5px}
      `}</style>
    </>
  );
}
