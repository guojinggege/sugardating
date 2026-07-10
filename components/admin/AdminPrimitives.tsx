// Admin 通用视觉原子:PageHeader / Card / StatCard / Badge / EmptyState / Table row
import Link from "next/link";

// ══════════════════════════════════════
// Page Header
// ══════════════════════════════════════

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminPageHeader({ eyebrow, title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="ap-head">
      {breadcrumbs && (
        <nav className="ap-crumb" aria-label="Breadcrumb">
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              {b.href ? <Link href={b.href}>{b.label}</Link> : <span aria-current="page">{b.label}</span>}
              {i < breadcrumbs.length - 1 && <em>/</em>}
            </span>
          ))}
        </nav>
      )}
      <div className="ap-head-row">
        <div>
          {eyebrow && <div className="ap-eyebrow">{eyebrow}</div>}
          <h1 className="ap-title">{title}</h1>
          {description && <p className="ap-desc">{description}</p>}
        </div>
        {actions && <div className="ap-actions">{actions}</div>}
      </div>
      <style>{`
        .ap-head{margin-bottom:24px}
        .ap-crumb{display:flex;gap:6px;align-items:center;font-size:12px;color:#6B7280;margin-bottom:10px}
        .ap-crumb a{color:#6B7280;text-decoration:none}
        .ap-crumb a:hover{color:#111}
        .ap-crumb span[aria-current]{color:#111;font-weight:600}
        .ap-crumb em{color:#D1D5DB;font-style:normal}
        .ap-head-row{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
        .ap-eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#D6B980;font-weight:700;margin-bottom:6px}
        .ap-title{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#111;margin:0;letter-spacing:-0.01em;line-height:1.15}
        .ap-desc{font-size:14px;color:#6B7280;margin:6px 0 0;max-width:64ch;line-height:1.6}
        .ap-actions{display:flex;gap:8px;flex-wrap:wrap}
        @media (max-width:640px){.ap-title{font-size:24px}}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Card
// ══════════════════════════════════════

export function AdminCard({ children, title, footer, className }: { children: React.ReactNode; title?: string; footer?: React.ReactNode; className?: string }) {
  return (
    <div className={"ac " + (className || "")}>
      {title && <div className="ac-h">{title}</div>}
      <div className="ac-body">{children}</div>
      {footer && <div className="ac-foot">{footer}</div>}
      <style>{`
        .ac{background:#fff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden}
        .ac-h{padding:14px 20px;font-size:13px;font-weight:700;color:#111;border-bottom:1px solid #F3F4F6;letter-spacing:-0.005em}
        .ac-body{padding:18px 20px}
        .ac-foot{padding:12px 20px;background:#FAFAF8;border-top:1px solid #F3F4F6;font-size:12px;color:#6B7280}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Stat Card (dashboard)
// ══════════════════════════════════════

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: { value: string; positive?: boolean };
  hint?: string;
}

export function AdminStatCard({ label, value, delta, hint }: StatCardProps) {
  return (
    <div className="sc">
      <div className="sc-l">{label}</div>
      <div className="sc-v-row">
        <b>{typeof value === "number" ? value.toLocaleString("en-US") : value}</b>
        {delta && <span className={"sc-d " + (delta.positive === false ? "neg" : "pos")}>{delta.value}</span>}
      </div>
      {hint && <div className="sc-h">{hint}</div>}
      <style>{`
        .sc{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:6px;transition:border-color .12s,box-shadow .12s}
        .sc:hover{border-color:#D6B980;box-shadow:0 12px 28px -18px rgba(0,0,0,.1)}
        .sc-l{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700}
        .sc-v-row{display:flex;align-items:baseline;gap:10px}
        .sc-v-row b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#111;font-weight:600;letter-spacing:-0.01em;line-height:1;font-variant-numeric:tabular-nums}
        .sc-d{font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:99px}
        .sc-d.pos{background:#DCFCE7;color:#166534}
        .sc-d.neg{background:#FEE2E2;color:#B91C1C}
        .sc-h{font-size:11.5px;color:#9CA3AF;margin-top:2px}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Badge
// ══════════════════════════════════════

type BadgeTone = "default" | "success" | "warning" | "danger" | "info" | "gold" | "muted";

export function AdminBadge({ children, tone = "default" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={"ab ab-" + tone}>
      {children}
      <style>{`
        .ab{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:.04em;line-height:1.4;white-space:nowrap}
        .ab-default{background:#F3F4F6;color:#374151}
        .ab-success{background:#DCFCE7;color:#166534}
        .ab-warning{background:#FEF3C7;color:#92400E}
        .ab-danger{background:#FEE2E2;color:#B91C1C}
        .ab-info{background:#DBEAFE;color:#1E40AF}
        .ab-gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .ab-muted{background:transparent;color:#9CA3AF;border:1px solid #E5E7EB}
      `}</style>
    </span>
  );
}

// ══════════════════════════════════════
// Empty State
// ══════════════════════════════════════

export function AdminEmptyState({ icon = "🌿", title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="es">
      <div className="es-ic" aria-hidden>{icon}</div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div className="es-a">{action}</div>}
      <style>{`
        .es{padding:60px 24px;text-align:center;background:#fff;border:1px dashed #E5E7EB;border-radius:16px;color:#6B7280}
        .es-ic{font-size:36px;margin-bottom:12px}
        .es h4{font-size:15px;color:#111;font-weight:700;margin:0 0 6px}
        .es p{font-size:13.5px;margin:0;line-height:1.6}
        .es-a{margin-top:16px}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Table
// ══════════════════════════════════════

interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export function AdminTable<T>({ rows, columns, emptyLabel = "暂无数据" }: { rows: T[]; columns: Column<T>[]; emptyLabel?: string }) {
  return (
    <div className="at-wrap">
      <table className="at-tab">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="at-empty">{emptyLabel}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align }}>{c.render(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .at-wrap{background:#fff;border:1px solid #E5E7EB;border-radius:14px;overflow:hidden}
        .at-tab{width:100%;border-collapse:collapse;font-size:13.5px}
        .at-tab thead th{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700;text-align:left;padding:12px 16px;background:#FAFAF8;border-bottom:1px solid #E5E7EB}
        .at-tab tbody td{padding:14px 16px;border-bottom:1px solid #F3F4F6;color:#111;vertical-align:middle}
        .at-tab tbody tr:last-child td{border-bottom:0}
        .at-tab tbody tr:hover{background:#FAFAF8}
        .at-empty{text-align:center !important;padding:60px 16px !important;color:#9CA3AF !important;font-style:italic}
        @media (max-width:900px){.at-wrap{overflow-x:auto}}
      `}</style>
    </div>
  );
}
