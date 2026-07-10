// Admin Dashboard · 总览 + 待处理 + 快捷入口 + 最近活动
import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminStatCard, AdminBadge } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import { listAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard · Sugardating Admin" };

export default function AdminDashboardPage() {
  const m = cmsRepo.getDashboardMetrics();
  const audit = listAudit(6);

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="今日运营数据 · 平台概览 · 待处理任务 · 最近活动"
      />

      {/* Today */}
      <section style={{ marginBottom: 28 }}>
        <h3 className="db-h">今日数据</h3>
        <div className="db-grid db-grid-4">
          <AdminStatCard label="新用户"          value={m.today.newUsers}         delta={{ value: "+12%", positive: true }} />
          <AdminStatCard label="新入驻申请"      value={m.today.newApplications}  delta={{ value: "+2",   positive: true }} />
          <AdminStatCard label="新增 Creator"    value={m.today.newCreators} />
          <AdminStatCard label="新增聊天会话"    value={m.today.newChats}         delta={{ value: "+34",  positive: true }} />
          <AdminStatCard label="Credits 消费"    value={m.today.creditsSpent}     hint="今日 spend" />
          <AdminStatCard label="新增举报"        value={m.today.newReports}       delta={{ value: "+1",   positive: false }} />
          <AdminStatCard label="待审核媒体"      value={m.today.pendingMedia}     hint="等待处理" />
        </div>
      </section>

      {/* Overview */}
      <section style={{ marginBottom: 28 }}>
        <h3 className="db-h">运营概览</h3>
        <div className="db-grid db-grid-4">
          <AdminStatCard label="Sugargirls"          value={m.overview.sugargirls} />
          <AdminStatCard label="Sugarboys"           value={m.overview.sugarboys} />
          <AdminStatCard label="Massage Providers"   value={m.overview.massageProviders} />
          <AdminStatCard label="Journal 文章"         value={m.overview.journalPosts} />
          <AdminStatCard label="City / Area 页数"     value={m.overview.cityPages} />
          <AdminStatCard label="Premium 会员"          value={m.overview.premiumMembers} />
          <AdminStatCard label="Credits 交易"          value={m.overview.creditsTransactions} />
        </div>
      </section>

      <div className="db-2col">
        {/* Pending tasks */}
        <AdminCard title="待处理任务">
          <ul className="db-tasks">
            <li>
              <div><b>{m.pending.applications}</b> · 入驻申请待审核</div>
              <Link href="/admin/creators/applications" className="db-link">处理 →</Link>
            </li>
            <li>
              <div><b>{m.pending.media}</b> · 媒体待审核</div>
              <Link href="/admin/media?status=pending" className="db-link">处理 →</Link>
            </li>
            <li>
              <div><b>{m.pending.reports}</b> · 用户举报待处理</div>
              <span className="db-soon">Soon</span>
            </li>
            <li>
              <div><b>{m.pending.missingTranslations}</b> · 翻译文案缺失</div>
              <span className="db-soon">Soon</span>
            </li>
            <li>
              <div><b>{m.pending.missingMetadata}</b> · SEO metadata 缺失</div>
              <span className="db-soon">Soon</span>
            </li>
          </ul>
        </AdminCard>

        {/* Quick actions */}
        <AdminCard title="快捷入口">
          <div className="db-quick">
            <Link href="/admin/journal/posts" className="db-quick-a">
              <span>✍️</span>
              <b>新建 Journal 文章</b>
              <em>发布高端社交指南</em>
            </Link>
            <Link href="/admin/creators" className="db-quick-a">
              <span>👥</span>
              <b>管理 Creator 资料</b>
              <em>Sugargirl · Sugarboy · Massage</em>
            </Link>
            <Link href="/admin/creators/applications" className="db-quick-a">
              <span>📋</span>
              <b>审核入驻申请</b>
              <em>{m.pending.applications} 待处理</em>
            </Link>
            <Link href="/admin/media" className="db-quick-a">
              <span>🖼️</span>
              <b>上传媒体</b>
              <em>图片 · 视频 · 付费内容</em>
            </Link>
            <Link href="/admin/custom-services/requests" className="db-quick-a">
              <span>💎</span>
              <b>定制服务需求</b>
              <em>高端活动匹配</em>
            </Link>
            <Link href="/admin/settings" className="db-quick-a">
              <span>⚙️</span>
              <b>站点设置</b>
              <em>Feature flags · 语言</em>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Recent activity */}
      <div style={{ marginTop: 20 }}>
        <AdminCard title="最近活动">
          <ul className="db-audit">
            {audit.map((a) => (
              <li key={a.id}>
                <AdminBadge tone={
                  a.action === "approve" ? "success"
                  : a.action === "reject" ? "danger"
                  : a.action === "publish" ? "gold"
                  : "info"
                }>{a.action}</AdminBadge>
                <span className="db-audit-txt">{a.summary}</span>
                <time>{new Date(a.createdAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</time>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <style>{`
        .db-h{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#6B7280;font-weight:700;margin:0 0 12px}
        .db-grid{display:grid;gap:12px}
        .db-grid-4{grid-template-columns:repeat(4,1fr)}
        .db-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .db-tasks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
        .db-tasks li{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#FAFAF8;border-radius:10px;font-size:13.5px;color:#374151}
        .db-tasks li b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;color:#D6B980;font-size:18px;font-weight:600;margin-right:6px}
        .db-link{color:#111;font-size:12px;font-weight:700;text-decoration:none;padding:5px 10px;border-radius:99px;background:#fff;border:1px solid #E5E7EB}
        .db-link:hover{border-color:#D6B980}
        .db-soon{font-size:10.5px;color:#9CA3AF;letter-spacing:.06em;text-transform:uppercase;font-weight:700;background:#F3F4F6;padding:3px 8px;border-radius:99px}
        .db-quick{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .db-quick-a{display:flex;flex-direction:column;padding:14px 16px;background:#FAFAF8;border:1px solid transparent;border-radius:10px;text-decoration:none;color:#111;transition:border-color .12s,background .12s}
        .db-quick-a:hover{border-color:#D6B980;background:#fff}
        .db-quick-a span{font-size:22px;margin-bottom:6px;line-height:1}
        .db-quick-a b{font-size:13px;font-weight:700;color:#111;letter-spacing:-0.005em}
        .db-quick-a em{font-size:11.5px;font-style:normal;color:#6B7280;margin-top:2px}
        .db-audit{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .db-audit li{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F3F4F6;font-size:13px}
        .db-audit li:last-child{border-bottom:0}
        .db-audit-txt{flex:1;color:#111}
        .db-audit time{color:#9CA3AF;font-size:11.5px;font-variant-numeric:tabular-nums}
        @media (max-width:1024px){.db-grid-4{grid-template-columns:repeat(2,1fr)}.db-2col{grid-template-columns:1fr}.db-quick{grid-template-columns:1fr}}
        @media (max-width:640px){.db-grid-4{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}
