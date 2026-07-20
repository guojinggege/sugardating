// /me/reports/new · Wizard 入口
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import UserReportWizard from "@/components/reports/UserReportWizard";
import ReportSafetyNotice from "@/components/reports/ReportSafetyNotice";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "新建举报 · Sugardating",
  description: "6 步内提交完整的举报 · 支持元数据证据 · 隐私优先。",
  robots: { index: false, follow: false },
};

export default function NewReportPage() {
  const s = getSession();
  if (!s) redirect("/login?next=/me/reports/new");

  return (
    <div className="nr-page">
      <div className="nr-shell">
        <nav className="nr-crumb" aria-label="Breadcrumb">
          <Link href="/me">我的</Link>
          <span>/</span>
          <Link href="/me/reports">举报与安全中心</Link>
          <span>/</span>
          <span>新建举报</span>
        </nav>

        <ReportSafetyNotice />
        <UserReportWizard />
      </div>

      <style>{`
        .nr-page{background:var(--page);min-height:100vh;padding:24px 0 60px}
        .nr-shell{max-width:840px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:20px}
        .nr-crumb{font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .nr-crumb a{color:var(--muted);text-decoration:none}
        .nr-crumb a:hover{color:var(--ink)}
      `}</style>
    </div>
  );
}
