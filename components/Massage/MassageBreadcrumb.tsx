// Breadcrumb — 面包屑,mobile 显示返回 + 当前
import Link from "next/link";

export interface Crumb { href?: string; label: string }

export default function MassageBreadcrumb({ items }: { items: Crumb[] }) {
  const last = items[items.length - 1];
  return (
    <>
      <nav className="ms-crumb" aria-label="Breadcrumb">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="ms-crumb-item">
              {c.href && !isLast ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{c.label}</span>
              )}
              {!isLast && <span className="ms-crumb-sep">/</span>}
            </span>
          );
        })}
      </nav>
      <div className="ms-crumb-m">
        {items.length > 1 && items[items.length - 2].href && (
          <Link href={items[items.length - 2].href!}>← {items[items.length - 2].label}</Link>
        )}
        <span className="ms-crumb-current">{last.label}</span>
      </div>
      <style>{`
        .ms-crumb{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:#8a8a92}
        .ms-crumb-item{display:inline-flex;align-items:center;gap:6px}
        .ms-crumb-item a{color:#8a8a92;text-decoration:none}
        .ms-crumb-item a:hover{color:#161618}
        .ms-crumb-item span[aria-current]{color:#161618;font-weight:600}
        .ms-crumb-sep{color:#c0c0c8}
        .ms-crumb-m{display:none;font-size:13px;align-items:center;justify-content:space-between;gap:12px}
        .ms-crumb-m a{color:#8a8a92;text-decoration:none}
        .ms-crumb-current{font-weight:700;color:#161618}
        @media (max-width:640px){.ms-crumb{display:none}.ms-crumb-m{display:flex}}
      `}</style>
    </>
  );
}
