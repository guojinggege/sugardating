// Admin · 注册用户列表 · Prisma-backed
import Link from "next/link";
import { AdminPageHeader, AdminTable, AdminBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users · Sugardating Admin" };

interface Props { searchParams: { q?: string; role?: string; status?: string } }

export default async function AdminUsersPage({ searchParams }: Props) {
  const rows = await cmsRepo.listUsers({
    search: searchParams.q,
    role: searchParams.role,
    status: searchParams.status,
    limit: 200,
  });

  const allUsers = await cmsRepo.listUsers({ limit: 500 });
  const counts = {
    total: allUsers.length,
    today: allUsers.filter((u) => Date.now() - new Date(u.createdAt).getTime() < 86400_000).length,
    user: allUsers.filter((u) => u.role === "user").length,
    creator: allUsers.filter((u) => u.role === "creator").length,
    admin: allUsers.filter((u) => u.role === "admin").length,
    suspended: allUsers.filter((u) => u.status === "suspended" || u.status === "banned").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Users"
        title="注册用户"
        description="Neon Postgres 持久化用户 · 支持角色/状态筛选、关键字搜索、详情查看"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Users" }]}
      />

      <div className="us-stats">
        <div className="us-stat"><b>{counts.total}</b><span>总用户</span></div>
        <div className="us-stat"><b>{counts.today}</b><span>今日新增</span></div>
        <div className="us-stat"><b>{counts.user}</b><span>普通用户</span></div>
        <div className="us-stat"><b>{counts.creator}</b><span>Creator</span></div>
        <div className="us-stat"><b>{counts.admin}</b><span>Admin</span></div>
        <div className="us-stat"><b>{counts.suspended}</b><span>被禁</span></div>
      </div>

      <form className="us-filters" action="/admin/users">
        <input type="text" name="q" defaultValue={searchParams.q || ""} placeholder="搜索邮箱、姓名…" />
        <select name="role" defaultValue={searchParams.role || ""}>
          <option value="">全部角色</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <select name="status" defaultValue={searchParams.status || ""}>
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="suspended">已禁用</option>
          <option value="banned">已封禁</option>
        </select>
        <button type="submit">筛选</button>
        {(searchParams.q || searchParams.role || searchParams.status) && (
          <Link href="/admin/users" className="us-clear">清除</Link>
        )}
      </form>

      {rows.length === 0 ? (
        <AdminEmptyState
          icon="👥"
          title={searchParams.q ? "没有匹配的用户" : "暂无注册用户"}
          description={searchParams.q ? undefined : "让用户从前台 /register 注册,或在 CMS 设置里查看注册开关。"}
        />
      ) : (
        <AdminTable
          rows={rows}
          columns={[
            {
              key: "user", label: "用户", render: (r) => (
                <div>
                  <div style={{ fontWeight: 700, color: "#111", fontSize: 13.5 }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF", fontFamily: "ui-monospace,monospace" }}>{r.email}</div>
                </div>
              ),
            },
            {
              key: "role", label: "角色", render: (r) => (
                <AdminBadge tone={r.role === "admin" ? "gold" : r.role === "creator" ? "info" : "muted"}>
                  {r.role}
                </AdminBadge>
              ),
            },
            {
              key: "membership", label: "会员", render: (r) => (
                <AdminBadge tone={r.membership === "premium" || r.membership === "vip" ? "gold" : "muted"}>
                  {r.membership}
                </AdminBadge>
              ),
            },
            { key: "loc", label: "地区", render: (r) => <span>{r.city || r.country || "—"}</span> },
            {
              key: "wallet", label: "钱包", align: "right", render: (r) => (
                <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#B8A789" }}>
                  {r.walletBalance.toLocaleString("en-US")}
                </span>
              ),
            },
            {
              key: "status", label: "状态", render: (r) => (
                <AdminBadge tone={r.status === "active" ? "success" : r.status === "suspended" ? "warning" : "danger"}>
                  {r.status === "active" ? "正常" : r.status === "suspended" ? "已禁用" : "已封禁"}
                </AdminBadge>
              ),
            },
            {
              key: "when", label: "注册时间", render: (r) => (
                <span style={{ fontSize: 11.5, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                  {new Date(r.createdAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              ),
            },
            {
              key: "ops", label: "操作", align: "right", render: (r) => (
                <Link href={`/admin/users/${r.id}`} className="us-op">查看</Link>
              ),
            },
          ]}
        />
      )}

      <style>{`
        .us-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px}
        .us-stat{padding:14px 16px;background:#fff;border:1px solid #E5E7EB;border-radius:12px;display:flex;flex-direction:column;gap:2px}
        .us-stat b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;color:#111;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}
        .us-stat span{font-size:11px;color:#6B7280;letter-spacing:.08em;text-transform:uppercase;font-weight:600;margin-top:4px}
        .us-filters{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center;padding:12px;background:#fff;border:1px solid #E5E7EB;border-radius:12px}
        .us-filters input,.us-filters select{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:12.5px;color:#111;background:#FAFAF8;outline:none}
        .us-filters input{flex:1;min-width:200px}
        .us-filters input:focus,.us-filters select:focus{border-color:#D6B980;background:#fff}
        .us-filters button{padding:8px 14px;background:#111;color:#fff;border:0;border-radius:8px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
        .us-clear{padding:8px 10px;font-size:12px;color:#6B7280;text-decoration:none}
        .us-clear:hover{color:#111}
        .us-op{padding:5px 12px;background:#111;color:#EEDDB8;border-radius:99px;font-size:11.5px;font-weight:700;text-decoration:none}
        .us-op:hover{background:#000}
        @media (max-width:1024px){.us-stats{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:640px){.us-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </>
  );
}
