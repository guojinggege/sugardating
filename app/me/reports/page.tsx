// /me/reports · 举报中心 · 列表 + 统计 + 安全提示
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { listMyReports, countByStatus } from "@/lib/reports/repository";
import ReportSafetyNotice from "@/components/reports/ReportSafetyNotice";
import UserReportList from "@/components/reports/UserReportList";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "举报与安全中心 · Sugardating",
  description: "查看已提交的举报、补充材料,或报告线上及线下接触中遇到的问题。",
  robots: { index: false, follow: false },
};

export default function MyReportsPage() {
  const s = getSession();
  if (!s) redirect("/login?next=/me/reports");

  const reports = listMyReports(s.userId);
  const counts = countByStatus(s.userId);
  const all = reports.length;

  return (
    <div className="mr-page">
      <div className="mr-shell">
        <nav className="mr-crumb" aria-label="Breadcrumb">
          <Link href="/me">我的</Link>
          <span>/</span>
          <span>举报与安全中心</span>
        </nav>

        <header className="mr-h">
          <div>
            <div className="mr-eye">SAFETY & REPORTS</div>
            <h1>举报与安全中心</h1>
            <p>查看已提交的举报、补充材料,或报告线上及线下接触中遇到的问题。</p>
          </div>
          <Link href="/me/reports/new" className="mr-cta">+ 新建举报</Link>
        </header>

        <ReportSafetyNotice />

        <section className="mr-stats" aria-label="Report stats">
          <StatCard label="全部举报"   value={all} />
          <StatCard label="处理中"     value={counts.reviewing + counts.submitted} tone="review" />
          <StatCard label="等待补充"   value={counts.awaiting_evidence} tone="warn" />
          <StatCard label="已完成"     value={counts.resolved + counts.dismissed + counts.escalated} tone="ok" />
        </section>

        <section className="mr-list" aria-label="Reports">
          <div className="mr-list-h">
            <h2>我的举报记录</h2>
            <span>{all} 条</span>
          </div>
          <UserReportList reports={reports} />
        </section>

        <section className="mr-flow" aria-label="Process">
          <h3>处理流程</h3>
          <ol>
            <li><b>你提交举报</b> · 获得可分享的举报编号 · 例:SD-2026-000101</li>
            <li><b>安全团队初审</b> · 24 小时内评估紧急度</li>
            <li><b>沟通与补充</b> · 如需材料会在此页面回复,你可以直接补交</li>
            <li><b>处理完成</b> · 已回复 / 已处置对方账号 / 转合规团队 / 已驳回 (会说明原因)</li>
          </ol>
        </section>
      </div>

      <style>{`
        .mr-page{background:var(--page);min-height:100vh;padding:24px 0 60px}
        .mr-shell{max-width:960px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:20px}
        .mr-crumb{font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center}
        .mr-crumb a{color:var(--muted);text-decoration:none}
        .mr-crumb a:hover{color:var(--ink)}
        .mr-h{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}
        .mr-eye{font-size:11px;letter-spacing:.22em;color:#C5A56A;font-weight:800}
        .mr-h h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:38px;letter-spacing:-0.018em;color:var(--ink);margin:4px 0 6px}
        .mr-h p{font-size:13.5px;color:var(--muted);margin:0;max-width:56ch;line-height:1.65}
        .mr-cta{padding:10px 20px;background:var(--ink);color:#fff;border-radius:999px;font-size:13px;font-weight:800;text-decoration:none;white-space:nowrap;letter-spacing:-0.005em}
        .mr-cta:hover{background:#2b2822}
        .mr-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:640px){.mr-stats{grid-template-columns:repeat(2,1fr)}}
        .mr-list-h{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px;border-bottom:1px solid var(--line)}
        .mr-list-h h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;color:var(--ink);margin:0;font-weight:500;letter-spacing:-0.008em}
        .mr-list-h span{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
        .mr-list{display:flex;flex-direction:column;gap:12px}
        .mr-flow{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px 24px}
        .mr-flow h3{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:0 0 12px}
        .mr-flow ol{list-style:decimal;padding-left:22px;margin:0;display:flex;flex-direction:column;gap:6px;font-size:13.5px;line-height:1.7;color:#3d3a35}
        .mr-flow b{color:var(--ink);font-weight:800}
      `}</style>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: "review" | "warn" | "ok" }) {
  const border = tone === "review" ? "#C9D0DE" : tone === "warn" ? "#F5D073" : tone === "ok" ? "#BBF7D0" : "var(--line)";
  const color  = tone === "review" ? "#4B5E80" : tone === "warn" ? "#7A4C27" : tone === "ok" ? "#2B6249" : "#171512";
  return (
    <div className="stat">
      <div className="stat-n" style={{ color }}>{value}</div>
      <div className="stat-l">{label}</div>
      <style>{`
        .stat{background:#fff;border:1px solid ${border};border-radius:14px;padding:16px 18px}
        .stat-n{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;font-weight:600;line-height:1;letter-spacing:-0.01em}
        .stat-l{font-size:11.5px;color:var(--muted);margin-top:4px;letter-spacing:.04em}
      `}</style>
    </div>
  );
}
