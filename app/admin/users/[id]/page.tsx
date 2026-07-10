// Admin · 用户详情 · 基础资料 + 钱包 + 入驻申请 + 备注 + 关注/收藏/礼物/预约 (空态)
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import type { CmsUserDetail, CmsWalletTx, CmsUserNote } from "@/lib/cms/types";
import UserAdminActions from "@/components/admin/UserAdminActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const u = await cmsRepo.getUser(params.id);
  return { title: `${u?.name || u?.email || "User"} · Users · Admin` };
}

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const u: CmsUserDetail | null = await cmsRepo.getUser(params.id);
  if (!u) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Users"
        title={u.name || u.email}
        description={`ID: ${u.id}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users" },
          { label: u.name || u.email },
        ]}
      />

      {/* Header card */}
      <div className="ud-hero">
        <div className="ud-avatar">{(u.name || u.email)[0].toUpperCase()}</div>
        <div className="ud-hero-info">
          <div className="ud-hero-name">
            {u.name}
            <span>{u.email}</span>
          </div>
          <div className="ud-hero-badges">
            <AdminBadge tone={u.role === "admin" ? "gold" : u.role === "creator" ? "info" : "muted"}>{u.role}</AdminBadge>
            <AdminBadge tone={u.membership === "premium" || u.membership === "vip" ? "gold" : "muted"}>{u.membership}</AdminBadge>
            <AdminBadge tone={u.status === "active" ? "success" : u.status === "suspended" ? "warning" : "danger"}>
              {u.status === "active" ? "正常" : u.status === "suspended" ? "已禁用" : "已封禁"}
            </AdminBadge>
            <span className="ud-hero-when">注册于 {new Date(u.createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>
        <UserAdminActions
          userId={u.id}
          currentRole={u.role}
          currentStatus={u.status}
          currentBalance={u.walletBalance}
        />
      </div>

      <div className="ud-grid">
        <div className="ud-col">
          {/* 基础资料 */}
          <AdminCard title="基础资料">
            <dl className="ud-dl">
              <dt>邮箱</dt>            <dd>{u.email}</dd>
              <dt>手机</dt>            <dd>{u.phone || <em>未填写</em>}</dd>
              <dt>生日</dt>            <dd>{u.birthDate ? `${u.birthDate} · ${u.age ?? "?"} 岁` : <em>未填写</em>}</dd>
              <dt>性别</dt>            <dd>{u.gender || <em>未填写</em>}</dd>
              <dt>国家 / 城市</dt>     <dd>{[u.country, u.city].filter(Boolean).join(" · ") || <em>未填写</em>}</dd>
              <dt>语言</dt>            <dd>{u.languages?.join(" · ") || <em>未填写</em>}</dd>
              <dt>兴趣</dt>            <dd>
                {u.interests?.length ? (
                  <div className="ud-tags">{u.interests.map((t: string) => <span key={t}>{t}</span>)}</div>
                ) : <em>未填写</em>}
              </dd>
              <dt>简介</dt>            <dd>{u.bio || <em>未填写</em>}</dd>
              <dt>偏好城市</dt>        <dd>{u.preferredCities?.join(" · ") || <em>未填写</em>}</dd>
              <dt>约会偏好</dt>        <dd>{u.datingPreferences?.join(" · ") || <em>未填写</em>}</dd>
              <dt>预算区间</dt>        <dd>{u.budgetRange ? `S$ ${u.budgetRange[0]} - ${u.budgetRange[1]}` : <em>未填写</em>}</dd>
            </dl>
          </AdminCard>

          {/* Wallet */}
          <AdminCard title="Wallet · Credits">
            <div className="ud-wallet">
              <div className="ud-wallet-main">
                <div className="ud-wallet-label">当前余额</div>
                <div className="ud-wallet-amount">{u.walletBalance.toLocaleString("en-US")} <span>credits</span></div>
              </div>
              <div className="ud-wallet-side">
                <div><span>累计充值</span><b>+{u.walletTotalTopUp.toLocaleString("en-US")}</b></div>
                <div><span>累计消费</span><b>−{u.walletTotalSpend.toLocaleString("en-US")}</b></div>
              </div>
            </div>
            {u.walletTransactions.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="ud-mini-h">最近交易 · 最多 20 条</div>
                <ul className="ud-tx-list">
                  {u.walletTransactions.map((t) => (
                    <li key={t.id}>
                      <span className={"ud-tx-type ud-tx-type--" + t.type}>
                        {t.type === "top-up" ? "+ 充值" : t.type === "spend" ? "− 消费" : t.type === "refund" ? "退款" : "调整"}
                      </span>
                      <span className="ud-tx-amount">{t.type === "top-up" || t.type === "refund" ? "+" : "−"}{t.amount}</span>
                      <span className="ud-tx-memo">{t.memo || "—"}</span>
                      <time>{new Date(t.createdAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</time>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AdminCard>

          {/* Creator Application */}
          <AdminCard title="入驻申请关联">
            {u.creatorApplication ? (
              <div className="ud-app">
                <div>
                  <div className="ud-app-slug">@{u.creatorApplication.slug}</div>
                  <div className="ud-app-meta">
                    <AdminBadge tone={u.creatorApplication.status === "approved" ? "success" : "info"}>
                      {u.creatorApplication.status}
                    </AdminBadge>
                    {typeof u.creatorApplication.completion === "number" && (
                      <span>完成度 {u.creatorApplication.completion}%</span>
                    )}
                  </div>
                </div>
                <Link href="/admin/creators/applications" className="ud-app-link">查看申请列表 →</Link>
              </div>
            ) : (
              <div className="ud-empty">暂无入驻申请</div>
            )}
          </AdminCard>

          {/* Chats · 隐私摘要 */}
          <AdminCard title="聊天会话摘要">
            {u.chats.length > 0 ? (
              <ul className="ud-chats">
                {u.chats.map((c) => (
                  <li key={c.conversationId}>
                    <div>
                      <b>{c.creatorName}</b>
                      <span>@{c.creatorSlug}</span>
                    </div>
                    <div className="ud-chats-meta">
                      {c.unreadCount > 0 && <AdminBadge tone="warning">未读 {c.unreadCount}</AdminBadge>}
                      {c.reportCount > 0 && <AdminBadge tone="danger">举报 {c.reportCount}</AdminBadge>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="ud-empty">暂无会话记录 · 出于隐私考虑,后台仅展示举报上下文中的私聊全文</div>
            )}
          </AdminCard>
        </div>

        <div className="ud-col">
          {/* 会员 */}
          <AdminCard title="会员状态">
            <div className="ud-membership">
              <AdminBadge tone={u.membershipStatus.tier === "free" ? "muted" : "gold"}>
                {u.membershipStatus.tier}
              </AdminBadge>
              {u.membershipStatus.startedAt && <div className="ud-mini">开始:{u.membershipStatus.startedAt}</div>}
              {u.membershipStatus.expiresAt && <div className="ud-mini">到期:{u.membershipStatus.expiresAt}</div>}
              <div className="ud-mini">自动续费:{u.membershipStatus.autoRenew ? "是" : "否"}</div>
              <div className="ud-note-soon">Premium / VIP 系统待接入 · 当前显示 free 默认</div>
            </div>
          </AdminCard>

          {/* Following */}
          <AdminCard title="Following Creators">
            {u.following.length > 0 ? (
              <ul className="ud-list-mini">
                {u.following.map((f) => (
                  <li key={f.slug}>
                    <b>{f.name}</b>
                    <span>{f.type} · {f.city || "—"}</span>
                  </li>
                ))}
              </ul>
            ) : <div className="ud-empty">暂无关注 · Follow 系统待接入</div>}
          </AdminCard>

          {/* Saved */}
          <AdminCard title="Saved Items">
            {u.saved.length > 0 ? (
              <ul className="ud-list-mini">
                {u.saved.map((s) => (
                  <li key={s.id}>
                    <b>{s.title}</b>
                    <span>{s.type} · {new Date(s.savedAt).toLocaleDateString("zh-CN")}</span>
                  </li>
                ))}
              </ul>
            ) : <div className="ud-empty">暂无收藏 · Save 系统待接入</div>}
          </AdminCard>

          {/* Gifts */}
          <AdminCard title="打赏记录">
            {u.gifts.length > 0 ? (
              <ul className="ud-list-mini">
                {u.gifts.map((g) => (
                  <li key={g.id}>
                    <b>{g.giftType}</b>
                    <span>{g.creatorSlug} · {g.amount} credits</span>
                  </li>
                ))}
              </ul>
            ) : <div className="ud-empty">暂无打赏记录</div>}
          </AdminCard>

          {/* Bookings */}
          <AdminCard title="预约记录">
            {u.bookings.length > 0 ? (
              <ul className="ud-list-mini">
                {u.bookings.map((b) => (
                  <li key={b.id}>
                    <b>{b.serviceType}</b>
                    <span>{b.creatorSlug} · {b.date || "—"} · {b.status}</span>
                  </li>
                ))}
              </ul>
            ) : <div className="ud-empty">暂无预约记录</div>}
          </AdminCard>

          {/* Notes */}
          <AdminCard title="Admin Notes">
            <UserNotesPanel userId={u.id} notes={u.notes} />
          </AdminCard>

          {/* 安全 */}
          <AdminCard title="安全与风控">
            <div className="ud-safety">
              <div><span>被举报</span><b>{u.reportsAgainst}</b></div>
              <div><span>发起举报</span><b>{u.reportsBy}</b></div>
              {u.suspendedAt && (
                <div className="ud-safety-warn">
                  <b>封禁时间</b>
                  <span>{new Date(u.suspendedAt).toLocaleString("zh-CN")}</span>
                  {u.suspensionReason && <span>原因:{u.suspensionReason}</span>}
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <style>{`
        .ud-hero{display:grid;grid-template-columns:64px 1fr auto;gap:16px;align-items:center;padding:20px 24px;background:#fff;border:1px solid #E5E7EB;border-radius:16px;margin-bottom:16px}
        .ud-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800}
        .ud-hero-name{display:flex;flex-direction:column;gap:2px}
        .ud-hero-name{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:600;color:#111;letter-spacing:-0.005em}
        .ud-hero-name span{font-size:12px;color:#6B7280;font-family:ui-monospace,monospace;font-style:normal;font-weight:400}
        .ud-hero-badges{display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap}
        .ud-hero-when{font-size:11.5px;color:#9CA3AF;margin-left:auto}
        .ud-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:16px;align-items:flex-start}
        .ud-col{display:flex;flex-direction:column;gap:12px}
        .ud-dl{display:grid;grid-template-columns:100px 1fr;gap:8px 16px;margin:0;font-size:13px}
        .ud-dl dt{color:#6B7280;font-weight:600}
        .ud-dl dd{margin:0;color:#111}
        .ud-dl dd em{color:#9CA3AF;font-style:normal;font-size:12px}
        .ud-tags{display:flex;flex-wrap:wrap;gap:4px}
        .ud-tags span{padding:2px 8px;background:#F3F4F6;border-radius:99px;font-size:11px;color:#374151}
        .ud-wallet{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;background:linear-gradient(135deg,#FBFAF7,#F7F5F0);border-radius:12px;border:1px solid #EEE9DC}
        .ud-wallet-label{font-size:11px;color:#6B7280;letter-spacing:.14em;text-transform:uppercase;font-weight:700;margin-bottom:4px}
        .ud-wallet-amount{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:36px;color:#B8A789;font-weight:600;line-height:1;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
        .ud-wallet-amount span{font-size:12px;color:#9CA3AF;margin-left:4px;font-style:normal;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500}
        .ud-wallet-side{display:flex;flex-direction:column;gap:6px;justify-content:center}
        .ud-wallet-side > div{display:flex;justify-content:space-between;font-size:12.5px;color:#374151}
        .ud-wallet-side b{font-family:ui-monospace,monospace;font-weight:700;color:#111}
        .ud-mini-h{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700;margin-bottom:8px}
        .ud-tx-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .ud-tx-list li{display:grid;grid-template-columns:auto auto 1fr auto;gap:10px;align-items:center;padding:6px 10px;background:#FAFAF8;border-radius:8px;font-size:12px}
        .ud-tx-type{font-weight:700;padding:2px 8px;border-radius:99px;font-size:10.5px}
        .ud-tx-type--top-up{background:#DCFCE7;color:#166534}
        .ud-tx-type--spend{background:#FEE2E2;color:#B91C1C}
        .ud-tx-type--refund{background:#DBEAFE;color:#1E40AF}
        .ud-tx-type--admin-adjust{background:#FEF3C7;color:#92400E}
        .ud-tx-amount{font-family:ui-monospace,monospace;font-weight:700;color:#111}
        .ud-tx-memo{color:#6B7280}
        .ud-tx-list time{color:#9CA3AF;font-size:11px;font-family:ui-monospace,monospace}
        .ud-app{display:flex;justify-content:space-between;align-items:center;gap:12px}
        .ud-app-slug{font-family:ui-monospace,monospace;font-weight:700;font-size:14px;color:#111}
        .ud-app-meta{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:12.5px;color:#374151}
        .ud-app-link{padding:6px 12px;background:#111;color:#EEDDB8;border-radius:99px;font-size:12px;font-weight:700;text-decoration:none}
        .ud-empty{padding:14px;background:#FAFAF8;border-radius:8px;text-align:center;color:#9CA3AF;font-size:12.5px;font-style:italic}
        .ud-chats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .ud-chats li{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#FAFAF8;border-radius:8px;font-size:13px}
        .ud-chats li b{font-weight:700}
        .ud-chats li span{font-size:11px;color:#6B7280;margin-left:6px;font-family:ui-monospace,monospace}
        .ud-chats-meta{display:flex;gap:4px}
        .ud-membership{display:flex;flex-direction:column;gap:6px}
        .ud-mini{font-size:12px;color:#6B7280}
        .ud-note-soon{margin-top:8px;padding:8px 10px;background:#FEF3C7;color:#7C5A05;font-size:11px;border-radius:6px}
        .ud-list-mini{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .ud-list-mini li{display:flex;flex-direction:column;padding:8px 10px;background:#FAFAF8;border-radius:8px;font-size:12.5px}
        .ud-list-mini b{font-weight:700;color:#111}
        .ud-list-mini span{font-size:11px;color:#6B7280;margin-top:2px}
        .ud-safety{display:flex;flex-direction:column;gap:8px}
        .ud-safety > div:first-child,.ud-safety > div:nth-child(2){display:flex;justify-content:space-between;font-size:12.5px;color:#374151}
        .ud-safety b{font-family:ui-monospace,monospace;font-weight:700}
        .ud-safety-warn{padding:10px 12px;background:#FEE2E2;border-radius:8px;display:flex;flex-direction:column;gap:2px;color:#B91C1C;font-size:12px}
        @media (max-width:1024px){.ud-grid{grid-template-columns:1fr}}
        @media (max-width:640px){.ud-hero{grid-template-columns:64px 1fr;gap:12px}.ud-hero > :last-child{grid-column:1/-1}}
      `}</style>
    </>
  );
}

// UserNotesPanel — inline client subcomponent to avoid separate file
function UserNotesPanel({ userId, notes }: { userId: string; notes: any[] }) {
  return (
    <div>
      <UserNotesForm userId={userId} />
      {notes.length > 0 ? (
        <ul className="ud-notes-list">
          {notes.map((n) => (
            <li key={n.id}>
              <p>{n.text}</p>
              <div><b>{n.author}</b> · <time>{new Date(n.createdAt).toLocaleString("zh-CN", { hour12: false })}</time></div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ud-empty" style={{ marginTop: 8 }}>暂无备注</div>
      )}
      <style>{`
        .ud-notes-list{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
        .ud-notes-list li{padding:10px 12px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:8px;font-size:12.5px}
        .ud-notes-list p{margin:0 0 4px;color:#111;line-height:1.55}
        .ud-notes-list div{font-size:11px;color:#6B7280}
        .ud-notes-list b{color:#B8A789;font-weight:700}
      `}</style>
    </div>
  );
}

// Client form dropped inline · relies on client component
import UserNotesForm from "@/components/admin/UserNotesForm";
