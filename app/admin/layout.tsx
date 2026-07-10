// Admin layout · server component
// 三态权限:
//   unauth      → redirect /login?next=... (登录后自动回跳)
//   forbidden   → 全屏 <AdminForbidden /> · 保留侧栏无关的 403 页
//   admin       → 正常 Sidebar + Topbar + main
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkAdminAccess } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/cms/repository";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminForbidden from "@/components/admin/AdminForbidden";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = checkAdminAccess();

  if (access.state === "unauth") {
    const pathname = headers().get("x-pathname") || "/admin";
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  if (access.state === "forbidden") {
    return <AdminForbidden email={access.email} name={access.name} />;
  }

  const admin = access.admin;
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-body">
        <AdminTopbar adminEmail={admin.email} isDemoMode={isDemoMode()} />
        <main className="admin-main">{children}</main>
      </div>
      <style>{`
        .admin-shell{display:flex;min-height:100vh;background:#FAFAF8;color:#111;font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui}
        .admin-body{flex:1;display:flex;flex-direction:column;min-width:0}
        .admin-main{flex:1;padding:28px 32px 60px;max-width:1400px;width:100%;margin:0 auto;box-sizing:border-box}
        @media (max-width:900px){
          .admin-shell{flex-direction:column}
          .admin-main{padding:20px 16px 40px}
        }
      `}</style>
    </div>
  );
}
