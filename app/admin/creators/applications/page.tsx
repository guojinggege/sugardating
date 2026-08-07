// Admin · 入驻意向资料查看 · 只读 · 直接展开所有字段 · 不带审核流程
// 数据源:CreatorInterest (Neon) · 与 /apply 页面提交同一条记录
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { listInterests, healthCheck } from "@/lib/creator-interest/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications · Sugardating Admin" };

const CUR_LABEL: Record<string, string> = {
  student: "留学生",
  employed: "工作者",
  freelancer: "自由职业",
};

function fmtWhen(d: Date): string {
  return new Date(d).toLocaleString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

export default async function AdminApplicationsPage() {
  const health = await healthCheck();
  const rows = health.ok ? await listInterests() : [];

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

      <div className="ai-count">
        全部记录 <b>{rows.length}</b>
      </div>

      {health.ok && rows.length === 0 && (
        <div className="ai-empty">
          还没有 /apply 提交记录 · 前台意向表单成功提交后会在这里出现。
        </div>
      )}

      <div className="ai-list">
        {rows.map((r) => (
          <article key={r.id} className="ai-card">
            <header className="ai-card-h">
              <div className="ai-card-title">
                <span className="ai-avatar" aria-hidden>{(r.nickname[0] || "?").toUpperCase()}</span>
                <div>
                  <div className="ai-name">{r.nickname}</div>
                  <div className="ai-id">ID {r.id}</div>
                </div>
              </div>
              <time className="ai-when">{fmtWhen(r.createdAt)}</time>
            </header>

            <div className="ai-grid">
              <Field label="所在城市" value={r.city} />
              <Field label="当前状态" value={CUR_LABEL[r.status] || r.status} />
              <Field label="邮箱" value={r.email || "—"} mono selectable />
              <Field label="手机号" value={r.mobile || "—"} mono selectable />
              <Field label="联系电话" value={r.telephone || "—"} mono selectable />
              <Field label="页面语言" value={r.locale ? r.locale.toUpperCase() : "—"} />
              <Field label="提交来源" value={r.source || "—"} />
              <Field label="IP hash" value={r.ipHash || "—"} mono muted />
            </div>

            {r.userAgent && (
              <div className="ai-ua" title={r.userAgent}>
                <span className="ai-ua-k">User-Agent</span>
                <span className="ai-ua-v">{r.userAgent}</span>
              </div>
            )}
          </article>
        ))}
      </div>

      <style>{`
        .ai-count{margin:16px 0 12px;font-size:12.5px;color:#6B7280;font-weight:600}
        .ai-count b{font-size:14px;color:#111;font-variant-numeric:tabular-nums;margin-left:4px}

        .ai-warn{margin-bottom:16px;padding:12px 16px;border-radius:12px;background:#FEF2F2;border:1px solid #FECACA;color:#991B1B;font-size:13px;line-height:1.55}
        .ai-warn-msg{margin-top:4px;font-size:12.5px}
        .ai-warn-hint{margin-top:6px;font-size:12px;color:#7F1D1D}
        .ai-warn code{background:#fff;padding:1px 6px;border-radius:4px;font-size:11.5px}

        .ai-empty{padding:32px 20px;text-align:center;background:#fff;border:1px dashed #E5E7EB;border-radius:12px;color:#6B7280;font-size:13px}

        .ai-list{display:flex;flex-direction:column;gap:12px}
        .ai-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 18px;box-shadow:0 1px 2px rgba(15,23,42,.03)}
        .ai-card-h{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #F3F4F6}
        .ai-card-title{display:flex;align-items:center;gap:12px;min-width:0}
        .ai-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-weight:800;font-size:14px;display:grid;place-items:center;flex-shrink:0}
        .ai-name{font-size:14.5px;font-weight:800;color:#111;letter-spacing:-0.005em}
        .ai-id{font-size:11px;color:#9CA3AF;font-family:ui-monospace,SFMono-Regular,monospace;margin-top:1px}
        .ai-when{font-size:12px;color:#6B7280;font-variant-numeric:tabular-nums;flex-shrink:0;white-space:nowrap}

        .ai-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 20px}
        .ai-fld{display:flex;flex-direction:column;gap:2px;min-width:0}
        .ai-fld-k{font-size:11px;color:#9CA3AF;font-weight:600;letter-spacing:.02em}
        .ai-fld-v{font-size:13px;color:#111;font-weight:600;word-break:break-all;line-height:1.4}
        .ai-fld-v.mono{font-family:ui-monospace,SFMono-Regular,monospace;font-size:12.5px}
        .ai-fld-v.muted{color:#6B7280;font-weight:500}
        .ai-fld-v.selectable{user-select:all}

        .ai-ua{margin-top:12px;padding-top:10px;border-top:1px dashed #F3F4F6;display:flex;align-items:baseline;gap:10px;font-size:11px;color:#9CA3AF}
        .ai-ua-k{font-weight:700;letter-spacing:.02em;flex-shrink:0}
        .ai-ua-v{font-family:ui-monospace,SFMono-Regular,monospace;font-size:10.5px;line-height:1.5;color:#6B7280;
                 overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}

        /* 平板 · 2 列 */
        @media(max-width:1024px){
          .ai-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px}
        }
        /* 移动 · 1 列 · 头部竖排 */
        @media(max-width:640px){
          .ai-card{padding:14px 14px}
          .ai-card-h{flex-direction:column;align-items:flex-start;gap:6px}
          .ai-when{align-self:flex-start}
          .ai-grid{grid-template-columns:1fr;gap:10px 0}
          .ai-ua{flex-direction:column;gap:2px}
          .ai-ua-v{white-space:normal;word-break:break-all}
        }
      `}</style>
    </>
  );
}

interface FieldProps { label: string; value: string; mono?: boolean; muted?: boolean; selectable?: boolean; }
function Field({ label, value, mono, muted, selectable }: FieldProps) {
  const cls = ["ai-fld-v", mono ? "mono" : "", muted ? "muted" : "", selectable ? "selectable" : ""].filter(Boolean).join(" ");
  return (
    <div className="ai-fld">
      <span className="ai-fld-k">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}
